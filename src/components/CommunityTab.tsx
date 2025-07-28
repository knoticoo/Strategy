import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Users,
  Camera,
  MapPin,
  Clock,
  Heart,
  MessageCircle,
  Share,
  AlertTriangle,
  CheckCircle,
  User,
  Plus,
  Filter,
  Search,
  Star,
  Calendar,
  Trophy,
  Target
} from 'lucide-react';

interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userLevel: number;
  trailId: string;
  trailName: string;
  location: string;
  content: string;
  images: string[];
  timestamp: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  type: 'photo' | 'condition' | 'checkin' | 'achievement';
  conditions?: {
    difficulty: 'easy' | 'moderate' | 'hard' | 'extreme';
    weather: string;
    crowdLevel: 'low' | 'medium' | 'high';
    hazards: string[];
  };
}

interface AdventureGroup {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  image: string;
  category: 'hiking' | 'cycling' | 'photography' | 'families' | 'experts';
  nextEvent: {
    title: string;
    date: string;
    location: string;
    participants: number;
  };
  isJoined: boolean;
}

const CommunityTab: React.FC = () => {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [groups, setGroups] = useState<AdventureGroup[]>([]);
  const [activeTab, setActiveTab] = useState<'feed' | 'groups' | 'live'>('feed');
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({
    content: '',
    trailId: '',
    type: 'photo' as const
  });

  useEffect(() => {
    loadCommunityData();
  }, []);

  const loadCommunityData = async () => {
    setLoading(true);
    
    // Mock community posts
    const mockPosts: CommunityPost[] = [
      {
        id: '1',
        userId: 'user1',
        userName: 'Anna Liepiņa',
        userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?w=100&h=100&fit=crop&crop=face',
        userLevel: 15,
        trailId: '1',
        trailName: 'Gauja National Park',
        location: 'Sigulda, Vidzeme',
        content: 'Amazing sunrise hike this morning! The autumn colors are absolutely stunning. Trail conditions are perfect, but bring warm clothes - it\'s getting chilly! 🍂❄️',
        images: [
          'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop',
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop'
        ],
        timestamp: '2 hours ago',
        likes: 24,
        comments: 8,
        isLiked: false,
        type: 'photo',
        conditions: {
          difficulty: 'moderate',
          weather: 'Clear, 5°C',
          crowdLevel: 'low',
          hazards: ['Slippery leaves', 'Cold morning']
        }
      },
      {
        id: '2',
        userId: 'user2',
        userName: 'Jānis Bērziņš',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        userLevel: 22,
        trailId: '3',
        trailName: 'Kemeri Bog Boardwalk',
        location: 'Kemeri National Park',
        content: '⚠️ TRAIL UPDATE: Boardwalk section 3 is temporarily closed for repairs. Use alternative route via observation tower. Still beautiful though!',
        images: ['https://images.unsplash.com/photo-1574263867128-97b9d4b09c0b?w=600&h=400&fit=crop'],
        timestamp: '4 hours ago',
        likes: 45,
        comments: 12,
        isLiked: true,
        type: 'condition',
        conditions: {
          difficulty: 'easy',
          weather: 'Foggy, 8°C',
          crowdLevel: 'medium',
          hazards: ['Closed boardwalk section', 'Slippery boards']
        }
      },
      {
        id: '3',
        userId: 'user3',
        userName: 'Laura Ozola',
        userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        userLevel: 8,
        trailId: '2',
        trailName: 'Jūrmala Coastal Trail',
        location: 'Jūrmala Beach',
        content: '🏆 Just completed my 10th trail this month! Earned the "Coastal Explorer" badge. The sunset here is unreal! Perfect evening for a beach walk.',
        images: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop'],
        timestamp: '6 hours ago',
        likes: 31,
        comments: 15,
        isLiked: false,
        type: 'achievement'
      },
      {
        id: '4',
        userId: 'user4',
        userName: 'Mārtiņš Kalns',
        userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        userLevel: 35,
        trailId: '4',
        trailName: 'Rāzna Lake Circuit',
        location: 'Rāzna National Park',
        content: '📍 Currently at the halfway point of Rāzna Lake Circuit. Weather is perfect, trail is challenging but rewarding. Spotted some deer! 🦌',
        images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop'],
        timestamp: '1 hour ago',
        likes: 18,
        comments: 5,
        isLiked: true,
        type: 'checkin',
        conditions: {
          difficulty: 'hard',
          weather: 'Sunny, 12°C',
          crowdLevel: 'low',
          hazards: []
        }
      }
    ];

    const mockGroups: AdventureGroup[] = [
      {
        id: '1',
        name: 'Riga Hiking Club',
        description: 'Weekly hikes around Riga and beyond. All skill levels welcome!',
        memberCount: 234,
        image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=300&h=200&fit=crop',
        category: 'hiking',
        nextEvent: {
          title: 'Autumn Colors Hike',
          date: 'Saturday, 10:00 AM',
          location: 'Gauja National Park',
          participants: 18
        },
        isJoined: true
      },
      {
        id: '2',
        name: 'Baltic Photographers',
        description: 'Capture Latvia\'s natural beauty. Photography meetups and workshops.',
        memberCount: 156,
        image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=300&h=200&fit=crop',
        category: 'photography',
        nextEvent: {
          title: 'Golden Hour Shoot',
          date: 'Sunday, 6:00 PM',
          location: 'Jūrmala Sunset Point',
          participants: 12
        },
        isJoined: false
      },
      {
        id: '3',
        name: 'Family Adventure Group',
        description: 'Family-friendly outdoor activities and easy trails for kids.',
        memberCount: 189,
        image: 'https://images.unsplash.com/photo-1475503572774-15a45e5d60b9?w=300&h=200&fit=crop',
        category: 'families',
        nextEvent: {
          title: 'Nature Discovery Walk',
          date: 'Saturday, 2:00 PM',
          location: 'Kemeri Bog',
          participants: 25
        },
        isJoined: true
      },
      {
        id: '4',
        name: 'Cycling Latvia',
        description: 'Explore Latvia on two wheels. Road cycling and mountain biking.',
        memberCount: 312,
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
        category: 'cycling',
        nextEvent: {
          title: 'Coastal Ride Challenge',
          date: 'Sunday, 9:00 AM',
          location: 'Venta Rapids Route',
          participants: 32
        },
        isJoined: false
      }
    ];

    setPosts(mockPosts);
    setGroups(mockGroups);
    setLoading(false);
  };

  const toggleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const toggleGroupJoin = (groupId: string) => {
    setGroups(groups.map(group =>
      group.id === groupId
        ? {
            ...group,
            isJoined: !group.isJoined,
            memberCount: group.isJoined ? group.memberCount - 1 : group.memberCount + 1
          }
        : group
    ));
  };

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'photo': return <Camera className="h-4 w-4" />;
      case 'condition': return <AlertTriangle className="h-4 w-4" />;
      case 'checkin': return <MapPin className="h-4 w-4" />;
      case 'achievement': return <Trophy className="h-4 w-4" />;
      default: return <Camera className="h-4 w-4" />;
    }
  };

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'photo': return 'text-blue-600';
      case 'condition': return 'text-orange-600';
      case 'checkin': return 'text-green-600';
      case 'achievement': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'hiking': return '🥾';
      case 'cycling': return '🚴‍♂️';
      case 'photography': return '📸';
      case 'families': return '👨‍👩‍👧‍👦';
      case 'experts': return '⛰️';
      default: return '🌲';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nature-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading community...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Adventure Community
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Connect with fellow adventurers, share experiences, and discover new trails together
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          {[
            { id: 'feed', label: 'Community Feed', icon: Users },
            { id: 'groups', label: 'Adventure Groups', icon: Target },
            { id: 'live', label: 'Live Updates', icon: Clock }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-600 text-nature-600 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Create Post Button */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowCreatePost(true)}
          className="flex items-center space-x-2 bg-nature-600 text-white px-6 py-3 rounded-lg hover:bg-nature-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Share Your Adventure</span>
        </button>
      </div>

      {/* Content */}
      {activeTab === 'feed' && (
        <div className="max-w-2xl mx-auto space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="glass-morphism rounded-xl p-6">
              {/* Post Header */}
              <div className="flex items-start space-x-3 mb-4">
                <img
                  src={post.userAvatar}
                  alt={post.userName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {post.userName}
                    </h3>
                    <span className="px-2 py-1 bg-adventure-100 dark:bg-adventure-900/30 text-adventure-700 dark:text-adventure-300 text-xs rounded-full">
                      Level {post.userLevel}
                    </span>
                    <span className={`${getPostTypeColor(post.type)}`}>
                      {getPostTypeIcon(post.type)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400 mt-1">
                    <MapPin className="h-3 w-3" />
                    <span>{post.trailName}</span>
                    <span>•</span>
                    <span>{post.timestamp}</span>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {post.content}
              </p>

              {/* Post Images */}
              {post.images.length > 0 && (
                <div className={`grid gap-2 mb-4 ${
                  post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
                }`}>
                  {post.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt="Adventure"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}

              {/* Trail Conditions */}
              {post.conditions && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Trail Conditions</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Difficulty:</span>
                      <span className="ml-1 font-medium capitalize">{post.conditions.difficulty}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Weather:</span>
                      <span className="ml-1 font-medium">{post.conditions.weather}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Crowd Level:</span>
                      <span className="ml-1 font-medium capitalize">{post.conditions.crowdLevel}</span>
                    </div>
                    {post.conditions.hazards.length > 0 && (
                      <div className="col-span-2">
                        <span className="text-gray-600 dark:text-gray-400">Hazards:</span>
                        <span className="ml-1 font-medium text-orange-600">{post.conditions.hazards.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Post Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className={`flex items-center space-x-1 transition-colors ${
                      post.isLiked 
                        ? 'text-red-600' 
                        : 'text-gray-600 dark:text-gray-400 hover:text-red-600'
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                    <span className="text-sm">{post.likes}</span>
                  </button>
                  <button className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-sm">{post.comments}</span>
                  </button>
                  <button className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-green-600 transition-colors">
                    <Share className="h-4 w-4" />
                    <span className="text-sm">Share</span>
                  </button>
                </div>
                <span className="text-xs text-gray-500">{post.location}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'groups' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {groups.map((group) => (
            <div key={group.id} className="glass-morphism rounded-xl p-6">
              <div className="relative h-32 rounded-lg overflow-hidden mb-4">
                <img
                  src={group.image}
                  alt={group.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2">
                  <span className="text-2xl">{getCategoryIcon(group.category)}</span>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {group.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                {group.description}
              </p>

              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <span className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {group.memberCount} members
                </span>
              </div>

              {/* Next Event */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">Next Event</h4>
                <p className="text-sm font-medium text-nature-600">{group.nextEvent.title}</p>
                <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mt-1">
                  <span className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {group.nextEvent.date}
                  </span>
                  <span>{group.nextEvent.participants} going</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{group.nextEvent.location}</p>
              </div>

              <button
                onClick={() => toggleGroupJoin(group.id)}
                className={`w-full py-2 px-4 rounded-lg transition-colors ${
                  group.isJoined
                    ? 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                    : 'bg-nature-600 text-white hover:bg-nature-700'
                }`}
              >
                {group.isJoined ? 'Leave Group' : 'Join Group'}
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'live' && (
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Live Trail Conditions */}
            <div className="glass-morphism rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
                Live Trail Conditions
              </h3>
              <div className="space-y-3">
                {posts.filter(p => p.conditions).map((post) => (
                  <div key={post.id} className="border-l-4 border-orange-500 pl-3">
                    <h4 className="font-medium text-gray-900 dark:text-white">{post.trailName}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{post.content}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                      <span>{post.userName}</span>
                      <span>•</span>
                      <span>{post.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Adventurers */}
            <div className="glass-morphism rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                Active Adventurers
              </h3>
              <div className="space-y-3">
                {posts.filter(p => p.type === 'checkin').map((post) => (
                  <div key={post.id} className="flex items-center space-x-3">
                    <img
                      src={post.userAvatar}
                      alt={post.userName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {post.userName}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Currently at {post.trailName}
                      </p>
                    </div>
                    <span className="text-xs text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                      Live
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="glass-morphism rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Share Your Adventure
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Post Type
                </label>
                <select
                  value={newPost.type}
                  onChange={(e) => setNewPost({...newPost, type: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-nature-500"
                >
                  <option value="photo">Photo Share</option>
                  <option value="condition">Trail Condition Update</option>
                  <option value="checkin">Check-in</option>
                  <option value="achievement">Achievement</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Message
                </label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  placeholder="Share your adventure experience..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-nature-500"
                  rows={4}
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowCreatePost(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Add post logic here
                  setShowCreatePost(false);
                }}
                className="flex-1 px-4 py-2 bg-nature-600 text-white rounded-lg hover:bg-nature-700 transition-colors"
              >
                Share
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityTab;