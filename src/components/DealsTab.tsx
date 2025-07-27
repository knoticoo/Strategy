import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, Star, Clock, ExternalLink } from 'lucide-react';

const DealsTab: React.FC = () => {
  const { t } = useTranslation();

  // Mock deals data
  const deals = [
    {
      id: '1',
      title: 'Piens 2.5% Rimi',
      store: 'Rimi',
      originalPrice: 1.49,
      salePrice: 0.99,
      discount: 34,
      validUntil: '2024-01-31',
      category: 'food'
    },
    {
      id: '2',
      title: 'Maize "Lāči" 750g',
      store: 'Maxima',
      originalPrice: 1.29,
      salePrice: 0.89,
      discount: 31,
      validUntil: '2024-01-30',
      category: 'food'
    },
    {
      id: '3',
      title: 'Banāni 1kg',
      store: 'Barbora',
      originalPrice: 2.99,
      salePrice: 1.99,
      discount: 33,
      validUntil: '2024-02-01',
      category: 'food'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('deals.title')}
        </h1>
        <div className="flex items-center space-x-4">
          <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <option value="all">{t('deals.categories.all')}</option>
            <option value="food">{t('deals.categories.food')}</option>
            <option value="household">{t('deals.categories.household')}</option>
          </select>
        </div>
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deals.map((deal) => (
          <div key={deal.id} className="glass rounded-2xl p-6 hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {deal.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {deal.store}
                </p>
              </div>
              <div className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                -{deal.discount}%
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {t('deals.originalPrice')}
                </span>
                <span className="text-sm line-through text-gray-500">
                  €{deal.originalPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {t('deals.salePrice')}
                </span>
                <span className="text-lg font-bold text-green-600">
                  €{deal.salePrice.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {t('deals.validUntil')} {deal.validUntil}
              </div>
            </div>

            <button className="w-full btn-primary flex items-center justify-center space-x-2">
              <span>{t('deals.viewDeal')}</span>
              <ExternalLink className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Coming Soon Message */}
      <div className="glass rounded-2xl p-8 text-center">
        <ShoppingBag className="h-16 w-16 text-blue-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Real-time Price Scraping Coming Soon!
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          We're working on integrating live prices from Maxima, Rimi, Barbora, and other Latvian stores.
        </p>
      </div>
    </div>
  );
};

export default DealsTab;