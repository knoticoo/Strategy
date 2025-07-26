# 🚀 Deployment Guide - Ubuntu VPS

This guide will help you deploy the AI Art Analyzer on your Ubuntu VPS from scratch.

## 📋 Prerequisites

- Ubuntu 20.04+ VPS with at least 4GB RAM (8GB+ recommended)
- Root or sudo access
- Domain name (optional but recommended)
- OpenAI API key

## 🛠️ Step-by-Step Deployment

### 1. Initial Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y git curl wget htop unzip build-essential
```

### 2. Get the Application Code

```bash
# Clone the repository (replace with your repo URL)
git clone https://github.com/yourusername/ai-art-analyzer.git
cd ai-art-analyzer

# Or upload files via SCP if you don't use Git
# scp -r ./ai-art-analyzer user@your-server-ip:/home/user/
```

### 3. Quick Setup (Automated)

```bash
# Make setup script executable and run
chmod +x setup.sh
./setup.sh
```

This script will:
- Install Python, Docker, and system dependencies
- Set up firewall rules
- Create virtual environment
- Install Python packages

### 4. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit environment file
nano .env
```

Add your configuration:
```env
OPENAI_API_KEY=sk-your-openai-api-key-here
SECRET_KEY=your-random-secret-key-here
FLASK_ENV=production
PORT=5000
```

Generate a secret key:
```bash
python3 -c "import secrets; print(secrets.token_hex(32))"
```

### 5. Deploy with Docker (Recommended)

```bash
# Start the application
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### 6. Alternative: Deploy with Python

```bash
# Activate virtual environment
source venv/bin/activate

# Start with Gunicorn
gunicorn --bind 0.0.0.0:5000 --workers 2 --timeout 120 app:app

# Or use the start script
chmod +x start.sh
./start.sh
```

## 🔧 Manual Configuration

### Nginx Setup (if not using Docker)

```bash
# Install Nginx
sudo apt install nginx

# Copy configuration
sudo cp nginx.conf /etc/nginx/sites-available/ai-art-analyzer
sudo ln -s /etc/nginx/sites-available/ai-art-analyzer /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Firewall Configuration

```bash
# Enable UFW
sudo ufw enable

# Allow necessary ports
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443

# Check status
sudo ufw status
```

### SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate (replace with your domain)
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo crontab -e
# Add this line:
# 0 12 * * * /usr/bin/certbot renew --quiet
```

## 🔄 Process Management

### Using Systemd (for Python deployment)

Create service file:
```bash
sudo nano /etc/systemd/system/ai-art-analyzer.service
```

Add content:
```ini
[Unit]
Description=AI Art Analyzer
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/ai-art-analyzer
Environment=PATH=/path/to/ai-art-analyzer/venv/bin
ExecStart=/path/to/ai-art-analyzer/venv/bin/gunicorn --bind 0.0.0.0:5000 --workers 2 app:app
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl daemon-reload
sudo systemctl enable ai-art-analyzer
sudo systemctl start ai-art-analyzer
sudo systemctl status ai-art-analyzer
```

### Using Docker (Recommended)

Docker automatically handles process management and restarts.

## 📊 Monitoring & Maintenance

### Health Checks

```bash
# Check application health
curl http://localhost/health

# Check Docker containers
docker-compose ps

# Check logs
docker-compose logs -f ai-art-analyzer
```

### Log Management

```bash
# View application logs
docker-compose logs ai-art-analyzer

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Rotate logs (add to crontab)
0 0 * * * /usr/sbin/logrotate /etc/logrotate.conf
```

### Backup Strategy

```bash
# Backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup application code
tar -czf $BACKUP_DIR/ai-art-analyzer_$DATE.tar.gz /path/to/ai-art-analyzer

# Backup environment file
cp /path/to/ai-art-analyzer/.env $BACKUP_DIR/env_$DATE.backup

# Clean old backups (keep last 7 days)
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
```

## 🔧 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Find process using port 5000
sudo lsof -i :5000

# Kill process
sudo kill -9 <PID>
```

#### Docker Issues
```bash
# Restart Docker service
sudo systemctl restart docker

# Clean up containers
docker-compose down
docker system prune -a

# Rebuild containers
docker-compose up --build -d
```

#### Memory Issues
```bash
# Check memory usage
free -h
df -h

# Add swap space if needed
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

#### SSL Issues
```bash
# Renew certificate manually
sudo certbot renew

# Check certificate expiry
sudo certbot certificates
```

### Performance Optimization

#### For High Traffic
```bash
# Increase worker processes in gunicorn
gunicorn --bind 0.0.0.0:5000 --workers 4 --timeout 120 app:app

# Use Redis for caching (optional)
docker run -d --name redis -p 6379:6379 redis:alpine
```

#### For Large Models
```bash
# Increase Docker memory limit
# Edit docker-compose.yml and add:
# mem_limit: 8g
```

## 🔄 Updates

### Updating the Application

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose up --build -d

# Or for Python deployment
source venv/bin/activate
pip install -r requirements.txt
sudo systemctl restart ai-art-analyzer
```

## 📈 Scaling

### Load Balancing
For high traffic, consider:
- Multiple server instances
- Load balancer (HAProxy/Nginx)
- Container orchestration (Kubernetes)

### Database
For user management and analytics:
- PostgreSQL for user data
- Redis for caching
- S3 for file storage

## 🛡️ Security Checklist

- [ ] Firewall configured (UFW)
- [ ] SSL certificate installed
- [ ] SSH key authentication
- [ ] Regular security updates
- [ ] Strong passwords/API keys
- [ ] Rate limiting enabled
- [ ] File upload restrictions
- [ ] Regular backups

## 📞 Support

If you encounter issues:

1. Check the application logs
2. Verify environment configuration
3. Test API endpoints manually
4. Check system resources
5. Review firewall settings

For additional help, create an issue in the repository with:
- Error messages
- System information
- Steps to reproduce
- Configuration details

---

**Happy Deploying! 🎨**