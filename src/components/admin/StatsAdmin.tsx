import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BarChart3,
  TrendingUp,
  Users,
  Mountain,
  BookOpen,
  MessageSquare,
  Star,
  Activity,
  Calendar,
  Globe,
  Smartphone,
  Monitor
} from 'lucide-react';
import { AdminStats } from '../../types';

export const StatsAdmin: React.FC = () => {
  const { t } = useTranslation();
  
  const [stats] = useState<AdminStats>({
    totalUsers: 1247,
    activeUsers: 89,
    totalTrails: 156,
    totalContent: 234,
    systemHealth: 'good'
  });

  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Mock analytics data
  const analyticsData = {
    userGrowth: [
      { period: 'Jan', users: 45, trails: 12 },
      { period: 'Feb', users: 78, trails: 18 },
      { period: 'Mar', users: 123, trails: 24 },
      { period: 'Apr', users: 156, trails: 31 },
      { period: 'May', users: 189, trails: 38 },
      { period: 'Jun', users: 234, trails: 45 }
    ],
    topTrails: [
      { name: 'Gauja National Park Main Trail', completions: 1247, rating: 4.7 },
      { name: 'Kemeri Bog Boardwalk', completions: 892, rating: 4.9 },
      { name: 'Sigulda Castle Ruins Trail', completions: 456, rating: 4.5 },
      { name: 'Rīga Central Park Loop', completions: 334, rating: 4.2 },
      { name: 'Jūrmala Beach Walk', completions: 287, rating: 4.6 }
    ],
    deviceStats: [
      { device: 'Mobile', percentage: 68, color: 'bg-blue-500' },
      { device: 'Desktop', percentage: 24, color: 'bg-green-500' },
      { device: 'Tablet', percentage: 8, color: 'bg-purple-500' }
    ],
    geographicData: [
      { region: 'Riga', users: 456, percentage: 37 },
      { region: 'Daugavpils', users: 234, percentage: 19 },
      { region: 'Liepaja', users: 189, percentage: 15 },
      { region: 'Jelgava', users: 156, percentage: 12 },
      { region: 'Ventspils', users: 123, percentage: 10 },
      { region: 'Other', users: 89, percentage: 7 }
    ]
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Platform Analytics
        </h3>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUsers.toLocaleString()}</p>
              <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                +12.5% from last month
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeUsers}</p>
              <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                +8.2% from last week
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Activity className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Trails</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalTrails}</p>
              <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                +5 new this month
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Mountain className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">System Health</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getHealthColor(stats.systemHealth)}`}>
                  {stats.systemHealth.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                All systems operational
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* User Growth Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">User Growth</h4>
          <div className="space-y-4">
            {analyticsData.userGrowth.map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400 w-12">{data.period}</span>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(data.users / 250) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white w-12 text-right">
                  {data.users}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Trails */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Most Popular Trails</h4>
          <div className="space-y-4">
            {analyticsData.topTrails.map((trail, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <h5 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {trail.name}
                  </h5>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {trail.completions} completions
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {trail.rating}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    #{index + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Statistics */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Device Usage</h4>
          <div className="space-y-4">
            {analyticsData.deviceStats.map((device) => (
              <div key={device.device} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {device.device === 'Mobile' && <Smartphone className="h-4 w-4 text-gray-500" />}
                  {device.device === 'Desktop' && <Monitor className="h-4 w-4 text-gray-500" />}
                  {device.device === 'Tablet' && <Smartphone className="h-4 w-4 text-gray-500" />}
                  <span className="text-sm text-gray-600 dark:text-gray-400">{device.device}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`${device.color} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${device.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white w-10 text-right">
                    {device.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Geographic Distribution</h4>
          <div className="space-y-3">
            {analyticsData.geographicData.map((region) => (
              <div key={region.region} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{region.region}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {region.users} users
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {region.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Performance Metrics</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">99.9%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">1.2s</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Avg Load Time</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">4.7/5</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">User Rating</div>
          </div>
        </div>
      </div>
    </div>
  );
};