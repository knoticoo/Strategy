import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Shield,
  Navigation,
  Phone,
  AlertTriangle,
  Download,
  Wifi,
  WifiOff,
  Battery,
  Compass,
  Clock,
  Users,
  Bell,
  Route,
  Eye,
  Heart,
  Thermometer,
  CloudRain,
  Wind,
  Sun,
  Map as MapIcon
} from 'lucide-react';

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relation: string;
  isActive: boolean;
}

interface WeatherAlert {
  id: string;
  type: 'storm' | 'cold' | 'heat' | 'wind' | 'visibility';
  severity: 'low' | 'medium' | 'high' | 'extreme';
  title: string;
  description: string;
  validUntil: string;
  affectedAreas: string[];
}

interface OfflineMap {
  id: string;
  name: string;
  region: string;
  size: string;
  downloaded: boolean;
  downloadProgress?: number;
  lastUpdated: string;
  coverage: string[];
}

const SafetyTab: React.FC = () => {
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlert[]>([]);
  const [offlineMaps, setOfflineMaps] = useState<OfflineMap[]>([]);
  const [gpsStatus, setGpsStatus] = useState<'active' | 'searching' | 'inactive'>('inactive');
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [isOnline] = useState(true);
  const [currentLocation, setCurrentLocation] = useState({ lat: 56.9496, lng: 24.1052 });
  const [activeTracking, setActiveTracking] = useState(false);

  useEffect(() => {
    loadSafetyData();
    checkGPSStatus();
    monitorBattery();
  }, []);

  const loadSafetyData = () => {
    const mockContacts: EmergencyContact[] = [
      {
        id: '1',
        name: 'Anna Liepiņa',
        phone: '+371 26 123 456',
        relation: 'Partner',
        isActive: true
      },
      {
        id: '2',
        name: 'Jānis Bērziņš',
        phone: '+371 29 987 654',
        relation: 'Father',
        isActive: true
      },
      {
        id: '3',
        name: 'Emergency Services',
        phone: '112',
        relation: 'Emergency',
        isActive: true
      }
    ];

    const mockAlerts: WeatherAlert[] = [
      {
        id: '1',
        type: 'wind',
        severity: 'high',
        title: 'Strong Wind Warning',
        description: 'Wind gusts up to 80 km/h expected in coastal areas. Avoid exposed ridges and coastal trails.',
        validUntil: '2024-01-15 18:00',
        affectedAreas: ['Jūrmala Coast', 'Ventspils Region']
      },
      {
        id: '2',
        type: 'cold',
        severity: 'medium',
        title: 'Cold Weather Advisory',
        description: 'Temperatures dropping to -15°C tonight. Risk of hypothermia for unprepared hikers.',
        validUntil: '2024-01-16 08:00',
        affectedAreas: ['Gauja National Park', 'Rāzna Region']
      }
    ];

    const mockMaps: OfflineMap[] = [
      {
        id: '1',
        name: 'Gauja National Park',
        region: 'Vidzeme',
        size: '125 MB',
        downloaded: true,
        lastUpdated: '2024-01-10',
        coverage: ['Sigulda', 'Cēsis', 'Līgatne']
      },
      {
        id: '2',
        name: 'Kemeri National Park',
        region: 'Kurzeme',
        size: '78 MB',
        downloaded: false,
        downloadProgress: 0,
        lastUpdated: '2024-01-12',
        coverage: ['Kemeri', 'Jūrmala', 'Tukums']
      },
      {
        id: '3',
        name: 'Rāzna National Park',
        region: 'Latgale',
        size: '156 MB',
        downloaded: false,
        downloadProgress: 0,
        lastUpdated: '2024-01-08',
        coverage: ['Rēzekne', 'Daugavpils', 'Krāslava']
      },
      {
        id: '4',
        name: 'Coastal Trails',
        region: 'Kurzeme Coast',
        size: '203 MB',
        downloaded: true,
        lastUpdated: '2024-01-05',
        coverage: ['Ventspils', 'Liepāja', 'Kolka']
      }
    ];

    setEmergencyContacts(mockContacts);
    setWeatherAlerts(mockAlerts);
    setOfflineMaps(mockMaps);
  };

  const checkGPSStatus = () => {
    if (navigator.geolocation) {
      setGpsStatus('searching');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setGpsStatus('active');
        },
        (error) => {
          console.error('GPS Error:', error);
          setGpsStatus('inactive');
        }
      );
    }
  };

  const monitorBattery = () => {
    // Simulate battery monitoring
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
      });
    }
  };

  const triggerSOS = () => {
    setIsSOSActive(true);
    
    // Send location to emergency contacts
    const locationMessage = `EMERGENCY: I need help! My location: https://maps.google.com/?q=${currentLocation.lat},${currentLocation.lng}`;
    
    // In a real app, this would send SMS/calls to emergency contacts
    console.log('SOS triggered:', locationMessage);
    
    // Auto-disable after 30 seconds for demo
    setTimeout(() => {
      setIsSOSActive(false);
    }, 30000);
  };

  const downloadMap = (mapId: string) => {
    setOfflineMaps(maps => maps.map(map => 
      map.id === mapId 
        ? { ...map, downloadProgress: 0 }
        : map
    ));

    // Simulate download progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setOfflineMaps(maps => maps.map(map => 
        map.id === mapId 
          ? { ...map, downloadProgress: progress }
          : map
      ));

      if (progress >= 100) {
        clearInterval(interval);
        setOfflineMaps(maps => maps.map(map => 
          map.id === mapId 
            ? { ...map, downloaded: true, downloadProgress: undefined }
            : map
        ));
      }
    }, 500);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      case 'medium': return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20';
      case 'high': return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      case 'extreme': return 'text-purple-600 bg-purple-50 dark:bg-purple-900/20';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'storm': return <CloudRain className="h-4 w-4" />;
      case 'wind': return <Wind className="h-4 w-4" />;
      case 'cold': return <Thermometer className="h-4 w-4" />;
      case 'heat': return <Sun className="h-4 w-4" />;
      case 'visibility': return <Eye className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Safety & Navigation
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Advanced safety features and offline navigation for secure outdoor adventures
        </p>
      </div>

      {/* Status Bar */}
      <div className="glass-morphism rounded-lg p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded-lg ${
              gpsStatus === 'active' ? 'bg-green-100 text-green-600' : 
              gpsStatus === 'searching' ? 'bg-yellow-100 text-yellow-600' : 
              'bg-red-100 text-red-600'
            }`}>
              <Navigation className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">GPS</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">{gpsStatus}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded-lg ${
              isOnline ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}>
              {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Connection</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">{isOnline ? 'Online' : 'Offline'}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded-lg ${
              batteryLevel > 20 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}>
              <Battery className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Battery</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">{batteryLevel}%</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded-lg ${
              activeTracking ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
            }`}>
              <Route className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Tracking</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">{activeTracking ? 'Active' : 'Inactive'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency SOS */}
      <div className="glass-morphism rounded-lg p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center justify-center">
            <Shield className="h-5 w-5 mr-2 text-red-600" />
            Emergency SOS
          </h3>
          
          {!isSOSActive ? (
            <div>
              <button
                onClick={triggerSOS}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-colors mb-4"
              >
                <Phone className="h-6 w-6 mr-2 inline" />
                Emergency SOS
              </button>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Press and hold for 3 seconds to send your location to emergency contacts
              </p>
            </div>
          ) : (
            <div className="text-red-600">
              <div className="animate-pulse mb-4">
                <Phone className="h-12 w-12 mx-auto mb-2" />
                <p className="text-xl font-bold">SOS ACTIVE</p>
              </div>
              <p className="text-sm">Emergency contacts have been notified with your location</p>
              <button
                onClick={() => setIsSOSActive(false)}
                className="mt-4 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
              >
                Cancel SOS
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weather Alerts */}
        <div className="glass-morphism rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Bell className="h-5 w-5 mr-2 text-orange-600" />
            Weather Alerts
          </h3>
          
          <div className="space-y-3">
            {weatherAlerts.map((alert) => (
              <div key={alert.id} className={`rounded-lg p-3 ${getSeverityColor(alert.severity)}`}>
                <div className="flex items-start space-x-2">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <h4 className="font-medium">{alert.title}</h4>
                    <p className="text-sm mt-1">{alert.description}</p>
                    <div className="flex items-center justify-between text-xs mt-2">
                      <span>Valid until: {alert.validUntil}</span>
                      <span className="font-medium">{alert.severity.toUpperCase()}</span>
                    </div>
                    <div className="mt-1">
                      <span className="text-xs">Areas: {alert.affectedAreas.join(', ')}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="glass-morphism rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2 text-blue-600" />
            Emergency Contacts
          </h3>
          
          <div className="space-y-3">
            {emergencyContacts.map((contact) => (
              <div key={contact.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{contact.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{contact.relation}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{contact.phone}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    contact.isActive ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                  <button className="text-blue-600 hover:text-blue-700">
                    <Phone className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Add Contact
          </button>
        </div>
      </div>

      {/* Offline Maps */}
      <div className="glass-morphism rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <MapIcon className="h-5 w-5 mr-2 text-green-600" />
          Offline Maps
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {offlineMaps.map((map) => (
            <div key={map.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{map.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{map.region}</p>
                </div>
                <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{map.size}</span>
              </div>
              
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                Coverage: {map.coverage.join(', ')}
              </div>
              
              {map.downloaded ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-600 flex items-center">
                    <Download className="h-4 w-4 mr-1" />
                    Downloaded
                  </span>
                  <span className="text-xs text-gray-500">Updated: {map.lastUpdated}</span>
                </div>
              ) : (
                <div>
                  {map.downloadProgress !== undefined ? (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Downloading...</span>
                        <span>{map.downloadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${map.downloadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => downloadMap(map.id)}
                      className="w-full bg-nature-600 text-white py-2 rounded-lg hover:bg-nature-700 transition-colors flex items-center justify-center"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>Offline Navigation:</strong> Downloaded maps work without internet connection. 
            GPS tracking and emergency features remain active even offline.
          </p>
        </div>
      </div>

      {/* Trail Tracking */}
      <div className="glass-morphism rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Compass className="h-5 w-5 mr-2 text-purple-600" />
          Live Trail Tracking
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <Clock className="h-6 w-6 mx-auto text-blue-600 mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">2:34:12</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
          </div>
          
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <Route className="h-6 w-6 mx-auto text-green-600 mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">8.7 km</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Distance</p>
          </div>
          
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <Heart className="h-6 w-6 mx-auto text-red-600 mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">142 bpm</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Heart Rate</p>
          </div>
        </div>
        
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTracking(!activeTracking)}
            className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
              activeTracking 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {activeTracking ? 'Stop Tracking' : 'Start Tracking'}
          </button>
          
          <button className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Share Location
          </button>
        </div>
      </div>

      {/* Safety Tips */}
      <div className="glass-morphism rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Shield className="h-5 w-5 mr-2 text-yellow-600" />
          Safety Recommendations
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Before You Go</h4>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>• Share your planned route with emergency contacts</li>
              <li>• Check weather conditions and alerts</li>
              <li>• Download offline maps for your area</li>
              <li>• Ensure your phone is fully charged</li>
              <li>• Pack emergency supplies and first aid kit</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">During Your Adventure</h4>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>• Keep GPS tracking active</li>
              <li>• Check in regularly with contacts</li>
              <li>• Stay on marked trails</li>
              <li>• Monitor weather conditions</li>
              <li>• Trust your instincts - turn back if unsafe</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyTab;