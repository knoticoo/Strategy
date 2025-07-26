# 🎨 AI Art Platform

A comprehensive, modern web platform for AI-powered art analysis, enhancement tools, and artist community features. Built with Flask, featuring advanced composition analysis, social networking, mobile-first design, and PWA capabilities.

![AI Art Platform](https://img.shields.io/badge/AI%20Art%20Platform-v2.0-blue.svg)
![Python](https://img.shields.io/badge/Python-3.8+-green.svg)
![Flask](https://img.shields.io/badge/Flask-3.0+-blue.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

## ✨ Features

### 🔬 **Advanced AI Analysis**
- **Composition Analysis**: Rule of thirds, golden ratio, visual balance, leading lines
- **Color Harmony**: Temperature analysis, saturation detection, complementary schemes
- **Style Recognition**: Automatic detection of artistic styles and techniques
- **Focal Point Detection**: Advanced contrast analysis and visual emphasis
- **Professional Scoring**: Comprehensive scoring system with detailed feedback

### 🎨 **Enhancement Tools**
- **Basic Enhancements**: Brightness, contrast, saturation, sharpness adjustments
- **Artistic Filters**: Oil painting, watercolor, pencil sketch, pop art effects
- **Real-time Preview**: Side-by-side comparison with original artwork
- **Professional Quality**: High-resolution output with quality preservation

### 👥 **Social Community**
- **User Profiles**: Customizable artist profiles with bio and skill level
- **Public Gallery**: Showcase artworks to the community
- **Like System**: Heart and appreciate fellow artists' work
- **Comments & Critiques**: Constructive feedback system
- **Follow Artists**: Stay updated with favorite artists
- **Challenges**: Participate in themed art challenges

### 📱 **Mobile-First Design**
- **Responsive Layout**: Perfect on all devices and screen sizes
- **Progressive Web App (PWA)**: Install as native app on mobile
- **Touch Optimized**: Gesture-friendly interface for mobile users
- **Bottom Navigation**: Quick access on mobile devices
- **Offline Support**: Core features work without internet

### 📊 **Export & Integration**
- **PDF Reports**: Professional analysis reports with artwork
- **High-Quality Downloads**: Export enhanced artworks
- **Analysis History**: Track progress over time
- **Shareable Links**: Easy sharing of artworks and results
- **API Ready**: RESTful endpoints for integrations

## 🚀 Quick Start

### Option 1: Docker (Recommended)
```bash
# Clone repository
git clone <your-repo-url>
cd ai-art-platform

# Copy environment file
cp .env.example .env

# Start with Docker
docker-compose up -d

# Access at http://localhost
```

### Option 2: Manual Installation
```bash
# Install dependencies
pip3 install -r requirements.txt

# Set up environment
cp .env.example .env

# Initialize database
python3 -c "from app import init_db; init_db()"

# Run application
python3 app.py
```

### Option 3: Production Deployment
```bash
# Deploy to Ubuntu VPS
chmod +x setup.sh
./setup.sh

# Follow deployment guide
cat DEPLOYMENT.md
```

## 📁 Project Structure

```
ai-art-platform/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── docker-compose.yml     # Docker configuration
├── Dockerfile            # Docker build instructions
├── nginx.conf            # Nginx reverse proxy config
├── .env.example          # Environment template
├── setup.sh              # Ubuntu deployment script
├── templates/
│   ├── index.html        # Main responsive template
│   ├── auth.html         # Authentication forms
│   └── gallery.html      # Community gallery
├── static/
│   ├── css/
│   │   └── style.css     # Modern responsive CSS
│   ├── js/
│   │   └── app.js        # Full-featured JavaScript
│   ├── manifest.json     # PWA manifest
│   ├── sw.js             # Service worker
│   └── icons/            # PWA icons
├── uploads/              # User artwork storage
├── reports/              # Generated PDF reports
└── art_platform.db      # SQLite database
```

## 🛠️ Configuration

### Environment Variables
```bash
# Security
SECRET_KEY=your-super-secret-key

# Database
DATABASE_URL=sqlite:///art_platform.db

# Upload Settings
MAX_CONTENT_LENGTH=16777216  # 16MB
UPLOAD_FOLDER=uploads
REPORTS_FOLDER=reports

# Social Features
ENABLE_SOCIAL_FEATURES=true
ENABLE_PUBLIC_GALLERY=true

# Optional: External APIs
HUGGINGFACE_API_KEY=your-key-here
OPENAI_API_KEY=your-key-here
```

### Database Setup
The application uses SQLite by default with automatic table creation:

```python
# Tables created automatically:
- users              # User accounts and profiles
- artworks           # Uploaded artwork metadata
- analyses           # AI analysis results
- likes              # Social interactions
- comments           # Community feedback
- follows            # User relationships
- challenges         # Art contests
```

## 🎯 API Endpoints

### Authentication
```
POST   /register        # Create user account
POST   /login           # User login
GET    /logout          # User logout
```

### Artwork Management
```
POST   /upload          # Upload new artwork
GET    /gallery         # Public gallery
POST   /like/:id        # Like/unlike artwork
```

### Analysis & Enhancement
```
POST   /analyze/:id     # Analyze artwork
POST   /enhance/:id     # Apply enhancements
GET    /export/pdf/:id  # Export analysis report
```

### Community Features
```
GET    /history         # User's analysis history
POST   /comment/:id     # Add comment
POST   /follow/:id      # Follow user
```

## 🎨 Advanced Analysis Features

### Composition Analysis
- **Rule of Thirds**: Intersection point analysis
- **Golden Ratio**: Mathematical composition checking
- **Visual Balance**: Center of mass calculations
- **Leading Lines**: Edge detection and flow analysis
- **Symmetry**: Bilateral and radial symmetry detection

### Color Analysis
- **Temperature**: Warm/cool color bias detection
- **Saturation**: Intensity and vibrancy analysis
- **Harmony**: Color scheme identification
- **Contrast**: Dynamic range and separation
- **Dominant Colors**: AI-powered color extraction

### Style Detection
- **Edge Density**: Line quality and definition
- **Technique Recognition**: Painting vs drawing styles
- **Mood Analysis**: Emotional tone detection
- **Period Classification**: Historical style identification

## 📱 Mobile Features

### Progressive Web App
- **Installable**: Add to home screen
- **Offline Support**: Core features work offline
- **Push Notifications**: Community updates
- **Native Feel**: App-like experience

### Mobile Optimizations
- **Touch Gestures**: Swipe and tap interactions
- **Responsive Images**: Optimized loading
- **Bottom Navigation**: Thumb-friendly navigation
- **Camera Integration**: Direct photo upload

## 🔧 Enhancement Tools

### Basic Adjustments
```python
# Available enhancement types:
- brightness     # Luminosity adjustment
- contrast       # Dynamic range improvement
- saturation     # Color intensity boost
- sharpness      # Detail enhancement
- vintage        # Retro filter effect
```

### Artistic Filters
```python
# Advanced filter options:
- oil_painting   # Painterly effect
- watercolor     # Fluid, transparent look
- pencil_sketch  # Line drawing conversion
- pop_art        # High contrast, posterized
```

## 🚀 Deployment Options

### Docker Deployment
```bash
# Production with Nginx
docker-compose up -d

# Simple single container
docker build -t ai-art-platform .
docker run -p 5000:5000 ai-art-platform
```

### VPS Deployment
```bash
# Ubuntu server setup
curl -O setup.sh
chmod +x setup.sh
./setup.sh

# Manual Nginx configuration
sudo systemctl enable nginx
sudo systemctl start nginx
```

### Cloud Platforms
- **Heroku**: `heroku create your-app`
- **DigitalOcean**: App Platform ready
- **AWS**: EC2 + RDS configuration
- **Vercel**: Serverless deployment

## 📊 Performance Features

### Optimization
- **Image Compression**: Automatic quality optimization
- **Lazy Loading**: Efficient resource loading
- **Caching**: Redis-based response caching
- **CDN Ready**: Static asset optimization

### Monitoring
- **Health Checks**: `/health` endpoint
- **Performance Metrics**: Response time tracking
- **Error Logging**: Comprehensive error tracking
- **Usage Analytics**: User behavior insights

## 🔐 Security Features

### Authentication
- **Secure Passwords**: Bcrypt hashing
- **Session Management**: Flask-Session security
- **CSRF Protection**: Cross-site request forgery prevention
- **Rate Limiting**: API abuse prevention

### Data Protection
- **Input Validation**: XSS and injection prevention
- **File Upload Security**: Type and size validation
- **Database Security**: Parameterized queries
- **HTTPS Support**: SSL/TLS encryption

## 🧪 Testing

### Run Tests
```bash
# Install test dependencies
pip install pytest pytest-cov

# Run test suite
pytest tests/ -v

# Coverage report
pytest --cov=app tests/
```

### Test Features
- **Unit Tests**: Individual function testing
- **Integration Tests**: End-to-end workflows
- **Performance Tests**: Load and stress testing
- **Security Tests**: Vulnerability scanning

## 🤝 Contributing

### Development Setup
```bash
# Fork and clone repository
git clone your-fork-url
cd ai-art-platform

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install development dependencies
pip install -r requirements.txt
pip install -r requirements-dev.txt

# Run in development mode
export FLASK_ENV=development
python app.py
```

### Code Standards
- **PEP 8**: Python style guide compliance
- **Type Hints**: Function annotation requirements
- **Documentation**: Comprehensive docstrings
- **Testing**: 90%+ code coverage target

## 📚 Documentation

### Additional Resources
- [Deployment Guide](DEPLOYMENT.md) - Production setup
- [API Documentation](API.md) - Endpoint reference
- [Developer Guide](DEVELOPMENT.md) - Contributing guidelines
- [Troubleshooting](TROUBLESHOOTING.md) - Common issues

## 🎯 Roadmap

### Version 2.1 (Planned)
- [ ] Real-time collaboration features
- [ ] Advanced AI training tools
- [ ] Video artwork analysis
- [ ] Blockchain integration for NFTs

### Version 2.2 (Future)
- [ ] VR/AR artwork viewing
- [ ] AI-powered art generation
- [ ] Professional marketplace
- [ ] Educational course platform

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Bootstrap 5** - Responsive UI framework
- **Font Awesome** - Icon library
- **Pillow** - Python image processing
- **NumPy & SciPy** - Scientific computing
- **ReportLab** - PDF generation

## 📞 Support

### Getting Help
- **Issues**: GitHub issue tracker
- **Discussions**: Community discussions
- **Email**: support@aiartplatform.com
- **Discord**: Join our community server

### Commercial Support
Professional support and custom development available.
Contact: enterprise@aiartplatform.com

---

**Made with ❤️ for artists worldwide**

Transform your art with AI-powered analysis and join a thriving community of creators!