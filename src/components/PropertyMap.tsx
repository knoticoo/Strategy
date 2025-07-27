// Interactive Property Map Component for Latvia
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { SSProperty } from '../services/ssLvScrapingService';
import { LatvianRegion } from '../services/latvianBankService';
import { MapPin, Home, Euro, Square, Eye, Phone, ExternalLink } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface PropertyMapProps {
  properties: SSProperty[];
  selectedProperty?: SSProperty | null;
  onPropertySelect: (property: SSProperty) => void;
  center?: [number, number];
  zoom?: number;
  height?: string;
  showRegions?: boolean;
  maxPrice?: number;
  regions?: LatvianRegion[];
}

// Custom property marker
const createPropertyIcon = (property: SSProperty, isSelected: boolean) => {
  const color = isSelected ? '#ef4444' : getMarkerColor(property);
  const size = isSelected ? 40 : 30;
  
  return L.divIcon({
    html: `
      <div style="
        background: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: ${size/3}px;
        position: relative;
      ">
        €${property.price >= 1000 ? (property.price / 1000).toFixed(0) + 'K' : property.price}
      </div>
    `,
    className: 'custom-property-marker',
    iconSize: [size, size],
    iconAnchor: [size/2, size/2],
  });
};

const getMarkerColor = (property: SSProperty): string => {
  if (property.price < 50000) return '#10b981'; // Green for affordable
  if (property.price < 80000) return '#f59e0b'; // Orange for moderate
  return '#ef4444'; // Red for expensive
};

// Map center controller
const MapController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  
  return null;
};

const PropertyMap: React.FC<PropertyMapProps> = ({
  properties,
  selectedProperty,
  onPropertySelect,
  center = [56.9496, 24.1052], // Riga center
  zoom = 11,
  height = '500px',
  showRegions = false,
  maxPrice,
  regions = []
}) => {
  const [filteredProperties, setFilteredProperties] = useState<SSProperty[]>(properties);
  const [mapCenter, setMapCenter] = useState<[number, number]>(center);
  const [currentZoom, setCurrentZoom] = useState(zoom);

  useEffect(() => {
    let filtered = properties.filter(p => p.coordinates);
    
    if (maxPrice) {
      filtered = filtered.filter(p => p.price <= maxPrice);
    }
    
    setFilteredProperties(filtered);
  }, [properties, maxPrice]);

  useEffect(() => {
    if (selectedProperty && selectedProperty.coordinates) {
      setMapCenter(selectedProperty.coordinates);
      setCurrentZoom(14);
    }
  }, [selectedProperty]);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('lv-LV', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getPropertyTypeIcon = (type: string) => {
    switch (type) {
      case 'house': return <Home className="h-4 w-4" />;
      case 'apartment': return <MapPin className="h-4 w-4" />;
      default: return <Square className="h-4 w-4" />;
    }
  };

  return (
    <div className="relative" style={{ height }}>
      <MapContainer
        center={mapCenter}
        zoom={currentZoom}
        style={{ height: '100%', width: '100%', borderRadius: '12px' }}
        className="z-0"
      >
        <MapController center={mapCenter} zoom={currentZoom} />
        
        {/* Map tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Property markers */}
        {filteredProperties.map((property) => (
          property.coordinates && (
            <Marker
              key={property.id}
              position={property.coordinates}
              icon={createPropertyIcon(property, selectedProperty?.id === property.id)}
              eventHandlers={{
                click: () => onPropertySelect(property),
              }}
            >
              <Popup maxWidth={350} className="property-popup">
                <div className="p-2">
                  {/* Property image */}
                  {property.imageUrls.length > 0 && (
                    <img
                      src={property.imageUrls[0]}
                      alt={property.title}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                  )}
                  
                  {/* Property details */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                      {property.title}
                    </h3>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary-600">
                        {formatPrice(property.price)}
                      </span>
                      <div className="flex items-center text-gray-500 text-xs">
                        {getPropertyTypeIcon(property.type)}
                        <span className="ml-1">{property.type}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Square className="h-3 w-3 mr-1" />
                        {property.area}m²
                      </div>
                      <div className="flex items-center">
                        <Home className="h-3 w-3 mr-1" />
                        {property.rooms} ist.
                      </div>
                      {property.pricePerSqm && (
                        <div className="flex items-center">
                          <Euro className="h-3 w-3 mr-1" />
                          €{property.pricePerSqm}/m²
                        </div>
                      )}
                      <div className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {property.views} skat.
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      📍 {property.location}
                    </div>
                    
                    {/* Features */}
                    {property.features.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
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
                    
                    {/* Action buttons */}
                    <div className="flex space-x-2 mt-3">
                      <button
                        onClick={() => window.open(property.url, '_blank')}
                        className="flex-1 flex items-center justify-center px-3 py-2 bg-primary-600 text-white text-xs rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Skatīt ss.lv
                      </button>
                      
                      {property.phone && (
                        <button
                          onClick={() => window.open(`tel:${property.phone}`, '_self')}
                          className="px-3 py-2 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Phone className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        ))}

        {/* Region markers */}
        {showRegions && regions.map((region) => (
          <Marker
            key={region.id}
            position={region.coordinates}
            icon={L.divIcon({
              html: `
                <div style="
                  background: rgba(59, 130, 246, 0.8);
                  color: white;
                  padding: 4px 8px;
                  border-radius: 12px;
                  font-size: 11px;
                  font-weight: bold;
                  border: 2px solid white;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                  white-space: nowrap;
                ">
                  ${region.name}
                </div>
              `,
              className: 'region-marker',
              iconSize: [120, 30],
              iconAnchor: [60, 15],
            })}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-gray-900">{region.name}</h3>
                <div className="text-sm text-gray-600 mt-1">
                  <div>Vidējā cena: €{region.averagePrice.toLocaleString()}</div>
                  <div className="flex items-center">
                    Izaugsme: 
                    <span className={`ml-1 font-medium ${region.priceGrowth > 4 ? 'text-green-600' : 'text-yellow-600'}`}>
                      +{region.priceGrowth}%
                    </span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map legend */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 z-10">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Cenu kategorijas</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span>Līdz €50k</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
            <span>€50k - €80k</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <span>Virs €80k</span>
          </div>
        </div>
        
        <div className="mt-2 pt-2 border-t border-gray-200">
          <div className="text-xs text-gray-600">
            📍 {filteredProperties.length} īpašumi kartē
          </div>
        </div>
      </div>

      {/* Quick location buttons */}
      <div className="absolute bottom-4 left-4 flex flex-col space-y-2 z-10">
        <button
          onClick={() => {
            setMapCenter([56.9496, 24.1052]);
            setCurrentZoom(11);
          }}
          className="px-3 py-2 bg-white text-gray-700 text-xs rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
        >
          📍 Rīga
        </button>
        <button
          onClick={() => {
            setMapCenter([56.9681, 23.7794]);
            setCurrentZoom(12);
          }}
          className="px-3 py-2 bg-white text-gray-700 text-xs rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
        >
          🏖️ Jūrmala
        </button>
        <button
          onClick={() => {
            setMapCenter([56.5046, 21.0111]);
            setCurrentZoom(11);
          }}
          className="px-3 py-2 bg-white text-gray-700 text-xs rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
        >
          ⚓ Liepāja
        </button>
      </div>
    </div>
  );
};

export default PropertyMap;