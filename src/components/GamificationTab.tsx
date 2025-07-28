import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Trophy,
  Medal,
  Zap,
  Target,
  Crown,
  Star,
  Fire,
  Gift,
  Users,
  Calendar,
  Clock,
  TrendingUp,
  Award,
  Gamepad2,
  Timer,
  MapPin,
  Mountain,
  Route,
  CheckCircle,
  Lock,
  Unlock,
  ArrowRight,
  Plus,
  Sparkles,
  BarChart3
} from 'lucide-react';

interface UserLevel {
  current: number;
  title: string;
  xp: number;
  nextLevelXp: number;
  totalXp: number;
  rewards: string[];
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'seasonal' | 'special';
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  xpReward: number;
  badgeReward?: string;
  progress: number;
  maxProgress: number;
  timeLeft: string;
  participants: number;
  isCompleted: boolean;
  isLocked: boolean;
  requirements?: string[];
}

interface Leaderboard {
  id: string;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  rank: number;
  monthlyDistance: number;
  streak: number;
  achievements: number;
  isCurrentUser?: boolean;
}

interface Streak {
  current: number;
  longest: number;
  type: 'daily' | 'weekly';
  lastActivity: string;
  multiplier: number;
  rewards: StreakReward[];
}

interface StreakReward {
  day: number;
  reward: string;
  claimed: boolean;
  type: 'xp' | 'badge' | 'unlock';
}

interface SeasonalEvent {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  theme: string;
  rewards: string[];
  progress: number;
  maxProgress: number;
  participants: number;
  isActive: boolean;
}

const GamificationTab: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'overview' | 'challenges' | 'leaderboards' | 'achievements' | 'events'>('overview');
  const [userLevel, setUserLevel] = useState<UserLevel | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [leaderboard, setLeaderboard] = useState<Leaderboard[]>([]);
  const [streak, setStreak] = useState<Streak | null>(null);
  const [seasonalEvents, setSeasonalEvents] = useState<SeasonalEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGamificationData();
  }, []);

  const loadGamificationData = () => {
    // Mock user level data
    const mockUserLevel: UserLevel = {
      current: 15,
      title: 'Trail Explorer',
      xp: 2340,
      nextLevelXp: 2500,
      totalXp: 8740,
      rewards: ['New trail unlocked', 'XP Boost +10%', 'Exclusive badge']
    };

    // Mock challenges
    const mockChallenges: Challenge[] = [
      {
        id: '1',
        title: 'Daily Distance Goal',
        description: 'Walk 5km today',
        type: 'daily',
        difficulty: 'easy',
        xpReward: 50,
        progress: 3.2,
        maxProgress: 5,
        timeLeft: '4h 23m',
        participants: 1234,
        isCompleted: false,
        isLocked: false
      },
      {
        id: '2',
        title: 'Weekend Warrior',
        description: 'Complete 3 trails this weekend',
        type: 'weekly',
        difficulty: 'medium',
        xpReward: 200,
        badgeReward: 'Weekend Explorer',
        progress: 1,
        maxProgress: 3,
        timeLeft: '2d 14h',
        participants: 567,
        isCompleted: false,
        isLocked: false
      },
      {
        id: '3',
        title: 'Sunrise Hunter',
        description: 'Start 5 hikes before sunrise',
        type: 'monthly',
        difficulty: 'hard',
        xpReward: 500,
        badgeReward: 'Early Bird Master',
        progress: 2,
        maxProgress: 5,
        timeLeft: '18d 6h',
        participants: 234,
        isCompleted: false,
        isLocked: false
      },
      {
        id: '4',
        title: 'Winter Explorer',
        description: 'Complete 10 winter sports activities',
        type: 'seasonal',
        difficulty: 'extreme',
        xpReward: 1000,
        badgeReward: 'Winter Champion',
        progress: 0,
        maxProgress: 10,
        timeLeft: '45d 12h',
        participants: 89,
        isCompleted: false,
        isLocked: false
      },
      {
        id: '5',
        title: 'Photography Master',
        description: 'Share 20 trail photos with the community',
        type: 'special',
        difficulty: 'medium',
        xpReward: 300,
        badgeReward: 'Photo Pro',
        progress: 8,
        maxProgress: 20,
        timeLeft: 'No limit',
        participants: 445,
        isCompleted: false,
        isLocked: false
      },
      {
        id: '6',
        title: 'Peak Conqueror',
        description: 'Reach all 5 highest points in Latvia',
        type: 'special',
        difficulty: 'extreme',
        xpReward: 2000,
        badgeReward: 'Summit Master',
        progress: 0,
        maxProgress: 5,
        timeLeft: 'No limit',
        participants: 67,
        isCompleted: false,
        isLocked: true,
        requirements: ['Reach level 20', 'Complete 50 trails']
      }
    ];

    // Mock leaderboard
    const mockLeaderboard: Leaderboard[] = [
      {
        id: '1',
        name: 'Mārtiņš Kalns',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        level: 28,
        xp: 15680,
        rank: 1,
        monthlyDistance: 145.3,
        streak: 23,
        achievements: 47
      },
      {
        id: '2',
        name: 'Laura Ozola',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        level: 25,
        xp: 12450,
        rank: 2,
        monthlyDistance: 132.8,
        streak: 18,
        achievements: 39
      },
      {
        id: '3',
        name: 'Anna Liepiņa',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?w=100&h=100&fit=crop&crop=face',
        level: 15,
        xp: 8740,
        rank: 3,
        monthlyDistance: 87.5,
        streak: 7,
        achievements: 24,
        isCurrentUser: true
      },
      {
        id: '4',
        name: 'Jānis Bērziņš',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        level: 22,
        xp: 11230,
        rank: 4,
        monthlyDistance: 95.2,
        streak: 12,
        achievements: 35
      },
      {
        id: '5',
        name: 'Kristīne Zariņa',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
        level: 19,
        xp: 9890,
        rank: 5,
        monthlyDistance: 78.9,
        streak: 9,
        achievements: 28
      }
    ];

    // Mock streak data
    const mockStreak: Streak = {
      current: 7,
      longest: 23,
      type: 'daily',
      lastActivity: '2024-01-15',
      multiplier: 1.7,
      rewards: [
        { day: 3, reward: '50 XP Bonus', claimed: true, type: 'xp' },
        { day: 7, reward: 'Streak Badge', claimed: false, type: 'badge' },
        { day: 14, reward: '2x XP Multiplier', claimed: false, type: 'unlock' },
        { day: 30, reward: 'Elite Trail Access', claimed: false, type: 'unlock' }
      ]
    };

    // Mock seasonal events
    const mockSeasonalEvents: SeasonalEvent[] = [
      {
        id: '1',
        title: 'Winter Adventure Challenge',
        description: 'Explore Latvia\'s winter wonderland with special challenges and exclusive rewards',
        startDate: '2024-01-01',
        endDate: '2024-02-29',
        theme: 'winter',
        rewards: ['Winter Explorer Badge', '500 XP', 'Exclusive Winter Gear'],
        progress: 45,
        maxProgress: 100,
        participants: 1250,
        isActive: true
      },
      {
        id: '2',
        title: 'Spring Awakening',
        description: 'Celebrate spring with nature photography and flower spotting challenges',
        startDate: '2024-03-01',
        endDate: '2024-05-31',
        theme: 'spring',
        rewards: ['Nature Photographer Badge', '750 XP', 'Premium Camera Guide'],
        progress: 0,
        maxProgress: 100,
        participants: 0,
        isActive: false
      }
    ];

    setUserLevel(mockUserLevel);
    setChallenges(mockChallenges);
    setLeaderboard(mockLeaderboard);
    setStreak(mockStreak);
    setSeasonalEvents(mockSeasonalEvents);
    setLoading(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'medium': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      case 'hard': return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20';
      case 'extreme': return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'daily': return <Calendar className="h-4 w-4" />;
      case 'weekly': return <Clock className="h-4 w-4" />;
      case 'monthly': return <Target className="h-4 w-4" />;
      case 'seasonal': return <Sparkles className="h-4 w-4" />;
      case 'special': return <Crown className="h-4 w-4" />;
      default: return <Trophy className="h-4 w-4" />;
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Award className="h-5 w-5 text-orange-500" />;
      default: return <span className="text-gray-600 font-semibold">#{rank}</span>;
    }
  };

  if (loading || !userLevel || !streak) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nature-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading gamification...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Adventure Gamification
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Level up your outdoor adventures with challenges, achievements, and rewards
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: Trophy },
            { id: 'challenges', label: 'Challenges', icon: Target },
            { id: 'leaderboards', label: 'Leaderboards', icon: Crown },
            { id: 'achievements', label: 'Achievements', icon: Award },
            { id: 'events', label: 'Events', icon: Sparkles }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded transition-colors whitespace-nowrap ${
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
          {/* Level Progress */}
          <div className="glass-morphism rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {userLevel.current}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{userLevel.title}</h2>
                  <p className="text-gray-600 dark:text-gray-400">Level {userLevel.current}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{userLevel.xp.toLocaleString()}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total XP</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700 dark:text-gray-300">Progress to Level {userLevel.current + 1}</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {userLevel.xp} / {userLevel.nextLevelXp} XP
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(userLevel.xp / userLevel.nextLevelXp) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {userLevel.nextLevelXp - userLevel.xp} XP to next level
              </p>
            </div>

            {/* Level Rewards */}
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Next Level Rewards:</h4>
              <ul className="space-y-1">
                {userLevel.rewards.map((reward, index) => (
                  <li key={index} className="flex items-center text-sm text-yellow-700 dark:text-yellow-300">
                    <Gift className="h-3 w-3 mr-2" />
                    {reward}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Streak Progress */}
            <div className="glass-morphism rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Fire className="h-5 w-5 mr-2 text-orange-600" />
                Activity Streak
              </h3>
              
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-orange-600 mb-2">{streak.current}</div>
                <p className="text-gray-600 dark:text-gray-400">Day Streak</p>
                <p className="text-sm text-gray-500">
                  Personal best: {streak.longest} days
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700 dark:text-gray-300">XP Multiplier</span>
                  <span className="text-orange-600 font-medium">{streak.multiplier}x</span>
                </div>
                
                {/* Streak Rewards */}
                <div className="space-y-2">
                  {streak.rewards.map((reward) => (
                    <div key={reward.day} className={`flex items-center justify-between p-2 rounded ${
                      reward.claimed ? 'bg-green-50 dark:bg-green-900/20' : 
                      streak.current >= reward.day ? 'bg-blue-50 dark:bg-blue-900/20' :
                      'bg-gray-50 dark:bg-gray-700'
                    }`}>
                      <span className="text-sm">Day {reward.day}: {reward.reward}</span>
                      {reward.claimed ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : streak.current >= reward.day ? (
                        <button className="text-blue-600 text-xs font-medium">Claim</button>
                      ) : (
                        <Lock className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="glass-morphism rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Stats</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Crown className="h-6 w-6 mx-auto text-yellow-600 mb-2" />
                  <p className="text-xl font-bold text-gray-900 dark:text-white">#3</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Global Rank</p>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Target className="h-6 w-6 mx-auto text-blue-600 mb-2" />
                  <p className="text-xl font-bold text-gray-900 dark:text-white">5/8</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Challenges</p>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Award className="h-6 w-6 mx-auto text-purple-600 mb-2" />
                  <p className="text-xl font-bold text-gray-900 dark:text-white">24</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Achievements</p>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Users className="h-6 w-6 mx-auto text-green-600 mb-2" />
                  <p className="text-xl font-bold text-gray-900 dark:text-white">156</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Friends</p>
                </div>
              </div>
            </div>
          </div>

          {/* Active Seasonal Event */}
          {seasonalEvents.filter(event => event.isActive).map((event) => (
            <div key={event.id} className="glass-morphism rounded-lg p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
                  {event.title}
                </h3>
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm rounded-full">
                  Active Event
                </span>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-4">{event.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{event.participants}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Participants</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{event.progress}%</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Progress</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{event.endDate}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Ends</p>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                  style={{ width: `${event.progress}%` }}
                ></div>
              </div>
              
              <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors">
                Join Event
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Challenges Tab */}
      {activeTab === 'challenges' && (
        <div className="space-y-4">
          {challenges.map((challenge) => (
            <div key={challenge.id} className={`glass-morphism rounded-lg p-6 ${
              challenge.isLocked ? 'opacity-60' : ''
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${
                    challenge.isCompleted ? 'bg-green-100 text-green-600' :
                    challenge.isLocked ? 'bg-gray-100 text-gray-400' :
                    'bg-nature-100 dark:bg-nature-900/30 text-nature-600'
                  }`}>
                    {challenge.isLocked ? <Lock className="h-5 w-5" /> : getTypeIcon(challenge.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {challenge.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      {challenge.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className={`px-2 py-1 rounded-full ${getDifficultyColor(challenge.difficulty)}`}>
                        {challenge.difficulty}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {challenge.participants} participants
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {challenge.timeLeft}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {challenge.xpReward} XP
                    </span>
                  </div>
                  {challenge.badgeReward && (
                    <div className="flex items-center space-x-2">
                      <Medal className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-blue-600">{challenge.badgeReward}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Challenge Requirements (for locked challenges) */}
              {challenge.isLocked && challenge.requirements && (
                <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Requirements:</h4>
                  <ul className="space-y-1">
                    {challenge.requirements.map((req, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Lock className="h-3 w-3 mr-2" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Progress Bar */}
              {!challenge.isLocked && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700 dark:text-gray-300">Progress</span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {challenge.progress} / {challenge.maxProgress}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        challenge.isCompleted ? 'bg-green-500' : 'bg-gradient-to-r from-nature-500 to-blue-500'
                      }`}
                      style={{ width: `${Math.min((challenge.progress / challenge.maxProgress) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="mt-4">
                {challenge.isCompleted ? (
                  <button className="w-full bg-green-600 text-white py-2 rounded-lg cursor-default">
                    <CheckCircle className="h-4 w-4 inline mr-2" />
                    Completed
                  </button>
                ) : challenge.isLocked ? (
                  <button className="w-full bg-gray-400 text-white py-2 rounded-lg cursor-not-allowed">
                    <Lock className="h-4 w-4 inline mr-2" />
                    Locked
                  </button>
                ) : (
                  <button className="w-full bg-nature-600 text-white py-2 rounded-lg hover:bg-nature-700 transition-colors">
                    <Target className="h-4 w-4 inline mr-2" />
                    Continue Challenge
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Leaderboards Tab */}
      {activeTab === 'leaderboards' && (
        <div className="space-y-6">
          <div className="glass-morphism rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Monthly Leaderboard
            </h3>
            
            <div className="space-y-3">
              {leaderboard.map((user) => (
                <div key={user.id} className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                  user.isCurrentUser 
                    ? 'border-nature-200 bg-nature-50 dark:border-nature-700 dark:bg-nature-900/20' 
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8 h-8">
                      {getRankIcon(user.rank)}
                    </div>
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {user.name}
                        {user.isCurrentUser && (
                          <span className="ml-2 px-2 py-1 bg-nature-100 dark:bg-nature-900/30 text-nature-700 dark:text-nature-300 text-xs rounded-full">
                            You
                          </span>
                        )}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Level {user.level} • {user.achievements} achievements
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <p className="font-semibold text-gray-900 dark:text-white">{user.xp.toLocaleString()}</p>
                        <p className="text-gray-600 dark:text-gray-400">XP</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-gray-900 dark:text-white">{user.monthlyDistance}km</p>
                        <p className="text-gray-600 dark:text-gray-400">Distance</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-gray-900 dark:text-white flex items-center">
                          <Fire className="h-3 w-3 text-orange-500 mr-1" />
                          {user.streak}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">Streak</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard Categories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'Top Explorers', description: 'Most trails completed', icon: Mountain },
              { title: 'Distance Kings', description: 'Highest monthly distance', icon: Route },
              { title: 'Streak Masters', description: 'Longest active streaks', icon: Fire }
            ].map((category, index) => (
              <div key={index} className="glass-morphism rounded-lg p-4 text-center">
                <category.icon className="h-8 w-8 mx-auto text-nature-600 mb-2" />
                <h4 className="font-semibold text-gray-900 dark:text-white">{category.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{category.description}</p>
                <button className="mt-2 text-nature-600 text-sm font-medium hover:text-nature-700">
                  View Rankings
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Achievement Gallery
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Showcase your outdoor accomplishments and unlock new challenges
            </p>
          </div>

          {/* Achievement Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { category: 'Distance', achievements: 8, icon: '👣', color: 'bg-green-50 border-green-200 text-green-600' },
              { category: 'Trails', achievements: 6, icon: '🗺️', color: 'bg-blue-50 border-blue-200 text-blue-600' },
              { category: 'Social', achievements: 4, icon: '👥', color: 'bg-purple-50 border-purple-200 text-purple-600' },
              { category: 'Seasonal', achievements: 3, icon: '🌦️', color: 'bg-yellow-50 border-yellow-200 text-yellow-600' },
              { category: 'Time', achievements: 2, icon: '⏰', color: 'bg-orange-50 border-orange-200 text-orange-600' },
              { category: 'Safety', achievements: 1, icon: '🛡️', color: 'bg-red-50 border-red-200 text-red-600' }
            ].map((cat, index) => (
              <div key={index} className={`glass-morphism rounded-lg p-6 text-center border-2 ${cat.color}`}>
                <div className="text-4xl mb-3">{cat.icon}</div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{cat.category}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {cat.achievements} achievements unlocked
                </p>
                <button className="w-full py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                  View Collection
                </button>
              </div>
            ))}
          </div>

          {/* Recent Achievements */}
          <div className="glass-morphism rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Achievements</h4>
            <div className="space-y-3">
              {[
                { title: 'Trail Explorer', description: 'Completed 10 different trails', date: 'Jan 10', icon: '🗺️' },
                { title: 'Social Butterfly', description: 'Joined 3 group adventures', date: 'Jan 12', icon: '👥' },
                { title: 'Weather Warrior', description: 'Completed trails in 4 weather conditions', date: 'Jan 15', icon: '⛈️' }
              ].map((achievement, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900 dark:text-white">{achievement.title}</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</p>
                  </div>
                  <span className="text-sm text-gray-500">{achievement.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Events Tab */}
      {activeTab === 'events' && (
        <div className="space-y-6">
          {seasonalEvents.map((event) => (
            <div key={event.id} className={`glass-morphism rounded-lg p-6 ${
              event.isActive ? 'border-l-4 border-purple-500' : ''
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
                    {event.title}
                    {event.isActive && (
                      <span className="ml-3 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full">
                        Active
                      </span>
                    )}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">{event.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>{event.startDate} - {event.endDate}</span>
                    <span>{event.participants} participants</span>
                  </div>
                </div>
              </div>

              {/* Event Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-700 dark:text-gray-300">Event Progress</span>
                  <span className="text-gray-900 dark:text-white font-medium">{event.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${event.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Event Rewards */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Event Rewards:</h4>
                <div className="flex flex-wrap gap-2">
                  {event.rewards.map((reward, index) => (
                    <span key={index} className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm rounded-full">
                      {reward}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button className={`w-full py-2 rounded-lg transition-colors ${
                event.isActive 
                  ? 'bg-purple-600 text-white hover:bg-purple-700' 
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed'
              }`}>
                {event.isActive ? 'Join Event' : 'Event Ended'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GamificationTab;