import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Users,
  UserCheck,
  UserX,
  Shield,
  Mail,
  MapPin,
  Calendar,
  Search,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import { User } from '../../types';
import { formatDate } from '../../utils';

export const UsersAdmin: React.FC = () => {
  // const { t } = useTranslation();
  
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Anna Bērziņa',
      email: 'anna.berzina@example.com',
      location: 'Riga, Latvia',
      bio: 'Nature photographer and hiking enthusiast',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
      isAdmin: false,
      joinedAt: '2024-01-15T10:30:00Z',
      stats: {
        trailsCompleted: 23,
        photosShared: 156,
        followers: 89,
        following: 45,
        achievements: 12
      }
    },
    {
      id: '2',
      name: 'Mārtiņš Kalniņš',
      email: 'martins.kalnins@example.com',
      location: 'Sigulda, Latvia',
      bio: 'Adventure guide and trail expert',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      isAdmin: false,
      joinedAt: '2024-01-10T14:20:00Z',
      stats: {
        trailsCompleted: 67,
        photosShared: 234,
        followers: 234,
        following: 78,
        achievements: 28
      }
    },
    {
      id: '3',
      name: 'Līga Sproģe',
      email: 'liga.sproge@example.com',
      location: 'Cēsis, Latvia',
      bio: 'Weekend hiker and nature lover',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
      isAdmin: false,
      joinedAt: '2024-01-05T09:15:00Z',
      stats: {
        trailsCompleted: 12,
        photosShared: 45,
        followers: 34,
        following: 23,
        achievements: 8
      }
    },
    {
      id: '4',
      name: 'Admin User',
      email: 'emalinovskis@me.com',
      location: 'Riga, Latvia',
      bio: 'System administrator',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
      isAdmin: true,
      joinedAt: '2024-01-01T00:00:00Z',
      stats: {
        trailsCompleted: 0,
        photosShared: 0,
        followers: 0,
        following: 0,
        achievements: 0
      }
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'user'>('all');
  const [onlineUsers] = useState(2); // Mock online count

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || 
                       (filterRole === 'admin' && user.isAdmin) ||
                       (filterRole === 'user' && !user.isAdmin);
    return matchesSearch && matchesRole;
  });

  const handleToggleAdmin = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, isAdmin: !user.isAdmin }
        : user
    ));
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(prev => prev.filter(user => user.id !== userId));
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          User Management
        </h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            {onlineUsers} online
          </div>
        </div>
      </div>

      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Total Users</span>
          </div>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">{users.length}</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-800 dark:text-green-200">Active Users</span>
          </div>
          <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">{onlineUsers}</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-800 dark:text-purple-200">Admins</span>
          </div>
          <p className="text-2xl font-bold text-purple-900 dark:text-purple-100 mt-1">
            {users.filter(u => u.isAdmin).length}
          </p>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">New This Month</span>
          </div>
          <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100 mt-1">
            {users.filter(u => new Date(u.joinedAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admins</option>
            <option value="user">Users</option>
          </select>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-gray-900 dark:text-white">
            Users ({filteredUsers.length} of {users.length})
          </h4>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredUsers.map((user) => (
            <div key={user.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {user.isAdmin && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                        <Shield className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h5 className="font-semibold text-gray-900 dark:text-white">
                        {user.name}
                      </h5>
                      {user.isAdmin && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                          Admin
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-2">
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {user.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {user.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Joined {formatDate(user.joinedAt)}
                      </div>
                    </div>
                    
                    {user.bio && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {user.bio}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {user.stats.trailsCompleted}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">trails</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {user.stats.photosShared}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">photos</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {user.stats.followers}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">followers</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {user.stats.achievements}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">achievements</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleAdmin(user.id)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      user.isAdmin
                        ? 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                  </button>
                  
                  <div className="relative">
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    title="Delete User"
                  >
                    <UserX className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h4 className="font-medium text-gray-900 dark:text-white mb-4">
          Recent User Activity
        </h4>
        <div className="space-y-3">
          {[
            { user: 'Anna Bērziņa', action: 'completed Gauja National Park trail', time: '2 hours ago' },
            { user: 'Mārtiņš Kalniņš', action: 'shared 3 new photos', time: '4 hours ago' },
            { user: 'Līga Sproģe', action: 'joined the platform', time: '1 day ago' },
            { user: 'Anna Bērziņa', action: 'earned "Nature Explorer" achievement', time: '2 days ago' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-900 dark:text-white">
                  <span className="font-medium">{activity.user}</span> {activity.action}
                </span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {activity.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};