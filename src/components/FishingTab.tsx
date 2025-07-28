import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MapPin,
  Star,
  Heart,
  Euro,
  Phone,
  Globe,
  Navigation,
  Copy,
  X
} from 'lucide-react';
import { realLatvianFishing, RealLocation, getDirectionsUrl } from '../data/realLatvianData';
import InteractiveMap from './InteractiveMap';
import ImageWithFallback from './ImageWithFallback';

const FishingTab: React.FC = () => {
  const { i18n } = useTranslation();
  const [fishingSpots, setFishingSpots] = useState<RealLocation[]>([]);
  const [filteredSpots, setFilteredSpots] = useState<RealLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedSeason, setSelectedSeason] = useState<string>('all');
  const [showMap, setShowMap] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState<RealLocation | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    loadFishingSpots();
    getUserLocation();
  }, []);

  useEffect(() => {
    const filterData = () => {
      let filtered = [...fishingSpots];

      // Search filter
      if (searchTerm) {
        filtered = filtered.filter(spot =>
          spot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          spot.description[i18n.language as keyof typeof spot.description]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          spot.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
          spot.features.some(feature => feature.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }

      // Region filter
      if (selectedRegion !== 'all') {
        filtered = filtered.filter(spot => spot.region === selectedRegion);
      }

      // Season filter
      if (selectedSeason !== 'all') {
        filtered = filtered.filter(spot => spot.season.includes(selectedSeason));
      }

      setFilteredSpots(filtered);
    };

    filterData();
  }, [fishingSpots, searchTerm, selectedRegion, selectedSeason, i18n.language]);

  const loadFishingSpots = async () => {
    setLoading(true);
    setFishingSpots(realLatvianFishing);
    setLoading(false);
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.log('Geolocation error:', error);
        }
      );
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const getDistanceFromUser = (spot: RealLocation): string => {
    if (!userLocation) return '';
    const distance = calculateDistance(userLocation[0], userLocation[1], spot.coordinates[0], spot.coordinates[1]);
    return `${distance.toFixed(1)} km away`;
  };

  const handleSpotClick = (spot: RealLocation) => {
    setSelectedSpot(spot);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const regions = Array.from(new Set(fishingSpots.map(spot => spot.region)));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading fishing spots...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          🎣 Fishing Spots
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Discover the best fishing locations in Latvia
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div>
            <input
              type="text"
              placeholder="Search fishing spots..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Region Filter */}
          <div>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Regions</option>
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>

          {/* Season Filter */}
          <div>
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Seasons</option>
              <option value="spring">Spring</option>
              <option value="summer">Summer</option>
              <option value="autumn">Autumn</option>
              <option value="winter">Winter</option>
            </select>
          </div>

          {/* Map Toggle */}
          <div>
            <button
              onClick={() => setShowMap(!showMap)}
              className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                showMap
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-green-50 dark:hover:bg-green-900/20'
              }`}
            >
              {showMap ? 'Hide Map' : 'Show Map'}
            </button>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Found {filteredSpots.length} fishing spot{filteredSpots.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Map */}
      {showMap && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="h-96">
            <InteractiveMap
              locations={filteredSpots}
              onLocationClick={handleSpotClick}
            />
          </div>
        </div>
      )}

      {/* Fishing Spots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSpots.map((spot) => (
          <div
            key={spot.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
            onClick={() => handleSpotClick(spot)}
          >
            {/* Spot Image */}
            <div className="relative h-48 overflow-hidden">
              <ImageWithFallback
                src={spot.images[0]}
                alt={spot.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
                  🎣 Fishing
                </span>
              </div>
              <div className="absolute top-4 right-4">
                <button className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                  <Heart className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Spot Info */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
                  {spot.name}
                </h3>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">4.7</span>
                </div>
              </div>

              <div className="flex items-center text-sm text-gray-700 dark:text-gray-300 mb-3 bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
                <MapPin className="h-4 w-4 mr-2 text-green-600" />
                <span className="font-medium">{spot.region}</span>
                {userLocation && (
                  <>
                    <span className="mx-2 text-gray-400">•</span>
                    <span className="text-blue-600 font-medium">{getDistanceFromUser(spot)}</span>
                  </>
                )}
              </div>

              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                {spot.description[i18n.language as keyof typeof spot.description] || spot.description.en}
              </p>

              {/* Features */}
              <div className="flex flex-wrap gap-2 mb-4">
                {spot.features.slice(0, 3).map((feature, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                  >
                    {feature}
                  </span>
                ))}
                {spot.features.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                    +{spot.features.length - 3} more
                  </span>
                )}
              </div>

              {/* Pricing & Actions */}
              <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <div className="text-sm">
                  {spot.pricing?.free ? (
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 font-medium">Free Access</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Euro className="h-4 w-4 text-gray-600" />
                      <span className="font-bold text-gray-900 dark:text-white">
                        €{spot.pricing?.adult}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">/person</span>
                    </div>
                  )}
                </div>
                <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Spot Detail Modal */}
      {selectedSpot && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedSpot.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">{selectedSpot.region}</p>
              </div>
              <button
                onClick={() => setSelectedSpot(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Images */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedSpot.images.map((image, index) => (
                  <ImageWithFallback
                    key={index}
                    src={image}
                    alt={`${selectedSpot.name} ${index + 1}`}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                ))}
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedSpot.description[i18n.language as keyof typeof selectedSpot.description] || selectedSpot.description.en}
                </p>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Features</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {selectedSpot.features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm rounded-lg text-center"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Map */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Location</h3>
                <div className="h-64 rounded-lg overflow-hidden">
                  <InteractiveMap
                    locations={[selectedSpot]}
                    onLocationClick={() => {}}
                  />
                </div>
              </div>

              {/* Contact & Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a
                  href={getDirectionsUrl(selectedSpot.coordinates[0], selectedSpot.coordinates[1], selectedSpot.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Navigation className="h-4 w-4" />
                  Get Directions
                </a>

                {selectedSpot.contact?.phone && (
                  <a
                    href={`tel:${selectedSpot.contact.phone}`}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                    Call Now
                  </a>
                )}

                {selectedSpot.contact?.website && (
                  <a
                    href={selectedSpot.contact.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Globe className="h-4 w-4" />
                    Visit Website
                  </a>
                )}

                <button
                  onClick={() => copyToClipboard(window.location.href)}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Copy className="h-4 w-4" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FishingTab;