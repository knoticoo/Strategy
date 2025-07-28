import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import InteractiveMap from './InteractiveMap';
import ImageWithFallback from './ImageWithFallback';
import { realLatvianCamping, RealLocation, calculateDistance, getDirectionsUrl } from '../data/realLatvianData';
import {
  MapPin,
  Tent,
  Car,
  Wifi,
  Zap,
  Droplets,
  Utensils,
  Star,
  Clock,
  Phone,
  Globe,
  Search,
  Map,
  List,
  Heart,
  Share,
  Info,
  X
} from 'lucide-react';

const CampingTab: React.FC = () => {
  const { i18n } = useTranslation();
  const [campsites, setCampsites] = useState<RealLocation[]>([]);
  const [filteredCampsites, setFilteredCampsites] = useState<RealLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [showMap, setShowMap] = useState(false);
  const [selectedCampsite, setSelectedCampsite] = useState<RealLocation | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    loadCampsites();
    getUserLocation();
  }, []);

  useEffect(() => {
    const filterData = () => {
      let filtered = [...campsites];

      if (searchTerm) {
        filtered = filtered.filter(campsite =>
          campsite.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          campsite.description[i18n.language as keyof typeof campsite.description]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          campsite.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
          campsite.features.some(feature => feature.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }

      if (selectedRegion !== 'all') {
        filtered = filtered.filter(campsite => campsite.region === selectedRegion);
      }

      setFilteredCampsites(filtered);
    };

    filterData();
  }, [campsites, searchTerm, selectedRegion, i18n.language]);

  const loadCampsites = async () => {
    setLoading(true);
    // Use real Latvian camping data
    setCampsites(realLatvianCamping);
    setLoading(false);
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        () => {
          setUserLocation([56.9496, 24.1052]); // Default to Riga
        }
      );
    } else {
      setUserLocation([56.9496, 24.1052]);
    }
  };



  const getDistanceFromUser = (campsite: RealLocation): string => {
    if (!userLocation) return '';
    const distance = calculateDistance(
      userLocation[0], userLocation[1],
      campsite.coordinates[0], campsite.coordinates[1]
    );
    return `${distance.toFixed(1)} km away`;
  };

  const handleCampsiteClick = (campsite: RealLocation) => {
    setSelectedCampsite(campsite);
  };

  const regions = ['all', 'Vidzeme', 'Kurzeme', 'Zemgale', 'Latgale', 'Pierīga'];

  const getFacilityIcon = (facility: string) => {
    switch (facility.toLowerCase()) {
      case 'wifi': return <Wifi className="h-4 w-4" />;
      case 'electricity': return <Zap className="h-4 w-4" />;
      case 'water': return <Droplets className="h-4 w-4" />;
      case 'showers': return <Droplets className="h-4 w-4" />;
      case 'restaurant': return <Utensils className="h-4 w-4" />;
      case 'parking': return <Car className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading real Latvian campsites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">🏕️ Real Latvian Camping</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover authentic camping sites across Latvia with real facilities, 
          pricing, and contact information from official sources.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Search */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search campsites, locations, facilities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Region Filter */}
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {regions.map(region => (
              <option key={region} value={region}>
                {region === 'all' ? 'All Regions' : region}
              </option>
            ))}
          </select>
        </div>

        {/* View Toggle */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Found {filteredCampsites.length} campsites
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setShowMap(false)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                !showMap ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <List className="h-4 w-4" />
              List View
            </button>
            <button
              onClick={() => setShowMap(true)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                showMap ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <Map className="h-4 w-4" />
              Map View
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {showMap ? (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Interactive Camping Map</h3>
          <InteractiveMap
            locations={filteredCampsites}
            height="500px"
            onLocationClick={handleCampsiteClick}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCampsites.map((campsite) => (
            <div
              key={campsite.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => handleCampsiteClick(campsite)}
            >
              {/* Campsite Image */}
              <div className="relative h-48 overflow-hidden">
                <ImageWithFallback
                  src={campsite.images[0]}
                  alt={campsite.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-green-600 text-white rounded-full text-sm font-medium">
                    <Tent className="h-4 w-4 inline mr-1" />
                    Camping
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <button className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                    <Heart className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Campsite Info */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                    {campsite.name}
                  </h3>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm text-gray-600">4.6</span>
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-700 mb-3 bg-gray-50 rounded-lg p-2">
                  <MapPin className="h-4 w-4 mr-2 text-green-600" />
                  <span className="font-medium">{campsite.region}</span>
                  {userLocation && (
                    <>
                      <span className="mx-2 text-gray-400">•</span>
                      <span className="text-blue-600 font-medium">{getDistanceFromUser(campsite)}</span>
                    </>
                  )}
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {campsite.description[i18n.language as keyof typeof campsite.description] || campsite.description.en}
                </p>

                {/* Facilities */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Facilities</h4>
                  <div className="flex flex-wrap gap-2">
                    {campsite.facilities.slice(0, 4).map((facility, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full"
                      >
                        {getFacilityIcon(facility)}
                        <span>{facility}</span>
                      </div>
                    ))}
                    {campsite.facilities.length > 4 && (
                      <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-full">
                        +{campsite.facilities.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {campsite.features.slice(0, 3).map((feature, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-green-50 text-green-600 text-xs rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pricing & Actions */}
                <div className="flex justify-between items-center bg-gray-50 rounded-lg p-3">
                  <div className="text-sm">
                    {campsite.pricing?.free ? (
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🆓</span>
                        <div>
                          <div className="text-green-700 font-bold">Free</div>
                          <div className="text-xs text-gray-600">No cost</div>
                        </div>
                      </div>
                    ) : campsite.pricing?.adult ? (
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🏕️</span>
                        <div>
                          <div className="text-orange-700 font-bold">€{campsite.pricing.adult}/adult</div>
                          {campsite.pricing.child && (
                            <div className="text-xs text-gray-600">€{campsite.pricing.child}/child</div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-500">Price varies</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50"
                      title="Share location"
                    >
                      <Share className="h-4 w-4" />
                    </button>
                    <button 
                      className="p-2 text-gray-400 hover:text-green-600 transition-colors rounded-full hover:bg-green-50"
                      title="More info"
                    >
                      <Info className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Campsite Detail Modal */}
      {selectedCampsite && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <ImageWithFallback
                src={selectedCampsite.images[0]}
                alt={selectedCampsite.name}
                className="w-full h-64 object-cover"
              />
              <button
                onClick={() => setSelectedCampsite(null)}
                className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedCampsite.name}</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {selectedCampsite.region}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {selectedCampsite.duration}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  {selectedCampsite.pricing?.free ? (
                    <div className="text-lg font-bold text-green-600">🆓 Free</div>
                  ) : selectedCampsite.pricing?.adult ? (
                    <div>
                      <div className="text-lg font-bold text-orange-600">€{selectedCampsite.pricing.adult}/adult</div>
                      {selectedCampsite.pricing.child && (
                        <div className="text-sm text-gray-600">€{selectedCampsite.pricing.child}/child</div>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">
                {selectedCampsite.description[i18n.language as keyof typeof selectedCampsite.description] || selectedCampsite.description.en}
              </p>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Facilities</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedCampsite.facilities.map((facility, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        {getFacilityIcon(facility)}
                        <span>{facility}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Features</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCampsite.features.map((feature, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              {selectedCampsite.contact && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
                  <div className="space-y-2">
                    {selectedCampsite.contact.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span>{selectedCampsite.contact.phone}</span>
                      </div>
                    )}
                    {selectedCampsite.contact.website && (
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="h-4 w-4 text-gray-500" />
                        <a
                          href={selectedCampsite.contact.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 font-medium bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg transition-colors"
                        >
                          Visit Official Website
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Map */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Location</h4>
                <InteractiveMap
                  locations={[selectedCampsite]}
                  height="300px"
                  center={selectedCampsite.coordinates}
                  zoom={12}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a 
                  href={getDirectionsUrl(selectedCampsite.coordinates[0], selectedCampsite.coordinates[1], selectedCampsite.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors text-center font-medium"
                >
                  <MapPin className="h-5 w-5 inline mr-2" />
                  Get Directions
                </a>
                <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  <Heart className="h-5 w-5 inline mr-2" />
                  Add to Favorites
                </button>
                {selectedCampsite.contact?.phone && (
                  <a 
                    href={`tel:${selectedCampsite.contact.phone}`}
                    className="flex-1 bg-orange-600 text-white py-3 px-6 rounded-lg hover:bg-orange-700 transition-colors text-center font-medium"
                  >
                    <Phone className="h-5 w-5 inline mr-2" />
                    Call Now
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No Results */}
      {filteredCampsites.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No campsites found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search criteria</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedRegion('all');
            }}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default CampingTab;