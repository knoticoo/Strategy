#!/bin/bash
# AI Pet Doctor - Complete System Startup with Admin Panel
# Password: Millie1991
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ROOT="$(pwd)"
BOT_SERVICE_DIR="$PROJECT_ROOT/ai-bot-service"
TRAINING_DIR="$BOT_SERVICE_DIR/ai-training"
DATA_DIR="$TRAINING_DIR/data"
MODELS_DIR="$TRAINING_DIR/models"
LOGS_DIR="$PROJECT_ROOT/logs"
VENV_PATH="$PROJECT_ROOT/venv"

# Helper functions
print_status() { echo -e "${BLUE}[$(date +'%H:%M:%S')] $1${NC}"; }
print_success() { echo -e "${GREEN}[$(date +'%H:%M:%S')] ✅ $1${NC}"; }
print_warning() { echo -e "${YELLOW}[$(date +'%H:%M:%S')] ⚠️  $1${NC}"; }
print_error() { echo -e "${RED}[$(date +'%H:%M:%S')] ❌ $1${NC}"; }
print_header() { echo -e "\n${PURPLE}$1${NC}\n"; }

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Create necessary directories
setup_directories() {
    print_status "Setting up directories..."
    mkdir -p "$DATA_DIR" "$MODELS_DIR" "$LOGS_DIR"
    print_success "Directories created"
}

# Check system requirements
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
        print_error "npm not found"
        exit 1
    fi
    
    # Check Python
    if command_exists python3; then
        PYTHON_VERSION=$(python3 --version)
        print_success "Python found: $PYTHON_VERSION"
    else
        print_error "Python3 not found. Please install Python 3.8+"
        exit 1
    fi
    
    # Check pip3
    if command_exists pip3; then
        print_success "pip3 found"
    else
        print_error "pip3 not found"
        exit 1
    fi
    
    # System resources
    CPU_CORES=$(nproc)
    MEMORY_GB=$(free -g | awk 'NR==2{printf "%.1fGi", $2}')
    print_success "System resources: $CPU_CORES CPU cores, $MEMORY_GB RAM"
}

# Install dependencies
install_dependencies() {
    print_header "📦 INSTALLING DEPENDENCIES"
    
    # Web app dependencies
    print_status "Installing web app dependencies..."
    npm install > "$LOGS_DIR/web-install.log" 2>&1
    print_success "Web app dependencies installed"
    
    # Bot service dependencies
    print_status "Installing bot service dependencies..."
    cd "$BOT_SERVICE_DIR"
    npm install > "$LOGS_DIR/bot-install.log" 2>&1
    print_success "Bot service dependencies installed"
    cd "$PROJECT_ROOT"
    
    # Python virtual environment
    if [ ! -d "$VENV_PATH" ]; then
        print_status "Creating Python virtual environment..."
        python3 -m venv "$VENV_PATH"
        print_success "Virtual environment created"
    fi
    
    # Python AI dependencies
    print_status "Installing Python AI dependencies..."
    source "$VENV_PATH/bin/activate"
    pip install -r "$TRAINING_DIR/requirements.txt" > "$LOGS_DIR/python-install.log" 2>&1
    print_success "Python dependencies installed"
    deactivate
}

# Start bot service
start_bot_service() {
    print_status "Starting AI Bot Service..."
    cd "$BOT_SERVICE_DIR"
    
    # Create .env if it doesn't exist
    if [ ! -f .env ]; then
        cp .env.example .env
        print_status "Created .env file from example"
    fi
    
    # Start bot service in background
    npm run dev > "$LOGS_DIR/bot-service.log" 2>&1 &
    BOT_SERVICE_PID=$!
    echo $BOT_SERVICE_PID > "$LOGS_DIR/bot-service.pid"
    
    print_success "Bot service started (PID: $BOT_SERVICE_PID)"
    cd "$PROJECT_ROOT"
}

# Start web app
start_web_app() {
    print_status "Starting Web App..."
    
    # Start web app in background
    npm run dev > "$LOGS_DIR/web-app.log" 2>&1 &
    WEB_APP_PID=$!
    echo $WEB_APP_PID > "$LOGS_DIR/web-app.pid"
    
    print_success "Web app started (PID: $WEB_APP_PID)"
}

# Start data collection
start_data_collection() {
    print_status "Starting data collection..."
    
    cd "$TRAINING_DIR"
    source "$VENV_PATH/bin/activate"
    
    # Start data collection in background
    python3 data_collector.py > "$LOGS_DIR/data-collection.log" 2>&1 &
    DATA_COLLECTION_PID=$!
    echo $DATA_COLLECTION_PID > "$LOGS_DIR/data-collection.pid"
    
    print_success "Data collection started (PID: $DATA_COLLECTION_PID)"
    deactivate
    cd "$PROJECT_ROOT"
}

# Start model training
start_model_training() {
    print_status "Starting AI model training (this will take 3-6 hours)..."
    
    cd "$TRAINING_DIR"
    source "$VENV_PATH/bin/activate"
    
    # Wait for data collection to complete (check every 30 seconds)
    print_status "Waiting for data collection to complete..."
    while kill -0 $(cat "$LOGS_DIR/data-collection.pid" 2>/dev/null) 2>/dev/null; do
        sleep 30
        print_status "Data collection still running..."
    done
    
    print_success "Data collection completed, starting model training..."
    
    # Start model training in background
    python3 model_trainer.py > "$LOGS_DIR/model-training.log" 2>&1 &
    TRAINING_PID=$!
    echo $TRAINING_PID > "$LOGS_DIR/model-training.pid"
    
    print_success "Model training started (PID: $TRAINING_PID)"
    deactivate
    cd "$PROJECT_ROOT"
}

# Monitor services
monitor_services() {
    print_header "🔍 SYSTEM MONITORING"
    
    while true; do
        clear
        echo -e "${CYAN}=== AI PET DOCTOR - LIVE STATUS ===${NC}"
        echo -e "${CYAN}$(date)${NC}"
        echo -e "${CYAN}Admin Panel: http://localhost:5173/admin (Password: Millie1991)${NC}"
        echo
        
        # Check web app
        if kill -0 $(cat "$LOGS_DIR/web-app.pid" 2>/dev/null) 2>/dev/null; then
            echo -e "${GREEN}✅ Web App: RUNNING${NC} - http://localhost:5173"
        else
            echo -e "${RED}❌ Web App: STOPPED${NC}"
        fi
        
        # Check bot service
        if kill -0 $(cat "$LOGS_DIR/bot-service.pid" 2>/dev/null) 2>/dev/null; then
            echo -e "${GREEN}✅ Bot Service: RUNNING${NC} - http://localhost:3001"
        else
            echo -e "${RED}❌ Bot Service: STOPPED${NC}"
        fi
        
        # Check data collection
        if kill -0 $(cat "$LOGS_DIR/data-collection.pid" 2>/dev/null) 2>/dev/null; then
            echo -e "${YELLOW}🔄 Data Collection: RUNNING${NC}"
        else
            echo -e "${BLUE}📊 Data Collection: COMPLETED${NC}"
        fi
        
        # Check model training
        if kill -0 $(cat "$LOGS_DIR/model-training.pid" 2>/dev/null) 2>/dev/null; then
            echo -e "${YELLOW}🧠 Model Training: RUNNING${NC}"
            
            # Show training progress if available
            if [ -f "$LOGS_DIR/model-training.log" ]; then
                LAST_EPOCH=$(tail -10 "$LOGS_DIR/model-training.log" | grep -o "Epoch [0-9]/[0-9]" | tail -1)
                LAST_LOSS=$(tail -10 "$LOGS_DIR/model-training.log" | grep -o "Loss: [0-9.]*" | tail -1)
                if [ ! -z "$LAST_EPOCH" ]; then
                    echo -e "${CYAN}   Progress: $LAST_EPOCH${NC}"
                fi
                if [ ! -z "$LAST_LOSS" ]; then
                    echo -e "${CYAN}   $LAST_LOSS${NC}"
                fi
            fi
        else
            if [ -f "$MODELS_DIR/config.json" ]; then
                echo -e "${GREEN}🎯 Model Training: COMPLETED${NC}"
            else
                echo -e "${BLUE}⏳ Model Training: WAITING${NC}"
            fi
        fi
        
        echo
        echo -e "${CYAN}=== SYSTEM RESOURCES ===${NC}"
        
        # CPU usage
        CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print 100 - $8}' | cut -d'%' -f1)
        echo -e "${CYAN}CPU Usage: ${CPU_USAGE}%${NC}"
        
        # Memory usage
        MEMORY_INFO=$(free | awk 'NR==2{printf "%.1f/%.1fGB (%.1f%%)", $3/1024/1024, $2/1024/1024, $3*100/$2}')
        echo -e "${CYAN}Memory: $MEMORY_INFO${NC}"
        
        # Disk usage
        DISK_USAGE=$(df -h / | awk 'NR==2 {print $3"/"$2" ("$5")"}')
        echo -e "${CYAN}Disk: $DISK_USAGE${NC}"
        
        echo
        echo -e "${CYAN}=== RECENT LOGS ===${NC}"
        
        # Show recent logs
        if [ -f "$LOGS_DIR/model-training.log" ]; then
            echo -e "${GREEN}Training:${NC}"
            tail -2 "$LOGS_DIR/model-training.log" 2>/dev/null | sed 's/^/  /' || echo "  No recent training logs"
        fi
        
        if [ -f "$LOGS_DIR/bot-service.log" ]; then
            echo -e "${GREEN}Bot Service:${NC}"
            tail -2 "$LOGS_DIR/bot-service.log" 2>/dev/null | sed 's/^/  /' || echo "  No recent bot logs"
        fi
        
        echo
        echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
        echo -e "${CYAN}Logs available in: $LOGS_DIR/${NC}"
        echo -e "${PURPLE}Admin Panel: http://localhost:5173/admin (Password: Millie1991)${NC}"
        
        sleep 5
    done
}

# Cleanup function
cleanup() {
    print_header "🧹 STOPPING ALL SERVICES"
    
    # Stop all background processes
    for pidfile in "$LOGS_DIR"/*.pid; do
        if [ -f "$pidfile" ]; then
            pid=$(cat "$pidfile")
            if kill -0 "$pid" 2>/dev/null; then
                print_status "Stopping process $pid..."
                kill -TERM "$pid" 2>/dev/null || true
                sleep 2
                kill -KILL "$pid" 2>/dev/null || true
            fi
            rm -f "$pidfile"
        fi
    done
    
    print_success "All services stopped"
    exit 0
}

# Show help
show_help() {
    echo -e "${CYAN}AI Pet Doctor - Complete System Startup${NC}"
    echo
    echo -e "${YELLOW}Usage:${NC}"
    echo "  $0 [OPTION]"
    echo
    echo -e "${YELLOW}Options:${NC}"
    echo "  --full          Complete setup: install deps, collect data, train model, start services"
    echo "  --quick         Quick start: just start services (assumes deps are installed)"
    echo "  --services      Start services only"
    echo "  --data          Collect training data only"
    echo "  --train         Train model only (requires data)"
    echo "  --install       Install dependencies only"
    echo "  --status        Show system status"
    echo "  --stop          Stop all services"
    echo "  --help          Show this help message"
    echo
    echo -e "${YELLOW}Admin Panel:${NC}"
    echo "  URL: http://localhost:5173/admin"
    echo "  Password: Millie1991"
    echo
    echo -e "${YELLOW}Examples:${NC}"
    echo "  $0 --full       # Complete first-time setup"
    echo "  $0 --quick      # Daily startup"
    echo "  $0 --services   # Just start web app and bot service"
}

# Stop services
stop_services() {
    cleanup
}

# Show status
show_status() {
    print_header "📊 SYSTEM STATUS"
    
    # Check services
    if kill -0 $(cat "$LOGS_DIR/web-app.pid" 2>/dev/null) 2>/dev/null; then
        print_success "Web App: RUNNING (PID: $(cat "$LOGS_DIR/web-app.pid"))"
    else
        print_warning "Web App: STOPPED"
    fi
    
    if kill -0 $(cat "$LOGS_DIR/bot-service.pid" 2>/dev/null) 2>/dev/null; then
        print_success "Bot Service: RUNNING (PID: $(cat "$LOGS_DIR/bot-service.pid"))"
    else
        print_warning "Bot Service: STOPPED"
    fi
    
    if kill -0 $(cat "$LOGS_DIR/data-collection.pid" 2>/dev/null) 2>/dev/null; then
        print_status "Data Collection: RUNNING (PID: $(cat "$LOGS_DIR/data-collection.pid"))"
    else
        print_success "Data Collection: COMPLETED"
    fi
    
    if kill -0 $(cat "$LOGS_DIR/model-training.pid" 2>/dev/null) 2>/dev/null; then
        print_status "Model Training: RUNNING (PID: $(cat "$LOGS_DIR/model-training.pid"))"
    else
        if [ -f "$MODELS_DIR/config.json" ]; then
            print_success "Model Training: COMPLETED"
        else
            print_warning "Model Training: NOT STARTED"
        fi
    fi
    
    echo
    print_status "Admin Panel: http://localhost:5173/admin (Password: Millie1991)"
    print_status "Logs directory: $LOGS_DIR"
}

# Main execution
main() {
    # Setup signal handlers
    trap cleanup EXIT INT TERM
    
    case "${1:-quick}" in
        --full)
            print_header "🐾 AI PET DOCTOR - COMPLETE SYSTEM SETUP"
            echo -e "${CYAN}Full setup: dependencies, data collection, training, and services${NC}"
            echo -e "${CYAN}Admin Panel Password: Millie1991${NC}"
            echo
            
            setup_directories
            check_requirements
            install_dependencies
            start_bot_service
            start_web_app
            sleep 3
            start_data_collection
            start_model_training
            
            print_success "All services and training started!"
            echo
            echo -e "${GREEN}🌐 Web App: http://localhost:5173${NC}"
            echo -e "${GREEN}🎛️ Admin Panel: http://localhost:5173/admin${NC}"
            echo -e "${GREEN}🔑 Admin Password: Millie1991${NC}"
            echo -e "${GREEN}🤖 Bot API: http://localhost:3001${NC}"
            echo -e "${YELLOW}🧠 Training: Running in background (3-6 hours)${NC}"
            echo
            
            monitor_services
            ;;
        --quick)
            print_header "🐾 AI PET DOCTOR - QUICK START"
            echo -e "${CYAN}Starting services with existing setup${NC}"
            echo -e "${CYAN}Admin Panel Password: Millie1991${NC}"
            echo
            
            setup_directories
            start_bot_service
            start_web_app
            
            sleep 2
            
            print_success "Services started!"
            echo
            echo -e "${GREEN}🌐 Web App: http://localhost:5173${NC}"
            echo -e "${GREEN}🎛️ Admin Panel: http://localhost:5173/admin${NC}"
            echo -e "${GREEN}🔑 Admin Password: Millie1991${NC}"
            echo -e "${GREEN}🤖 Bot API: http://localhost:3001${NC}"
            echo
            
            monitor_services
            ;;
        --services)
            print_header "🚀 STARTING SERVICES ONLY"
            setup_directories
            start_bot_service
            start_web_app
            print_success "Services started!"
            monitor_services
            ;;
        --data)
            print_header "📊 COLLECTING TRAINING DATA"
            setup_directories
            start_data_collection
            print_success "Data collection started!"
            ;;
        --train)
            print_header "🧠 TRAINING AI MODEL"
            setup_directories
            start_model_training
            print_success "Model training started!"
            ;;
        --install)
            print_header "📦 INSTALLING DEPENDENCIES"
            setup_directories
            check_requirements
            install_dependencies
            print_success "Dependencies installed!"
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
echo -e "${PURPLE}Admin Panel Password: Millie1991${NC}"
echo

# Run main function
main "$@"