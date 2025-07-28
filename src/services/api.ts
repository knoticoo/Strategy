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