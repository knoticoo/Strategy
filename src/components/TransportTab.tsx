import React from 'react';
import { useTranslation } from 'react-i18next';
import { Car, Bus, Zap, MapPin } from 'lucide-react';

const TransportTab: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('transport.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {t('transport.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Smart Parking */}
        <div className="glass-morphism rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Car className="h-8 w-8 text-purple-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('transport.parking.title')}
            </h3>
          </div>
          <div className="space-y-3">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Gauja National Park</span>
                <span className="text-green-600 font-medium">47 spots</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">Free • EV Charging</div>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Jūrmala Beach</span>
                <span className="text-yellow-600 font-medium">12 spots</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">€2.50/h</div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Kemeri Bog</span>
                <span className="text-red-600 font-medium">Full</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">Free • Next available: 2:30 PM</div>
            </div>
          </div>
        </div>

        {/* Public Transport */}
        <div className="glass-morphism rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Bus className="h-8 w-8 text-blue-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('transport.publicTransport.title')}
            </h3>
          </div>
          <div className="space-y-3">
            <div className="border-l-4 border-blue-500 pl-3">
              <div className="font-medium text-gray-900 dark:text-white">Bus 641</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Riga → Sigulda</div>
              <div className="text-xs text-blue-600">Next: 14:25 (On time)</div>
            </div>
            <div className="border-l-4 border-green-500 pl-3">
              <div className="font-medium text-gray-900 dark:text-white">Train</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Riga → Jūrmala</div>
              <div className="text-xs text-green-600">Next: 14:18 (2 min delay)</div>
            </div>
            <div className="border-l-4 border-purple-500 pl-3">
              <div className="font-medium text-gray-900 dark:text-white">Bus 245</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Riga → Kemeri</div>
              <div className="text-xs text-purple-600">Next: 15:00</div>
            </div>
          </div>
        </div>

        {/* EV Charging */}
        <div className="glass-morphism rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Zap className="h-8 w-8 text-green-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              EV Charging
            </h3>
          </div>
          <div className="space-y-3">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Gauja Visitor Center</span>
                <span className="text-green-600 font-medium">Available</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">22kW • €0.25/kWh</div>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Kuldīga Center</span>
                <span className="text-yellow-600 font-medium">1 of 2</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">50kW • €0.30/kWh</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Jūrmala Mall</span>
                <span className="text-blue-600 font-medium">Fast</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">150kW • €0.35/kWh</div>
            </div>
          </div>
        </div>
      </div>

      {/* Google Maps Integration Notice */}
      <div className="glass-morphism rounded-lg p-6">
        <div className="flex items-center mb-4">
          <MapPin className="h-8 w-8 text-red-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Smart Navigation
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Real-time Integration</h4>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>• Google Maps API for live traffic</li>
              <li>• Public transport schedules</li>
              <li>• Parking availability updates</li>
              <li>• EV charging station status</li>
              <li>• Multi-modal route planning</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Smart Features</h4>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>• Best route to trailheads</li>
              <li>• Parking cost optimization</li>
              <li>• EV range planning</li>
              <li>• Offline navigation backup</li>
              <li>• Weather-based route suggestions</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>API Integration Ready:</strong> This component will integrate with Google Maps Platform, 
            public transport APIs, and real-time parking systems to provide live data for all adventure locations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TransportTab;