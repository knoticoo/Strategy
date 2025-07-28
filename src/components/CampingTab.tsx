import React from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin } from 'lucide-react';

const CampingTab: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center py-12">
      <MapPin className="h-16 w-16 mx-auto text-gray-400 mb-4" />
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {t('camping.title')}
      </h1>
      <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        {t('camping.subtitle')}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
        Coming soon: Comprehensive camping sites with real-time availability, amenities, and booking.
      </p>
    </div>
  );
};

export default CampingTab;