// Enhanced House Search Component for Latvian Market
import React, { useState, useEffect, useCallback } from 'react';
import { Search, MapPin, Home, Square, ExternalLink, Filter, Bell, TrendingUp, Euro, Building } from 'lucide-react';
import PropertyMap from './PropertyMap';
import MortgageCalculator from './MortgageCalculator';
import ssLvService, { SSProperty, SearchFilters, MarketAnalytics } from '../services/ssLvScrapingService';
import latvianBankService, { LatvianRegion } from '../services/latvianBankService';
import smartInsightsService, { PropertyRecommendation, MarketForecast } from '../services/smartInsightsService';

const HouseSearch: React.FC = () => {
  // State management
  const [properties, setProperties] = useState<SSProperty[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<SSProperty[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<SSProperty | null>(null);
  const [view, setView] = useState<'list' | 'map' | 'mortgage'>('list');
  const [showFilters, setShowFilters] = useState(false);
  
  // Search filters
  const [filters, setFilters] = useState<SearchFilters>({
    maxPrice: 80000,
    location: 'Rīga',
    sortBy: 'price_asc',
    page: 1
  });

  // Advanced features state
  const [marketAnalytics, setMarketAnalytics] = useState<MarketAnalytics | null>(null);
  const [recommendations, setRecommendations] = useState<PropertyRecommendation[]>([]);
  const [forecasts, setForecast] = useState<MarketForecast[]>([]);
  const [priceAlerts, setPriceAlerts] = useState<any[]>([]);
  const [regions] = useState<LatvianRegion[]>(latvianBankService.getRegions());
  
  // User preferences for smart recommendations
  const [userPreferences] = useState({
    monthlyIncome: 2500,
    budget: 80000,
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
      
      // Get market analytics for the selected location
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

  const loadForecasts = useCallback(async () => {
    try {
      const regionNames = regions.map(r => r.name);
      const forecasts = await smartInsightsService.generateMarketForecasts(regionNames);
      setForecast(forecasts);
    } catch (error) {
      console.error('Error loading forecasts:', error);
    }
  }, [regions]);

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
    loadForecasts();
  }, [searchProperties, loadMarketData, loadForecasts]);

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

  const createPriceAlert = async (targetPrice: number) => {
    const alert = {
      id: Date.now().toString(),
      userId: 'demo-user',
      filters: { ...filters, maxPrice: targetPrice },
      targetPrice,
      email: 'user@example.com',
      isActive: true,
      lastCheck: new Date().toISOString(),
      matchedProperties: [],
      created: new Date().toISOString()
    };
    
    setPriceAlerts(prev => [...prev, alert]);
    
    // Show notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Cenu brīdinājums izveidots!', {
        body: `Jūs saņemsiet paziņojumu, ja īpašums būs pieejams zem €${targetPrice.toLocaleString()}`,
        icon: '/logo192.png'
      });
    }
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('lv-LV', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getPropertyIcon = (type: string) => {
    switch (type) {
      case 'house': return <Home className="h-4 w-4" />;
      case 'apartment': return <Building className="h-4 w-4" />;
      default: return <Square className="h-4 w-4" />;
    }
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : value // Reset page when other filters change
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header with Quick Stats */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              🏠 Nekustamā īpašuma meklēšana Latvijā
            </h1>
            <p className="text-gray-600">
              Meklējiet mājas un dzīvokļus ar hipotēkas kalkulatoru un tirgus analīzi
            </p>
          </div>
          
          {marketAnalytics && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4 lg:mt-0">
              <div className="text-center">
                <div className="text-lg font-bold text-primary-600">{formatPrice(marketAnalytics.averagePrice)}</div>
                <div className="text-sm text-gray-500">Vidējā cena</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">+{marketAnalytics.priceChange}%</div>
                <div className="text-sm text-gray-500">Cenu izmaiņas</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{marketAnalytics.totalListings}</div>
                <div className="text-sm text-gray-500">Sludinājumi</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">{marketAnalytics.newListings}</div>
                <div className="text-sm text-gray-500">Jauni šomēnes</div>
              </div>
            </div>
          )}
        </div>

        {/* Search and Filter Controls */}
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Meklēt pēc atrašanās vietas (Rīga, Jūrmala, Liepāja...)"
                className="pl-10 w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                value={filters.location || ''}
                onChange={(e) => handleFilterChange('location', e.target.value)}
              />
            </div>

            {/* Max Price */}
            <div className="lg:w-48">
              <div className="relative">
                <Euro className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  placeholder="Max cena"
                  className="pl-10 w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                  value={filters.maxPrice || ''}
                  onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value))}
                />
              </div>
            </div>

            {/* Sort */}
            <div className="lg:w-48">
              <select
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                value={filters.sortBy || 'price_asc'}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                <option value="price_asc">Cena: zema → augsta</option>
                <option value="price_desc">Cena: augsta → zema</option>
                <option value="area_desc">Platība: liela → maza</option>
                <option value="date_desc">Datums: jaunākās</option>
              </select>
            </div>
          </div>

          {/* Advanced Filters Toggle */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <Filter className="h-4 w-4 mr-2" />
              Papildu filtri
            </button>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                Atrasti: {filteredProperties.length} īpašumi
              </span>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min platība (m²)</label>
                  <input
                    type="number"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    value={filters.minArea || ''}
                    onChange={(e) => handleFilterChange('minArea', Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Istabas</label>
                  <select
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    onChange={(e) => handleFilterChange('rooms', e.target.value ? [Number(e.target.value)] : undefined)}
                  >
                    <option value="">Jebkuras</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tips</label>
                  <select
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    value={filters.type || ''}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                  >
                    <option value="">Visi</option>
                    <option value="apartment">Dzīvoklis</option>
                    <option value="house">Māja</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min gads</label>
                  <input
                    type="number"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    value={filters.minYear || ''}
                    onChange={(e) => handleFilterChange('minYear', Number(e.target.value))}
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => setFilters({ maxPrice: 80000, location: 'Rīga', sortBy: 'price_asc', page: 1 })}
                    className="w-full px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Atiestatīt
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* View Toggle */}
        <div className="flex items-center space-x-2 mt-4">
          <button
            onClick={() => setView('list')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              view === 'list' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📋 Saraksts
          </button>
          <button
            onClick={() => setView('map')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              view === 'map' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🗺️ Karte
          </button>
          <button
            onClick={() => setView('mortgage')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              view === 'mortgage' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🧮 Hipotēka
          </button>
        </div>
      </div>

      {/* Price Alerts & Market Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price Alerts */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Bell className="h-5 w-5 mr-2 text-yellow-500" />
            Cenu brīdinājumi
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="number"
                placeholder="Maksimālā cena (€)"
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const target = e.target as HTMLInputElement;
                    createPriceAlert(Number(target.value));
                    target.value = '';
                  }
                }}
              />
              <button
                onClick={(e) => {
                  const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                  createPriceAlert(Number(input.value));
                  input.value = '';
                }}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm"
              >
                Izveidot
              </button>
            </div>
            
            {priceAlerts.length > 0 && (
              <div className="space-y-2">
                {priceAlerts.slice(0, 3).map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between bg-yellow-50 rounded-lg p-3">
                    <div className="text-sm">
                      <div className="font-medium">≤ {formatPrice(alert.targetPrice)}</div>
                      <div className="text-gray-600">{alert.filters.location}</div>
                    </div>
                    <button
                      onClick={() => setPriceAlerts(prev => prev.filter(a => a.id !== alert.id))}
                      className="text-gray-400 hover:text-red-500"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Market Trends */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
            Tirgus prognozes
          </h3>
          
          <div className="space-y-3">
            {forecasts.slice(0, 3).map((forecast) => (
              <div key={forecast.region} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{forecast.region}</span>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    forecast.recommendation === 'buy_now' ? 'bg-green-100 text-green-800' :
                    forecast.recommendation === 'wait' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {forecast.recommendation === 'buy_now' ? 'Pirkt tagad' :
                     forecast.recommendation === 'wait' ? 'Gaidīt' : 'Apsvērt'}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <div>Tagad: {formatPrice(forecast.currentAvgPrice)}</div>
                  <div>1 gads: {formatPrice(forecast.predictedPriceIn1Year)} 
                    <span className="text-green-600 ml-1">
                      (+{((forecast.predictedPriceIn1Year / forecast.currentAvgPrice - 1) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Pārliecība: {forecast.confidence}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {view === 'list' && (
        <div className="space-y-6">
          {/* Smart Recommendations */}
          {recommendations.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Star className="h-5 w-5 mr-2 text-yellow-500" />
                Ieteikumi jums
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendations.slice(0, 3).map((rec) => (
                  <div key={rec.property.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{rec.property.location}</span>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        {rec.score}/100
                      </span>
                    </div>
                    <div className="text-lg font-bold text-primary-600 mb-2">
                      {formatPrice(rec.property.price)}
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      {rec.property.area}m² • {rec.property.rooms} ist.
                    </div>
                    <div className="space-y-1">
                      {rec.reasons.slice(0, 2).map((reason, idx) => (
                        <div key={idx} className="text-xs text-gray-600 flex items-center">
                          <span className="w-1 h-1 bg-green-500 rounded-full mr-2"></span>
                          {reason}
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        DTI: {rec.affordabilityRatio.toFixed(1)}%
                      </span>
                      <button
                        onClick={() => setSelectedProperty(rec.property)}
                        className="text-primary-600 text-xs hover:text-primary-700"
                      >
                        Skatīt →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Property List */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Īpašumi</h3>
              {loading && (
                <div className="flex items-center text-sm text-gray-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"></div>
                  Meklē...
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <div key={property.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Property Image */}
                  {property.imageUrls.length > 0 && (
                    <img
                      src={property.imageUrls[0]}
                      alt={property.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-bold text-primary-600">
                        {formatPrice(property.price)}
                      </span>
                      <div className="flex items-center text-gray-500 text-sm">
                        {getPropertyIcon(property.type)}
                        <span className="ml-1">{property.type}</span>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {property.title}
                    </h4>
                    
                    <div className="flex items-center text-gray-600 text-sm mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      {property.location}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <Square className="h-4 w-4 mr-1" />
                        {property.area}m²
                      </div>
                      <div className="flex items-center">
                        <Home className="h-4 w-4 mr-1" />
                        {property.rooms} ist.
                      </div>
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {property.views}
                      </div>
                    </div>

                    {property.pricePerSqm && (
                      <div className="text-sm text-gray-600 mb-3">
                        €{property.pricePerSqm}/m²
                      </div>
                    )}
                    
                    {/* Features */}
                    {property.features.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {property.features.slice(0, 3).map((feature, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedProperty(property)}
                        className="flex-1 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                      >
                        Skatīt detaļas
                      </button>
                      <button
                        onClick={() => window.open(property.url, '_blank')}
                        className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProperties.length === 0 && !loading && (
              <div className="text-center py-12">
                <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nav atrasti īpašumi</h3>
                <p className="text-gray-600 mb-4">Izmēģiniet dažādus filtrus vai paplašiniet meklēšanas kritērijus.</p>
                <button
                  onClick={() => setFilters({ maxPrice: 120000, location: '', sortBy: 'price_asc', page: 1 })}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Paplašināt meklēšanu
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {view === 'map' && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Īpašumi kartē</h3>
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
      )}

      {view === 'mortgage' && (
        <MortgageCalculator
          propertyPrice={selectedProperty?.price || filters.maxPrice || 80000}
        />
      )}

      {/* Property Detail Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">{selectedProperty.title}</h2>
                <button
                  onClick={() => setSelectedProperty(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Property Images */}
              {selectedProperty.imageUrls.length > 0 && (
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {selectedProperty.imageUrls.slice(0, 4).map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`${selectedProperty.title} ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Property Info */}
                <div>
                  <div className="text-2xl font-bold text-primary-600 mb-2">
                    {formatPrice(selectedProperty.price)}
                  </div>
                  
                  {selectedProperty.pricePerSqm && (
                    <div className="text-gray-600 mb-4">
                      €{selectedProperty.pricePerSqm}/m²
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-600">Platība</div>
                      <div className="font-medium">{selectedProperty.area}m²</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Istabas</div>
                      <div className="font-medium">{selectedProperty.rooms}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Stāvs</div>
                      <div className="font-medium">
                        {selectedProperty.floor ? `${selectedProperty.floor}/${selectedProperty.totalFloors}` : 'Nav norādīts'}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Būvēts</div>
                      <div className="font-medium">{selectedProperty.yearBuilt || 'Nav norādīts'}</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-2">Atrašanās vieta</div>
                    <div className="font-medium">{selectedProperty.location}</div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-2">Apraksts</div>
                    <p className="text-gray-800">{selectedProperty.description}</p>
                  </div>

                  {/* Features */}
                  {selectedProperty.features.length > 0 && (
                    <div className="mb-4">
                      <div className="text-sm text-gray-600 mb-2">Ērtības</div>
                      <div className="flex flex-wrap gap-2">
                        {selectedProperty.features.map((feature, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Mortgage Calculator Preview */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Hipotēkas kalkulators</h3>
                  <MortgageCalculator propertyPrice={selectedProperty.price} />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => window.open(selectedProperty.url, '_blank')}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Skatīt ss.lv
                </button>
                <button
                  onClick={() => createPriceAlert(selectedProperty.price * 0.95)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  Cenu brīdinājums
                </button>
                {selectedProperty.phone && (
                  <button
                    onClick={() => window.open(`tel:${selectedProperty.phone}`, '_self')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Zvanīt
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HouseSearch;