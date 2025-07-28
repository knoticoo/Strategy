import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUser } from '../contexts/UserContext';
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
  Settings,
  LogOut,
  Map
} from 'lucide-react';

interface LocalAppUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  location?: string;
  joinDate: string;
  stats: {
    trailsCompleted: number;
    photosShared: number;
    points: number;
    level: number;
  };
}

const AuthTab: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser, isLoggedIn, login, logout } = useUser();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      // Mock login
      const mockUser = {
        id: '1',
        name: formData.name || 'Adventure Explorer',
        email: formData.email,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face',
        location: 'Riga, Latvia',
        joinDate: '2024-01-15',
        stats: {
          trailsCompleted: 12,
          photosShared: 45,
          points: 1250,
          level: 5
        }
      };
      login(mockUser);
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

  const handleLogout = () => {
    logout();
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      location: ''
    });
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const avatarUrl = event.target?.result as string;
        if (currentUser) {
          const updatedUser = { ...currentUser, avatar: avatarUrl };
          login(updatedUser); // This will update the user in context
        }
      };
      reader.readAsDataURL(file);
    }
  };

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

        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face'}
                alt={currentUser.name}
                className="w-24 h-24 rounded-full border-4 border-green-500 object-cover"
              />
              <label className="absolute bottom-0 right-0 p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors cursor-pointer">
                <Camera className="h-4 w-4" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
              </label>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {currentUser.name}
              </h3>
              <div className="space-y-2 text-gray-600 dark:text-gray-400">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{currentUser.email}</span>
                </div>
                {currentUser.location && (
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{currentUser.location}</span>
                  </div>
                )}
                <div className="text-sm">
                  Member since {new Date(currentUser.joinDate).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Edit Profile
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-center">
            <Map className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {currentUser.stats.trailsCompleted}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Trails Completed
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center">
            <Camera className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {currentUser.stats.photosShared}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Photos Shared
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 text-center">
            <Trophy className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {currentUser.stats.points}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Points Earned
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 text-center">
            <Heart className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              Level {currentUser.stats.level}
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
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                <Map className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-white">
                  Completed Gauja National Park Trail
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  2 days ago • +150 points
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <Camera className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-white">
                  Shared 5 photos from Turaida Castle
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  1 week ago • +50 points
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                <Trophy className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-white">
                  Reached Level 5 - Trail Master
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  2 weeks ago • Achievement unlocked
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
};

export default AuthTab;