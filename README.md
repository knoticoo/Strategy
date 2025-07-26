# 🎨 AI Art Analyzer & Enhancer

A powerful web application that uses AI to analyze artwork and provide detailed feedback, plus enhance images using state-of-the-art AI models.

## ✨ Features

- **🔍 AI Art Analysis**: Detailed analysis using OpenAI's GPT-4 Vision API
  - Composition analysis
  - Color theory feedback
  - Technique evaluation
  - Style identification
  - Improvement suggestions
  - Learning resources

- **🎭 AI Art Enhancement**: Image improvement using Stable Diffusion
  - General enhancement
  - Color improvement
  - Composition fixes
  - Detail enhancement
  - Lighting optimization

- **🌐 Modern Web Interface**: Beautiful, responsive UI with:
  - Drag & drop file upload
  - Real-time progress indicators
  - Before/after comparisons
  - Mobile-friendly design

- **🚀 Production Ready**: 
  - Docker containerization
  - Nginx reverse proxy
  - Rate limiting
  - Health checks
  - SSL ready

## 🛠️ Quick Setup on Ubuntu VPS

### Prerequisites
- Ubuntu 20.04+ VPS
- OpenAI API key
- At least 4GB RAM (8GB+ recommended for image enhancement)
- 20GB+ disk space

### Automated Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd ai-art-analyzer

# Make setup script executable and run it
chmod +x setup.sh
./setup.sh

# Edit environment variables
nano .env
# Add your OpenAI API key: OPENAI_API_KEY=your_key_here

# Start the application
docker-compose up -d
```

Your app will be available at `http://your-server-ip`

## 🔧 Manual Installation

### 1. System Dependencies
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y python3 python3-pip python3-venv git curl wget nginx
```

### 2. Clone and Setup
```bash
git clone <your-repo-url>
cd ai-art-analyzer

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
```

### 3. Environment Configuration
```bash
cp .env.example .env
nano .env
```

Add your configuration:
```env
OPENAI_API_KEY=your_openai_api_key_here
SECRET_KEY=your_secret_key_here
FLASK_ENV=production
PORT=5000
```

### 4. Run the Application

#### Option A: Direct Python (Development)
```bash
source venv/bin/activate
python run.py
```

#### Option B: Docker (Production)
```bash
docker-compose up -d
```

#### Option C: Gunicorn (Production)
```bash
source venv/bin/activate
gunicorn --bind 0.0.0.0:5000 --workers 2 --timeout 120 app:app
```

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Client      │───▶│     Nginx       │───▶│   Flask App     │
│   (Browser)     │    │ (Reverse Proxy) │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                                               ┌─────────────────┐
                                               │   OpenAI API    │
                                               │  (GPT-4 Vision) │
                                               └─────────────────┘
                                                        │
                                               ┌─────────────────┐
                                               │ Stable Diffusion│
                                               │    (Local)      │
                                               └─────────────────┘
```

## 📁 Project Structure

```
ai-art-analyzer/
├── app.py                 # Main Flask application
├── run.py                 # Production runner
├── requirements.txt       # Python dependencies
├── Dockerfile            # Container configuration
├── docker-compose.yml    # Multi-container setup
├── nginx.conf            # Nginx configuration
├── setup.sh              # Automated setup script
├── .env.example          # Environment template
├── templates/
│   └── index.html        # Main web interface
├── static/
│   ├── css/
│   │   └── style.css     # Custom styles
│   └── js/
│       └── main.js       # Frontend JavaScript
└── uploads/              # Temporary file storage
```

## 🔑 API Endpoints

### GET /
Main web interface

### POST /analyze
Analyze uploaded artwork
- **Input**: `multipart/form-data` with `artwork` file
- **Output**: JSON with analysis text and processed image

### POST /enhance
Enhance uploaded artwork
- **Input**: `multipart/form-data` with `artwork` file and `enhancement_type`
- **Output**: JSON with original and enhanced images

### GET /health
Health check endpoint
- **Output**: API status and model availability

## 🎯 Usage Examples

### 1. Art Analysis
1. Upload an image (JPG, PNG, GIF, BMP, WebP)
2. Click "Analyze Artwork"
3. Receive detailed feedback on:
   - Overall impression
   - Composition
   - Color usage
   - Technique
   - Style & mood
   - Strengths
   - Areas for improvement
   - Learning resources

### 2. Art Enhancement
1. Upload an image
2. Select enhancement type:
   - General Enhancement
   - Color Enhancement
   - Composition Improvement
   - Detail Enhancement
   - Lighting Improvement
3. Click "Enhance Artwork"
4. Compare before/after results
5. Download enhanced image

## ⚙️ Configuration

### Environment Variables
- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `SECRET_KEY`: Flask secret key for session security
- `FLASK_ENV`: Environment (development/production)
- `PORT`: Application port (default: 5000)

### File Limits
- Maximum file size: 16MB
- Supported formats: JPG, PNG, GIF, BMP, WebP
- Processing timeout: 5 minutes

### Rate Limiting
- Analysis: 10 requests per minute per IP
- Enhancement: 3 requests per minute per IP

## 🔒 Security Features

- File type validation
- File size limits
- Rate limiting
- CSRF protection
- Input sanitization
- Secure file handling

## 🚀 Deployment Options

### 1. Docker (Recommended)
```bash
docker-compose up -d
```

### 2. Kubernetes
```yaml
# Add Kubernetes manifests as needed
```

### 3. VPS with Nginx
- Use the provided `nginx.conf`
- Set up SSL certificates
- Configure domain name

### 4. Cloud Platforms
- AWS ECS/Fargate
- Google Cloud Run
- Azure Container Instances
- DigitalOcean App Platform

## 📊 Performance

### System Requirements
- **Minimum**: 2 CPU cores, 4GB RAM, 10GB storage
- **Recommended**: 4+ CPU cores, 8GB+ RAM, 50GB+ storage
- **GPU**: Optional but recommended for faster image enhancement

### Optimization Tips
1. Use GPU for Stable Diffusion if available
2. Implement Redis for caching
3. Use CDN for static assets
4. Enable gzip compression
5. Optimize image processing pipeline

## 🐛 Troubleshooting

### Common Issues

#### "OpenAI API key not configured"
- Add your API key to `.env` file
- Restart the application

#### "Image enhancement model not available"
- The Stable Diffusion model is loading
- Wait a few minutes and try again
- Check system resources (RAM/disk space)

#### "File upload failed"
- Check file size (must be < 16MB)
- Verify file format is supported
- Check disk space

#### "Application won't start"
- Check logs: `docker-compose logs`
- Verify all environment variables are set
- Ensure ports are not in use

### Debug Mode
```bash
# Enable debug mode
export FLASK_ENV=development
python run.py
```

### Logs
```bash
# Docker logs
docker-compose logs -f

# Application logs
tail -f /var/log/ai-art-analyzer.log
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- OpenAI for GPT-4 Vision API
- Hugging Face for Stable Diffusion models
- Bootstrap for UI components
- Flask community for the web framework

## 📧 Support

For support, please:
1. Check the troubleshooting section
2. Search existing issues
3. Create a new issue with details
4. Contact: [your-email@example.com]

---

Made with ❤️ for artists and creators