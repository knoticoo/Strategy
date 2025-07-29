import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import {
  Brain,
  MapPin,
  Calendar,
  Clock,
  Users,
  Backpack,
  DollarSign,
  Route,
  Cloud,
  Thermometer,
  Compass,
  Camera,
  Heart,
  Star,
  TrendingUp,
  Zap,
  Target,
  Award,
  Shield,
  Car,
  Bed,
  Utensils,
  Fuel,
  CreditCard,
  CheckCircle,
  X,
  Plus,
  Minus,
  ArrowRight,
  Download,
  Share,
  RefreshCw,
  Lightbulb,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
  Filter,
  Search,
  Sparkles,
  Eye
} from 'lucide-react';

interface UserPreferences {
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  interests: string[];
  preferredDifficulty: 'easy' | 'moderate' | 'hard' | 'expert';
  groupSize: number;
  budgetRange: { min: number; max: number };
  preferredDuration: { min: number; max: number }; // days
  transportation: 'car' | 'public' | 'hiking' | 'cycling';
  accommodation: 'camping' | 'hostel' | 'hotel' | 'guesthouse';
  season: 'spring' | 'summer' | 'autumn' | 'winter' | 'any';
}

interface WeatherCondition {
  date: string;
  temperature: { min: number; max: number };
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'foggy';
  precipitation: number;
  windSpeed: number;
  humidity: number;
}

interface Equipment {
  id: string;
  name: string;
  category: 'clothing' | 'gear' | 'safety' | 'navigation' | 'camping' | 'food';
  essential: boolean;
  seasonal: string[];
  difficulty: string[];
  price: { min: number; max: number };
  weight: number; // grams
  description: string;
}

interface BudgetBreakdown {
  transportation: number;
  accommodation: number;
  food: number;
  equipment: number;
  activities: number;
  emergency: number;
  total: number;
}

interface AdventurePlan {
  id: string;
  title: string;
  description: string;
  duration: number; // days
  difficulty: string;
  season: string;
  groupSize: number;
  estimatedBudget: BudgetBreakdown;
  itinerary: {
    day: number;
    activities: {
      time: string;
      activity: string;
      location: string;
      duration: number;
      difficulty: string;
      description: string;
    }[];
    accommodation: {
      name: string;
      type: string;
      price: number;
      rating: number;
    };
    meals: {
      breakfast: { name: string; price: number };
      lunch: { name: string; price: number };
      dinner: { name: string; price: number };
    };
  }[];
  equipment: Equipment[];
  weather: WeatherCondition[];
  transportation: {
    type: string;
    route: string;
    cost: number;
    duration: string;
  };
  tips: string[];
  alternativeOptions: string[];
  riskAssessment: {
    level: 'low' | 'medium' | 'high';
    factors: string[];
    precautions: string[];
  };
  mlScore: number; // 0-100 match score
  createdAt: string;
}

const AIAdventurePlanner: React.FC = () => {
  const { currentUser, isLoggedIn } = useUser();
  const [step, setStep] = useState<'preferences' | 'planning' | 'results'>('preferences');
  const [preferences, setPreferences] = useState<UserPreferences>({
    fitnessLevel: 'intermediate',
    interests: [],
    preferredDifficulty: 'moderate',
    groupSize: 2,
    budgetRange: { min: 100, max: 500 },
    preferredDuration: { min: 2, max: 5 },
    transportation: 'car',
    accommodation: 'hotel',
    season: 'any'
  });
  const [generatedPlans, setGeneratedPlans] = useState<AdventurePlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<AdventurePlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showEquipment, setShowEquipment] = useState(false);
  const [showBudgetBreakdown, setShowBudgetBreakdown] = useState(false);

  const interestOptions = [
    'Hiking', 'Photography', 'Wildlife Watching', 'Historical Sites', 'Cultural Experiences',
    'Extreme Sports', 'Relaxation', 'Food & Drink', 'Camping', 'Rock Climbing',
    'Water Sports', 'Cycling', 'Fishing', 'Stargazing', 'Meditation'
  ];

  const sampleEquipment: Equipment[] = [
    {
      id: 'hiking-boots',
      name: 'Waterproof Hiking Boots',
      category: 'clothing',
      essential: true,
      seasonal: ['spring', 'summer', 'autumn', 'winter'],
      difficulty: ['moderate', 'hard', 'expert'],
      price: { min: 80, max: 200 },
      weight: 1200,
      description: 'Durable, waterproof boots with good ankle support'
    },
    {
      id: 'backpack',
      name: '40L Hiking Backpack',
      category: 'gear',
      essential: true,
      seasonal: ['spring', 'summer', 'autumn', 'winter'],
      difficulty: ['easy', 'moderate', 'hard', 'expert'],
      price: { min: 60, max: 150 },
      weight: 1500,
      description: 'Comfortable backpack with multiple compartments'
    },
    {
      id: 'first-aid',
      name: 'First Aid Kit',
      category: 'safety',
      essential: true,
      seasonal: ['spring', 'summer', 'autumn', 'winter'],
      difficulty: ['easy', 'moderate', 'hard', 'expert'],
      price: { min: 25, max: 60 },
      weight: 400,
      description: 'Comprehensive first aid kit for outdoor activities'
    }
  ];

  const generateAdventurePlans = async () => {
    setIsGenerating(true);
    setStep('planning');

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 3000));

    const mockPlans: AdventurePlan[] = [
      {
        id: 'plan-1',
        title: 'Gauja National Park Explorer',
        description: 'A perfect blend of nature, history, and adventure in Latvia\'s oldest national park',
        duration: 3,
        difficulty: 'moderate',
        season: 'summer',
        groupSize: preferences.groupSize,
        estimatedBudget: {
          transportation: 45,
          accommodation: 180,
          food: 120,
          equipment: 80,
          activities: 60,
          emergency: 25,
          total: 510
        },
        itinerary: [
          {
            day: 1,
            activities: [
              {
                time: '09:00',
                activity: 'Arrival & Check-in',
                location: 'Sigulda',
                duration: 60,
                difficulty: 'easy',
                description: 'Check into accommodation and get oriented'
              },
              {
                time: '11:00',
                activity: 'Turaida Castle Visit',
                location: 'Turaida Museum Reserve',
                duration: 180,
                difficulty: 'easy',
                description: 'Explore medieval castle and learn about local history'
              },
              {
                time: '15:00',
                activity: 'Sculpture Garden Walk',
                location: 'Turaida',
                duration: 120,
                difficulty: 'easy',
                description: 'Peaceful walk through outdoor art installations'
              }
            ],
            accommodation: {
              name: 'Sigulda Hotel',
              type: 'hotel',
              price: 60,
              rating: 4.2
            },
            meals: {
              breakfast: { name: 'Hotel Breakfast', price: 12 },
              lunch: { name: 'Castle Cafe', price: 15 },
              dinner: { name: 'Local Restaurant', price: 25 }
            }
          },
          {
            day: 2,
            activities: [
              {
                time: '08:00',
                activity: 'Gauja River Canoeing',
                location: 'Gauja River',
                duration: 240,
                difficulty: 'moderate',
                description: 'Scenic canoe trip through the Gauja Valley'
              },
              {
                time: '14:00',
                activity: 'Forest Hiking Trail',
                location: 'Gauja National Park',
                duration: 180,
                difficulty: 'moderate',
                description: 'Hike through ancient forests with wildlife spotting'
              }
            ],
            accommodation: {
              name: 'Sigulda Hotel',
              type: 'hotel',
              price: 60,
              rating: 4.2
            },
            meals: {
              breakfast: { name: 'Hotel Breakfast', price: 12 },
              lunch: { name: 'Riverside Picnic', price: 10 },
              dinner: { name: 'Traditional Latvian', price: 28 }
            }
          },
          {
            day: 3,
            activities: [
              {
                time: '09:00',
                activity: 'Cable Car & Bobsled',
                location: 'Sigulda',
                duration: 120,
                difficulty: 'easy',
                description: 'Thrilling ride with panoramic views'
              },
              {
                time: '12:00',
                activity: 'Photography Workshop',
                location: 'Gutmanis Cave',
                duration: 150,
                difficulty: 'easy',
                description: 'Learn landscape photography in stunning locations'
              }
            ],
            accommodation: {
              name: 'Departure',
              type: 'checkout',
              price: 0,
              rating: 0
            },
            meals: {
              breakfast: { name: 'Hotel Breakfast', price: 12 },
              lunch: { name: 'Farewell Lunch', price: 18 },
              dinner: { name: 'Travel Home', price: 0 }
            }
          }
        ],
        equipment: sampleEquipment,
        weather: [
          {
            date: '2024-07-15',
            temperature: { min: 18, max: 24 },
            condition: 'sunny',
            precipitation: 0,
            windSpeed: 12,
            humidity: 65
          }
        ],
        transportation: {
          type: 'Car',
          route: 'Riga → Sigulda (53km)',
          cost: 45,
          duration: '1 hour'
        },
        tips: [
          'Book accommodation in advance during summer season',
          'Bring waterproof clothing for water activities',
          'Download offline maps for hiking trails',
          'Pack insect repellent for forest walks'
        ],
        alternativeOptions: [
          'Extend to 4 days with Cēsis exploration',
          'Add cycling tour around Sigulda',
          'Include winter activities if visiting in cold season'
        ],
        riskAssessment: {
          level: 'low',
          factors: ['Water activities', 'Forest hiking'],
          precautions: ['Life jackets provided', 'Stick to marked trails', 'Inform others of plans']
        },
        mlScore: 94,
        createdAt: new Date().toISOString()
      }
    ];

    setGeneratedPlans(mockPlans);
    setStep('results');
    setIsGenerating(false);
  };

  const handlePreferenceChange = (key: keyof UserPreferences, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleInterest = (interest: string) => {
    setPreferences(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-orange-600 bg-orange-100';
      case 'expert': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return '☀️';
      case 'cloudy': return '☁️';
      case 'rainy': return '🌧️';
      case 'snowy': return '❄️';
      case 'foggy': return '🌫️';
      default: return '🌤️';
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            AI Adventure Planner
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Please log in to access personalized adventure planning with AI recommendations.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          🤖 AI Adventure Planner
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Let artificial intelligence create the perfect adventure plan tailored to your preferences, budget, and experience level
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        {[
          { id: 'preferences', name: 'Preferences', icon: Heart },
          { id: 'planning', name: 'AI Planning', icon: Brain },
          { id: 'results', name: 'Your Plans', icon: Target }
        ].map((stepItem, index) => {
          const Icon = stepItem.icon;
          const isActive = step === stepItem.id;
          const isCompleted = 
            (stepItem.id === 'preferences' && (step === 'planning' || step === 'results')) ||
            (stepItem.id === 'planning' && step === 'results');
          
          return (
            <div key={stepItem.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                isActive ? 'bg-blue-600 text-white' :
                isCompleted ? 'bg-green-600 text-white' :
                'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}>
                {isCompleted ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
              </div>
              <span className={`ml-2 text-sm font-medium ${
                isActive ? 'text-blue-600' :
                isCompleted ? 'text-green-600' :
                'text-gray-500'
              }`}>
                {stepItem.name}
              </span>
              {index < 2 && (
                <ArrowRight className="h-4 w-4 text-gray-400 mx-4" />
              )}
            </div>
          );
        })}
      </div>

      {/* Step 1: Preferences */}
      {step === 'preferences' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Tell us about your adventure preferences
          </h3>

          <div className="space-y-6">
            {/* Fitness Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Fitness Level
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['beginner', 'intermediate', 'advanced', 'expert'].map(level => (
                  <button
                    key={level}
                    onClick={() => handlePreferenceChange('fitnessLevel', level)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      preferences.fitnessLevel === level
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-lg font-semibold capitalize">{level}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Interests (Select multiple)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {interestOptions.map(interest => (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`p-3 rounded-lg border-2 transition-all text-sm ${
                      preferences.interests.includes(interest)
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            {/* Group Size */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Group Size
                </label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handlePreferenceChange('groupSize', Math.max(1, preferences.groupSize - 1))}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="text-xl font-semibold text-gray-900 dark:text-white px-4">
                    {preferences.groupSize}
                  </span>
                  <button
                    onClick={() => handlePreferenceChange('groupSize', Math.min(20, preferences.groupSize + 1))}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Duration (days)
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={preferences.preferredDuration.min}
                    onChange={(e) => handlePreferenceChange('preferredDuration', {
                      ...preferences.preferredDuration,
                      min: parseInt(e.target.value)
                    })}
                    className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={preferences.preferredDuration.max}
                    onChange={(e) => handlePreferenceChange('preferredDuration', {
                      ...preferences.preferredDuration,
                      max: parseInt(e.target.value)
                    })}
                    className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <span className="text-gray-500">days</span>
                </div>
              </div>
            </div>

            {/* Budget Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Budget Range (EUR)
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  min="50"
                  max="5000"
                  step="50"
                  value={preferences.budgetRange.min}
                  onChange={(e) => handlePreferenceChange('budgetRange', {
                    ...preferences.budgetRange,
                    min: parseInt(e.target.value)
                  })}
                  className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="number"
                  min="50"
                  max="5000"
                  step="50"
                  value={preferences.budgetRange.max}
                  onChange={(e) => handlePreferenceChange('budgetRange', {
                    ...preferences.budgetRange,
                    max: parseInt(e.target.value)
                  })}
                  className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <span className="text-gray-500">EUR</span>
              </div>
            </div>

            {/* Transportation & Accommodation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Transportation
                </label>
                <select
                  value={preferences.transportation}
                  onChange={(e) => handlePreferenceChange('transportation', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="car">Car</option>
                  <option value="public">Public Transport</option>
                  <option value="hiking">Hiking/Walking</option>
                  <option value="cycling">Cycling</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Accommodation
                </label>
                <select
                  value={preferences.accommodation}
                  onChange={(e) => handlePreferenceChange('accommodation', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="camping">Camping</option>
                  <option value="hostel">Hostel</option>
                  <option value="hotel">Hotel</option>
                  <option value="guesthouse">Guesthouse</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <button
              onClick={generateAdventurePlans}
              disabled={preferences.interests.length === 0}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Sparkles className="h-5 w-5" />
              Generate AI Plans
            </button>
          </div>
        </div>
      )}

      {/* Step 2: AI Planning */}
      {step === 'planning' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="text-center">
            <div className="relative">
              <Brain className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-pulse" />
              <div className="absolute -top-2 -right-2">
                <Sparkles className="h-6 w-6 text-yellow-500 animate-bounce" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              AI is crafting your perfect adventure...
            </h3>
            <div className="max-w-md mx-auto space-y-3 text-gray-600 dark:text-gray-400">
              <div className="flex items-center justify-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Analyzing your preferences...</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Cloud className="h-4 w-4" />
                <span>Checking weather conditions...</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Route className="h-4 w-4" />
                <span>Optimizing routes and activities...</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <DollarSign className="h-4 w-4" />
                <span>Calculating budget estimates...</span>
              </div>
            </div>
            <div className="mt-6">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '75%' }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Results */}
      {step === 'results' && (
        <div className="space-y-6">
          {generatedPlans.map(plan => (
            <div key={plan.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {plan.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {plan.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {plan.duration} days
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {plan.groupSize} people
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(plan.difficulty)}`}>
                        {plan.difficulty}
                      </span>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-green-600 font-medium">{plan.mlScore}% match</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">
                      €{plan.estimatedBudget.total}
                    </div>
                    <div className="text-sm text-gray-500">total estimated</div>
                  </div>
                </div>

                {/* Quick Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Car className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Transport</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {plan.transportation.type} - {plan.transportation.duration}
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      €{plan.transportation.cost}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Bed className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Accommodation</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {plan.itinerary[0]?.accommodation.type}
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      €{plan.estimatedBudget.accommodation}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-5 w-5 text-orange-600" />
                      <span className="font-medium">Risk Level</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {plan.riskAssessment.level}
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                      {plan.riskAssessment.level}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setSelectedPlan(plan)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    View Details
                  </button>
                  <button
                    onClick={() => setShowBudgetBreakdown(!showBudgetBreakdown)}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <DollarSign className="h-4 w-4" />
                    Budget Breakdown
                  </button>
                  <button
                    onClick={() => setShowEquipment(!showEquipment)}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                  >
                    <Backpack className="h-4 w-4" />
                    Equipment List
                  </button>
                  <button className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export Plan
                  </button>
                  <button className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2">
                    <Share className="h-4 w-4" />
                    Share
                  </button>
                </div>

                {/* Budget Breakdown */}
                {showBudgetBreakdown && (
                  <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Budget Breakdown</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Object.entries(plan.estimatedBudget).map(([category, amount]) => (
                        category !== 'total' && (
                          <div key={category} className="flex justify-between">
                            <span className="capitalize text-gray-600 dark:text-gray-400">{category}:</span>
                            <span className="font-medium text-gray-900 dark:text-white">€{amount}</span>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                )}

                {/* Equipment List */}
                {showEquipment && (
                  <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Recommended Equipment</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {plan.equipment.map(item => (
                        <div key={item.id} className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                          <div className={`p-2 rounded-lg ${item.essential ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                            <Backpack className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900 dark:text-white">{item.name}</h5>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                €{item.price.min}-{item.price.max}
                              </span>
                              {item.essential && (
                                <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                                  Essential
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          <div className="text-center">
            <button
              onClick={() => setStep('preferences')}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Create Another Plan
            </button>
          </div>
        </div>
      )}

      {/* Detailed Plan Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedPlan.title}
                </h3>
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Detailed Itinerary */}
              <div className="space-y-6">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white">Detailed Itinerary</h4>
                
                {selectedPlan.itinerary.map(day => (
                  <div key={day.day} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Day {day.day}
                    </h5>
                    
                    <div className="space-y-3">
                      {day.activities.map((activity, index) => (
                        <div key={index} className="flex items-start gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="text-sm font-medium text-blue-600 min-w-[60px]">
                            {activity.time}
                          </div>
                          <div className="flex-1">
                            <h6 className="font-medium text-gray-900 dark:text-white">{activity.activity}</h6>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{activity.description}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {activity.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {activity.duration} min
                              </span>
                              <span className={`px-2 py-1 rounded-full ${getDifficultyColor(activity.difficulty)}`}>
                                {activity.difficulty}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Accommodation & Meals */}
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <h6 className="font-medium text-gray-900 dark:text-white mb-2">Accommodation</h6>
                        <p className="text-sm">{day.accommodation.name}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-sm text-gray-600 dark:text-gray-400">{day.accommodation.type}</span>
                          <span className="font-medium">€{day.accommodation.price}</span>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <h6 className="font-medium text-gray-900 dark:text-white mb-2">Meals</h6>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Breakfast:</span>
                            <span>€{day.meals.breakfast.price}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Lunch:</span>
                            <span>€{day.meals.lunch.price}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Dinner:</span>
                            <span>€{day.meals.dinner.price}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tips and Alternatives */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    💡 Pro Tips
                  </h4>
                  <ul className="space-y-2">
                    {selectedPlan.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    🔄 Alternative Options
                  </h4>
                  <ul className="space-y-2">
                    {selectedPlan.alternativeOptions.map((option, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <RefreshCw className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        {option}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAdventurePlanner;