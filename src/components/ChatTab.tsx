import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, Bot, User, ShoppingCart, Utensils, DollarSign, Store, Sparkles, TrendingUp } from 'lucide-react';
import aiService from '../services/aiService';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  confidence?: number;
  suggestions?: string[];
  language?: string;
}

const ChatTab: React.FC = () => {
  const { i18n } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getWelcomeMessage = useCallback((): string => {
    const welcomeMessages = {
      en: "👋 Hi! I'm your smart budget assistant for Latvia. I can help you track expenses, find deals at Maxima/Rimi/Barbora, discover discount codes, and suggest meals within your budget. What would you like to know?",
      lv: "👋 Sveiki! Es esmu jūsu viedais budžeta asistents Latvijai. Es varu palīdzēt izsekot izdevumus, atrast piedāvājumus Maxima/Rimi/Barbora, atklāt atlaižu kodus un ieteikt ēdienus jūsu budžeta ietvaros. Ko jūs vēlētos uzzināt?",
      ru: "👋 Привет! Я ваш умный помощник по бюджету для Латвии. Я могу помочь отслеживать расходы, находить предложения в Maxima/Rimi/Barbora, находить промокоды и предлагать блюда в рамках вашего бюджета. Что бы вы хотели узнать?"
    };
    return welcomeMessages[i18n.language as keyof typeof welcomeMessages] || welcomeMessages.en;
  }, [i18n.language]);

  const getWelcomeSuggestions = useCallback((): string[] => {
    const suggestions = {
      en: [
        "How much can I spend today?",
        "Find me a meal for €7",
        "What deals are at Maxima today?",
        "Any discount codes available?"
      ],
      lv: [
        "Cik es varu tērēt šodien?",
        "Atrodi man ēdienu par 7€",
        "Kādi piedāvājumi ir Maximā šodien?",
        "Vai ir pieejami atlaižu kodi?"
      ],
      ru: [
        "Сколько я могу потратить сегодня?",
        "Найди мне еду на 7€",
        "Какие предложения в Maxima сегодня?",
        "Есть ли доступные промокоды?"
      ]
    };
    return suggestions[i18n.language as keyof typeof suggestions] || suggestions.en;
  }, [i18n.language]);

  useEffect(() => {
    // Add welcome message with language-specific suggestions
    const welcomeMessage: Message = {
      id: 'welcome',
      text: getWelcomeMessage(),
      sender: 'bot',
      timestamp: new Date(),
      confidence: 1.0,
      suggestions: getWelcomeSuggestions(),
      language: i18n.language
    };
    setMessages([welcomeMessage]);
  }, [i18n.language, getWelcomeMessage, getWelcomeSuggestions]);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    setIsLoading(true);

    try {
      // Get context from localStorage for personalized responses
      const budget = JSON.parse(localStorage.getItem('budget') || '{}');
      const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
      
      const context = {
        budget,
        expenses,
        language: i18n.language,
        userPreferences: {
          currency: 'EUR',
          country: 'Latvia',
          preferredStores: ['Maxima', 'Rimi', 'Barbora']
        }
      };

      // Get AI response
      const aiResponse = await aiService.generateResponse(inputText, context);
      
      // Simulate typing delay for better UX
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse.text,
        sender: 'bot',
        timestamp: new Date(),
        confidence: aiResponse.confidence,
        suggestions: aiResponse.suggestions,
        language: aiResponse.language
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getErrorMessage(),
        sender: 'bot',
        timestamp: new Date(),
        confidence: 0.1
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      setIsLoading(false);
    }
  };

  const getErrorMessage = (): string => {
    const errorMessages = {
      en: "Sorry, I'm having trouble connecting to my smart brain right now. Try asking about your budget, deals, or meal suggestions - I can still help with those!",
      lv: "Atvainojiet, man ir problēmas ar savienojumu ar manu viedajiem smadzenēm. Mēģiniet jautāt par savu budžetu, piedāvājumiem vai ēdienu ieteikumiem - es joprojām varu palīdzēt!",
      ru: "Извините, у меня проблемы с подключением к моему умному мозгу. Попробуйте спросить о вашем бюджете, предложениях или рекомендациях по еде - я все еще могу помочь!"
    };
    return errorMessages[i18n.language as keyof typeof errorMessages] || errorMessages.en;
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputText(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickActions = [
    {
      icon: <DollarSign className="h-4 w-4" />,
      text: i18n.language === 'lv' ? 'Budžets' : i18n.language === 'ru' ? 'Бюджет' : 'Budget',
      query: i18n.language === 'lv' ? 'Cik man šodien atlikts?' : i18n.language === 'ru' ? 'Сколько осталось сегодня?' : 'How much left today?'
    },
    {
      icon: <Utensils className="h-4 w-4" />,
      text: i18n.language === 'lv' ? 'Ēdiens' : i18n.language === 'ru' ? 'Еда' : 'Food',
      query: i18n.language === 'lv' ? 'Ēdiens par 5€' : i18n.language === 'ru' ? 'Еда за 5€' : 'Food for €5'
    },
    {
      icon: <Store className="h-4 w-4" />,
      text: i18n.language === 'lv' ? 'Piedāvājumi' : i18n.language === 'ru' ? 'Предложения' : 'Deals',
      query: i18n.language === 'lv' ? 'Labākie piedāvājumi' : i18n.language === 'ru' ? 'Лучшие предложения' : 'Best deals'
    },
    {
      icon: <ShoppingCart className="h-4 w-4" />,
      text: i18n.language === 'lv' ? 'Kodi' : i18n.language === 'ru' ? 'Коды' : 'Codes',
      query: i18n.language === 'lv' ? 'Atlaižu kodi' : i18n.language === 'ru' ? 'Промокоды' : 'Discount codes'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-2rem)] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-white/20 p-3 rounded-full mr-4">
              <Bot className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-xl font-bold">
                {i18n.language === 'lv' ? 'AI Budžeta Asistents' : 
                 i18n.language === 'ru' ? 'ИИ Помощник по Бюджету' : 
                 'AI Budget Assistant'}
              </h1>
              <p className="text-blue-100">
                {i18n.language === 'lv' ? 'Tiešsaistē • Gatavs palīdzēt' : 
                 i18n.language === 'ru' ? 'Онлайн • Готов помочь' : 
                 'Online • Ready to help'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center bg-green-500/20 text-green-200 px-3 py-1 rounded-full text-sm">
              <Sparkles className="h-4 w-4 mr-1" />
              Smart AI
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex space-x-2 overflow-x-auto">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(action.query)}
              className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-3 py-2 rounded-lg transition-colors whitespace-nowrap"
            >
              {action.icon}
              <span className="text-sm font-medium">{action.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 bg-gray-50 dark:bg-gray-900 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                <div className="flex items-end space-x-2">
                  {message.sender === 'bot' && (
                    <div className="bg-blue-600 p-2 rounded-full">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`px-4 py-3 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-md'
                        : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-md shadow-lg border border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.text}</p>
                    
                    {/* Confidence indicator for bot messages */}
                    {message.sender === 'bot' && message.confidence !== undefined && (
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-12 bg-gray-200 dark:bg-gray-600 rounded-full h-1">
                            <div
                              className="bg-green-500 h-1 rounded-full transition-all duration-300"
                              style={{ width: `${message.confidence * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {Math.round(message.confidence * 100)}% confident
                          </span>
                        </div>
                        {message.language && message.language !== 'en' && (
                          <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                            {message.language.toUpperCase()}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  {message.sender === 'user' && (
                    <div className="bg-gray-600 p-2 rounded-full">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>

                {/* Message timestamp */}
                <p className="text-xs text-gray-500 mt-1 text-center">
                  {message.timestamp.toLocaleTimeString()}
                </p>

                {/* Suggestions for bot messages */}
                {message.sender === 'bot' && message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {i18n.language === 'lv' ? 'Ieteiktie jautājumi:' : 
                       i18n.language === 'ru' ? 'Предлагаемые вопросы:' : 
                       'Suggested questions:'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-end space-x-2">
                <div className="bg-blue-600 p-2 rounded-full">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-md shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-end space-x-4">
          <div className="flex-1">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                i18n.language === 'lv' ? 'Jautājiet par budžetu, ēdienu, piedāvājumiem...' :
                i18n.language === 'ru' ? 'Спросите о бюджете, еде, предложениях...' :
                'Ask about budget, food, deals...'
              }
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
              rows={1}
              disabled={isLoading}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!inputText.trim() || isLoading}
            className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>

        {/* Status indicators */}
        <div className="flex items-center justify-between mt-3 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>{i18n.language === 'lv' ? 'AI Aktīvs' : i18n.language === 'ru' ? 'ИИ Активен' : 'AI Active'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <TrendingUp className="h-3 w-3" />
              <span>{i18n.language === 'lv' ? 'Reāllaika cenas' : i18n.language === 'ru' ? 'Цены в реальном времени' : 'Real-time prices'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ShoppingCart className="h-3 w-3" />
              <span>{i18n.language === 'lv' ? 'Dzīvi kuponi' : i18n.language === 'ru' ? 'Живые купоны' : 'Live coupons'}</span>
            </div>
          </div>
          <div className="text-right">
            <span>{i18n.language === 'lv' ? 'Latvijas tirgus dati' : i18n.language === 'ru' ? 'Данные рынка Латвии' : 'Latvia market data'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatTab;