import axios from 'axios';

// Dynamic API URL - works for both local development and remote servers
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (window.location.hostname === 'localhost' ? 
    'http://localhost:5000/api' : 
    `http://${window.location.hostname}:5000/api`);

console.log('API_BASE_URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
});

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  location?: string;
  country?: string;
  bio?: string;
  interests?: string;
  avatar_url?: string;
  is_admin: boolean;
  stats_trails_completed: number;
  stats_photos_shared: number;
  stats_points: number;
  stats_level: number;
  created_at: string;
  updated_at: string;
}

export interface ApiTrail {
  id: string;
  name_en: string;
  name_lv: string;
  name_ru: string;
  description_en: string;
  description_lv: string;
  description_ru: string;
  region: string;
  difficulty: string;
  distance: string;
  duration: string;
  elevation_gain: string;
  latitude: number;
  longitude: number;
  image_url: string;
  features: string;
  best_season: string;
  accessibility: string;
  best_time_to_visit: string;
  trail_condition: string;
  parking_available: boolean;
  guided_tours_available: boolean;
  free_entry: boolean;
  adult_price: number;
  child_price: number;
  contact_phone: string;
  contact_email: string;
  contact_website: string;
  created_at: string;
  updated_at: string;
}

export interface ApiCommunityPost {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar: string;
  type: string;
  content: string;
  image_url?: string;
  location?: string;
  likes_count: number;
  comments_count: number;
  user_liked: boolean;
  created_at: string;
}

export interface ApiStats {
  totalUsers: number;
  totalTrails: number;
  totalPosts: number;
  onlineUsers: number;
}

// File upload
export const uploadFile = async (file: File): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append('image', file);
  
  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

// User API
export const getUsers = async (): Promise<ApiUser[]> => {
  const response = await api.get('/users');
  return response.data;
};

export const getUser = async (id: string): Promise<ApiUser> => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const updateUser = async (id: string, userData: Partial<ApiUser>): Promise<void> => {
  await api.put(`/users/${id}`, userData);
};

// Authentication
export const login = async (email: string, password: string): Promise<{ user: any }> => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const logout = async (userId: string): Promise<void> => {
  await api.post('/auth/logout', { userId });
};

export const sendHeartbeat = async (userId: string): Promise<{ success: boolean }> => {
  const response = await api.post('/heartbeat', { user_id: userId });
  return response.data;
};

// Trail API
export const getTrails = async (): Promise<ApiTrail[]> => {
  const response = await api.get('/trails');
  return response.data;
};

export const createTrail = async (trailData: Partial<ApiTrail>): Promise<{ id: string }> => {
  const response = await api.post('/trails', trailData);
  return response.data;
};

export const updateTrail = async (id: string, trailData: Partial<ApiTrail>): Promise<void> => {
  await api.put(`/trails/${id}`, trailData);
};

export const deleteTrail = async (id: string): Promise<void> => {
  await api.delete(`/trails/${id}`);
};

// Community Posts API
export const getCommunityPosts = async (userId?: string): Promise<ApiCommunityPost[]> => {
  const response = await api.get('/community-posts', {
    params: userId ? { user_id: userId } : {}
  });
  return response.data;
};

export const createCommunityPost = async (postData: {
  user_id: string;
  type: string;
  content: string;
  image_url?: string;
  location?: string;
}): Promise<{ id: string }> => {
  const response = await api.post('/community-posts', postData);
  return response.data;
};

export const deleteCommunityPost = async (postId: string): Promise<{ message: string }> => {
  const response = await api.delete(`/community-posts/${postId}`);
  return response.data;
};

export const likePost = async (postId: string, userId: string): Promise<{ liked: boolean }> => {
  const response = await api.post(`/community-posts/${postId}/like`, { user_id: userId });
  return response.data;
};

export const addComment = async (postId: string, userId: string, content: string): Promise<any> => {
  const response = await api.post(`/community-posts/${postId}/comments`, { user_id: userId, content });
  return response.data;
};

export const getComments = async (postId: string): Promise<any[]> => {
  const response = await api.get(`/community-posts/${postId}/comments`);
  return response.data;
};

// Enhanced Profile API
export const getUserAchievements = async (userId: string): Promise<any[]> => {
  try {
    const response = await api.get(`/users/${userId}/achievements`);
    return response.data;
  } catch (error) {
    console.log('Achievements API not implemented yet, returning mock data');
    return [
      {
        id: '1',
        name: 'First Steps',
        description: 'Complete your first trail',
        icon: '🥾',
        category: 'trails',
        unlocked: true,
        progress: 1,
        maxProgress: 1,
        unlockedAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Trail Blazer',
        description: 'Complete 5 trails',
        icon: '🏔️',
        category: 'trails',
        unlocked: false,
        progress: 1,
        maxProgress: 5
      },
      {
        id: '3',
        name: 'Photographer',
        description: 'Share 10 photos',
        icon: '📸',
        category: 'photos',
        unlocked: false,
        progress: 0,
        maxProgress: 10
      },
      {
        id: '4',
        name: 'Social Butterfly',
        description: 'Get 50 likes on your posts',
        icon: '🦋',
        category: 'social',
        unlocked: false,
        progress: 0,
        maxProgress: 50
      }
    ];
  }
};

export const getUserPhotoGallery = async (userId: string): Promise<any[]> => {
  try {
    const response = await api.get(`/users/${userId}/gallery`);
    return response.data;
  } catch (error) {
    console.log('Gallery API not implemented yet, using localStorage fallback');
    // Fallback to localStorage for demo
    const savedPhotos = localStorage.getItem('userPhotos');
    if (savedPhotos) {
      return JSON.parse(savedPhotos);
    }
    
    // Return mock photos if no saved photos
    return [
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400',
        caption: 'Beautiful sunset at Gauja National Park',
        location: 'Gauja National Park',
        likes: 24,
        uploadedAt: '2024-01-15T10:30:00Z'
      },
      {
        id: '2', 
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
        caption: 'Morning hike through the forest',
        location: 'Kemeri National Park',
        likes: 18,
        uploadedAt: '2024-01-12T08:15:00Z'
      }
    ];
  }
};

export const addPhotoToGallery = async (photoData: {
  userId: string;
  url: string;
  caption: string;
  location?: string;
}): Promise<any> => {
  try {
    const response = await api.post(`/users/${photoData.userId}/gallery`, photoData);
    return response.data;
  } catch (error) {
    console.log('Add photo API not implemented yet');
    throw error;
  }
};

export const getUserSocialConnections = async (userId: string): Promise<any[]> => {
  try {
    const response = await api.get(`/users/${userId}/connections`);
    return response.data;
  } catch (error) {
    console.log('Social connections API not implemented yet, returning mock data');
    return [
      {
        id: 'user-2',
        name: 'Nature Lover',
        avatar: null,
        isFollowing: true,
        isFollower: true,
        mutualFollows: 3,
        joinedAt: new Date().toISOString()
      },
      {
        id: 'user-3',
        name: 'Trail Master',
        avatar: null,
        isFollowing: false,
        isFollower: true,
        mutualFollows: 1,
        joinedAt: new Date().toISOString()
      }
    ];
  }
};

export const followUser = async (userId: string, targetUserId: string): Promise<any> => {
  try {
    const response = await api.post(`/users/${userId}/follow`, { targetUserId });
    return response.data;
  } catch (error) {
    console.log('Follow user API not implemented yet');
    throw error;
  }
};

export const getUserActivityTimeline = async (userId: string): Promise<any[]> => {
  try {
    const response = await api.get(`/users/${userId}/activity`);
    return response.data;
  } catch (error) {
    console.log('Activity timeline API not implemented yet, returning mock data');
    return [
      {
        id: '1',
        type: 'trail_completed',
        title: 'Completed Gauja National Park Trail',
        description: 'Finished the scenic 5km nature trail',
        timestamp: new Date().toISOString()
      },
      {
        id: '2',
        type: 'photo_shared',
        title: 'Shared a beautiful sunset photo',
        description: 'From the top of Sigulda castle ruins',
        timestamp: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: '3',
        type: 'achievement_unlocked',
        title: 'Achievement Unlocked: First Steps',
        description: 'Completed your first trail adventure',
        timestamp: new Date(Date.now() - 172800000).toISOString()
      }
    ];
  }
};

export const getUserEnhancedStats = async (userId: string): Promise<any> => {
  try {
    const response = await api.get(`/users/${userId}/enhanced-stats`);
    return response.data;
  } catch (error) {
    console.log('Enhanced stats API not implemented yet, returning mock data');
    return {
      trailsCompleted: 3,
      photosShared: 7,
      totalLikes: 42,
      followers: 12,
      following: 8,
      achievements: 1
    };
  }
};

// Notification API
export const getUserNotifications = async (userId: string): Promise<any[]> => {
  try {
    const response = await api.get(`/users/${userId}/notifications`);
    return response.data;
  } catch (error) {
    console.log('Notifications API not implemented yet, returning mock data');
    return [
      {
        id: '1',
        type: 'like',
        title: 'New Like',
        message: 'Nature Lover liked your photo from Gauja National Park',
        read: false,
        timestamp: new Date().toISOString(),
        priority: 'low'
      },
      {
        id: '2',
        type: 'comment',
        title: 'New Comment',
        message: 'Trail Master commented on your adventure post',
        read: false,
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        priority: 'medium'
      },
      {
        id: '3',
        type: 'achievement',
        title: 'Achievement Unlocked!',
        message: 'You earned the "First Steps" badge for completing your first trail',
        read: true,
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        priority: 'high'
      }
    ];
  }
};

export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  try {
    await api.patch(`/notifications/${notificationId}/read`);
  } catch (error) {
    console.log('Mark notification as read API not implemented yet');
  }
};

export const markAllNotificationsAsRead = async (userId: string): Promise<void> => {
  try {
    await api.patch(`/users/${userId}/notifications/read-all`);
  } catch (error) {
    console.log('Mark all notifications as read API not implemented yet');
  }
};

export const deleteNotification = async (notificationId: string): Promise<void> => {
  try {
    await api.delete(`/notifications/${notificationId}`);
  } catch (error) {
    console.log('Delete notification API not implemented yet');
  }
};

export const getNotificationSettings = async (userId: string): Promise<any> => {
  try {
    const response = await api.get(`/users/${userId}/notification-settings`);
    return response.data;
  } catch (error) {
    console.log('Notification settings API not implemented yet, returning defaults');
    return {
      pushEnabled: false,
      emailEnabled: true,
      soundEnabled: true,
      types: {
        likes: true,
        comments: true,
        follows: true,
        trailAlerts: true,
        achievements: true,
        emergencies: true,
        events: true,
        recommendations: true,
        weatherAlerts: true,
        weeklyDigest: true
      }
    };
  }
};

export const updateNotificationSettings = async (userId: string, settings: any): Promise<void> => {
  try {
    await api.patch(`/users/${userId}/notification-settings`, settings);
  } catch (error) {
    console.log('Update notification settings API not implemented yet');
  }
};

// PWA API
export const uploadGPSTrack = async (trackData: any): Promise<void> => {
  try {
    await api.post('/pwa/gps-tracks', trackData);
  } catch (error) {
    console.log('Upload GPS track API not implemented yet');
  }
};

export const uploadVoiceNote = async (voiceData: any): Promise<void> => {
  try {
    await api.post('/pwa/voice-notes', voiceData);
  } catch (error) {
    console.log('Upload voice note API not implemented yet');
  }
};

export const reportEmergency = async (emergencyData: any): Promise<void> => {
  try {
    await api.post('/pwa/emergency', emergencyData);
  } catch (error) {
    console.log('Report emergency API not implemented yet');
  }
};

export const uploadPhoto = async (photoData: any): Promise<void> => {
  try {
    await api.post('/pwa/photos', photoData);
  } catch (error) {
    console.log('Upload photo API not implemented yet');
  }
};

// Statistics API
export const getStats = async (): Promise<ApiStats> => {
  const response = await api.get('/stats');
  return response.data;
};

export const getRecentActivity = async () => {
  const response = await api.get('/recent-activity');
  return response.data;
};

// Health check endpoint
export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;