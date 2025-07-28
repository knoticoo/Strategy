import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import * as api from '../services/api';
import {
  Users,
  Camera,
  MapPin,
  Clock,
  Heart,
  MessageCircle,
  Share,
  Trophy,
  Send,
  X
} from 'lucide-react';

const CommunityTab: React.FC = () => {
  const { currentUser, isLoggedIn } = useUser();
  const [communityPosts, setCommunityPosts] = useState<api.ApiCommunityPost[]>([]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showComments, setShowComments] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [newPost, setNewPost] = useState({
    content: '',
    type: 'photo' as 'photo' | 'check-in' | 'review' | 'achievement',
    location: '',
    image: ''
  });

  // Load community posts from database
  useEffect(() => {
    loadCommunityPosts();
  }, []);

  const loadCommunityPosts = async () => {
    try {
      const posts = await api.getCommunityPosts();
      setCommunityPosts(posts);
    } catch (error) {
      console.error('Error loading community posts:', error);
    }
  };

  // File upload function
  const handleFileUpload = async (file: File): Promise<string> => {
    setIsUploading(true);
    try {
      const response = await api.uploadFile(file);
      return response.url;
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
      return '';
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = await handleFileUpload(file);
      if (imageUrl) {
        setNewPost({
          ...newPost,
          image: imageUrl
        });
      }
    }
  };

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.content.trim() || !currentUser) {
      alert('Please enter some content for your post');
      return;
    }

    try {
      console.log('Creating post with user:', currentUser);
      await api.createCommunityPost({
        user_id: currentUser.id,
        type: newPost.type,
        content: newPost.content,
        location: newPost.location || undefined,
        image_url: newPost.image || undefined
      });

      // Reload posts
      await loadCommunityPosts();

      // Reset form
      setNewPost({
        content: '',
        type: 'photo',
        location: '',
        image: ''
      });
      
      alert('Post created successfully!');
      setShowCreatePost(false);
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post. Please try again.');
    }
  };

  const handleAddComment = (postId: string) => {
    if (!newComment.trim()) return;
    
    // TODO: Implement comment API
    console.log('Adding comment to post:', postId, newComment);
    setNewComment('');
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'photo': return <Camera className="h-4 w-4" />;
      case 'check-in': return <MapPin className="h-4 w-4" />;
      case 'achievement': return <Trophy className="h-4 w-4" />;
      default: return <MessageCircle className="h-4 w-4" />;
    }
  };

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'photo': return 'text-blue-600 bg-blue-100';
      case 'check-in': return 'text-green-600 bg-green-100';
      case 'achievement': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="text-center py-12">
        <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Join the Adventure Community
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Connect with fellow adventurers, share your experiences, and discover new trails.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Please log in to access community features.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          👥 Adventure Community
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Share your adventures and connect with fellow explorers
        </p>
      </div>

      {/* Create Post Section */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl shadow-lg p-6 border border-green-100 dark:border-green-800">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'}
              alt={currentUser?.name}
              className="w-12 h-12 rounded-full border-2 border-green-500 object-cover"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
          </div>
          <div className="flex-1">
            <button
              onClick={() => setShowCreatePost(true)}
              className="w-full text-left px-6 py-4 bg-white dark:bg-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700"
            >
              <span className="text-gray-500 dark:text-gray-400 text-lg">
                ✨ Share your adventure, {currentUser?.name}...
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => {
              setNewPost(prev => ({ ...prev, type: 'photo' }));
              setShowCreatePost(true);
            }}
            className="group flex flex-col items-center gap-2 px-6 py-4 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Camera className="h-6 w-6 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Photo</span>
          </button>
          <button
            onClick={() => {
              setNewPost(prev => ({ ...prev, type: 'check-in' }));
              setShowCreatePost(true);
            }}
            className="group flex flex-col items-center gap-2 px-6 py-4 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <MapPin className="h-6 w-6 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Check-in</span>
          </button>
          <button
            onClick={() => {
              setNewPost(prev => ({ ...prev, type: 'achievement' }));
              setShowCreatePost(true);
            }}
            className="group flex flex-col items-center gap-2 px-6 py-4 bg-gradient-to-br from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Trophy className="h-6 w-6 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Achievement</span>
          </button>
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl bg-white/20 ${getPostTypeColor(newPost.type)} backdrop-blur-sm`}>
                    {getPostTypeIcon(newPost.type)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Create {newPost.type.charAt(0).toUpperCase() + newPost.type.slice(1)}
                    </h3>
                    <p className="text-white/80 text-sm">Share your adventure with the community</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCreatePost(false)}
                  className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmitPost} className="p-6 space-y-6">

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  What's on your mind?
                </label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Share your adventure story, tips, or experience..."
                  className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none transition-all duration-200"
                  rows={4}
                  required
                />
              </div>

              {newPost.type === 'check-in' && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    📍 Location
                  </label>
                  <input
                    type="text"
                    value={newPost.location}
                    onChange={(e) => setNewPost(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Where are you adventuring?"
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                  />
                </div>
              )}

              {newPost.type === 'photo' && (
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    📸 Photo
                  </label>
                  <input
                    type="url"
                    value={newPost.image}
                    onChange={(e) => setNewPost(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="Paste your image URL here (optional)"
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                  />
                  <div className="text-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">or upload from gallery</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 dark:file:bg-green-900 dark:file:text-green-300 transition-all duration-200"
                  />
                  {isUploading && (
                    <div className="text-sm text-green-600 dark:text-green-400 text-center">
                      Uploading photo...
                    </div>
                  )}
                  {newPost.image && (
                    <div className="mt-3">
                      <img
                        src={newPost.image}
                        alt="Post preview"
                        className="w-full h-48 object-cover rounded-xl"
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowCreatePost(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Send className="h-5 w-5" />
                  Share Adventure
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Posts Feed */}
      <div className="space-y-6">
        {communityPosts.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
            <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No posts yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Be the first to share your adventure!
            </p>
          </div>
        ) : (
          communityPosts.map((post) => (
            <div key={post.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              {/* Post Header */}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  {post.user_avatar ? (
                    <img
                      src={post.user_avatar}
                      alt={post.user_name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {post.user_name.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {post.user_name}
                      </h4>
                      <div className={`p-1 rounded-full ${getPostTypeColor(post.type)}`}>
                        {getPostTypeIcon(post.type)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="h-3 w-3" />
                      <span>{formatTimestamp(post.created_at)}</span>
                      {post.location && (
                        <>
                          <span>•</span>
                          <MapPin className="h-3 w-3" />
                          <span>{post.location}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <p className="text-gray-900 dark:text-white mb-4">
                  {post.content}
                </p>

                {/* Post Image */}
                {post.image_url && (
                  <div className="mb-4">
                    <img
                      src={post.image_url}
                      alt="Post content"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Post Actions */}
                <div className="flex items-center gap-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <Heart className="h-5 w-5" />
                    <span>{post.likes_count}</span>
                  </button>
                                   <button 
                   onClick={() => setShowComments(showComments === post.id ? null : post.id)}
                   className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                 >
                   <MessageCircle className="h-5 w-5" />
                   <span>0</span>
                 </button>
                  <button className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <Share className="h-5 w-5" />
                    <span>Share</span>
                  </button>
                                 </div>

                 {/* Comments Section */}
                 {showComments === post.id && (
                   <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
                     {/* Comments coming soon */}
                     <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                       Comments feature coming soon!
                     </div>

                     {/* Add Comment */}
                     <div className="flex gap-3">
                       <img
                         src={currentUser?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'}
                         alt={currentUser?.name}
                         className="w-8 h-8 rounded-full"
                       />
                       <div className="flex-1 flex gap-2">
                         <input
                           type="text"
                           value={newComment}
                           onChange={(e) => setNewComment(e.target.value)}
                           placeholder="Write a comment..."
                           className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                           onKeyPress={(e) => {
                             if (e.key === 'Enter') {
                               handleAddComment(post.id);
                             }
                           }}
                         />
                         <button
                           onClick={() => handleAddComment(post.id)}
                           className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                         >
                           Post
                         </button>
                       </div>
                     </div>
                   </div>
                 )}
               </div>
             </div>
           ))
         )}
       </div>
     </div>
   );
 };

export default CommunityTab;