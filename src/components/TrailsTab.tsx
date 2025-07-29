import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import InteractiveMap from './InteractiveMap';
import ImageWithFallback from './ImageWithFallback';
import { RealLocation, calculateDistance, getDirectionsUrl } from '../data/realLatvianData';
import * as api from '../services/api';
import {
  Map,
  List,
  Search,
  MapPin,
  Clock,
  TrendingUp,
  Star,
  Route,
  Navigation,
  Heart,
  Share,
  Info,
  X
} from 'lucide-react';

const TrailsTab: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [trails, setTrails] = useState<RealLocation[]>([]);
  const [filteredTrails, setFilteredTrails] = useState<RealLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedSeason, setSelectedSeason] = useState<string>('all');
  const [showMap, setShowMap] = useState(false);
  const [selectedTrail, setSelectedTrail] = useState<RealLocation | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [likedTrails, setLikedTrails] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadTrails();
    getUserLocation();
    // Load liked trails from localStorage
    const savedLikes = localStorage.getItem('likedTrails');
    if (savedLikes) {
      setLikedTrails(new Set(JSON.parse(savedLikes)));
    }
  }, []);

  const handleLikeTrail = (trailId: string) => {
    setLikedTrails(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(trailId)) {
        newLiked.delete(trailId);
      } else {
        newLiked.add(trailId);
      }
      // Save to localStorage
      localStorage.setItem('likedTrails', JSON.stringify(Array.from(newLiked)));
      return newLiked;
    });
  };

  useEffect(() => {
    const filterData = () => {
      let filtered = [...trails];

      // Search filter
      if (searchTerm) {
        filtered = filtered.filter(trail =>
          trail.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          trail.description[i18n.language as keyof typeof trail.description]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          trail.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
          trail.features.some(feature => feature.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }

      // Difficulty filter
      if (selectedDifficulty !== 'all') {
        filtered = filtered.filter(trail => trail.difficulty === selectedDifficulty);
      }

      // Region filter
      if (selectedRegion !== 'all') {
        filtered = filtered.filter(trail => trail.region === selectedRegion);
      }

      // Season filter
      if (selectedSeason !== 'all') {
        filtered = filtered.filter(trail => trail.season.includes(selectedSeason));
      }

      setFilteredTrails(filtered);
    };

    filterData();
  }, [trails, searchTerm, selectedDifficulty, selectedRegion, selectedSeason, i18n.language]);

  const loadTrails = async () => {
    setLoading(true);
    try {
      const apiTrails = await api.getTrails();
      // Convert API trails to RealLocation format
      const convertedTrails: RealLocation[] = apiTrails.map(trail => ({
        id: trail.id,
        name: trail.name_en,
        nameEn: trail.name_en,
        nameLv: trail.name_lv || trail.name_en,
        nameRu: trail.name_ru || trail.name_en,
        description: {
          en: trail.description_en || '',
          lv: trail.description_lv || '',
          ru: trail.description_ru || ''
        },
        coordinates: [trail.latitude, trail.longitude],
        region: trail.region,
        difficulty: trail.difficulty as 'easy' | 'moderate' | 'hard',
        distance: trail.distance,
        duration: trail.duration,
        elevation: trail.elevation_gain,
        season: trail.best_season?.split(',') || ['all'],
        features: (() => {
          try {
            return trail.features ? JSON.parse(trail.features) : [];
          } catch (error) {
            console.error('Error parsing trail features:', error, trail.features);
            return [];
          }
        })(),
        images: [trail.image_url || '/images/default-trail.jpg'],
        facilities: [],
        rating: 4.5, // Default rating
        reviews: 0 // Default reviews
      }));
      setTrails(convertedTrails);
    } catch (error) {
      console.error('Error loading trails:', error);
      // Fallback to empty array if API fails
      setTrails([]);
    }
    setLoading(false);
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        () => {
          // Default to Riga if geolocation fails
          setUserLocation([56.9496, 24.1052]);
        }
      );
    } else {
      setUserLocation([56.9496, 24.1052]);
    }
  };



  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '🥾';
      case 'moderate': return '⛰️';
      case 'hard': return '🏔️';
      default: return '🚶';
    }
  };

  const getDistanceFromUser = (trail: RealLocation): string => {
    if (!userLocation) return '';
    const distance = calculateDistance(
      userLocation[0], userLocation[1],
      trail.coordinates[0], trail.coordinates[1]
    );
    return `${distance.toFixed(1)} km away`;
  };

  const handleTrailClick = (trail: RealLocation) => {
    setSelectedTrail(trail);
  };

  const regions = ['all', 'Vidzeme', 'Kurzeme', 'Zemgale', 'Latgale', 'Pierīga'];
  const seasons = ['all', 'spring', 'summer', 'autumn', 'winter'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading real Latvian trails...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">🏔️ {t('trails.title')}</h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {t('trails.subtitle')}
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          {/* Enhanced Search */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder={t('trails.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">{t('trails.filters.allDifficulties')}</option>
            <option value="easy">{t('trails.filters.easy')}</option>
            <option value="moderate">{t('trails.filters.moderate')}</option>
            <option value="hard">{t('trails.filters.hard')}</option>
          </select>

          {/* Region Filter */}
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {regions.map(region => (
              <option key={region} value={region}>
                {region === 'all' ? t('trails.filters.allRegions') : region}
              </option>
            ))}
          </select>

          {/* Season Filter */}
          <select
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {seasons.map(season => (
              <option key={season} value={season}>
                {season === 'all' ? t('trails.filters.allSeasons') : season.charAt(0).toUpperCase() + season.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* View Toggle */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            {t('trails.found', { count: filteredTrails.length })}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setShowMap(false)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                !showMap ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <List className="h-4 w-4" />
              {t('trails.viewModes.list')}
            </button>
            <button
              onClick={() => setShowMap(true)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                showMap ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <Map className="h-4 w-4" />
              {t('trails.viewModes.map')}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {showMap ? (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Interactive Trail Map</h3>
          <InteractiveMap
            locations={filteredTrails}
            height="500px"
            onLocationClick={handleTrailClick}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTrails.map((trail) => (
            <div
              key={trail.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => handleTrailClick(trail)}
            >
              {/* Trail Image */}
              <div className="relative h-48 overflow-hidden">
                <ImageWithFallback
                  src={trail.images[0]}
                  alt={trail.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(trail.difficulty)}`}>
                    {getDifficultyIcon(trail.difficulty)} {trail.difficulty}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <button className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                    <Heart className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Trail Info */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                    {trail.name}
                  </h3>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm text-gray-600">4.8</span>
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-700 dark:text-gray-300 mb-3 bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
                  <MapPin className="h-4 w-4 mr-2 text-green-600" />
                  <span className="font-medium">{trail.region}</span>
                  {userLocation && (
                    <>
                      <span className="mx-2 text-gray-400">•</span>
                      <span className="text-blue-600 font-medium">{getDistanceFromUser(trail)}</span>
                    </>
                  )}
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {trail.description[i18n.language as keyof typeof trail.description] || trail.description.en}
                </p>

                {/* Trail Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                    <Route className="h-5 w-5 text-green-600 mx-auto mb-1" />
                    <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Distance</div>
                    <div className="text-sm font-bold text-gray-900 dark:text-white">{trail.distance || 'N/A'}</div>
                  </div>
                  <div className="text-center bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                    <Clock className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                    <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Duration</div>
                    <div className="text-sm font-bold text-gray-900 dark:text-white">{trail.duration}</div>
                  </div>
                  <div className="text-center bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
                    <TrendingUp className="h-5 w-5 text-orange-600 mx-auto mb-1" />
                    <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Elevation</div>
                    <div className="text-sm font-bold text-gray-900 dark:text-white">{trail.elevation || 'N/A'}</div>
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {trail.features.slice(0, 3).map((feature, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-xs rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                  {trail.features.length > 3 && (
                    <span className="px-2 py-1 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                      +{trail.features.length - 3} more
                    </span>
                  )}
                </div>

                {/* Pricing & Actions */}
                <div className="flex justify-between items-center bg-gray-50 rounded-lg p-3">
                  <div className="text-sm">
                    {trail.pricing?.free ? (
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🆓</span>
                        <div>
                          <div className="text-green-700 font-bold">Free Entry</div>
                          <div className="text-xs text-gray-600">No cost required</div>
                        </div>
                      </div>
                    ) : trail.pricing?.adult ? (
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">💰</span>
                        <div>
                          <div className="text-orange-700 font-bold">€{trail.pricing.adult}/adult</div>
                          {trail.pricing.child && (
                            <div className="text-xs text-gray-600">€{trail.pricing.child}/child</div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-500">Price varies</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleLikeTrail(trail.id)}
                      className={`p-2 transition-colors rounded-full ${
                        likedTrails.has(trail.id) 
                          ? 'text-red-500 hover:text-red-600 bg-red-50' 
                          : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                      }`}
                      title={likedTrails.has(trail.id) ? "Unlike trail" : "Like trail"}
                    >
                      <Heart className={`h-4 w-4 ${likedTrails.has(trail.id) ? 'fill-current' : ''}`} />
                    </button>
                    <button 
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50"
                      title="Share location"
                    >
                      <Share className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => setSelectedTrail(trail)}
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

      {/* Trail Detail Modal */}
      {selectedTrail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <ImageWithFallback
                src={selectedTrail.images[0]}
                alt={selectedTrail.name}
                className="w-full h-64 object-cover"
              />
              <button
                onClick={() => setSelectedTrail(null)}
                className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedTrail.name}</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {selectedTrail.region}
                    </span>
                    <span className={`px-3 py-1 rounded-full ${getDifficultyColor(selectedTrail.difficulty)}`}>
                      {getDifficultyIcon(selectedTrail.difficulty)} {selectedTrail.difficulty}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  {selectedTrail.pricing?.free ? (
                    <div className="text-lg font-bold text-green-600">🆓 Free Entry</div>
                  ) : selectedTrail.pricing?.adult ? (
                    <div className="text-lg font-bold text-orange-600">€{selectedTrail.pricing.adult}/adult</div>
                  ) : null}
                </div>
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">
                {selectedTrail.description[i18n.language as keyof typeof selectedTrail.description] || selectedTrail.description.en}
              </p>

              {/* Trail Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">{t('trails.info.trailInfo')}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>{t('trails.info.distance')}:</span>
                      <span className="font-medium">{selectedTrail.distance || t('trails.info.notAvailable')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('trails.info.duration')}:</span>
                      <span className="font-medium">{selectedTrail.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('trails.info.elevation')}:</span>
                      <span className="font-medium">{selectedTrail.elevation || t('trails.info.notAvailable')}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">{t('trails.info.features')}</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTrail.features.map((feature, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">{t('trails.info.contact')}</h4>
                  <div className="space-y-2 text-sm">
                    {selectedTrail.contact?.phone && (
                      <div>
                        <span className="text-gray-600">Phone:</span>
                        <div className="font-medium">{selectedTrail.contact.phone}</div>
                      </div>
                    )}
                    {selectedTrail.contact?.website && (
                      <div>
                        <a
                          href={selectedTrail.contact.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors"
                        >
                          🌐 Visit Official Website
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">{t('trails.info.location')}</h4>
                <InteractiveMap
                  locations={[selectedTrail]}
                  height="300px"
                  center={selectedTrail.coordinates}
                  zoom={12}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a 
                  href={getDirectionsUrl(selectedTrail.coordinates[0], selectedTrail.coordinates[1], selectedTrail.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors text-center font-medium"
                >
                  <Navigation className="h-5 w-5 inline mr-2" />
                  {t('trails.info.getDirections')}
                </a>
                <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  <Heart className="h-5 w-5 inline mr-2" />
                  {t('trails.info.addToFavorites')}
                </button>
                <button 
                  onClick={() => {
                    const url = window.location.href;
                    navigator.clipboard.writeText(url);
                    alert('Location link copied to clipboard!');
                  }}
                  className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  title="Share location"
                >
                  <Share className="h-5 w-5 inline mr-2" />
                  {t('common.share')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No Results */}
      {filteredTrails.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('trails.noResults.title')}</h3>
          <p className="text-gray-600 mb-4">{t('trails.noResults.message')}</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedDifficulty('all');
              setSelectedRegion('all');
              setSelectedSeason('all');
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

export default TrailsTab;