# 🏠💰 Budget & Property Hub Latvia - Advanced Financial Platform

> **A comprehensive, AI-powered financial platform specifically designed for the Latvian market. Combining smart budget management with advanced property search, mortgage calculations, and market analytics - all with PWA capabilities for mobile use.**

![Latvia](https://img.shields.io/badge/🇱🇻-Latvia-maroon?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![PWA](https://img.shields.io/badge/PWA-Ready-green?style=for-the-badge)

## 🚀 **Live Demo**
**Coming Soon** - Deploy to your preferred platform

## ✨ **Advanced Features**

### 🧠 **AI-Powered Smart Insights**
- **Automated spending analysis** with pattern detection
- **Personalized financial recommendations** 
- **Anomaly detection** for unusual spending patterns
- **Savings optimization** suggestions based on real data
- **Property affordability calculations** based on income
- **Smart financial goals** - Emergency fund and house down payment goals

### 🗺️ **Interactive Property Map**
- **Real Latvian coordinates** for all major cities
- **Interactive property markers** with detailed popups
- **Regional market overlays** showing average prices and growth
- **Quick location buttons** for Rīga, Jūrmala, Liepāja, Daugavpils
- **Price range filtering** to match your budget
- **Mobile-optimized** touch controls

### 🏦 **Comprehensive Mortgage Calculator**
- **All major Latvian banks**: Swedbank, SEB, Luminor, Citadele, Rietumu
- **Real interest rates** and current market terms
- **Advanced affordability analysis** using Latvian banking standards
- **Payment schedules** with year-by-year breakdown
- **Best deal recommendations** automatically sorted by total cost
- **DTI ratio validation** enforcing 40% maximum debt-to-income

### 🔔 **Real-Time Alerts & Notifications**
- **Custom price alerts** for property searches
- **Push notifications** via Service Worker
- **Market trend alerts** when conditions change
- **Background monitoring** even when app is closed
- **Email integration** ready for deployment

### 📈 **Market Intelligence**
- **6-month and 1-year price forecasts** for all regions
- **Investment potential scoring** for properties
- **Market confidence indicators** with AI analysis
- **Buy/wait recommendations** based on market conditions
- **Historical trend analysis** and growth projections

### 🌐 **Real Estate Integration**
- **ss.lv scraping** with respectful rate limiting
- **Advanced search filters** for location, price, area, rooms
- **Property recommendations** based on budget and preferences
- **Market analytics** including price per sqm and days on market
- **Similar property suggestions** using AI matching

### 💳 **Banking Integration**
- **Revolut API** with Latvia-specific endpoints
- **Real-time balance sync** and transaction categorization
- **Multi-currency support** optimized for EUR
- **Secure OAuth flow** with token management
- **Bank-grade security** and error handling

### 📱 **Progressive Web App (PWA)**
- **Full offline functionality** - works without internet
- **Mobile app installation** - add to home screen
- **Background sync** - data syncs when connection returns
- **Push notifications** for important alerts
- **App shortcuts** for quick actions
- **Service Worker** with advanced caching strategies

## 🇱🇻 **Latvian Market Specialization**

### 🏛️ **Banking Integration**
| Bank | Interest Rate | Min Down Payment | Max Term | Processing Fee |
|------|---------------|------------------|----------|----------------|
| **Swedbank** | 4.2% | 15% | 30 years | 0.5% |
| **SEB** | 4.1% | 20% | 30 years | 0.4% |
| **Luminor** | 4.3% | 15% | 25 years | 0.6% |
| **Citadele** | 4.5% | 20% | 30 years | 0.5% |
| **Rietumu** | 4.8% | 25% | 25 years | 0.7% |

### 🏙️ **Regional Coverage**
| Region | Avg Price/sqm | Growth Rate | Investment Score |
|--------|---------------|-------------|------------------|
| **Rīga Centrs** | €2,800 | +5.2% | ⭐⭐⭐⭐⭐ |
| **Jūrmala** | €2,200 | +3.8% | ⭐⭐⭐⭐ |
| **Liepāja** | €1,100 | +2.1% | ⭐⭐⭐ |
| **Daugavpils** | €700 | +1.5% | ⭐⭐ |

## 🛠️ **Tech Stack**

### **Frontend**
- **React 18** with hooks and modern patterns
- **TypeScript 5** for complete type safety
- **Tailwind CSS** for responsive, modern design
- **Recharts** for beautiful data visualizations
- **React Leaflet** for interactive mapping
- **Lucide React** for consistent iconography

### **Services & APIs**
- **Revolut API** integration for banking
- **ss.lv scraping** for real estate data
- **OpenStreetMap** tiles for mapping
- **Web Push API** for notifications
- **Geolocation API** for location services

### **PWA Technologies**
- **Service Worker** for offline functionality
- **Web App Manifest** for installation
- **Push API** for real-time notifications
- **Background Sync** for offline actions
- **Cache API** for performance optimization

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- Modern browser (Chrome 80+, Firefox 74+, Safari 13+)

### **Installation**
```bash
# Clone the repository
git clone https://github.com/knoticoo/Strategy.git
cd Strategy/Budget/budget-house-app

# Install dependencies
npm install

# Start development server
npm start

# Open http://localhost:3000
```

### **Production Build**
```bash
# Create optimized build
npm run build

# Serve with any static server
npx serve -s build
```

## 📱 **PWA Installation**

### **Mobile (iOS/Android)**
1. Open the app in your mobile browser
2. Look for "Add to Home Screen" prompt
3. The app installs like a native app
4. Enjoy offline functionality and push notifications

### **Desktop**
1. Open in Chrome/Edge/Firefox
2. Click the install icon in the address bar
3. App opens in its own window
4. Full desktop app experience

## 🌍 **Deployment Options**

### **Vercel (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### **Netlify**
```bash
# Build
npm run build

# Drag and drop the build folder to Netlify
```

### **Ubuntu VPS**
```bash
# Use the included script
chmod +x ubuntu-quick-start.sh
./ubuntu-quick-start.sh
```

## 📊 **Performance**

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **First Contentful Paint**: <1.5s
- **Largest Contentful Paint**: <2.5s
- **Cumulative Layout Shift**: <0.1
- **Time to Interactive**: <3s

## 🔐 **Security & Privacy**

- **No hardcoded API keys** - all credentials via environment variables
- **Rate limiting** for all external API calls
- **Input sanitization** and validation
- **Secure token management** for banking APIs
- **HTTPS only** in production
- **Data encryption** for sensitive information

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **Latvian Banking Association** for banking standards
- **ss.lv** for real estate data structure reference
- **OpenStreetMap** contributors for mapping data
- **React community** for excellent libraries and tools

## 📞 **Support**

- **Issues**: [GitHub Issues](https://github.com/knoticoo/Strategy/issues)
- **Discussions**: [GitHub Discussions](https://github.com/knoticoo/Strategy/discussions)
- **Email**: Coming soon

---

**🎉 Built with ❤️ for Latvia 🇱🇻**

*Transform your financial life with AI-powered insights and comprehensive property search, all designed specifically for the Latvian market.*