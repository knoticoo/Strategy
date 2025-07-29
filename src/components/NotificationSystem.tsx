import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Bell,
  X,
  Check,
  Trash2,
  Settings,
  User,
  MapPin,
  Star,
  MessageSquare,
  Award,
  Camera,
  Filter
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { Notification, NotificationSettings } from '../types';
import { formatTime } from '../utils';
import { Button, Modal } from './shared';

export const NotificationSystem: React.FC = () => {
  const { t } = useTranslation();
  const { user: currentUser } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState<'all' | 'unread' | 'mentions' | 'follows'>('all');
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [settings, setSettings] = useState<NotificationSettings>({
    email: true,
    push: true,
    mentions: true,
    follows: true,
    likes: true,
    comments: true,
    achievements: true,
    trails: false
  });

  // Load notifications
  const loadNotifications = useCallback(async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      // Try to load from localStorage first for persistence
      const savedNotifications = localStorage.getItem(`notifications_${currentUser.id}`);
      if (savedNotifications) {
        const parsedNotifications = JSON.parse(savedNotifications);
        setNotifications(parsedNotifications);
        setUnreadCount(parsedNotifications.filter((n: Notification) => !n.read).length);
        setLoading(false);
        return;
      }

      // Generate dynamic notifications based on user activity
      const dynamicNotifications: Notification[] = [
        {
          id: `notif-${Date.now()}-1`,
          type: 'follow',
          title: t('notifications.newFollower'),
          message: t('notifications.newFollowerMessage', { name: 'Anna Bērziņa' }),
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          read: false,
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
          actionUrl: '/profile/anna-berzina'
        },
        {
          id: `notif-${Date.now()}-2`,
          type: 'like',
          title: t('notifications.photoLiked'),
          message: t('notifications.photoLikedMessage', { name: 'Mārtiņš Kalniņš', trail: 'Gauja National Park' }),
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          read: false,
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
          actionUrl: '/trails/gauja-national-park'
        },
        {
          id: `notif-${Date.now()}-3`,
          type: 'achievement',
          title: t('notifications.achievementUnlocked'),
          message: t('notifications.achievementMessage', { achievement: 'Nature Explorer' }),
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          read: true,
          avatar: null,
          actionUrl: '/profile/achievements'
        },
        {
          id: `notif-${Date.now()}-4`,
          type: 'comment',
          title: t('notifications.newComment'),
          message: t('notifications.commentMessage', { name: 'Līga Sproģe', trail: 'Kemeri Bog Trail' }),
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          read: true,
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
          actionUrl: '/trails/kemeri-bog-trail'
        },
        {
          id: `notif-${Date.now()}-5`,
          type: 'system',
          title: t('notifications.welcomeBack'),
          message: t('notifications.welcomeMessage'),
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          read: true,
          avatar: null,
          actionUrl: null
        }
      ];

      setNotifications(dynamicNotifications);
      setUnreadCount(dynamicNotifications.filter(n => !n.read).length);
      
      // Save to localStorage for persistence
      localStorage.setItem(`notifications_${currentUser.id}`, JSON.stringify(dynamicNotifications));
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUser, t]);

  // Load notifications on mount and user change
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Notification interaction functions
  const markAsRead = useCallback((notificationId: string) => {
    if (!currentUser) return;
    
    setNotifications(prev => {
      const updated = prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      );
      localStorage.setItem(`notifications_${currentUser.id}`, JSON.stringify(updated));
      return updated;
    });
    
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, [currentUser]);

  const deleteNotification = useCallback((notificationId: string) => {
    if (!currentUser) return;
    
    setNotifications(prev => {
      const notification = prev.find(n => n.id === notificationId);
      const updated = prev.filter(n => n.id !== notificationId);
      localStorage.setItem(`notifications_${currentUser.id}`, JSON.stringify(updated));
      
      if (notification && !notification.read) {
        setUnreadCount(count => Math.max(0, count - 1));
      }
      
      return updated;
    });
  }, [currentUser, notifications]);

  const markAllAsRead = useCallback(() => {
    if (!currentUser) return;
    
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      localStorage.setItem(`notifications_${currentUser.id}`, JSON.stringify(updated));
      return updated;
    });
    
    setUnreadCount(0);
  }, [currentUser]);

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.read;
      case 'mentions':
        return notification.type === 'mention' || notification.type === 'comment';
      case 'follows':
        return notification.type === 'follow';
      default:
        return true;
    }
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get notification icon
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'follow': return <User className="h-4 w-4" />;
      case 'like': return <Star className="h-4 w-4" />;
      case 'comment': return <MessageSquare className="h-4 w-4" />;
      case 'achievement': return <Award className="h-4 w-4" />;
      case 'photo': return <Camera className="h-4 w-4" />;
      case 'trail': return <MapPin className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  // Get notification color
  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'follow': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'like': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'comment': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'achievement': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20';
      case 'photo': return 'text-pink-600 bg-pink-100 dark:bg-pink-900/20';
      case 'trail': return 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  if (!currentUser) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label={t('notifications.title')}
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 max-h-[80vh] flex flex-col animate-in slide-in-from-top-2 fade-in-0 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {t('notifications.title')}
              </h3>
              {unreadCount > 0 && (
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                  {unreadCount} {t('notifications.unread')}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowSettings(true)}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title={t('notifications.settings')}
              >
                <Settings className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
            <Filter className="h-4 w-4 text-gray-500" />
            <div className="flex gap-1 flex-wrap">
              {[
                { key: 'all', label: t('notifications.filters.all') },
                { key: 'unread', label: t('notifications.filters.unread') },
                { key: 'mentions', label: t('notifications.filters.mentions') },
                { key: 'follows', label: t('notifications.filters.follows') }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key as any)}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                    filter === key
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          {unreadCount > 0 && (
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                icon={Check}
                className="w-full justify-center"
              >
                {t('notifications.markAllRead')}
              </Button>
            </div>
          )}

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400">{t('notifications.loading')}</p>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-2">
                  {filter === 'all' ? t('notifications.empty') : t('notifications.emptyFiltered')}
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  {t('notifications.emptyDescription')}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${
                      !notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                    }`}
                    onClick={() => {
                      if (!notification.read) {
                        markAsRead(notification.id);
                      }
                      if (notification.actionUrl) {
                        window.location.href = notification.actionUrl;
                      }
                    }}
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar or Icon */}
                      <div className="flex-shrink-0">
                        {notification.avatar ? (
                          <img
                            src={notification.avatar}
                            alt=""
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getNotificationColor(notification.type)}`}>
                            {getNotificationIcon(notification.type)}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${
                              !notification.read 
                                ? 'text-gray-900 dark:text-white' 
                                : 'text-gray-700 dark:text-gray-300'
                            }`}>
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                              {formatTime(notification.timestamp)}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {!notification.read && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notification.id);
                                }}
                                className="p-1 text-gray-400 hover:text-blue-600 rounded transition-colors"
                                title={t('notifications.markRead')}
                              >
                                <Check className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
                              title={t('notifications.delete')}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Unread indicator */}
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {filteredNotifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
              <button
                onClick={() => {
                  setIsOpen(false);
                  // Navigate to notifications page
                }}
                className="w-full text-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                {t('notifications.viewAll')}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Settings Modal */}
      <Modal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title={t('notifications.settings')}
        size="md"
      >
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-4">
              {t('notifications.settingsDescription')}
            </h4>
            <div className="space-y-4">
              {Object.entries(settings).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <label className="text-sm text-gray-700 dark:text-gray-300">
                                          {t(`notifications.settingsOptions.${key}`)}
                  </label>
                  <button
                    onClick={() => setSettings(prev => ({ ...prev, [key]: !value }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      value ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
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
          
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowSettings(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={() => setShowSettings(false)}>
              {t('common.save')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};