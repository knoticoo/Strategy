#!/bin/bash

# AI Pet Doctor - Complete System Startup Script
# This script handles data collection, model training, and service startup

set -e  # Exit on any error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ROOT=$(pwd)
BOT_SERVICE_DIR="$PROJECT_ROOT/ai-bot-service"
TRAINING_DIR="$BOT_SERVICE_DIR/ai-training"
MODEL_DIR="$TRAINING_DIR/models/veterinary-ai-model"
DATA_DIR="$TRAINING_DIR/data"
WEB_APP_PORT=5173
BOT_SERVICE_PORT=3001

# Function to print colored output
print_status() {
    echo -e "${BLUE}[$(date '+%H:%M:%S')]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[$(date '+%H:%M:%S')] ✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}[$(date '+%H:%M:%S')] ⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}[$(date '+%H:%M:%S')] ❌ $1${NC}"
}

print_header() {
    echo -e "${PURPLE}"
    echo "=================================================="
    echo "$1"
    echo "=================================================="
    echo -e "${NC}"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check system requirements
check_requirements() {
    print_header "🔍 CHECKING SYSTEM REQUIREMENTS"
    
    # Check Node.js
    if command_exists node; then
        NODE_VERSION=$(node --version)
        print_success "Node.js found: $NODE_VERSION"
    else
        print_error "Node.js not found. Please install Node.js 18+"
        exit 1
    fi
    
    # Check npm
    if command_exists npm; then
        NPM_VERSION=$(npm --version)
        print_success "npm found: $NPM_VERSION"
    else
        print_error "npm not found. Please install npm"
        exit 1
    fi
    
    # Check Python
    if command_exists python3; then
        PYTHON_VERSION=$(python3 --version)
        print_success "Python found: $PYTHON_VERSION"
    else
        print_error "Python 3 not found. Please install Python 3.8+"
        exit 1
    fi
    
    # Check pip
    if command_exists pip3; then
        print_success "pip3 found"
    else
        print_error "pip3 not found. Please install pip3"
        exit 1
    fi
    
    # Check system resources
    TOTAL_RAM=$(free -h | awk '/^Mem:/ {print $2}')
    CPU_CORES=$(nproc)
    print_status "System resources: ${CPU_CORES} CPU cores, ${TOTAL_RAM} RAM"
    
    if [ "$CPU_CORES" -lt 2 ]; then
        print_warning "Only $CPU_CORES CPU core(s) detected. Training will be slow."
    fi
    
    echo
}

# Function to install dependencies
install_dependencies() {
    print_header "📦 INSTALLING DEPENDENCIES"
    
    # Install web app dependencies
    print_status "Installing web app dependencies..."
    npm install
    print_success "Web app dependencies installed"
    
    # Install bot service dependencies
    print_status "Installing bot service dependencies..."
    cd "$BOT_SERVICE_DIR"
    npm install
    print_success "Bot service dependencies installed"
    
    # Install Python dependencies
    print_status "Installing Python AI dependencies..."
    cd "$TRAINING_DIR"
    
    # Create virtual environment if it doesn't exist
    if [ ! -d "venv" ]; then
        print_status "Creating Python virtual environment..."
        python3 -m venv venv
    fi
    
    # Activate virtual environment
    source venv/bin/activate
    
    # Install Python packages
    pip install -r requirements.txt
    print_success "Python dependencies installed"
    
    cd "$PROJECT_ROOT"
    echo
}

# Function to collect training data
collect_data() {
    print_header "🌐 COLLECTING VETERINARY DATA"
    
    cd "$TRAINING_DIR"
    source venv/bin/activate
    
    if [ -f "$DATA_DIR/training_data.jsonl" ] && [ -s "$DATA_DIR/training_data.jsonl" ]; then
        print_warning "Training data already exists. Skipping data collection."
        print_status "To force data collection, delete: $DATA_DIR/training_data.jsonl"
    else
        print_status "Starting comprehensive data collection..."
        print_status "This will scrape Wikipedia, PubMed, and veterinary websites..."
        print_warning "This may take 30-60 minutes depending on your internet connection"
        
        python data_collector.py
        
        if [ -f "$DATA_DIR/training_data.jsonl" ]; then
            LINES=$(wc -l < "$DATA_DIR/training_data.jsonl")
            print_success "Data collection complete! Collected $LINES training examples"
        else
            print_error "Data collection failed!"
            exit 1
        fi
    fi
    
    cd "$PROJECT_ROOT"
    echo
}

# Function to train the AI model
train_model() {
    print_header "🧠 TRAINING AI MODEL"
    
    cd "$TRAINING_DIR"
    source venv/bin/activate
    
    if [ -d "$MODEL_DIR" ] && [ -f "$MODEL_DIR/config.json" ]; then
        print_warning "Trained model already exists. Skipping training."
        print_status "To force retraining, delete: $MODEL_DIR"
        echo -e "${CYAN}Model location: $MODEL_DIR${NC}"
    else
        print_status "Starting AI model training..."
        print_warning "This will take 3-6 hours on your 2vCPU 4GB RAM VPS"
        print_status "Training optimized for low-memory systems"
        
        # Show training configuration
        echo -e "${CYAN}Training Configuration:${NC}"
        echo "  - Model: DialoGPT-small (optimized for 4GB RAM)"
        echo "  - Batch size: 1 (memory efficient)"
        echo "  - LoRA: Enabled (parameter efficient)"
        echo "  - 4-bit quantization: Enabled"
        echo "  - Max samples: 5000 (for faster training)"
        echo
        
        python model_trainer.py
        
        if [ -d "$MODEL_DIR" ]; then
            print_success "Model training complete!"
            echo -e "${CYAN}Model saved to: $MODEL_DIR${NC}"
        else
            print_error "Model training failed!"
            exit 1
        fi
    fi
    
    cd "$PROJECT_ROOT"
    echo
}

# Function to start bot service
start_bot_service() {
    print_header "🤖 STARTING AI BOT SERVICE"
    
    cd "$BOT_SERVICE_DIR"
    
    # Check if model exists
    if [ ! -d "$MODEL_DIR" ]; then
        print_error "Trained model not found at: $MODEL_DIR"
        print_error "Please run training first or check the model path"
        exit 1
    fi
    
    # Start bot service in background
    print_status "Starting bot service on port $BOT_SERVICE_PORT..."
    
    # Kill existing process if running
    if lsof -Pi :$BOT_SERVICE_PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_warning "Port $BOT_SERVICE_PORT is in use. Killing existing process..."
        kill $(lsof -Pi :$BOT_SERVICE_PORT -sTCP:LISTEN -t) 2>/dev/null || true
        sleep 2
    fi
    
    # Set environment variables
    export NODE_ENV=development
    export PORT=$BOT_SERVICE_PORT
    export AI_PROVIDER=local
    export DATABASE_TYPE=sqlite
    
    # Start service
    npm run dev > ../logs/bot-service.log 2>&1 &
    BOT_PID=$!
    
    # Wait for service to start
    print_status "Waiting for bot service to initialize..."
    sleep 10
    
    # Check if service is running
    if kill -0 $BOT_PID 2>/dev/null; then
        print_success "Bot service started successfully (PID: $BOT_PID)"
        echo -e "${CYAN}Bot service available at: http://localhost:$BOT_SERVICE_PORT${NC}"
        echo $BOT_PID > ../pids/bot-service.pid
    else
        print_error "Bot service failed to start!"
        print_error "Check logs: $PROJECT_ROOT/logs/bot-service.log"
        exit 1
    fi
    
    cd "$PROJECT_ROOT"
    echo
}

# Function to start web app
start_web_app() {
    print_header "🌐 STARTING WEB APPLICATION"
    
    # Set environment variables for web app
    export VITE_BOT_SERVICE_URL="http://localhost:$BOT_SERVICE_PORT"
    
    print_status "Starting web application on port $WEB_APP_PORT..."
    
    # Kill existing process if running
    if lsof -Pi :$WEB_APP_PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_warning "Port $WEB_APP_PORT is in use. Killing existing process..."
        kill $(lsof -Pi :$WEB_APP_PORT -sTCP:LISTEN -t) 2>/dev/null || true
        sleep 2
    fi
    
    # Start web app
    npm run dev > logs/web-app.log 2>&1 &
    WEB_PID=$!
    
    # Wait for web app to start
    print_status "Waiting for web application to initialize..."
    sleep 8
    
    # Check if web app is running
    if kill -0 $WEB_PID 2>/dev/null; then
        print_success "Web application started successfully (PID: $WEB_PID)"
        echo -e "${CYAN}Web app available at: http://localhost:$WEB_APP_PORT${NC}"
        echo $WEB_PID > pids/web-app.pid
    else
        print_error "Web application failed to start!"
        print_error "Check logs: $PROJECT_ROOT/logs/web-app.log"
        exit 1
    fi
    
    echo
}

# Function to show system status
show_status() {
    print_header "📊 SYSTEM STATUS"
    
    echo -e "${CYAN}🌐 Web Application:${NC}"
    echo "   URL: http://localhost:$WEB_APP_PORT"
    echo "   Status: Running (PID: $(cat pids/web-app.pid 2>/dev/null || echo 'Unknown'))"
    echo
    
    echo -e "${CYAN}🤖 AI Bot Service:${NC}"
    echo "   URL: http://localhost:$BOT_SERVICE_PORT"
    echo "   Status: Running (PID: $(cat pids/bot-service.pid 2>/dev/null || echo 'Unknown'))"
    echo "   Model: Local Veterinary AI"
    echo
    
    echo -e "${CYAN}🧠 AI Model:${NC}"
    echo "   Location: $MODEL_DIR"
    echo "   Type: DialoGPT-small with LoRA"
    echo "   Training Data: $(wc -l < "$DATA_DIR/training_data.jsonl" 2>/dev/null || echo 'Unknown') examples"
    echo
    
    echo -e "${CYAN}📁 Important Paths:${NC}"
    echo "   Project Root: $PROJECT_ROOT"
    echo "   Bot Service: $BOT_SERVICE_DIR"
    echo "   AI Training: $TRAINING_DIR"
    echo "   Model: $MODEL_DIR"
    echo "   Logs: $PROJECT_ROOT/logs/"
    echo
    
    echo -e "${GREEN}🎉 All services are running successfully!${NC}"
    echo -e "${YELLOW}📝 Access your AI Pet Doctor at: http://localhost:$WEB_APP_PORT${NC}"
    echo
}

# Function to setup directories
setup_directories() {
    print_status "Setting up directories..."
    
    mkdir -p logs
    mkdir -p pids
    mkdir -p "$DATA_DIR"
    mkdir -p "$TRAINING_DIR/models"
    
    print_success "Directories created"
}

# Function to handle cleanup on exit
cleanup() {
    print_status "Cleaning up processes..."
    
    # Kill web app
    if [ -f "pids/web-app.pid" ]; then
        WEB_PID=$(cat pids/web-app.pid)
        kill $WEB_PID 2>/dev/null || true
        rm -f pids/web-app.pid
    fi
    
    # Kill bot service
    if [ -f "pids/bot-service.pid" ]; then
        BOT_PID=$(cat pids/bot-service.pid)
        kill $BOT_PID 2>/dev/null || true
        rm -f pids/bot-service.pid
    fi
    
    print_success "Cleanup complete"
}

# Function to show help
show_help() {
    echo -e "${PURPLE}AI Pet Doctor - Complete System Startup${NC}"
    echo
    echo "Usage: $0 [OPTION]"
    echo
    echo "Options:"
    echo "  --full          Full setup: data collection, training, and service startup"
    echo "  --quick         Quick start: skip data collection and training if already done"
    echo "  --data-only     Only collect training data"
    echo "  --train-only    Only train the AI model"
    echo "  --services-only Only start the services"
    echo "  --status        Show system status"
    echo "  --stop          Stop all services"
    echo "  --help          Show this help message"
    echo
    echo "Default: --quick (recommended for daily use)"
    echo
}

# Function to stop services
stop_services() {
    print_header "🛑 STOPPING SERVICES"
    cleanup
    print_success "All services stopped"
}

# Main execution
main() {
    # Setup signal handlers
    trap cleanup EXIT
    trap cleanup INT
    trap cleanup TERM
    
    # Parse command line arguments
    case "${1:-quick}" in
        --full)
            setup_directories
            check_requirements
            install_dependencies
            collect_data
            train_model
            start_bot_service
            start_web_app
            show_status
            ;;
        --quick)
            setup_directories
            check_requirements
            install_dependencies
            
            # Only collect data if not exists
            if [ ! -f "$DATA_DIR/training_data.jsonl" ]; then
                collect_data
            else
                print_success "Training data already exists, skipping collection"
            fi
            
            # Only train if model doesn't exist
            if [ ! -d "$MODEL_DIR" ]; then
                train_model
            else
                print_success "Trained model already exists, skipping training"
            fi
            
            start_bot_service
            start_web_app
            show_status
            ;;
        --data-only)
            setup_directories
            check_requirements
            install_dependencies
            collect_data
            ;;
        --train-only)
            setup_directories
            check_requirements
            install_dependencies
            train_model
            ;;
        --services-only)
            setup_directories
            check_requirements
            start_bot_service
            start_web_app
            show_status
            ;;
        --status)
            show_status
            ;;
        --stop)
            stop_services
            ;;
        --help)
            show_help
            ;;
        *)
            print_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
}

# Print welcome message
print_header "🐾 AI PET DOCTOR - COMPLETE SYSTEM STARTUP"
echo -e "${CYAN}Optimized for 2vCPU 4GB RAM VPS${NC}"
echo -e "${CYAN}Your own AI model - no external APIs needed!${NC}"
echo

# Run main function
main "$@"

# Keep script running to monitor services
if [[ "$1" == "--full" || "$1" == "--quick" || "$1" == "--services-only" || -z "$1" ]]; then
    echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
    echo
    
    # Monitor services
    while true; do
        sleep 30
        
        # Check if services are still running
        if [ -f "pids/web-app.pid" ] && [ -f "pids/bot-service.pid" ]; then
            WEB_PID=$(cat pids/web-app.pid)
            BOT_PID=$(cat pids/bot-service.pid)
            
            if ! kill -0 $WEB_PID 2>/dev/null; then
                print_error "Web app stopped unexpectedly!"
                break
            fi
            
            if ! kill -0 $BOT_PID 2>/dev/null; then
                print_error "Bot service stopped unexpectedly!"
                break
            fi
        fi
    done
fi