import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, CheckCircle, Info, Pill } from 'lucide-react';
import { Medicine } from '../../types';

interface MedicineCardProps {
  medicine: Medicine;
}

export const MedicineCard: React.FC<MedicineCardProps> = ({ medicine }) => {
  const { t } = useTranslation();

  const getCategoryColor = (category: string): string => {
    const colors = {
      antibiotics: 'bg-red-100 text-red-800 border-red-200',
      painkillers: 'bg-orange-100 text-orange-800 border-orange-200',
      vitamins: 'bg-green-100 text-green-800 border-green-200',
      food: 'bg-blue-100 text-blue-800 border-blue-200',
      supplements: 'bg-purple-100 text-purple-800 border-purple-200',
      antiparasitic: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      digestive: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      skin_care: 'bg-pink-100 text-pink-800 border-pink-200'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="card sticky top-24">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900">{medicine.name}</h3>
          <div className="flex items-center space-x-2">
            {medicine.prescriptionRequired ? (
              <AlertTriangle className="h-5 w-5 text-red-500" />
            ) : (
              <CheckCircle className="h-5 w-5 text-green-500" />
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 mb-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(medicine.category)}`}>
            {t(`medicines.categories.${medicine.category}`)}
          </span>
          {medicine.prescriptionRequired && (
            <span className="px-3 py-1 bg-red-100 text-red-800 border border-red-200 rounded-full text-sm font-medium">
              {t('medicines.prescriptionRequired')}
            </span>
          )}
        </div>
        
        <p className="text-gray-600">{medicine.description}</p>
      </div>

      {/* Usage */}
      <div className="mb-6">
        <h4 className="flex items-center text-lg font-semibold text-gray-900 mb-2">
          <Info className="h-5 w-5 mr-2 text-primary-600" />
          {t('medicines.details.usage')}
        </h4>
        <p className="text-gray-700">{medicine.usage}</p>
      </div>

      {/* Dosage */}
      <div className="mb-6">
        <h4 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
          <Pill className="h-5 w-5 mr-2 text-primary-600" />
          {t('medicines.details.dosage')}
        </h4>
        <div className="space-y-2">
          {Object.entries(medicine.dosage).map(([species, dose]) => (
            <div key={species} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">
                {t(`chat.petTypes.${species}`)}:
              </span>
              <span className="text-gray-600">{dose}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Ingredients */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-2">
          {t('medicines.details.ingredients')}
        </h4>
        <div className="flex flex-wrap gap-2">
          {medicine.ingredients.map((ingredient, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-sm"
            >
              {ingredient}
            </span>
          ))}
        </div>
      </div>

      {/* Side Effects */}
      {medicine.sideEffects.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            {t('medicines.details.sideEffects')}
          </h4>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <ul className="list-disc list-inside text-sm text-yellow-800 space-y-1">
              {medicine.sideEffects.map((effect, index) => (
                <li key={index}>{effect}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Contraindications */}
      {medicine.contraindications.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            {t('medicines.details.contraindications')}
          </h4>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <ul className="list-disc list-inside text-sm text-red-800 space-y-1">
              {medicine.contraindications.map((contra, index) => (
                <li key={index}>{contra}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Suitable for Species */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-2">
          {t('medicines.details.suitableFor')}
        </h4>
        <div className="flex flex-wrap gap-2">
          {medicine.forSpecies.map((species) => (
            <span
              key={species}
              className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-sm font-medium"
            >
              {t(`chat.petTypes.${species}`)}
            </span>
          ))}
        </div>
      </div>

      {/* Warning */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
          <div className="text-sm text-amber-800">
            <p className="font-medium mb-1">{t('medicines.details.important')}</p>
            <p>{t('medicines.details.warning')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};