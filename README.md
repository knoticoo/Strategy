# 🧠💰 AI Budget & Deals Assistant for Latvia

**Your intelligent financial companion that speaks Latvian, Russian, and English!**

A revolutionary React-powered web application that combines artificial intelligence with real-time data to help Latvians save money, track budgets, and discover the best deals across local stores.

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)
![React](https://img.shields.io/badge/React-18.x-blue)
![AI Powered](https://img.shields.io/badge/AI-Powered-purple)
![Multi Language](https://img.shields.io/badge/Languages-3-orange)

## 🚀 **What Makes This Special?**

### 🤖 **Smart AI Assistant**
- **Real NLP**: Uses OpenAI/Groq APIs for intelligent responses
- **Context Awareness**: Understands your budget and spending patterns
- **Multi-language Support**: Fluent in Latvian, Russian, and English
- **Confidence Scoring**: Shows AI response reliability

### 💳 **Real Banking Integration**
- **Revolut API**: Connect your actual bank account
- **Auto-categorization**: AI sorts transactions (food, transport, etc.)
- **Real-time Sync**: Live balance and spending updates
- **Smart Analytics**: Track spending patterns automatically

### 🛒 **Live Market Data**
- **Price Scraping**: Real prices from Maxima, Rimi, Barbora
- **Deal Monitoring**: Live discount tracking
- **Coupon Verification**: Active discount codes
- **Store Comparison**: Find the best prices automatically

### 🎯 **Latvian Market Focus**
- **Local Stores**: Maxima, Rimi, Barbora, Bolt Food, Wolt
- **EUR Currency**: Native euro support
- **Local Language**: Native Latvian and Russian support
- **Market Intelligence**: Understanding of local shopping patterns

## ✨ **Features**

### 📊 **Budget Tracking**
- Daily, weekly, and monthly budget management
- Real-time spending alerts
- AI-powered insights and recommendations
- Category-wise expense breakdown
- Revolut transaction auto-import

### 🛍️ **Deals Finder**
- Live price monitoring across stores
- Discount percentage calculations
- Deal expiry tracking
- Store-specific promotions
- Smart price alerts

### 🎫 **Coupon Hunter**
- Active discount code verification
- Success rate tracking
- Auto-expiry management
- Store-specific codes
- Social media monitoring for new codes

### 🤖 **AI Chat Assistant**
- Natural language queries in 3 languages
- Context-aware responses
- Budget analysis and advice
- Meal suggestions with real prices
- Smart shopping recommendations

### 🌍 **Multi-language Support**
- **English**: Full interface and AI responses
- **Latvian**: Complete localization
- **Russian**: Native language support
- **Auto-detection**: Smart language detection from user input

## 🛠️ **Technology Stack**

### **Frontend**
- **React 18** with TypeScript
- **Tailwind CSS** for modern UI
- **i18next** for internationalization
- **Lucide React** for icons
- **Responsive Design** (mobile-friendly)

### **AI & APIs**
- **OpenAI GPT-3.5-turbo** for intelligent responses
- **Groq API** as free alternative
- **Revolut Business API** for banking
- **Custom scraping services** for prices

### **Data Sources**
- **Maxima**: Web scraping + API (when available)
- **Rimi**: Store API integration
- **Barbora**: RSS/XML feeds
- **Coupon sites**: Multiple aggregators
- **Social media**: Real-time code monitoring

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 16+ and npm
- Modern web browser
- (Optional) API keys for enhanced features

### **Installation**

```bash
# Clone the repository
git clone https://github.com/knoticoo/Strategy.git
cd Strategy

# Install dependencies
npm install

# Start development server
npm start
```

The app will open at `http://localhost:3000`

### **Environment Setup**

Create a `.env` file in the project root:

```bash
# AI Services (Optional - has fallbacks)
REACT_APP_OPENAI_API_KEY=your_openai_key_here
REACT_APP_GROQ_API_KEY=your_groq_key_here

# Revolut Integration (Optional)
REACT_APP_REVOLUT_CLIENT_ID=your_revolut_client_id
REACT_APP_REVOLUT_CLIENT_SECRET=your_revolut_secret
REACT_APP_REVOLUT_SANDBOX=true

# Store APIs (Optional - uses scraping fallback)
REACT_APP_MAXIMA_API_KEY=your_maxima_key
REACT_APP_RIMI_API_KEY=your_rimi_key

# Coupon Services (Optional)
REACT_APP_HONEY_API_KEY=your_honey_key
REACT_APP_RETAILMENOT_API_KEY=your_rmn_key
```

**Note**: The app works without API keys using intelligent fallbacks and mock data.

## 📱 **Usage Examples**

### **Budget Tracking**
```
User: "Cik man šodien atlikts tērēšanai?" (Latvian)
AI: "Pamatojoties uz jūsu budžetu, šodien jums ir atlikuši €15. 
     Vai vēlaties, lai es ieteiktu, kā labāk izmantot šo naudu?"
```

### **Meal Suggestions**
```
User: "Find me food for €7"
AI: "For €7 you can get:
     • Pasta with tomato sauce (€4.50) - Maxima
     • Chicken salad (€6.20) - Rimi
     • Soup + bread (€5.80) - Barbora"
```

### **Deal Finding**
```
User: "Какие лучшие акции в Maxima?" (Russian)
AI: "Сегодняшние лучшие акции в Maxima:
     • Молоко 2.5% - €0.99 (было €1.49) - скидка 34%
     • Свежий хлеб - €0.79 (было €1.19) - скидка 34%"
```

## 🔧 **Development**

### **Available Scripts**

```bash
# Development server
npm start

# Production build
npm run build

# Run tests
npm test

# Code linting
npm run lint
```

### **Project Structure**

```
src/
├── components/           # React components
│   ├── BudgetTab.tsx    # Budget tracking
│   ├── DealsTab.tsx     # Deals finder
│   ├── CouponsTab.tsx   # Coupon manager
│   └── ChatTab.tsx      # AI assistant
├── services/            # API integrations
│   ├── aiService.ts     # AI responses
│   ├── revolutService.ts # Banking
│   ├── priceScrapingService.ts # Prices
│   └── couponService.ts # Coupons
├── i18n/               # Translations
│   └── config.ts       # i18n setup
└── types/              # TypeScript types
```

## 🌐 **Deployment**

### **Production Build**

```bash
npm run build
```

### **Static Hosting** (Netlify, Vercel, GitHub Pages)

```bash
# Build and deploy
npm run build
# Upload the 'build' folder to your hosting provider
```

### **Ubuntu Server Setup**

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
npm install -g pm2

# Clone and setup
git clone https://github.com/knoticoo/Strategy.git
cd Strategy
npm install
npm run build

# Serve with PM2
pm2 serve build 3000 --name "budget-app"
pm2 startup
pm2 save
```

## 🔍 **How Real Data Integration Works**

### **Price Scraping Methods**

1. **Web Scraping**: CORS proxy + HTML parsing
2. **Store APIs**: Official APIs when available
3. **RSS Feeds**: XML parsing for deals
4. **Rate Limited**: Respectful scraping patterns

### **Coupon Collection**

1. **Store APIs**: Official coupon endpoints
2. **Aggregator APIs**: Honey, RetailMeNot
3. **Social Media**: Twitter/Facebook monitoring
4. **Verification**: Real-time code testing

### **Banking Integration**

1. **OAuth2 Flow**: Secure Revolut authentication
2. **Transaction Sync**: Real-time import
3. **Auto-categorization**: AI-powered sorting
4. **Privacy**: Local storage only

## 🛡️ **Privacy & Security**

- **Local Storage**: All data stored in browser
- **No User Tracking**: Privacy-first design
- **Secure APIs**: OAuth2 and HTTPS only
- **Open Source**: Transparent codebase

## 🤝 **Contributing**

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md).

### **Development Setup**

```bash
# Fork the repository
git clone https://github.com/your-username/Strategy.git
cd Strategy

# Create feature branch
git checkout -b feature/amazing-feature

# Make changes and commit
git commit -m 'Add amazing feature'

# Push and create PR
git push origin feature/amazing-feature
```

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **OpenAI** for GPT-3.5-turbo API
- **Revolut** for Banking API
- **Latvian Stores** for market data
- **React Community** for amazing tools
- **Contributors** who make this better

## 📞 **Support**

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/knoticoo/Strategy/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/knoticoo/Strategy/discussions)
- 📧 **Contact**: Open an issue for support

---

**Made with ❤️ for the Latvian community**

*Smart budgeting, real deals, one conversation at a time.* 🚀
