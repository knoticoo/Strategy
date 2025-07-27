import axios from 'axios';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  store: string;
  category: string;
  imageUrl?: string;
  url: string;
  inStock: boolean;
  lastUpdated: Date;
}

export interface Deal {
  id: string;
  title: string;
  description: string;
  store: string;
  discount: number;
  validUntil: string;
  category: string;
  url: string;
}

class PriceScrapingService {
  private readonly corsProxy = 'https://api.allorigins.win/raw?url=';
  private readonly stores = {
    maxima: 'https://www.maxima.lv',
    rimi: 'https://www.rimi.lv', 
    barbora: 'https://barbora.lv',
    citro: 'https://www.citro.lv'
  };

  async scrapeMaximaDeals(): Promise<Deal[]> {
    try {
      // In a real app, you'd scrape the actual website
      // For demo, returning realistic mock data that could come from scraping
      const deals: Deal[] = [
        {
          id: 'maxima_1',
          title: 'Piens "Tukuma" 2.5% 1L',
          description: '34% atlaide piena produktiem',
          store: 'Maxima',
          discount: 34,
          validUntil: '2024-02-15',
          category: 'dairy',
          url: 'https://www.maxima.lv/akcijas'
        },
        {
          id: 'maxima_2', 
          title: 'Maize "Lāči" 750g',
          description: '31% atlaide svaigai maizei',
          store: 'Maxima',
          discount: 31,
          validUntil: '2024-02-10',
          category: 'bakery',
          url: 'https://www.maxima.lv/akcijas'
        }
      ];
      
      return deals;
    } catch (error) {
      console.error('Error scraping Maxima:', error);
      return [];
    }
  }

  async scrapeRimiDeals(): Promise<Deal[]> {
    try {
      const deals: Deal[] = [
        {
          id: 'rimi_1',
          title: 'Banāni 1kg',
          description: '21% atlaide augļiem',
          store: 'Rimi',
          discount: 21,
          validUntil: '2024-02-12',
          category: 'fruits',
          url: 'https://www.rimi.lv/akcijas'
        },
        {
          id: 'rimi_2',
          title: 'Grieķu jogurts 150g',
          description: '24% atlaide piena produktiem',
          store: 'Rimi',
          discount: 24,
          validUntil: '2024-02-14',
          category: 'dairy',
          url: 'https://www.rimi.lv/akcijas'
        }
      ];
      
      return deals;
    } catch (error) {
      console.error('Error scraping Rimi:', error);
      return [];
    }
  }

  async scrapeBarboraDeals(): Promise<Deal[]> {
    try {
      const deals: Deal[] = [
        {
          id: 'barbora_1',
          title: 'Bezmaksas piegāde',
          description: 'Bezmaksas piegāde pasūtījumiem virs €25',
          store: 'Barbora',
          discount: 100,
          validUntil: '2024-02-29',
          category: 'delivery',
          url: 'https://barbora.lv'
        },
        {
          id: 'barbora_2',
          title: '15% atlaide jauniem klientiem',
          description: 'Pirmajam pasūtījumam',
          store: 'Barbora',
          discount: 15,
          validUntil: '2024-03-31',
          category: 'general',
          url: 'https://barbora.lv'
        }
      ];
      
      return deals;
    } catch (error) {
      console.error('Error scraping Barbora:', error);
      return [];
    }
  }

  async getAllDeals(): Promise<Deal[]> {
    try {
      const [maximaDeals, rimiDeals, barboraDeals] = await Promise.all([
        this.scrapeMaximaDeals(),
        this.scrapeRimiDeals(), 
        this.scrapeBarboraDeals()
      ]);

      const allDeals = [...maximaDeals, ...rimiDeals, ...barboraDeals];
      
      // Sort by discount percentage
      return allDeals.sort((a, b) => b.discount - a.discount);
    } catch (error) {
      console.error('Error getting all deals:', error);
      return [];
    }
  }

  async searchProducts(query: string, maxPrice?: number): Promise<Product[]> {
    try {
      // Mock products that could come from real scraping
      const mockProducts: Product[] = [
        {
          id: 'prod_1',
          name: 'Piens "Tukuma" 2.5% 1L',
          price: 0.99,
          originalPrice: 1.49,
          discount: 34,
          store: 'Maxima',
          category: 'dairy',
          url: 'https://www.maxima.lv/products/piens-tukuma',
          inStock: true,
          lastUpdated: new Date()
        },
        {
          id: 'prod_2',
          name: 'Maize "Lāči" 750g',
          price: 0.89,
          originalPrice: 1.29,
          discount: 31,
          store: 'Maxima',
          category: 'bakery',
          url: 'https://www.maxima.lv/products/maize-laci',
          inStock: true,
          lastUpdated: new Date()
        },
        {
          id: 'prod_3',
          name: 'Banāni 1kg',
          price: 1.89,
          originalPrice: 2.39,
          discount: 21,
          store: 'Rimi',
          category: 'fruits',
          url: 'https://www.rimi.lv/products/banani',
          inStock: true,
          lastUpdated: new Date()
        }
      ];

      let filteredProducts = mockProducts;

      // Filter by search query
      if (query) {
        filteredProducts = filteredProducts.filter(product =>
          product.name.toLowerCase().includes(query.toLowerCase())
        );
      }

      // Filter by max price
      if (maxPrice) {
        filteredProducts = filteredProducts.filter(product =>
          product.price <= maxPrice
        );
      }

      return filteredProducts;
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  }

  async getProductsByBudget(budget: number, category?: string): Promise<Product[]> {
    try {
      const products = await this.searchProducts('', budget);
      
      if (category) {
        return products.filter(product => product.category === category);
      }

      return products;
    } catch (error) {
      console.error('Error getting products by budget:', error);
      return [];
    }
  }

  async comparePrices(productName: string): Promise<Product[]> {
    try {
      const products = await this.searchProducts(productName);
      
      // Group by similar products and sort by price
      return products.sort((a, b) => a.price - b.price);
    } catch (error) {
      console.error('Error comparing prices:', error);
      return [];
    }
  }

  // Real scraping implementation would use these methods
  private async scrapeWebsite(url: string): Promise<any> {
    try {
      const response = await axios.get(`${this.corsProxy}${encodeURIComponent(url)}`, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Scraping error:', error);
      throw error;
    }
  }

  private parseProductData(html: string, store: string): Product[] {
    // This would contain real HTML parsing logic
    // using libraries like cheerio to extract product data
    return [];
  }

  private detectDiscount(currentPrice: number, originalPrice: number): number {
    if (!originalPrice || originalPrice <= currentPrice) return 0;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  }

  // Method to get real-time price updates
  async getLivePriceUpdates(): Promise<{ timestamp: Date; updates: Product[] }> {
    try {
      const products = await this.searchProducts('');
      
      return {
        timestamp: new Date(),
        updates: products.filter(product => 
          new Date().getTime() - product.lastUpdated.getTime() < 3600000 // Updated within last hour
        )
      };
    } catch (error) {
      console.error('Error getting live price updates:', error);
      return { timestamp: new Date(), updates: [] };
    }
  }
}

const priceScrapingService = new PriceScrapingService();
export default priceScrapingService;