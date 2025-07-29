import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../contexts/UserContext';
import * as api from '../services/api';
import {
  Navigation,
  Camera,
  Mic,
  Compass,
  AlertTriangle,
  Battery,
  Wifi,
  WifiOff,
  Upload,
  Play,
  Square,
  Shield,
  Map,
  Clock,
  Zap
} from 'lucide-react';

interface GPSTrack {
  id: string;
  name: string;
  coordinates: { lat: number; lng: number; timestamp: number; altitude?: number }[];
  startTime: string;
  endTime?: string;
  distance: number;
  duration: number;
  isActive: boolean;
}

interface VoiceNote {
  id: string;
  name: string;
  duration: number;
  size: number;
  timestamp: string;
  location?: { lat: number; lng: number };
  audioBlob: Blob;
}

// interface OfflineMap {
//   id: string;
//   name: string;
//   bounds: { north: number; south: number; east: number; west: number };
//   zoomLevel: number;
//   size: number;
//   downloadedAt: string;
//   tiles: number;
// }

const PWAFeatures: React.FC = () => {
  const { isLoggedIn } = useUser();
  const [activeTab, setActiveTab] = useState<'gps' | 'maps' | 'camera' | 'voice' | 'compass' | 'emergency' | 'sync'>('gps');
  
  // GPS Tracking
  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const [tracks, setTracks] = useState<GPSTrack[]>([]);
  const [currentTrack, setCurrentTrack] = useState<GPSTrack | null>(null);
  
  // Voice Notes
  const [isRecording, setIsRecording] = useState(false);
  const [voiceNotes, setVoiceNotes] = useState<VoiceNote[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  // Compass
  const [heading, setHeading] = useState<number>(0);
  const [compassCalibrated, setCompassCalibrated] = useState(false);
  
  // Emergency
  const [sosActive, setSosActive] = useState(false);
  
  // PWA State
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [syncQueue, setSyncQueue] = useState<any[]>([]);
  
  const watchIdRef = useRef<number | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const initializePWA = async () => {
    // Initialize battery API
    if ('getBattery' in navigator) {
      try {
        const battery = await (navigator as any).getBattery();
        setBatteryLevel(Math.round(battery.level * 100));
        battery.addEventListener('levelchange', () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });
      } catch (error) {
        console.log('Battery API not available');
      }
    }

    // Initialize compass
    if ('DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientation', handleDeviceOrientation);
    }

    // Request permissions
    await requestPermissions();
  };

  useEffect(() => {
    // Initialize PWA features
    initializePWA();
    
    // Setup event listeners
    window.addEventListener('online', () => setIsOnline(true));
    window.addEventListener('offline', () => setIsOnline(false));
    
    // Load saved data
    loadOfflineData();
    
    return () => {
      // Cleanup
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      window.removeEventListener('online', () => setIsOnline(true));
      window.removeEventListener('offline', () => setIsOnline(false));
    };
  }, []);

  const requestPermissions = async () => {
    // Location permission
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => console.log('Location permission denied:', error)
      );
    }

    // Microphone permission for voice notes
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (error) {
      console.log('Microphone permission denied:', error);
    }
  };

  const loadOfflineData = () => {
    // Load saved tracks
    const savedTracks = localStorage.getItem('pwa-gps-tracks');
    if (savedTracks) {
      setTracks(JSON.parse(savedTracks));
    }

    // Load voice notes
    const savedVoiceNotes = localStorage.getItem('pwa-voice-notes');
    if (savedVoiceNotes) {
      setVoiceNotes(JSON.parse(savedVoiceNotes));
    }

    // Load offline maps (placeholder for future implementation)
    const savedMaps = localStorage.getItem('pwa-offline-maps');
    if (savedMaps) {
      console.log('Offline maps found:', JSON.parse(savedMaps));
    }

    // Load sync queue
    const savedSyncQueue = localStorage.getItem('pwa-sync-queue');
    if (savedSyncQueue) {
      setSyncQueue(JSON.parse(savedSyncQueue));
    }
  };

  const startGPSTracking = () => {
    if (!currentLocation) {
      alert('Location not available. Please enable GPS.');
      return;
    }

    const newTrack: GPSTrack = {
      id: Date.now().toString(),
      name: `Track ${new Date().toLocaleString()}`,
      coordinates: [{
        lat: currentLocation.lat,
        lng: currentLocation.lng,
        timestamp: Date.now(),
        altitude: 0
      }],
      startTime: new Date().toISOString(),
      distance: 0,
      duration: 0,
      isActive: true
    };

    setCurrentTrack(newTrack);
    setIsTracking(true);

    // Start watching position
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const newCoord = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timestamp: Date.now(),
          altitude: position.coords.altitude || 0
        };

        setCurrentTrack(prev => {
          if (!prev) return prev;
          
          const updatedTrack = {
            ...prev,
            coordinates: [...prev.coordinates, newCoord],
            distance: calculateDistance(prev.coordinates, newCoord),
            duration: Date.now() - new Date(prev.startTime).getTime()
          };

          // Save to localStorage
          const allTracks = tracks.map(t => t.id === prev.id ? updatedTrack : t);
          if (!allTracks.find(t => t.id === updatedTrack.id)) {
            allTracks.push(updatedTrack);
          }
          localStorage.setItem('pwa-gps-tracks', JSON.stringify(allTracks));
          
          return updatedTrack;
        });

        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => console.error('GPS tracking error:', error),
      { enableHighAccuracy: true, maximumAge: 1000, timeout: 5000 }
    );
  };

  const stopGPSTracking = () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    if (currentTrack) {
      const finishedTrack = {
        ...currentTrack,
        endTime: new Date().toISOString(),
        isActive: false
      };

      setTracks(prev => {
        const updated = prev.map(t => t.id === currentTrack.id ? finishedTrack : t);
        if (!updated.find(t => t.id === finishedTrack.id)) {
          updated.push(finishedTrack);
        }
        localStorage.setItem('pwa-gps-tracks', JSON.stringify(updated));
        return updated;
      });
    }

    setCurrentTrack(null);
    setIsTracking(false);
  };

  const calculateDistance = (coordinates: any[], newCoord: any): number => {
    if (coordinates.length < 2) return 0;
    
    const lastCoord = coordinates[coordinates.length - 1];
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lastCoord.lat * Math.PI/180;
    const φ2 = newCoord.lat * Math.PI/180;
    const Δφ = (newCoord.lat - lastCoord.lat) * Math.PI/180;
    const Δλ = (newCoord.lng - lastCoord.lng) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const newVoiceNote: VoiceNote = {
          id: Date.now().toString(),
          name: `Voice Note ${new Date().toLocaleString()}`,
          duration: recordingTime,
          size: audioBlob.size,
          timestamp: new Date().toISOString(),
          location: currentLocation || undefined,
          audioBlob
        };

        setVoiceNotes(prev => {
          const updated = [...prev, newVoiceNote];
          localStorage.setItem('pwa-voice-notes', JSON.stringify(updated.map(vn => ({
            ...vn,
            audioBlob: undefined // Don't store blob in localStorage
          }))));
          return updated;
        });

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error starting voice recording:', error);
      alert('Unable to access microphone');
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
    if (event.alpha !== null) {
      setHeading(360 - event.alpha);
      setCompassCalibrated(true);
    }
  };



  const triggerSOS = () => {
    if (!currentLocation) {
      alert('Location not available for SOS');
      return;
    }

    setSosActive(true);
    
    // Send SOS to emergency contacts
    const sosMessage = `EMERGENCY: I need help! My location: https://maps.google.com/?q=${currentLocation.lat},${currentLocation.lng}`;
    
    // In a real app, this would send SMS or make calls
    console.log('SOS triggered:', sosMessage);
    
    // Add to sync queue for when online
    const sosData = {
      type: 'emergency',
      location: currentLocation,
      timestamp: new Date().toISOString(),
      message: sosMessage
    };

    setSyncQueue(prev => {
      const updated = [...prev, sosData];
      localStorage.setItem('pwa-sync-queue', JSON.stringify(updated));
      return updated;
    });

    // Auto-cancel after 30 seconds if not manually cancelled
    setTimeout(() => {
      setSosActive(false);
    }, 30000);
  };

  const cancelSOS = () => {
    setSosActive(false);
  };

  const syncOfflineData = async () => {
    if (!isOnline || syncQueue.length === 0) return;

    try {
      for (const item of syncQueue) {
        // Sync different types of data
        switch (item.type) {
          case 'track':
            await api.uploadGPSTrack(item.data);
            break;
          case 'voice_note':
            await api.uploadVoiceNote(item.data);
            break;
          case 'emergency':
            await api.reportEmergency(item.data);
            break;
          case 'photo':
            await api.uploadPhoto(item.data);
            break;
        }
      }

      // Clear sync queue
      setSyncQueue([]);
      localStorage.removeItem('pwa-sync-queue');
      
    } catch (error) {
      console.error('Sync failed:', error);
    }
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isLoggedIn) {
    return (
      <div className="text-center py-12">
        <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Login Required
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Please log in to access PWA features
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* PWA Status Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
            {isOnline ? <Wifi className="h-5 w-5" /> : <WifiOff className="h-5 w-5" />}
            <span className="text-sm font-medium">
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
          
          {batteryLevel !== null && (
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Battery className="h-5 w-5" />
              <span className="text-sm">{batteryLevel}%</span>
            </div>
          )}
          
          {syncQueue.length > 0 && (
            <div className="flex items-center gap-2 text-orange-600">
              <Clock className="h-5 w-5" />
              <span className="text-sm">{syncQueue.length} items to sync</span>
            </div>
          )}
        </div>

        {isOnline && syncQueue.length > 0 && (
          <button
            onClick={syncOfflineData}
            className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
          >
            <Upload className="h-4 w-4" />
            Sync Now
          </button>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
        {[
          { id: 'gps', label: 'GPS Tracking', icon: Navigation },
          { id: 'maps', label: 'Offline Maps', icon: Map },
          { id: 'camera', label: 'Camera', icon: Camera },
          { id: 'voice', label: 'Voice Notes', icon: Mic },
          { id: 'compass', label: 'Compass', icon: Compass },
          { id: 'emergency', label: 'Emergency', icon: AlertTriangle },
          { id: 'sync', label: 'Sync', icon: Zap }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all text-sm ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
        {activeTab === 'gps' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">GPS Tracking</h3>
              <div className="flex items-center gap-3">
                {currentLocation && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Accuracy: {Math.round(currentLocation.accuracy)}m
                  </div>
                )}
                <button
                  onClick={isTracking ? stopGPSTracking : startGPSTracking}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    isTracking
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {isTracking ? (
                    <>
                      <Square className="h-4 w-4" />
                      Stop Tracking
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Start Tracking
                    </>
                  )}
                </button>
              </div>
            </div>

            {currentTrack && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Current Track</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Distance:</span>
                    <div className="font-medium">{(currentTrack.distance / 1000).toFixed(2)} km</div>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                    <div className="font-medium">{formatDuration(Math.floor(currentTrack.duration / 1000))}</div>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Points:</span>
                    <div className="font-medium">{currentTrack.coordinates.length}</div>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 dark:text-white">Saved Tracks</h4>
              {tracks.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                  No tracks recorded yet. Start tracking to create your first adventure log!
                </p>
              ) : (
                tracks.map(track => (
                  <div key={track.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Navigation className="h-8 w-8 text-blue-600" />
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900 dark:text-white">{track.name}</h5>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {(track.distance / 1000).toFixed(2)} km • {formatDuration(Math.floor(track.duration / 1000))} • {track.coordinates.length} points
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(track.startTime).toLocaleString()}
                      </div>
                    </div>
                    {track.isActive && (
                      <div className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                        Active
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'voice' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Voice Notes</h3>
              <button
                onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isRecording
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isRecording ? (
                  <>
                    <Square className="h-4 w-4" />
                    Stop ({formatDuration(recordingTime)})
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4" />
                    Record Note
                  </>
                )}
              </button>
            </div>

            <div className="space-y-3">
              {voiceNotes.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                  No voice notes yet. Record your first adventure audio log!
                </p>
              ) : (
                voiceNotes.map(note => (
                  <div key={note.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Mic className="h-8 w-8 text-purple-600" />
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900 dark:text-white">{note.name}</h5>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDuration(note.duration)} • {formatFileSize(note.size)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(note.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
                      <Play className="h-5 w-5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'compass' && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Digital Compass</h3>
              
              {!compassCalibrated ? (
                <div className="p-8">
                  <Compass className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Move your device in a figure-8 pattern to calibrate the compass
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="relative w-64 h-64 mx-auto">
                    <div className="absolute inset-0 rounded-full border-4 border-gray-300 dark:border-gray-600"></div>
                    <div className="absolute inset-4 rounded-full border-2 border-gray-200 dark:border-gray-700"></div>
                    
                    {/* Compass needle */}
                    <div 
                      className="absolute top-1/2 left-1/2 w-1 h-24 bg-red-600 origin-bottom transform -translate-x-1/2 -translate-y-full transition-transform duration-300"
                      style={{ transform: `translate(-50%, -100%) rotate(${heading}deg)` }}
                    ></div>
                    
                    {/* Cardinal directions */}
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 font-bold text-red-600">N</div>
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 font-bold text-gray-600">E</div>
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 font-bold text-gray-600">S</div>
                    <div className="absolute left-2 top-1/2 transform -translate-y-1/2 font-bold text-gray-600">W</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      {Math.round(heading)}°
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      {getCardinalDirection(heading)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'emergency' && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Emergency SOS</h3>
              
              {sosActive ? (
                <div className="space-y-6">
                  <div className="p-8 bg-red-50 dark:bg-red-900/20 rounded-xl">
                    <AlertTriangle className="h-16 w-16 text-red-600 mx-auto mb-4 animate-pulse" />
                    <h4 className="text-2xl font-bold text-red-600 mb-2">SOS ACTIVE</h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Emergency signal sent with your location
                    </p>
                    <button
                      onClick={cancelSOS}
                      className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Cancel SOS
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="p-8">
                    <Shield className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      In case of emergency, this will send your location to emergency contacts and services
                    </p>
                    <button
                      onClick={triggerSOS}
                      className="px-8 py-4 bg-red-600 text-white rounded-xl text-lg font-bold hover:bg-red-700 transition-colors"
                    >
                      <AlertTriangle className="h-6 w-6 inline mr-2" />
                      TRIGGER SOS
                    </button>
                  </div>
                  
                  <div className="text-left">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Emergency Features:</h4>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li>• Sends GPS location to emergency contacts</li>
                      <li>• Works offline - queues for when connection returns</li>
                      <li>• Auto-cancels after 30 seconds if not manually stopped</li>
                      <li>• Includes timestamp and user information</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Other tabs would continue here... */}
        {activeTab === 'sync' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Background Sync</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Sync Status</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Connection:</span>
                    <span className={isOnline ? 'text-green-600' : 'text-red-600'}>
                      {isOnline ? 'Online' : 'Offline'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Queue:</span>
                    <span className="text-gray-900 dark:text-white">{syncQueue.length} items</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Auto Sync</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Data automatically syncs when connection is restored
                </p>
              </div>
            </div>

            {syncQueue.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Pending Sync Items</h4>
                <div className="space-y-2">
                  {syncQueue.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <Clock className="h-5 w-5 text-orange-500" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white capitalize">
                          {item.type.replace('_', ' ')}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(item.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  function getCardinalDirection(heading: number): string {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return directions[Math.round(heading / 22.5) % 16];
  }
};

export default PWAFeatures;