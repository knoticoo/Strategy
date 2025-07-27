import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, Clock, ExternalLink, RefreshCw, TrendingDown, Zap } from 'lucide-react';
import priceScrapingService, { Deal } from '../services/priceScrapingService';

const DealsTab: React.FC = () => {
  const { t } = useTranslation();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStore, setSelectedStore] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Load deals on component mount
  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    try {
      setLoading(true);
      const allDeals = await priceScrapingService.getAllDeals();
      setDeals(allDeals);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshDeals = async () => {
    try {
      setRefreshing(true);
      const allDeals = await priceScrapingService.getAllDeals();
      setDeals(allDeals);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error refreshing deals:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Filter deals based on selected store and category
  const filteredDeals = deals.filter(deal => {
    const storeMatch = selectedStore === 'all' || deal.store.toLowerCase().includes(selectedStore.toLowerCase());
    const categoryMatch = selectedCategory === 'all' || deal.category === selectedCategory;
    return storeMatch && categoryMatch;
  });

  const stores = [
    { value: 'all', label: t('deals.categories.all') },
    { value: 'maxima', label: t('deals.stores.maxima') },
    { value: 'rimi', label: t('deals.stores.rimi') },
    { value: 'barbora', label: t('deals.stores.barbora') }
  ];

  const categories = [
    { value: 'all', label: t('deals.categories.all') },
    { value: 'dairy', label: 'Dairy Products' },
    { value: 'bakery', label: 'Bakery' },
    { value: 'fruits', label: 'Fruits & Vegetables' },
    { value: 'delivery', label: 'Delivery' },
    { value: 'general', label: 'General' }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('deals.title')}
          </h1>
        </div>
        
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading real-time deals...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
            <TrendingDown className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('deals.title')}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Real-time prices from Latvian stores
            </p>
          </div>
        </div>
        
        <button
          onClick={refreshDeals}
          disabled={refreshing}
          className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="h-5 w-5 text-blue-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Total Deals</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{deals.length}</p>
        </div>
        
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center space-x-2">
            <TrendingDown className="h-5 w-5 text-green-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Avg. Discount</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {deals.length > 0 ? Math.round(deals.reduce((sum, deal) => sum + deal.discount, 0) / deals.length) : 0}%
          </p>
        </div>
        
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-orange-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Active Stores</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {new Set(deals.map(deal => deal.store)).size}
          </p>
        </div>
        
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-purple-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Last Updated</span>
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
            {lastUpdated ? lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Never'}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Store
          </label>
          <select
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {stores.map((store) => (
              <option key={store.value} value={store.value}>
                {store.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Deals Grid */}
      {filteredDeals.length === 0 ? (
        <div className="glass rounded-2xl p-8 text-center">
          <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            No deals found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your filters or refresh to get the latest deals.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDeals.map((deal) => (
            <div key={deal.id} className="glass rounded-2xl p-6 hover:shadow-lg transition-all duration-200 transform hover:scale-105">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {deal.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {deal.description}
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {deal.store}
                    </span>
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                      {deal.category}
                    </span>
                  </div>
                </div>
                <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-bold ml-4">
                  -{deal.discount}%
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {t('deals.validUntil')} {deal.validUntil}
                </div>
              </div>

              <a
                href={deal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full btn-primary flex items-center justify-center space-x-2"
              >
                <span>{t('deals.viewDeal')}</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          ))}
        </div>
      )}

      {/* Smart Deal Discovery */}
      <div className="glass rounded-2xl p-6 border-l-4 border-blue-500">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
            <Zap className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Smart Deal Discovery
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Our AI analyzes store promotions, weekly flyers, and community reports to find the best deals across Latvia.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
              <div>• Weekly store flyers analysis</div>
              <div>• Community deal verification</div>
              <div>• AI-powered price comparison</div>
              <div>• Use Store Locator for directions</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealsTab;