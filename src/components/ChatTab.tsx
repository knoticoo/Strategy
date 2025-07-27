import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, Bot, User, ShoppingCart, Utensils, DollarSign, Store, Sparkles, TrendingUp } from 'lucide-react';
import aiService, { AIResponse } from '../services/aiService';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  confidence?: number;
  suggestions?: string[];
}

const ChatTab: React.FC = () => {
  const { t, i18n } = useTranslation();
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

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: '1',
        text: t('chat.responses.welcome'),
        sender: 'bot',
        timestamp: new Date(),
        confidence: 1.0,
        suggestions: [
          t('chat.examples.budget'),
          t('chat.examples.meal'),
          t('chat.examples.deals'),
          t('chat.examples.coupon')
        ]
      };
      setMessages([welcomeMessage]);
    }
  }, [t, messages.length]);

  const sendMessage = async () => {
    if (!inputText.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageText = inputText;
    setInputText('');
    setIsTyping(true);
    setIsLoading(true);

    try {
      // Get current context (budget, expenses, language)
      const budget = JSON.parse(localStorage.getItem('budget') || '{"daily": 20, "weekly": 140, "monthly": 600}');
      const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
      
      const context = {
        budget,
        expenses,
        language: i18n.language,
        timestamp: new Date()
      };

      // Get AI response with real data integration
      const aiResponse: AIResponse = await aiService.generateResponse(messageText, context);
      
      // Add some realistic delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse.text,
        sender: 'bot',
        timestamp: new Date(),
        confidence: aiResponse.confidence,
        suggestions: aiResponse.suggestions
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Fallback response
      const fallbackResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble connecting to my smart brain right now. But I can still help with basic questions about your budget, deals, and coupons! What would you like to know?",
        sender: 'bot',
        timestamp: new Date(),
        confidence: 0.3
      };
      
      setMessages(prev => [...prev, fallbackResponse]);
    } finally {
      setIsTyping(false);
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputText(suggestion);
  };

  const quickActions = [
    {
      text: t('chat.examples.budget'),
      icon: DollarSign,
      color: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
      description: 'Check spending and budget status'
    },
    {
      text: t('chat.examples.meal'),
      icon: Utensils,
      color: 'bg-green-100 text-green-700 hover:bg-green-200',
      description: 'Find meals within your budget'
    },
    {
      text: t('chat.examples.deals'),
      icon: ShoppingCart,
      color: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
      description: 'Get real-time deals from stores'
    },
    {
      text: t('chat.examples.coupon'),
      icon: Store,
      color: 'bg-orange-100 text-orange-700 hover:bg-orange-200',
      description: 'Find verified discount codes'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('chat.title')}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Powered by AI • Real-time data • Multi-language
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-600 font-medium">Online</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={() => handleSuggestionClick(action.text)}
              className={`p-4 rounded-xl transition-all duration-200 ${action.color} text-left hover:shadow-md transform hover:scale-105`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <Icon className="h-5 w-5" />
                <span className="font-medium text-sm">{action.text}</span>
              </div>
              <p className="text-xs opacity-75">{action.description}</p>
            </button>
          );
        })}
      </div>

      {/* Chat Container */}
      <div className="glass rounded-2xl flex flex-col h-96 lg:h-[500px]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 chat-message ${
                message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                message.sender === 'user' 
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' 
                  : 'bg-gradient-to-br from-purple-500 to-purple-600 text-white'
              }`}>
                {message.sender === 'user' ? (
                  <User className="h-5 w-5" />
                ) : (
                  <Bot className="h-5 w-5" />
                )}
              </div>
              
              <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                message.sender === 'user' ? 'text-right' : ''
              }`}>
                <div className={`rounded-2xl px-4 py-3 shadow-sm ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                }`}>
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                  
                  {/* Confidence indicator for AI responses */}
                  {message.sender === 'bot' && message.confidence && (
                    <div className="flex items-center mt-2 space-x-1">
                      <TrendingUp className="h-3 w-3 text-gray-500" />
                      <span className="text-xs text-gray-500">
                        {Math.round(message.confidence * 100)}% confident
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                {/* Suggestions */}
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Try asking:</p>
                    <div className="space-y-1">
                      {message.suggestions.slice(0, 3).map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="block w-full text-left px-3 py-2 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
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
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-md">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center space-x-2">
                  <div className="loading-dots text-purple-500">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  {isLoading && (
                    <span className="text-xs text-gray-500">
                      Analyzing data...
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-200/50 dark:border-gray-700/50 p-4">
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder={t('chat.placeholder')}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 shadow-sm"
              disabled={isTyping}
            />
            <button
              onClick={sendMessage}
              disabled={!inputText.trim() || isTyping}
              className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
          
          {/* Status indicator */}
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              <span>🤖 Smart AI responses</span>
              <span>💰 Real-time prices</span>
              <span>🎫 Live coupons</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Connected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatTab;