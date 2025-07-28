import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Map,
  MapPin,
  Fish,
  Snowflake,
  Car,
  Heart,
  Sun,
  Moon,
  Menu,
  X,
  Users,
  Shield,
  Brain,
  Trophy
} from 'lucide-react';
import './i18n/config';

// Import components
import TrailsTab from './components/TrailsTab';
import CampingTab from './components/CampingTab';
import FishingTab from './components/FishingTab';
import WinterTab from './components/WinterTab';
import TransportTab from './components/TransportTab';
import FavoritesTab from './components/FavoritesTab';
import CommunityTab from './components/CommunityTab';
import SafetyTab from './components/SafetyTab';
import PersonalizationTab from './components/PersonalizationTab';
import GamificationTab from './components/GamificationTab';

type TabType = 'trails' | 'camping' | 'fishing' | 'winter' | 'transport' | 'favorites' | 'community' | 'safety' | 'personalization' | 'gamification';

function App() {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('trails');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const savedLanguage = localStorage.getItem('language');

    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    if (savedLanguage && ['en', 'lv', 'ru'].includes(savedLanguage)) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);

    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    localStorage.setItem('language', language);
  };

  const tabs = [
    {
      id: 'trails' as TabType,
      name: t('nav.trails'),
      icon: Map,
      color: 'text-nature-600',
      bgColor: 'bg-nature-50 dark:bg-nature-900/20'
    },
    {
      id: 'camping' as TabType,
      name: t('nav.camping'),
      icon: MapPin,
      color: 'text-adventure-600',
      bgColor: 'bg-adventure-50 dark:bg-adventure-900/20'
    },
    {
      id: 'fishing' as TabType,
      name: t('nav.fishing'),
      icon: Fish,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      id: 'winter' as TabType,
      name: t('nav.winter'),
      icon: Snowflake,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50 dark:bg-cyan-900/20'
    },
    {
      id: 'transport' as TabType,
      name: t('nav.transport'),
      icon: Car,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      id: 'community' as TabType,
      name: 'Community',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      id: 'safety' as TabType,
      name: 'Safety',
      icon: Shield,
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20'
    },
    {
      id: 'personalization' as TabType,
      name: 'AI Personal',
      icon: Brain,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    },
    {
      id: 'gamification' as TabType,
      name: 'Gamification',
      icon: Trophy,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20'
    },
    {
      id: 'favorites' as TabType,
      name: t('nav.favorites'),
      icon: Heart,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'trails':
        return <TrailsTab />;
      case 'camping':
        return <CampingTab />;
      case 'fishing':
        return <FishingTab />;
      case 'winter':
        return <WinterTab />;
      case 'transport':
        return <TransportTab />;
      case 'community':
        return <CommunityTab />;
      case 'safety':
        return <SafetyTab />;
      case 'personalization':
        return <PersonalizationTab />;
      case 'gamification':
        return <GamificationTab />;
      case 'favorites':
        return <FavoritesTab />;
      default:
        return <TrailsTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-nature-50 via-white to-adventure-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="glass-morphism sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo & Title */}
            <div className="flex items-center space-x-3">
              <div className="adventure-gradient text-white p-2 rounded-lg">
                <Map className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t('app.title')}
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400 hidden sm:block">
                  {t('app.subtitle')}
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-1 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-1 px-2 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
                      activeTab === tab.id
                        ? `${tab.bgColor} ${tab.color} font-medium`
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-xs">{tab.name}</span>
                  </button>
                );
              })}
            </nav>

            {/* Controls */}
            <div className="flex items-center space-x-3">
              {/* Language Switcher */}
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                {['en', 'lv', 'ru'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => changeLanguage(lang)}
                    className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                      i18n.language === lang
                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 py-3">
              <div className="grid grid-cols-2 gap-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                        activeTab === tab.id
                          ? `${tab.bgColor} ${tab.color} font-medium`
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm">{tab.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderTabContent()}
      </main>

      {/* Footer */}
      <footer className="mt-12 glass-morphism border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>© 2024 {t('app.title')} - Discover Latvia's Natural Beauty</p>
            <p className="mt-1">Built with ❤️ for outdoor enthusiasts • Complete with AI, Safety, Community & Gamification</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
