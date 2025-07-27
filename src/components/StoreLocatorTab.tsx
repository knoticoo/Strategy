import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Phone, 
  Star, 
  Filter,
  Search,
  Car,
  Zap,
  RefreshCw
} from 'lucide-react';

interface Store {
  id: string;
  name: string;
  chain: 'Maxima' | 'Rimi' | 'Barbora' | 'Citro';
  address: string;
  city: string;
  postalCode: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  phone?: string;
  openingHours: {
    [key: string]: { open: string; close: string; closed?: boolean };
  };
  features: string[];
  rating: number;
  distance?: number;
  hasParking: boolean;
  hasAtm: boolean;
  size: 'small' | 'medium' | 'large' | 'hypermarket';
}

const StoreLocatorTab: React.FC = () => {
  const { t } = useTranslation();
  const [stores, setStores] = useState<Store[]>([]);
  const [filteredStores, setFilteredStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedChain, setSelectedChain] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null);
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'name'>('distance');

  useEffect(() => {
    loadStores();
    getUserLocation();
  }, []);

  useEffect(() => {
    filterStores();
  }, [selectedChain, selectedCity, searchQuery, stores, sortBy]);

  const loadStores = async () => {
    setLoading(true);
    
    // Simulate API call with realistic Latvian store data
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const latvianStores: Store[] = [
      // Riga - Maxima stores
      {
        id: 'max_riga_001',
        name: 'Maxima XX Imanta',
        chain: 'Maxima',
        address: 'Anniņmuižas bulvāris 41',
        city: 'Rīga',
        postalCode: 'LV-1067',
        coordinates: { lat: 56.9496, lng: 23.9513 },
        phone: '+371 67 808 900',
        openingHours: {
          monday: { open: '08:00', close: '23:00' },
          tuesday: { open: '08:00', close: '23:00' },
          wednesday: { open: '08:00', close: '23:00' },
          thursday: { open: '08:00', close: '23:00' },
          friday: { open: '08:00', close: '23:00' },
          saturday: { open: '08:00', close: '23:00' },
          sunday: { open: '09:00', close: '22:00' }
        },
        features: ['Pharmacy', 'Bakery', 'Fresh Meat', 'Self-checkout'],
        rating: 4.3,
        hasParking: true,
        hasAtm: true,
        size: 'hypermarket'
      },
      {
        id: 'max_riga_002',
        name: 'Maxima X Centrs',
        chain: 'Maxima',
        address: 'Krasta iela 46',
        city: 'Rīga',
        postalCode: 'LV-1003',
        coordinates: { lat: 56.9677, lng: 24.1056 },
        phone: '+371 67 808 901',
        openingHours: {
          monday: { open: '08:00', close: '22:00' },
          tuesday: { open: '08:00', close: '22:00' },
          wednesday: { open: '08:00', close: '22:00' },
          thursday: { open: '08:00', close: '22:00' },
          friday: { open: '08:00', close: '22:00' },
          saturday: { open: '08:00', close: '22:00' },
          sunday: { open: '10:00', close: '21:00' }
        },
        features: ['Express checkout', 'Coffee shop'],
        rating: 4.1,
        hasParking: false,
        hasAtm: true,
        size: 'large'
      },

      // Riga - Rimi stores
      {
        id: 'rimi_riga_001',
        name: 'Rimi Hypermarket Spice',
        chain: 'Rimi',
        address: 'Lielirbes iela 29',
        city: 'Rīga',
        postalCode: 'LV-1046',
        coordinates: { lat: 56.9434, lng: 24.0642 },
        phone: '+371 67 777 888',
        openingHours: {
          monday: { open: '08:00', close: '23:00' },
          tuesday: { open: '08:00', close: '23:00' },
          wednesday: { open: '08:00', close: '23:00' },
          thursday: { open: '08:00', close: '23:00' },
          friday: { open: '08:00', close: '23:00' },
          saturday: { open: '08:00', close: '23:00' },
          sunday: { open: '09:00', close: '22:00' }
        },
        features: ['Sushi bar', 'Wine cellar', 'Organic section', 'Home goods'],
        rating: 4.5,
        hasParking: true,
        hasAtm: true,
        size: 'hypermarket'
      },
      {
        id: 'rimi_riga_002',
        name: 'Rimi Centrs',
        chain: 'Rimi',
        address: 'Audēju iela 16',
        city: 'Rīga',
        postalCode: 'LV-1050',
        coordinates: { lat: 56.9496, lng: 24.1052 },
        phone: '+371 67 777 889',
        openingHours: {
          monday: { open: '08:00', close: '22:00' },
          tuesday: { open: '08:00', close: '22:00' },
          wednesday: { open: '08:00', close: '22:00' },
          thursday: { open: '08:00', close: '22:00' },
          friday: { open: '08:00', close: '23:00' },
          saturday: { open: '08:00', close: '23:00' },
          sunday: { open: '10:00', close: '21:00' }
        },
        features: ['City center location', 'Quick shopping'],
        rating: 4.2,
        hasParking: false,
        hasAtm: false,
        size: 'medium'
      },

      // Daugavpils stores
      {
        id: 'max_daugavpils_001',
        name: 'Maxima XX Daugavpils',
        chain: 'Maxima',
        address: 'Rīgas iela 60',
        city: 'Daugavpils',
        postalCode: 'LV-5401',
        coordinates: { lat: 55.8745, lng: 26.5065 },
        phone: '+371 65 424 242',
        openingHours: {
          monday: { open: '08:00', close: '22:00' },
          tuesday: { open: '08:00', close: '22:00' },
          wednesday: { open: '08:00', close: '22:00' },
          thursday: { open: '08:00', close: '22:00' },
          friday: { open: '08:00', close: '22:00' },
          saturday: { open: '08:00', close: '22:00' },
          sunday: { open: '09:00', close: '21:00' }
        },
        features: ['Pharmacy', 'Bakery'],
        rating: 4.0,
        hasParking: true,
        hasAtm: true,
        size: 'large'
      },

      // Liepāja stores
      {
        id: 'rimi_liepaja_001',
        name: 'Rimi Liepāja',
        chain: 'Rimi',
        address: 'Zemnieku iela 32',
        city: 'Liepāja',
        postalCode: 'LV-3401',
        coordinates: { lat: 56.5053, lng: 21.0101 },
        phone: '+371 63 424 555',
        openingHours: {
          monday: { open: '08:00', close: '22:00' },
          tuesday: { open: '08:00', close: '22:00' },
          wednesday: { open: '08:00', close: '22:00' },
          thursday: { open: '08:00', close: '22:00' },
          friday: { open: '08:00', close: '22:00' },
          saturday: { open: '08:00', close: '22:00' },
          sunday: { open: '09:00', close: '21:00' }
        },
        features: ['Seaside location', 'Fresh fish section'],
        rating: 4.3,
        hasParking: true,
        hasAtm: true,
        size: 'large'
      },

      // Barbora pickup points
      {
        id: 'barbora_riga_001',
        name: 'Barbora Pickup Point - Spice',
        chain: 'Barbora',
        address: 'Lielirbes iela 29 (Spice mall)',
        city: 'Rīga',
        postalCode: 'LV-1046',
        coordinates: { lat: 56.9434, lng: 24.0642 },
        phone: '+371 20 008 899',
        openingHours: {
          monday: { open: '10:00', close: '22:00' },
          tuesday: { open: '10:00', close: '22:00' },
          wednesday: { open: '10:00', close: '22:00' },
          thursday: { open: '10:00', close: '22:00' },
          friday: { open: '10:00', close: '22:00' },
          saturday: { open: '10:00', close: '22:00' },
          sunday: { open: '10:00', close: '21:00' }
        },
        features: ['Online order pickup', 'Refrigerated storage'],
        rating: 4.4,
        hasParking: true,
        hasAtm: false,
        size: 'small'
      },

      // Citro convenience stores
      {
        id: 'citro_riga_001',
        name: 'Citro Express Brīvības',
        chain: 'Citro',
        address: 'Brīvības iela 85',
        city: 'Rīga',
        postalCode: 'LV-1001',
        coordinates: { lat: 56.9677, lng: 24.1178 },
        phone: '+371 67 333 444',
        openingHours: {
          monday: { open: '06:00', close: '24:00' },
          tuesday: { open: '06:00', close: '24:00' },
          wednesday: { open: '06:00', close: '24:00' },
          thursday: { open: '06:00', close: '24:00' },
          friday: { open: '06:00', close: '24:00' },
          saturday: { open: '06:00', close: '24:00' },
          sunday: { open: '07:00', close: '23:00' }
        },
        features: ['24h service', 'Coffee', 'Newspapers'],
        rating: 3.8,
        hasParking: false,
        hasAtm: true,
        size: 'small'
      }
    ];

    // Calculate distances if user location is available
    if (userLocation) {
      latvianStores.forEach(store => {
        store.distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          store.coordinates.lat,
          store.coordinates.lng
        );
      });
    }

    setStores(latvianStores);
    setLoading(false);
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Location access denied:', error);
          // Default to Riga center if location denied
          setUserLocation({ lat: 56.9496, lng: 24.1052 });
        }
      );
    }
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const filterStores = () => {
    let filtered = stores;

    // Filter by chain
    if (selectedChain !== 'all') {
      filtered = filtered.filter(store => store.chain === selectedChain);
    }

    // Filter by city
    if (selectedCity !== 'all') {
      filtered = filtered.filter(store => store.city === selectedCity);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(store =>
        store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort stores
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return (a.distance || 0) - (b.distance || 0);
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredStores(filtered);
  };

  const getChainIcon = (chain: string) => {
    switch (chain) {
      case 'Maxima': return '🏪';
      case 'Rimi': return '🛒';
      case 'Barbora': return '🚚';
      case 'Citro': return '⚡';
      default: return '🏬';
    }
  };

  const getChainColor = (chain: string) => {
    switch (chain) {
      case 'Maxima': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'Rimi': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Barbora': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Citro': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getSizeIcon = (size: string) => {
    switch (size) {
      case 'hypermarket': return '🏢';
      case 'large': return '🏪';
      case 'medium': return '🏬';
      case 'small': return '🏧';
      default: return '🏬';
    }
  };

  const openGoogleMaps = (store: Store) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${store.coordinates.lat},${store.coordinates.lng}&destination_place_id=${encodeURIComponent(store.name)}`;
    window.open(url, '_blank');
  };

  const getCurrentDayHours = (store: Store) => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = days[new Date().getDay()];
    return store.openingHours[today];
  };

  const isStoreOpen = (store: Store) => {
    const todayHours = getCurrentDayHours(store);
    if (!todayHours || todayHours.closed) return false;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const openTime = parseInt(todayHours.open.split(':')[0]) * 60 + parseInt(todayHours.open.split(':')[1]);
    const closeTime = parseInt(todayHours.close.split(':')[0]) * 60 + parseInt(todayHours.close.split(':')[1]);

    return currentTime >= openTime && currentTime <= closeTime;
  };

  const cities = ['all', ...Array.from(new Set(stores.map(s => s.city)))];
  const chains = ['all', 'Maxima', 'Rimi', 'Barbora', 'Citro'];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Store Locator
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Find nearby stores across Latvia
          </p>
        </div>
        <button
          onClick={loadStores}
          disabled={loading}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center">
            <MapPin className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                {filteredStores.length}
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-500">Stores Found</div>
            </div>
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center">
            <Zap className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                {filteredStores.filter(s => isStoreOpen(s)).length}
              </div>
              <div className="text-sm text-green-600 dark:text-green-500">Open Now</div>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
          <div className="flex items-center">
            <Car className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                {filteredStores.filter(s => s.hasParking).length}
              </div>
              <div className="text-sm text-purple-600 dark:text-purple-500">With Parking</div>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
          <div className="flex items-center">
            <Star className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-orange-700 dark:text-orange-400">
                {(filteredStores.reduce((sum, s) => sum + s.rating, 0) / filteredStores.length || 0).toFixed(1)}
              </div>
              <div className="text-sm text-orange-600 dark:text-orange-500">Avg Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Search className="h-4 w-4 inline mr-1" />
              Search
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Store name or address..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Filter className="h-4 w-4 inline mr-1" />
              Store Chain
            </label>
            <select
              value={selectedChain}
              onChange={(e) => setSelectedChain(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {chains.map(chain => (
                <option key={chain} value={chain}>
                  {chain === 'all' ? 'All Chains' : chain}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <MapPin className="h-4 w-4 inline mr-1" />
              City
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {cities.map(city => (
                <option key={city} value={city}>
                  {city === 'all' ? 'All Cities' : city}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'distance' | 'rating' | 'name')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="distance">Distance</option>
              <option value="rating">Rating</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Store List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
              <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3 mb-4"></div>
              <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
            </div>
          ))
        ) : filteredStores.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No stores found matching your criteria
            </p>
          </div>
        ) : (
          filteredStores.map((store) => (
            <div
              key={store.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-shadow"
            >
              {/* Store Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <span className="text-3xl mr-3">{getChainIcon(store.chain)}</span>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                      {store.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getChainColor(store.chain)}`}>
                        {store.chain}
                      </span>
                      <span className="text-sm text-gray-500">
                        {getSizeIcon(store.size)} {store.size}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="font-medium">{store.rating}</span>
                  </div>
                  {store.distance !== undefined && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {store.distance.toFixed(1)} km
                    </div>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start mb-3">
                <MapPin className="h-4 w-4 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <div>{store.address}</div>
                  <div>{store.city}, {store.postalCode}</div>
                </div>
              </div>

              {/* Phone */}
              {store.phone && (
                <div className="flex items-center mb-3">
                  <Phone className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{store.phone}</span>
                </div>
              )}

              {/* Opening Hours */}
              <div className="flex items-center mb-4">
                <Clock className="h-4 w-4 text-gray-500 mr-2" />
                <div className="text-sm">
                  {getCurrentDayHours(store) ? (
                    <div className="flex items-center">
                      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${isStoreOpen(store) ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      <span className={isStoreOpen(store) ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                        {isStoreOpen(store) ? 'Open' : 'Closed'} • {getCurrentDayHours(store)?.open} - {getCurrentDayHours(store)?.close}
                      </span>
                    </div>
                  ) : (
                    <span className="text-red-600 dark:text-red-400">Closed today</span>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-2 mb-4">
                {store.features.map((feature, index) => (
                  <span
                    key={index}
                    className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                  >
                    {feature}
                  </span>
                ))}
                {store.hasParking && (
                  <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                    <Car className="h-3 w-3 inline mr-1" />
                    Parking
                  </span>
                )}
                {store.hasAtm && (
                  <span className="inline-block px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs rounded-full">
                    💳 ATM
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => openGoogleMaps(store)}
                  className="flex-1 flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Directions
                </button>
                
                {store.phone && (
                  <button
                    onClick={() => window.open(`tel:${store.phone}`, '_self')}
                    className="flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Location Notice */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <div className="flex items-center">
          <MapPin className="h-6 w-6 text-blue-600 mr-3" />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Location-Based Search
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {userLocation 
                ? 'Distances calculated from your current location. Grant location access for more accurate results.'
                : 'Enable location access to see distances to stores and get personalized recommendations.'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreLocatorTab;