# 🐧 Ubuntu Fresh Install Setup - Budget & Property Hub Latvia

> **Complete setup guide for deploying the Enhanced Budget & Property Hub Latvia on a fresh Ubuntu server**

## 🎯 **What You'll Get:**
- **Professional financial platform** for the Latvian market
- **AI-powered insights** and spending analysis
- **Interactive property map** with mortgage calculator
- **PWA capabilities** (offline, installable)
- **Production-ready** with HTTPS and domain

---

## 🚀 **Step 1: Initial Server Setup**

### **Update System**
```bash
# Update package lists and upgrade system
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release
```

### **Create User (if needed)**
```bash
# Create new user (optional, skip if using root)
sudo adduser budgetapp
sudo usermod -aG sudo budgetapp
su - budgetapp
```

### **Configure Firewall**
```bash
# Enable UFW firewall
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3000
sudo ufw status
```

---

## 📦 **Step 2: Install Node.js 18+**

### **Method 1: NodeSource Repository (Recommended)**
```bash
# Add NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Install Node.js
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should show v18.x.x
npm --version   # Should show 9.x.x or higher
```

### **Method 2: Using Snap (Alternative)**
```bash
# Install Node.js via Snap
sudo snap install node --classic

# Verify
node --version
npm --version
```

### **Install Global Packages**
```bash
# Install global packages for production
sudo npm install -g pm2 serve yarn

# Verify PM2 installation
pm2 --version
```

---

## 📥 **Step 3: Download & Setup Application**

### **Clone Repository**
```bash
# Navigate to home directory
cd ~

# Clone the Strategy repository
git clone https://github.com/knoticoo/Strategy.git

# Navigate to project
cd Strategy

# Check if files are there
ls -la
```

### **Install Dependencies**
```bash
# Install all npm dependencies
npm install

# If you encounter permission issues:
sudo chown -R $(whoami) ~/.npm
npm install

# For legacy dependency issues:
npm install --legacy-peer-deps
```

### **Environment Setup**
```bash
# Copy environment template
cp .env.example .env

# Edit environment file (optional - app works with demo data)
nano .env
```

**Add these variables to `.env` (optional):**
```env
# Revolut API (optional - demo data included)
REACT_APP_REVOLUT_API_URL=https://api.revolut.com
REACT_APP_REVOLUT_CLIENT_ID=your_client_id_here

# App Configuration
REACT_APP_APP_NAME=Budget Hub Latvia
REACT_APP_VERSION=2.0.0
REACT_APP_ENVIRONMENT=production
```

---

## 🔨 **Step 4: Build Application**

### **Development Build (for testing)**
```bash
# Start development server
npm start

# App will be available at http://your-server-ip:3000
# Test it in browser, then stop with Ctrl+C
```

### **Production Build**
```bash
# Create optimized production build
npm run build

# Verify build was created
ls -la build/

# Test production build locally
npx serve -s build -p 3000
```

---

## 🌐 **Step 5: Production Deployment**

### **Option A: Using PM2 (Recommended)**
```bash
# Install serve globally if not done
sudo npm install -g serve

# Create PM2 ecosystem file
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

# Save PM2 configuration
pm2 save

# Enable PM2 startup on boot
pm2 startup
# Follow the instructions shown by the command above
```

### **Option B: Using Systemd Service**
```bash
# Create systemd service file
sudo cat > /etc/systemd/system/budget-hub.service << 'EOL'
[Unit]
Description=Budget Hub Latvia
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/Strategy
ExecStart=/usr/bin/npx serve -s build -p 3000
Restart=on-failure
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOL

# Enable and start service
sudo systemctl enable budget-hub
sudo systemctl start budget-hub
sudo systemctl status budget-hub
```

---

## 🔐 **Step 6: Install & Configure Nginx**

### **Install Nginx**
```bash
# Install Nginx
sudo apt install -y nginx

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
sudo systemctl status nginx
```

### **Configure Nginx**
```bash
# Create Nginx configuration
sudo cat > /etc/nginx/sites-available/budget-hub << 'EOL'
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;  # Replace with your domain
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;  # Replace with your domain
    
    # SSL Configuration (will be added by Certbot)
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Main application
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # PWA Service Worker
        location /sw.js {
            add_header Cache-Control "no-cache";
            proxy_cache_bypass $http_pragma;
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

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

---

## 🔒 **Step 7: SSL Certificate with Let's Encrypt**

### **Install Certbot**
```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate (replace with your domain)
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Follow the prompts:
# 1. Enter email address
# 2. Agree to terms
# 3. Choose whether to share email with EFF
# 4. Certificate will be automatically configured

# Test SSL renewal
sudo certbot renew --dry-run
```

### **Auto-renewal Setup**
```bash
# Create renewal cron job
sudo crontab -e

# Add this line to crontab:
0 12 * * * /usr/bin/certbot renew --quiet
```

---

## 🌍 **Step 8: Domain Configuration**

### **DNS Setup**
1. **Go to your domain registrar** (Namecheap, GoDaddy, etc.)
2. **Set A Records:**
   ```
   @ (root)    →  Your-Server-IP
   www         →  Your-Server-IP
   ```
3. **Wait for DNS propagation** (5-60 minutes)

### **Test Domain**
```bash
# Test domain resolution
nslookup your-domain.com
ping your-domain.com

# Check if site is accessible
curl -I https://your-domain.com
```

---

## 📊 **Step 9: Monitoring & Maintenance**

### **PM2 Monitoring**
```bash
# View application status
pm2 status
pm2 logs budget-hub-latvia
pm2 monit

# Restart application
pm2 restart budget-hub-latvia

# View detailed info
pm2 info budget-hub-latvia
```

### **System Monitoring**
```bash
# Check disk space
df -h

# Check memory usage
free -h

# Check CPU usage
htop  # Install with: sudo apt install htop

# Check Nginx status
sudo systemctl status nginx

# Check Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### **Application Logs**
```bash
# PM2 logs
pm2 logs --lines 100

# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# System logs
sudo journalctl -u budget-hub -f  # If using systemd
```

---

## 🔄 **Step 10: Updates & Backups**

### **Application Updates**
```bash
# Pull latest changes
cd ~/Strategy
git pull origin main

# Rebuild application
npm run build

# Restart with PM2
pm2 restart budget-hub-latvia
```

### **System Updates**
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Node.js dependencies
npm update

# Update global packages
sudo npm update -g
```

### **Backup Strategy**
```bash
# Create backup script
cat > ~/backup.sh << 'EOL'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/ubuntu/backups"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup application
tar -czf $BACKUP_DIR/budget-hub-$DATE.tar.gz -C /home/ubuntu Strategy

# Backup Nginx config
sudo cp /etc/nginx/sites-available/budget-hub $BACKUP_DIR/nginx-config-$DATE

# Keep only last 7 backups
find $BACKUP_DIR -name "budget-hub-*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
EOL

# Make executable
chmod +x ~/backup.sh

# Add to crontab for daily backups
(crontab -l 2>/dev/null; echo "0 2 * * * /home/ubuntu/backup.sh") | crontab -
```

---

## ✅ **Step 11: Final Verification**

### **Test All Features**
1. **Visit your domain:** `https://your-domain.com`
2. **Test PWA installation:**
   - Mobile: "Add to Home Screen"
   - Desktop: Install icon in browser
3. **Test features:**
   - Budget dashboard with smart insights
   - Property search and map
   - Mortgage calculator
   - Offline functionality
4. **Test performance:**
   - Run Lighthouse audit
   - Check mobile responsiveness

### **Security Check**
```bash
# Check SSL certificate
curl -I https://your-domain.com

# Check open ports
sudo nmap -sT -O localhost

# Check firewall status
sudo ufw status verbose

# Check for updates
sudo apt list --upgradable
```

---

## 🎉 **Congratulations!**

Your **Enhanced Budget & Property Hub Latvia** is now live! 🇱🇻

### **Features Available:**
- ✅ **Smart AI insights** for financial planning
- ✅ **Interactive property map** with Latvian locations
- ✅ **Mortgage calculator** for all major Latvian banks
- ✅ **PWA capabilities** (installable, offline-ready)
- ✅ **Professional UI/UX** optimized for mobile and desktop
- ✅ **HTTPS security** with automatic certificate renewal
- ✅ **Production-grade deployment** with monitoring

### **Access Your App:**
- **Web:** `https://your-domain.com`
- **Mobile:** Install as PWA from browser
- **Desktop:** Install from browser for app-like experience

---

## 🆘 **Troubleshooting**

### **Common Issues:**

**1. App not starting:**
```bash
pm2 logs budget-hub-latvia
npm run build  # Rebuild if needed
```

**2. Nginx errors:**
```bash
sudo nginx -t  # Test configuration
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log
```

**3. SSL issues:**
```bash
sudo certbot certificates  # Check certificate status
sudo certbot renew  # Renew if needed
```

**4. Port 3000 in use:**
```bash
sudo lsof -i :3000  # Check what's using port
pm2 delete all && pm2 start ecosystem.config.js  # Restart PM2
```

**5. Permission errors:**
```bash
sudo chown -R ubuntu:ubuntu ~/Strategy
sudo chmod +x ~/Strategy/*.sh
```

### **Performance Optimization:**
```bash
# Enable Nginx caching
sudo nano /etc/nginx/nginx.conf
# Add: proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=STATIC:10m inactive=7d use_temp_path=off;

# Monitor memory usage
free -h
pm2 info budget-hub-latvia
```

---

**🎯 Your Enhanced Budget & Property Hub Latvia is now running professionally on Ubuntu with HTTPS, monitoring, and automatic backups!** 🚀