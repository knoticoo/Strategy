import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Ticket, Copy, Check, Clock } from 'lucide-react';

const CouponsTab: React.FC = () => {
  const { t } = useTranslation();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Mock coupons data
  const coupons = [
    {
      id: '1',
      code: 'MAXIMA20',
      description: '20% atlaide pārtikas precēm',
      store: 'Maxima',
      minPurchase: 15,
      maxDiscount: 10,
      expiresOn: '2024-02-15',
      active: true
    },
    {
      id: '2',
      code: 'RIMI10',
      description: '10€ atlaide pie 50€ pirkuma',
      store: 'Rimi',
      minPurchase: 50,
      maxDiscount: 10,
      expiresOn: '2024-02-28',
      active: true
    },
    {
      id: '3',
      code: 'BARBORA5',
      description: 'Bezmaksas piegāde',
      store: 'Barbora',
      minPurchase: 25,
      maxDiscount: 5,
      expiresOn: '2024-01-25',
      active: false
    }
  ];

  const copyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('coupons.title')}
        </h1>
        <div className="flex items-center space-x-2">
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            {coupons.filter(c => c.active).length} {t('coupons.active')}
          </div>
        </div>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {coupons.map((coupon) => (
          <div 
            key={coupon.id} 
            className={`glass rounded-2xl p-6 ${
              coupon.active ? 'border-green-200' : 'border-gray-200 opacity-75'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                  {coupon.description}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {coupon.store}
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                coupon.active 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {coupon.active ? t('coupons.active') : t('coupons.expired')}
              </div>
            </div>

            {/* Coupon Code */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {t('coupons.code')}
                  </p>
                  <p className="font-mono text-lg font-bold text-gray-900 dark:text-white">
                    {coupon.code}
                  </p>
                </div>
                <button
                  onClick={() => copyCoupon(coupon.code)}
                  disabled={!coupon.active}
                  className={`p-2 rounded-lg transition-colors ${
                    coupon.active
                      ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {copiedCode === coupon.code ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Copy className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Coupon Details */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {t('coupons.minPurchase')}
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  €{coupon.minPurchase}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {t('coupons.maxDiscount')}
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  €{coupon.maxDiscount}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {t('coupons.expiresOn')}
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {coupon.expiresOn}
                </span>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => copyCoupon(coupon.code)}
              disabled={!coupon.active}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                coupon.active
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {copiedCode === coupon.code ? t('coupons.copied') : t('coupons.copyCoupon')}
            </button>
          </div>
        ))}
      </div>

      {/* Coming Soon Message */}
      <div className="glass rounded-2xl p-8 text-center">
        <Ticket className="h-16 w-16 text-purple-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Live Coupon Integration Coming Soon!
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          We're building a system to automatically find and verify the latest discount codes from Latvian retailers.
        </p>
      </div>
    </div>
  );
};

export default CouponsTab;