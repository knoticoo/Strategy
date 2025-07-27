#!/bin/bash

# 🚀 Budget & House Finder App - Ubuntu Quick Start
# This script will install dependencies and start the app automatically

set -e  # Exit on any error

echo "🐧 Budget & House Finder App - Ubuntu Setup"
echo "============================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root for security reasons."
   print_warning "Please run as a regular user. The script will ask for sudo when needed."
   exit 1
fi

# Update system packages
print_status "Updating system packages..."
sudo apt update -qq

# Check and install Node.js
if ! command -v node &> /dev/null; then
    print_status "Node.js not found. Installing Node.js 18..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - > /dev/null 2>&1
    sudo apt-get install -y nodejs > /dev/null 2>&1
    print_success "Node.js installed successfully"
else
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt "16" ]; then
        print_warning "Node.js version is too old. Installing Node.js 18..."
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - > /dev/null 2>&1
        sudo apt-get install -y nodejs > /dev/null 2>&1
        print_success "Node.js updated successfully"
    else
        print_success "Node.js $(node --version) is already installed"
    fi
fi

# Install build tools if needed
if ! dpkg -l | grep -q build-essential; then
    print_status "Installing build tools..."
    sudo apt install -y build-essential > /dev/null 2>&1
    print_success "Build tools installed"
fi

# Install Git if needed
if ! command -v git &> /dev/null; then
    print_status "Installing Git..."
    sudo apt install -y git > /dev/null 2>&1
    print_success "Git installed"
fi

# Clone or navigate to project
PROJECT_DIR="$HOME/budget-house-app"

if [ ! -d "$PROJECT_DIR" ]; then
    print_status "Cloning Budget & House Finder App..."
    git clone https://github.com/knoticoo/Budget.git "$HOME/budget-temp" > /dev/null 2>&1
    mv "$HOME/budget-temp/budget-house-app" "$PROJECT_DIR"
    rm -rf "$HOME/budget-temp"
    print_success "Project cloned successfully"
else
    print_success "Project directory already exists"
fi

# Navigate to project directory
cd "$PROJECT_DIR"

# Install dependencies
if [ ! -d "node_modules" ]; then
    print_status "Installing project dependencies... (this may take a few minutes)"
    npm install > /dev/null 2>&1
    print_success "Dependencies installed successfully"
else
    print_success "Dependencies already installed"
fi

# Set up environment file
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        print_success "Environment file created from template"
    fi
fi

# Check if port 3000 is available
if lsof -Pi :3000 -sTCP:LISTEN -t > /dev/null 2>&1; then
    print_warning "Port 3000 is already in use. The app will try to use the next available port."
fi

# Create desktop shortcut
DESKTOP_FILE="$HOME/Desktop/Budget-House-App.desktop"
if [ -d "$HOME/Desktop" ] && [ ! -f "$DESKTOP_FILE" ]; then
    cat > "$DESKTOP_FILE" << EOF
[Desktop Entry]
Version=1.0
Type=Application
Name=Budget & House Finder
Comment=Budget management and house searching app
Exec=bash -c 'cd $PROJECT_DIR && npm start'
Icon=$PROJECT_DIR/public/logo192.png
Terminal=true
Categories=Office;Finance;
StartupNotify=true
EOF
    chmod +x "$DESKTOP_FILE"
    print_success "Desktop shortcut created"
fi

# Create start script
START_SCRIPT="$PROJECT_DIR/start.sh"
cat > "$START_SCRIPT" << 'EOF'
#!/bin/bash
cd "$(dirname "$0")"
echo "🚀 Starting Budget & House Finder App..."
echo "📱 The app will open in your browser at http://localhost:3000"
echo "⏹️  Press Ctrl+C to stop the app"
echo ""
npm start
EOF
chmod +x "$START_SCRIPT"

print_success "Setup completed successfully!"
echo ""
echo "🎉 Budget & House Finder App is ready!"
echo "📍 Project location: $PROJECT_DIR"
echo ""
echo "🚀 Starting the app now..."
echo "📱 The app will open in your browser at http://localhost:3000"
echo "⏹️  Press Ctrl+C to stop the app"
echo ""

# Start the app
npm start