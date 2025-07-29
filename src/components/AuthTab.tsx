import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useUser } from '../contexts/UserContext';
import * as api from '../services/api';
import {
  LogIn,
  UserPlus,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  MapPin,
  Camera,
  Trophy,
  Heart,
  LogOut,
  Map,
  Shield,
  Users,
  BarChart3,
  Edit,
  Trash2,
  Plus,
  Save,
  X,
  Star,
  Activity,
  TrendingUp,
  UserCheck,
  BookOpen
} from 'lucide-react';



const AuthTab: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser, isLoggedIn, login, logout } = useUser();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [activeSection, setActiveSection] = useState<'profile' | 'favorites' | 'progress' | 'admin'>('profile');
  const [adminTab, setAdminTab] = useState<'trails' | 'users' | 'stats' | 'education'>('trails');
  const [editingTrail, setEditingTrail] = useState<any>(null);
  const [showAddTrail, setShowAddTrail] = useState(false);
  const [trails, setTrails] = useState<api.ApiTrail[]>([]);
  const [users, setUsers] = useState<api.ApiUser[]>([]);
  const [stats, setStats] = useState<api.ApiStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    location: '',
    country: '',
    bio: '',
    interests: '',
    avatar: ''
  });
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: ''
  });

  // Check if user is admin (for demo, admin email)
  const isAdmin = currentUser?.email === 'emalinovskis@me.com' || currentUser?.name === 'Admin';

  // Load data from database
  useEffect(() => {
    console.log('Admin check - currentUser:', currentUser);
    console.log('Admin check - isAdmin:', isAdmin);
    if (isAdmin) {
      console.log('Loading admin data...');
      loadTrails();
      loadUsers();
      loadStats();
      loadRecentActivity();
    }
  }, [isAdmin, currentUser]);

  const loadTrails = async () => {
    try {
      const trailsData = await api.getTrails();
      setTrails(trailsData);
    } catch (error) {
      console.error('Error loading trails:', error);
    }
  };

  const loadUsers = async () => {
    try {
      console.log('Loading users from API...');
      const usersData = await api.getUsers();
      console.log('Loaded users:', usersData);
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadStats = async () => {
    try {
      console.log('Loading stats from API...');
      const statsData = await api.getStats();
      console.log('Loaded stats:', statsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadRecentActivity = async () => {
    try {
      const activityData = await api.getRecentActivity();
      setRecentActivity(activityData);
    } catch (error) {
      console.error('Error loading recent activity:', error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await api.deleteCommunityPost(postId);
      await loadRecentActivity(); // Reload the posts
      alert('Post deleted successfully');
    } catch (error: any) {
      console.error('Error deleting post:', error);
      alert('Error deleting post: ' + (error.message || 'Unknown error'));
    }
  };

  // Admin Functions
  const handleDeleteTrail = async (trailId: string) => {
    if (window.confirm('Are you sure you want to delete this trail?')) {
      try {
        await api.deleteTrail(trailId);
        setTrails(trails.filter(trail => trail.id !== trailId));
      } catch (error) {
        console.error('Error deleting trail:', error);
        alert('Error deleting trail');
      }
    }
  };

  const handleEditTrail = (trail: any) => {
    setEditingTrail({...trail});
  };

  const handleSaveTrail = async () => {
    try {
      if (editingTrail.id) {
        // Update existing trail
        await api.updateTrail(editingTrail.id, {
          name_en: editingTrail.name_en,
          name_lv: editingTrail.name_lv,
          name_ru: editingTrail.name_ru,
          description_en: editingTrail.description_en,
          description_lv: editingTrail.description_lv,
          description_ru: editingTrail.description_ru,
          region: editingTrail.region,
          difficulty: editingTrail.difficulty,
          distance: editingTrail.distance,
          duration: editingTrail.duration,
          elevation_gain: editingTrail.elevation,
          latitude: editingTrail.latitude,
          longitude: editingTrail.longitude,
          image_url: editingTrail.image_url,
          features: editingTrail.features,
          accessibility: editingTrail.accessibility,
          best_time_to_visit: editingTrail.best_time_to_visit,
          trail_condition: editingTrail.trail_condition,
          parking_available: editingTrail.parking_available,
          guided_tours_available: editingTrail.guided_tours_available,
          free_entry: editingTrail.free_entry,
          adult_price: editingTrail.adult_price,
          child_price: editingTrail.child_price,
          contact_phone: editingTrail.contact_phone,
          contact_email: editingTrail.contact_email,
          contact_website: editingTrail.contact_website
        });
        await loadTrails(); // Reload trails
      } else {
        // Add new trail
        await api.createTrail({
          name_en: editingTrail.name_en,
          name_lv: editingTrail.name_lv,
          name_ru: editingTrail.name_ru,
          description_en: editingTrail.description_en,
          description_lv: editingTrail.description_lv,
          description_ru: editingTrail.description_ru,
          region: editingTrail.region,
          difficulty: editingTrail.difficulty,
          distance: editingTrail.distance,
          duration: editingTrail.duration,
          elevation_gain: editingTrail.elevation,
          latitude: editingTrail.latitude,
          longitude: editingTrail.longitude,
          image_url: editingTrail.image_url,
          features: editingTrail.features,
          accessibility: editingTrail.accessibility,
          best_time_to_visit: editingTrail.best_time_to_visit,
          trail_condition: editingTrail.trail_condition,
          parking_available: editingTrail.parking_available,
          guided_tours_available: editingTrail.guided_tours_available,
          free_entry: editingTrail.free_entry,
          adult_price: editingTrail.adult_price,
          child_price: editingTrail.child_price,
          contact_phone: editingTrail.contact_phone,
          contact_email: editingTrail.contact_email,
          contact_website: editingTrail.contact_website
        });
        await loadTrails(); // Reload trails
      }
      setEditingTrail(null);
      setShowAddTrail(false);
    } catch (error) {
      console.error('Error saving trail:', error);
      alert('Error saving trail');
    }
  };

  const handleAddNewTrail = () => {
    setEditingTrail({
      name_en: '',
      name_lv: '',
      name_ru: '',
      description_en: '',
      description_lv: '',
      description_ru: '',
      region: '',
      difficulty: 'easy',
      distance: '',
      duration: '',
      elevation: '',
      latitude: 0,
      longitude: 0,
      image_url: '',
      features: [],
      accessibility: '',
      best_time_to_visit: '',
      trail_condition: 'good',
      parking_available: true,
      guided_tours_available: false,
      free_entry: true,
      adult_price: 0,
      child_price: 0,
      contact_phone: '',
      contact_email: '',
      contact_website: ''
    });
    setShowAddTrail(true);
  };

  // File upload functions
  const handleFileUpload = async (file: File): Promise<string> => {
    setIsUploading(true);
    try {
      console.log('Uploading file:', file.name, file.size, file.type);
      const response = await api.uploadFile(file);
      console.log('Upload response:', response);
      return response.url;
    } catch (error: any) {
      console.error('Error uploading file:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Unknown upload error';
      alert(`Upload failed: ${errorMessage}`);
      return '';
    } finally {
      setIsUploading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && currentUser) {
      console.log('Starting avatar upload for user:', currentUser.id);
      const avatarUrl = await handleFileUpload(file);
      if (avatarUrl) {
        try {
          console.log('Updating user avatar with URL:', avatarUrl);
          await api.updateUser(currentUser.id, { 
            name: currentUser.name, // Required field
            email: currentUser.email, // Required field
            avatar_url: avatarUrl 
          });
          // Update current user context
          const updatedUser = { ...currentUser, avatar: avatarUrl };
          login(updatedUser);
          console.log('Avatar updated successfully');
          alert('Avatar updated successfully!');
        } catch (error: any) {
          console.error('Error updating avatar:', error);
          const errorMessage = error.response?.data?.error || error.message || 'Unknown error';
          alert(`Error updating avatar: ${errorMessage}`);
        }
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = await handleFileUpload(file);
      if (imageUrl) {
        setEditingTrail({
          ...editingTrail,
          image_url: imageUrl
        });
      }
    }
  };

  const handleResetUserStats = () => {
    if (window.confirm('Are you sure you want to reset all user stats? This will clear localStorage data.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleEditProfile = () => {
    if (currentUser) {
      setProfileData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        location: currentUser.location || '',
        country: (currentUser as any).country || '',
        bio: (currentUser as any).bio || '',
        interests: (currentUser as any).interests || '',
        avatar: currentUser.avatar || ''
      });
      setIsEditingProfile(true);
    }
  };

  const handleSaveProfile = async () => {
    if (currentUser) {
      try {
        await api.updateUser(currentUser.id, {
          name: profileData.name,
          email: profileData.email,
          location: profileData.location,
          country: profileData.country,
          bio: profileData.bio,
          interests: profileData.interests,
          avatar_url: profileData.avatar
        });
        
        const updatedUser = {
          ...currentUser,
          name: profileData.name,
          email: profileData.email,
          location: profileData.location,
          country: profileData.country,
          bio: profileData.bio,
          interests: profileData.interests,
          avatar: profileData.avatar
        };
        login(updatedUser);
        setIsEditingProfile(false);
      } catch (error) {
        console.error('Error updating profile:', error);
        alert('Error updating profile');
      }
    }
  };

  const handleCancelEditProfile = () => {
    setIsEditingProfile(false);
    setProfileData({
      name: '',
      email: '',
      location: '',
      country: '',
      bio: '',
      interests: '',
      avatar: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      try {
        console.log('Attempting login with:', formData.email);
        const response = await api.login(formData.email, formData.password);
        console.log('Login response:', response);
        
        // Ensure user has proper structure
        const user = {
          ...response.user,
          avatar: response.user.avatar || response.user.avatar_url,
          joinDate: response.user.joinDate || response.user.created_at
        };
        
        login(user);
        console.log('User logged in successfully:', user);
        
        // Clear form
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          location: ''
        });
        
        // Force reload stats if admin
        if (user.isAdmin) {
          setTimeout(() => {
            loadStats();
            loadUsers();
            loadTrails();
            loadRecentActivity();
          }, 500);
        }
      } catch (error: any) {
        console.error('Login error:', error);
        alert(`Login failed: ${error.response?.data?.error || error.message || 'Unknown error'}`);
        return;
      }
    } else {
      // Mock registration
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match!');
        return;
      }
      const newUser = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        location: formData.location,
        joinDate: new Date().toISOString().split('T')[0],
        stats: {
          trailsCompleted: 0,
          photosShared: 0,
          points: 0,
          level: 1
        }
      };
      login(newUser);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Reset form and switch to login mode
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        location: ''
      });
      setIsLogin(true); // Switch back to login form
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Render Functions
  const renderProfileSection = () => (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        {!isEditingProfile ? (
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face'}
                alt={currentUser?.name}
                className="w-24 h-24 rounded-full border-4 border-green-500 object-cover"
              />
              <label className="absolute bottom-0 right-0 p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors cursor-pointer">
                <Camera className="h-4 w-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {currentUser?.name}
                </h3>
                <button
                  onClick={handleEditProfile}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit Profile
                </button>
              </div>
              
              <div className="space-y-2 text-gray-600 dark:text-gray-400">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{currentUser?.email}</span>
                </div>
                {currentUser?.location && (
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{currentUser.location}</span>
                  </div>
                )}
                {(currentUser as any)?.country && (
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <span className="text-sm">🌍 {(currentUser as any).country}</span>
                  </div>
                )}
                {(currentUser as any)?.bio && (
                  <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm">{(currentUser as any).bio}</p>
                  </div>
                )}
                {(currentUser as any)?.interests && (
                  <div className="mt-2">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Interests:</div>
                    <div className="flex flex-wrap gap-1">
                      {(currentUser as any).interests.split(',').map((interest: string, index: number) => (
                        <span key={index} className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full">
                          {interest.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="text-sm">
                  Member since {new Date(currentUser?.joinDate || '').toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Profile Edit Form */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Profile</h3>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveProfile}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancelEditProfile}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location (City)
                </label>
                <input
                  type="text"
                  value={profileData.location}
                  onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                  placeholder="e.g., Riga"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  value={profileData.country}
                  onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
                  placeholder="e.g., Latvia"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Avatar
                </label>
                <div className="space-y-3">
                  <input
                    type="url"
                    value={profileData.avatar}
                    onChange={(e) => setProfileData({ ...profileData, avatar: e.target.value })}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <div className="text-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">or upload from device</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={isUploading}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-300"
                  />
                  {isUploading && (
                    <div className="text-sm text-blue-600 dark:text-blue-400 text-center">
                      Uploading image...
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Interests (comma-separated)
                </label>
                <input
                  type="text"
                  value={profileData.interests}
                  onChange={(e) => setProfileData({ ...profileData, interests: e.target.value })}
                  placeholder="e.g., Hiking, Photography, Nature"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bio / About Me
              </label>
              <textarea
                rows={4}
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                placeholder="Tell us about yourself, your adventure experience, and what you love about exploring Latvia..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-center">
          <Map className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {currentUser?.stats.trailsCompleted}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Trails Completed
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center">
          <Camera className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {currentUser?.stats.photosShared}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Photos Shared
          </div>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 text-center">
          <Trophy className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {currentUser?.stats.points}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Points Earned
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 text-center">
          <Heart className="h-8 w-8 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            Level {currentUser?.stats.level}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Current Level
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Recent Activity
        </h3>
        {currentUser && currentUser.stats.points > 0 ? (
          <div className="space-y-4">
            {currentUser.stats.photosShared > 0 && (
              <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <Camera className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">
                    Shared {currentUser.stats.photosShared} adventure photo{currentUser.stats.photosShared > 1 ? 's' : ''}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    +{currentUser.stats.photosShared * 10} points earned
                  </div>
                </div>
              </div>
            )}
            
            {currentUser.stats.level > 1 && (
              <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">
                    Reached Level {currentUser.stats.level}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Milestone achieved!
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <Trophy className="h-12 w-12 mx-auto" />
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Start your adventure journey! Share photos and complete activities to see your progress here.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  // Render Favorites Section
  const renderFavoritesSection = () => (
    <div className="space-y-6">
      <div className="text-center py-8">
        <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Your Favorite Adventures
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Save trails, camping spots, and fishing locations to access them quickly later.
        </p>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          💡 Tip: Click the heart icon on any location to add it to your favorites!
        </div>
      </div>
    </div>
  );

  // Render Progress Section
  const renderProgressSection = () => (
    <div className="space-y-6">
      {/* Adventure Progress */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          🏆 Adventure Progress
        </h3>
        
        {/* Level Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Level {currentUser?.stats.level}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {currentUser?.stats.points}/100 XP
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(((currentUser?.stats.points || 0) / 100) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{currentUser?.stats.trailsCompleted}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Trails Completed</div>
          </div>
          <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{currentUser?.stats.photosShared}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Photos Shared</div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          🎖️ Achievements
        </h3>
        <div className="text-center py-8">
          <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Complete adventures and share photos to unlock achievements!
          </p>
        </div>
      </div>
    </div>
  );

  // Render Admin Section
  const renderAdminSection = () => (
    <div className="space-y-6">
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
          <Shield className="h-5 w-5" />
          <span className="font-semibold">Admin Panel</span>
        </div>
        <p className="text-red-700 dark:text-red-300 text-sm mt-1">
          You have administrative privileges. Handle with care!
        </p>
        <div className="text-xs text-red-600 dark:text-red-400 mt-2">
          Admin Access: emalinovskis@me.com / Millie1991
        </div>
        <button
          onClick={handleResetUserStats}
          className="mt-3 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
        >
          Reset All User Data
        </button>
      </div>

      {/* Admin Navigation */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
        <button
          onClick={() => setAdminTab('trails')}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            adminTab === 'trails'
              ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Map className="h-4 w-4 inline-block mr-2" />
          Trails
        </button>
        <button
          onClick={() => setAdminTab('users')}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            adminTab === 'users'
              ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Users className="h-4 w-4 inline-block mr-2" />
          Users
        </button>
        <button
          onClick={() => setAdminTab('stats')}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            adminTab === 'stats'
              ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <BarChart3 className="h-4 w-4 inline-block mr-2" />
          Statistics
        </button>
        <button
          onClick={() => setAdminTab('education')}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            adminTab === 'education'
              ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <BookOpen className="h-4 w-4 inline-block mr-2" />
          Education
        </button>
      </div>

      {/* Admin Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        {adminTab === 'trails' && renderTrailsAdmin()}
        {adminTab === 'users' && renderUsersAdmin()}
        {adminTab === 'stats' && renderStatsAdmin()}
        {adminTab === 'education' && renderEducationAdmin()}
      </div>
    </div>
  );

  // Render Trails Admin
  const renderTrailsAdmin = () => (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Trail Management
        </h3>
        <button
          onClick={handleAddNewTrail}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Trail
        </button>
      </div>

      {/* Trail List */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {trails.map((trail) => (
          <div key={trail.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {trail.name_en}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {trail.region} • {trail.difficulty} • {trail.distance}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(() => {
                    try {
                      const features = trail.features ? JSON.parse(trail.features) : [];
                      return Array.isArray(features) ? features.slice(0, 3).map((feature: string, index: number) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-xs rounded-full"
                        >
                          {feature}
                        </span>
                      )) : [];
                    } catch (error) {
                      console.error('Error parsing trail features:', error, trail.features);
                      return [];
                    }
                  })()}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditTrail(trail)}
                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteTrail(trail.id)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit/Add Trail Modal */}
      {(editingTrail || showAddTrail) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {editingTrail?.id ? 'Edit Trail' : 'Add New Trail'}
                </h3>
                <button
                  onClick={() => {
                    setEditingTrail(null);
                    setShowAddTrail(false);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {/* Basic Information */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Basic Information</h4>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Trail Name (English)
                      </label>
                      <input
                        type="text"
                        value={typeof editingTrail?.name === 'string' ? editingTrail.name : ((editingTrail?.name as any)?.en || '')}
                        onChange={(e) => setEditingTrail({
                          ...editingTrail,
                          name: typeof editingTrail?.name === 'string' 
                            ? e.target.value 
                            : { ...(editingTrail.name as any), en: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Trail Name (Latvian)
                      </label>
                      <input
                        type="text"
                        value={((editingTrail?.name as any)?.lv || '')}
                        onChange={(e) => setEditingTrail({
                          ...editingTrail,
                          name: { ...(editingTrail.name as any), lv: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Trail Name (Russian)
                      </label>
                      <input
                        type="text"
                        value={((editingTrail?.name as any)?.ru || '')}
                        onChange={(e) => setEditingTrail({
                          ...editingTrail,
                          name: { ...(editingTrail.name as any), ru: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description (English)
                      </label>
                      <textarea
                        rows={3}
                        value={((editingTrail?.description as any)?.en || '')}
                        onChange={(e) => setEditingTrail({
                          ...editingTrail,
                          description: { ...(editingTrail.description as any), en: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description (Latvian)
                      </label>
                      <textarea
                        rows={3}
                        value={((editingTrail?.description as any)?.lv || '')}
                        onChange={(e) => setEditingTrail({
                          ...editingTrail,
                          description: { ...(editingTrail.description as any), lv: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description (Russian)
                      </label>
                      <textarea
                        rows={3}
                        value={((editingTrail?.description as any)?.ru || '')}
                        onChange={(e) => setEditingTrail({
                          ...editingTrail,
                          description: { ...(editingTrail.description as any), ru: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Location & Details */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Location & Details</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Region
                      </label>
                      <input
                        type="text"
                        value={editingTrail?.region || ''}
                        onChange={(e) => setEditingTrail({
                          ...editingTrail,
                          region: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Difficulty
                      </label>
                      <select
                        value={editingTrail?.difficulty || 'easy'}
                        onChange={(e) => setEditingTrail({
                          ...editingTrail,
                          difficulty: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="easy">Easy</option>
                        <option value="moderate">Moderate</option>
                        <option value="hard">Hard</option>
                        <option value="expert">Expert</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Distance
                      </label>
                      <input
                        type="text"
                        value={editingTrail?.distance || ''}
                        onChange={(e) => setEditingTrail({
                          ...editingTrail,
                          distance: e.target.value
                        })}
                        placeholder="e.g., 5.2 km"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Duration
                      </label>
                      <input
                        type="text"
                        value={editingTrail?.duration || ''}
                        onChange={(e) => setEditingTrail({
                          ...editingTrail,
                          duration: e.target.value
                        })}
                        placeholder="e.g., 2-3 hours"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Elevation Gain
                      </label>
                      <input
                        type="text"
                        value={editingTrail?.elevation || ''}
                        onChange={(e) => setEditingTrail({
                          ...editingTrail,
                          elevation: e.target.value
                        })}
                        placeholder="e.g., 150m"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Best Time to Visit
                      </label>
                      <input
                        type="text"
                        value={editingTrail?.bestTimeToVisit || ''}
                        onChange={(e) => setEditingTrail({
                          ...editingTrail,
                          bestTimeToVisit: e.target.value
                        })}
                        placeholder="e.g., May - September"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Latitude
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={editingTrail?.coordinates?.lat || ''}
                        onChange={(e) => setEditingTrail({
                          ...editingTrail,
                          coordinates: { 
                            ...editingTrail.coordinates, 
                            lat: parseFloat(e.target.value) || 0 
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Longitude
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={editingTrail?.coordinates?.lng || ''}
                        onChange={(e) => setEditingTrail({
                          ...editingTrail,
                          coordinates: { 
                            ...editingTrail.coordinates, 
                            lng: parseFloat(e.target.value) || 0 
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Media & Features */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Media & Features</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Trail Image
                      </label>
                      <div className="space-y-3">
                        <input
                          type="url"
                          value={editingTrail?.image_url || ''}
                          onChange={(e) => setEditingTrail({
                            ...editingTrail,
                            image_url: e.target.value
                          })}
                          placeholder="https://example.com/trail-image.jpg"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        <div className="text-center">
                          <span className="text-sm text-gray-500 dark:text-gray-400">or upload from device</span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={isUploading}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-300"
                        />
                        {isUploading && (
                          <div className="text-sm text-blue-600 dark:text-blue-400 text-center">
                            Uploading image...
                          </div>
                        )}
                        {editingTrail?.image_url && (
                          <div className="mt-2">
                            <img
                              src={editingTrail.image_url}
                              alt="Trail preview"
                              className="w-full h-32 object-cover rounded-lg"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Features (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={editingTrail?.features?.join(', ') || ''}
                        onChange={(e) => setEditingTrail({
                          ...editingTrail,
                          features: e.target.value.split(',').map(f => f.trim()).filter(f => f)
                        })}
                        placeholder="e.g., Scenic views, Wildlife, Historical sites"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Accessibility Information
                      </label>
                      <textarea
                        rows={2}
                        value={editingTrail?.accessibility || ''}
                        onChange={(e) => setEditingTrail({
                          ...editingTrail,
                          accessibility: e.target.value
                        })}
                        placeholder="e.g., Wheelchair accessible, Family-friendly"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Services & Contact */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Services & Contact</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editingTrail?.parkingAvailable || false}
                        onChange={(e) => setEditingTrail({
                          ...editingTrail,
                          parkingAvailable: e.target.checked
                        })}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <label className="text-sm text-gray-700 dark:text-gray-300">
                        Parking Available
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editingTrail?.guidedToursAvailable || false}
                        onChange={(e) => setEditingTrail({
                          ...editingTrail,
                          guidedToursAvailable: e.target.checked
                        })}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <label className="text-sm text-gray-700 dark:text-gray-300">
                        Guided Tours Available
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editingTrail?.pricing?.free || false}
                        onChange={(e) => setEditingTrail({
                          ...editingTrail,
                          pricing: { ...editingTrail.pricing, free: e.target.checked }
                        })}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <label className="text-sm text-gray-700 dark:text-gray-300">
                        Free Entry
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Trail Condition
                      </label>
                      <select
                        value={editingTrail?.trailCondition || 'good'}
                        onChange={(e) => setEditingTrail({
                          ...editingTrail,
                          trailCondition: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="excellent">Excellent</option>
                        <option value="good">Good</option>
                        <option value="fair">Fair</option>
                        <option value="poor">Poor</option>
                      </select>
                    </div>
                  </div>

                  {!editingTrail?.pricing?.free && (
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Adult Price (€)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={editingTrail?.pricing?.adult || ''}
                          onChange={(e) => setEditingTrail({
                            ...editingTrail,
                            pricing: { ...editingTrail.pricing, adult: parseFloat(e.target.value) || 0 }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Child Price (€)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={editingTrail?.pricing?.child || ''}
                          onChange={(e) => setEditingTrail({
                            ...editingTrail,
                            pricing: { ...editingTrail.pricing, child: parseFloat(e.target.value) || 0 }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                  )}

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={editingTrail?.contact?.phone || ''}
                        onChange={(e) => setEditingTrail({
                          ...editingTrail,
                          contact: { ...editingTrail.contact, phone: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={editingTrail?.contact?.email || ''}
                        onChange={(e) => setEditingTrail({
                          ...editingTrail,
                          contact: { ...editingTrail.contact, email: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Website
                      </label>
                      <input
                        type="url"
                        value={editingTrail?.contact?.website || ''}
                        onChange={(e) => setEditingTrail({
                          ...editingTrail,
                          contact: { ...editingTrail.contact, website: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleSaveTrail}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    Save Trail
                  </button>
                  <button
                    onClick={() => {
                      setEditingTrail(null);
                      setShowAddTrail(false);
                    }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Render Users Admin
  const renderUsersAdmin = () => (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        User Management
      </h3>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
              <UserCheck className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{stats?.onlineUsers || 0}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Online Now</div>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{stats?.totalUsers || 0}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Users</div>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/40 rounded-lg">
              <Activity className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {stats?.onlineUsers || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Online Users</div>
            </div>
          </div>
        </div>
      </div>

      {/* User List */}
      <div className="space-y-3">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="relative">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {user.name.charAt(0)}
                  </div>
                )}
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${
                  Math.random() > 0.5 ? 'bg-green-500' : 'bg-gray-400'
                }`}></div>
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{user.email}</div>
                {user.location && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">{user.location}, {user.country}</div>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className={`text-sm font-medium ${
                Math.random() > 0.5 ? 'text-green-600' : 'text-gray-500'
              }`}>
                {Math.random() > 0.5 ? 'Online' : 'Offline'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Joined: {new Date(user.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render Stats Admin
  const renderStatsAdmin = () => (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Platform Statistics
      </h3>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">{trails.length}</div>
              <div className="text-green-100">Total Trails</div>
            </div>
            <Map className="h-8 w-8 text-green-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">{users.length}</div>
              <div className="text-blue-100">Registered Users</div>
            </div>
            <Users className="h-8 w-8 text-blue-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">1.2k</div>
              <div className="text-purple-100">Monthly Visits</div>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">4.8</div>
              <div className="text-orange-100">Avg. Rating</div>
            </div>
            <Star className="h-8 w-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Community Posts Management */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Community Posts</h4>
        <div className="space-y-3">
          {recentActivity.length > 0 ? (
            recentActivity.map((post, index) => (
              <div key={post.id || index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-600 rounded-lg">
                <div className="flex items-center gap-3">
                  <img
                    src={post.user_avatar || '/default-avatar.png'}
                    alt={post.user_name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{post.user_name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {post.content.substring(0, 100)}...
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(post.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeletePost(post.id)}
                  className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <div className="text-gray-500 dark:text-gray-400 text-sm">
              No posts found
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h4>
        <div className="space-y-3">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity, index) => (
              <div key={activity.id || index} className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400">
                  {activity.user_name} posted: "{activity.content.substring(0, 50)}..."
                </span>
                <span className="text-gray-500 dark:text-gray-500 ml-auto">
                  {new Date(activity.created_at).toLocaleDateString()}
                </span>
              </div>
            ))
          ) : (
            <div className="text-gray-500 dark:text-gray-400 text-sm">
              No recent activity
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Main component logic
  if (isLoggedIn && currentUser) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            👤 {t('auth.profile')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back, {currentUser.name}!
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveSection('profile')}
              className={`px-6 py-3 font-medium text-sm rounded-t-xl transition-colors ${
                activeSection === 'profile'
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <User className="h-4 w-4 inline-block mr-2" />
              Profile
            </button>
            <button
              onClick={() => setActiveSection('favorites')}
              className={`px-6 py-3 font-medium text-sm rounded-t-xl transition-colors ${
                activeSection === 'favorites'
                  ? 'bg-pink-50 dark:bg-pink-900/20 text-pink-600 border-b-2 border-pink-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Heart className="h-4 w-4 inline-block mr-2" />
              Favorites
            </button>
            <button
              onClick={() => setActiveSection('progress')}
              className={`px-6 py-3 font-medium text-sm rounded-t-xl transition-colors ${
                activeSection === 'progress'
                  ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 border-b-2 border-yellow-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Trophy className="h-4 w-4 inline-block mr-2" />
              Progress
            </button>
            {isAdmin && (
              <button
                onClick={() => setActiveSection('admin')}
                className={`px-6 py-3 font-medium text-sm rounded-t-xl transition-colors ${
                  activeSection === 'admin'
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600 border-b-2 border-red-600'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Shield className="h-4 w-4 inline-block mr-2" />
                Admin Panel
              </button>
            )}
          </div>

          <div className="p-6">
            {activeSection === 'profile' && renderProfileSection()}
            {activeSection === 'favorites' && renderFavoritesSection()}
            {activeSection === 'progress' && renderProgressSection()}
            {activeSection === 'admin' && isAdmin && renderAdminSection()}
          </div>
        </div>

        {/* Logout Button */}
        <div className="text-center">
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    );
  }

  // Render Auth Form
  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {isLogin ? '🔐 ' + t('auth.login') : '📝 ' + t('auth.register')}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {isLogin ? t('auth.loginSubtitle') : t('auth.registerSubtitle')}
        </p>
      </div>

      {/* Auth Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <User className="h-4 w-4 inline mr-2" />
                {t('auth.name')}
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter your name"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Mail className="h-4 w-4 inline mr-2" />
              {t('auth.email')}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Lock className="h-4 w-4 inline mr-2" />
              {t('auth.password')}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Lock className="h-4 w-4 inline mr-2" />
                  {t('auth.confirmPassword')}
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Confirm your password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <MapPin className="h-4 w-4 inline mr-2" />
                  {t('auth.location')} (Optional)
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., Riga, Latvia"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
          >
            {isLogin ? <LogIn className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
            {isLogin ? t('auth.loginButton') : t('auth.registerButton')}
          </button>
        </form>

        {/* Switch Mode */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            {isLogin ? t('auth.noAccount') : t('auth.hasAccount')}
          </p>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="mt-2 text-green-600 hover:text-green-700 font-medium"
          >
            {isLogin ? t('auth.registerLink') : t('auth.loginLink')}
          </button>
        </div>

        {/* Debug API Test Button */}
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={async () => {
              try {
                console.log('Testing API connection...');
                const stats = await api.getStats();
                console.log('API Stats:', stats);
                alert(`API Working! Online users: ${stats.onlineUsers}, Total users: ${stats.totalUsers}`);
              } catch (error: any) {
                console.error('API Test failed:', error);
                alert(`API Test failed: ${error.message}`);
              }
            }}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            🧪 Test API Connection
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('auth.features')}
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Trophy className="h-5 w-5 text-yellow-600" />
            <span className="text-gray-700 dark:text-gray-300">
              Earn points and level up
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Camera className="h-5 w-5 text-blue-600" />
            <span className="text-gray-700 dark:text-gray-300">
              Share photos and experiences
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Heart className="h-5 w-5 text-red-600" />
            <span className="text-gray-700 dark:text-gray-300">
              Save favorite trails
            </span>
          </div>
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-green-600" />
            <span className="text-gray-700 dark:text-gray-300">
              Connect with other adventurers
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  // Render Education Admin
  const renderEducationAdmin = () => (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Educational Content Management
        </h3>
        <button
          onClick={() => {
            // TODO: Add new educational content
            alert('Add new educational content - Feature coming soon!');
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Content
        </button>
      </div>

      {/* Education Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {[
          { id: 'nature', name: 'Nature Education', count: 12, color: 'bg-green-100 text-green-800' },
          { id: 'history', name: 'Historical Sites', count: 8, color: 'bg-amber-100 text-amber-800' },
          { id: 'culture', name: 'Cultural Heritage', count: 6, color: 'bg-purple-100 text-purple-800' },
          { id: 'photography', name: 'Photography', count: 15, color: 'bg-blue-100 text-blue-800' },
          { id: 'survival', name: 'Survival Skills', count: 10, color: 'bg-red-100 text-red-800' }
        ].map(category => (
          <div key={category.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900 dark:text-white">
                {category.name}
              </h4>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${category.color}`}>
                {category.count} items
              </span>
            </div>
            <div className="flex gap-2">
              <button className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                Manage
              </button>
              <button className="text-xs px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                Add New
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Content */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 dark:text-white mb-4">
          Recent Educational Content
        </h4>
        <div className="space-y-3">
          {[
            { title: 'Identifying Baltic Flora: Common Trees and Plants', category: 'Nature', status: 'Published', views: 1247 },
            { title: 'Medieval Castles and Their Stories', category: 'History', status: 'Draft', views: 0 },
            { title: 'Golden Hour Photography in Baltic Forests', category: 'Photography', status: 'Published', views: 2341 },
            { title: 'Essential Wilderness Survival Skills', category: 'Survival', status: 'Review', views: 567 }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
              <div className="flex-1">
                <h5 className="font-medium text-gray-900 dark:text-white text-sm">
                  {item.title}
                </h5>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {item.category} • {item.views} views
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.status === 'Published' ? 'bg-green-100 text-green-800' :
                  item.status === 'Draft' ? 'bg-gray-100 text-gray-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {item.status}
                </span>
                <button className="text-gray-400 hover:text-blue-600 p-1">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="text-gray-400 hover:text-red-600 p-1">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Total Content</span>
          </div>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">51</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-800 dark:text-green-200">Total Views</span>
          </div>
          <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">12.4K</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-800 dark:text-purple-200">Completions</span>
          </div>
          <p className="text-2xl font-bold text-purple-900 dark:text-purple-100 mt-1">3.2K</p>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-orange-600" />
            <span className="text-sm font-medium text-orange-800 dark:text-orange-200">Avg Rating</span>
          </div>
          <p className="text-2xl font-bold text-orange-900 dark:text-orange-100 mt-1">4.7</p>
        </div>
      </div>
    </div>
  );
};

export default AuthTab;