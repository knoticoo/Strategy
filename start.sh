#!/bin/bash

# AI Art Analyzer Start Script

echo "🎨 Starting AI Art Analyzer..."

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    echo "📝 Please copy .env.example to .env and configure your API keys:"
    echo "   cp .env.example .env"
    echo "   nano .env"
    exit 1
fi

# Check if OpenAI API key is configured
if ! grep -q "OPENAI_API_KEY=sk-" .env; then
    echo "⚠️  OpenAI API key not configured in .env file"
    echo "📝 Please add your OpenAI API key to .env file"
    echo "   OPENAI_API_KEY=your_api_key_here"
fi

# Start with Docker Compose
if command -v docker-compose &> /dev/null; then
    echo "🐳 Starting with Docker Compose..."
    docker-compose up -d
    
    echo "✅ Application started!"
    echo "🌐 Access the app at: http://localhost"
    echo "📊 Check status: docker-compose ps"
    echo "📋 View logs: docker-compose logs -f"
    
elif command -v python3 &> /dev/null; then
    echo "🐍 Starting with Python..."
    
    # Activate virtual environment if it exists
    if [ -d "venv" ]; then
        source venv/bin/activate
    fi
    
    # Install dependencies if needed
    if [ ! -d "venv" ]; then
        echo "📦 Installing dependencies..."
        python3 -m venv venv
        source venv/bin/activate
        pip install -r requirements.txt
    fi
    
    # Start the application
    echo "🚀 Starting Flask application..."
    python run.py
    
else
    echo "❌ Neither Docker nor Python3 found!"
    echo "📦 Please install Docker or Python3 to run the application"
    exit 1
fi