# 🚀 Enhanced Budget & Property Hub Latvia - Installation Guide

## 📦 Package Contents
Your `Budget-Enhanced-Latvia.zip` contains the complete enhanced application with all advanced features:
- 🧠 Smart AI insights & financial recommendations
- 🗺️ Interactive property map with Leaflet
- 🏦 Latvian bank mortgage calculator
- 🔔 Real-time price alerts & notifications
- 📈 Market trends & forecasting
- 🏠 ss.lv property integration
- 💳 Revolut API for Latvia
- 📱 Full PWA capabilities

## 📋 Installation Steps

### Step 1: Extract the Package
```bash
# Extract to your desired location
unzip Budget-Enhanced-Latvia.zip
cd Budget/budget-house-app
```

### Step 2: Install Dependencies
```bash
# Install Node.js dependencies
npm install

# If you encounter issues, try:
npm install --legacy-peer-deps
```

### Step 3: Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your API keys (optional for demo)
nano .env
```

### Step 4: Start Development Server
```bash
# Start the enhanced app
npm start

# The app will open at http://localhost:3000
```

## 🚀 Production Deployment

### Ubuntu VPS Deployment
```bash
# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install serve globally
sudo npm install -g serve

# Build the app
npm run build

# Serve the app
serve -s build -p 3000
```

### Using the Quick Start Script
```bash
# Make executable and run
chmod +x ubuntu-quick-start.sh
./ubuntu-quick-start.sh
```

## 🔧 Configuration

### API Keys (Optional)
The app works with demo data by default. For real integrations:

**Revolut API (Latvia):**
```env
REACT_APP_REVOLUT_API_URL=https://api.revolut.com
REACT_APP_REVOLUT_CLIENT_ID=your_client_id
REACT_APP_REVOLUT_CLIENT_SECRET=your_client_secret
```

**Notification Setup:**
- Push notifications work automatically
- Service Worker provides offline functionality
- PWA can be installed on mobile devices

## 📱 PWA Installation

### Mobile Installation
1. Open the app in mobile browser
2. Look for "Add to Home Screen" prompt
3. The app installs like a native app
4. Works offline with cached data

### Desktop Installation
1. Open in Chrome/Edge
2. Click install icon in address bar
3. App opens in standalone window
4. Full desktop app experience

## 🎯 Features Overview

### Smart Insights
- Analyzes your spending patterns
- Provides AI-powered recommendations
- Calculates property affordability
- Suggests savings goals

### Property Search
- Interactive map with Latvian properties
- Real ss.lv data structure
- Advanced filtering options
- Price alerts and notifications

### Mortgage Calculator
- All major Latvian banks
- Real interest rates and terms
- Payment schedules
- Best deal recommendations

### Market Analytics
- Regional price trends
- Market forecasts
- Investment potential scoring
- Growth rate analysis

## 🌍 Latvian Market Features

### Banking Integration
- **Swedbank** - 4.2% mortgage rate
- **SEB** - 4.1% mortgage rate  
- **Luminor** - 4.3% mortgage rate
- **Citadele** - 4.5% mortgage rate
- **Rietumu** - 4.8% mortgage rate

### Regional Data
- **Rīga Centrs** - €2,800/sqm average
- **Jūrmala** - €2,200/sqm average
- **Liepāja** - €1,100/sqm average
- **Daugavpils** - €700/sqm average

## 🔧 Troubleshooting

### Common Issues

**Node.js Version:**
```bash
# Check Node.js version (requires 16+)
node --version

# Update if needed
sudo npm install -g n
sudo n latest
```

**Permission Issues:**
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules
```

**Port Conflicts:**
```bash
# Use different port
npm start -- --port 3001
```

**Build Issues:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📊 Performance Tips

### Optimization
- Service Worker caches static assets
- API responses cached for 5 minutes
- Lazy loading for better performance
- Mobile-optimized for all devices

### Monitoring
- Check browser console for errors
- Service Worker status in DevTools
- Network tab for API performance
- Lighthouse for PWA score

## 🚀 Going Live

### Domain Setup
1. Purchase domain (e.g., budgethub.lv)
2. Point to your server IP
3. Setup SSL certificate
4. Configure reverse proxy (nginx/Apache)

### Real API Integration
1. Register with Revolut Developer Portal
2. Get ss.lv scraping permissions
3. Setup proper API rate limiting
4. Configure notification services

## 📞 Support

For any issues or questions:
1. Check the console for error messages
2. Verify all dependencies are installed
3. Ensure Node.js version 16+ is used
4. Check network connectivity for API calls

The app is designed to work with demo data even without API keys, so you can explore all features immediately!

---

**🎉 Enjoy your enhanced Budget & Property Hub Latvia!** 🇱🇻✨