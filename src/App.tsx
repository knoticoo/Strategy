import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Wallet, 
  ShoppingBag, 
  Ticket, 
  Bot, 
  Globe, 
  Sun, 
  Moon,
  MapPin
} from 'lucide-react';
import './i18n/config';

// Components
import BudgetTab from './components/BudgetTab';
import DealsTab from './components/DealsTab';
import CouponsTab from './components/CouponsTab';
import ChatTab from './components/ChatTab';
import StoreLocatorTab from './components/StoreLocatorTab';

type TabType = 'budget' | 'deals' | 'coupons' | 'stores' | 'chat';

function App() {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('budget');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Load theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
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
      id: 'budget' as TabType, 
      name: t('nav.budget'), 
      icon: Wallet, 
      color: 'text-blue-600', 
      bgColor: 'bg-blue-50 dark:bg-blue-900/20' 
    },
    { 
      id: 'deals' as TabType, 
      name: t('nav.deals'), 
      icon: ShoppingBag, 
      color: 'text-green-600', 
      bgColor: 'bg-green-50 dark:bg-green-900/20' 
    },
    { 
      id: 'coupons' as TabType, 
      name: t('nav.coupons'), 
      icon: Ticket, 
      color: 'text-purple-600', 
      bgColor: 'bg-purple-50 dark:bg-purple-900/20' 
    },
    { 
      id: 'stores' as TabType, 
      name: 'Store Locator', 
      icon: MapPin, 
      color: 'text-orange-600', 
      bgColor: 'bg-orange-50 dark:bg-orange-900/20' 
    },
    { 
      id: 'chat' as TabType, 
      name: t('nav.chat'), 
      icon: Bot, 
      color: 'text-indigo-600', 
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20' 
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'budget':
        return <BudgetTab />;
      case 'deals':
        return <DealsTab />;
      case 'coupons':
        return <CouponsTab />;
      case 'stores':
        return <StoreLocatorTab />;
      case 'chat':
        return <ChatTab />;
      default:
        return <BudgetTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="glass border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Bot className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Budget AI Latvia
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Jūsu viedais budžeta asistents
                </p>
              </div>
            </div>

            {/* Settings */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-600" />
                )}
              </button>

              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="flex items-center space-x-2 p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <Globe className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {i18n.language.toUpperCase()}
                  </span>
                </button>

                {showSettings && (
                  <div className="absolute right-0 mt-2 w-48 glass rounded-2xl shadow-xl border border-white/20 z-50">
                    <div className="p-3">
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        {t('common.language')}
                      </h3>
                      <div className="space-y-2">
                        {[
                          { code: 'lv', name: 'Latviešu', flag: '🇱🇻' },
                          { code: 'ru', name: 'Русский', flag: '🇷🇺' },
                          { code: 'en', name: 'English', flag: '🇬🇧' }
                        ].map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => {
                              changeLanguage(lang.code);
                              setShowSettings(false);
                            }}
                            className={`w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-white/20 transition-colors ${
                              i18n.language === lang.code ? 'bg-white/20' : ''
                            }`}
                          >
                            <span className="text-lg">{lang.flag}</span>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {lang.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-6 border-b-2 font-medium text-sm transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                  {isActive && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce-subtle" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="tab-content">
          {renderTabContent()}
        </div>
      </main>

      {/* Floating Action Button for Quick Chat */}
      {activeTab !== 'chat' && (
        <button
          onClick={() => setActiveTab('chat')}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-200 z-40"
        >
          <Bot className="h-7 w-7 mx-auto" />
        </button>
      )}

      {/* Background Click Handler for Settings */}
      {showSettings && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}

export default App;
