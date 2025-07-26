import os
import io
import base64
from flask import Flask, render_template, request, jsonify
from werkzeug.utils import secure_filename
from PIL import Image
from openai import OpenAI
from dotenv import load_dotenv
import json

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key-here')
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Initialize OpenAI client
client = OpenAI(api_key=os.environ.get('OPENAI_API_KEY'))

def allowed_file(filename):
    """Check if uploaded file is allowed"""
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def analyze_artwork(image_data):
    """Analyze artwork using OpenAI's vision API"""
    try:
        response = client.chat.completions.create(
            model="gpt-4-vision-preview",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": """Analyze this artwork and provide detailed feedback. Please include:
                            
                            1. **Overall Impression**: What strikes you first about this piece?
                            2. **Composition**: How elements are arranged and balanced
                            3. **Color Usage**: Palette choices, harmony, contrast
                            4. **Technique**: Drawing/painting skills, brush work, line quality
                            5. **Style & Mood**: Artistic style and emotional impact
                            6. **Strengths**: What works well in this piece
                            7. **Areas for Improvement**: Specific suggestions for enhancement
                            8. **Learning Resources**: Recommended techniques or study areas
                            
                            Be constructive, encouraging, and specific in your feedback."""
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{image_data}"
                            }
                        }
                    ]
                }
            ],
            max_tokens=1000
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Error analyzing artwork: {str(e)}"

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
        
        # Convert to base64 for API
        buffer = io.BytesIO()
        image.save(buffer, format='JPEG', quality=85)
        image_data = base64.b64encode(buffer.getvalue()).decode()
        
        # Analyze the artwork
        analysis = analyze_artwork(image_data)
        
        return jsonify({
            'analysis': analysis,
            'image_data': image_data
        })
    
    except Exception as e:
        return jsonify({'error': f'Error processing image: {str(e)}'}), 500

@app.route('/enhance', methods=['POST'])
def enhance():
    """Enhancement endpoint - currently returns a message about requiring setup"""
    return jsonify({
        'error': 'Image enhancement requires additional setup. For now, use the analysis feature. Enhancement will be available after Docker setup.'
    }), 503

@app.route('/health')
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'diffusion_model': 'not loaded (use Docker for enhancement)',
        'openai_configured': bool(os.environ.get('OPENAI_API_KEY')),
        'features': {
            'analysis': 'available',
            'enhancement': 'requires Docker setup'
        }
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)