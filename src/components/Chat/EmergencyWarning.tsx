import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, X, Phone } from 'lucide-react';

interface EmergencyWarningProps {
  onClose: () => void;
}

export const EmergencyWarning: React.FC<EmergencyWarningProps> = ({ onClose }) => {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <h3 className="text-lg font-bold text-red-600">
              {t('emergency.title')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-medium">
              {t('emergency.warning')}
            </p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              {t('emergency.symptoms')}
            </h4>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              {(t('emergency.symptomsList', { returnObjects: true }) as string[]).map((symptom, index) => (
                <li key={index}>{symptom}</li>
              ))}
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Phone className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-800">
                Ārkārtas veterinārā palīdzība:
              </span>
            </div>
            <p className="text-blue-700 text-sm">
              • Latvija: 112 (ārkārtas dienests)<br/>
              • 24/7 Veterinārā klīnika: +371 67 XXX XXX<br/>
              • Dzīvnieku slimnīca: +371 67 XXX XXX
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              {t('common.close')}
            </button>
            <button
              onClick={() => window.open('tel:112')}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <Phone className="h-4 w-4 inline mr-2" />
              Zvanīt 112
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};