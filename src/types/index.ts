// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  location?: string;
  bio?: string;
  avatar?: string;
  isAdmin?: boolean;
  joinedAt: string;
  stats: UserStats;
}

export interface UserStats {
  trailsCompleted: number;
  photosShared: number;
  followers: number;
  following: number;
  achievements: number;
}

// Trail Types
export interface Trail {
  id: string;
  name: string;
  description: string;
  difficulty: 'easy' | 'moderate' | 'hard';
  distance: number;
  duration: string;
  elevation?: number;
  location: {
    name: string;
    coordinates: { lat: number; lng: number };
  };
  images: string[];
  features: string[];
  rating: number;
  reviewCount: number;
  isFavorite?: boolean;
  completedBy: number;
  createdAt: string;
}

// Educational Content Types
export interface EducationalContent {
  id: string;
  title: string;
  category: 'nature' | 'history' | 'culture' | 'photography' | 'survival';
  type: 'article' | 'interactive' | 'quiz' | 'tutorial';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  description: string;
  content: string;
  images: string[];
  location?: {
    name: string;
    coordinates: { lat: number; lng: number };
  };
  relatedTrails: string[];
  tags: string[];
  rating: number;
  completedBy: number;
  createdAt: string;
  author: {
    name: string;
    avatar: string;
    expertise: string;
  };
  questions?: QuizQuestion[];
  status?: 'published' | 'draft' | 'review';
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

export interface UserProgress {
  contentId: string;
  progress: number;
  completed: boolean;
  timeSpent: number;
  completedAt?: string;
}

// Community Types
export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  image?: string;
  location?: string;
  timestamp: string;
  likes: number;
  comments: Comment[];
  isLiked: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'trail' | 'achievement' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  userId: string;
  relatedId?: string;
}

export interface NotificationSettings {
  likes: boolean;
  comments: boolean;
  follows: boolean;
  achievements: boolean;
  system: boolean;
  email: boolean;
  push: boolean;
}

// Profile Types
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}

export interface PhotoGalleryItem {
  id: string;
  url: string;
  caption: string;
  location: string;
  likes: number;
  uploadedAt: string;
}

export interface SocialConnection {
  id: string;
  name: string;
  avatar: string;
  isFollowing: boolean;
  mutualFollowers: number;
  bio?: string;
}

export interface ActivityTimelineItem {
  id: string;
  type: 'trail_completed' | 'photo_shared' | 'achievement_earned' | 'review_posted';
  title: string;
  description: string;
  timestamp: string;
  relatedId?: string;
}

// Admin Types
export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalTrails: number;
  totalContent: number;
  systemHealth: 'good' | 'warning' | 'error';
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  location?: string;
}

export interface ContentForm {
  title: string;
  category: string;
  type: string;
  difficulty: string;
  duration: number;
  description: string;
  questions: QuizQuestion[];
}

// Theme Types
export interface ProfileTheme {
  id: string;
  name: string;
  colors: string;
  preview: string;
}

// Map Types
export interface MapLocation {
  lat: number;
  lng: number;
}

export interface MapMarker {
  id: string;
  position: MapLocation;
  title: string;
  type: 'trail' | 'camping' | 'fishing' | 'poi';
  data?: any;
}