import os
import io
import base64
from flask import Flask, render_template, request, jsonify
from werkzeug.utils import secure_filename
from PIL import Image
from dotenv import load_dotenv
import requests
import json

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key-here')
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

def allowed_file(filename):
    """Check if uploaded file is allowed"""
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def analyze_artwork_with_huggingface(image_data):
    """Analyze artwork using Hugging Face's free API"""
    try:
        # Using Hugging Face's free Inference API
        # You can get a free API token at https://huggingface.co/settings/tokens
        hf_token = os.environ.get('HUGGINGFACE_API_KEY')
        
        if not hf_token:
            return """## Free AI Analysis Available!
            
To enable AI analysis, get a free Hugging Face API token:

1. Go to https://huggingface.co/settings/tokens
2. Sign up (free) and create a token
3. Add to your .env file: HUGGINGFACE_API_KEY=your_token_here
4. Restart the app

**Manual Analysis Tips:**
- **Composition**: Look for rule of thirds, leading lines, balance
- **Colors**: Check harmony, contrast, temperature
- **Technique**: Observe brush strokes, line quality, shading
- **Style**: Identify artistic movement or personal style
- **Improvements**: Consider focal points, color balance, proportions"""

        # Use Hugging Face's vision model (free)
        headers = {
            "Authorization": f"Bearer {hf_token}",
            "Content-Type": "application/json"
        }
        
        # Using BLIP model for image captioning (free)
        api_url = "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large"
        
        # Convert base64 to bytes
        image_bytes = base64.b64decode(image_data)
        
        response = requests.post(
            api_url,
            headers=headers,
            data=image_bytes,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            caption = result[0]['generated_text'] if result else "Unable to analyze"
            
            # Generate detailed analysis based on the caption
            analysis = f"""## AI Art Analysis (Free Version)

**🎨 Overall Impression**: {caption}

**📐 Composition Analysis**:
Based on the visual elements, this artwork shows {"good balance and structure" if "painting" in caption.lower() or "drawing" in caption.lower() else "interesting visual composition"}. The arrangement of elements {"creates a harmonious flow" if any(word in caption.lower() for word in ["landscape", "portrait", "still life"]) else "draws the viewer's attention effectively"}.

**🎨 Color & Technique**:
The artwork demonstrates {"skillful use of color and technique" if "colorful" in caption.lower() or "bright" in caption.lower() else "thoughtful approach to visual elements"}. The style appears to be {"traditional" if any(word in caption.lower() for word in ["painting", "drawing", "sketch"]) else "contemporary"}.

**💪 Strengths**:
- Clear visual communication
- {"Good use of traditional media" if "painting" in caption.lower() or "drawing" in caption.lower() else "Effective visual presentation"}
- Engaging subject matter

**🚀 Areas for Improvement**:
- Experiment with different lighting angles
- Consider adding more contrast for visual impact
- Explore color temperature variations
- Practice different compositional approaches

**📚 Learning Resources**:
- Study the rule of thirds for composition
- Practice color theory exercises
- Analyze master artworks in similar style
- Join online art communities for feedback

**Note**: This is a free AI analysis. For more detailed feedback, consider upgrading to premium AI services or getting human expert review.
"""
            return analysis
        else:
            return generate_fallback_analysis()
            
    except Exception as e:
        print(f"Hugging Face API error: {e}")
        return generate_fallback_analysis()

def generate_fallback_analysis():
    """Generate helpful analysis without AI"""
    return """## Art Analysis Guide (No API Required)

**🎨 Self-Analysis Checklist**:

**Composition (Rule of Thirds)**:
- Are important elements placed along the thirds lines?
- Is there a clear focal point?
- Does the eye flow naturally through the piece?

**Color Theory**:
- Are colors harmonious or deliberately contrasting?
- Is there good balance of warm and cool colors?
- Does the color palette support the mood?

**Technique Assessment**:
- Are lines confident and purposeful?
- Is there good contrast between light and dark?
- Are proportions accurate?
- Is the style consistent throughout?

**Mood & Impact**:
- What emotion does the piece convey?
- Does it tell a story or evoke feelings?
- Is the style appropriate for the subject?

**🚀 Improvement Areas to Consider**:
1. **Composition**: Try different viewpoints or cropping
2. **Color**: Experiment with limited palettes
3. **Contrast**: Add stronger lights and darks
4. **Details**: Focus on key areas, simplify others
5. **Style**: Study artists you admire

**📚 Free Learning Resources**:
- YouTube art tutorials
- Art community forums (Reddit r/ArtCrit)
- Free online courses (Coursera, Khan Academy)
- Museum websites with art analysis
- Drawing/painting practice groups

**💡 Next Steps**:
- Set up free Hugging Face API for AI analysis
- Join online art communities
- Practice regularly with studies
- Seek feedback from other artists
"""

def analyze_artwork_local(image):
    """Basic image analysis using PIL (no API required)"""
    try:
        # Get basic image information
        width, height = image.size
        mode = image.mode
        
        # Simple color analysis
        colors = image.getcolors(maxcolors=256*256*256)
        if colors:
            dominant_color = max(colors, key=lambda x: x[0])[1]
            if isinstance(dominant_color, tuple) and len(dominant_color) >= 3:
                r, g, b = dominant_color[:3]
                
                # Determine if warm or cool
                if r > b:
                    temperature = "warm tones"
                else:
                    temperature = "cool tones"
            else:
                temperature = "neutral tones"
        else:
            temperature = "varied tones"
        
        # Determine aspect ratio
        aspect_ratio = width / height
        if aspect_ratio > 1.3:
            orientation = "landscape orientation"
        elif aspect_ratio < 0.7:
            orientation = "portrait orientation"
        else:
            orientation = "square composition"
        
        analysis = f"""## Basic Image Analysis

**📏 Technical Information**:
- Dimensions: {width} × {height} pixels
- Color mode: {mode}
- Orientation: {orientation}
- Dominant colors: {temperature}

**🎨 Visual Assessment**:
The artwork shows {orientation} with {temperature}. {"This suggests an energetic, warm feeling" if "warm" in temperature else "This creates a calm, cool atmosphere" if "cool" in temperature else "This provides balanced visual appeal"}.

**📐 Composition Notes**:
{"The landscape format works well for scenic or wide compositions" if "landscape" in orientation else "The portrait format is excellent for figures and vertical subjects" if "portrait" in orientation else "The square format creates balanced, centered compositions"}.

**🎯 General Recommendations**:
- Consider the emotional impact of your color choices
- Experiment with different crops and orientations
- Pay attention to the balance of elements
- Use contrast to guide the viewer's eye

**💡 Pro Tips**:
- {"Try adding vertical elements to break up horizontal lines" if "landscape" in orientation else "Consider horizontal elements for stability" if "portrait" in orientation else "Experiment with diagonal lines for dynamic energy"}
- Vary your color temperature for visual interest
- Use the strongest contrast at your focal point

**🚀 Next Steps**:
1. Take a photo of your artwork in good lighting
2. Compare with master artworks in similar style
3. Get feedback from art communities
4. Practice the techniques that challenge you most
"""
        return analysis
        
    except Exception as e:
        return f"Error in local analysis: {str(e)}"

@app.route('/')
def index():
    """Main page"""
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    """Analyze uploaded artwork"""
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
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Resize if too large
        max_size = (1024, 1024)
        image.thumbnail(max_size, Image.Resampling.LANCZOS)
        
        # Convert to base64 for display
        buffer = io.BytesIO()
        image.save(buffer, format='JPEG', quality=85)
        image_data = base64.b64encode(buffer.getvalue()).decode()
        
        # Try Hugging Face first, fallback to local analysis
        hf_token = os.environ.get('HUGGINGFACE_API_KEY')
        
        if hf_token:
            analysis = analyze_artwork_with_huggingface(image_data)
        else:
            # Use local analysis as fallback
            analysis = analyze_artwork_local(image)
        
        return jsonify({
            'analysis': analysis,
            'image_data': image_data
        })
    
    except Exception as e:
        return jsonify({'error': f'Error processing image: {str(e)}'}), 500

@app.route('/enhance', methods=['POST'])
def enhance():
    """Enhancement endpoint - provides free enhancement tips"""
    if 'artwork' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['artwork']
    enhancement_type = request.form.get('enhancement_type', 'general')
    
    if not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file type. Please upload an image.'}), 400
    
    try:
        # Process the image
        image = Image.open(file.stream)
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Convert to base64 for display
        buffer = io.BytesIO()
        image.save(buffer, format='JPEG', quality=90)
        original_data = base64.b64encode(buffer.getvalue()).decode()
        
        # Generate enhancement suggestions based on type
        enhancement_tips = {
            'general': 'Try adjusting contrast, brightness, and saturation. Consider cropping for better composition.',
            'colors': 'Experiment with color balance, vibrance, and selective color adjustments. Try split-toning.',
            'composition': 'Consider the rule of thirds, leading lines, and removing distracting elements.',
            'details': 'Use sharpening tools carefully, enhance textures, and add subtle clarity.',
            'lighting': 'Adjust highlights and shadows, consider graduated filters, and balance exposure.'
        }
        
        tip = enhancement_tips.get(enhancement_type, enhancement_tips['general'])
        
        # For now, return the same image with enhancement tips
        # In a full implementation, you could apply basic PIL enhancements
        
        return jsonify({
            'original_image': original_data,
            'enhanced_image': original_data,  # Same image for now
            'enhancement_type': enhancement_type,
            'enhancement_tips': f"Enhancement Tips for {enhancement_type}: {tip}",
            'note': 'Free version provides enhancement guidance. For AI-powered enhancement, consider upgrading to premium services.'
        })
    
    except Exception as e:
        return jsonify({'error': f'Error processing enhancement: {str(e)}'}), 500

@app.route('/health')
def health():
    """Health check endpoint"""
    hf_configured = bool(os.environ.get('HUGGINGFACE_API_KEY'))
    
    return jsonify({
        'status': 'healthy',
        'version': 'free',
        'ai_service': 'Hugging Face (free)' if hf_configured else 'Local analysis',
        'huggingface_configured': hf_configured,
        'features': {
            'analysis': 'available (free)',
            'enhancement': 'basic tips available'
        },
        'setup_note': 'Get free Hugging Face API key at https://huggingface.co/settings/tokens for AI analysis'
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print("🎨 AI Art Analyzer (Free Version) Starting...")
    print("🆓 No paid APIs required!")
    print("💡 For AI analysis, get free Hugging Face token: https://huggingface.co/settings/tokens")
    app.run(host='0.0.0.0', port=port, debug=False)