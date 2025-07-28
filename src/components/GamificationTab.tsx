import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Trophy,
  Medal,
  Zap,
  Target,
  Crown,
  Flame,
  Gift,
  Users,
  Calendar,
  Clock,
  Award,
  Mountain,
  Route,
  CheckCircle,
  Lock,
  Sparkles
} from 'lucide-react';

interface UserLevel {
  level: number;
  title: string;
  minXP: number;
  maxXP: number;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  unlockedAt: string;
  category: 'distance' | 'trails' | 'social' | 'time' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly';
  progress: number;
  target: number;
  reward: {
    xp: number;
    points: number;
  };
  icon: React.ComponentType<any>;
  expiresAt: string;
}

interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  streak: number;
  badges: number;
  rank: number;
}

const GamificationTab: React.FC = () => {
  const [userLevel, setUserLevel] = useState<UserLevel | null>(null);
  const [userXP, setUserXP] = useState(2350);
  const [streak, setStreak] = useState(12);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'challenges' | 'leaderboard'>('overview');
  const [loading, setLoading] = useState(true);

  const levels: UserLevel[] = [
    { level: 1, title: 'Trail Seeker', minXP: 0, maxXP: 100, icon: Target, color: 'text-gray-600', bgColor: 'bg-gray-100' },
    { level: 2, title: 'Nature Walker', minXP: 100, maxXP: 250, icon: Route, color: 'text-green-600', bgColor: 'bg-green-100' },
    { level: 3, title: 'Forest Explorer', minXP: 250, maxXP: 500, icon: Mountain, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { level: 4, title: 'Adventure Guide', minXP: 500, maxXP: 1000, icon: Award, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    { level: 5, title: 'Trail Master', minXP: 1000, maxXP: 2000, icon: Medal, color: 'text-orange-600', bgColor: 'bg-orange-100' },
    { level: 6, title: 'Nature Champion', minXP: 2000, maxXP: 4000, icon: Trophy, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
    { level: 7, title: 'Wilderness Legend', minXP: 4000, maxXP: 8000, icon: Crown, color: 'text-red-600', bgColor: 'bg-red-100' },
  ];

  useEffect(() => {
    loadGamificationData();
  }, []);

  const loadGamificationData = async () => {
    setLoading(true);
    
    // Determine user level
    const currentLevel = levels.find(level => userXP >= level.minXP && userXP < level.maxXP) || levels[levels.length - 1];
    setUserLevel(currentLevel);

    // Mock achievements
    const mockAchievements: Achievement[] = [
      {
        id: '1',
        title: 'First Steps',
        description: 'Complete your first trail',
        icon: Target,
        unlockedAt: '2024-01-10',
        category: 'trails',
        rarity: 'common',
        points: 50
      },
      {
        id: '2',
        title: 'Distance Runner',
        description: 'Walk 50km in total',
        icon: Route,
        unlockedAt: '2024-01-15',
        category: 'distance',
        rarity: 'rare',
        points: 100
      },
      {
        id: '3',
        title: 'Peak Climber',
        description: 'Reach 10 mountain peaks',
        icon: Mountain,
        unlockedAt: '2024-01-20',
        category: 'trails',
        rarity: 'epic',
        points: 200
      },
      {
        id: '4',
        title: 'Streak Master',
        description: 'Maintain 7-day activity streak',
        icon: Flame,
        unlockedAt: '2024-01-25',
        category: 'time',
        rarity: 'legendary',
        points: 500
      }
    ];

    // Mock challenges
    const mockChallenges: Challenge[] = [
      {
        id: '1',
        title: 'Daily Hiker',
        description: 'Complete 1 trail today',
        type: 'daily',
        progress: 0,
        target: 1,
        reward: { xp: 50, points: 25 },
        icon: Target,
        expiresAt: '2024-01-28 23:59'
      },
      {
        id: '2',
        title: 'Weekend Warrior',
        description: 'Complete 5 trails this week',
        type: 'weekly',
        progress: 3,
        target: 5,
        reward: { xp: 200, points: 100 },
        icon: Trophy,
        expiresAt: '2024-01-31 23:59'
      },
      {
        id: '3',
        title: 'Monthly Explorer',
        description: 'Visit 15 different locations',
        type: 'monthly',
        progress: 8,
        target: 15,
        reward: { xp: 500, points: 250 },
        icon: Mountain,
        expiresAt: '2024-02-01 23:59'
      }
    ];

    // Mock leaderboard
    const mockLeaderboard: LeaderboardUser[] = [
      {
        id: '1',
        name: 'Anna Liepiņa',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?w=100&h=100&fit=crop&crop=face',
        level: 7,
        xp: 8500,
        streak: 45,
        badges: 24,
        rank: 1
      },
      {
        id: '2',
        name: 'Jānis Bērziņš',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        level: 6,
        xp: 3200,
        streak: 23,
        badges: 18,
        rank: 2
      },
      {
        id: '3',
        name: 'You',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        level: currentLevel?.level || 1,
        xp: userXP,
        streak: streak,
        badges: mockAchievements.length,
        rank: 3
      }
    ];

    setAchievements(mockAchievements);
    setChallenges(mockChallenges);
    setLeaderboard(mockLeaderboard);
    setLoading(false);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'badge-neutral';
      case 'rare': return 'badge-info';
      case 'epic': return 'badge-secondary';
      case 'legendary': return 'badge-warning';
      default: return 'badge-neutral';
    }
  };

  const getProgressColor = (progress: number, target: number) => {
    const percentage = (progress / target) * 100;
    if (percentage >= 100) return 'progress-success';
    if (percentage >= 75) return 'progress-warning';
    if (percentage >= 50) return 'progress-info';
    return 'progress-primary';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="text-base-content/60">Loading your adventure progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300 p-4 md:p-6 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8 animate-slide-down">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-to-r from-primary to-secondary p-4 rounded-full animate-glow">
            <Trophy className="h-8 w-8 text-white animate-bounce-slow" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
          Adventure Rewards
        </h1>
        <p className="text-base-content/70 text-lg">
          Level up your outdoor adventures and earn amazing rewards!
        </p>
      </div>

      {/* User Stats Card */}
      <div className="card bg-gradient-to-r from-primary/10 to-secondary/10 shadow-2xl mb-8 animate-scale-in">
        <div className="card-body">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar & Level */}
            <div className="flex flex-col items-center">
              <div className="avatar placeholder">
                <div className="bg-primary text-primary-content rounded-full w-20 h-20 animate-float">
                  <span className="text-2xl font-bold">{userLevel?.level}</span>
                </div>
              </div>
              <div className={`badge ${userLevel?.bgColor} ${userLevel?.color} badge-lg mt-2 animate-wiggle`}>
                {userLevel?.title}
              </div>
            </div>

            {/* XP Progress */}
            <div className="flex-1 w-full">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-base-content/70">Experience Points</span>
                <span className="text-sm font-bold text-primary">{userXP} XP</span>
              </div>
              <progress 
                className="progress progress-primary w-full h-3" 
                value={userXP - (userLevel?.minXP || 0)} 
                max={(userLevel?.maxXP || 1000) - (userLevel?.minXP || 0)}
              ></progress>
              <div className="flex justify-between text-xs text-base-content/50 mt-1">
                <span>{userLevel?.minXP} XP</span>
                <span>{userLevel?.maxXP} XP</span>
              </div>
            </div>

            {/* Streak */}
            <div className="stats shadow">
              <div className="stat place-items-center">
                <div className="stat-figure text-secondary">
                  <Flame className="h-8 w-8 animate-pulse-slow" />
                </div>
                <div className="stat-title">Streak</div>
                <div className="stat-value text-secondary">{streak}</div>
                <div className="stat-desc">days active</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="tabs tabs-boxed bg-base-100 shadow-lg mb-6 animate-slide-up">
        {[
          { id: 'overview', label: 'Overview', icon: Target },
          { id: 'achievements', label: 'Achievements', icon: Trophy },
          { id: 'challenges', label: 'Challenges', icon: Zap },
          { id: 'leaderboard', label: 'Leaderboard', icon: Crown }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`tab tab-lg gap-2 ${activeTab === tab.id ? 'tab-active' : ''}`}
              onClick={() => setActiveTab(tab.id as any)}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="animate-fade-in">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Quick Stats */}
            <div className="card bg-base-100 shadow-xl animate-slide-up">
              <div className="card-body">
                <h2 className="card-title text-primary">
                  <Sparkles className="h-5 w-5" />
                  Quick Stats
                </h2>
                <div className="stats stats-vertical shadow">
                  <div className="stat">
                    <div className="stat-title">Total Trails</div>
                    <div className="stat-value text-primary">23</div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">Distance</div>
                    <div className="stat-value text-secondary">127 km</div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">Time Active</div>
                    <div className="stat-value text-accent">45h</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Achievements */}
            <div className="card bg-base-100 shadow-xl animate-slide-up" style={{animationDelay: '0.1s'}}>
              <div className="card-body">
                <h2 className="card-title text-secondary">
                  <Award className="h-5 w-5" />
                  Recent Achievements
                </h2>
                <div className="space-y-3">
                  {achievements.slice(0, 3).map((achievement) => {
                    const Icon = achievement.icon;
                    return (
                      <div key={achievement.id} className="flex items-center gap-3 p-2 hover:bg-base-200 rounded-lg transition-colors">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{achievement.title}</p>
                          <p className="text-xs text-base-content/60">{achievement.description}</p>
                        </div>
                        <div className={`badge ${getRarityColor(achievement.rarity)} badge-sm`}>
                          +{achievement.points}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Active Challenges */}
            <div className="card bg-base-100 shadow-xl animate-slide-up" style={{animationDelay: '0.2s'}}>
              <div className="card-body">
                <h2 className="card-title text-accent">
                  <Zap className="h-5 w-5" />
                  Active Challenges
                </h2>
                <div className="space-y-4">
                  {challenges.slice(0, 2).map((challenge) => {
                    const Icon = challenge.icon;
                    const progressPercentage = (challenge.progress / challenge.target) * 100;
                    return (
                      <div key={challenge.id} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-accent" />
                          <span className="font-medium text-sm">{challenge.title}</span>
                          <div className={`badge badge-${challenge.type === 'daily' ? 'success' : challenge.type === 'weekly' ? 'warning' : 'info'} badge-xs`}>
                            {challenge.type}
                          </div>
                        </div>
                        <progress 
                          className={`progress ${getProgressColor(challenge.progress, challenge.target)} w-full`} 
                          value={challenge.progress} 
                          max={challenge.target}
                        ></progress>
                        <div className="flex justify-between text-xs text-base-content/60">
                          <span>{challenge.progress}/{challenge.target}</span>
                          <span>+{challenge.reward.xp} XP</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <div 
                  key={achievement.id} 
                  className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 animate-scale-in"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="card-body items-center text-center">
                    <div className="bg-gradient-to-r from-primary to-secondary p-4 rounded-full mb-4 animate-glow">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="card-title text-lg">{achievement.title}</h2>
                    <p className="text-base-content/70 text-sm">{achievement.description}</p>
                    <div className="card-actions justify-between w-full mt-4">
                      <div className={`badge ${getRarityColor(achievement.rarity)}`}>
                        {achievement.rarity}
                      </div>
                      <div className="badge badge-primary">
                        +{achievement.points} pts
                      </div>
                    </div>
                    <div className="text-xs text-base-content/50 mt-2">
                      Unlocked: {achievement.unlockedAt}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'challenges' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {challenges.map((challenge, index) => {
              const Icon = challenge.icon;
              const progressPercentage = (challenge.progress / challenge.target) * 100;
              const isCompleted = progressPercentage >= 100;
              
              return (
                <div 
                  key={challenge.id} 
                  className={`card ${isCompleted ? 'bg-success/10 border border-success/20' : 'bg-base-100'} shadow-xl animate-slide-up`}
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="card-body">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-3 rounded-lg ${isCompleted ? 'bg-success/20' : 'bg-primary/10'}`}>
                        <Icon className={`h-6 w-6 ${isCompleted ? 'text-success' : 'text-primary'}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{challenge.title}</h3>
                        <p className="text-base-content/70">{challenge.description}</p>
                      </div>
                      <div className={`badge badge-${challenge.type === 'daily' ? 'success' : challenge.type === 'weekly' ? 'warning' : 'info'}`}>
                        {challenge.type}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-medium">{challenge.progress}/{challenge.target}</span>
                      </div>
                      <progress 
                        className={`progress ${getProgressColor(challenge.progress, challenge.target)} w-full h-3`} 
                        value={challenge.progress} 
                        max={challenge.target}
                      ></progress>
                      <div className="text-xs text-base-content/50">
                        {Math.round(progressPercentage)}% complete
                      </div>
                    </div>

                    <div className="card-actions justify-between items-center mt-4">
                      <div className="flex gap-2">
                        <div className="badge badge-primary">+{challenge.reward.xp} XP</div>
                        <div className="badge badge-secondary">+{challenge.reward.points} pts</div>
                      </div>
                      <div className="text-xs text-base-content/50">
                        Expires: {new Date(challenge.expiresAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-6">
                <Crown className="h-6 w-6 text-warning" />
                Adventure Leaderboard
              </h2>
              <div className="space-y-4">
                {leaderboard.map((user, index) => (
                  <div 
                    key={user.id} 
                    className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 hover:scale-105 animate-slide-up ${
                      user.name === 'You' ? 'bg-primary/10 border border-primary/20' : 'bg-base-200 hover:bg-base-300'
                    }`}
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    {/* Rank */}
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg ${
                      user.rank === 1 ? 'bg-warning text-warning-content' :
                      user.rank === 2 ? 'bg-base-300 text-base-content' :
                      user.rank === 3 ? 'bg-orange-200 text-orange-800' :
                      'bg-base-200 text-base-content'
                    }`}>
                      {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : user.rank === 3 ? '🥉' : user.rank}
                    </div>

                    {/* Avatar */}
                    <div className="avatar">
                      <div className="w-12 h-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        <img src={user.avatar} alt={user.name} />
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{user.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-base-content/70">
                        <span>Level {user.level}</span>
                        <span>{user.xp.toLocaleString()} XP</span>
                        <div className="flex items-center gap-1">
                          <Flame className="h-3 w-3 text-orange-500" />
                          <span>{user.streak}</span>
                        </div>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="text-right">
                      <div className="badge badge-primary badge-lg">{user.badges} badges</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GamificationTab;