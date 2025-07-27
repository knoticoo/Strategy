# 🏠💰 Budget & Property Hub Latvia - Advanced Edition

A comprehensive, AI-powered financial platform specifically designed for the Latvian market. Combining smart budget management with advanced property search, mortgage calculations, and market analytics - all with PWA capabilities for mobile use.

## 🚀 **NEW ADVANCED FEATURES** 

### 🧠 **AI-Powered Smart Insights**
- **Automated spending analysis** with pattern detection
- **Personalized financial recommendations** 
- **Anomaly detection** for unusual spending patterns
- **Savings optimization** suggestions
- **Property affordability calculations** based on income

### 🏠 **Enhanced Property Search & Analytics**
- **Real ss.lv integration** with advanced scraping
- **Interactive property map** with Latvian coordinates
- **Comprehensive mortgage calculator** for all major Latvian banks (Swedbank, SEB, Luminor, Citadele, Rietumu)
- **Market trend analysis** and price forecasting
- **Price alerts** with push notifications
- **Property recommendations** based on budget and preferences

### 🏦 **Latvian Banking Integration**
- **Real Revolut API** connection for Latvia
- **Multi-bank mortgage comparison** with current rates
- **Affordability calculator** using Latvian banking standards
- **DTI ratio analysis** (max 40% as per LV regulations)
- **Smart loan recommendations**

### 📱 **Progressive Web App (PWA)**
- **Offline functionality** with service worker
- **Push notifications** for price alerts
- **Mobile app-like experience**
- **Background sync** for transactions
- **Installable** on mobile devices

### 📊 **Market Intelligence**
- **Real-time market trends** for Latvian regions
- **Price growth predictions** with confidence levels
- **Investment potential scoring**
- **Regional comparison** (Rīga, Jūrmala, Liepāja, etc.)
- **Buy/wait recommendations** based on market analysis

## Features

### 💰 Budget Management
- **Transaction Tracking**: Add income and expenses with categories
- **Visual Analytics**: Pie charts and bar charts for expense distribution
- **Budget Overview**: Set budgets per category and track spending
- **Revolut Integration**: Connect your Revolut account (mock implementation)
- **Real-time Balance**: See your total balance and financial overview

### 🏠 House Search
- **Price Filtering**: Set maximum price (e.g., €40,000) to find affordable properties
- **Property Search**: Search properties from ss.lv (simulated)
- **Advanced Filters**: Filter by area, property type, location
- **Direct Links**: Click to view full listings on ss.lv
- **Sort Options**: Sort by price, area, or number of rooms

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **API Integration**: Revolut API (mock), ss.lv scraping (mock)

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd budget-house-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Revolut API credentials:
   ```
   REACT_APP_REVOLUT_CLIENT_ID=your_client_id
   REACT_APP_REVOLUT_CLIENT_SECRET=your_client_secret
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open the app**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Budget Tab
1. **View Dashboard**: See your balance, income, expenses, and Revolut account
2. **Add Transactions**: Click "Add Transaction" to log new income or expenses
3. **Track Budgets**: Monitor spending against your budget limits
4. **Connect Revolut**: Click "Connect" on the Revolut card (demo mode)

### House Search Tab
1. **Set Filters**: Enter your maximum price (e.g., €40,000)
2. **Search Location**: Filter by city or area
3. **Apply Filters**: Set minimum area, property type
4. **Browse Results**: View properties within your budget
5. **Visit Listings**: Click "View on ss.lv" to open the original listing

## API Integration

### Revolut Integration
The app includes a mock Revolut service that demonstrates:
- OAuth authentication flow
- Account balance retrieval
- Transaction history
- Real-time financial data sync

To implement real Revolut integration:
1. Register at [Revolut Developer Portal](https://developer.revolut.com/)
2. Get your API credentials
3. Update the `revolutService.ts` with real API calls
4. Implement proper OAuth flow on your backend

### ss.lv Integration
The house search includes a mock ss.lv service that simulates:
- Property search with price filters
- Location-based filtering
- Property details extraction
- Direct links to listings

To implement real ss.lv scraping:
1. Create a backend service (recommended for CORS and rate limiting)
2. Use libraries like Puppeteer or Cheerio for web scraping
3. Respect ss.lv's robots.txt and terms of service
4. Implement proper error handling and rate limiting

## Mobile Friendly

The app is fully responsive and optimized for mobile devices:
- Touch-friendly navigation
- Responsive grid layouts
- Mobile-optimized charts
- Collapsible mobile menu

## Future Enhancements

### Budget Features
- [ ] Expense categories customization
- [ ] Recurring transactions
- [ ] Financial goals tracking
- [ ] Export to CSV/PDF
- [ ] Multi-currency support
- [ ] Bank synchronization (other banks)

### House Search Features
- [ ] Saved searches
- [ ] Property favorites
- [ ] Price alerts
- [ ] Map integration
- [ ] Mortgage calculator
- [ ] Property comparison tool

### Technical Improvements
- [ ] PWA (Progressive Web App)
- [ ] Offline mode
- [ ] Push notifications
- [ ] Dark mode
- [ ] Backend API
- [ ] User authentication
- [ ] Data persistence

## Wrapping as Mobile App

This web app can be wrapped as a mobile app using:

### Capacitor (Recommended)
```bash
npm install @capacitor/core @capacitor/cli
npx cap init
npx cap add ios
npx cap add android
npx cap build
```

### Electron (Desktop)
```bash
npm install electron
# Add electron scripts to package.json
```

### Cordova
```bash
npm install -g cordova
cordova create myapp
cordova platform add ios android
cordova build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email your-email@domain.com or create an issue in the repository.

---

**Note**: This is a demo application. The Revolut integration and ss.lv scraping are mock implementations. For production use, implement proper API integration and respect all terms of service.
