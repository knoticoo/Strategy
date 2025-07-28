import React from 'react';
import { useTranslation } from 'react-i18next';
import { Snowflake } from 'lucide-react';

const WinterTab: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center py-12">
      <Snowflake className="h-16 w-16 mx-auto text-gray-400 mb-4" />
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {t('winter.title')}
      </h1>
      <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        {t('winter.subtitle')}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
        Coming soon: Winter sports locations with snow conditions and equipment rentals.
      </p>
    </div>
  );
};

export default WinterTab;