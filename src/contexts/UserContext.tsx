import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import * as api from '../services/api';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  location?: string;
  joinDate: string;
  stats: {
    trailsCompleted: number;
    photosShared: number;
    points: number;
    level: number;
  };
}

export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  type: 'photo' | 'check-in' | 'review' | 'achievement';
  content: string;
  image?: string;
  location?: string;
  timestamp: string;
  likes: number;
  likedBy: string[];
  comments: Comment[];
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
}

interface UserContextType {
  currentUser: AppUser | null;
  isLoggedIn: boolean;
  communityPosts: CommunityPost[];
  login: (user: AppUser) => void;
  logout: () => void;
  updateUserStats: (stats: Partial<AppUser['stats']>) => void;
  addCommunityPost: (post: Omit<CommunityPost, 'id' | 'userId' | 'userName' | 'userAvatar' | 'timestamp' | 'likes' | 'likedBy' | 'comments'>) => void;
  toggleLike: (postId: string) => void;
  addComment: (postId: string, content: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  const heartbeatInterval = useRef<NodeJS.Timeout | null>(null);

  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(() => {
    const savedPosts = localStorage.getItem('communityPosts');
    return savedPosts ? JSON.parse(savedPosts) : [];
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn.toString());
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('communityPosts', JSON.stringify(communityPosts));
  }, [communityPosts]);

  const startHeartbeat = (userId: string) => {
    if (heartbeatInterval.current) {
      clearInterval(heartbeatInterval.current);
    }
    
    heartbeatInterval.current = setInterval(async () => {
      try {
        await api.sendHeartbeat(userId);
      } catch (error) {
        console.error('Heartbeat failed:', error);
      }
    }, 60000); // Send heartbeat every minute
  };

  const stopHeartbeat = () => {
    if (heartbeatInterval.current) {
      clearInterval(heartbeatInterval.current);
      heartbeatInterval.current = null;
    }
  };

  const login = (user: AppUser) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('isLoggedIn', 'true');
    startHeartbeat(user.id);
  };

  const logout = async () => {
    stopHeartbeat();
    if (currentUser?.id) {
      try {
        const { logout: apiLogout } = await import('../services/api');
        await apiLogout(currentUser.id);
      } catch (error) {
        console.error('Error during logout:', error);
      }
    }
    setCurrentUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
  };

  const updateUserStats = (newStats: Partial<AppUser['stats']>) => {
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        stats: { ...currentUser.stats, ...newStats }
      };
      setCurrentUser(updatedUser);
    }
  };

  const addCommunityPost = (postData: Omit<CommunityPost, 'id' | 'userId' | 'userName' | 'userAvatar' | 'timestamp' | 'likes' | 'likedBy' | 'comments'>) => {
    if (!currentUser) return;

    const newPost: CommunityPost = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar || 'https://picsum.photos/120/120?random=200',
      timestamp: new Date().toISOString(),
      likes: 0,
      likedBy: [],
      comments: [],
      ...postData
    };

    setCommunityPosts(prev => [newPost, ...prev]);

    // Update user stats
    if (postData.type === 'photo') {
      updateUserStats({ 
        photosShared: currentUser.stats.photosShared + 1,
        points: currentUser.stats.points + 10
      });
    }
  };

  const toggleLike = (postId: string) => {
    if (!currentUser) return;

    setCommunityPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const isLiked = post.likedBy.includes(currentUser.id);
        return {
          ...post,
          likes: isLiked ? post.likes - 1 : post.likes + 1,
          likedBy: isLiked 
            ? post.likedBy.filter(id => id !== currentUser.id)
            : [...post.likedBy, currentUser.id]
        };
      }
      return post;
    }));
  };

  const addComment = (postId: string, content: string) => {
    if (!currentUser) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar || 'https://picsum.photos/120/120?random=201',
      content,
      timestamp: new Date().toISOString()
    };

    setCommunityPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, newComment]
        };
      }
      return post;
    }));
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopHeartbeat();
    };
  }, []);

  // Start heartbeat if user is already logged in
  useEffect(() => {
    if (currentUser?.id && isLoggedIn) {
      startHeartbeat(currentUser.id);
    }
  }, []);

  const value: UserContextType = {
    currentUser,
    isLoggedIn,
    communityPosts,
    login,
    logout,
    updateUserStats,
    addCommunityPost,
    toggleLike,
    addComment
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};