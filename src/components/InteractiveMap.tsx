import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { RealLocation } from '../data/realLatvianData';

// Fix for default markers in Leaflet with React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface InteractiveMapProps {
  locations: RealLocation[];
  height?: string;
  center?: [number, number];
  zoom?: number;
  onLocationClick?: (location: RealLocation) => void;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({
  locations,
  height = '400px',
  center = [56.9496, 24.1052], // Riga, Latvia
  zoom = 7,
  onLocationClick
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView(center, zoom);
    mapInstanceRef.current = map;

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);

    // Custom icons for different types
    const getCustomIcon = (location: RealLocation) => {
      let iconColor = '#3388ff';

      // Different icons based on location type or features
      if (location.features.includes('Camping') || location.features.includes('Tent sites')) {
        iconColor = '#28a745'; // Green for camping
      } else if (location.features.includes('Fishing') || location.features.includes('River access')) {
        iconColor = '#007bff'; // Blue for fishing
      } else if (location.features.includes('Skiing') || location.features.includes('Winter')) {
        iconColor = '#6c757d'; // Gray for winter sports
      } else if (location.features.includes('Trail') || location.features.includes('Hiking')) {
        iconColor = '#fd7e14'; // Orange for trails
      }

      return L.divIcon({
        html: `<div style="background-color: ${iconColor}; width: 25px; height: 25px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
        className: 'custom-marker',
        iconSize: [25, 25],
        iconAnchor: [12, 12],
      });
    };

    // Add markers for each location
    locations.forEach((location) => {
      const marker = L.marker(location.coordinates, {
        icon: getCustomIcon(location)
      }).addTo(map);

      // Create popup content
      const popupContent = `
        <div style="min-width: 250px;">
          <h3 style="margin: 0 0 8px 0; color: #2c3e50; font-size: 16px;">${location.name}</h3>
          <p style="margin: 0 0 8px 0; color: #7f8c8d; font-size: 12px;">
            📍 ${location.region} • ${location.difficulty} • ${location.duration}
          </p>
          <p style="margin: 0 0 8px 0; font-size: 13px; line-height: 1.4;">
            ${location.description.en.substring(0, 120)}...
          </p>
          <div style="margin: 8px 0;">
            ${location.features.slice(0, 3).map(feature => 
              `<span style="background: #e3f2fd; color: #1976d2; padding: 2px 6px; border-radius: 12px; font-size: 11px; margin-right: 4px;">${feature}</span>`
            ).join('')}
          </div>
          ${location.pricing?.free ? 
            '<p style="margin: 4px 0; color: #27ae60; font-weight: bold; font-size: 12px;">🆓 Free Entry</p>' : 
            location.pricing?.adult ? 
            `<p style="margin: 4px 0; color: #e67e22; font-weight: bold; font-size: 12px;">💰 €${location.pricing.adult}/adult</p>` : 
            ''
          }
          ${location.contact?.website ? 
            `<a href="${location.contact.website}" target="_blank" style="color: #3498db; text-decoration: none; font-size: 12px;">🌐 Visit Website</a>` : 
            ''
          }
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 300,
        className: 'custom-popup'
      });

      // Handle click events
      marker.on('click', () => {
        if (onLocationClick) {
          onLocationClick(location);
        }
      });

      markersRef.current.push(marker);
    });

    // Fit map to show all markers if there are locations
    if (locations.length > 0) {
      const group = new L.FeatureGroup(markersRef.current);
      map.fitBounds(group.getBounds().pad(0.1));
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      markersRef.current = [];
    };
  }, [locations, center, zoom, onLocationClick]);

  return (
    <div className="relative">
      <div 
        ref={mapRef} 
        style={{ height, width: '100%' }}
        className="rounded-lg shadow-lg border border-gray-200"
      />
      
      {/* Map Legend */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-200 z-[1000]">
        <h4 className="text-sm font-semibold text-gray-800 mb-2">Legend</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full border border-white"></div>
            <span>Trails</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full border border-white"></div>
            <span>Camping</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full border border-white"></div>
            <span>Fishing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full border border-white"></div>
            <span>Winter Sports</span>
          </div>
        </div>
      </div>

      {/* Loading overlay */}
      <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
        <div className="text-gray-500">Loading map...</div>
      </div>
    </div>
  );
};

export default InteractiveMap;