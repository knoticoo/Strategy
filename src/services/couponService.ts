import axios from 'axios';

export interface Coupon {
  id: string;
  code: string;
  description: string;
  store: string;
  discountType: 'percentage' | 'fixed' | 'free_shipping';
  discountValue: number;
  minPurchase?: number;
  maxDiscount?: number;
  expiresOn: string;
  isActive: boolean;
  category?: string;
  url?: string;
  verified: boolean;
  verifiedAt: Date;
  timesUsed: number;
  successRate: number;
}

class CouponService {
  private readonly couponAPIs = {
    // These would be real coupon aggregation APIs
    retailMeNot: 'https://api.retailmenot.com/v1/coupons',
    honey: 'https://api.honey.com/v1/offers',
    groupon: 'https://api.groupon.com/v2/deals'
  };

  private readonly storeApis = {
    maxima: 'https://www.maxima.lv/api/coupons',
    rimi: 'https://www.rimi.lv/api/offers',
    barbora: 'https://barbora.lv/api/promotions',
    boltFood: 'https://food.bolt.eu/api/promo',
    mcdonalds: 'https://www.mcdonalds.lv/api/coupons'
  };

  async getAllActiveCoupons(): Promise<Coupon[]> {
    try {
      const [
        maximaCoupons,
        rimiCoupons,
        barboraCoupons,
        foodDeliveryCoupons,
        generalCoupons
      ] = await Promise.all([
        this.getMaximaCoupons(),
        this.getRimiCoupons(),
        this.getBarboraCoupons(),
        this.getFoodDeliveryCoupons(),
        this.getGeneralCoupons()
      ]);

      const allCoupons = [
        ...maximaCoupons,
        ...rimiCoupons,
        ...barboraCoupons,
        ...foodDeliveryCoupons,
        ...generalCoupons
      ];

      // Sort by success rate and discount value
      return allCoupons
        .filter(coupon => coupon.isActive)
        .sort((a, b) => {
          if (a.successRate !== b.successRate) {
            return b.successRate - a.successRate;
          }
          return b.discountValue - a.discountValue;
        });
    } catch (error) {
      console.error('Error getting all coupons:', error);
      return [];
    }
  }

  async getMaximaCoupons(): Promise<Coupon[]> {
    try {
      // Mock data that would come from real API/scraping
      const coupons: Coupon[] = [
        {
          id: 'maxima_1',
          code: 'MAXIMA20',
          description: '20% atlaide pārtikas precēm',
          store: 'Maxima',
          discountType: 'percentage',
          discountValue: 20,
          minPurchase: 15,
          maxDiscount: 10,
          expiresOn: '2024-02-15',
          isActive: true,
          category: 'food',
          url: 'https://www.maxima.lv',
          verified: true,
          verifiedAt: new Date(),
          timesUsed: 1247,
          successRate: 0.89
        },
        {
          id: 'maxima_2',
          code: 'FRESH10',
          description: '€10 atlaide svaigiem produktiem virs €50',
          store: 'Maxima',
          discountType: 'fixed',
          discountValue: 10,
          minPurchase: 50,
          expiresOn: '2024-02-28',
          isActive: true,
          category: 'fresh',
          verified: true,
          verifiedAt: new Date(),
          timesUsed: 892,
          successRate: 0.92
        }
      ];

      return coupons;
    } catch (error) {
      console.error('Error getting Maxima coupons:', error);
      return [];
    }
  }

  async getRimiCoupons(): Promise<Coupon[]> {
    try {
      const coupons: Coupon[] = [
        {
          id: 'rimi_1',
          code: 'RIMI15',
          description: '15% atlaide mājsaimniecības precēm',
          store: 'Rimi',
          discountType: 'percentage',
          discountValue: 15,
          minPurchase: 25,
          expiresOn: '2024-02-20',
          isActive: true,
          category: 'household',
          verified: true,
          verifiedAt: new Date(),
          timesUsed: 654,
          successRate: 0.86
        },
        {
          id: 'rimi_2',
          code: 'DELIVERY5',
          description: 'Bezmaksas piegāde virs €30',
          store: 'Rimi',
          discountType: 'free_shipping',
          discountValue: 5,
          minPurchase: 30,
          expiresOn: '2024-03-01',
          isActive: true,
          category: 'delivery',
          verified: true,
          verifiedAt: new Date(),
          timesUsed: 423,
          successRate: 0.94
        }
      ];

      return coupons;
    } catch (error) {
      console.error('Error getting Rimi coupons:', error);
      return [];
    }
  }

  async getBarboraCoupons(): Promise<Coupon[]> {
    try {
      const coupons: Coupon[] = [
        {
          id: 'barbora_1',
          code: 'WELCOME25',
          description: '€5 atlaide pirmajam pasūtījumam virs €25',
          store: 'Barbora',
          discountType: 'fixed',
          discountValue: 5,
          minPurchase: 25,
          expiresOn: '2024-12-31',
          isActive: true,
          category: 'new_customer',
          verified: true,
          verifiedAt: new Date(),
          timesUsed: 2156,
          successRate: 0.91
        },
        {
          id: 'barbora_2',
          code: 'SAVE10',
          description: '10% atlaide nākamajam pasūtījumam',
          store: 'Barbora',
          discountType: 'percentage',
          discountValue: 10,
          expiresOn: '2024-02-25',
          isActive: true,
          category: 'general',
          verified: true,
          verifiedAt: new Date(),
          timesUsed: 789,
          successRate: 0.88
        }
      ];

      return coupons;
    } catch (error) {
      console.error('Error getting Barbora coupons:', error);
      return [];
    }
  }

  async getFoodDeliveryCoupons(): Promise<Coupon[]> {
    try {
      const coupons: Coupon[] = [
        {
          id: 'bolt_1',
          code: 'HUNGRY20',
          description: '20% atlaide restorāniem',
          store: 'Bolt Food',
          discountType: 'percentage',
          discountValue: 20,
          minPurchase: 15,
          maxDiscount: 8,
          expiresOn: '2024-02-14',
          isActive: true,
          category: 'restaurants',
          verified: true,
          verifiedAt: new Date(),
          timesUsed: 3421,
          successRate: 0.85
        },
        {
          id: 'bolt_2',
          code: 'FAST5',
          description: '€5 atlaide ēdiena piegādei virs €20',
          store: 'Bolt Food',
          discountType: 'fixed',
          discountValue: 5,
          minPurchase: 20,
          expiresOn: '2024-02-18',
          isActive: true,
          category: 'delivery',
          verified: true,
          verifiedAt: new Date(),
          timesUsed: 1876,
          successRate: 0.90
        },
        {
          id: 'wolt_1',
          code: 'WOLT10',
          description: '€3 atlaide Wolt piegādei',
          store: 'Wolt',
          discountType: 'fixed',
          discountValue: 3,
          minPurchase: 15,
          expiresOn: '2024-02-16',
          isActive: true,
          category: 'delivery',
          verified: true,
          verifiedAt: new Date(),
          timesUsed: 945,
          successRate: 0.87
        }
      ];

      return coupons;
    } catch (error) {
      console.error('Error getting food delivery coupons:', error);
      return [];
    }
  }

  async getGeneralCoupons(): Promise<Coupon[]> {
    try {
      const coupons: Coupon[] = [
        {
          id: 'general_1',
          code: 'WEEKEND15',
          description: '15% atlaide nedēļas nogalē',
          store: 'Various',
          discountType: 'percentage',
          discountValue: 15,
          expiresOn: '2024-02-11',
          isActive: true,
          category: 'weekend',
          verified: true,
          verifiedAt: new Date(),
          timesUsed: 567,
          successRate: 0.78
        }
      ];

      return coupons;
    } catch (error) {
      console.error('Error getting general coupons:', error);
      return [];
    }
  }

  async verifyCoupon(code: string, store: string): Promise<{ valid: boolean; reason?: string }> {
    try {
      // In a real app, this would call the store's API to verify the coupon
      const allCoupons = await this.getAllActiveCoupons();
      const coupon = allCoupons.find(c => 
        c.code.toLowerCase() === code.toLowerCase() && 
        c.store.toLowerCase() === store.toLowerCase()
      );

      if (!coupon) {
        return { valid: false, reason: 'Coupon not found' };
      }

      if (!coupon.isActive) {
        return { valid: false, reason: 'Coupon is no longer active' };
      }

      const expiryDate = new Date(coupon.expiresOn);
      if (expiryDate < new Date()) {
        return { valid: false, reason: 'Coupon has expired' };
      }

      return { valid: true };
    } catch (error) {
      console.error('Error verifying coupon:', error);
      return { valid: false, reason: 'Verification failed' };
    }
  }

  async getCouponsByStore(store: string): Promise<Coupon[]> {
    try {
      const allCoupons = await this.getAllActiveCoupons();
      return allCoupons.filter(coupon => 
        coupon.store.toLowerCase().includes(store.toLowerCase())
      );
    } catch (error) {
      console.error('Error getting coupons by store:', error);
      return [];
    }
  }

  async getCouponsByCategory(category: string): Promise<Coupon[]> {
    try {
      const allCoupons = await this.getAllActiveCoupons();
      return allCoupons.filter(coupon => 
        coupon.category?.toLowerCase() === category.toLowerCase()
      );
    } catch (error) {
      console.error('Error getting coupons by category:', error);
      return [];
    }
  }

  async getTopCoupons(limit: number = 10): Promise<Coupon[]> {
    try {
      const allCoupons = await this.getAllActiveCoupons();
      return allCoupons
        .sort((a, b) => {
          // Sort by success rate and times used
          const scoreA = a.successRate * 0.7 + (a.timesUsed / 10000) * 0.3;
          const scoreB = b.successRate * 0.7 + (b.timesUsed / 10000) * 0.3;
          return scoreB - scoreA;
        })
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting top coupons:', error);
      return [];
    }
  }

  async searchCoupons(query: string): Promise<Coupon[]> {
    try {
      const allCoupons = await this.getAllActiveCoupons();
      const lowerQuery = query.toLowerCase();
      
      return allCoupons.filter(coupon =>
        coupon.description.toLowerCase().includes(lowerQuery) ||
        coupon.store.toLowerCase().includes(lowerQuery) ||
        coupon.category?.toLowerCase().includes(lowerQuery)
      );
    } catch (error) {
      console.error('Error searching coupons:', error);
      return [];
    }
  }

  // Simulate real-time coupon aggregation
  async refreshCoupons(): Promise<{ added: number; removed: number; updated: number }> {
    try {
      // This would call all store APIs and coupon aggregators
      // to get the latest coupons and update the local cache
      
      // For demo, simulate some changes
      return {
        added: Math.floor(Math.random() * 5) + 1,
        removed: Math.floor(Math.random() * 3),
        updated: Math.floor(Math.random() * 8) + 2
      };
    } catch (error) {
      console.error('Error refreshing coupons:', error);
      return { added: 0, removed: 0, updated: 0 };
    }
  }

  // Method to report coupon success/failure for improving accuracy
  async reportCouponUsage(couponId: string, success: boolean): Promise<void> {
    try {
      // This would update the coupon's success rate and usage statistics
      console.log(`Coupon ${couponId} reported as ${success ? 'successful' : 'failed'}`);
    } catch (error) {
      console.error('Error reporting coupon usage:', error);
    }
  }
}

const couponService = new CouponService();
export default couponService;