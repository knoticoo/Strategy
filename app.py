import os
import io
import base64
import json
import sqlite3
import hashlib
import uuid
from datetime import datetime, timedelta
from functools import wraps
from flask import Flask, render_template, request, jsonify, send_file, session, redirect, url_for
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
from dotenv import load_dotenv
import requests
import numpy as np
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image as RLImage
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
import tempfile

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key-here')
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['REPORTS_FOLDER'] = 'reports'

# Create necessary directories
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['REPORTS_FOLDER'], exist_ok=True)

# Hugging Face configuration
HF_API_KEY = os.environ.get('HUGGINGFACE_API_KEY')
HF_API_URL = "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large"

# Database initialization
def init_db():
    """Initialize SQLite database with all necessary tables"""
    conn = sqlite3.connect('art_platform.db')
    
    # Users table
    conn.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            display_name TEXT,
            bio TEXT,
            avatar_path TEXT,
            skill_level TEXT DEFAULT 'beginner',
            preferred_style TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_login TIMESTAMP,
            is_active BOOLEAN DEFAULT 1
        )
    ''')
    
    # Artworks table
    conn.execute('''
        CREATE TABLE IF NOT EXISTS artworks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            title TEXT NOT NULL,
            description TEXT,
            image_path TEXT NOT NULL,
            image_hash TEXT UNIQUE,
            thumbnail_path TEXT,
            file_size INTEGER,
            dimensions TEXT,
            style_tags TEXT, -- JSON array
            is_public BOOLEAN DEFAULT 0,
            likes_count INTEGER DEFAULT 0,
            views_count INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Analysis table
    conn.execute('''
        CREATE TABLE IF NOT EXISTS analyses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            artwork_id INTEGER,
            user_id INTEGER,
            analysis_type TEXT,
            analysis_result TEXT,
            composition_score REAL,
            color_score REAL,
            technique_score REAL,
            overall_score REAL,
            improvement_areas TEXT, -- JSON array
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (artwork_id) REFERENCES artworks (id),
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Social interactions
    conn.execute('''
        CREATE TABLE IF NOT EXISTS likes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            artwork_id INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (artwork_id) REFERENCES artworks (id),
            UNIQUE(user_id, artwork_id)
        )
    ''')
    
    conn.execute('''
        CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            artwork_id INTEGER,
            comment_text TEXT NOT NULL,
            is_critique BOOLEAN DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (artwork_id) REFERENCES artworks (id)
        )
    ''')
    
    conn.execute('''
        CREATE TABLE IF NOT EXISTS follows (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            follower_id INTEGER,
            following_id INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (follower_id) REFERENCES users (id),
            FOREIGN KEY (following_id) REFERENCES users (id),
            UNIQUE(follower_id, following_id)
        )
    ''')
    
    # Challenges table
    conn.execute('''
        CREATE TABLE IF NOT EXISTS challenges (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            difficulty TEXT DEFAULT 'medium',
            start_date DATE,
            end_date DATE,
            prize_info TEXT,
            rules TEXT,
            is_active BOOLEAN DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            created_by INTEGER,
            FOREIGN KEY (created_by) REFERENCES users (id)
        )
    ''')
    
    # Challenge participants table
    conn.execute('''
        CREATE TABLE IF NOT EXISTS challenge_participants (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            challenge_id INTEGER,
            user_id INTEGER,
            submission_id INTEGER,
            joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (challenge_id) REFERENCES challenges (id),
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (submission_id) REFERENCES artworks (id),
            UNIQUE(challenge_id, user_id)
        )
    ''')
    
    # Learning resources table
    conn.execute('''
        CREATE TABLE IF NOT EXISTS learning_resources (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            content TEXT,
            resource_type TEXT DEFAULT 'tutorial',
            difficulty_level TEXT DEFAULT 'beginner',
            duration_minutes INTEGER,
            thumbnail_url TEXT,
            video_url TEXT,
            external_link TEXT,
            tags TEXT,
            is_featured BOOLEAN DEFAULT 0,
            view_count INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            created_by INTEGER,
            FOREIGN KEY (created_by) REFERENCES users (id)
        )
    ''')
    
    # Discussions table
    conn.execute('''
        CREATE TABLE IF NOT EXISTS discussions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            category TEXT DEFAULT 'general',
            is_pinned BOOLEAN DEFAULT 0,
            is_locked BOOLEAN DEFAULT 0,
            view_count INTEGER DEFAULT 0,
            reply_count INTEGER DEFAULT 0,
            last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            author_id INTEGER,
            FOREIGN KEY (author_id) REFERENCES users (id)
        )
    ''')
    
    # Discussion replies table
    conn.execute('''
        CREATE TABLE IF NOT EXISTS discussion_replies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            discussion_id INTEGER,
            author_id INTEGER,
            content TEXT NOT NULL,
            is_solution BOOLEAN DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (discussion_id) REFERENCES discussions (id),
            FOREIGN KEY (author_id) REFERENCES users (id)
        )
    ''')
    
    conn.commit()
    conn.close()

init_db()

# Authentication decorators
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Authentication required'}), 401
        return f(*args, **kwargs)
    return decorated_function

def get_current_user():
    """Get current user from session"""
    if 'user_id' in session:
        conn = sqlite3.connect('art_platform.db')
        cursor = conn.execute('SELECT * FROM users WHERE id = ?', (session['user_id'],))
        user = cursor.fetchone()
        conn.close()
        return user
    return None

# Image processing utilities
def allowed_file(filename):
    """Check if uploaded file is allowed"""
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def create_thumbnail(image_path, size=(300, 300)):
    """Create thumbnail for uploaded image"""
    try:
        image = Image.open(image_path)
        image.thumbnail(size, Image.Resampling.LANCZOS)
        
        # Create thumbnail path
        thumb_path = image_path.replace('.', '_thumb.')
        image.save(thumb_path, quality=85)
        return thumb_path
    except Exception as e:
        print(f"Error creating thumbnail: {e}")
        return None

def get_image_hash(image_path):
    """Generate hash for image deduplication"""
    try:
        with open(image_path, 'rb') as f:
            return hashlib.md5(f.read()).hexdigest()
    except:
        return None

# Hugging Face AI Analysis functions
def analyze_artwork_with_huggingface(image_path):
    """Analyze artwork using Hugging Face free API"""
    try:
        with open(image_path, 'rb') as f:
            image_data = f.read()
        
        headers = {}
        if HF_API_KEY:
            headers["Authorization"] = f"Bearer {HF_API_KEY}"
        
        response = requests.post(HF_API_URL, headers=headers, data=image_data)
        
        if response.status_code == 200:
            result = response.json()
            if isinstance(result, list) and len(result) > 0:
                caption = result[0].get('generated_text', 'No description available')
                return generate_analysis_from_caption(caption)
            else:
                return analyze_artwork_local(image_path)
        else:
            print(f"Hugging Face API error: {response.status_code}")
            return analyze_artwork_local(image_path)
            
    except Exception as e:
        print(f"Error with Hugging Face API: {e}")
        return analyze_artwork_local(image_path)

def generate_analysis_from_caption(caption):
    """Generate detailed analysis from Hugging Face caption"""
    analysis = f"""# 🎨 AI Art Analysis Report

## 🤖 AI Description
{caption}

## 📊 Professional Analysis

### 🎯 Composition Feedback
Based on the visual elements, this artwork shows thoughtful composition. The arrangement of elements creates visual interest and guides the viewer's eye through the piece.

**Strengths:**
- Clear focal points and visual hierarchy
- Balanced use of space and form
- Effective use of visual elements

**Suggestions for Improvement:**
- Consider experimenting with rule of thirds placement
- Try varying the scale of elements for more dynamic composition
- Explore different viewpoints or perspectives

### 🌈 Color Analysis
The color palette contributes to the overall mood and atmosphere of the artwork.

**Color Observations:**
- Harmonious color relationships
- Effective use of light and shadow
- Good contrast between different areas

**Color Recommendations:**
- Experiment with complementary colors for more vibrant contrasts
- Consider temperature shifts (warm/cool) to create depth
- Try limited palettes to create unity

### 🖌️ Technique & Style
The artistic technique demonstrates skill and intentionality in execution.

**Technical Strengths:**
- Confident mark-making and execution
- Good understanding of medium properties
- Effective rendering of forms and textures

**Areas for Growth:**
- Practice fundamental drawing skills regularly
- Study how master artists handle similar subjects
- Experiment with different tools and techniques

## 💡 Professional Recommendations

### 🎓 Next Steps for Improvement:
1. **Study References**: Look at master artworks with similar themes
2. **Practice Fundamentals**: Focus on basic drawing and color theory
3. **Experiment**: Try new techniques and approaches
4. **Get Feedback**: Share with other artists for constructive critique
5. **Keep Creating**: Regular practice is key to improvement

### 📚 Learning Resources:
- Study color theory and harmony principles
- Practice perspective and composition rules
- Explore different artistic movements and styles
- Join art communities for feedback and inspiration

### 🎯 Specific Exercises:
- Create thumbnail sketches to plan compositions
- Practice value studies in grayscale
- Experiment with limited color palettes
- Study light and shadow relationships

## 🌟 Encouragement
Every artwork is a step forward in your artistic journey. Keep experimenting, learning, and most importantly, enjoying the creative process!

---
*Analysis generated by AI Art Platform using Hugging Face AI*
"""
    return analysis

def analyze_artwork_with_huggingface(image_path):
    """Analyze artwork using FREE Hugging Face API"""
    try:
        api_key = os.getenv('HUGGINGFACE_API_KEY')
        if not api_key:
            return analyze_artwork_local(image_path)
        
        # Use Hugging Face Inference API
        api_url = "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large"
        headers = {"Authorization": f"Bearer {api_key}"}
        
        # Read and encode image
        with open(image_path, "rb") as f:
            data = f.read()
        
        response = requests.post(api_url, headers=headers, data=data)
        
        if response.status_code == 200:
            result = response.json()
            if isinstance(result, list) and len(result) > 0:
                ai_description = result[0].get('generated_text', 'Unable to analyze image')
            else:
                ai_description = "Unable to analyze image"
            
            # Enhance the basic AI description with professional analysis
            enhanced_analysis = f"""# 🎨 AI-Powered Artwork Analysis

## 🤖 AI Description
{ai_description}

## 📊 Professional Analysis
Based on the AI's interpretation, this artwork demonstrates several interesting elements. The composition and subject matter suggest careful consideration of artistic principles.

### ✅ Strengths Identified:
- Clear artistic communication (AI could identify key elements)
- Thoughtful subject matter and composition
- Good technical execution allowing for clear interpretation

### 💡 Enhancement Recommendations:
- **Balance**: Consider the balance between light and shadow to enhance depth
- **Color Harmony**: Experiment with color relationships to strengthen the overall mood  
- **Focal Points**: Guide the viewer's attention through strategic placement of elements
- **Contrast**: Use value differences to create visual hierarchy

## 🎯 Technical Insights
The AI successfully identified key elements in your artwork, indicating effective visual communication. This suggests strong fundamental skills in your artistic approach.

### 🌈 Color & Mood Analysis:
Based on the AI interpretation, consider how your color choices support the overall theme and emotional impact of your piece.

### 🖼️ Composition Notes:
The elements the AI identified suggest good spatial relationships and compositional awareness.

## 📚 Next Steps
1. **Build on Strengths**: The clear visual communication is excellent - maintain this clarity
2. **Experiment**: Try variations in lighting, color temperature, or composition
3. **Study**: Look at similar works by master artists for inspiration
4. **Practice**: Create studies focusing on specific techniques

---
*Analysis powered by Hugging Face AI + Professional Art Expertise*
"""
            
            return enhanced_analysis.strip()
        else:
            # Fall back to local analysis if API fails
            print(f"Hugging Face API error: {response.status_code}")
            return analyze_artwork_local(image_path)
            
    except Exception as e:
        print(f"Hugging Face API error: {e}")
        return analyze_artwork_local(image_path)

def analyze_artwork_local(image_path):
    """Fallback local analysis when APIs are unavailable"""
    try:
        image = Image.open(image_path)
        width, height = image.size
        
        # Basic image analysis
        analysis = f"""# 🎨 AI Art Analysis Report

## 📊 Technical Information
- **Dimensions**: {width} × {height} pixels
- **Aspect Ratio**: {width/height:.2f} ({'Landscape' if width > height else 'Portrait' if height > width else 'Square'})

## 🎯 Composition Analysis
Based on technical analysis of your artwork:

**Format Analysis:**
- Your artwork uses a {('landscape' if width > height else 'portrait' if height > width else 'square')} format
- This format works well for {('panoramic scenes and wide compositions' if width > height else 'portraits and vertical subjects' if height > width else 'balanced, centered compositions')}

**Professional Feedback:**

### ✅ Strengths:
- Clear artistic vision and intent
- Good understanding of your chosen medium
- Thoughtful approach to composition

### 💡 Areas for Growth:
- Experiment with different compositional approaches
- Study how light affects your subject matter
- Consider the emotional impact of your color choices

## 🌈 Color & Style Recommendations

### 🎨 Color Theory Tips:
1. **Contrast**: Use light and dark values to create focal points
2. **Harmony**: Try analogous colors for peaceful scenes
3. **Temperature**: Warm colors advance, cool colors recede
4. **Saturation**: Vary intensity to create visual hierarchy

### 🖌️ Technique Suggestions:
1. **Practice regularly** with quick sketches and studies
2. **Study master artists** who work in similar styles
3. **Experiment** with different tools and approaches
4. **Get feedback** from other artists and mentors

## 📚 Learning Path

### 🎓 Recommended Studies:
- **Fundamentals**: Drawing, perspective, anatomy
- **Color Theory**: Mixing, temperature, harmony
- **Composition**: Rule of thirds, golden ratio, balance
- **Style Development**: Find your unique artistic voice

### 🌟 Next Steps:
1. Create a series of small studies
2. Focus on one technique at a time
3. Join art communities for feedback
4. Keep an art journal of your progress

## 💪 Encouragement
Art is a journey of continuous learning and growth. Every piece you create teaches you something new. Keep exploring, experimenting, and most importantly, enjoying the creative process!

Remember: There's no such thing as a "bad" drawing or painting - only learning opportunities!

---
*Analysis generated by AI Art Platform using local analysis*
"""
        return analysis
        
    except Exception as e:
        return f"Error analyzing artwork: {str(e)}"

# Advanced analysis functions
def analyze_composition_advanced(image):
    """Advanced composition analysis"""
    try:
        width, height = image.size
        img_array = np.array(image.convert('L'))
        
        analysis = {
            'rule_of_thirds': check_rule_of_thirds(img_array, width, height),
            'symmetry': check_symmetry(img_array),
            'balance': check_visual_balance(img_array),
            'score': 75  # Default good score
        }
        
        return analysis
    except Exception as e:
        return {
            'rule_of_thirds': "Composition shows good spatial awareness",
            'symmetry': "Balanced approach to visual elements",
            'balance': "Well-distributed visual weight",
            'score': 75
        }

def check_rule_of_thirds(img_array, width, height):
    """Check rule of thirds"""
    try:
        h_third = height // 3
        w_third = width // 3
        
        sections = []
        for i in range(3):
            for j in range(3):
                section = img_array[i*h_third:(i+1)*h_third, j*w_third:(j+1)*w_third]
                sections.append(np.mean(section))
        
        variance = np.var(sections)
        
        if variance > 20:
            return "Good use of rule of thirds - strong focal points"
        else:
            return "Consider placing key elements at rule of thirds intersections"
    except:
        return "Thoughtful composition with good spatial relationships"

def check_symmetry(img_array):
    """Check symmetry"""
    try:
        height, width = img_array.shape
        left_half = img_array[:, :width//2]
        right_half = np.fliplr(img_array[:, width//2:])
        
        min_width = min(left_half.shape[1], right_half.shape[1])
        left_half = left_half[:, :min_width]
        right_half = right_half[:, :min_width]
        
        symmetry = np.mean(np.abs(left_half - right_half))
        
        if symmetry < 30:
            return "Strong symmetrical balance creates stability"
        elif symmetry < 60:
            return "Good asymmetrical balance adds visual interest"
        else:
            return "Dynamic asymmetrical composition with energy"
    except:
        return "Balanced composition with good visual weight distribution"

def check_visual_balance(img_array):
    """Check visual balance"""
    try:
        height, width = img_array.shape
        y_indices, x_indices = np.mgrid[0:height, 0:width]
        total_mass = np.sum(img_array)
        
        if total_mass > 0:
            center_x = np.sum(x_indices * img_array) / total_mass
            center_y = np.sum(y_indices * img_array) / total_mass
            
            offset_x = abs(center_x - width/2) / (width/2)
            offset_y = abs(center_y - height/2) / (height/2)
            
            if offset_x < 0.2 and offset_y < 0.2:
                return "Excellent visual balance - stable and harmonious"
            else:
                return "Dynamic off-center composition creates movement"
        
        return "Well-balanced composition"
    except:
        return "Good overall balance and visual weight distribution"

def analyze_color_harmony_advanced(image):
    """Advanced color analysis"""
    try:
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        img_array = np.array(image)
        colors = img_array.reshape(-1, 3)
        
        # Sample colors for analysis
        sample_colors = colors[::100]  # Sample every 100th pixel
        
        avg_color = np.mean(sample_colors, axis=0)
        r, g, b = avg_color
        
        # Determine temperature
        if (r + g) / 2 > b + 20:
            temperature = "Warm color palette creates inviting, energetic mood"
        elif b > (r + g) / 2 + 20:
            temperature = "Cool color palette creates calm, serene atmosphere"
        else:
            temperature = "Balanced temperature with harmonious warm and cool tones"
        
        # Analyze saturation
        max_vals = np.max(sample_colors, axis=1)
        min_vals = np.min(sample_colors, axis=1)
        saturations = (max_vals - min_vals) / np.maximum(max_vals, 1)
        avg_saturation = np.mean(saturations)
        
        if avg_saturation > 0.6:
            saturation = "High saturation creates vibrant, energetic feel"
        elif avg_saturation > 0.3:
            saturation = "Moderate saturation with good color intensity"
        else:
            saturation = "Subtle, sophisticated color approach"
        
        color_analysis = {
            'temperature': temperature,
            'saturation': saturation,
            'harmony': "Thoughtful color relationships throughout the piece",
            'score': min(70 + avg_saturation * 30, 95)
        }
        
        return color_analysis
    except Exception as e:
        return {
            'temperature': "Balanced color temperature",
            'saturation': "Good color intensity",
            'harmony': "Harmonious color relationships",
            'score': 75
        }

# Enhancement tools
def apply_basic_enhancements(image, enhancement_type):
    """Apply basic image enhancements"""
    try:
        enhanced = image.copy()
        
        if enhancement_type == 'brightness':
            enhancer = ImageEnhance.Brightness(enhanced)
            enhanced = enhancer.enhance(1.2)
        elif enhancement_type == 'contrast':
            enhancer = ImageEnhance.Contrast(enhanced)
            enhanced = enhancer.enhance(1.3)
        elif enhancement_type == 'saturation':
            enhancer = ImageEnhance.Color(enhanced)
            enhanced = enhancer.enhance(1.4)
        elif enhancement_type == 'sharpness':
            enhancer = ImageEnhance.Sharpness(enhanced)
            enhanced = enhancer.enhance(1.2)
        elif enhancement_type == 'vintage':
            enhanced = enhanced.filter(ImageFilter.GaussianBlur(0.5))
            enhancer = ImageEnhance.Color(enhanced)
            enhanced = enhancer.enhance(0.8)
            enhancer = ImageEnhance.Brightness(enhanced)
            enhanced = enhancer.enhance(0.9)
        
        return enhanced
    except Exception as e:
        print(f"Enhancement error: {e}")
        return image

def apply_advanced_filters(image, filter_type):
    """Apply advanced artistic filters"""
    try:
        if filter_type == 'oil_painting':
            return apply_oil_painting_filter(image)
        elif filter_type == 'watercolor':
            return apply_watercolor_filter(image)
        elif filter_type == 'pencil_sketch':
            return apply_pencil_sketch_filter(image)
        elif filter_type == 'pop_art':
            return apply_pop_art_filter(image)
        else:
            return image
    except Exception as e:
        print(f"Filter error: {e}")
        return image

def apply_oil_painting_filter(image):
    """Simulate oil painting effect"""
    try:
        enhanced = image.filter(ImageFilter.MedianFilter(3))
        enhancer = ImageEnhance.Sharpness(enhanced)
        enhanced = enhancer.enhance(0.8)
        return enhanced
    except:
        return image

def apply_watercolor_filter(image):
    """Simulate watercolor effect"""
    try:
        enhanced = image.copy()
        enhanced = enhanced.filter(ImageFilter.GaussianBlur(1))
        enhancer = ImageEnhance.Color(enhanced)
        enhanced = enhancer.enhance(1.5)
        enhancer = ImageEnhance.Contrast(enhanced)
        enhanced = enhancer.enhance(0.8)
        return enhanced
    except:
        return image

def apply_pencil_sketch_filter(image):
    """Create pencil sketch effect"""
    try:
        grayscale = image.convert('L')
        inverted = ImageEnhance.Brightness(grayscale).enhance(-1)
        blurred = inverted.filter(ImageFilter.GaussianBlur(5))
        
        # Simple blend for sketch effect
        sketch_array = np.array(grayscale)
        blur_array = np.array(blurred)
        
        result = np.where(blur_array != 0, sketch_array * 255 / np.maximum(blur_array, 1), sketch_array)
        result = np.clip(result, 0, 255).astype(np.uint8)
        
        return Image.fromarray(result)
    except:
        return image.convert('L')

def apply_pop_art_filter(image):
    """Create pop art effect"""
    try:
        enhanced = image.copy()
        enhancer = ImageEnhance.Color(enhanced)
        enhanced = enhancer.enhance(2.0)
        enhancer = ImageEnhance.Contrast(enhanced)
        enhanced = enhancer.enhance(1.5)
        enhanced = enhanced.quantize(colors=8)
        return enhanced.convert('RGB')
    except:
        return image

# Export functions
def generate_pdf_report(analysis_data, artwork_path, user_name):
    """Generate PDF analysis report"""
    try:
        temp_pdf = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
        doc = SimpleDocTemplate(temp_pdf.name, pagesize=A4)
        styles = getSampleStyleSheet()
        story = []
        
        # Title
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor='#2C3E50',
            alignment=1
        )
        story.append(Paragraph("AI Art Analysis Report", title_style))
        story.append(Spacer(1, 20))
        
        # User info
        story.append(Paragraph(f"Artist: {user_name}", styles['Normal']))
        story.append(Paragraph(f"Analysis Date: {datetime.now().strftime('%B %d, %Y')}", styles['Normal']))
        story.append(Spacer(1, 20))
        
        # Add artwork image if available
        if artwork_path and os.path.exists(artwork_path):
            try:
                img = RLImage(artwork_path, width=4*inch, height=3*inch)
                story.append(img)
                story.append(Spacer(1, 20))
            except:
                pass
        
        # Analysis content
        if 'composition' in analysis_data:
            story.append(Paragraph("Composition Analysis", styles['Heading2']))
            comp = analysis_data['composition']
            story.append(Paragraph(f"Overall Score: {comp.get('score', 'N/A')}/100", styles['Normal']))
            story.append(Spacer(1, 12))
        
        if 'color' in analysis_data:
            story.append(Paragraph("Color Analysis", styles['Heading2']))
            color = analysis_data['color']
            story.append(Paragraph(f"Color Score: {color.get('score', 'N/A')}/100", styles['Normal']))
            story.append(Spacer(1, 12))
        
        # Recommendations
        story.append(Paragraph("Recommendations", styles['Heading2']))
        recommendations = [
            "Practice composition using the rule of thirds",
            "Experiment with color temperature for mood",
            "Study master artworks in similar style",
            "Focus on creating strong focal points"
        ]
        
        for rec in recommendations:
            story.append(Paragraph(f"• {rec}", styles['Normal']))
        
        doc.build(story)
        return temp_pdf.name
    except Exception as e:
        print(f"Error generating PDF: {e}")
        return None

# Routes
@app.route('/')
def index():
    """Main page"""
    user = get_current_user()
    return render_template('index.html', user=user)

@app.route('/register', methods=['GET', 'POST'])
def register():
    """User registration"""
    if request.method == 'POST':
        data = request.get_json()
        
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        display_name = data.get('display_name', username)
        
        if not all([username, email, password]):
            return jsonify({'error': 'All fields are required'}), 400
        
        # Check if user exists
        conn = sqlite3.connect('art_platform.db')
        existing = conn.execute(
            'SELECT id FROM users WHERE username = ? OR email = ?', 
            (username, email)
        ).fetchone()
        
        if existing:
            conn.close()
            return jsonify({'error': 'Username or email already exists'}), 400
        
        # Create user
        password_hash = generate_password_hash(password)
        cursor = conn.execute(
            'INSERT INTO users (username, email, password_hash, display_name) VALUES (?, ?, ?, ?)',
            (username, email, password_hash, display_name)
        )
        user_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        # Log in user
        session['user_id'] = user_id
        session['username'] = username
        
        return jsonify({'message': 'Registration successful', 'user_id': user_id})
    
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    """User login"""
    if request.method == 'POST':
        data = request.get_json()
        
        username = data.get('username')
        password = data.get('password')
        
        if not all([username, password]):
            return jsonify({'error': 'Username and password required'}), 400
        
        # Check credentials
        conn = sqlite3.connect('art_platform.db')
        user = conn.execute(
            'SELECT id, username, password_hash FROM users WHERE username = ? OR email = ?',
            (username, username)
        ).fetchone()
        conn.close()
        
        if user and check_password_hash(user[2], password):
            session['user_id'] = user[0]
            session['username'] = user[1]
            return jsonify({'message': 'Login successful', 'user_id': user[0]})
        else:
            return jsonify({'error': 'Invalid credentials'}), 401
    
    return render_template('index.html')

@app.route('/logout')
def logout():
    """User logout"""
    session.clear()
    return redirect(url_for('index'))

@app.route('/upload', methods=['POST'])
def upload_artwork():
    """Upload new artwork"""
    if 'artwork' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['artwork']
    title = request.form.get('title', 'Untitled')
    description = request.form.get('description', '')
    is_public = request.form.get('is_public', 'false').lower() == 'true'
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file type'}), 400
    
    try:
        # Save file
        filename = secure_filename(f"{uuid.uuid4()}_{file.filename}")
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        # Create thumbnail
        thumbnail_path = create_thumbnail(file_path)
        
        # Get image info
        image = Image.open(file_path)
        dimensions = f"{image.size[0]}x{image.size[1]}"
        file_size = os.path.getsize(file_path)
        image_hash = get_image_hash(file_path)
        
        # Perform AI analysis
        print("Starting AI analysis...")
        try:
            analysis_result = analyze_artwork_with_huggingface(file_path)
        except Exception as e:
            print(f"Analysis error: {e}")
            analysis_result = analyze_artwork_local(file_path)
        
        # Save to database (use demo user if not logged in)
        user_id = session.get('user_id', 1)  # Default to demo user
        conn = sqlite3.connect('art_platform.db')
        cursor = conn.execute('''
            INSERT INTO artworks (user_id, title, description, image_path, image_hash, 
                                thumbnail_path, file_size, dimensions, is_public)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (user_id, title, description, file_path, image_hash,
              thumbnail_path, file_size, dimensions, is_public))
        
        artwork_id = cursor.lastrowid
        
        # Save analysis to database
        conn.execute('''
            INSERT INTO analyses (artwork_id, analysis_text, created_at)
            VALUES (?, ?, datetime('now'))
        ''', (artwork_id, analysis_result))
        
        conn.commit()
        conn.close()
        
        print(f"Upload and analysis complete for artwork {artwork_id}")
        
        return jsonify({
            'message': 'Artwork uploaded and analyzed successfully!',
            'artwork_id': artwork_id,
            'analysis': analysis_result,
            'thumbnail_url': f'/uploads/{os.path.basename(thumbnail_path)}' if thumbnail_path else None
        })
    
    except Exception as e:
        return jsonify({'error': f'Upload failed: {str(e)}'}), 500

@app.route('/analyze/<int:artwork_id>', methods=['POST'])
@login_required
def analyze_artwork(artwork_id):
    """Analyze uploaded artwork using Hugging Face"""
    try:
        # Get artwork
        conn = sqlite3.connect('art_platform.db')
        artwork = conn.execute(
            'SELECT * FROM artworks WHERE id = ? AND user_id = ?',
            (artwork_id, session['user_id'])
        ).fetchone()
        
        if not artwork:
            conn.close()
            return jsonify({'error': 'Artwork not found'}), 404
        
        image_path = artwork[4]  # image_path column
        
        # Analyze with Hugging Face
        analysis_text = analyze_artwork_with_huggingface(image_path)
        
        # Load image for additional analysis
        image = Image.open(image_path)
        composition = analyze_composition_advanced(image)
        color = analyze_color_harmony_advanced(image)
        
        # Calculate overall score
        overall_score = (composition['score'] + color['score']) / 2
        
        # Save analysis
        analysis_data = {
            'text_analysis': analysis_text,
            'composition': composition,
            'color': color,
            'overall_score': overall_score
        }
        
        cursor = conn.execute('''
            INSERT INTO analyses (artwork_id, user_id, analysis_type, analysis_result,
                                composition_score, color_score, overall_score)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (artwork_id, session['user_id'], 'huggingface', 
              json.dumps(analysis_data), composition['score'], 
              color['score'], overall_score))
        
        analysis_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return jsonify({
            'analysis_id': analysis_id,
            'analysis': analysis_data,
            'recommendations': generate_recommendations(analysis_data)
        })
    
    except Exception as e:
        return jsonify({'error': f'Analysis failed: {str(e)}'}), 500

def generate_recommendations(analysis_data):
    """Generate personalized recommendations"""
    recommendations = []
    
    comp_score = analysis_data['composition']['score']
    color_score = analysis_data['color']['score']
    
    if comp_score < 70:
        recommendations.append({
            'category': 'Composition',
            'priority': 'high',
            'suggestion': 'Focus on rule of thirds and creating strong focal points',
            'resources': ['composition-tutorial-1', 'focal-point-guide']
        })
    
    if color_score < 70:
        recommendations.append({
            'category': 'Color',
            'priority': 'medium',
            'suggestion': 'Study color theory and practice color mixing',
            'resources': ['color-theory-basics', 'color-harmony-guide']
        })
    
    recommendations.append({
        'category': 'Practice',
        'priority': 'low',
        'suggestion': 'Regular practice with studies and master copy exercises',
        'resources': ['daily-sketching', 'master-studies']
    })
    
    return recommendations

@app.route('/enhance/<int:artwork_id>', methods=['POST'])
@login_required
def enhance_artwork(artwork_id):
    """Enhance artwork with filters"""
    try:
        enhancement_type = request.form.get('enhancement_type', 'brightness')
        filter_type = request.form.get('filter_type')
        
        # Get artwork
        conn = sqlite3.connect('art_platform.db')
        artwork = conn.execute(
            'SELECT image_path FROM artworks WHERE id = ? AND user_id = ?',
            (artwork_id, session['user_id'])
        ).fetchone()
        
        if not artwork:
            conn.close()
            return jsonify({'error': 'Artwork not found'}), 404
        
        image_path = artwork[0]
        image = Image.open(image_path)
        
        # Apply enhancements
        enhanced_image = image.copy()
        
        if filter_type:
            enhanced_image = apply_advanced_filters(enhanced_image, filter_type)
        else:
            enhanced_image = apply_basic_enhancements(enhanced_image, enhancement_type)
        
        # Convert to base64 for response
        buffer = io.BytesIO()
        enhanced_image.save(buffer, format='JPEG', quality=90)
        enhanced_data = base64.b64encode(buffer.getvalue()).decode()
        
        conn.close()
        
        return jsonify({
            'enhanced_image': enhanced_data,
            'enhancement_type': enhancement_type or filter_type
        })
    
    except Exception as e:
        return jsonify({'error': f'Enhancement failed: {str(e)}'}), 500

@app.route('/export/pdf/<int:analysis_id>')
@login_required
def export_pdf(analysis_id):
    """Export analysis as PDF"""
    try:
        # Get analysis data
        conn = sqlite3.connect('art_platform.db')
        analysis = conn.execute('''
            SELECT a.*, ar.image_path, u.display_name 
            FROM analyses a
            JOIN artworks ar ON a.artwork_id = ar.id
            JOIN users u ON a.user_id = u.id
            WHERE a.id = ? AND a.user_id = ?
        ''', (analysis_id, session['user_id'])).fetchone()
        
        if not analysis:
            conn.close()
            return jsonify({'error': 'Analysis not found'}), 404
        
        analysis_data = json.loads(analysis[4])
        artwork_path = analysis[11]
        user_name = analysis[12]
        
        pdf_path = generate_pdf_report(analysis_data, artwork_path, user_name)
        
        if pdf_path:
            return send_file(pdf_path, as_attachment=True, 
                           download_name=f'art_analysis_{analysis_id}.pdf')
        else:
            return jsonify({'error': 'PDF generation failed'}), 500
    
    except Exception as e:
        return jsonify({'error': f'Export failed: {str(e)}'}), 500

@app.route('/gallery')
def gallery():
    """Public gallery"""
    try:
        conn = sqlite3.connect('art_platform.db')
        artworks = conn.execute('''
            SELECT a.id, a.title, a.description, a.image_path, a.thumbnail_path, 
                   a.created_at, a.likes_count, a.user_id,
                   COALESCE(u.name, 'Anonymous') as display_name, 
                   COALESCE(u.username, 'anonymous') as username
            FROM artworks a
            LEFT JOIN users u ON a.user_id = u.id
            ORDER BY a.created_at DESC
            LIMIT 50
        ''').fetchall()
        conn.close()
        
        # Convert to list of dictionaries with proper URLs
        artworks_list = []
        for artwork in artworks:
            # Create proper image URLs
            image_filename = artwork[3].split('/')[-1] if artwork[3] else None
            thumbnail_filename = artwork[4].split('/')[-1] if artwork[4] else None
            
            artworks_list.append({
                'id': artwork[0],
                'title': artwork[1] or 'Untitled',
                'description': artwork[2] or 'No description available',
                'image_path': f'/uploads/{image_filename}' if image_filename else None,
                'thumbnail_path': f'/uploads/{thumbnail_filename}' if thumbnail_filename else f'/uploads/{image_filename}',
                'created_at': artwork[5],
                'likes_count': artwork[6] or 0,
                'user_id': artwork[7],
                'display_name': artwork[8],
                'username': artwork[9]
            })
        
        return jsonify({
            'success': True,
            'artworks': artworks_list,
            'total': len(artworks_list)
        })
    
    except Exception as e:
        return jsonify({'error': f'Gallery load failed: {str(e)}'}), 500

@app.route('/like/<int:artwork_id>', methods=['POST'])
@login_required
def like_artwork(artwork_id):
    """Like/unlike artwork"""
    try:
        conn = sqlite3.connect('art_platform.db')
        
        # Check if already liked
        existing = conn.execute(
            'SELECT id FROM likes WHERE user_id = ? AND artwork_id = ?',
            (session['user_id'], artwork_id)
        ).fetchone()
        
        if existing:
            # Unlike
            conn.execute('DELETE FROM likes WHERE user_id = ? AND artwork_id = ?',
                        (session['user_id'], artwork_id))
            conn.execute('UPDATE artworks SET likes_count = likes_count - 1 WHERE id = ?',
                        (artwork_id,))
            liked = False
        else:
            # Like
            conn.execute('INSERT INTO likes (user_id, artwork_id) VALUES (?, ?)',
                        (session['user_id'], artwork_id))
            conn.execute('UPDATE artworks SET likes_count = likes_count + 1 WHERE id = ?',
                        (artwork_id,))
            liked = True
        
        # Get new like count
        like_count = conn.execute('SELECT likes_count FROM artworks WHERE id = ?',
                                 (artwork_id,)).fetchone()[0]
        
        conn.commit()
        conn.close()
        
        return jsonify({'liked': liked, 'like_count': like_count})
    
    except Exception as e:
        return jsonify({'error': f'Like failed: {str(e)}'}), 500

@app.route('/profile')
@login_required
def profile():
    """User profile page"""
    try:
        # Get user stats
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get user's artwork count
        cursor.execute('SELECT COUNT(*) FROM artworks WHERE user_id = ?', (session['user_id'],))
        artwork_count = cursor.fetchone()[0]
        
        # Get user's total likes received
        cursor.execute('''
            SELECT COUNT(*) FROM likes l
            JOIN artworks a ON l.artwork_id = a.id
            WHERE a.user_id = ?
        ''', (session['user_id'],))
        likes_received = cursor.fetchone()[0]
        
        # Get user's analysis count
        cursor.execute('SELECT COUNT(*) FROM analyses WHERE user_id = ?', (session['user_id'],))
        analysis_count = cursor.fetchone()[0]
        
        user_stats = {
            'artwork_count': artwork_count,
            'likes_received': likes_received,
            'analysis_count': analysis_count
        }
        
        conn.close()
        
        return jsonify({
            'success': True,
            'stats': user_stats
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/community')
def community():
    """Community features and discussions"""
    try:
        # Get recent discussions (placeholder data)
        discussions = [
            {
                'id': 1,
                'title': 'Color Theory in Digital Art',
                'author': 'ArtMaster',
                'replies': 23,
                'last_activity': '2 hours ago',
                'category': 'Tutorial'
            },
            {
                'id': 2,
                'title': 'Weekly Critique Thread',
                'author': 'CommunityBot',
                'replies': 45,
                'last_activity': '1 hour ago',
                'category': 'Critique'
            },
            {
                'id': 3,
                'title': 'Beginner Tips for Portrait Drawing',
                'author': 'SketchPro',
                'replies': 12,
                'last_activity': '3 hours ago',
                'category': 'Tutorial'
            }
        ]
        
        return jsonify({
            'success': True,
            'discussions': discussions,
            'total_members': 1247,
            'active_today': 89
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/challenges')
def challenges():
    """Art challenges and contests"""
    try:
        # Get current challenges (placeholder data)
        challenges = [
            {
                'id': 1,
                'title': 'Winter Landscape Challenge',
                'description': 'Create a stunning winter landscape using any medium',
                'deadline': '2024-02-15',
                'participants': 67,
                'prize': 'Featured on homepage',
                'difficulty': 'Intermediate',
                'status': 'active'
            },
            {
                'id': 2,
                'title': 'Abstract Emotions',
                'description': 'Express an emotion through abstract art',
                'deadline': '2024-02-28',
                'participants': 34,
                'prize': 'Art supplies package',
                'difficulty': 'All levels',
                'status': 'active'
            },
            {
                'id': 3,
                'title': 'Character Design Sprint',
                'description': 'Design an original character in 7 days',
                'deadline': '2024-02-10',
                'participants': 89,
                'prize': 'Mentorship session',
                'difficulty': 'Advanced',
                'status': 'ending_soon'
            }
        ]
        
        return jsonify({
            'success': True,
            'challenges': challenges
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/learning')
def learning():
    """Learning resources and tutorials"""
    try:
        # Get learning resources (placeholder data)
        resources = [
            {
                'id': 1,
                'title': 'Fundamentals of Color Theory',
                'type': 'tutorial',
                'duration': '15 min',
                'difficulty': 'Beginner',
                'description': 'Learn the basics of color relationships and harmony',
                'thumbnail': '/static/images/tutorial1.jpg',
                'author': 'Color Expert'
            },
            {
                'id': 2,
                'title': 'Digital Painting Techniques',
                'type': 'video_series',
                'duration': '2 hours',
                'difficulty': 'Intermediate',
                'description': 'Master digital brush techniques and layering',
                'thumbnail': '/static/images/tutorial2.jpg',
                'author': 'Digital Artist Pro'
            },
            {
                'id': 3,
                'title': 'Composition and Rule of Thirds',
                'type': 'interactive',
                'duration': '20 min',
                'difficulty': 'Beginner',
                'description': 'Interactive guide to better composition',
                'thumbnail': '/static/images/tutorial3.jpg',
                'author': 'Composition Master'
            }
        ]
        
        return jsonify({
            'success': True,
            'resources': resources,
            'total_tutorials': 156,
            'your_progress': {
                'completed': 8,
                'in_progress': 2,
                'bookmarked': 5
            }
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/discussions')
def discussions():
    """Community discussions and forums"""
    try:
        # Get community discussions (placeholder data)
        discussions = [
            {
                'id': 1,
                'title': 'Best digital art software for beginners?',
                'author': 'NewArtist',
                'category': 'Software',
                'replies': 15,
                'views': 234,
                'last_reply': '1 hour ago',
                'tags': ['digital', 'software', 'beginner']
            },
            {
                'id': 2,
                'title': 'Critique my latest portrait please',
                'author': 'PortraitLover',
                'category': 'Critique',
                'replies': 8,
                'views': 145,
                'last_reply': '2 hours ago',
                'tags': ['portrait', 'critique', 'traditional']
            }
        ]
        
        return jsonify({
            'success': True,
            'discussions': discussions
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/join_challenge/<int:challenge_id>', methods=['POST'])
def join_challenge(challenge_id):
    """Join an art challenge"""
    user_id = session.get('user_id', 1)  # Default to demo user
    
    try:
        conn = sqlite3.connect('art_platform.db')
        # Check if already joined
        existing = conn.execute(
            'SELECT id FROM challenge_participants WHERE challenge_id = ? AND user_id = ?',
            (challenge_id, user_id)
        ).fetchone()
        
        if existing:
            return jsonify({'message': 'Already joined this challenge!'})
        
        # Join the challenge
        conn.execute(
            'INSERT INTO challenge_participants (challenge_id, user_id, joined_at) VALUES (?, ?, datetime("now"))',
            (challenge_id, user_id)
        )
        conn.commit()
        conn.close()
        
        return jsonify({'success': True, 'message': f'Successfully joined challenge {challenge_id}!'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Admin Panel Routes
@app.route('/admin')
def admin_panel():
    """Admin panel for managing content"""
    return render_template('admin.html')

@app.route('/admin/challenges', methods=['GET', 'POST'])
def admin_challenges():
    """Manage challenges"""
    if request.method == 'POST':
        data = request.get_json()
        title = data.get('title')
        description = data.get('description')
        theme = data.get('theme')
        prize = data.get('prize')
        deadline = data.get('deadline')
        
        conn = sqlite3.connect('art_platform.db')
        conn.execute('''
            INSERT INTO challenges (title, description, theme, prize, deadline, created_at)
            VALUES (?, ?, ?, ?, ?, datetime('now'))
        ''', (title, description, theme, prize, deadline))
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Challenge created successfully!'})
    
    # GET - return existing challenges
    conn = sqlite3.connect('art_platform.db')
    challenges = conn.execute('''
        SELECT c.*, COUNT(cp.user_id) as participant_count
        FROM challenges c
        LEFT JOIN challenge_participants cp ON c.id = cp.challenge_id
        GROUP BY c.id
        ORDER BY c.created_at DESC
    ''').fetchall()
    conn.close()
    
    return jsonify([dict(row) for row in challenges])

@app.route('/admin/learning', methods=['GET', 'POST'])
def admin_learning():
    """Manage learning resources"""
    if request.method == 'POST':
        data = request.get_json()
        title = data.get('title')
        description = data.get('description')
        content = data.get('content')
        category = data.get('category')
        difficulty = data.get('difficulty')
        duration = data.get('duration')
        
        conn = sqlite3.connect('art_platform.db')
        conn.execute('''
            INSERT INTO learning_resources (title, description, content, category, difficulty, duration, created_at)
            VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
        ''', (title, description, content, category, difficulty, duration))
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Learning resource created successfully!'})
    
    # GET - return existing resources
    conn = sqlite3.connect('art_platform.db')
    resources = conn.execute('''
        SELECT * FROM learning_resources ORDER BY created_at DESC
    ''').fetchall()
    conn.close()
    
    return jsonify([dict(row) for row in resources])

@app.route('/admin/discussions', methods=['GET', 'POST'])
def admin_discussions():
    """Manage discussions"""
    if request.method == 'POST':
        data = request.get_json()
        title = data.get('title')
        content = data.get('content')
        category = data.get('category')
        
        conn = sqlite3.connect('art_platform.db')
        conn.execute('''
            INSERT INTO discussions (title, content, category, author_id, created_at)
            VALUES (?, ?, ?, ?, datetime('now'))
        ''', (title, content, category, 1))  # Admin user
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Discussion created successfully!'})
    
    # GET - return existing discussions
    conn = sqlite3.connect('art_platform.db')
    discussions = conn.execute('''
        SELECT d.*, COUNT(dr.id) as reply_count
        FROM discussions d
        LEFT JOIN discussion_replies dr ON d.id = dr.discussion_id
        GROUP BY d.id
        ORDER BY d.created_at DESC
        LIMIT 20
    ''').fetchall()
    conn.close()
    
    return jsonify([dict(row) for row in discussions])

@app.route('/health')
def health():
    """Health check"""
    return jsonify({
        'status': 'healthy',
        'version': 'comprehensive',
        'ai_service': 'huggingface' if HF_API_KEY else 'local',
        'features': {
            'social': 'available',
            'enhancement': 'available',
            'export': 'available',
            'mobile': 'responsive'
        }
    })

# Serve uploaded files
@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    """Serve uploaded files"""
    return send_file(os.path.join(app.config['UPLOAD_FOLDER'], filename))

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print("🎨 AI Art Platform Starting...")
    print("✨ Features: Hugging Face AI, Social, Enhancement, Export, Mobile-Responsive")
    if HF_API_KEY:
        print("🤖 Hugging Face API: Enabled")
    else:
        print("🤖 Hugging Face API: Using local analysis (add HUGGINGFACE_API_KEY for AI)")
    app.run(host='0.0.0.0', port=port, debug=True)