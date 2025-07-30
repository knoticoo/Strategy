#!/usr/bin/env bash

# Unified start script for AI Pet Doctor system
# Starts web app, bot service, training, and TensorBoard (all in background)
# Logs are written to logs/ directory

set -e  # Exit on any error

echo "🚀 Starting AI Pet Doctor System..."

# Create logs directory
mkdir -p logs

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if dependencies are installed
check_dependencies() {
    echo "📋 Checking dependencies..."
    
    # Check for Node.js and npm
    if ! command_exists node; then
        echo "❌ Node.js not found. Please install Node.js first."
        exit 1
    fi
    
    if ! command_exists npm; then
        echo "❌ npm not found. Please install npm first."
        exit 1
    fi
    
    # Check for Python and pip
    if ! command_exists python3; then
        echo "❌ Python3 not found. Please install Python3 first."
        exit 1
    fi
    
    echo "✅ Basic dependencies found"
}

# Function to install npm dependencies
install_npm_deps() {
    echo "📦 Installing npm dependencies..."
    
    # Install web app dependencies
    if [ ! -d "node_modules" ]; then
        echo "Installing web app dependencies..."
        npm install
    fi
    
    # Install bot service dependencies
    if [ ! -d "ai-bot-service/node_modules" ]; then
        echo "Installing bot service dependencies..."
        cd ai-bot-service && npm install && cd ..
    fi
    
    echo "✅ npm dependencies installed"
}

# Function to check Python environment
check_python_env() {
    echo "🐍 Checking Python environment..."
    
    if [ ! -f "ai-bot-service/ai-training/requirements.txt" ]; then
        echo "❌ requirements.txt not found in ai-bot-service/ai-training. Please add it!"
        exit 1
    fi
    
    if [ ! -d "ai-bot-service/ai-training/venv" ]; then
        echo "Creating Python virtual environment..."
        cd ai-bot-service/ai-training
        python3 -m venv venv
        source venv/bin/activate
        pip install -r requirements.txt
        cd ../..
    else
        echo "✅ Python virtual environment found"
    fi
}

# Check dependencies
check_dependencies

# Install npm dependencies
install_npm_deps

# Check Python environment
check_python_env

echo "🎯 Starting services..."

# 1. Start the web app (frontend)
echo "Starting Web App (frontend)..."
nohup npm run dev > logs/web-app.log 2>&1 &
WEB_PID=$!
echo "Web App started with PID $WEB_PID (log: logs/web-app.log)"

# Wait a moment for web app to start
sleep 3

# 2. Start the bot service (backend)
echo "Starting Bot Service (backend)..."
nohup npm run --prefix ai-bot-service dev > logs/bot-service.log 2>&1 &
BOT_PID=$!
echo "Bot Service started with PID $BOT_PID (log: logs/bot-service.log)"

# Wait a moment for bot service to start
sleep 3

# 3. Start model training (Python, in venv)
echo "Starting Model Training..."
nohup ai-bot-service/ai-training/venv/bin/python ai-bot-service/ai-training/model_trainer.py > logs/training.log 2>&1 &
TRAIN_PID=$!
echo "Model Training started with PID $TRAIN_PID (log: logs/training.log)"

# Wait a moment for training to start
sleep 3

# 4. Start TensorBoard for monitoring
echo "Starting TensorBoard (port 6006)..."
nohup ai-bot-service/ai-training/venv/bin/tensorboard --logdir ai-bot-service/ai-training/models/veterinary-ai-model/tensorboard --port 6006 > logs/tensorboard.log 2>&1 &
TB_PID=$!
echo "TensorBoard started with PID $TB_PID (log: logs/tensorboard.log)"

# Wait a moment for TensorBoard to start
sleep 3

echo ""
echo "🎉 All services started!"
echo "- Web App:         http://localhost:3000"
echo "- Bot Service:     http://localhost:3001"
echo "- TensorBoard:     http://localhost:6006"
echo ""
echo "📊 To check status:"
echo "  tail -f logs/web-app.log"
echo "  tail -f logs/bot-service.log"
echo "  tail -f logs/training.log"
echo "  tail -f logs/tensorboard.log"
echo ""
echo "🛑 To stop all services:"
echo "  kill $WEB_PID $BOT_PID $TRAIN_PID $TB_PID"
echo ""
echo "💡 If services don't start, check the logs above for errors."