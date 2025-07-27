#!/bin/bash

# 🐧 Ubuntu Complete Setup Script - Budget & Property Hub Latvia
# This script automates the complete setup process

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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
   print_error "This script should not be run as root. Run as a regular user with sudo privileges."
   exit 1
fi

# Get domain name from user
echo "🏠💰 Enhanced Budget & Property Hub Latvia - Ubuntu Setup"
echo "========================================================"
echo ""
read -p "Enter your domain name (e.g., budgethub.lv) or press Enter to skip: " DOMAIN_NAME
read -p "Enter your email for SSL certificate (or press Enter to skip): " EMAIL

print_status "Starting Ubuntu setup for Budget & Property Hub Latvia..."

# Step 1: Update system
print_status "Step 1: Updating system packages..."
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release htop

print_success "System updated successfully!"

# Step 2: Configure firewall
print_status "Step 2: Configuring firewall..."
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3000

print_success "Firewall configured!"

# Step 3: Install Node.js
print_status "Step 3: Installing Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify Node.js installation
NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)
print_success "Node.js $NODE_VERSION and npm $NPM_VERSION installed!"

# Step 4: Install global packages
print_status "Step 4: Installing global packages (PM2, serve)..."
sudo npm install -g pm2 serve

print_success "Global packages installed!"

# Step 5: Clone repository
print_status "Step 5: Cloning Budget & Property Hub Latvia repository..."
cd ~
if [ -d "Strategy" ]; then
    print_warning "Strategy directory already exists. Updating..."
    cd Strategy
    git pull origin main
else
    git clone https://github.com/knoticoo/Strategy.git
    cd Strategy
fi

print_success "Repository cloned/updated!"

# Step 6: Install dependencies
print_status "Step 6: Installing application dependencies..."
if [ -f "package.json" ]; then
    npm install
    print_success "Dependencies installed!"
else
    print_error "package.json not found. Make sure you're in the correct directory."
    exit 1
fi

# Step 7: Create environment file
print_status "Step 7: Setting up environment configuration..."
if [ -f ".env.example" ]; then
    cp .env.example .env
    print_success "Environment file created!"
else
    print_warning ".env.example not found, creating basic .env file..."
    cat > .env << EOL
REACT_APP_APP_NAME=Budget Hub Latvia
REACT_APP_VERSION=2.0.0
REACT_APP_ENVIRONMENT=production
EOL
fi

# Step 8: Build application
print_status "Step 8: Building production application..."
npm run build

if [ -d "build" ]; then
    print_success "Application built successfully!"
else
    print_error "Build failed. Check the error messages above."
    exit 1
fi

# Step 9: Create PM2 ecosystem
print_status "Step 9: Setting up PM2 process manager..."
cat > ecosystem.config.js << 'EOL'
module.exports = {
  apps: [{
    name: 'budget-hub-latvia',
    script: 'serve',
    args: '-s build -p 3000',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    }
  }]
}
EOL

# Start application with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup

print_success "PM2 configured and application started!"

# Step 10: Install and configure Nginx (if domain provided)
if [ ! -z "$DOMAIN_NAME" ]; then
    print_status "Step 10: Installing and configuring Nginx..."
    sudo apt install -y nginx
    
    # Create Nginx configuration
    sudo tee /etc/nginx/sites-available/budget-hub > /dev/null << EOL
server {
    listen 80;
    server_name $DOMAIN_NAME www.$DOMAIN_NAME;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # PWA Service Worker
        location /sw.js {
            add_header Cache-Control "no-cache";
            proxy_cache_bypass \$http_pragma;
            proxy_cache_revalidate on;
            expires off;
            access_log off;
        }
    }
    
    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
    
    # Manifest and other PWA files
    location /manifest.json {
        add_header Cache-Control "no-cache";
        access_log off;
    }
}
EOL
    
    # Enable site
    sudo ln -s /etc/nginx/sites-available/budget-hub /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default
    
    # Test and restart Nginx
    sudo nginx -t && sudo systemctl restart nginx
    sudo systemctl enable nginx
    
    print_success "Nginx configured for domain: $DOMAIN_NAME"
    
    # Step 11: Install SSL certificate (if email provided)
    if [ ! -z "$EMAIL" ]; then
        print_status "Step 11: Installing SSL certificate..."
        sudo apt install -y certbot python3-certbot-nginx
        
        # Get SSL certificate
        sudo certbot --nginx -d $DOMAIN_NAME -d www.$DOMAIN_NAME --email $EMAIL --agree-tos --non-interactive
        
        # Setup auto-renewal
        (sudo crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | sudo crontab -
        
        print_success "SSL certificate installed and auto-renewal configured!"
    else
        print_warning "No email provided, skipping SSL certificate installation."
        print_warning "You can install SSL later with: sudo certbot --nginx -d $DOMAIN_NAME"
    fi
else
    print_warning "No domain provided, skipping Nginx and SSL setup."
    print_warning "Your app is running on http://your-server-ip:3000"
fi

# Step 12: Create backup script
print_status "Step 12: Setting up automatic backups..."
cat > ~/backup.sh << 'EOL'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/ubuntu/backups"

mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/budget-hub-$DATE.tar.gz -C /home/ubuntu Strategy
if [ -f "/etc/nginx/sites-available/budget-hub" ]; then
    sudo cp /etc/nginx/sites-available/budget-hub $BACKUP_DIR/nginx-config-$DATE
fi
find $BACKUP_DIR -name "budget-hub-*.tar.gz" -mtime +7 -delete
echo "Backup completed: $DATE"
EOL

chmod +x ~/backup.sh
(crontab -l 2>/dev/null; echo "0 2 * * * /home/ubuntu/backup.sh") | crontab -

print_success "Backup system configured!"

# Final status check
print_status "Performing final system check..."

# Check PM2 status
PM2_STATUS=$(pm2 status | grep budget-hub-latvia | grep online || echo "not running")
if [[ $PM2_STATUS == *"online"* ]]; then
    print_success "✅ Application is running successfully!"
else
    print_error "❌ Application is not running. Check PM2 logs: pm2 logs budget-hub-latvia"
fi

# Check Nginx status
if [ ! -z "$DOMAIN_NAME" ]; then
    if sudo systemctl is-active --quiet nginx; then
        print_success "✅ Nginx is running successfully!"
    else
        print_error "❌ Nginx is not running. Check status: sudo systemctl status nginx"
    fi
fi

# Display final information
echo ""
echo "🎉 Setup Complete! Budget & Property Hub Latvia is ready!"
echo "========================================================"
echo ""
print_success "🚀 Your Enhanced Budget & Property Hub Latvia is now live! 🇱🇻"
echo ""
echo "📊 Application Features:"
echo "  ✅ Smart AI-powered financial insights"
echo "  ✅ Interactive property map with Latvian locations"
echo "  ✅ Mortgage calculator for all major Latvian banks"
echo "  ✅ PWA capabilities (installable, offline-ready)"
echo "  ✅ Professional UI/UX optimized for mobile and desktop"
echo ""
echo "🌐 Access your app:"
if [ ! -z "$DOMAIN_NAME" ]; then
    if [ ! -z "$EMAIL" ]; then
        echo "  📱 Web: https://$DOMAIN_NAME"
        echo "  🔒 SSL: Enabled with auto-renewal"
    else
        echo "  📱 Web: http://$DOMAIN_NAME"
        echo "  🔒 SSL: Not configured (run: sudo certbot --nginx -d $DOMAIN_NAME)"
    fi
else
    echo "  📱 Web: http://$(curl -s ifconfig.me || echo 'your-server-ip'):3000"
fi
echo ""
echo "🔧 Management commands:"
echo "  PM2 status:     pm2 status"
echo "  PM2 logs:       pm2 logs budget-hub-latvia"
echo "  PM2 restart:    pm2 restart budget-hub-latvia"
echo "  View app:       pm2 monit"
if [ ! -z "$DOMAIN_NAME" ]; then
    echo "  Nginx status:   sudo systemctl status nginx"
    echo "  Nginx logs:     sudo tail -f /var/log/nginx/access.log"
fi
echo ""
echo "📋 Next steps:"
echo "  1. Point your domain DNS to this server IP: $(curl -s ifconfig.me || echo 'your-server-ip')"
echo "  2. Test all features in your browser"
echo "  3. Install the PWA on mobile devices"
echo "  4. Monitor performance with: pm2 monit"
echo ""
print_success "Setup completed successfully! 🎯"