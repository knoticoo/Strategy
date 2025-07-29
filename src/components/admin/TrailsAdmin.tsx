import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Plus,
  Edit,
  Trash2,
  MapPin,
  Star,
  Users,
  Clock,
  Mountain
} from 'lucide-react';
import { Trail } from '../../types';
import { DIFFICULTY_LABELS, DIFFICULTY_COLORS } from '../../constants';

export const TrailsAdmin: React.FC = () => {
  const { t } = useTranslation();
  
  const [trails, setTrails] = useState<Trail[]>([
    {
      id: 'gauja-1',
      name: 'Gauja National Park Main Trail',
      description: 'Scenic trail through Latvia\'s oldest national park',
      difficulty: 'moderate',
      distance: 8.5,
      duration: '3-4 hours',
      elevation: 150,
      location: {
        name: 'Gauja National Park',
        coordinates: { lat: 57.2304, lng: 24.8311 }
      },
      images: ['https://images.unsplash.com/photo-1551632811-561732d1e306?w=800'],
      features: ['Forest trail', 'River views', 'Wildlife watching'],
      rating: 4.7,
      reviewCount: 124,
      completedBy: 1247,
      createdAt: '2024-01-15',
      isFavorite: false
    },
    {
      id: 'kemeri-1',
      name: 'Kemeri Bog Boardwalk',
      description: 'Unique bog ecosystem with observation tower',
      difficulty: 'easy',
      distance: 3.4,
      duration: '1-2 hours',
      elevation: 0,
      location: {
        name: 'Kemeri National Park',
        coordinates: { lat: 56.9167, lng: 23.4167 }
      },
      images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'],
      features: ['Boardwalk', 'Observation tower', 'Bog ecosystem'],
      rating: 4.9,
      reviewCount: 89,
      completedBy: 892,
      createdAt: '2024-01-20',
      isFavorite: false
    },
    {
      id: 'sigulda-1',
      name: 'Sigulda Castle Ruins Trail',
      description: 'Historical trail with medieval castle ruins',
      difficulty: 'hard',
      distance: 12.2,
      duration: '4-5 hours',
      elevation: 280,
      location: {
        name: 'Sigulda',
        coordinates: { lat: 57.1544, lng: 24.8537 }
      },
      images: ['https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800'],
      features: ['Castle ruins', 'Historical sites', 'Steep climbs'],
      rating: 4.5,
      reviewCount: 67,
      completedBy: 456,
      createdAt: '2024-01-25',
      isFavorite: false
    }
  ]);

  const [editingTrail, setEditingTrail] = useState<Trail | null>(null);
  const [showTrailEditor, setShowTrailEditor] = useState(false);

  const handleDeleteTrail = (trailId: string) => {
    if (confirm('Are you sure you want to delete this trail?')) {
      setTrails(prev => prev.filter(t => t.id !== trailId));
    }
  };

  const handleSaveTrail = (trailData: Partial<Trail>) => {
    if (editingTrail) {
      setTrails(prev => prev.map(t => 
        t.id === editingTrail.id 
          ? { ...t, ...trailData }
          : t
      ));
    } else {
      const newTrail: Trail = {
        id: `trail-${Date.now()}`,
        name: trailData.name || '',
        description: trailData.description || '',
        difficulty: trailData.difficulty || 'easy',
        distance: trailData.distance || 0,
        duration: trailData.duration || '1 hour',
        elevation: trailData.elevation || 0,
        location: trailData.location || { name: '', coordinates: { lat: 0, lng: 0 } },
        images: trailData.images || [],
        features: trailData.features || [],
        rating: 0,
        reviewCount: 0,
        completedBy: 0,
        createdAt: new Date().toISOString(),
        isFavorite: false
      };
      setTrails(prev => [...prev, newTrail]);
    }
    setShowTrailEditor(false);
    setEditingTrail(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Trail Management
        </h3>
        <button
          onClick={() => {
            setEditingTrail(null);
            setShowTrailEditor(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Trail
        </button>
      </div>

      {/* Trail Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Mountain className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Total Trails</span>
          </div>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">{trails.length}</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-800 dark:text-green-200">Total Completions</span>
          </div>
          <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">
            {trails.reduce((sum, t) => sum + t.completedBy, 0)}
          </p>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Avg Rating</span>
          </div>
          <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100 mt-1">
            {(trails.reduce((sum, t) => sum + t.rating, 0) / trails.length).toFixed(1)}
          </p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-800 dark:text-purple-200">Total Distance</span>
          </div>
          <p className="text-2xl font-bold text-purple-900 dark:text-purple-100 mt-1">
            {trails.reduce((sum, t) => sum + t.distance, 0).toFixed(1)}km
          </p>
        </div>
      </div>

      {/* Trails List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-gray-900 dark:text-white">
            All Trails ({trails.length})
          </h4>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {trails.map((trail) => (
            <div key={trail.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h5 className="font-semibold text-gray-900 dark:text-white">
                      {trail.name}
                    </h5>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      DIFFICULTY_COLORS[trail.difficulty]
                    }`}>
                      {DIFFICULTY_LABELS[trail.difficulty]}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    {trail.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {trail.location.name}
                    </div>
                    <div className="flex items-center gap-1">
                      <Mountain className="h-4 w-4" />
                      {trail.distance}km
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {trail.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      {trail.rating} ({trail.reviewCount} reviews)
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {trail.completedBy} completed
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {trail.features.map((feature, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => {
                      setEditingTrail(trail);
                      setShowTrailEditor(true);
                    }}
                    className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    title="Edit Trail"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTrail(trail.id)}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    title="Delete Trail"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200">
          <div className="flex items-center gap-3">
            <Mountain className="h-6 w-6" />
            <div className="text-left">
              <div className="font-medium">Import Trails</div>
              <div className="text-sm text-blue-100">Import from GPX files</div>
            </div>
          </div>
        </button>
        
        <button className="p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200">
          <div className="flex items-center gap-3">
            <MapPin className="h-6 w-6" />
            <div className="text-left">
              <div className="font-medium">Map View</div>
              <div className="text-sm text-green-100">View all trails on map</div>
            </div>
          </div>
        </button>
        
        <button className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200">
          <div className="flex items-center gap-3">
            <Star className="h-6 w-6" />
            <div className="text-left">
              <div className="font-medium">Analytics</div>
              <div className="text-sm text-purple-100">Trail performance stats</div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};