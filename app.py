import os
import io
import base64
from flask import Flask, render_template, request, jsonify, send_file
from werkzeug.utils import secure_filename
from PIL import Image
import openai
from dotenv import load_dotenv
import torch
from diffusers import StableDiffusionImg2ImgPipeline
import requests
import json

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key-here')
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Initialize OpenAI client
openai.api_key = os.environ.get('OPENAI_API_KEY')

# Global variable for the diffusion pipeline
pipe = None

def init_diffusion_model():
    """Initialize the Stable Diffusion model for image enhancement"""
    global pipe
    try:
        device = "cuda" if torch.cuda.is_available() else "cpu"
        pipe = StableDiffusionImg2ImgPipeline.from_pretrained(
            "runwayml/stable-diffusion-v1-5",
            torch_dtype=torch.float16 if device == "cuda" else torch.float32
        )
        pipe = pipe.to(device)
        if device == "cuda":
            pipe.enable_memory_efficient_attention()
        print(f"Diffusion model loaded on {device}")
    except Exception as e:
        print(f"Error loading diffusion model: {e}")
        pipe = None

def allowed_file(filename):
    """Check if uploaded file is allowed"""
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def analyze_artwork(image_data):
    """Analyze artwork using OpenAI's vision API"""
    try:
        response = openai.chat.completions.create(
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

def enhance_artwork(image, enhancement_prompt):
    """Enhance artwork using Stable Diffusion"""
    global pipe
    if pipe is None:
        return None, "Image enhancement model not available"
    
    try:
        # Prepare the prompt for enhancement
        full_prompt = f"high quality, improved, professional artwork, {enhancement_prompt}, detailed, masterpiece, best quality"
        negative_prompt = "blurry, low quality, distorted, ugly, bad anatomy, worst quality"
        
        # Generate enhanced image
        enhanced_image = pipe(
            prompt=full_prompt,
            negative_prompt=negative_prompt,
            image=image,
            strength=0.3,  # How much to change the original
            guidance_scale=7.5,
            num_inference_steps=20
        ).images[0]
        
        return enhanced_image, None
    except Exception as e:
        return None, f"Error enhancing image: {str(e)}"

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
    """Enhance uploaded artwork"""
    if 'artwork' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['artwork']
    enhancement_type = request.form.get('enhancement_type', 'general')
    
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
        
        # Resize for processing
        max_size = (512, 512)
        image.thumbnail(max_size, Image.Resampling.LANCZOS)
        
        # Define enhancement prompts
        enhancement_prompts = {
            'general': 'enhanced colors, improved composition, better lighting',
            'colors': 'vibrant colors, improved color harmony, professional color grading',
            'composition': 'better composition, improved balance, professional framing',
            'details': 'enhanced details, sharper lines, refined textures',
            'lighting': 'improved lighting, better shadows and highlights, professional illumination'
        }
        
        prompt = enhancement_prompts.get(enhancement_type, enhancement_prompts['general'])
        
        # Enhance the image
        enhanced_image, error = enhance_artwork(image, prompt)
        
        if error:
            return jsonify({'error': error}), 500
        
        # Convert enhanced image to base64
        buffer = io.BytesIO()
        enhanced_image.save(buffer, format='JPEG', quality=90)
        enhanced_data = base64.b64encode(buffer.getvalue()).decode()
        
        # Convert original for comparison
        orig_buffer = io.BytesIO()
        image.save(orig_buffer, format='JPEG', quality=90)
        original_data = base64.b64encode(orig_buffer.getvalue()).decode()
        
        return jsonify({
            'original_image': original_data,
            'enhanced_image': enhanced_data,
            'enhancement_type': enhancement_type
        })
    
    except Exception as e:
        return jsonify({'error': f'Error enhancing image: {str(e)}'}), 500

@app.route('/health')
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'diffusion_model': 'loaded' if pipe else 'not loaded',
        'openai_configured': bool(openai.api_key)
    })

if __name__ == '__main__':
    # Initialize the diffusion model in a separate thread to avoid blocking
    import threading
    threading.Thread(target=init_diffusion_model, daemon=True).start()
    
    # Run the app
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)