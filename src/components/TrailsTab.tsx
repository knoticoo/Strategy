import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Map,
  List,
  Search,
  Filter,
  MapPin,
  Clock,
  TrendingUp,
  Star,
  Route,
  Camera,
  Thermometer,
  Navigation,
  Car,
  Bus,
  Zap,
  Heart,
  Share,
  Info,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';

interface Trail {
  id: string;
  name: string;
  location: string;
  coordinates: [number, number];
  difficulty: 'easy' | 'moderate' | 'hard' | 'expert';
  distance: number;
  duration: number;
  elevation: number;
  rating: number;
  reviews: number;
  type: 'hiking' | 'cycling' | 'walking' | 'running' | 'nature';
  features: string[];
  description: string;
  images: string[];
  parking: {
    available: boolean;
    spaces: number;
    price: number;
    evCharging: boolean;
  };
  publicTransport: {
    bus: string[];
    train: string[];
    distance: number;
  };
  weather: {
    condition: string;
    temperature: number;
    recommendation: string;
  };
  gear: string[];
  safety: string[];
}

const TrailsTab: React.FC = () => {
  const { t } = useTranslation();
  const [trails, setTrails] = useState<Trail[]>([]);
  const [filteredTrails, setFilteredTrails] = useState<Trail[]>([]);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedTrail, setSelectedTrail] = useState<Trail | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrails();
  }, []);

  useEffect(() => {
    filterTrails();
  }, [trails, searchQuery, selectedDifficulty, selectedType]);

  const loadTrails = async () => {
    setLoading(true);
    // Simulate API call with comprehensive trail data
    setTimeout(() => {
      const mockTrails: Trail[] = [
        {
          id: '1',
          name: 'Gauja National Park Nature Trail',
          location: 'Sigulda, Vidzeme',
          coordinates: [57.1544, 24.8518],
          difficulty: 'moderate',
          distance: 8.5,
          duration: 180,
          elevation: 150,
          rating: 4.7,
          reviews: 234,
          type: 'hiking',
          features: ['scenic', 'wildlife', 'historical', 'forest'],
          description: 'Explore the stunning landscapes of Gauja National Park with ancient castles, diverse wildlife, and breathtaking river views.',
          images: [
            'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600',
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600'
          ],
          parking: {
            available: true,
            spaces: 50,
            price: 0,
            evCharging: true
          },
          publicTransport: {
            bus: ['Bus 641 from Riga'],
            train: ['Riga-Sigulda line'],
            distance: 0.5
          },
          weather: {
            condition: 'sunny',
            temperature: 18,
            recommendation: 'perfect'
          },
          gear: ['hiking boots', 'water bottle', 'camera', 'light jacket'],
          safety: ['stay on marked trails', 'inform others of plans', 'check weather']
        },
        {
          id: '2',
          name: 'Coastal Dune Trail Jūrmala',
          location: 'Jūrmala, Gulf of Riga',
          coordinates: [56.9696, 23.7796],
          difficulty: 'easy',
          distance: 5.2,
          duration: 90,
          elevation: 25,
          rating: 4.4,
          reviews: 156,
          type: 'walking',
          features: ['coastal', 'scenic', 'educational'],
          description: 'Peaceful coastal walk through protected dune landscapes with Baltic Sea views and unique flora.',
          images: [
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600',
            'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600'
          ],
          parking: {
            available: true,
            spaces: 80,
            price: 2.5,
            evCharging: false
          },
          publicTransport: {
            bus: ['Bus 14, 15 from Riga'],
            train: ['Riga-Jūrmala line'],
            distance: 0.3
          },
          weather: {
            condition: 'cloudy',
            temperature: 15,
            recommendation: 'good'
          },
          gear: ['comfortable shoes', 'windbreaker', 'sunglasses'],
          safety: ['sun protection', 'mind the tides', 'stay on paths']
        },
        {
          id: '3',
          name: 'Kemeri Bog Boardwalk',
          location: 'Kemeri National Park',
          coordinates: [56.9167, 23.4167],
          difficulty: 'easy',
          distance: 3.4,
          duration: 75,
          elevation: 5,
          rating: 4.8,
          reviews: 312,
          type: 'nature',
          features: ['educational', 'wildlife', 'unique ecosystem'],
          description: 'Fascinating bog ecosystem walk on elevated boardwalks with observation towers and diverse plant life.',
          images: [
            'https://images.unsplash.com/photo-1574263867128-97b9d4b09c0b?w=800&h=600',
            'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&h=600'
          ],
          parking: {
            available: true,
            spaces: 40,
            price: 0,
            evCharging: false
          },
          publicTransport: {
            bus: ['Bus 245 from Riga'],
            train: [],
            distance: 2.1
          },
          weather: {
            condition: 'rainy',
            temperature: 12,
            recommendation: 'fair'
          },
          gear: ['rain gear', 'warm clothes', 'binoculars', 'camera'],
          safety: ['stay on boardwalk', 'weather awareness', 'no picking plants']
        },
        {
          id: '4',
          name: 'Rāzna Lake Circuit',
          location: 'Rāzna National Park, Latgale',
          coordinates: [56.1833, 27.4167],
          difficulty: 'hard',
          distance: 15.3,
          duration: 300,
          elevation: 200,
          rating: 4.6,
          reviews: 89,
          type: 'hiking',
          features: ['lake', 'forest', 'wildlife', 'camping'],
          description: 'Challenging full-day hike around Latvia\'s second-largest lake with pristine nature and wildlife viewing.',
          images: [
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600',
            'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=800&h=600'
          ],
          parking: {
            available: true,
            spaces: 25,
            price: 0,
            evCharging: false
          },
          publicTransport: {
            bus: ['Bus from Rēzekne'],
            train: [],
            distance: 5.0
          },
          weather: {
            condition: 'sunny',
            temperature: 20,
            recommendation: 'perfect'
          },
          gear: ['hiking boots', 'backpack', 'food', 'first aid', 'map'],
          safety: ['inform park rangers', 'bring emergency supplies', 'GPS device']
        },
        {
          id: '5',
          name: 'Venta Rapid Cycling Path',
          location: 'Kuldīga, Kurzeme',
          coordinates: [56.9667, 21.9667],
          difficulty: 'moderate',
          distance: 12.8,
          duration: 120,
          elevation: 80,
          rating: 4.5,
          reviews: 145,
          type: 'cycling',
          features: ['waterfall', 'historical', 'scenic'],
          description: 'Scenic cycling route along the Venta River featuring Europe\'s widest waterfall and historic Kuldīga.',
          images: [
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600',
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600'
          ],
          parking: {
            available: true,
            spaces: 60,
            price: 1.0,
            evCharging: true
          },
          publicTransport: {
            bus: ['Bus from Riga', 'Local buses'],
            train: [],
            distance: 0.8
          },
          weather: {
            condition: 'cloudy',
            temperature: 16,
            recommendation: 'good'
          },
          gear: ['bicycle', 'helmet', 'repair kit', 'water'],
          safety: ['wear helmet', 'bike maintenance', 'traffic awareness']
        }
      ];

      setTrails(mockTrails);
      setLoading(false);
    }, 1000);
  };

  const filterTrails = () => {
    let filtered = trails.filter(trail => {
      const matchesSearch = trail.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           trail.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDifficulty = selectedDifficulty === 'all' || trail.difficulty === selectedDifficulty;
      const matchesType = selectedType === 'all' || trail.type === selectedType;
      
      return matchesSearch && matchesDifficulty && matchesType;
    });

    setFilteredTrails(filtered);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'moderate': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      case 'hard': return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20';
      case 'expert': return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return '☀️';
      case 'cloudy': return '☁️';
      case 'rainy': return '🌧️';
      case 'snowy': return '❄️';
      default: return '🌤️';
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nature-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('trails.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {t('trails.subtitle')}
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder={t('common.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-nature-500"
          />
        </div>

        {/* View Toggle */}
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center space-x-2 px-3 py-2 rounded transition-colors ${
              viewMode === 'list'
                ? 'bg-white dark:bg-gray-600 text-nature-600 shadow-sm'
                : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            <List className="h-4 w-4" />
            <span className="text-sm">{t('common.list')}</span>
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center space-x-2 px-3 py-2 rounded transition-colors ${
              viewMode === 'map'
                ? 'bg-white dark:bg-gray-600 text-nature-600 shadow-sm'
                : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            <Map className="h-4 w-4" />
            <span className="text-sm">{t('common.map')}</span>
          </button>
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <Filter className="h-4 w-4" />
          <span className="text-sm">{t('common.filter')}</span>
          {isFilterOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {/* Filters */}
      {isFilterOpen && (
        <div className="glass-morphism rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('common.difficulty')}
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-nature-500"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">{t('trails.difficulty.easy')}</option>
                <option value="moderate">{t('trails.difficulty.moderate')}</option>
                <option value="hard">{t('trails.difficulty.hard')}</option>
                <option value="expert">{t('trails.difficulty.expert')}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Trail Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-nature-500"
              >
                <option value="all">All Types</option>
                <option value="hiking">{t('trails.types.hiking')}</option>
                <option value="cycling">{t('trails.types.cycling')}</option>
                <option value="walking">{t('trails.types.walking')}</option>
                <option value="running">{t('trails.types.running')}</option>
                <option value="nature">{t('trails.types.nature')}</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600 dark:text-gray-400">
          Found {filteredTrails.length} trails
        </p>
      </div>

      {/* Trail List */}
      {viewMode === 'list' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTrails.map((trail) => (
            <div key={trail.id} className="trail-card p-6">
              {/* Trail Image */}
              <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                <img
                  src={trail.images[0]}
                  alt={trail.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(trail.difficulty)}`}>
                    {t(`trails.difficulty.${trail.difficulty}`)}
                  </span>
                </div>
                <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                  {getWeatherIcon(trail.weather.condition)} {trail.weather.temperature}°C
                </div>
              </div>

              {/* Trail Info */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {trail.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {trail.location}
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <Route className="h-4 w-4 mx-auto text-gray-500 mb-1" />
                    <span className="font-medium text-gray-900 dark:text-white">{trail.distance} km</span>
                  </div>
                  <div className="text-center">
                    <Clock className="h-4 w-4 mx-auto text-gray-500 mb-1" />
                    <span className="font-medium text-gray-900 dark:text-white">{formatDuration(trail.duration)}</span>
                  </div>
                  <div className="text-center">
                    <TrendingUp className="h-4 w-4 mx-auto text-gray-500 mb-1" />
                    <span className="font-medium text-gray-900 dark:text-white">+{trail.elevation}m</span>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="font-medium text-gray-900 dark:text-white">{trail.rating}</span>
                    <span className="text-sm text-gray-500">({trail.reviews})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-500 hover:text-red-500 transition-colors">
                      <Heart className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-blue-500 transition-colors">
                      <Share className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-1">
                  {trail.features.slice(0, 3).map((feature) => (
                    <span
                      key={feature}
                      className="px-2 py-1 bg-nature-100 dark:bg-nature-900/30 text-nature-700 dark:text-nature-300 text-xs rounded-full"
                    >
                      {t(`trails.features.${feature}`)}
                    </span>
                  ))}
                  {trail.features.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                      +{trail.features.length - 3} more
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <button
                    onClick={() => setSelectedTrail(trail)}
                    className="flex-1 bg-nature-600 text-white px-4 py-2 rounded-lg hover:bg-nature-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Info className="h-4 w-4" />
                    <span>Details</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <Navigation className="h-4 w-4" />
                    <span>{t('common.directions')}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Map View Placeholder */}
      {viewMode === 'map' && (
        <div className="glass-morphism rounded-lg p-8 text-center">
          <Map className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Interactive Map View
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Interactive Leaflet map with trail routes, parking spots, and real-time transport info will be displayed here.
          </p>
        </div>
      )}

      {/* Trail Detail Modal */}
      {selectedTrail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="glass-morphism rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {selectedTrail.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {selectedTrail.location}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedTrail(null)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Image Gallery */}
                  <div className="space-y-2">
                    <img
                      src={selectedTrail.images[0]}
                      alt={selectedTrail.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      {selectedTrail.images.slice(1).map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${selectedTrail.name} ${index + 2}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Description
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedTrail.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Features
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedTrail.features.map((feature) => (
                        <span
                          key={feature}
                          className="px-3 py-1 bg-nature-100 dark:bg-nature-900/30 text-nature-700 dark:text-nature-300 text-sm rounded-full"
                        >
                          {t(`trails.features.${feature}`)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                      <Route className="h-6 w-6 mx-auto text-gray-500 mb-2" />
                      <div className="font-semibold text-gray-900 dark:text-white">{selectedTrail.distance} km</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{t('common.distance')}</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                      <Clock className="h-6 w-6 mx-auto text-gray-500 mb-2" />
                      <div className="font-semibold text-gray-900 dark:text-white">{formatDuration(selectedTrail.duration)}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{t('common.duration')}</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                      <TrendingUp className="h-6 w-6 mx-auto text-gray-500 mb-2" />
                      <div className="font-semibold text-gray-900 dark:text-white">+{selectedTrail.elevation}m</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Elevation</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                      <Star className="h-6 w-6 mx-auto text-gray-500 mb-2" />
                      <div className="font-semibold text-gray-900 dark:text-white">{selectedTrail.rating}/5</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">({selectedTrail.reviews} reviews)</div>
                    </div>
                  </div>

                  {/* Weather */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                      <Thermometer className="h-4 w-4 mr-2" />
                      {t('weather.current')}
                    </h4>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{getWeatherIcon(selectedTrail.weather.condition)}</span>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900 dark:text-white">{selectedTrail.weather.temperature}°C</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{t(`weather.conditions.${selectedTrail.weather.condition}`)}</div>
                      </div>
                    </div>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
                      {t(`weather.recommendations.${selectedTrail.weather.recommendation}`)}
                    </p>
                  </div>

                  {/* Parking & Transport */}
                  <div className="space-y-4">
                    {/* Parking */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                        <Car className="h-4 w-4 mr-2" />
                        {t('transport.parking.title')}
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Available:</span>
                          <span className="text-gray-900 dark:text-white">{selectedTrail.parking.spaces} spots</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Price:</span>
                          <span className="text-gray-900 dark:text-white">
                            {selectedTrail.parking.price > 0 ? `€${selectedTrail.parking.price}/h` : 'Free'}
                          </span>
                        </div>
                        {selectedTrail.parking.evCharging && (
                          <div className="flex items-center text-green-600 dark:text-green-400">
                            <Zap className="h-3 w-3 mr-1" />
                            <span>EV Charging Available</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Public Transport */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                        <Bus className="h-4 w-4 mr-2" />
                        {t('transport.publicTransport.title')}
                      </h4>
                      <div className="space-y-2 text-sm">
                        {selectedTrail.publicTransport.bus.length > 0 && (
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Bus: </span>
                            <span className="text-gray-900 dark:text-white">{selectedTrail.publicTransport.bus.join(', ')}</span>
                          </div>
                        )}
                        {selectedTrail.publicTransport.train.length > 0 && (
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Train: </span>
                            <span className="text-gray-900 dark:text-white">{selectedTrail.publicTransport.train.join(', ')}</span>
                          </div>
                        )}
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Walk from stop: </span>
                          <span className="text-gray-900 dark:text-white">{selectedTrail.publicTransport.distance} km</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Gear */}
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {t('gear.title')}
                    </h4>
                    <div className="space-y-1">
                      {selectedTrail.gear.map((item, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <span className="w-2 h-2 bg-nature-400 rounded-full mr-2"></span>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Safety */}
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {t('common.safety')}
                    </h4>
                    <div className="space-y-1">
                      {selectedTrail.safety.map((tip, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                          {tip}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button className="flex-1 adventure-gradient text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2">
                  <Navigation className="h-4 w-4" />
                  <span>Get Directions</span>
                </button>
                <button className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2">
                  <Heart className="h-4 w-4" />
                  <span>Save Trail</span>
                </button>
                <button className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2">
                  <Share className="h-4 w-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No Results */}
      {filteredTrails.length === 0 && !loading && (
        <div className="text-center py-12">
          <Map className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {t('common.noResults')}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default TrailsTab;