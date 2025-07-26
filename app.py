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
    
    # Challenges and contests
    conn.execute('''
        CREATE TABLE IF NOT EXISTS challenges (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            theme TEXT,
            start_date TIMESTAMP,
            end_date TIMESTAMP,
            prize_description TEXT,
            is_active BOOLEAN DEFAULT 1,
            created_by INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (created_by) REFERENCES users (id)
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

# Advanced analysis functions
def analyze_composition_advanced(image):
    """Advanced composition analysis"""
    width, height = image.size
    img_array = np.array(image.convert('L'))
    
    analysis = {
        'rule_of_thirds': check_rule_of_thirds(img_array, width, height),
        'golden_ratio': check_golden_ratio(img_array, width, height),
        'symmetry': check_symmetry(img_array),
        'leading_lines': detect_leading_lines(img_array),
        'focal_points': find_focal_points(img_array),
        'balance': check_visual_balance(img_array),
        'depth': analyze_depth(img_array),
        'score': 0
    }
    
    # Calculate composition score
    scores = []
    if 'good' in analysis['rule_of_thirds'].lower():
        scores.append(85)
    elif 'consider' in analysis['rule_of_thirds'].lower():
        scores.append(60)
    else:
        scores.append(70)
    
    analysis['score'] = sum(scores) / len(scores) if scores else 70
    return analysis

def check_rule_of_thirds(img_array, width, height):
    """Enhanced rule of thirds analysis"""
    h_third = height // 3
    w_third = width // 3
    
    sections = []
    for i in range(3):
        for j in range(3):
            section = img_array[i*h_third:(i+1)*h_third, j*w_third:(j+1)*w_third]
            sections.append(np.mean(section))
    
    # Check intersection points (stronger positions)
    intersections = [sections[0], sections[2], sections[6], sections[8]]
    intersection_variance = np.var(intersections)
    
    if intersection_variance > 25:
        return "Excellent use of rule of thirds - strong focal points at intersections"
    elif intersection_variance > 15:
        return "Good composition following rule of thirds"
    else:
        return "Consider placing key elements at rule of thirds intersection points"

def check_golden_ratio(img_array, width, height):
    """Check golden ratio composition"""
    golden_ratio = 1.618
    
    # Golden spiral points
    gw1 = int(width / golden_ratio)
    gw2 = width - gw1
    gh1 = int(height / golden_ratio)
    gh2 = height - gh1
    
    # Analyze interest at golden ratio points
    points = [
        img_array[gh1, gw1],
        img_array[gh2, gw2],
        img_array[gh1, gw2],
        img_array[gh2, gw1]
    ]
    
    variance = np.var(points)
    return "Golden ratio composition detected" if variance > 20 else "Consider golden ratio placement"

def check_symmetry(img_array):
    """Enhanced symmetry analysis"""
    height, width = img_array.shape
    
    # Vertical symmetry
    left_half = img_array[:, :width//2]
    right_half = np.fliplr(img_array[:, width//2:])
    
    min_width = min(left_half.shape[1], right_half.shape[1])
    left_half = left_half[:, :min_width]
    right_half = right_half[:, :min_width]
    
    vertical_symmetry = np.mean(np.abs(left_half - right_half))
    
    # Horizontal symmetry
    top_half = img_array[:height//2, :]
    bottom_half = np.flipud(img_array[height//2:, :])
    
    min_height = min(top_half.shape[0], bottom_half.shape[0])
    top_half = top_half[:min_height, :]
    bottom_half = bottom_half[:min_height, :]
    
    horizontal_symmetry = np.mean(np.abs(top_half - bottom_half))
    
    if vertical_symmetry < 20 and horizontal_symmetry < 20:
        return "Perfect bilateral symmetry creates formal balance"
    elif vertical_symmetry < 30:
        return "Strong vertical symmetry with slight asymmetrical interest"
    elif horizontal_symmetry < 30:
        return "Horizontal symmetry creates stable composition"
    elif vertical_symmetry < 60:
        return "Moderate asymmetry adds dynamic tension"
    else:
        return "Asymmetrical composition creates movement and energy"

def detect_leading_lines(img_array):
    """Enhanced leading lines detection"""
    try:
        from scipy import ndimage
        
        # Edge detection in multiple directions
        edges_horizontal = ndimage.sobel(img_array, axis=0)
        edges_vertical = ndimage.sobel(img_array, axis=1)
        edges_diagonal1 = ndimage.prewitt(img_array, axis=0)
        edges_diagonal2 = ndimage.prewitt(img_array, axis=1)
        
        # Combine edge information
        total_edges = np.hypot(edges_horizontal, edges_vertical)
        diagonal_edges = np.hypot(edges_diagonal1, edges_diagonal2)
        
        # Analyze edge density and direction
        h_strength = np.mean(np.abs(edges_horizontal))
        v_strength = np.mean(np.abs(edges_vertical))
        d_strength = np.mean(diagonal_edges)
        
        if h_strength > v_strength and h_strength > d_strength:
            return "Strong horizontal lines create stability and calm"
        elif v_strength > h_strength and v_strength > d_strength:
            return "Vertical lines add height and grandeur"
        elif d_strength > 15:
            return "Diagonal lines create dynamic movement and energy"
        else:
            return "Subtle linear elements with organic flow"
    except:
        return "Gentle composition with flowing elements"

def find_focal_points(img_array):
    """Enhanced focal point detection"""
    try:
        from scipy import ndimage
        
        # Multiple contrast detection methods
        laplacian = ndimage.laplace(img_array)
        gaussian = ndimage.gaussian_filter(img_array, sigma=2)
        contrast = img_array - gaussian
        
        # Find high contrast areas
        high_contrast = np.abs(laplacian) > (np.mean(np.abs(laplacian)) + 2 * np.std(np.abs(laplacian)))
        contrast_areas = np.sum(high_contrast)
        total_pixels = img_array.size
        
        contrast_ratio = contrast_areas / total_pixels
        
        if contrast_ratio > 0.2:
            return "Multiple strong focal points create complex visual interest"
        elif contrast_ratio > 0.12:
            return "Clear primary focal point with secondary elements"
        elif contrast_ratio > 0.05:
            return "Subtle focal point with gentle emphasis"
        else:
            return "Soft focus - consider adding stronger contrast for emphasis"
    except:
        return "Gentle focal emphasis throughout composition"

def check_visual_balance(img_array):
    """Enhanced visual balance analysis"""
    height, width = img_array.shape
    
    # Calculate center of mass
    y_indices, x_indices = np.mgrid[0:height, 0:width]
    total_mass = np.sum(img_array)
    
    if total_mass > 0:
        center_x = np.sum(x_indices * img_array) / total_mass
        center_y = np.sum(y_indices * img_array) / total_mass
        
        # Calculate offset from geometric center
        offset_x = abs(center_x - width/2) / (width/2)
        offset_y = abs(center_y - height/2) / (height/2)
        
        # Analyze quadrants for balance
        quad_weights = []
        for i in range(2):
            for j in range(2):
                quad = img_array[i*height//2:(i+1)*height//2, j*width//2:(j+1)*width//2]
                quad_weights.append(np.mean(quad))
        
        weight_variance = np.var(quad_weights)
        
        if offset_x < 0.05 and offset_y < 0.05:
            return "Perfect central balance - formal and stable"
        elif weight_variance < 10 and (offset_x < 0.2 and offset_y < 0.2):
            return "Excellent visual balance with slight asymmetrical interest"
        elif offset_x < 0.3 and offset_y < 0.3:
            return "Good asymmetrical balance creates dynamic stability"
        else:
            return "Bold asymmetrical composition - high visual energy"
    
    return "Balanced composition"

def analyze_depth(img_array):
    """Analyze depth and layering in the composition"""
    try:
        from scipy import ndimage
        
        # Blur analysis for depth
        blur_variance = []
        for sigma in [0.5, 1.0, 2.0, 4.0]:
            blurred = ndimage.gaussian_filter(img_array, sigma=sigma)
            variance = np.var(blurred)
            blur_variance.append(variance)
        
        depth_score = np.mean(blur_variance)
        
        if depth_score > 1000:
            return "Strong sense of depth with clear foreground, middle, and background"
        elif depth_score > 500:
            return "Good depth perception with layered elements"
        else:
            return "Flat composition - consider adding depth cues"
    except:
        return "Moderate depth perception"

def analyze_color_harmony_advanced(image):
    """Advanced color harmony analysis"""
    if image.mode != 'RGB':
        image = image.convert('RGB')
    
    img_array = np.array(image)
    
    # Extract color information
    colors = img_array.reshape(-1, 3)
    
    # Calculate color statistics
    color_analysis = {
        'temperature': analyze_color_temperature(colors),
        'saturation': analyze_saturation(colors),
        'contrast': analyze_color_contrast(colors),
        'harmony': detect_color_schemes(colors),
        'dominant_colors': get_dominant_colors(colors),
        'score': 0
    }
    
    # Calculate color score
    score = 70  # Base score
    if 'harmonious' in color_analysis['harmony'].lower():
        score += 15
    if 'good' in color_analysis['contrast'].lower():
        score += 10
    
    color_analysis['score'] = min(score, 100)
    return color_analysis

def analyze_color_temperature(colors):
    """Analyze overall color temperature"""
    avg_color = np.mean(colors, axis=0)
    r, g, b = avg_color
    
    # Calculate temperature bias
    warm_bias = (r + g) / 2 - b
    cool_bias = b - (r + g) / 2
    
    if warm_bias > 30:
        return "Warm color palette creates inviting, energetic mood"
    elif cool_bias > 30:
        return "Cool color palette creates calm, professional atmosphere"
    else:
        return "Neutral temperature with balanced warm and cool tones"

def analyze_saturation(colors):
    """Analyze color saturation levels"""
    hsv_colors = []
    for color in colors[::100]:  # Sample for performance
        r, g, b = color / 255.0
        max_val = max(r, g, b)
        min_val = min(r, g, b)
        saturation = (max_val - min_val) / max_val if max_val > 0 else 0
        hsv_colors.append(saturation)
    
    avg_saturation = np.mean(hsv_colors)
    
    if avg_saturation > 0.7:
        return "High saturation creates vibrant, energetic feel"
    elif avg_saturation > 0.4:
        return "Moderate saturation with good color intensity"
    else:
        return "Low saturation creates subtle, sophisticated mood"

def analyze_color_contrast(colors):
    """Analyze color contrast levels"""
    # Calculate contrast between adjacent colors
    color_diffs = []
    for i in range(0, len(colors) - 1, 100):  # Sample for performance
        diff = np.linalg.norm(colors[i] - colors[i+1])
        color_diffs.append(diff)
    
    avg_contrast = np.mean(color_diffs)
    
    if avg_contrast > 80:
        return "High contrast creates dramatic, bold visual impact"
    elif avg_contrast > 40:
        return "Good contrast provides clear visual separation"
    else:
        return "Low contrast creates subtle, harmonious blending"

def detect_color_schemes(colors):
    """Detect color harmony schemes"""
    # Sample dominant colors
    dominant = get_dominant_colors(colors, n_colors=5)
    
    if len(dominant) < 2:
        return "Monochromatic color scheme"
    
    # Convert to HSV for scheme detection
    schemes = []
    for i, color1 in enumerate(dominant[:3]):
        for color2 in dominant[i+1:4]:
            hue_diff = abs(rgb_to_hue(*color1) - rgb_to_hue(*color2))
            if hue_diff > 180:
                hue_diff = 360 - hue_diff
            
            if hue_diff < 30:
                schemes.append("analogous")
            elif 150 < hue_diff < 210:
                schemes.append("complementary")
            elif 90 < hue_diff < 150:
                schemes.append("triadic")
    
    if "complementary" in schemes:
        return "Complementary color scheme creates dynamic contrast"
    elif "triadic" in schemes:
        return "Triadic color scheme provides vibrant harmony"
    elif "analogous" in schemes:
        return "Analogous color scheme creates harmonious flow"
    else:
        return "Complex color relationships with varied harmony"

def get_dominant_colors(colors, n_colors=5):
    """Extract dominant colors from image"""
    try:
        from sklearn.cluster import KMeans
        
        # Reduce colors for clustering
        sample_colors = colors[::max(1, len(colors)//1000)]
        
        kmeans = KMeans(n_clusters=min(n_colors, len(sample_colors)), random_state=42)
        kmeans.fit(sample_colors)
        
        return kmeans.cluster_centers_.astype(int)
    except:
        # Fallback method
        unique_colors = np.unique(colors.reshape(-1, colors.shape[-1]), axis=0)
        return unique_colors[:n_colors]

def rgb_to_hue(r, g, b):
    """Convert RGB to hue"""
    r, g, b = r/255.0, g/255.0, b/255.0
    max_val = max(r, g, b)
    min_val = min(r, g, b)
    diff = max_val - min_val
    
    if diff == 0:
        return 0
    
    if max_val == r:
        hue = (60 * ((g - b) / diff) + 360) % 360
    elif max_val == g:
        hue = (60 * ((b - r) / diff) + 120) % 360
    else:
        hue = (60 * ((r - g) / diff) + 240) % 360
    
    return hue

# Enhancement tools
def apply_basic_enhancements(image, enhancement_type):
    """Apply basic image enhancements"""
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
        # Apply vintage filter
        enhanced = enhanced.filter(ImageFilter.GaussianBlur(0.5))
        enhancer = ImageEnhance.Color(enhanced)
        enhanced = enhancer.enhance(0.8)
        enhancer = ImageEnhance.Brightness(enhanced)
        enhanced = enhancer.enhance(0.9)
    
    return enhanced

def apply_advanced_filters(image, filter_type):
    """Apply advanced artistic filters"""
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

def apply_oil_painting_filter(image):
    """Simulate oil painting effect"""
    # Convert to numpy array
    img_array = np.array(image)
    
    # Apply bilateral filter for smoothing while preserving edges
    try:
        import cv2
        filtered = cv2.bilateralFilter(img_array, 15, 80, 80)
        return Image.fromarray(filtered)
    except:
        # Fallback: use PIL filters
        enhanced = image.filter(ImageFilter.MedianFilter(3))
        enhancer = ImageEnhance.Sharpness(enhanced)
        enhanced = enhancer.enhance(0.8)
        return enhanced

def apply_watercolor_filter(image):
    """Simulate watercolor effect"""
    enhanced = image.copy()
    enhanced = enhanced.filter(ImageFilter.GaussianBlur(1))
    enhancer = ImageEnhance.Color(enhanced)
    enhanced = enhancer.enhance(1.5)
    enhancer = ImageEnhance.Contrast(enhanced)
    enhanced = enhancer.enhance(0.8)
    return enhanced

def apply_pencil_sketch_filter(image):
    """Create pencil sketch effect"""
    grayscale = image.convert('L')
    inverted = ImageEnhance.Brightness(grayscale).enhance(-1)
    blurred = inverted.filter(ImageFilter.GaussianBlur(5))
    
    # Blend for sketch effect
    sketch_array = np.array(grayscale)
    blur_array = np.array(blurred)
    
    # Avoid division by zero
    result = np.where(blur_array != 0, sketch_array * 255 / blur_array, sketch_array)
    result = np.clip(result, 0, 255).astype(np.uint8)
    
    return Image.fromarray(result)

def apply_pop_art_filter(image):
    """Create pop art effect"""
    enhanced = image.copy()
    enhancer = ImageEnhance.Color(enhanced)
    enhanced = enhancer.enhance(2.0)
    enhancer = ImageEnhance.Contrast(enhanced)
    enhanced = enhancer.enhance(1.5)
    
    # Posterize for pop art effect
    enhanced = enhanced.quantize(colors=8)
    return enhanced.convert('RGB')

# Export functions
def generate_pdf_report(analysis_data, artwork_path, user_name):
    """Generate PDF analysis report"""
    try:
        # Create temporary file
        temp_pdf = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
        
        # Create PDF document
        doc = SimpleDocTemplate(temp_pdf.name, pagesize=A4)
        styles = getSampleStyleSheet()
        story = []
        
        # Title
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor='#2C3E50',
            alignment=1  # Center
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
            story.append(Paragraph(f"Rule of Thirds: {comp.get('rule_of_thirds', 'N/A')}", styles['Normal']))
            story.append(Paragraph(f"Visual Balance: {comp.get('balance', 'N/A')}", styles['Normal']))
            story.append(Spacer(1, 12))
        
        if 'color' in analysis_data:
            story.append(Paragraph("Color Analysis", styles['Heading2']))
            color = analysis_data['color']
            story.append(Paragraph(f"Color Score: {color.get('score', 'N/A')}/100", styles['Normal']))
            story.append(Paragraph(f"Temperature: {color.get('temperature', 'N/A')}", styles['Normal']))
            story.append(Paragraph(f"Harmony: {color.get('harmony', 'N/A')}", styles['Normal']))
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
        
        # Build PDF
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
    
    return render_template('auth.html', mode='register')

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
    
    return render_template('auth.html', mode='login')

@app.route('/logout')
def logout():
    """User logout"""
    session.clear()
    return redirect(url_for('index'))

@app.route('/upload', methods=['POST'])
@login_required
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
        
        # Save to database
        conn = sqlite3.connect('art_platform.db')
        cursor = conn.execute('''
            INSERT INTO artworks (user_id, title, description, image_path, image_hash, 
                                thumbnail_path, file_size, dimensions, is_public)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (session['user_id'], title, description, file_path, image_hash,
              thumbnail_path, file_size, dimensions, is_public))
        
        artwork_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return jsonify({
            'message': 'Artwork uploaded successfully',
            'artwork_id': artwork_id,
            'thumbnail_url': f'/static/uploads/{os.path.basename(thumbnail_path)}' if thumbnail_path else None
        })
    
    except Exception as e:
        return jsonify({'error': f'Upload failed: {str(e)}'}), 500

@app.route('/analyze/<int:artwork_id>', methods=['POST'])
@login_required
def analyze_artwork(artwork_id):
    """Analyze uploaded artwork"""
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
        
        # Load and analyze image
        image = Image.open(image_path)
        
        # Perform analyses
        composition = analyze_composition_advanced(image)
        color = analyze_color_harmony_advanced(image)
        
        # Calculate overall score
        overall_score = (composition['score'] + color['score']) / 2
        
        # Save analysis
        analysis_data = {
            'composition': composition,
            'color': color,
            'overall_score': overall_score
        }
        
        cursor = conn.execute('''
            INSERT INTO analyses (artwork_id, user_id, analysis_type, analysis_result,
                                composition_score, color_score, overall_score)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (artwork_id, session['user_id'], 'comprehensive', 
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
    
    # Add general recommendations
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
        
        # Save enhanced image
        enhanced_filename = f"enhanced_{uuid.uuid4()}.jpg"
        enhanced_path = os.path.join(app.config['UPLOAD_FOLDER'], enhanced_filename)
        enhanced_image.save(enhanced_path, quality=90)
        
        # Convert to base64 for response
        buffer = io.BytesIO()
        enhanced_image.save(buffer, format='JPEG', quality=90)
        enhanced_data = base64.b64encode(buffer.getvalue()).decode()
        
        conn.close()
        
        return jsonify({
            'enhanced_image': enhanced_data,
            'enhanced_path': enhanced_path,
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
        
        analysis_data = json.loads(analysis[4])  # analysis_result
        artwork_path = analysis[11]  # image_path
        user_name = analysis[12]  # display_name
        
        # Generate PDF
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
            SELECT a.*, u.display_name, u.username
            FROM artworks a
            JOIN users u ON a.user_id = u.id
            WHERE a.is_public = 1
            ORDER BY a.created_at DESC
            LIMIT 20
        ''').fetchall()
        conn.close()
        
        return render_template('gallery.html', artworks=artworks)
    
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

@app.route('/health')
def health():
    """Health check"""
    return jsonify({
        'status': 'healthy',
        'version': 'comprehensive',
        'features': {
            'social': 'available',
            'enhancement': 'available',
            'export': 'available',
            'mobile': 'responsive'
        }
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print("🎨 Comprehensive AI Art Platform Starting...")
    print("✨ Features: Social, Enhancement, Export, Mobile-Responsive")
    app.run(host='0.0.0.0', port=port, debug=False)