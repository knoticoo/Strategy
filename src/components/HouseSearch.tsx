// Enhanced House Search Component for Latvian Market - Modern Design
import React, { useState, useEffect, useCallback } from 'react';
import { Search, MapPin, Home, Square, Filter, Bell, Star, Eye, Heart, Calendar, ArrowRight, BarChart3, X, Bed, Bath } from 'lucide-react';
import PropertyMap from './PropertyMap';
import MortgageCalculator from './MortgageCalculator';
import ssLvService, { SSProperty, SearchFilters, MarketAnalytics } from '../services/ssLvScrapingService';
import latvianBankService, { LatvianRegion } from '../services/latvianBankService';
import smartInsightsService, { PropertyRecommendation } from '../services/smartInsightsService';

const HouseSearch: React.FC = () => {
  const [properties, setProperties] = useState<SSProperty[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<SSProperty[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<SSProperty | null>(null);
  const [view, setView] = useState<'list' | 'map' | 'mortgage'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    maxPrice: 150000,
    location: 'Rīga',
    sortBy: 'price_asc',
    page: 1
  });

  const [marketAnalytics, setMarketAnalytics] = useState<MarketAnalytics | null>(null);
  const [recommendations, setRecommendations] = useState<PropertyRecommendation[]>([]);
  const [regions] = useState<LatvianRegion[]>(latvianBankService.getRegions());
  
  // User preferences for smart recommendations
  const [userPreferences] = useState({
    monthlyIncome: 2500,
    budget: 150000,
    preferredLocation: 'Rīga',
    rooms: 2,
    type: 'apartment' as 'apartment' | 'house'
  });

  const searchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const results = await ssLvService.searchProperties(filters);
      setProperties(results);
      setFilteredProperties(results);
      
      if (filters.location) {
        const analytics = await ssLvService.getMarketAnalytics(filters.location);
        setMarketAnalytics(analytics);
      }
    } catch (error) {
      console.error('Error searching properties:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const loadMarketData = useCallback(async () => {
    try {
      const analytics = await ssLvService.getMarketAnalytics('Rīga');
      setMarketAnalytics(analytics);
    } catch (error) {
      console.error('Error loading market data:', error);
    }
  }, []);



  const generateRecommendations = useCallback(async () => {
    if (properties.length === 0) return;
    
    try {
      const recs = await smartInsightsService.generatePropertyRecommendations(
        userPreferences.budget,
        userPreferences.monthlyIncome,
        {
          location: userPreferences.preferredLocation,
          rooms: userPreferences.rooms,
          type: userPreferences.type
        }
      );
      setRecommendations(recs);
    } catch (error) {
      console.error('Error generating recommendations:', error);
    }
  }, [properties, userPreferences]);

  // Load data on component mount
  useEffect(() => {
    searchProperties();
    loadMarketData();
  }, [searchProperties, loadMarketData]);

  // Search properties when filters change (debounced)
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      searchProperties();
    }, 500);
    return () => clearTimeout(delayedSearch);
  }, [searchProperties]);

  // Generate smart recommendations when user preferences or properties change
  useEffect(() => {
    generateRecommendations();
  }, [generateRecommendations]);



  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('lv-LV', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Modern Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Home className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                      Latvijas Īpašumi
                    </h1>
                    <p className="text-sm text-gray-500">Atrodiet savu sapņu māju</p>
                  </div>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="hidden lg:flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{properties.length}</div>
                  <div className="text-xs text-gray-500">Īpašumi</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {marketAnalytics ? formatPrice(marketAnalytics.averagePrice) : '-'}
                  </div>
                  <div className="text-xs text-gray-500">Vidējā cena</div>
                </div>
                                 <div className="text-center">
                   <div className="text-2xl font-bold text-purple-600">
                     {marketAnalytics ? `+${marketAnalytics.priceChange.toFixed(1)}%` : '-'}
                   </div>
                   <div className="text-xs text-gray-500">Pieaugums</div>
                 </div>
              </div>
            </div>

            {/* Modern Search Bar */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Meklēt pēc atrašanās vietas, cenas vai tipa..."
                  className="w-full pl-12 pr-4 py-4 bg-white/70 backdrop-blur border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg"
                  value={filters.location || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center space-x-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
                  >
                    <Filter className="h-4 w-4" />
                    <span className="text-sm font-medium">Filtri</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-4 p-6 bg-white/70 backdrop-blur rounded-2xl border border-gray-200/50 shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Maksimālā cena</label>
                    <select
                      value={filters.maxPrice}
                      onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={50000}>€50,000</option>
                      <option value={100000}>€100,000</option>
                      <option value={150000}>€150,000</option>
                      <option value={200000}>€200,000</option>
                      <option value={300000}>€300,000</option>
                      <option value={500000}>€500,000</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rajons</label>
                    <select
                      value={filters.location}
                      onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Rīga">Rīga</option>
                      <option value="Jūrmala">Jūrmala</option>
                      <option value="Liepāja">Liepāja</option>
                      <option value="Daugavpils">Daugavpils</option>
                      <option value="Jelgava">Jelgava</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kārtošana</label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="price_asc">Cena: No zemākās</option>
                      <option value="price_desc">Cena: No augstākās</option>
                      <option value="area_desc">Platība: No lielākās</option>
                      <option value="newest">Jaunākie</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={() => setShowFilters(false)}
                      className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                    >
                      Paslēpt filtrus
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-center space-x-1 bg-white/70 backdrop-blur p-1 rounded-2xl border border-gray-200/50 shadow-lg w-fit mx-auto">
          <button
            onClick={() => setView('list')}
            className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              view === 'list'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Home className="h-4 w-4" />
              <span>Saraksts</span>
            </div>
          </button>
          <button
            onClick={() => setView('map')}
            className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              view === 'map'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>Karte</span>
            </div>
          </button>
          <button
            onClick={() => setView('mortgage')}
            className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              view === 'mortgage'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Hipotēka</span>
            </div>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {view === 'list' && (
          <div className="space-y-8">
            {/* Smart Recommendations */}
            {recommendations.length > 0 && (
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-3xl p-8 border border-purple-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Star className="h-6 w-6 mr-3 text-yellow-500" />
                  AI ieteikumi jums
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.slice(0, 3).map((rec, index) => (
                    <div key={index} className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-lg border border-white/50">
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                          {rec.score}% atbilstība
                        </span>
                        <Heart className="h-5 w-5 text-gray-400 hover:text-red-500 cursor-pointer transition-colors" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">{rec.property.title}</h4>
                      <p className="text-gray-600 text-sm mb-4">{rec.property.location}</p>
                      <div className="space-y-2">
                        {rec.reasons.slice(0, 2).map((reason, idx) => (
                          <div key={idx} className="flex items-center text-sm text-gray-600">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            {reason}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Properties Grid */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {loading ? 'Meklē īpašumus...' : `${filteredProperties.length} īpašumi atrasti`}
                </h2>
                                 <div className="flex items-center space-x-4">
                   <button className="flex items-center space-x-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-xl hover:bg-orange-200 transition-colors">
                     <Bell className="h-4 w-4" />
                     <span className="text-sm font-medium">Cenas brīdinājums</span>
                   </button>
                 </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white/70 backdrop-blur rounded-2xl p-6 shadow-lg border border-gray-200/50 animate-pulse">
                      <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-4 w-2/3"></div>
                      <div className="flex justify-between">
                        <div className="h-6 bg-gray-200 rounded w-20"></div>
                        <div className="h-6 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProperties.map((property) => (
                    <div
                      key={property.id}
                      className="group bg-white/70 backdrop-blur rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden"
                      onClick={() => setSelectedProperty(property)}
                    >
                      {/* Property Image */}
                                             <div className="relative h-48 overflow-hidden">
                         <img
                           src={property.imageUrls?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop'}
                           alt={property.title}
                           className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                         />
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium">
                            {property.type === 'apartment' ? 'Dzīvoklis' : 'Māja'}
                          </span>
                        </div>
                        <div className="absolute top-4 right-4">
                          <Heart className="h-6 w-6 text-white drop-shadow-lg hover:text-red-500 transition-colors" />
                        </div>
                        <div className="absolute bottom-4 right-4 flex items-center bg-black/50 backdrop-blur text-white px-2 py-1 rounded-lg text-sm">
                          <Eye className="h-4 w-4 mr-1" />
                          {property.views || Math.floor(Math.random() * 500) + 50}
                        </div>
                      </div>

                      {/* Property Details */}
                      <div className="p-6">
                        <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-blue-600 transition-colors">
                          {property.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {property.location}
                        </p>

                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="text-center">
                            <div className="text-sm text-gray-500">Platība</div>
                            <div className="font-semibold text-gray-900">
                              {property.area}m²
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-gray-500">Istabas</div>
                            <div className="font-semibold text-gray-900 flex items-center justify-center">
                              <Bed className="h-4 w-4 mr-1" />
                              {property.rooms}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-gray-500">€/m²</div>
                            <div className="font-semibold text-gray-900">
                              {Math.round(property.price / property.area)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-2xl font-bold text-blue-600">
                            {formatPrice(property.price)}
                          </div>
                          <button className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                            <span className="text-sm font-medium">Skatīt</span>
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {view === 'map' && (
          <div className="bg-white/70 backdrop-blur rounded-3xl shadow-2xl border border-gray-200/50 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <MapPin className="h-6 w-6 mr-3 text-blue-600" />
              Īpašumi kartē
            </h3>
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <PropertyMap
                properties={filteredProperties}
                selectedProperty={selectedProperty}
                onPropertySelect={setSelectedProperty}
                height="600px"
                showRegions={true}
                maxPrice={filters.maxPrice}
                regions={regions}
              />
            </div>
          </div>
        )}

        {view === 'mortgage' && (
          <div className="bg-white/70 backdrop-blur rounded-3xl shadow-2xl border border-gray-200/50 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <BarChart3 className="h-6 w-6 mr-3 text-green-600" />
              Hipotēkas kalkulators
            </h3>
            <MortgageCalculator
              propertyPrice={selectedProperty?.price || filters.maxPrice || 150000}
            />
          </div>
        )}
      </div>

      {/* Property Detail Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                         <div className="relative">
               <img
                 src={selectedProperty.imageUrls?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=400&fit=crop'}
                 alt={selectedProperty.title}
                 className="w-full h-64 object-cover"
               />
              <button
                onClick={() => setSelectedProperty(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition-colors"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedProperty.title}</h2>
                  <p className="text-gray-600 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {selectedProperty.location}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">
                    {formatPrice(selectedProperty.price)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {Math.round(selectedProperty.price / selectedProperty.area)} €/m²
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <Square className="h-6 w-6 mx-auto text-blue-600 mb-2" />
                  <div className="text-sm text-gray-500">Platība</div>
                  <div className="font-bold text-gray-900">{selectedProperty.area}m²</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <Bed className="h-6 w-6 mx-auto text-green-600 mb-2" />
                  <div className="text-sm text-gray-500">Istabas</div>
                  <div className="font-bold text-gray-900">{selectedProperty.rooms}</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <Bath className="h-6 w-6 mx-auto text-purple-600 mb-2" />
                  <div className="text-sm text-gray-500">Vannasistabas</div>
                  <div className="font-bold text-gray-900">{Math.ceil(selectedProperty.rooms / 2)}</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <Calendar className="h-6 w-6 mx-auto text-orange-600 mb-2" />
                  <div className="text-sm text-gray-500">Stāvs</div>
                  <div className="font-bold text-gray-900">{Math.floor(Math.random() * 10) + 1}</div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Apraksts</h3>
                <p className="text-gray-600 leading-relaxed">
                  {selectedProperty.description || 'Mūsdienīgs īpašums ar labu ģeogrāfisko novietojumu. Pieejamas visas nepieciešamās komunikācijas. Lieliska izvēle ģimenei vai investīcijām.'}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors font-medium">
                  Sazināties ar pārdevēju
                </button>
                <button className="flex-1 bg-green-600 text-white py-3 px-6 rounded-xl hover:bg-green-700 transition-colors font-medium">
                  Aprēķināt hipotēku
                </button>
                <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium">
                  <Heart className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HouseSearch;