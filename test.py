#!/usr/bin/env python3
"""
Test script for AI Art Analyzer
Run this to verify your installation
"""

import os
import sys
import requests
import time
from PIL import Image
import io

def test_dependencies():
    """Test if all dependencies are available"""
    print("🔍 Testing dependencies...")
    
    try:
        import flask
        print("✅ Flask installed")
    except ImportError:
        print("❌ Flask not installed")
        return False
    
    try:
        import openai
        print("✅ OpenAI library installed")
    except ImportError:
        print("❌ OpenAI library not installed")
        return False
    
    try:
        import torch
        print("✅ PyTorch installed")
    except ImportError:
        print("❌ PyTorch not installed")
        return False
    
    try:
        from diffusers import StableDiffusionImg2ImgPipeline
        print("✅ Diffusers library installed")
    except ImportError:
        print("❌ Diffusers library not installed")
        return False
    
    return True

def test_environment():
    """Test environment configuration"""
    print("\n🔧 Testing environment...")
    
    if not os.path.exists('.env'):
        print("❌ .env file not found")
        print("📝 Create .env file: cp .env.example .env")
        return False
    
    print("✅ .env file exists")
    
    # Check if OpenAI API key is set
    openai_key = os.getenv('OPENAI_API_KEY')
    if not openai_key or openai_key == 'your_openai_api_key_here':
        print("⚠️  OpenAI API key not configured")
        print("📝 Add your API key to .env file")
    else:
        print("✅ OpenAI API key configured")
    
    return True

def create_test_image():
    """Create a simple test image"""
    print("\n🎨 Creating test image...")
    
    # Create a simple colored square
    img = Image.new('RGB', (256, 256), color=(73, 109, 137))
    
    # Save to memory
    img_buffer = io.BytesIO()
    img.save(img_buffer, format='JPEG')
    img_buffer.seek(0)
    
    print("✅ Test image created")
    return img_buffer

def test_application(port=5000):
    """Test if the application is running"""
    print(f"\n🌐 Testing application on port {port}...")
    
    base_url = f"http://localhost:{port}"
    
    try:
        # Test health endpoint
        response = requests.get(f"{base_url}/health", timeout=10)
        if response.status_code == 200:
            print("✅ Health endpoint working")
            health_data = response.json()
            print(f"   Status: {health_data.get('status')}")
            print(f"   OpenAI configured: {health_data.get('openai_configured')}")
            print(f"   Diffusion model: {health_data.get('diffusion_model')}")
        else:
            print(f"❌ Health endpoint returned {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Cannot connect to application: {e}")
        print("💡 Make sure the application is running:")
        print("   python run.py")
        print("   or")
        print("   docker-compose up")
        return False
    
    try:
        # Test main page
        response = requests.get(base_url, timeout=10)
        if response.status_code == 200:
            print("✅ Main page accessible")
        else:
            print(f"❌ Main page returned {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Cannot access main page: {e}")
    
    return True

def test_analysis_endpoint(port=5000):
    """Test the analysis endpoint with a test image"""
    print(f"\n🔍 Testing analysis endpoint...")
    
    base_url = f"http://localhost:{port}"
    
    # Create test image
    test_img = create_test_image()
    
    try:
        files = {'artwork': ('test.jpg', test_img, 'image/jpeg')}
        response = requests.post(f"{base_url}/analyze", files=files, timeout=30)
        
        if response.status_code == 200:
            print("✅ Analysis endpoint working")
            data = response.json()
            if 'analysis' in data:
                print("✅ Analysis response received")
                print(f"   Preview: {data['analysis'][:100]}...")
            else:
                print("⚠️  Analysis response missing analysis field")
        else:
            print(f"❌ Analysis endpoint returned {response.status_code}")
            try:
                error_data = response.json()
                print(f"   Error: {error_data.get('error', 'Unknown error')}")
            except:
                print(f"   Response: {response.text[:200]}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Analysis endpoint error: {e}")

def main():
    """Run all tests"""
    print("🎨 AI Art Analyzer Test Suite")
    print("=" * 40)
    
    # Test dependencies
    if not test_dependencies():
        print("\n❌ Dependency tests failed!")
        print("💡 Install dependencies: pip install -r requirements.txt")
        sys.exit(1)
    
    # Test environment
    if not test_environment():
        print("\n❌ Environment tests failed!")
        sys.exit(1)
    
    # Test if app is running
    if test_application():
        # If app is running, test the endpoints
        test_analysis_endpoint()
    
    print("\n🎉 Test suite completed!")
    print("\n📝 Next steps:")
    print("1. Add your OpenAI API key to .env file")
    print("2. Start the application: python run.py")
    print("3. Open http://localhost:5000 in your browser")
    print("4. Upload an artwork and test the features!")

if __name__ == "__main__":
    main()