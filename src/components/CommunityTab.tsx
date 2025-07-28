import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import {
  Users,
  Camera,
  MapPin,
  Clock,
  Heart,
  MessageCircle,
  Share,
  Trophy,
  Send
} from 'lucide-react';

const CommunityTab: React.FC = () => {
  const { currentUser, isLoggedIn, communityPosts, addCommunityPost, toggleLike } = useUser();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({
    content: '',
    type: 'photo' as 'photo' | 'check-in' | 'review' | 'achievement',
    location: '',
    image: ''
  });

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.content.trim()) return;

    addCommunityPost({
      type: newPost.type,
      content: newPost.content,
      location: newPost.location || undefined,
      image: newPost.image || undefined
    });

    // Reset form
    setNewPost({
      content: '',
      type: 'photo',
      location: '',
      image: ''
    });
    setShowCreatePost(false);
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
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-4 mb-4">
          <img
            src={currentUser?.avatar || 'https://picsum.photos/40/40?random=300'}
            alt={currentUser?.name}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1">
            <button
              onClick={() => setShowCreatePost(true)}
              className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <span className="text-gray-500 dark:text-gray-400">
                Share your adventure, {currentUser?.name}...
              </span>
            </button>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => {
              setNewPost(prev => ({ ...prev, type: 'photo' }));
              setShowCreatePost(true);
            }}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          >
            <Camera className="h-5 w-5" />
            <span>Photo</span>
          </button>
          <button
            onClick={() => {
              setNewPost(prev => ({ ...prev, type: 'check-in' }));
              setShowCreatePost(true);
            }}
            className="flex items-center gap-2 px-4 py-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
          >
            <MapPin className="h-5 w-5" />
            <span>Check-in</span>
          </button>
          <button
            onClick={() => {
              setNewPost(prev => ({ ...prev, type: 'achievement' }));
              setShowCreatePost(true);
            }}
            className="flex items-center gap-2 px-4 py-2 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors"
          >
            <Trophy className="h-5 w-5" />
            <span>Achievement</span>
          </button>
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Create Post
              </h3>
              <button
                onClick={() => setShowCreatePost(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitPost} className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className={`p-2 rounded-lg ${getPostTypeColor(newPost.type)}`}>
                  {getPostTypeIcon(newPost.type)}
                </div>
                <span className="font-medium text-gray-900 dark:text-white capitalize">
                  {newPost.type}
                </span>
              </div>

              <textarea
                value={newPost.content}
                onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Share your adventure..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                rows={4}
                required
              />

              {newPost.type === 'check-in' && (
                <input
                  type="text"
                  value={newPost.location}
                  onChange={(e) => setNewPost(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Where are you?"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              )}

              {newPost.type === 'photo' && (
                <input
                  type="url"
                  value={newPost.image}
                  onChange={(e) => setNewPost(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="Image URL (optional)"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreatePost(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  Post
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
                  <img
                    src={post.userAvatar}
                    alt={post.userName}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {post.userName}
                      </h4>
                      <div className={`p-1 rounded-full ${getPostTypeColor(post.type)}`}>
                        {getPostTypeIcon(post.type)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="h-3 w-3" />
                      <span>{formatTimestamp(post.timestamp)}</span>
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
                {post.image && (
                  <div className="mb-4">
                    <img
                      src={post.image}
                      alt="Post content"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Post Actions */}
                <div className="flex items-center gap-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      post.likedBy.includes(currentUser?.id || '')
                        ? 'text-red-600 bg-red-50 dark:bg-red-900/20'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${post.likedBy.includes(currentUser?.id || '') ? 'fill-current' : ''}`} />
                    <span>{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <MessageCircle className="h-5 w-5" />
                    <span>{post.comments.length}</span>
                  </button>
                  <button className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <Share className="h-5 w-5" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommunityTab;