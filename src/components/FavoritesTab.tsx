import React from 'react';
import { useTranslation } from 'react-i18next';
import { Heart } from 'lucide-react';

const FavoritesTab: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center py-12">
      <Heart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {t('nav.favorites')}
      </h1>
      <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        Your saved trails, camping spots, and favorite adventures
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
        Coming soon: Save and organize your favorite outdoor locations.
      </p>
    </div>
  );
};

export default FavoritesTab;