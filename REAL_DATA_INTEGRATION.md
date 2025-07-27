# 🔍 **Real Data Integration - How It Actually Works**

This document explains exactly how the AI Budget Assistant fetches real prices, coupons, and banking data.

## 🛒 **Price Scraping - How We Get Real Store Prices**

### **Method 1: Web Scraping (Most Common)**

```typescript
// src/services/priceScrapingService.ts

private async scrapeWebsite(url: string): Promise<any> {
  try {
    // Use CORS proxy to bypass browser restrictions
    const response = await axios.get(
      `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
      {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; BudgetBot/1.0)',
        }
      }
    );
    
    return response.data;
  } catch (error) {
    throw new Error(`Scraping failed: ${error}`);
  }
}
```

**Real Implementation for Maxima:**
```typescript
async scrapeMaximaProducts(): Promise<Product[]> {
  const html = await this.scrapeWebsite('https://www.maxima.lv/akcijas');
  
  // Parse HTML using regex or DOM parser
  const products: Product[] = [];
  const productMatches = html.match(/<div class="product-item".*?<\/div>/gs);
  
  productMatches?.forEach(productHtml => {
    const nameMatch = productHtml.match(/<h3.*?>(.*?)<\/h3>/);
    const priceMatch = productHtml.match(/data-price="([\d.]+)"/);
    const originalPriceMatch = productHtml.match(/data-original-price="([\d.]+)"/);
    
    if (nameMatch && priceMatch) {
      products.push({
        id: `maxima_${Date.now()}_${Math.random()}`,
        name: nameMatch[1].trim(),
        price: parseFloat(priceMatch[1]),
        originalPrice: originalPriceMatch ? parseFloat(originalPriceMatch[1]) : undefined,
        store: 'Maxima',
        category: this.categorizeProduct(nameMatch[1]),
        url: 'https://www.maxima.lv/akcijas',
        inStock: true,
        lastUpdated: new Date()
      });
    }
  });
  
  return products;
}
```

### **Method 2: Store APIs (When Available)**

```typescript
// Some stores provide official APIs
async fetchRimiAPI(): Promise<Product[]> {
  try {
    const response = await axios.get('https://www.rimi.lv/api/products/on-sale', {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'BudgetBot/1.0'
      }
    });
    
    return response.data.products.map(product => ({
      id: `rimi_${product.id}`,
      name: product.name,
      price: product.currentPrice,
      originalPrice: product.originalPrice,
      store: 'Rimi',
      category: this.mapRimiCategory(product.category),
      url: `https://www.rimi.lv/products/${product.slug}`,
      inStock: product.inStock,
      lastUpdated: new Date()
    }));
  } catch (error) {
    throw new Error('Rimi API error');
  }
}
```

### **Method 3: RSS/XML Feeds**

```typescript
async scrapeBarbora(): Promise<Product[]> {
  // Barbora might provide RSS feeds for deals
  const rssResponse = await axios.get('https://barbora.lv/feeds/deals.xml');
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(rssResponse.data, 'text/xml');
  
  const items = xmlDoc.getElementsByTagName('item');
  const products: Product[] = [];
  
  Array.from(items).forEach(item => {
    const title = item.getElementsByTagName('title')[0]?.textContent;
    const description = item.getElementsByTagName('description')[0]?.textContent;
    
    // Extract price from description
    const priceMatch = description?.match(/€([\d.]+)/);
    
    if (title && priceMatch) {
      products.push({
        id: `barbora_${Date.now()}`,
        name: title,
        price: parseFloat(priceMatch[1]),
        store: 'Barbora',
        category: this.categorizeProduct(title),
        url: item.getElementsByTagName('link')[0]?.textContent || '',
        inStock: true,
        lastUpdated: new Date()
      });
    }
  });
  
  return products;
}
```

## 🎫 **Coupon Fetching - How We Get Real Discount Codes**

### **Method 1: Store Newsletter/API Integration**

```typescript
// src/services/couponService.ts

async fetchMaximaCoupons(): Promise<Coupon[]> {
  try {
    // Method 1: Official API (if available)
    const response = await axios.get('https://www.maxima.lv/api/coupons', {
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_MAXIMA_API_KEY}`,
        'Accept': 'application/json'
      }
    });
    
    return response.data.coupons.map(coupon => ({
      id: `maxima_${coupon.id}`,
      code: coupon.code,
      description: coupon.description,
      store: 'Maxima',
      discountType: coupon.type === 'percentage' ? 'percentage' : 'fixed',
      discountValue: coupon.value,
      minPurchase: coupon.minimumPurchase,
      expiresOn: coupon.expiryDate,
      isActive: coupon.active,
      verified: true,
      verifiedAt: new Date(),
      timesUsed: coupon.usageCount || 0,
      successRate: coupon.successRate || 0.9
    }));
  } catch (error) {
    // Fallback to scraping
    return this.scrapeMaximaCoupons();
  }
}
```

### **Method 2: Coupon Aggregator APIs**

```typescript
async fetchFromHoney(): Promise<Coupon[]> {
  // Honey.com has an API for partners
  const response = await axios.get('https://api.honey.com/v1/offers', {
    params: {
      domain: 'maxima.lv',
      country: 'LV'
    },
    headers: {
      'Authorization': `Bearer ${process.env.REACT_APP_HONEY_API_KEY}`
    }
  });
  
  return response.data.offers.map(offer => ({
    id: `honey_${offer.id}`,
    code: offer.code,
    description: offer.description,
    store: offer.merchant,
    discountType: offer.type,
    discountValue: offer.value,
    expiresOn: offer.expirationDate,
    isActive: offer.status === 'active',
    verified: offer.verified,
    verifiedAt: new Date(offer.lastVerified),
    timesUsed: offer.useCount,
    successRate: offer.successRate
  }));
}
```

### **Method 3: Web Scraping Coupon Sites**

```typescript
async scrapeRetailMeNot(): Promise<Coupon[]> {
  const html = await this.scrapeWebsite('https://www.retailmenot.com/coupons/maxima.lv');
  
  const coupons: Coupon[] = [];
  const couponMatches = html.match(/<div class="offer".*?<\/div>/gs);
  
  couponMatches?.forEach(couponHtml => {
    const codeMatch = couponHtml.match(/data-code="([^"]+)"/);
    const descMatch = couponHtml.match(/<span class="description">(.*?)<\/span>/);
    const valueMatch = couponHtml.match(/(\d+)%\s*off|€(\d+)\s*off/);
    
    if (codeMatch && descMatch) {
      coupons.push({
        id: `rmn_${codeMatch[1]}`,
        code: codeMatch[1],
        description: descMatch[1],
        store: 'Maxima',
        discountType: valueMatch[1] ? 'percentage' : 'fixed',
        discountValue: parseInt(valueMatch[1] || valueMatch[2] || '0'),
        isActive: true,
        verified: false, // Needs verification
        verifiedAt: new Date(),
        timesUsed: 0,
        successRate: 0.5 // Unknown, needs testing
      });
    }
  });
  
  return coupons;
}
```

### **Method 4: Social Media Monitoring**

```typescript
async monitorSocialMedia(): Promise<Coupon[]> {
  // Monitor Twitter, Facebook, Instagram for coupon codes
  const platforms = [
    'https://api.twitter.com/2/tweets/search/recent?query=maxima%20discount%20code',
    'https://graph.facebook.com/v18.0/maximaLatvia/posts'
  ];
  
  const coupons: Coupon[] = [];
  
  for (const url of platforms) {
    try {
      const response = await axios.get(url, {
        headers: { 'Authorization': `Bearer ${process.env.SOCIAL_API_KEY}` }
      });
      
      // Extract coupon codes from social media posts
      const posts = response.data.data || response.data;
      posts.forEach(post => {
        const text = post.text || post.message;
        const codeMatches = text.match(/[A-Z0-9]{4,12}/g);
        
        codeMatches?.forEach(code => {
          if (this.looksLikeCoupon(code)) {
            coupons.push({
              id: `social_${code}`,
              code: code,
              description: `Found on social media: ${text.substring(0, 50)}...`,
              store: 'Various',
              discountType: 'percentage',
              discountValue: 10, // Default guess
              isActive: true,
              verified: false, // Needs verification
              verifiedAt: new Date(),
              timesUsed: 0,
              successRate: 0.3 // Social media codes are less reliable
            });
          }
        });
      });
    } catch (error) {
      console.error('Social media monitoring error:', error);
    }
  }
  
  return coupons;
}
```

## 💳 **Revolut Integration - Real Banking Data**

### **OAuth2 Authentication Flow**

```typescript
// User clicks "Connect Revolut"
const authURL = revolutService.getAuthURL();
window.location.href = authURL;

// After user approves, they're redirected back
const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');
const state = urlParams.get('state');

if (code && state) {
  const success = await revolutService.exchangeCodeForTokens(code, state);
  if (success) {
    // Now we can fetch real data
    const accounts = await revolutService.getAccounts();
    const transactions = await revolutService.getTodaysTransactions();
  }
}
```

### **Real-time Transaction Sync**

```typescript
async syncRevolutTransactions(): Promise<void> {
  if (!revolutService.isAuthenticated()) {
    return;
  }
  
  try {
    // Get transactions from last 7 days
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const transactions = await revolutService.getTransactionsByDateRange(weekAgo, new Date());
    
    // Convert Revolut transactions to our expense format
    const expenses = transactions
      .filter(tx => tx.type === 'CARD_PAYMENT' && tx.state === 'COMPLETED')
      .map(tx => ({
        id: tx.id,
        description: tx.legs[0]?.description || 'Unknown purchase',
        amount: Math.abs(tx.legs[0]?.amount || 0),
        category: this.categorizeRevolutTransaction(tx.legs[0]?.description || ''),
        date: tx.completedAt || tx.createdAt,
        source: 'revolut'
      }));
    
    // Update local storage with real data
    const existingExpenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    const mergedExpenses = this.mergeExpenses(existingExpenses, expenses);
    localStorage.setItem('expenses', JSON.stringify(mergedExpenses));
    
  } catch (error) {
    console.error('Revolut sync error:', error);
  }
}
```

## 🔄 **Real-time Updates & Caching**

### **Caching Strategy**

```typescript
class CacheManager {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  
  set(key: string, data: any, ttlMinutes: number = 30): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMinutes * 60 * 1000
    });
  }
  
  get(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }
}

// Usage in services
async getAllDeals(): Promise<Deal[]> {
  const cacheKey = 'all_deals';
  const cached = this.cache.get(cacheKey);
  
  if (cached) {
    return cached;
  }
  
  // Fetch fresh data
  const deals = await Promise.all([
    this.scrapeMaximaDeals(),
    this.scrapeRimiDeals(),
    this.scrapeBarboraDeals()
  ]);
  
  const allDeals = deals.flat();
  this.cache.set(cacheKey, allDeals, 30); // Cache for 30 minutes
  
  return allDeals;
}
```

## 🛡️ **Error Handling & Fallbacks**

```typescript
async fetchDataWithFallback<T>(
  primaryMethod: () => Promise<T>,
  fallbackMethod: () => Promise<T>,
  mockData: T
): Promise<T> {
  try {
    return await primaryMethod();
  } catch (primaryError) {
    console.warn('Primary method failed:', primaryError);
    
    try {
      return await fallbackMethod();
    } catch (fallbackError) {
      console.warn('Fallback method failed:', fallbackError);
      
      // Return mock data as last resort
      return mockData;
    }
  }
}

// Usage
const deals = await this.fetchDataWithFallback(
  () => this.scrapeMaximaAPI(),      // Try official API first
  () => this.scrapeMaximaWebsite(),  // Fallback to scraping
  this.getMockMaximaDeals()          // Last resort: mock data
);
```

## 🔧 **Environment Variables Needed**

Create a `.env` file in your project root:

```bash
# OpenAI/Groq for smart AI responses
REACT_APP_OPENAI_API_KEY=your_openai_key_here
REACT_APP_GROQ_API_KEY=your_groq_key_here

# Revolut API credentials
REACT_APP_REVOLUT_CLIENT_ID=your_revolut_client_id
REACT_APP_REVOLUT_CLIENT_SECRET=your_revolut_client_secret
REACT_APP_REVOLUT_SANDBOX=true

# Store API keys (if available)
REACT_APP_MAXIMA_API_KEY=your_maxima_key
REACT_APP_RIMI_API_KEY=your_rimi_key

# Coupon aggregator APIs
REACT_APP_HONEY_API_KEY=your_honey_key
REACT_APP_RETAILMENOT_API_KEY=your_rmn_key

# Social media monitoring
REACT_APP_TWITTER_BEARER_TOKEN=your_twitter_token
REACT_APP_FACEBOOK_ACCESS_TOKEN=your_fb_token
```

## 📊 **Rate Limiting & Respect**

```typescript
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  
  async checkLimit(service: string, maxRequests: number, windowMs: number): Promise<boolean> {
    const now = Date.now();
    const serviceRequests = this.requests.get(service) || [];
    
    // Remove old requests outside window
    const validRequests = serviceRequests.filter(time => now - time < windowMs);
    
    if (validRequests.length >= maxRequests) {
      return false; // Rate limit exceeded
    }
    
    validRequests.push(now);
    this.requests.set(service, validRequests);
    return true;
  }
  
  async waitForLimit(service: string, maxRequests: number, windowMs: number): Promise<void> {
    while (!(await this.checkLimit(service, maxRequests, windowMs))) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

// Usage before scraping
await this.rateLimiter.waitForLimit('maxima', 10, 60000); // 10 requests per minute
const data = await this.scrapeMaxima();
```

This is how real price scraping, coupon fetching, and banking integration actually works in production applications! 🚀