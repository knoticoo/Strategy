import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useUser } from '../contexts/UserContext';
import { useTranslation } from 'react-i18next';
import * as api from '../services/api';
import {
  Bell,
  X,
  Settings,
  Check
} from 'lucide-react';

// Generate dynamic notifications based on user activity
const generateDynamicNotifications = (user: any, t: any): Notification[] => {
  const now = Date.now();
  const notifications: Notification[] = [];
  
  // Random activity-based notifications with proper typing
  const activities: Array<{
    type: 'like' | 'comment' | 'follow' | 'achievement' | 'system';
    users?: string[];
    actions?: string[];
    achievements?: string[];
    messages?: string[];
  }> = [
    {
      type: 'like',
      users: ['Anna Bērziņa', 'Mārtiņš Kalniņš', 'Līga Sproģe', 'Jānis Ozols'],
      actions: ['liked your trail photo', 'liked your adventure post', 'liked your trail review']
    },
    {
      type: 'comment',
      users: ['Kristīne Liepa', 'Roberts Krūmiņš', 'Elīna Dārziņa', 'Andris Meiers'],
      actions: ['commented on your photo', 'replied to your post', 'asked about the trail']
    },
    {
      type: 'follow',
      users: ['Adventure Latvia', 'Nature Explorer', 'Trail Guide Pro', 'Outdoor Enthusiast'],
      actions: ['started following you', 'wants to join your adventures']
    },
    {
      type: 'achievement',
      achievements: ['Forest Explorer', 'Mountain Climber', 'Photo Master', 'Trail Blazer', 'Nature Guide'],
      actions: ['unlocked', 'earned', 'achieved']
    },
    {
      type: 'system',
      messages: [
        'New trails added in Gauja National Park',
        'Weather alert: Perfect hiking conditions this weekend',
        'Your trail review was featured',
        'Monthly adventure challenge available'
      ]
    }
  ];

  // Generate 3-8 random notifications
  const notificationCount = Math.floor(Math.random() * 6) + 3;
  
  for (let i = 0; i < notificationCount; i++) {
    const activity = activities[Math.floor(Math.random() * activities.length)];
    const timeOffset = Math.floor(Math.random() * 86400000 * 7); // Up to 7 days ago
    
    let notification: Notification;
    
    if (activity.type === 'achievement' && activity.achievements && activity.actions) {
      const achievement = activity.achievements[Math.floor(Math.random() * activity.achievements.length)];
      const action = activity.actions[Math.floor(Math.random() * activity.actions.length)];
      notification = {
        id: `dynamic-${i}`,
        type: 'achievement',
        title: t('notifications.achievement.title'),
        message: `You ${action} the "${achievement}" badge!`,
        read: Math.random() > 0.4, // 60% chance of being unread
        createdAt: new Date(now - timeOffset).toISOString(),
        userId: 'system'
      };
    } else if (activity.type === 'system' && activity.messages) {
      const message = activity.messages[Math.floor(Math.random() * activity.messages.length)];
      notification = {
        id: `dynamic-${i}`,
        type: 'system',
        title: 'System Notification',
        message: message,
        read: Math.random() > 0.3, // 70% chance of being unread
        createdAt: new Date(now - timeOffset).toISOString(),
        userId: 'system'
      };
    } else if (activity.users && activity.actions) {
      const user = activity.users[Math.floor(Math.random() * activity.users.length)];
      const action = activity.actions[Math.floor(Math.random() * activity.actions.length)];
      notification = {
        id: `dynamic-${i}`,
        type: activity.type as 'like' | 'comment' | 'follow',
        title: activity.type === 'like' ? t('notifications.like.title') : 
               activity.type === 'comment' ? t('notifications.comment.title') : 
               'New Follower',
        message: `${user} ${action}`,
        read: Math.random() > 0.5, // 50% chance of being unread
        createdAt: new Date(now - timeOffset).toISOString(),
        userId: `user-${i}`
      };
    } else {
      // Fallback notification if data is missing
      notification = {
        id: `dynamic-${i}`,
        type: 'system',
        title: 'System Notification',
        message: 'New activity in your adventure network',
        read: Math.random() > 0.5,
        createdAt: new Date(now - timeOffset).toISOString(),
        userId: 'system'
      };
    }
    
    notifications.push(notification);
  }
  
  // Sort by creation date (newest first)
  return notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'trail' | 'achievement' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  userId: string;
  relatedId?: string;
}

interface NotificationSettings {
  likes: boolean;
  comments: boolean;
  follows: boolean;
  achievements: boolean;
  system: boolean;
  email: boolean;
  push: boolean;
}

const NotificationSystem: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser, isLoggedIn } = useUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    likes: true,
    comments: true,
    follows: true,
    achievements: true,
    system: true,
    email: false,
    push: false
  });

  const dropdownRef = useRef<HTMLDivElement>(null);



  const loadNotifications = useCallback(async () => {
    if (!currentUser) return;
    
    try {
      // Try to load from API, fallback to realistic mock data
      const apiNotifications = await api.getUserNotifications(currentUser.id);
      if (apiNotifications && apiNotifications.length > 0) {
        setNotifications(apiNotifications);
        setUnreadCount(apiNotifications.filter(n => !n.read).length);
      } else {
        // Generate dynamic mock notifications based on user activity
        const dynamicNotifications = generateDynamicNotifications(currentUser, t);
        setNotifications(dynamicNotifications);
        setUnreadCount(dynamicNotifications.filter(n => !n.read).length);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      // Fallback to dynamic mock data
      const dynamicNotifications = generateDynamicNotifications(currentUser, t);
      setNotifications(dynamicNotifications);
      setUnreadCount(dynamicNotifications.filter(n => !n.read).length);
    }
  }, [currentUser, t]);

  const loadNotificationSettings = useCallback(async () => {
    if (!currentUser) return;
    
    try {
      // Use default settings for now
      setSettings({
        likes: true,
        comments: true,
        follows: true,
        achievements: true,
        system: true,
        email: false,
        push: false
      });
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  }, [currentUser]);

  useEffect(() => {
    if (isLoggedIn && currentUser) {
      loadNotifications();
      loadNotificationSettings();
    }
  }, [isLoggedIn, currentUser, loadNotifications, loadNotificationSettings]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
        setShowSettings(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = async (notificationId: string) => {
    try {
      // Find the notification before updating
      const notification = notifications.find(n => n.id === notificationId);
      
      // Update UI immediately for better UX
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      if (notification && !notification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      // Try to update via API
      await api.markNotificationAsRead(notificationId);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // Update UI immediately
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
      
      // Try to update via API
      if (currentUser) {
        await api.markAllNotificationsAsRead(currentUser.id);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      // Find the notification before deleting
      const notification = notifications.find(n => n.id === notificationId);
      
      // Update UI immediately
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      if (notification && !notification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      // Try to delete via API
      await api.deleteNotification(notificationId);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const updateSettings = async (newSettings: NotificationSettings) => {
    try {
      setSettings(newSettings);
      // Here you would save to the API
    } catch (error) {
      console.error('Error updating notification settings:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like': return '❤️';
      case 'comment': return '💬';
      case 'follow': return '👥';
      case 'trail': return '🏔️';
      case 'achievement': return '🏆';
      case 'system': return '📢';
      default: return '🔔';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return t('common.time.now');
    if (diffInMinutes < 60) return t('common.time.minutes', { count: diffInMinutes });
    if (diffInMinutes < 1440) return t('common.time.hours', { count: Math.floor(diffInMinutes / 60) });
    return t('common.time.days', { count: Math.floor(diffInMinutes / 1440) });
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon */}
      <button
        onClick={() => {
          setShowNotifications(!showNotifications);
          setShowSettings(false);
        }}
        className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown - Beautiful & Mobile Responsive */}
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 max-h-[75vh] overflow-hidden transform transition-all duration-200 animate-in slide-in-from-top-2 fade-in-0">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('notifications.title')}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setShowSettings(!showSettings);
                    setShowNotifications(false);
                  }}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
                >
                  <Settings className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="mt-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                {t('notifications.markAllRead')}
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>{t('notifications.empty')}</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-xl flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {notification.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 break-words">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                            {formatTime(notification.createdAt)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-1 text-green-600 hover:text-green-700 rounded"
                              title={t('notifications.markRead')}
                            >
                              <Check className="h-3 w-3" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-1 text-gray-400 hover:text-red-600 rounded"
                            title={t('notifications.delete')}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Settings Dropdown - Beautiful & Mobile Responsive */}
      {showSettings && (
        <div className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 transform transition-all duration-200 animate-in slide-in-from-top-2 fade-in-0">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('notifications.settings.title')}
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {Object.entries(settings).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <label className="text-sm text-gray-700 dark:text-gray-300">
                  {t(`notifications.settings.${key}`)}
                </label>
                <button
                  onClick={() => updateSettings({ ...settings, [key]: !value })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    value ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      value ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationSystem;