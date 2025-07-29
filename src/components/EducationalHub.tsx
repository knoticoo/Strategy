import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { useTranslation } from 'react-i18next';
import {
  BookOpen,
  Leaf,
  Camera,
  MapPin,
  Clock,
  Users,
  Award,
  Star,
  Heart,
  Share,
  Download,
  Search,
  Shield,
  CheckCircle,
  X,
  Target
} from 'lucide-react';

interface EducationalContent {
  id: string;
  title: string;
  category: 'nature' | 'history' | 'culture' | 'photography' | 'survival';
        type: 'article' | 'interactive' | 'quiz' | 'tutorial';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // minutes
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
}

interface UserProgress {
  contentId: string;
  completed: boolean;
  progress: number; // 0-100
  timeSpent: number; // minutes
  completedAt?: string;
  quiz_score?: number;
}

const EducationalHub: React.FC = () => {
  const { t } = useTranslation();
  const { isLoggedIn } = useUser();
  const [activeCategory, setActiveCategory] = useState<'nature' | 'history' | 'culture' | 'photography' | 'survival'>('nature');
  const [selectedContent, setSelectedContent] = useState<EducationalContent | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showQuizResult, setShowQuizResult] = useState(false);


  // Mock educational content data
  const [educationalContent] = useState<EducationalContent[]>([
    // Nature Education
    {
      id: 'nature-1',
      title: 'Identifying Baltic Flora: Common Trees and Plants',
      category: 'nature',
      type: 'interactive',
      difficulty: 'beginner',
      duration: 25,
      description: 'Learn to identify the most common trees, plants, and flowers found in Latvian forests and meadows.',
      content: 'The Baltic region is home to diverse flora including pine, spruce, birch, oak, and numerous wildflowers...',
      images: [
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
        'https://images.unsplash.com/photo-1574263867128-e6b48e67e1f9?w=800',
        'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800'
      ],
      location: {
        name: 'Gauja National Park',
        coordinates: { lat: 57.2304, lng: 24.8517 }
      },
      relatedTrails: ['gauja-nature-trail', 'sigulda-forest-walk'],
      tags: ['trees', 'plants', 'identification', 'forest', 'botany'],
      rating: 4.8,
      completedBy: 1247,
      createdAt: '2024-01-15',
      author: {
        name: 'Dr. Anna Liepa',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b4d0?w=100',
        expertise: 'Forest Botanist'
      }
    },
          {
        id: 'nature-2',
        title: 'Wildlife Watching: Birds and Mammals of Latvia',
        category: 'nature',
        type: 'quiz',
        difficulty: 'intermediate',
        duration: 25,
        description: 'Test your knowledge about the diverse wildlife of Latvia, from forest birds to coastal mammals.',
        content: 'Latvia hosts over 300 bird species and numerous mammals including lynx, wolves, and brown bears. This interactive quiz will test your knowledge about identifying and understanding local wildlife.',
        images: [
          'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800',
          'https://images.unsplash.com/photo-1574263867128-e6b48e67e1f9?w=800'
        ],
        relatedTrails: ['kemeri-bog-trail', 'slitere-coastal-walk'],
        tags: ['wildlife', 'birds', 'mammals', 'observation', 'nature', 'quiz'],
        rating: 4.9,
        completedBy: 892,
        createdAt: '2024-01-20',
        author: {
          name: 'Māris Strazds',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
          expertise: 'Wildlife Biologist'
        }
      },
    // Historical Content
    {
      id: 'history-1',
      title: 'Medieval Castles and Their Stories',
      category: 'history',
      type: 'article',
      difficulty: 'beginner',
      duration: 20,
      description: 'Explore the rich medieval history of Latvia through its ancient castles and fortifications.',
      content: 'Latvia\'s medieval castles tell stories of crusades, trade routes, and ancient kingdoms...',
      images: [
        'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800',
        'https://images.unsplash.com/photo-1571847749180-5b0bb0e4c1d5?w=800'
      ],
      location: {
        name: 'Sigulda Castle',
        coordinates: { lat: 57.1544, lng: 24.8517 }
      },
      relatedTrails: ['sigulda-castle-trail', 'turaida-historical-walk'],
      tags: ['medieval', 'castles', 'history', 'architecture', 'crusades'],
      rating: 4.7,
      completedBy: 1156,
      createdAt: '2024-01-10',
      author: {
        name: 'Prof. Jānis Graudonis',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
        expertise: 'Medieval Historian'
      }
    },
    // Cultural Content
    {
      id: 'culture-1',
      title: 'Traditional Latvian Folk Songs and Nature',
      category: 'culture',
      type: 'interactive',
      difficulty: 'beginner',
      duration: 30,
      description: 'Discover how Latvian dainas (folk songs) celebrate the connection between people and nature.',
      content: 'Latvian folk songs, or dainas, contain thousands of references to nature, seasons, and landscapes...',
      images: [
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'
      ],
      relatedTrails: ['ethnographic-village-trail', 'cultural-heritage-walk'],
      tags: ['culture', 'folk songs', 'traditions', 'dainas', 'heritage'],
      rating: 4.6,
      completedBy: 743,
      createdAt: '2024-01-25',
      author: {
        name: 'Daina Bleiere',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
        expertise: 'Cultural Anthropologist'
      }
    },
    // Photography Tutorials
          {
        id: 'photo-1',
        title: 'Golden Hour Photography in Baltic Forests',
        category: 'photography',
        type: 'quiz',
        difficulty: 'intermediate',
        duration: 30,
        description: 'Test your knowledge about capturing stunning forest photography during golden hour.',
        content: 'Golden hour provides the perfect lighting for forest photography. This quiz covers composition techniques, camera settings, and timing for the best forest photography results.',
        images: [
          'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'
        ],
        relatedTrails: ['gauja-photo-spots', 'kemeri-sunrise-trail'],
        tags: ['photography', 'golden hour', 'forest', 'composition', 'lighting', 'quiz'],
        rating: 4.9,
        completedBy: 2341,
        createdAt: '2024-02-01',
        author: {
          name: 'Kaspars Goba',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
          expertise: 'Nature Photographer'
        }
      },
    // Survival Skills
          {
        id: 'survival-1',
        title: 'Essential Wilderness Survival Skills',
        category: 'survival',
        type: 'quiz',
        difficulty: 'advanced',
        duration: 45,
        description: 'Test your knowledge of critical survival skills for outdoor adventures including shelter, fire, water, and navigation.',
        content: 'In wilderness situations, knowing basic survival skills can be life-saving. This comprehensive quiz covers emergency shelter building, fire starting techniques, water purification, and navigation skills.',
        images: [
          'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=800',
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800'
        ],
        relatedTrails: ['wilderness-survival-course', 'remote-camping-areas'],
        tags: ['survival', 'wilderness', 'emergency', 'shelter', 'fire', 'navigation', 'quiz'],
        rating: 4.8,
        completedBy: 567,
        createdAt: '2024-02-05',
        author: {
          name: 'Andris Bērziņš',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
          expertise: 'Wilderness Survival Expert'
        }
      }
  ]);

  // Sample quiz questions
  const quizQuestions = [
    {
      question: "Which tree is most common in Latvian forests?",
      options: ["Oak", "Pine", "Birch", "Maple"],
      correct: 1
    },
    {
      question: "What is the best time for wildlife observation?",
      options: ["Midday", "Early morning", "Late afternoon", "Both B and C"],
      correct: 3
    }
  ];

  const categories = [
    { id: 'nature', name: t('education.categories.nature'), icon: Leaf, color: 'bg-green-500', description: t('education.descriptions.nature') },
    { id: 'history', name: t('education.categories.history'), icon: Clock, color: 'bg-amber-500', description: t('education.descriptions.history') },
    { id: 'culture', name: t('education.categories.culture'), icon: Users, color: 'bg-purple-500', description: t('education.descriptions.culture') },
    { id: 'photography', name: t('education.categories.photography'), icon: Camera, color: 'bg-blue-500', description: t('education.descriptions.photography') },
    { id: 'survival', name: t('education.categories.survival'), icon: Shield, color: 'bg-red-500', description: t('education.descriptions.survival') }
  ];

  const filteredContent = educationalContent.filter(content => {
    const matchesCategory = content.category === activeCategory;
    const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDifficulty = difficultyFilter === 'all' || content.difficulty === difficultyFilter;
    
    return matchesCategory && matchesSearch && matchesDifficulty;
  });

  const getUserProgress = (contentId: string) => {
    return userProgress.find(p => p.contentId === contentId);
  };

  const updateProgress = (contentId: string, progress: number, completed: boolean = false) => {
    setUserProgress(prev => {
      const existing = prev.find(p => p.contentId === contentId);
      if (existing) {
        return prev.map(p => 
          p.contentId === contentId 
            ? { ...p, progress, completed, completedAt: completed ? new Date().toISOString() : undefined }
            : p
        );
      } else {
        return [...prev, {
          contentId,
          progress,
          completed,
          timeSpent: 0,
          completedAt: completed ? new Date().toISOString() : undefined
        }];
      }
    });
  };

  const startQuiz = () => {
    setShowQuiz(true);
    setCurrentQuestionIndex(0);
    setQuizAnswers([]);
    setSelectedAnswer(null);
    setShowQuizResult(false);
  };

  const handleQuizAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowQuizResult(true);

    // Wait 2 seconds to show result, then proceed
    setTimeout(() => {
      const newAnswers = [...quizAnswers, answerIndex];
      setQuizAnswers(newAnswers);

      if (currentQuestionIndex < quizQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setShowQuizResult(false);
      } else {
        // Quiz completed
        const score = newAnswers.reduce((acc, answer, index) => {
          return acc + (answer === quizQuestions[index].correct ? 1 : 0);
        }, 0);
        
        const percentage = (score / quizQuestions.length) * 100;
        updateProgress(selectedContent!.id, 100, true);
        setShowQuiz(false);
        setSelectedAnswer(null);
        setShowQuizResult(false);
        alert(`Quiz completed! Score: ${score}/${quizQuestions.length} (${percentage}%)`);
      }
    }, 2000);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'interactive': return Target;
      case 'quiz': return Award;
      case 'tutorial': return BookOpen;
      case 'article': return BookOpen;
      default: return BookOpen;
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {t('education.title')}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('education.empty')}
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
          🎓 {t('education.title')}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {t('education.subtitle')}
        </p>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.map(category => {
          const Icon = category.icon;
          const isActive = activeCategory === category.id;
          
          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id as any)}
              className={`p-4 rounded-xl transition-all duration-200 ${
                isActive 
                  ? `${category.color} text-white shadow-lg scale-105` 
                  : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }`}
            >
              <Icon className={`h-8 w-8 mx-auto mb-2 ${isActive ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`} />
              <h3 className={`font-semibold text-sm ${isActive ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                {category.name}
              </h3>
              <p className={`text-xs mt-1 ${isActive ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                {category.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder={t('education.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
            />
          </div>

          {/* Difficulty Filter */}
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
          >
            <option value="all">{t('education.filters.allLevels')}</option>
            <option value="beginner">{t('education.filters.beginner')}</option>
            <option value="intermediate">{t('education.filters.intermediate')}</option>
            <option value="advanced">{t('education.filters.advanced')}</option>
          </select>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContent.map(content => {
          const TypeIcon = getTypeIcon(content.type);
          const progress = getUserProgress(content.id);
          
          return (
            <div
              key={content.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-200 cursor-pointer"
              onClick={() => setSelectedContent(content)}
            >
              <div className="relative">
                <img
                  src={content.images[0]}
                  alt={content.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(content.difficulty)}`}>
                    {content.difficulty}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="bg-black/50 rounded-full p-2">
                    <TypeIcon className="h-4 w-4 text-white" />
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">{content.duration} min</span>
                  <div className="flex items-center gap-1 ml-auto">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{content.rating}</span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {content.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {content.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={content.author.avatar}
                      alt={content.author.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {content.author.name}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">{content.completedBy}</span>
                  </div>
                </div>

                {progress && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {progress.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress.progress}%` }}
                      />
                    </div>
                    {progress.completed && (
                      <div className="flex items-center gap-1 mt-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-600 dark:text-green-400">Completed</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Content Detail Modal */}
      {selectedContent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img
                src={selectedContent.images[0]}
                alt={selectedContent.title}
                className="w-full h-64 object-cover"
              />
              <button
                onClick={() => setSelectedContent(null)}
                className="absolute top-4 right-4 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {selectedContent.title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className={`px-3 py-1 rounded-full ${getDifficultyColor(selectedContent.difficulty)}`}>
                      {selectedContent.difficulty}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {selectedContent.duration} minutes
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      {selectedContent.rating}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20">
                    <Heart className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-blue-500 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20">
                    <Share className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-green-500 rounded-full hover:bg-green-50 dark:hover:bg-green-900/20">
                    <Download className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {selectedContent.description}
              </p>



              <div className="prose dark:prose-invert max-w-none mb-6">
                <p>{selectedContent.content}</p>
              </div>

              {selectedContent.location && (
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      Related Location
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedContent.location.name}
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-2 mb-6">
                {selectedContent.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedContent.author.avatar}
                    alt={selectedContent.author.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {selectedContent.author.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedContent.author.expertise}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  {selectedContent.type === 'quiz' || selectedContent.category === 'nature' ? (
                    <button
                      onClick={startQuiz}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <Award className="h-4 w-4" />
                      Take Quiz
                    </button>
                  ) : null}
                  
                  <button
                    onClick={() => updateProgress(selectedContent.id, 100, true)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Mark Complete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Modal */}
      {showQuiz && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Knowledge Quiz
              </h3>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Question {currentQuestionIndex + 1} of {quizQuestions.length}
              </span>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {quizQuestions[currentQuestionIndex].question}
              </h4>
              
              <div className="space-y-3">
                {quizQuestions[currentQuestionIndex].options.map((option, index) => {
                  let buttonClass = "w-full p-4 text-left rounded-lg transition-colors border-2 ";
                  
                  if (showQuizResult) {
                    if (index === quizQuestions[currentQuestionIndex].correct) {
                      // Correct answer
                      buttonClass += "bg-green-100 dark:bg-green-900/30 border-green-500 text-green-800 dark:text-green-200";
                    } else if (index === selectedAnswer) {
                      // Wrong answer that user selected
                      buttonClass += "bg-red-100 dark:bg-red-900/30 border-red-500 text-red-800 dark:text-red-200";
                    } else {
                      // Other options
                      buttonClass += "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400";
                    }
                  } else {
                    // Normal state
                    buttonClass += "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white";
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => !showQuizResult && handleQuizAnswer(index)}
                      disabled={showQuizResult}
                      className={buttonClass}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-lg">
                          {String.fromCharCode(65 + index)}.
                        </span>
                        <span className="font-medium">
                          {option}
                        </span>
                        {showQuizResult && index === quizQuestions[currentQuestionIndex].correct && (
                          <CheckCircle className="h-5 w-5 text-green-600 ml-auto" />
                        )}
                        {showQuizResult && index === selectedAnswer && index !== quizQuestions[currentQuestionIndex].correct && (
                          <X className="h-5 w-5 text-red-600 ml-auto" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {showQuizResult && (
                <div className="mt-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-3">
                    {selectedAnswer === quizQuestions[currentQuestionIndex].correct ? (
                      <>
                        <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-green-800 dark:text-green-200">
                            Correct! Well done! 🎉
                          </p>
                          <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                            You selected the right answer.
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <X className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-red-800 dark:text-red-200">
                            Incorrect. The correct answer is highlighted in green.
                          </p>
                          <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                            Learn from this and try again next time!
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setShowQuiz(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              
              <div className="w-full max-w-xs mx-4">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EducationalHub;