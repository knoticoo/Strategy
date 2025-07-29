// App Configuration
export const APP_CONFIG = {
  name: 'Latvian Adventure Finder',
  version: '1.0.0',
  description: 'Discover authentic hiking trails across Latvia',
  author: 'Adventure Team',
  supportEmail: 'support@latvianadventures.com'
};

// API Configuration
export const API_CONFIG = {
  baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  retryAttempts: 3
};

// Admin Configuration
export const ADMIN_CONFIG = {
  adminEmail: 'emalinovskis@me.com',
  adminPassword: 'Millie1991'
};

// Trail Difficulty Levels
export const TRAIL_DIFFICULTY = {
  EASY: 'easy' as const,
  MODERATE: 'moderate' as const,
  HARD: 'hard' as const
};

export const DIFFICULTY_LABELS = {
  [TRAIL_DIFFICULTY.EASY]: 'Easy',
  [TRAIL_DIFFICULTY.MODERATE]: 'Moderate',
  [TRAIL_DIFFICULTY.HARD]: 'Hard'
};

export const DIFFICULTY_COLORS = {
  [TRAIL_DIFFICULTY.EASY]: 'text-green-600 bg-green-100',
  [TRAIL_DIFFICULTY.MODERATE]: 'text-yellow-600 bg-yellow-100',
  [TRAIL_DIFFICULTY.HARD]: 'text-red-600 bg-red-100'
};

// Educational Content Categories
export const EDUCATION_CATEGORIES = {
  NATURE: 'nature' as const,
  HISTORY: 'history' as const,
  CULTURE: 'culture' as const,
  PHOTOGRAPHY: 'photography' as const,
  SURVIVAL: 'survival' as const
};

export const CATEGORY_LABELS = {
  [EDUCATION_CATEGORIES.NATURE]: 'Nature',
  [EDUCATION_CATEGORIES.HISTORY]: 'History',
  [EDUCATION_CATEGORIES.CULTURE]: 'Culture',
  [EDUCATION_CATEGORIES.PHOTOGRAPHY]: 'Photography',
  [EDUCATION_CATEGORIES.SURVIVAL]: 'Survival'
};

export const CATEGORY_COLORS = {
  [EDUCATION_CATEGORIES.NATURE]: 'bg-green-100 text-green-800',
  [EDUCATION_CATEGORIES.HISTORY]: 'bg-amber-100 text-amber-800',
  [EDUCATION_CATEGORIES.CULTURE]: 'bg-purple-100 text-purple-800',
  [EDUCATION_CATEGORIES.PHOTOGRAPHY]: 'bg-blue-100 text-blue-800',
  [EDUCATION_CATEGORIES.SURVIVAL]: 'bg-red-100 text-red-800'
};

// Content Types
export const CONTENT_TYPES = {
  ARTICLE: 'article' as const,
  INTERACTIVE: 'interactive' as const,
  QUIZ: 'quiz' as const,
  TUTORIAL: 'tutorial' as const
};

export const CONTENT_TYPE_LABELS = {
  [CONTENT_TYPES.ARTICLE]: 'Article',
  [CONTENT_TYPES.INTERACTIVE]: 'Interactive',
  [CONTENT_TYPES.QUIZ]: 'Quiz',
  [CONTENT_TYPES.TUTORIAL]: 'Tutorial'
};

// Difficulty Levels
export const DIFFICULTY_LEVELS = {
  BEGINNER: 'beginner' as const,
  INTERMEDIATE: 'intermediate' as const,
  ADVANCED: 'advanced' as const
};

export const DIFFICULTY_LEVEL_LABELS = {
  [DIFFICULTY_LEVELS.BEGINNER]: 'Beginner',
  [DIFFICULTY_LEVELS.INTERMEDIATE]: 'Intermediate',
  [DIFFICULTY_LEVELS.ADVANCED]: 'Advanced'
};

// Notification Types
export const NOTIFICATION_TYPES = {
  LIKE: 'like' as const,
  COMMENT: 'comment' as const,
  FOLLOW: 'follow' as const,
  TRAIL: 'trail' as const,
  ACHIEVEMENT: 'achievement' as const,
  SYSTEM: 'system' as const
};

// Profile Themes
export const PROFILE_THEMES = [
  {
    id: 'default',
    name: 'Forest Green',
    colors: 'from-green-600 to-emerald-600',
    preview: 'bg-gradient-to-r from-green-600 to-emerald-600'
  },
  {
    id: 'ocean',
    name: 'Ocean Blue',
    colors: 'from-blue-600 to-cyan-600',
    preview: 'bg-gradient-to-r from-blue-600 to-cyan-600'
  },
  {
    id: 'sunset',
    name: 'Sunset Orange',
    colors: 'from-orange-500 to-red-500',
    preview: 'bg-gradient-to-r from-orange-500 to-red-500'
  },
  {
    id: 'mountain',
    name: 'Mountain Purple',
    colors: 'from-purple-600 to-indigo-600',
    preview: 'bg-gradient-to-r from-purple-600 to-indigo-600'
  },
  {
    id: 'autumn',
    name: 'Autumn Gold',
    colors: 'from-yellow-500 to-orange-500',
    preview: 'bg-gradient-to-r from-yellow-500 to-orange-500'
  }
];

// Map Configuration
export const MAP_CONFIG = {
  defaultCenter: {
    lat: 56.9496,
    lng: 24.1052
  },
  defaultZoom: 8,
  maxZoom: 18,
  minZoom: 6
};

// File Upload Constraints
export const FILE_UPLOAD = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp']
};

// Pagination
export const PAGINATION = {
  defaultLimit: 10,
  maxLimit: 50,
  defaultPage: 1
};

// Local Storage Keys
export const STORAGE_KEYS = {
  theme: 'theme',
  language: 'language',
  user: 'currentUser',
  isLoggedIn: 'isLoggedIn',
  profileTheme: 'profileTheme',
  notifications: 'userNotifications',
  educationProgress: 'educationProgress',
  userPhotos: 'userPhotos',
  userFollows: 'userFollows',
  communityPosts: 'communityPosts',
  trailsData: 'trailsData'
};

// Animation Durations
export const ANIMATIONS = {
  fast: 150,
  normal: 300,
  slow: 500,
  extraSlow: 1000
};

// Breakpoints (matching Tailwind CSS)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

// Achievement Categories
export const ACHIEVEMENT_CATEGORIES = {
  TRAILS: 'trails',
  SOCIAL: 'social',
  PHOTOS: 'photos',
  SPECIAL: 'special'
};

// Status Types
export const STATUS_TYPES = {
  PUBLISHED: 'published' as const,
  DRAFT: 'draft' as const,
  REVIEW: 'review' as const
};

export const STATUS_LABELS = {
  [STATUS_TYPES.PUBLISHED]: 'Published',
  [STATUS_TYPES.DRAFT]: 'Draft',
  [STATUS_TYPES.REVIEW]: 'Under Review'
};

export const STATUS_COLORS = {
  [STATUS_TYPES.PUBLISHED]: 'bg-green-100 text-green-800',
  [STATUS_TYPES.DRAFT]: 'bg-gray-100 text-gray-800',
  [STATUS_TYPES.REVIEW]: 'bg-yellow-100 text-yellow-800'
};

// Default Images
export const DEFAULT_IMAGES = {
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
  trail: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
  placeholder: 'https://via.placeholder.com/400x300?text=No+Image'
};

// Error Messages
export const ERROR_MESSAGES = {
  network: 'Network error. Please check your connection.',
  unauthorized: 'You are not authorized to perform this action.',
  notFound: 'The requested resource was not found.',
  validation: 'Please check your input and try again.',
  upload: 'Failed to upload file. Please try again.',
  generic: 'Something went wrong. Please try again.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  login: 'Successfully logged in!',
  register: 'Account created successfully!',
  save: 'Changes saved successfully!',
  upload: 'File uploaded successfully!',
  delete: 'Item deleted successfully!',
  follow: 'Successfully followed user!',
  unfollow: 'Successfully unfollowed user!'
};

// Regex Patterns
export const REGEX_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  phone: /^\+?[\d\s\-\(\)]{10,}$/,
  url: /^https?:\/\/.+/
};

// Feature Flags
export const FEATURES = {
  enableNotifications: true,
  enableGeolocation: true,
  enableOfflineMode: false,
  enableAnalytics: true,
  enableBetaFeatures: false
};