import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUser } from '../contexts/UserContext';
import { realLatvianTrails } from '../data/realLatvianData';
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
  UserCheck
} from 'lucide-react';



const AuthTab: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser, isLoggedIn, login, logout } = useUser();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [activeSection, setActiveSection] = useState<'profile' | 'favorites' | 'progress' | 'admin'>('profile');
  const [adminTab, setAdminTab] = useState<'trails' | 'users' | 'stats'>('trails');
  const [editingTrail, setEditingTrail] = useState<any>(null);
  const [showAddTrail, setShowAddTrail] = useState(false);
  const [trails, setTrails] = useState(realLatvianTrails);
  const [mockUsers] = useState([
    { id: '1', name: 'Adventure Explorer', email: 'explorer@example.com', status: 'online', joinDate: '2024-01-15', lastActive: 'Now' },
    { id: '2', name: 'Nature Lover', email: 'nature@example.com', status: 'offline', joinDate: '2024-02-10', lastActive: '2 hours ago' },
    { id: '3', name: 'Trail Master', email: 'trails@example.com', status: 'online', joinDate: '2024-01-20', lastActive: 'Now' },
    { id: '4', name: 'Photo Hunter', email: 'photos@example.com', status: 'away', joinDate: '2024-03-05', lastActive: '30 minutes ago' },
  ]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: ''
  });

  // Check if user is admin (for demo, admin email)
  const isAdmin = currentUser?.email === 'admin@latvianadventures.com' || currentUser?.name === 'Admin';

  // Admin Functions
  const handleDeleteTrail = (trailId: string) => {
    if (window.confirm('Are you sure you want to delete this trail?')) {
      setTrails(trails.filter(trail => trail.id !== trailId));
    }
  };

  const handleEditTrail = (trail: any) => {
    setEditingTrail({...trail});
  };

  const handleSaveTrail = () => {
    if (editingTrail.id) {
      // Update existing trail
      setTrails(trails.map(trail => 
        trail.id === editingTrail.id ? editingTrail : trail
      ));
    } else {
      // Add new trail
      const newTrail = {
        ...editingTrail,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      setTrails([...trails, newTrail]);
    }
    setEditingTrail(null);
    setShowAddTrail(false);
  };

  const handleAddNewTrail = () => {
    setEditingTrail({
      name: { en: '', lv: '', ru: '' },
      description: { en: '', lv: '', ru: '' },
      region: '',
      difficulty: 'easy',
      distance: '',
      duration: '',
      elevation: '',
      coordinates: { lat: 0, lng: 0 },
      images: [''],
      features: [],
      pricing: { free: true, currency: 'EUR' },
      contact: { phone: '', website: '' }
    });
    setShowAddTrail(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      // Mock login - check for admin credentials
      const isAdminLogin = formData.email === 'admin@latvianadventures.com' || formData.name === 'Admin';
      const mockUser = {
        id: isAdminLogin ? 'admin' : '1',
        name: isAdminLogin ? 'Admin' : (formData.name || 'Adventure Explorer'),
        email: isAdminLogin ? 'admin@latvianadventures.com' : formData.email,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face',
        location: 'Riga, Latvia',
        joinDate: '2024-01-15',
        stats: {
          trailsCompleted: 0,
          photosShared: 0,
          points: 0,
          level: 1
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
        // In a real app, you would upload this to a server
        // For now, we'll just store it as a data URL
        console.log('Avatar uploaded:', event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Render Functions
  const renderProfileSection = () => (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
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
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {currentUser?.name}
            </h3>
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
              <div className="text-sm">
                Member since {new Date(currentUser?.joinDate || '').toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
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
      </div>

      {/* Admin Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        {adminTab === 'trails' && renderTrailsAdmin()}
        {adminTab === 'users' && renderUsersAdmin()}
        {adminTab === 'stats' && renderStatsAdmin()}
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
                  {typeof trail.name === 'string' ? trail.name : trail.name.en}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {trail.region} • {trail.difficulty} • {trail.distance}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {trail.features.slice(0, 3).map((feature, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-xs rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
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

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Trail Name (English)
                  </label>
                  <input
                    type="text"
                    value={typeof editingTrail?.name === 'string' ? editingTrail.name : (editingTrail?.name?.en || '')}
                    onChange={(e) => setEditingTrail({
                      ...editingTrail,
                      name: typeof editingTrail?.name === 'string' 
                        ? e.target.value 
                        : { ...editingTrail.name, en: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

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

                <div className="grid grid-cols-2 gap-4">
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
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={editingTrail?.images?.[0] || ''}
                    onChange={(e) => setEditingTrail({
                      ...editingTrail,
                      images: [e.target.value]
                    })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
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
              <div className="text-2xl font-bold text-green-600">{mockUsers.filter(u => u.status === 'online').length}</div>
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
              <div className="text-2xl font-bold text-blue-600">{mockUsers.length}</div>
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
                {mockUsers.filter(u => u.status !== 'offline').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Active Users</div>
            </div>
          </div>
        </div>
      </div>

      {/* User List */}
      <div className="space-y-3">
        {mockUsers.map((user) => (
          <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {user.name.charAt(0)}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${
                  user.status === 'online' ? 'bg-green-500' :
                  user.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                }`}></div>
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{user.email}</div>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-sm font-medium ${
                user.status === 'online' ? 'text-green-600' :
                user.status === 'away' ? 'text-yellow-600' : 'text-gray-500'
              }`}>
                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Last active: {user.lastActive}
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
              <div className="text-3xl font-bold">{mockUsers.length}</div>
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

      {/* Recent Activity */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">New user "Trail Explorer" registered</span>
            <span className="text-gray-500 dark:text-gray-500 ml-auto">2 min ago</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">Trail "Gauja National Park" was updated</span>
            <span className="text-gray-500 dark:text-gray-500 ml-auto">1 hour ago</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">5 new community posts created</span>
            <span className="text-gray-500 dark:text-gray-500 ml-auto">3 hours ago</span>
          </div>
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