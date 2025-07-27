// Enhanced House Search Component - Ultra Modern Design with Animations & Modals
import React, { useState, useEffect, useCallback } from 'react';
import './HouseSearch.css';
import { 
  Search, MapPin, Home, Square, Filter, Bell, Star, Eye, Heart, Calendar, 
  ArrowRight, BarChart3, X, Bed, Bath, Wifi, Car, TreePine, Shield,
  PlayCircle, Maximize2, ChevronLeft, ChevronRight, Share2, Bookmark,
  Phone, MessageCircle, Camera, ArrowUpRight, Zap
} from 'lucide-react';
import PropertyMap from './PropertyMap';
import MortgageCalculator from './MortgageCalculator';
import ssLvService, { SSProperty, SearchFilters, MarketAnalytics } from '../services/ssLvScrapingService';
import latvianBankService, { LatvianRegion } from '../services/latvianBankService';
import smartInsightsService, { PropertyRecommendation } from '../services/smartInsightsService';

// Advanced Modal Component
const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}> = ({ isOpen, onClose, children, className = "" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className={`relative transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all duration-300 ${className}`}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

// Property Card Component
const PropertyCard: React.FC<{
  property: SSProperty;
  onSelect: (property: SSProperty) => void;
  className?: string;
  style?: React.CSSProperties;
}> = ({ property, onSelect, className = "", style }) => {
  const [imageIndex, setImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('lv-LV', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const images = property.imageUrls || ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop'];

  return (
    <div 
      className={`group relative bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] cursor-pointer ${className}`}
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(property)}
    >
      {/* Image Carousel */}
      <div className="relative h-64 overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${imageIndex * 100}%)` }}
        >
          {images.map((image, idx) => (
            <img
              key={idx}
              src={image}
              alt={`${property.title} ${idx + 1}`}
              className="w-full h-64 object-cover flex-shrink-0 transition-transform duration-700 group-hover:scale-110"
            />
          ))}
        </div>

        {/* Image Navigation */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white"
            >
              <ChevronLeft className="h-4 w-4 text-gray-700" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white"
            >
              <ChevronRight className="h-4 w-4 text-gray-700" />
            </button>
          </>
        )}

        {/* Overlay Elements */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />
        
        {/* Top Badges */}
        <div className="absolute top-4 left-4 flex items-center space-x-2">
          <span className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full text-sm font-medium shadow-lg">
            {property.type === 'apartment' ? 'Dzīvoklis' : property.type === 'house' ? 'Māja' : 'Zeme'}
          </span>
          {property.condition === 'new' && (
            <span className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full text-xs font-medium shadow-lg">
              Jauns
            </span>
          )}
        </div>

        {/* Top Right Actions */}
        <div className="absolute top-4 right-4 flex items-center space-x-2">
          <button 
            onClick={(e) => e.stopPropagation()}
            className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110"
          >
            <Heart className="h-5 w-5 text-gray-600 hover:text-red-500 transition-colors" />
          </button>
          <button 
            onClick={(e) => e.stopPropagation()}
            className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110"
          >
            <Share2 className="h-5 w-5 text-gray-600 hover:text-blue-500 transition-colors" />
          </button>
        </div>

        {/* Bottom Right Info */}
        <div className="absolute bottom-4 right-4 flex items-center space-x-3">
          <div className="flex items-center bg-black/50 backdrop-blur text-white px-3 py-1.5 rounded-full text-sm">
            <Camera className="h-4 w-4 mr-1" />
            {images.length}
          </div>
          <div className="flex items-center bg-black/50 backdrop-blur text-white px-3 py-1.5 rounded-full text-sm">
            <Eye className="h-4 w-4 mr-1" />
            {property.views || Math.floor(Math.random() * 500) + 50}
          </div>
        </div>

        {/* Play Button for Virtual Tour */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button 
            onClick={(e) => e.stopPropagation()}
            className="w-16 h-16 bg-white/90 backdrop-blur rounded-full flex items-center justify-center transform scale-75 group-hover:scale-100 transition-all duration-300 hover:bg-white"
          >
            <PlayCircle className="h-8 w-8 text-blue-600" />
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6">
        {/* Price and Title */}
        <div className="mb-4">
          <div className="flex items-start justify-between mb-2">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              {formatPrice(property.price)}
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">€/m²</div>
              <div className="font-semibold text-gray-800">
                {Math.round(property.price / property.area)}
              </div>
            </div>
          </div>
          <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {property.title}
          </h3>
          <p className="text-gray-600 flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-blue-500" />
            {property.location}
          </p>
        </div>

        {/* Property Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Square className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-sm text-gray-500">Platība</div>
            <div className="font-bold text-gray-900">{property.area}m²</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Bed className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-sm text-gray-500">Istabas</div>
            <div className="font-bold text-gray-900">{property.rooms}</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Bath className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-sm text-gray-500">Vannas</div>
            <div className="font-bold text-gray-900">{Math.ceil(property.rooms / 2)}</div>
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { icon: Wifi, label: 'WiFi', color: 'blue' },
            { icon: Car, label: 'Stāvvieta', color: 'green' },
            { icon: TreePine, label: 'Dārzs', color: 'emerald' },
            { icon: Shield, label: 'Drošība', color: 'purple' }
          ].slice(0, Math.floor(Math.random() * 3) + 2).map((feature, idx) => (
            <div
              key={idx}
              className={`flex items-center space-x-1 px-3 py-1.5 bg-${feature.color}-50 text-${feature.color}-700 rounded-full text-xs font-medium`}
            >
              <feature.icon className="h-3 w-3" />
              <span>{feature.label}</span>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <button 
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-2xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center space-x-2 group transform hover:scale-[1.02]"
        >
          <span>Skatīt detaļas</span>
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* Hover Animation Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 transition-opacity duration-300 pointer-events-none ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
    </div>
  );
};

// Advanced Property Detail Modal
const PropertyDetailModal: React.FC<{
  property: SSProperty | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ property, isOpen, onClose }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!property) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('lv-LV', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const images = property.imageUrls || ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop'];

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-7xl w-full max-h-[95vh] overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 h-full max-h-[95vh]">
        {/* Image Gallery */}
        <div className="relative bg-gray-900">
          <div className="relative h-full min-h-[400px] lg:min-h-[600px]">
            <img
              src={images[activeImageIndex]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 z-10"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Image Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                  className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={() => setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Image Indicators */}
            {images.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      idx === activeImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Fullscreen Button */}
            <button className="absolute bottom-6 right-6 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300">
              <Maximize2 className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Property Details */}
        <div className="flex flex-col h-full max-h-[95vh] overflow-y-auto">
          <div className="p-8 space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
                  <p className="text-lg text-gray-600 flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-blue-500" />
                    {property.location}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors">
                    <Heart className="h-6 w-6 text-gray-600 hover:text-red-500" />
                  </button>
                  <button className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors">
                    <Bookmark className="h-6 w-6 text-gray-600 hover:text-blue-500" />
                  </button>
                  <button className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors">
                    <Share2 className="h-6 w-6 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-end space-x-4 mb-6">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  {formatPrice(property.price)}
                </div>
                <div className="text-lg text-gray-600 mb-1">
                  {Math.round(property.price / property.area)} €/m²
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { icon: Square, label: 'Platība', value: `${property.area}m²`, color: 'blue' },
                { icon: Bed, label: 'Istabas', value: property.rooms.toString(), color: 'green' },
                { icon: Bath, label: 'Vannas', value: Math.ceil(property.rooms / 2).toString(), color: 'purple' },
                { icon: Calendar, label: 'Stāvs', value: `${Math.floor(Math.random() * 10) + 1}`, color: 'orange' }
              ].map((stat, idx) => (
                <div key={idx} className="text-center p-4 bg-gray-50 rounded-2xl">
                  <div className={`w-12 h-12 bg-${stat.color}-100 rounded-xl flex items-center justify-center mx-auto mb-3`}>
                    <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                  </div>
                  <div className="text-sm text-gray-500 mb-1">{stat.label}</div>
                  <div className="font-bold text-gray-900">{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Apraksts</h3>
              <p className="text-gray-600 leading-relaxed">
                {property.description || 'Mūsdienīgs īpašums ar labu ģeogrāfisko novietojumu. Pieejamas visas nepieciešamās komunikācijas. Lieliska izvēle ģimenei vai investīcijām. Īpašums atrodas klusā un drošā rajonā ar labu infrastruktūru un transporta savienojumu.'}
              </p>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Ērtības</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Wifi, label: 'Bezmaksas WiFi', available: true },
                  { icon: Car, label: 'Stāvvieta', available: true },
                  { icon: TreePine, label: 'Dārzs/Terase', available: Math.random() > 0.5 },
                  { icon: Shield, label: 'Drošības sistēma', available: Math.random() > 0.5 },
                  { icon: Zap, label: 'Ātra interneta', available: true },
                  { icon: Home, label: 'Mēbelēts', available: Math.random() > 0.5 }
                ].map((feature, idx) => (
                  <div key={idx} className={`flex items-center space-x-3 p-3 rounded-xl ${feature.available ? 'bg-green-50' : 'bg-gray-50'}`}>
                    <feature.icon className={`h-5 w-5 ${feature.available ? 'text-green-600' : 'text-gray-400'}`} />
                    <span className={`${feature.available ? 'text-gray-900' : 'text-gray-500 line-through'}`}>
                      {feature.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t border-gray-200 p-8 mt-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-2xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105">
                <Phone className="h-5 w-5" />
                <span>Zvanīt</span>
              </button>
              <button className="flex items-center justify-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-2xl font-medium hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:scale-105">
                <MessageCircle className="h-5 w-5" />
                <span>Rakstīt</span>
              </button>
              <button className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-6 rounded-2xl font-medium hover:from-purple-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105">
                <ArrowUpRight className="h-5 w-5" />
                <span>Apskatīt</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

// Main Component
const HouseSearch: React.FC = () => {
  const [properties, setProperties] = useState<SSProperty[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<SSProperty[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<SSProperty | null>(null);
  const [view, setView] = useState<'list' | 'map' | 'mortgage'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [showPropertyModal, setShowPropertyModal] = useState(false);

  const [filters, setFilters] = useState<SearchFilters>({
    maxPrice: 150000,
    location: 'Rīga',
    sortBy: 'price_asc',
    page: 1
  });

  const [marketAnalytics, setMarketAnalytics] = useState<MarketAnalytics | null>(null);
  const [recommendations, setRecommendations] = useState<PropertyRecommendation[]>([]);
  const [regions] = useState<LatvianRegion[]>(latvianBankService.getRegions());
  
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

  useEffect(() => {
    searchProperties();
    loadMarketData();
  }, [searchProperties, loadMarketData]);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      searchProperties();
    }, 500);
    return () => clearTimeout(delayedSearch);
  }, [searchProperties]);

  useEffect(() => {
    generateRecommendations();
  }, [generateRecommendations]);

  const handlePropertySelect = (property: SSProperty) => {
    setSelectedProperty(property);
    setShowPropertyModal(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('lv-LV', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <>
      {/* Ultra Modern Header with Glassmorphism */}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="sticky top-0 z-30 bg-white/70 backdrop-blur-2xl border-b border-white/20 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              {/* Header Content */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 rounded-2xl flex items-center justify-center shadow-2xl">
                        <Home className="h-8 w-8 text-white" />
                      </div>
                      <div className="absolute -inset-1 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl opacity-20 blur-lg animate-pulse"></div>
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-700 bg-clip-text text-transparent">
                        Latvijas Premium Īpašumi
                      </h1>
                      <p className="text-gray-600 font-medium">Atrodiet savu sapņu māju ar AI palīdzību</p>
                    </div>
                  </div>
                </div>
                
                {/* Animated Stats */}
                <div className="hidden lg:flex items-center space-x-8">
                  {[
                    { label: 'Īpašumi', value: properties.length, color: 'blue', icon: Home },
                    { label: 'Vidējā cena', value: marketAnalytics ? formatPrice(marketAnalytics.averagePrice) : '-', color: 'green', icon: Square },
                    { label: 'Pieaugums', value: marketAnalytics ? `+${marketAnalytics.priceChange.toFixed(1)}%` : '-', color: 'purple', icon: ArrowUpRight }
                  ].map((stat, idx) => (
                    <div key={idx} className="text-center group">
                      <div className={`w-12 h-12 bg-gradient-to-br from-${stat.color}-100 to-${stat.color}-200 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300`}>
                        <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                      </div>
                      <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-xs text-gray-500 font-medium">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Advanced Search Bar */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl opacity-10 blur-xl"></div>
                <div className="relative bg-white/80 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl p-2">
                  <div className="flex items-center">
                    <div className="flex-1 relative">
                      <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Meklēt pēc atrašanās vietas, rajona vai īpašuma tipa..."
                        className="w-full pl-14 pr-6 py-4 bg-transparent text-lg placeholder-gray-500 focus:outline-none"
                        value={filters.location || ''}
                        onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                      />
                    </div>
                    <div className="flex items-center space-x-3 pr-2">
                      <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium shadow-lg transform hover:scale-105"
                      >
                        <Filter className="h-5 w-5" />
                        <span>Filtri</span>
                      </button>
                      <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 font-medium shadow-lg transform hover:scale-105">
                        <Bell className="h-5 w-5" />
                        <span>Brīdinājumi</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Advanced Filters Panel */}
              {showFilters && (
                <div className="mt-6 p-6 bg-white/80 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                         <div>
                       <label className="block text-sm font-semibold text-gray-700 mb-3">Maksimālā cena</label>
                       <select
                         value={filters.maxPrice}
                         onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
                         className="w-full px-4 py-3 bg-white/90 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg font-medium"
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
                       <label className="block text-sm font-semibold text-gray-700 mb-3">Rajons</label>
                       <select
                         value={filters.location}
                         onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                         className="w-full px-4 py-3 bg-white/90 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg font-medium"
                       >
                         <option value="Rīga">Rīga</option>
                         <option value="Jūrmala">Jūrmala</option>
                         <option value="Liepāja">Liepāja</option>
                         <option value="Daugavpils">Daugavpils</option>
                         <option value="Jelgava">Jelgava</option>
                       </select>
                     </div>

                     <div>
                       <label className="block text-sm font-semibold text-gray-700 mb-3">Kārtošana</label>
                       <select
                         value={filters.sortBy}
                         onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                         className="w-full px-4 py-3 bg-white/90 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg font-medium"
                       >
                         <option value="price_asc">Cena: No zemākās</option>
                         <option value="price_desc">Cena: No augstākās</option>
                         <option value="area_desc">Platība: No lielākās</option>
                         <option value="newest">Jaunākie</option>
                       </select>
                     </div>

                     {/* This will be the fourth column */}
                     <div className="flex items-end">
                       <button
                         onClick={() => setShowFilters(false)}
                         className="w-full px-4 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-2xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 font-medium shadow-lg transform hover:scale-105"
                       >
                         Paslēpt filtrus
                       </button>
                     </div>

                     {/* Remove this entire .map() block
                     {[].map((filter, idx) => (
                      
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced View Toggle */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center bg-white/80 backdrop-blur-xl p-1.5 rounded-3xl border border-white/30 shadow-2xl">
              {[
                { key: 'list', label: 'Saraksts', icon: Home },
                { key: 'map', label: 'Karte', icon: MapPin },
                { key: 'mortgage', label: 'Hipotēka', icon: BarChart3 }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setView(tab.key as any)}
                  className={`flex items-center space-x-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                    view === tab.key
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {view === 'list' && (
            <div className="space-y-12">
              {/* AI Recommendations */}
              {recommendations.length > 0 && (
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-3xl blur-3xl"></div>
                  <div className="relative bg-white/60 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl p-8">
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl shadow-lg mb-4">
                        <Star className="h-6 w-6" />
                        <span className="font-bold text-lg">AI Ieteikumi specīli jums</span>
                      </div>
                      <p className="text-gray-600 text-lg">Mākslīgais intelekts analizēja jūsu preferences un atrada šos īpašumus</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {recommendations.slice(0, 3).map((rec, index) => (
                        <div key={index} className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          <PropertyCard
                            property={rec.property}
                            onSelect={handlePropertySelect}
                            className="relative transform transition-all duration-500 group-hover:scale-105"
                          />
                          <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-2xl font-bold text-sm shadow-lg">
                            {rec.score}% Match
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Properties Grid */}
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-gray-900">
                    {loading ? (
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span>Meklē īpašumus...</span>
                      </div>
                    ) : (
                      `${filteredProperties.length} īpašumi atrasti`
                    )}
                  </h2>
                </div>

                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/30 animate-pulse">
                        <div className="w-full h-64 bg-gray-200 rounded-2xl mb-6"></div>
                        <div className="space-y-4">
                          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-8 bg-gray-200 rounded w-full"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                         {filteredProperties.map((property, index) => (
                       <PropertyCard
                         key={property.id}
                         property={property}
                         onSelect={handlePropertySelect}
                         className="animate-fadeInUp"
                         style={{ animationDelay: `${index * 100}ms` }}
                       />
                     ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {view === 'map' && (
            <div className="bg-white/60 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <MapPin className="h-7 w-7 mr-3 text-blue-600" />
                Īpašumi interaktīvajā kartē
              </h3>
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <PropertyMap
                  properties={filteredProperties}
                  selectedProperty={selectedProperty}
                  onPropertySelect={setSelectedProperty}
                  height="700px"
                  showRegions={true}
                  maxPrice={filters.maxPrice}
                  regions={regions}
                />
              </div>
            </div>
          )}

          {view === 'mortgage' && (
            <div className="bg-white/60 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <BarChart3 className="h-7 w-7 mr-3 text-green-600" />
                Hipotēkas kalkulators
              </h3>
              <MortgageCalculator
                propertyPrice={selectedProperty?.price || filters.maxPrice || 150000}
              />
            </div>
          )}
        </div>
      </div>

      {/* Property Detail Modal */}
      <PropertyDetailModal
        property={selectedProperty}
        isOpen={showPropertyModal}
        onClose={() => {
          setShowPropertyModal(false);
          setSelectedProperty(null);
        }}
      />

      
    </>
  );
};

export default HouseSearch;