import React, { useState, useEffect } from 'react';
import {
  Brain,
  TrendingUp,
  Target,
  Award,
  Activity,
  BarChart3,
  Zap,
  Clock,
  MapPin,
  Heart,
  Route,
  Mountain,
  Users,
  Smartphone,
  Watch,
  Settings,
  Sparkles,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

interface UserProfile {
  name: string;
  level: number;
  experience: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  preferences: {
    difficulty: string[];
    activities: string[];
    duration: string;
    distance: string;
  };
  fitnessData: {
    averageHeartRate: number;
    maxHeartRate: number;
    caloriesBurned: number;
    steps: number;
    activeMinutes: number;
  };
  achievements: Achievement[];
  stats: UserStats;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  category: 'distance' | 'trails' | 'time' | 'social' | 'safety' | 'seasonal';
  progress?: number;
  maxProgress?: number;
}

interface UserStats {
  totalDistance: number;
  totalTime: number;
  trailsCompleted: number;
  monthlyGoal: number;
  monthlyProgress: number;
  streakDays: number;
  favoriteRegion: string;
  averageDifficulty: string;
}

interface SmartRecommendation {
  id: string;
  type: 'trail' | 'activity' | 'gear' | 'timing' | 'social';
  title: string;
  description: string;
  confidence: number;
  reasons: string[];
  actionText: string;
  priority: 'high' | 'medium' | 'low';
}

const PersonalizationTab: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [recommendations, setRecommendations] = useState<SmartRecommendation[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'recommendations' | 'analytics' | 'achievements'>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserProfile();
    generateRecommendations();
  }, []);

  const loadUserProfile = () => {
    // Mock user profile data
    const mockProfile: UserProfile = {
      name: 'Anna Liepiņa',
      level: 15,
      experience: 'intermediate',
      preferences: {
        difficulty: ['easy', 'moderate'],
        activities: ['hiking', 'photography', 'nature'],
        duration: '2-4 hours',
        distance: '5-15 km'
      },
      fitnessData: {
        averageHeartRate: 135,
        maxHeartRate: 172,
        caloriesBurned: 2340,
        steps: 23456,
        activeMinutes: 245
      },
      achievements: [
        {
          id: '1',
          title: 'Trail Explorer',
          description: 'Completed 10 different trails',
          icon: '🗺️',
          unlockedAt: '2024-01-10',
          category: 'trails'
        },
        {
          id: '2',
          title: 'Early Bird',
          description: 'Started 5 hikes before sunrise',
          icon: '🌅',
          unlockedAt: '2024-01-08',
          category: 'time'
        },
        {
          id: '3',
          title: 'Distance Walker',
          description: 'Walked 100km total',
          icon: '👣',
          unlockedAt: '2024-01-05',
          category: 'distance'
        },
        {
          id: '4',
          title: 'Social Butterfly',
          description: 'Joined 3 group adventures',
          icon: '👥',
          unlockedAt: '2024-01-12',
          category: 'social'
        },
        {
          id: '5',
          title: 'Weather Warrior',
          description: 'Completed trails in 4 different weather conditions',
          icon: '⛈️',
          unlockedAt: '2024-01-15',
          category: 'seasonal',
          progress: 4,
          maxProgress: 5
        }
      ],
      stats: {
        totalDistance: 127.5,
        totalTime: 2160, // minutes
        trailsCompleted: 15,
        monthlyGoal: 80,
        monthlyProgress: 45,
        streakDays: 7,
        favoriteRegion: 'Gauja National Park',
        averageDifficulty: 'Moderate'
      }
    };

    setUserProfile(mockProfile);
  };

  const generateRecommendations = () => {
    const mockRecommendations: SmartRecommendation[] = [
      {
        id: '1',
        type: 'trail',
        title: 'Perfect Weekend Trail: Kemeri Bog Boardwalk',
        description: 'Based on your preference for easy-moderate trails and nature photography',
        confidence: 95,
        reasons: [
          'Matches your preferred difficulty level',
          'Excellent for nature photography',
          'Weather conditions ideal this weekend',
          'Low crowd levels expected'
        ],
        actionText: 'View Trail Details',
        priority: 'high'
      },
      {
        id: '2',
        type: 'timing',
        title: 'Best Hiking Time: Tomorrow 7:00 AM',
        description: 'Optimal weather window with sunrise photography opportunities',
        confidence: 88,
        reasons: [
          'Clear skies forecasted',
          'Perfect temperature (12°C)',
          'Golden hour lighting',
          'Your highest energy time'
        ],
        actionText: 'Set Reminder',
        priority: 'high'
      },
      {
        id: '3',
        type: 'activity',
        title: 'Try Winter Sports at Sigulda',
        description: 'Expand your adventure portfolio with seasonal activities',
        confidence: 72,
        reasons: [
          'Good snow conditions reported',
          'Matches your fitness level',
          'New achievement opportunities',
          'Popular among similar users'
        ],
        actionText: 'Explore Winter Sports',
        priority: 'medium'
      },
      {
        id: '4',
        type: 'social',
        title: 'Join "Baltic Photographers" Group',
        description: 'Connect with like-minded nature photographers',
        confidence: 84,
        reasons: [
          'Matches your photography interest',
          'Active group with weekly meetups',
          'Similar skill levels',
          'Upcoming event this weekend'
        ],
        actionText: 'Join Group',
        priority: 'medium'
      },
      {
        id: '5',
        type: 'gear',
        title: 'Upgrade Recommendation: Hiking Boots',
        description: 'Better gear for challenging terrains ahead',
        confidence: 76,
        reasons: [
          'Your activity level increasing',
          'Upcoming moderate-hard trails',
          'Current gear usage patterns',
          '25% discount available nearby'
        ],
        actionText: 'Shop Now',
        priority: 'low'
      }
    ];

    setRecommendations(mockRecommendations);
    setLoading(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50 dark:bg-red-900/20';
      case 'medium': return 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low': return 'border-blue-200 bg-blue-50 dark:bg-blue-900/20';
      default: return 'border-gray-200 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'trail': return <MapPin className="h-5 w-5" />;
      case 'activity': return <Activity className="h-5 w-5" />;
      case 'gear': return <Settings className="h-5 w-5" />;
      case 'timing': return <Clock className="h-5 w-5" />;
      case 'social': return <Users className="h-5 w-5" />;
      default: return <Sparkles className="h-5 w-5" />;
    }
  };



  if (loading || !userProfile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nature-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading personalization...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          AI Personalization
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Smart recommendations and insights tailored to your adventure style
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          {[
            { id: 'overview', label: 'Overview', icon: Brain },
            { id: 'recommendations', label: 'Smart Recommendations', icon: Sparkles },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'achievements', label: 'Achievements', icon: Award }
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

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Profile Summary */}
          <div className="glass-morphism rounded-lg p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-nature-500 to-adventure-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {userProfile.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{userProfile.name}</h2>
                <p className="text-gray-600 dark:text-gray-400">Level {userProfile.level} • {userProfile.experience} adventurer</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="flex items-center text-sm text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    {userProfile.stats.streakDays} day streak
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Favorite region: {userProfile.stats.favoriteRegion}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Route className="h-6 w-6 mx-auto text-green-600 mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{userProfile.stats.totalDistance}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">km explored</p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Mountain className="h-6 w-6 mx-auto text-blue-600 mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{userProfile.stats.trailsCompleted}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">trails completed</p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Clock className="h-6 w-6 mx-auto text-purple-600 mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{Math.round(userProfile.stats.totalTime / 60)}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">hours active</p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Heart className="h-6 w-6 mx-auto text-red-600 mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{userProfile.fitnessData.averageHeartRate}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">avg heart rate</p>
              </div>
            </div>
          </div>

          {/* Monthly Progress */}
          <div className="glass-morphism rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2 text-green-600" />
              Monthly Goal Progress
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">Distance Goal</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {userProfile.stats.monthlyProgress}km / {userProfile.stats.monthlyGoal}km
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-500 to-nature-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(userProfile.stats.monthlyProgress / userProfile.stats.monthlyGoal) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {userProfile.stats.monthlyGoal - userProfile.stats.monthlyProgress}km remaining to reach your goal
              </p>
            </div>
          </div>

          {/* Fitness Integration */}
          <div className="glass-morphism rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-blue-600" />
              Fitness Integration
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <Watch className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">Apple Health</p>
                <p className="text-xs text-green-600">Connected</p>
              </div>
              <div className="text-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <Smartphone className="h-8 w-8 mx-auto text-orange-600 mb-2" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">Strava</p>
                <p className="text-xs text-green-600">Connected</p>
              </div>
              <div className="text-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg border-dashed">
                <Zap className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Garmin</p>
                <p className="text-xs text-blue-600 cursor-pointer">Connect</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations Tab */}
      {activeTab === 'recommendations' && (
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div key={rec.id} className={`glass-morphism rounded-lg p-6 border-l-4 ${getPriorityColor(rec.priority)}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-nature-100 dark:bg-nature-900/30 rounded-lg text-nature-600">
                    {getTypeIcon(rec.type)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {rec.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {rec.description}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    rec.priority === 'high' ? 'bg-red-100 text-red-600' :
                    rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {rec.priority} priority
                  </span>
                  <span className="text-sm text-gray-500 mt-1">{rec.confidence}% match</span>
                </div>
              </div>

              {/* Confidence Bar */}
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-nature-500 to-green-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${rec.confidence}%` }}
                  ></div>
                </div>
              </div>

              {/* Reasons */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Why this recommendation?</h4>
                <ul className="space-y-1">
                  {rec.reasons.map((reason, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <button className="flex items-center space-x-2 bg-nature-600 text-white px-4 py-2 rounded-lg hover:bg-nature-700 transition-colors">
                <span>{rec.actionText}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Weekly Progress Chart */}
          <div className="glass-morphism rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Weekly Activity
            </h3>
            <div className="h-64 flex items-end justify-between space-x-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                const height = Math.random() * 80 + 20; // Mock data
                return (
                  <div key={day} className="flex flex-col items-center flex-1">
                    <div 
                      className="w-full bg-gradient-to-t from-nature-500 to-nature-300 rounded-t"
                      style={{ height: `${height}%` }}
                    ></div>
                    <span className="text-xs text-gray-600 dark:text-gray-400 mt-2">{day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-morphism rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Activity Breakdown</h4>
              <div className="space-y-3">
                {[
                  { activity: 'Hiking', percentage: 65, color: 'bg-green-500' },
                  { activity: 'Photography', percentage: 20, color: 'bg-blue-500' },
                  { activity: 'Nature Study', percentage: 10, color: 'bg-yellow-500' },
                  { activity: 'Cycling', percentage: 5, color: 'bg-purple-500' }
                ].map((item) => (
                  <div key={item.activity}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700 dark:text-gray-300">{item.activity}</span>
                      <span className="text-gray-900 dark:text-white">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${item.color} h-2 rounded-full`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-morphism rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Performance Trends</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Average Pace</span>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-green-600 font-medium">+15%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Endurance</span>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-green-600 font-medium">+8%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Trail Difficulty</span>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                    <span className="text-blue-600 font-medium">+12%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {userProfile.achievements.length} Achievements Unlocked
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Keep exploring to unlock new badges and milestones!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userProfile.achievements.map((achievement) => (
              <div key={achievement.id} className="glass-morphism rounded-lg p-6 text-center">
                <div className="text-4xl mb-3">{achievement.icon}</div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {achievement.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {achievement.description}
                </p>
                
                {achievement.progress && achievement.maxProgress ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Progress</span>
                      <span>{achievement.progress}/{achievement.maxProgress}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-adventure-500 to-nature-500 h-2 rounded-full"
                        style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-1 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Completed</span>
                  </div>
                )}
                
                <p className="text-xs text-gray-500 mt-2">
                  {achievement.progress ? 'In Progress' : `Unlocked: ${achievement.unlockedAt}`}
                </p>
              </div>
            ))}
          </div>

          {/* Upcoming Achievements */}
          <div className="glass-morphism rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Upcoming Achievements</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'Century Walker', description: 'Walk 200km total', progress: 127.5, max: 200, icon: '💯' },
                { title: 'All Seasons Explorer', description: 'Complete trails in all 4 seasons', progress: 2, max: 4, icon: '🌺' },
                { title: 'Night Owl', description: 'Complete 3 night hikes', progress: 0, max: 3, icon: '🦉' },
                { title: 'Peak Seeker', description: 'Visit 5 highest points in Latvia', progress: 1, max: 5, icon: '⛰️' }
              ].map((upcoming, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-2xl opacity-50">{upcoming.icon}</span>
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white">{upcoming.title}</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{upcoming.description}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Progress</span>
                      <span>{upcoming.progress}/{upcoming.max}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gray-400 h-2 rounded-full"
                        style={{ width: `${(upcoming.progress / upcoming.max) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalizationTab;