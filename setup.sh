#!/bin/bash

# AI Art Analyzer Setup Script for Ubuntu VPS
# This script sets up the environment and dependencies

set -e

echo "🎨 Setting up AI Art Analyzer..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install required system packages
echo "🔧 Installing system dependencies..."
sudo apt install -y \
    python3 \
    python3-pip \
    python3-venv \
    git \
    curl \
    wget \
    unzip \
    nginx \
    ufw \
    htop \
    build-essential \
    pkg-config \
    libssl-dev \
    libffi-dev \
    python3-dev

# Install Docker and Docker Compose
if ! command -v docker &> /dev/null; then
    echo "🐳 Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
fi

if ! command -v docker-compose &> /dev/null; then
    echo "🐳 Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# Create project directory
echo "📁 Setting up project directory..."
PROJECT_DIR="/opt/ai-art-analyzer"
sudo mkdir -p $PROJECT_DIR
sudo chown $USER:$USER $PROJECT_DIR

# Copy environment template
echo "⚙️ Setting up environment..."
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "📝 Please edit .env file with your OpenAI API key:"
    echo "   nano .env"
    echo ""
    echo "   Add your OpenAI API key:"
    echo "   OPENAI_API_KEY=your_api_key_here"
    echo ""
fi

# Setup firewall
echo "🔥 Configuring firewall..."
sudo ufw --force enable
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443

# Create uploads directory
mkdir -p uploads

# Set up Python virtual environment (alternative to Docker)
echo "🐍 Setting up Python virtual environment..."
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

echo "✅ Setup complete!"
echo ""
echo "🚀 To run the application:"
echo ""
echo "Option 1 - Using Docker (Recommended):"
echo "   1. Edit .env file with your API keys"
echo "   2. docker-compose up -d"
echo ""
echo "Option 2 - Using Python directly:"
echo "   1. Edit .env file with your API keys"
echo "   2. source venv/bin/activate"
echo "   3. python run.py"
echo ""
echo "📝 Don't forget to:"
echo "   - Add your OpenAI API key to .env"
echo "   - Configure your domain/SSL if needed"
echo "   - Test the application"
echo ""
echo "🌐 The app will be available at http://your-server-ip"