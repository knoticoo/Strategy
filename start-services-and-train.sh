#!/bin/bash
# AI Pet Doctor - Start Services + Background Training
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

# Helper functions
print_status() { echo -e "${BLUE}[$(date +'%H:%M:%S')] $1${NC}"; }
print_success() { echo -e "${GREEN}[$(date +'%H:%M:%S')] ✅ $1${NC}"; }
print_warning() { echo -e "${YELLOW}[$(date +'%H:%M:%S')] ⚠️  $1${NC}"; }
print_error() { echo -e "${RED}[$(date +'%H:%M:%S')] ❌ $1${NC}"; }
print_header() { echo -e "\n${PURPLE}$1${NC}\n"; }

# Create necessary directories
setup_directories() {
    print_status "Setting up directories..."
    mkdir -p "$DATA_DIR" "$MODELS_DIR" "$LOGS_DIR"
    print_success "Directories created"
}

# Start bot service
start_bot_service() {
    print_status "Starting AI Bot Service..."
    cd "$BOT_SERVICE_DIR"
    
    # Create basic .env if it doesn't exist
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

# Start data collection in background
start_data_collection() {
    print_status "Starting data collection in background..."
    
    cd "$TRAINING_DIR"
    source "$PROJECT_ROOT/venv/bin/activate"
    
    # Start data collection
    python3 data_collector.py > "$LOGS_DIR/data-collection.log" 2>&1 &
    DATA_COLLECTION_PID=$!
    echo $DATA_COLLECTION_PID > "$LOGS_DIR/data-collection.pid"
    
    print_success "Data collection started (PID: $DATA_COLLECTION_PID)"
    cd "$PROJECT_ROOT"
}

# Start model training in background
start_model_training() {
    print_status "Starting AI model training in background..."
    
    cd "$TRAINING_DIR"
    source "$PROJECT_ROOT/venv/bin/activate"
    
    # Wait a bit for data collection to start
    sleep 30
    
    # Start model training
    python3 model_trainer.py > "$LOGS_DIR/model-training.log" 2>&1 &
    TRAINING_PID=$!
    echo $TRAINING_PID > "$LOGS_DIR/model-training.pid"
    
    print_success "Model training started (PID: $TRAINING_PID)"
    cd "$PROJECT_ROOT"
}

# Monitor services
monitor_services() {
    print_header "🔍 SERVICE STATUS"
    
    while true; do
        clear
        echo -e "${CYAN}=== AI PET DOCTOR - LIVE STATUS ===${NC}"
        echo -e "${CYAN}$(date)${NC}"
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
        else
            if [ -f "$MODELS_DIR/veterinary-ai-model" ]; then
                echo -e "${GREEN}🎯 Model Training: COMPLETED${NC}"
            else
                echo -e "${BLUE}⏳ Model Training: WAITING${NC}"
            fi
        fi
        
        echo
        echo -e "${CYAN}=== RECENT LOGS ===${NC}"
        
        # Show recent web app logs
        if [ -f "$LOGS_DIR/web-app.log" ]; then
            echo -e "${GREEN}Web App:${NC}"
            tail -3 "$LOGS_DIR/web-app.log" 2>/dev/null | sed 's/^/  /'
        fi
        
        # Show recent bot service logs
        if [ -f "$LOGS_DIR/bot-service.log" ]; then
            echo -e "${GREEN}Bot Service:${NC}"
            tail -3 "$LOGS_DIR/bot-service.log" 2>/dev/null | sed 's/^/  /'
        fi
        
        # Show recent training logs
        if [ -f "$LOGS_DIR/model-training.log" ]; then
            echo -e "${GREEN}Training:${NC}"
            tail -3 "$LOGS_DIR/model-training.log" 2>/dev/null | sed 's/^/  /'
        fi
        
        echo
        echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
        echo -e "${CYAN}Logs available in: $LOGS_DIR/${NC}"
        
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

# Main execution
main() {
    # Setup signal handlers
    trap cleanup EXIT INT TERM
    
    print_header "🐾 AI PET DOCTOR - SERVICES + BACKGROUND TRAINING"
    echo -e "${CYAN}Starting services immediately while training in background${NC}"
    echo
    
    # Setup
    setup_directories
    
    # Start services immediately
    print_header "🚀 STARTING SERVICES"
    start_bot_service
    start_web_app
    
    # Wait a moment for services to start
    sleep 3
    
    # Start background training
    print_header "🧠 STARTING BACKGROUND TRAINING"
    start_data_collection
    start_model_training
    
    sleep 2
    
    # Show initial status
    print_success "All services and training started!"
    echo
    echo -e "${GREEN}🌐 Web App: http://localhost:5173${NC}"
    echo -e "${GREEN}🤖 Bot API: http://localhost:3001${NC}"
    echo -e "${YELLOW}🧠 Training: Running in background (3-6 hours)${NC}"
    echo
    
    # Start monitoring
    monitor_services
}

# Run main function
main "$@"