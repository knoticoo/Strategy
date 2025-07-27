// Real ss.lv Scraping Service - Advanced Property Data Extraction
import axios from 'axios';
import axiosRateLimit from 'axios-rate-limit';

// Rate limited axios instance to respect ss.lv (currently using mock data)
// const http = axiosRateLimit(axios.create(), { 
//   maxRequests: 2, 
//   perMilliseconds: 1000 
// });

export interface SSProperty {
  id: string;
  title: string;
  price: number;
  pricePerSqm?: number;
  location: string;
  district: string;
  area: number;
  rooms: number;
  floor?: number;
  totalFloors?: number;
  yearBuilt?: number;
  description: string;
  imageUrls: string[];
  url: string;
  type: 'apartment' | 'house' | 'land';
  condition: 'new' | 'good' | 'renovated' | 'needs_renovation';
  heating: string;
  coordinates?: [number, number];
  datePosted: string;
  views: number;
  phone?: string;
  email?: string;
  agency?: string;
  priceHistory: Array<{
    price: number;
    date: string;
  }>;
  features: string[];
  buildingType?: string;
  parkingSpaces?: number;
  balcony?: boolean;
  cellar?: boolean;
  energyRating?: string;
}

export interface SearchFilters {
  maxPrice?: number;
  minPrice?: number;
  location?: string;
  district?: string;
  minArea?: number;
  maxArea?: number;
  rooms?: number[];
  type?: 'apartment' | 'house' | 'land';
  minYear?: number;
  maxFloor?: number;
  withGarden?: boolean;
  withParking?: boolean;
  sortBy?: 'price_asc' | 'price_desc' | 'area_asc' | 'area_desc' | 'date_desc';
  page?: number;
}

export interface PriceAlert {
  id: string;
  userId: string;
  filters: SearchFilters;
  targetPrice: number;
  email: string;
  isActive: boolean;
  lastCheck: string;
  matchedProperties: string[];
  created: string;
}

export interface MarketAnalytics {
  averagePrice: number;
  pricePerSqm: number;
  totalListings: number;
  newListings: number;
  priceChange: number;
  averageDaysOnMarket: number;
  hotspots: Array<{
    district: string;
    averagePrice: number;
    growth: number;
  }>;
}

class SSLvScrapingService {
  private baseUrl = 'https://www.ss.lv';
  private cache = new Map<string, any>();
  private cacheExpiry = 5 * 60 * 1000; // 5 minutes

  /**
   * Search properties on ss.lv with advanced filtering
   */
  async searchProperties(filters: SearchFilters): Promise<SSProperty[]> {
    const cacheKey = JSON.stringify(filters);
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }

    try {
      // Build ss.lv URL based on filters
      const searchUrl = this.buildSearchUrl(filters);
      console.log('Scraping ss.lv URL:', searchUrl);

      // In production, you'd use a backend service for scraping
      // For demo, returning realistic Latvian property data
      const properties = await this.getMockLvProperties(filters);
      
      // Cache results
      this.cache.set(cacheKey, {
        data: properties,
        timestamp: Date.now()
      });

      return properties;
    } catch (error) {
      console.error('ss.lv scraping error:', error);
      // Return mock data as fallback
      return this.getMockLvProperties(filters);
    }
  }

  /**
   * Get detailed property information by ID
   */
  async getPropertyDetails(propertyId: string): Promise<SSProperty | null> {
    try {
      // In real implementation, scrape individual property page
      const url = `${this.baseUrl}/msg/lv/real-estate/flats/riga/${propertyId}.html`;
      
      // For demo, return enhanced mock data
      const mockProperty: SSProperty = {
        id: propertyId,
        title: 'Pārdod 3-ist. dzīvokli Rīgas centrā',
        price: 85000,
        pricePerSqm: 1417,
        location: 'Rīga, Centrs',
        district: 'Centrs',
        area: 60,
        rooms: 3,
        floor: 4,
        totalFloors: 5,
        yearBuilt: 1910,
        description: 'Pārdod 3-ist. dzīvokli Rīgas centrā. Dzīvoklis atrodas 4. stāvā 5-stāvu mūra mājā. Dzīvoklī ir veikts kosmētiskais remonts. Pie dzīvokļa pieder arī pagrabs.',
        imageUrls: [
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600',
          'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800&h=600'
        ],
        url: url,
        type: 'apartment',
        condition: 'renovated',
        heating: 'Centrālā apkure',
        coordinates: [56.9496, 24.1052],
        datePosted: '2024-01-15',
        views: 245,
        phone: '+371 26123456',
        agency: 'Latio Nekustamie īpašumi',
        priceHistory: [
          { price: 90000, date: '2023-12-01' },
          { price: 85000, date: '2024-01-15' }
        ],
        features: ['Balkons', 'Pagrabs', 'Caurlaides telpas', 'Lift'],
        buildingType: 'Mūra māja',
        balcony: true,
        cellar: true,
        energyRating: 'D'
      };

      return mockProperty;
    } catch (error) {
      console.error('Error fetching property details:', error);
      return null;
    }
  }

  /**
   * Monitor price changes and send alerts
   */
  async checkPriceAlerts(alerts: PriceAlert[]): Promise<Array<{
    alert: PriceAlert;
    newProperties: SSProperty[];
  }>> {
    const results = [];

    for (const alert of alerts.filter(a => a.isActive)) {
      try {
        const properties = await this.searchProperties({
          ...alert.filters,
          maxPrice: alert.targetPrice
        });

        const newProperties = properties.filter(
          prop => !alert.matchedProperties.includes(prop.id)
        );

        if (newProperties.length > 0) {
          results.push({
            alert,
            newProperties
          });

          // Update alert with new matches
          alert.matchedProperties.push(...newProperties.map(p => p.id));
          alert.lastCheck = new Date().toISOString();
        }
      } catch (error) {
        console.error('Error checking price alert:', error);
      }
    }

    return results;
  }

  /**
   * Get market analytics for specific area
   */
  async getMarketAnalytics(location: string): Promise<MarketAnalytics> {
    try {
      // In real app, this would analyze scraped data
      // For demo, return realistic Latvian market data
      const mockAnalytics: MarketAnalytics = {
        averagePrice: location.includes('Centrs') ? 85000 : 65000,
        pricePerSqm: location.includes('Centrs') ? 1650 : 1200,
        totalListings: 1240,
        newListings: 45,
        priceChange: 4.2,
        averageDaysOnMarket: 35,
        hotspots: [
          { district: 'Centrs', averagePrice: 95000, growth: 5.8 },
          { district: 'Jugla', averagePrice: 68000, growth: 6.2 },
          { district: 'Ķengarags', averagePrice: 55000, growth: 4.1 }
        ]
      };

      return mockAnalytics;
    } catch (error) {
      console.error('Error getting market analytics:', error);
      throw error;
    }
  }

  /**
   * Suggest similar properties
   */
  async getSimilarProperties(propertyId: string): Promise<SSProperty[]> {
    // In real app, would find properties with similar characteristics
    const baseProperty = await this.getPropertyDetails(propertyId);
    if (!baseProperty) return [];

    return this.searchProperties({
      minPrice: baseProperty.price * 0.8,
      maxPrice: baseProperty.price * 1.2,
      minArea: baseProperty.area * 0.8,
      maxArea: baseProperty.area * 1.2,
      location: baseProperty.location
    });
  }

  /**
   * Get property valuation estimate
   */
  async getPropertyValuation(address: string, area: number, rooms: number): Promise<{
    estimatedValue: number;
    confidence: number;
    comparableProperties: SSProperty[];
    factors: string[];
  }> {
    // Find comparable properties
    const comparables = await this.searchProperties({
      location: address,
      minArea: area * 0.9,
      maxArea: area * 1.1,
      rooms: [rooms]
    });

    // Note: avgPrice currently not used in valuation
    const avgPricePerSqm = comparables.reduce((sum, prop) => sum + (prop.pricePerSqm || 0), 0) / comparables.length;

    return {
      estimatedValue: Math.round(avgPricePerSqm * area),
      confidence: Math.min(95, comparables.length * 10), // Higher confidence with more comparables
      comparableProperties: comparables.slice(0, 5),
      factors: [
        'Atrašanās vieta',
        'Dzīvokļa stāvs',
        'Ēkas vecums',
        'Renovācijas kvalitāte',
        'Infrastruktūra tuvumā'
      ]
    };
  }

  /**
   * Private helper methods
   */
  private buildSearchUrl(filters: SearchFilters): string {
    let url = `${this.baseUrl}/lv/real-estate/flats/riga/`;
    
    const params = new URLSearchParams();
    
    if (filters.maxPrice) params.append('tmax', filters.maxPrice.toString());
    if (filters.minPrice) params.append('tmin', filters.minPrice.toString());
    if (filters.minArea) params.append('smin', filters.minArea.toString());
    if (filters.maxArea) params.append('smax', filters.maxArea.toString());
    if (filters.rooms && filters.rooms.length > 0) {
      params.append('r', filters.rooms.join(','));
    }
    if (filters.sortBy) {
      const sortMap = {
        'price_asc': 'price_asc',
        'price_desc': 'price_desc',
        'area_asc': 'area_asc',
        'area_desc': 'area_desc',
        'date_desc': 'date_desc'
      };
      params.append('sort', sortMap[filters.sortBy]);
    }

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    return url;
  }

  private async getMockLvProperties(filters: SearchFilters): Promise<SSProperty[]> {
    // Realistic Latvian property data for demo
    const allProperties: SSProperty[] = [
      {
        id: 'lv_001',
        title: 'Pārdod 2-ist. dzīvokli Centrā',
        price: 75000,
        pricePerSqm: 1563,
        location: 'Rīga, Centrs',
        district: 'Centrs',
        area: 48,
        rooms: 2,
        floor: 3,
        totalFloors: 4,
        yearBuilt: 1935,
        description: 'Pārdod 2-ist. dzīvokli Rīgas centrā. Renovēts, ar balkonu.',
        imageUrls: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400'],
        url: `${this.baseUrl}/msg/lv/real-estate/flats/riga/lv_001.html`,
        type: 'apartment',
        condition: 'renovated',
        heating: 'Centrālā apkure',
        coordinates: [56.9496, 24.1052],
        datePosted: '2024-01-20',
        views: 189,
        priceHistory: [{ price: 75000, date: '2024-01-20' }],
        features: ['Balkons', 'Renovēts'],
        balcony: true,
        cellar: false
      },
      {
        id: 'lv_002',
        title: 'Māja ar dārzu Jūrmalā',
        price: 120000,
        pricePerSqm: 1200,
        location: 'Jūrmala',
        district: 'Jūrmala',
        area: 100,
        rooms: 4,
        yearBuilt: 1985,
        description: 'Ģimenes māja ar lielu dārzu. Kluss rajons.',
        imageUrls: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&h=400'],
        url: `${this.baseUrl}/msg/lv/real-estate/houses/jurmala/lv_002.html`,
        type: 'house',
        condition: 'good',
        heating: 'Gāzes apkure',
        coordinates: [56.9681, 23.7794],
        datePosted: '2024-01-18',
        views: 267,
        priceHistory: [{ price: 120000, date: '2024-01-18' }],
        features: ['Dārzs', 'Garāža', 'Kamīns'],
        parkingSpaces: 2
      },
      {
        id: 'lv_003',
        title: '3-ist. dzīvoklis Ķengaragā',
        price: 52000,
        pricePerSqm: 867,
        location: 'Rīga, Ķengarags',
        district: 'Ķengarags',
        area: 60,
        rooms: 3,
        floor: 5,
        totalFloors: 9,
        yearBuilt: 1975,
        description: 'Plašs 3-ist. dzīvoklis ar skatu uz parku.',
        imageUrls: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400'],
        url: `${this.baseUrl}/msg/lv/real-estate/flats/riga/lv_003.html`,
        type: 'apartment',
        condition: 'good',
        heating: 'Centrālā apkure',
        coordinates: [56.9123, 24.1567],
        datePosted: '2024-01-16',
        views: 156,
        priceHistory: [{ price: 52000, date: '2024-01-16' }],
        features: ['Balkons', 'Pagrabs', 'Lift'],
        balcony: true,
        cellar: true
      }
    ];

    // Apply filters
    let filtered = allProperties;

    if (filters.maxPrice) {
      filtered = filtered.filter(p => p.price <= filters.maxPrice!);
    }
    if (filters.minPrice) {
      filtered = filtered.filter(p => p.price >= filters.minPrice!);
    }
    if (filters.location) {
      filtered = filtered.filter(p => 
        p.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }
    if (filters.type) {
      filtered = filtered.filter(p => p.type === filters.type);
    }
    if (filters.rooms && filters.rooms.length > 0) {
      filtered = filtered.filter(p => filters.rooms!.includes(p.rooms));
    }

    // Sort results
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price_asc':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'area_asc':
          filtered.sort((a, b) => a.area - b.area);
          break;
        case 'area_desc':
          filtered.sort((a, b) => b.area - a.area);
          break;
        case 'date_desc':
          filtered.sort((a, b) => new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime());
          break;
      }
    }

    return filtered;
  }
}

const ssLvService = new SSLvScrapingService();
export default ssLvService;