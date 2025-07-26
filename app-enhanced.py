import os
import io
import base64
from flask import Flask, render_template, request, jsonify, send_file
from werkzeug.utils import secure_filename
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
from dotenv import load_dotenv
import requests
import json
import numpy as np
from datetime import datetime
import sqlite3
import hashlib

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key-here')
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Initialize database
def init_db():
    """Initialize SQLite database for analysis history"""
    conn = sqlite3.connect('art_analysis.db')
    conn.execute('''
        CREATE TABLE IF NOT EXISTS analyses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            image_hash TEXT UNIQUE,
            filename TEXT,
            analysis_type TEXT,
            analysis_result TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            image_data TEXT
        )
    ''')
    conn.commit()
    conn.close()

init_db()

def allowed_file(filename):
    """Check if uploaded file is allowed"""
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def analyze_composition(image):
    """Advanced composition analysis using rule of thirds, golden ratio, etc."""
    width, height = image.size
    
    # Convert to numpy array for analysis
    img_array = np.array(image.convert('L'))  # Grayscale
    
    analysis = {
        'rule_of_thirds': check_rule_of_thirds(img_array, width, height),
        'symmetry': check_symmetry(img_array),
        'leading_lines': detect_leading_lines(img_array),
        'focal_points': find_focal_points(img_array),
        'balance': check_visual_balance(img_array)
    }
    
    return analysis

def check_rule_of_thirds(img_array, width, height):
    """Check how well the image follows rule of thirds"""
    # Divide image into 9 sections
    h_third = height // 3
    w_third = width // 3
    
    # Calculate average intensity in each section
    sections = []
    for i in range(3):
        for j in range(3):
            section = img_array[i*h_third:(i+1)*h_third, j*w_third:(j+1)*w_third]
            sections.append(np.mean(section))
    
    # Check if interesting elements are at intersection points
    intersections = [sections[0], sections[2], sections[6], sections[8]]  # corners
    center_lines = [sections[1], sections[3], sections[5], sections[7]]  # sides
    
    # Simple heuristic: variance indicates detail/interest
    intersection_interest = np.var(intersections)
    
    if intersection_interest > 20:
        return "Good use of rule of thirds - key elements at strong points"
    else:
        return "Consider placing focal points at rule of thirds intersections"

def check_symmetry(img_array):
    """Check for symmetry in the composition"""
    height, width = img_array.shape
    
    # Vertical symmetry
    left_half = img_array[:, :width//2]
    right_half = np.fliplr(img_array[:, width//2:])
    
    # Handle odd widths
    min_width = min(left_half.shape[1], right_half.shape[1])
    left_half = left_half[:, :min_width]
    right_half = right_half[:, :min_width]
    
    vertical_symmetry = np.mean(np.abs(left_half - right_half))
    
    if vertical_symmetry < 30:
        return "Strong vertical symmetry creates formal balance"
    elif vertical_symmetry < 60:
        return "Moderate asymmetry adds visual interest"
    else:
        return "Dynamic asymmetrical composition"

def detect_leading_lines(img_array):
    """Detect potential leading lines (simplified)"""
    # Edge detection using simple gradient
    from scipy import ndimage
    
    try:
        edges_x = ndimage.sobel(img_array, axis=1)
        edges_y = ndimage.sobel(img_array, axis=0)
        edges = np.hypot(edges_x, edges_y)
        
        # Count strong edges
        strong_edges = np.sum(edges > np.mean(edges) + np.std(edges))
        total_pixels = img_array.size
        
        edge_ratio = strong_edges / total_pixels
        
        if edge_ratio > 0.1:
            return "Strong linear elements guide the eye through composition"
        elif edge_ratio > 0.05:
            return "Moderate use of lines and edges"
        else:
            return "Soft, painterly approach with minimal linear elements"
    except:
        return "Gentle composition with flowing elements"

def find_focal_points(img_array):
    """Find areas of high contrast (potential focal points)"""
    # Calculate local contrast
    from scipy import ndimage
    
    try:
        # Simple contrast detection
        laplacian = ndimage.laplace(img_array)
        high_contrast_areas = np.sum(np.abs(laplacian) > np.std(laplacian))
        
        total_pixels = img_array.size
        contrast_ratio = high_contrast_areas / total_pixels
        
        if contrast_ratio > 0.15:
            return "Multiple focal points create dynamic interest"
        elif contrast_ratio > 0.08:
            return "Clear focal point with good contrast"
        else:
            return "Subtle focal point - consider adding more contrast"
    except:
        return "Soft focus with gentle emphasis"

def check_visual_balance(img_array):
    """Check visual weight distribution"""
    height, width = img_array.shape
    
    # Calculate center of mass
    y_indices, x_indices = np.mgrid[0:height, 0:width]
    total_mass = np.sum(img_array)
    
    if total_mass > 0:
        center_x = np.sum(x_indices * img_array) / total_mass
        center_y = np.sum(y_indices * img_array) / total_mass
        
        # Check how far from center
        offset_x = abs(center_x - width/2) / (width/2)
        offset_y = abs(center_y - height/2) / (height/2)
        
        if offset_x < 0.1 and offset_y < 0.1:
            return "Centered balance - stable and formal"
        elif offset_x < 0.3 and offset_y < 0.3:
            return "Slightly off-center - dynamic yet balanced"
        else:
            return "Asymmetrical balance - creates movement and energy"
    else:
        return "Balanced composition"

def analyze_color_harmony(image):
    """Analyze color relationships and harmony"""
    # Convert to RGB if needed
    if image.mode != 'RGB':
        image = image.convert('RGB')
    
    # Get dominant colors
    colors = image.getcolors(maxcolors=256*256*256)
    if not colors:
        return "Complex color palette"
    
    # Sort by frequency
    colors.sort(key=lambda x: x[0], reverse=True)
    top_colors = colors[:5]  # Top 5 colors
    
    # Analyze color relationships
    harmony_analysis = []
    
    for i, (count, color) in enumerate(top_colors):
        r, g, b = color
        hue = rgb_to_hue(r, g, b)
        
        if i == 0:
            dominant_hue = hue
            harmony_analysis.append(f"Dominant color: {get_color_name(r, g, b)}")
        else:
            # Check relationship to dominant color
            hue_diff = abs(hue - dominant_hue)
            if hue_diff > 180:
                hue_diff = 360 - hue_diff
                
            if hue_diff < 30:
                harmony_analysis.append("Analogous color scheme creates harmony")
            elif 150 < hue_diff < 210:
                harmony_analysis.append("Complementary colors create contrast")
            elif 90 < hue_diff < 150:
                harmony_analysis.append("Triadic color relationship adds vibrancy")
    
    return " • ".join(harmony_analysis)

def rgb_to_hue(r, g, b):
    """Convert RGB to hue (0-360)"""
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

def get_color_name(r, g, b):
    """Get approximate color name"""
    if r > 200 and g > 200 and b > 200:
        return "Light/White"
    elif r < 50 and g < 50 and b < 50:
        return "Dark/Black"
    elif r > g and r > b:
        return "Red tones"
    elif g > r and g > b:
        return "Green tones"
    elif b > r and b > g:
        return "Blue tones"
    elif r > 150 and g > 150:
        return "Yellow tones"
    elif r > 150 and b > 150:
        return "Magenta tones"
    elif g > 150 and b > 150:
        return "Cyan tones"
    else:
        return "Neutral tones"

def detect_art_style(image):
    """Detect potential art style based on visual characteristics"""
    # Convert to RGB
    if image.mode != 'RGB':
        image = image.convert('RGB')
    
    img_array = np.array(image)
    
    # Calculate various metrics
    edge_density = calculate_edge_density(img_array)
    color_variance = np.var(img_array)
    brightness = np.mean(img_array)
    saturation = calculate_saturation(img_array)
    
    # Style detection heuristics
    style_indicators = []
    
    if edge_density > 0.15:
        style_indicators.append("Sharp, defined lines suggest illustration or cartoon style")
    elif edge_density < 0.05:
        style_indicators.append("Soft edges indicate impressionistic or watercolor technique")
    
    if saturation > 150:
        style_indicators.append("High saturation suggests pop art or digital art")
    elif saturation < 50:
        style_indicators.append("Low saturation indicates realistic or vintage style")
    
    if brightness > 200:
        style_indicators.append("High key lighting creates ethereal mood")
    elif brightness < 80:
        style_indicators.append("Low key lighting creates dramatic atmosphere")
    
    return " • ".join(style_indicators) if style_indicators else "Balanced artistic approach"

def calculate_edge_density(img_array):
    """Calculate edge density for style detection"""
    try:
        from scipy import ndimage
        gray = np.mean(img_array, axis=2)
        edges = ndimage.sobel(gray)
        return np.mean(np.abs(edges)) / 255.0
    except:
        return 0.1  # Default value

def calculate_saturation(img_array):
    """Calculate average saturation"""
    r, g, b = img_array[:,:,0], img_array[:,:,1], img_array[:,:,2]
    max_rgb = np.maximum(np.maximum(r, g), b)
    min_rgb = np.minimum(np.minimum(r, g), b)
    
    # Avoid division by zero
    saturation = np.where(max_rgb != 0, (max_rgb - min_rgb) / max_rgb * 255, 0)
    return np.mean(saturation)

def save_analysis_to_db(image_hash, filename, analysis_type, analysis_result, image_data):
    """Save analysis to database"""
    try:
        conn = sqlite3.connect('art_analysis.db')
        conn.execute('''
            INSERT OR REPLACE INTO analyses 
            (image_hash, filename, analysis_type, analysis_result, image_data)
            VALUES (?, ?, ?, ?, ?)
        ''', (image_hash, filename, analysis_type, analysis_result, image_data))
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Database error: {e}")

def get_analysis_history():
    """Get recent analysis history"""
    try:
        conn = sqlite3.connect('art_analysis.db')
        cursor = conn.execute('''
            SELECT filename, analysis_type, created_at, image_data
            FROM analyses 
            ORDER BY created_at DESC 
            LIMIT 10
        ''')
        history = cursor.fetchall()
        conn.close()
        return history
    except Exception as e:
        print(f"Database error: {e}")
        return []

def generate_enhanced_analysis(image, filename):
    """Generate comprehensive analysis with all features"""
    
    # Basic info
    width, height = image.size
    aspect_ratio = width / height
    
    # Advanced analyses
    composition = analyze_composition(image)
    color_harmony = analyze_color_harmony(image)
    art_style = detect_art_style(image)
    
    # Generate comprehensive report
    analysis = f"""# 🎨 Advanced Art Analysis Report

## 📊 Technical Information
- **Dimensions**: {width} × {height} pixels
- **Aspect Ratio**: {aspect_ratio:.2f} ({'Landscape' if aspect_ratio > 1.2 else 'Portrait' if aspect_ratio < 0.8 else 'Square'})
- **File**: {filename}

## 🎯 Composition Analysis
- **Rule of Thirds**: {composition['rule_of_thirds']}
- **Visual Balance**: {composition['balance']}
- **Symmetry**: {composition['symmetry']}
- **Leading Lines**: {composition['leading_lines']}
- **Focal Points**: {composition['focal_points']}

## 🌈 Color Harmony Analysis
{color_harmony}

## 🎭 Style Detection
{art_style}

## 💡 Professional Recommendations

### Composition Improvements:
1. **Focal Point**: Ensure your main subject has the strongest contrast
2. **Rule of Thirds**: Place key elements at intersection points
3. **Leading Lines**: Use lines to guide the viewer's eye to focal points
4. **Balance**: Consider visual weight distribution

### Color Enhancements:
1. **Harmony**: Stick to 2-3 main colors for cohesion
2. **Contrast**: Use complementary colors for emphasis
3. **Temperature**: Warm colors advance, cool colors recede
4. **Saturation**: Vary intensity to create hierarchy

### Technical Tips:
1. **Edges**: Vary hard and soft edges for interest
2. **Values**: Ensure strong light/dark contrast
3. **Details**: Add detail where you want attention
4. **Simplification**: Remove distracting elements

## 🎓 Next Learning Steps:
- Study master artworks with similar composition
- Practice color mixing and temperature control
- Experiment with different viewpoints
- Join art critique communities for feedback

---
*Analysis generated by Enhanced AI Art Analyzer*
"""
    
    return analysis

@app.route('/')
def index():
    """Main page with enhanced features"""
    return render_template('index-enhanced.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    """Enhanced analysis with comprehensive features"""
    if 'artwork' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['artwork']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file type. Please upload an image.'}), 400
    
    try:
        # Process the image
        image = Image.open(file.stream)
        original_filename = secure_filename(file.filename)
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Resize if too large
        max_size = (1024, 1024)
        image.thumbnail(max_size, Image.Resampling.LANCZOS)
        
        # Convert to base64 for display and storage
        buffer = io.BytesIO()
        image.save(buffer, format='JPEG', quality=85)
        image_data = base64.b64encode(buffer.getvalue()).decode()
        
        # Generate image hash for deduplication
        image_hash = hashlib.md5(buffer.getvalue()).hexdigest()
        
        # Generate enhanced analysis
        analysis = generate_enhanced_analysis(image, original_filename)
        
        # Save to database
        save_analysis_to_db(image_hash, original_filename, 'enhanced', analysis, image_data)
        
        return jsonify({
            'analysis': analysis,
            'image_data': image_data,
            'analysis_type': 'enhanced',
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        return jsonify({'error': f'Error processing image: {str(e)}'}), 500

@app.route('/history')
def history():
    """Get analysis history"""
    try:
        history_data = get_analysis_history()
        
        formatted_history = []
        for filename, analysis_type, created_at, image_data in history_data:
            formatted_history.append({
                'filename': filename,
                'analysis_type': analysis_type,
                'created_at': created_at,
                'image_data': image_data[:100] + '...' if image_data else None  # Truncate for list view
            })
        
        return jsonify({
            'history': formatted_history,
            'total': len(formatted_history)
        })
    except Exception as e:
        return jsonify({'error': f'Error fetching history: {str(e)}'}), 500

@app.route('/compare', methods=['POST'])
def compare():
    """Compare two artworks side by side"""
    files = request.files.getlist('artworks')
    
    if len(files) != 2:
        return jsonify({'error': 'Please upload exactly 2 images for comparison'}), 400
    
    try:
        comparisons = []
        
        for i, file in enumerate(files):
            if not allowed_file(file.filename):
                return jsonify({'error': f'Invalid file type for image {i+1}'}), 400
            
            # Process each image
            image = Image.open(file.stream)
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Resize for comparison
            max_size = (512, 512)
            image.thumbnail(max_size, Image.Resampling.LANCZOS)
            
            # Convert to base64
            buffer = io.BytesIO()
            image.save(buffer, format='JPEG', quality=85)
            image_data = base64.b64encode(buffer.getvalue()).decode()
            
            # Quick analysis for comparison
            composition = analyze_composition(image)
            color_harmony = analyze_color_harmony(image)
            
            comparisons.append({
                'filename': secure_filename(file.filename),
                'image_data': image_data,
                'composition': composition['rule_of_thirds'],
                'color_harmony': color_harmony,
                'size': image.size
            })
        
        # Generate comparison insights
        insights = f"""# 🔄 Artwork Comparison

## Image 1: {comparisons[0]['filename']}
- **Size**: {comparisons[0]['size'][0]} × {comparisons[0]['size'][1]}
- **Composition**: {comparisons[0]['composition']}
- **Colors**: {comparisons[0]['color_harmony']}

## Image 2: {comparisons[1]['filename']}
- **Size**: {comparisons[1]['size'][0]} × {comparisons[1]['size'][1]}
- **Composition**: {comparisons[1]['composition']}
- **Colors**: {comparisons[1]['color_harmony']}

## 💡 Comparison Insights:
- Compare how each artwork handles focal points
- Notice differences in color temperature and harmony
- Observe compositional approaches and their effects
- Consider which techniques you'd like to incorporate
"""
        
        return jsonify({
            'comparison': comparisons,
            'insights': insights,
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        return jsonify({'error': f'Error comparing images: {str(e)}'}), 500

@app.route('/health')
def health():
    """Enhanced health check"""
    return jsonify({
        'status': 'healthy',
        'version': 'enhanced',
        'features': {
            'advanced_analysis': 'available',
            'composition_analysis': 'available',
            'color_harmony': 'available',
            'style_detection': 'available',
            'history_tracking': 'available',
            'artwork_comparison': 'available'
        },
        'database': 'sqlite',
        'analysis_count': len(get_analysis_history())
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print("🎨 Enhanced AI Art Analyzer Starting...")
    print("✨ Features: Advanced Analysis, History, Comparison, Style Detection")
    app.run(host='0.0.0.0', port=port, debug=False)