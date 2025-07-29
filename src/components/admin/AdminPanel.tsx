import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Shield, 
  Users, 
  BarChart3, 
  BookOpen 
} from 'lucide-react';
import { TrailsAdmin } from './TrailsAdmin';
import { UsersAdmin } from './UsersAdmin';
import { StatsAdmin } from './StatsAdmin';
import { EducationAdmin } from './EducationAdmin';

interface AdminPanelProps {
  isAdmin: boolean;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ isAdmin }) => {
  // const { t } = useTranslation();
  const [adminTab, setAdminTab] = useState<'trails' | 'users' | 'stats' | 'education'>('trails');

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Access Denied
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          You don't have permission to access this area.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Admin Header */}
      <div className="mb-8 p-6 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl text-white">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="h-6 w-6" />
          <span className="font-semibold">Admin Panel</span>
        </div>
        <p className="text-white/90 text-sm mb-3">
          You have administrative privileges. Handle with care!
        </p>
        <div className="text-xs bg-white/20 rounded px-3 py-1 inline-block">
          Admin Access: emalinovskis@me.com / Millie1991
        </div>
      </div>

      {/* Admin Navigation */}
      <div className="flex flex-wrap gap-2 mb-6 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
        <button
          onClick={() => setAdminTab('trails')}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
            adminTab === 'trails'
              ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <BarChart3 className="h-4 w-4 inline mr-2" />
          Trails
        </button>
        <button
          onClick={() => setAdminTab('users')}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
            adminTab === 'users'
              ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Users className="h-4 w-4 inline mr-2" />
          Users
        </button>
        <button
          onClick={() => setAdminTab('stats')}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
            adminTab === 'stats'
              ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <BarChart3 className="h-4 w-4 inline mr-2" />
          Statistics
        </button>
        <button
          onClick={() => setAdminTab('education')}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
            adminTab === 'education'
              ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <BookOpen className="h-4 w-4 inline mr-2" />
          Education
        </button>
      </div>

      {/* Admin Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        {adminTab === 'trails' && <TrailsAdmin />}
        {adminTab === 'users' && <UsersAdmin />}
        {adminTab === 'stats' && <StatsAdmin />}
        {adminTab === 'education' && <EducationAdmin />}
      </div>
    </div>
  );
};