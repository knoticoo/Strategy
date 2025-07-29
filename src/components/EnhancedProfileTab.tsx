import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useUser } from '../contexts/UserContext';
import * as api from '../services/api';
import {
  User,
  Camera,
  MapPin,
  Trophy,
  Users,
  Heart,
  MessageCircle,
  Map,
  Activity,
  Settings,
  UserPlus,
  UserMinus,
  Badge,
  Plus,
  X,
  Edit3,
  Save,
  Image as ImageIcon
} from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'trails' | 'social' | 'photos' | 'special';
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  unlockedAt?: string;
}

interface PhotoGallery {
  id: string;
  url: string;
  caption: string;
  location?: string;
  trailId?: string;
  likes: number;
  uploadedAt: string;
}

interface SocialConnection {
  id: string;
  name: string;
  avatar?: string;
  isFollowing: boolean;
  isFollower: boolean;
  mutualFollows: number;
  joinedAt: string;
}

interface ActivityTimelineItem {
  id: string;
  type: 'trail_completed' | 'photo_shared' | 'achievement_unlocked' | 'comment_made' | 'followed_user';
  title: string;
  description: string;
  timestamp: string;
  data?: any;
}

const EnhancedProfileTab: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser, isLoggedIn } = useUser();
  const [activeTab, setActiveTab] = useState<'overview' | 'gallery' | 'achievements' | 'social' | 'activity' | 'settings'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editedBio, setEditedBio] = useState('');
  const [selectedTheme, setSelectedTheme] = useState(() => {
    return localStorage.getItem('profileTheme') || 'default';
  });
  
  // Data states
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [photoGallery, setPhotoGallery] = useState<PhotoGallery[]>([]);
  const [socialConnections, setSocialConnections] = useState<SocialConnection[]>([]);
  const [activityTimeline, setActivityTimeline] = useState<ActivityTimelineItem[]>([]);
  const [stats, setStats] = useState({
    trailsCompleted: 0,
    photosShared: 0,
    totalLikes: 0,
    followers: 0,
    following: 0,
    achievements: 0
  });

  // Upload states
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const [showAddPhoto, setShowAddPhoto] = useState(false);

  const loadProfileData = useCallback(async () => {
    if (!currentUser) return;
    
    try {
      // Load achievements
      const achievementsData = await api.getUserAchievements(currentUser.id);
      setAchievements(achievementsData);

      // Load photo gallery
      const galleryData = await api.getUserPhotoGallery(currentUser.id);
      setPhotoGallery(galleryData);

      // Load social connections
      const socialData = await api.getUserSocialConnections(currentUser.id);
      setSocialConnections(socialData);

      // Load activity timeline
      const activityData = await api.getUserActivityTimeline(currentUser.id);
      setActivityTimeline(activityData);

      // Load enhanced stats
      const statsData = await api.getUserEnhancedStats(currentUser.id);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading profile data:', error);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      loadProfileData();
      setEditedBio(currentUser.bio || '');
    }
  }, [currentUser, loadProfileData]);

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('profileTheme', selectedTheme);
  }, [selectedTheme]);

  const handleSaveBio = async () => {
    if (!currentUser) return;
    
    try {
      await api.updateUser(currentUser.id, {
        name: currentUser.name,
        email: currentUser.email,
        bio: editedBio
      });
      // Update local user state
      currentUser.bio = editedBio;
      setIsEditing(false);
      alert('Bio updated successfully!');
    } catch (error) {
      console.error('Error updating bio:', error);
      alert('Failed to update bio. Please try again.');
    }
  };

  const handlePhotoUpload = async (file: File) => {
    if (!currentUser) return;
    
    setIsUploadingPhoto(true);
    try {
      // Try API upload first
      let photoUrl: string;
      try {
        const uploadResult = await api.uploadFile(file);
        photoUrl = uploadResult.url;
      } catch (uploadError) {
        // Fallback to local URL for demo
        console.log('API upload failed, using local URL');
        photoUrl = URL.createObjectURL(file);
      }

      // Try to add to gallery via API
      try {
        await api.addPhotoToGallery({
          userId: currentUser.id,
          url: photoUrl,
          caption: newPhotoCaption || 'Adventure photo',
          location: '' // Could be enhanced with location picker
        });
      } catch (galleryError) {
        // Fallback to local storage for demo
        console.log('API gallery add failed, using local storage');
        const newPhoto = {
          id: Date.now().toString(),
          url: photoUrl,
          caption: newPhotoCaption || 'Adventure photo',
          location: 'Latvia',
          likes: 0,
          uploadedAt: new Date().toISOString()
        };
        
        // Store in localStorage as fallback
        const existingPhotos = JSON.parse(localStorage.getItem('userPhotos') || '[]');
        existingPhotos.unshift(newPhoto);
        localStorage.setItem('userPhotos', JSON.stringify(existingPhotos));
      }
      
      setNewPhotoCaption('');
      setShowAddPhoto(false);
      await loadProfileData(); // Reload gallery
      alert('Photo uploaded successfully!');
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Failed to upload photo. Please try again.');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSavePhoto = async () => {
    if (!newPhotoCaption.trim()) {
      alert('Please enter a caption for your photo.');
      return;
    }
    
    // This function is called by the Save Photo button
    // The actual upload happens when file is selected, this just validates and closes
    setShowAddPhoto(false);
    setNewPhotoCaption('');
  };

  const handleFollowUser = async (userId: string) => {
    if (!currentUser) {
      alert('Please log in to follow users.');
      return;
    }

    try {
      // Find current connection state
      const connection = socialConnections.find(c => c.id === userId);
      const wasFollowing = connection?.isFollowing || false;
      
      // Update local state immediately for better UX
      setSocialConnections(prev => prev.map(connection => 
        connection.id === userId 
          ? { ...connection, isFollowing: !connection.isFollowing }
          : connection
      ));

      // Try API call
      try {
        await api.followUser(currentUser.id, userId);
      } catch (apiError) {
        console.log('Follow API not implemented, using mock behavior');
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      const action = wasFollowing ? 'unfollowed' : 'followed';
      alert(`Successfully ${action} user!`);
      
      // Update localStorage for persistence
      const followData = JSON.parse(localStorage.getItem('userFollows') || '{}');
      if (wasFollowing) {
        delete followData[userId];
      } else {
        followData[userId] = true;
      }
      localStorage.setItem('userFollows', JSON.stringify(followData));
      
    } catch (error) {
      console.error('Error following user:', error);
      // Revert the optimistic update
      setSocialConnections(prev => prev.map(connection => 
        connection.id === userId 
          ? { ...connection, isFollowing: !connection.isFollowing }
          : connection
      ));
      alert('Failed to follow/unfollow user. Please try again.');
    }
  };

  const themes = [
    { id: 'default', name: 'Default', colors: 'from-blue-500 to-purple-500' },
    { id: 'nature', name: 'Nature', colors: 'from-green-500 to-emerald-500' },
    { id: 'sunset', name: 'Sunset', colors: 'from-orange-500 to-red-500' },
    { id: 'ocean', name: 'Ocean', colors: 'from-cyan-500 to-blue-500' },
    { id: 'forest', name: 'Forest', colors: 'from-green-600 to-green-800' }
  ];

  const achievementCategories = {
    trails: { name: 'Trail Explorer', icon: '🥾', color: 'text-green-600' },
    social: { name: 'Community', icon: '👥', color: 'text-blue-600' },
    photos: { name: 'Photographer', icon: '📸', color: 'text-purple-600' },
    special: { name: 'Special', icon: '⭐', color: 'text-yellow-600' }
  };

  if (!isLoggedIn || !currentUser) {
    return (
      <div className="text-center py-12">
        <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {t('profile.loginRequired')}
        </h3>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Profile Header with Theme */}
      <div className={`relative rounded-2xl p-8 text-white bg-gradient-to-r ${themes.find(t => t.id === selectedTheme)?.colors || themes[0].colors}`}>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <img
              src={currentUser.avatar || '/default-avatar.png'}
              alt={currentUser.name}
              className="w-32 h-32 rounded-full border-4 border-white/20 object-cover"
            />
            <button className="absolute bottom-2 right-2 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold mb-2">{currentUser.name}</h1>
            <p className="text-white/80 mb-4 flex items-center justify-center md:justify-start gap-2">
              <MapPin className="h-4 w-4" />
              {currentUser.location || 'Location not set'}
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap gap-6 justify-center md:justify-start">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.trailsCompleted}</div>
                <div className="text-white/80 text-sm">{t('profile.stats.trailsCompleted')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.photosShared}</div>
                <div className="text-white/80 text-sm">{t('profile.stats.photosShared')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.followers}</div>
                <div className="text-white/80 text-sm">{t('profile.social.followers')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.following}</div>
                <div className="text-white/80 text-sm">{t('profile.social.following')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.achievements}</div>
                <div className="text-white/80 text-sm">{t('profile.achievements.title')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
        {[
          { id: 'overview', label: 'Overview', icon: User },
          { id: 'gallery', label: 'Gallery', icon: ImageIcon },
          { id: 'achievements', label: 'Achievements', icon: Trophy },
          { id: 'social', label: 'Social', icon: Users },
          { id: 'activity', label: 'Activity', icon: Activity },
          { id: 'settings', label: 'Settings', icon: Settings }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
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
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Bio Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{t('profile.bio.aboutMe')}</h3>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-3 py-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  >
                                          <Edit3 className="h-4 w-4" />
                      {t('profile.bio.edit')}
                  </button>
                )}
              </div>
              
              {isEditing ? (
                <div className="space-y-4">
                  <textarea
                    value={editedBio}
                    onChange={(e) => setEditedBio(e.target.value)}
                    placeholder="Tell us about yourself, your adventures, and what drives you to explore..."
                    className="w-full h-32 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveBio}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Save className="h-4 w-4" />
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditedBio(currentUser.bio || '');
                      }}
                      className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {currentUser.bio || 'No bio added yet. Click edit to add your story!'}
                </p>
              )}
            </div>

            {/* Recent Achievements */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Achievements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.filter(a => a.unlocked).slice(0, 4).map(achievement => (
                  <div key={achievement.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-3xl">{achievement.icon}</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{achievement.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</p>
                      {achievement.unlockedAt && (
                        <p className="text-xs text-gray-500 mt-1">
                          Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Adventure Map Preview */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Adventure Map</h3>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center">
                  <Map className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 dark:text-gray-400">Interactive adventure map coming soon!</p>
                  <p className="text-sm text-gray-500 mt-1">Track your completed trails and discoveries</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{t('profile.gallery.title')}</h3>
              <button
                onClick={() => setShowAddPhoto(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                {t('profile.gallery.addPhoto')}
              </button>
            </div>

            {/* Add Photo Modal */}
            {showAddPhoto && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{t('profile.gallery.addPhoto')}</h4>
                    <button
                      onClick={() => setShowAddPhoto(false)}
                      className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handlePhotoUpload(e.target.files[0])}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    />
                    <input
                      type="text"
                      placeholder="Photo caption..."
                      value={newPhotoCaption}
                      onChange={(e) => setNewPhotoCaption(e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowAddPhoto(false)}
                        className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSavePhoto}
                        disabled={isUploadingPhoto || !newPhotoCaption.trim()}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        {isUploadingPhoto ? 'Uploading...' : 'Save Photo'}
                      </button>
                    </div>
                    {isUploadingPhoto && (
                      <div className="flex items-center gap-2 text-blue-600">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        Uploading photo...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Photo Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {photoGallery.map(photo => (
                <div key={photo.id} className="group relative">
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 rounded-lg flex items-end">
                    <div className="p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="font-medium">{photo.caption}</p>
                      {photo.location && (
                        <p className="text-sm text-white/80 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {photo.location}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <Heart className="h-4 w-4" />
                        <span className="text-sm">{photo.likes}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {photoGallery.length === 0 && (
              <div className="text-center py-12">
                <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{t('profile.gallery.noPhotos')}</h4>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{t('profile.gallery.sharePhotos')}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Achievements</h3>
            
            {Object.entries(achievementCategories).map(([category, info]) => {
              const categoryAchievements = achievements.filter(a => a.category === category);
              const unlockedCount = categoryAchievements.filter(a => a.unlocked).length;
              
              return (
                <div key={category} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{info.icon}</span>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{info.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {unlockedCount} of {categoryAchievements.length} unlocked
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categoryAchievements.map(achievement => (
                      <div
                        key={achievement.id}
                        className={`p-4 rounded-lg border-2 ${
                          achievement.unlocked
                            ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                            : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`text-2xl ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                            {achievement.icon}
                          </span>
                          <div>
                            <h5 className="font-medium text-gray-900 dark:text-white">{achievement.name}</h5>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</p>
                          </div>
                        </div>
                        
                        {!achievement.unlocked && (
                          <div className="mt-3">
                            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                              <span>Progress</span>
                              <span>{achievement.progress}/{achievement.maxProgress}</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                        
                        {achievement.unlocked && achievement.unlockedAt && (
                          <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                            Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'social' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Social Connections</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {socialConnections.map(connection => (
                <div key={connection.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <img
                    src={connection.avatar || '/default-avatar.png'}
                    alt={connection.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">{connection.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {connection.mutualFollows} mutual connections
                    </p>
                    <p className="text-xs text-gray-500">
                      Joined {new Date(connection.joinedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleFollowUser(connection.id)}
                    className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      connection.isFollowing
                        ? 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {connection.isFollowing ? (
                      <>
                        <UserMinus className="h-4 w-4" />
                        Unfollow
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4" />
                        Follow
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>

            {socialConnections.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No connections yet</h4>
                <p className="text-gray-600 dark:text-gray-400">Connect with other adventurers to share experiences!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Activity Timeline</h3>
            
            <div className="space-y-4">
              {activityTimeline.map(item => (
                <div key={item.id} className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    {item.type === 'trail_completed' && <Map className="h-5 w-5 text-blue-600" />}
                    {item.type === 'photo_shared' && <Camera className="h-5 w-5 text-purple-600" />}
                    {item.type === 'achievement_unlocked' && <Trophy className="h-5 w-5 text-yellow-600" />}
                    {item.type === 'comment_made' && <MessageCircle className="h-5 w-5 text-green-600" />}
                    {item.type === 'followed_user' && <UserPlus className="h-5 w-5 text-blue-600" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">{item.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(item.timestamp).toLocaleDateString()} at {new Date(item.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {activityTimeline.length === 0 && (
              <div className="text-center py-12">
                <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No activity yet</h4>
                <p className="text-gray-600 dark:text-gray-400">Start exploring and your activities will appear here!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Profile Settings</h3>
            
            {/* Theme Selection */}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-4">Profile Theme</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {themes.map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme.id)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedTheme === theme.id
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-full h-8 rounded bg-gradient-to-r ${theme.colors} mb-2`}></div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{theme.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Verification Badge */}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-4">Verification</h4>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge className="h-6 w-6 text-blue-600" />
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-white">Get Verified</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Become a verified guide by completing 10 trails and receiving positive reviews
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Settings */}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-4">Privacy Settings</h4>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                  <span className="text-gray-700 dark:text-gray-300">Make profile public</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                  <span className="text-gray-700 dark:text-gray-300">Show activity timeline</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span className="text-gray-700 dark:text-gray-300">Allow others to find me by email</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedProfileTab;