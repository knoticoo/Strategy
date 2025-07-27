import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, Bot, User, ShoppingCart, Utensils, DollarSign, Store } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatTab: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
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
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [t, messages.length]);

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    const currentLang = i18n.language;

    // Budget queries
    if (lowerMessage.includes('budget') || lowerMessage.includes('budžet') || lowerMessage.includes('бюджет') ||
        lowerMessage.includes('spend') || lowerMessage.includes('tērēt') || lowerMessage.includes('потратить')) {
      return t('chat.responses.budgetCheck', { amount: '€15.50' });
    }

    // Meal suggestions with price
    if (lowerMessage.includes('meal') || lowerMessage.includes('ēdien') || lowerMessage.includes('еда') ||
        lowerMessage.includes('food') || lowerMessage.includes('pārtik') || lowerMessage.includes('пища')) {
      
      const priceMatch = userMessage.match(/(\d+)\s*€?/);
      const price = priceMatch ? priceMatch[1] : '5';
      
      const mealSuggestions = getMealSuggestions(price, currentLang);
      return `${t('chat.responses.mealSuggestion', { price: `€${price}` })}\n\n${mealSuggestions}`;
    }

    // Deal queries
    if (lowerMessage.includes('deal') || lowerMessage.includes('piedāvāj') || lowerMessage.includes('предложен') ||
        lowerMessage.includes('maxima') || lowerMessage.includes('rimi') || lowerMessage.includes('discount')) {
      return `${t('chat.responses.dealAlert')}\n\n🛒 Maxima: Milk 2.5% - €0.99 (was €1.49)\n🛒 Rimi: Bread "Lāči" - €0.89 (was €1.29)\n🛒 Barbora: Bananas 1kg - €1.99 (was €2.99)`;
    }

    // Coupon queries
    if (lowerMessage.includes('coupon') || lowerMessage.includes('kupon') || lowerMessage.includes('купон') ||
        lowerMessage.includes('discount code') || lowerMessage.includes('atlaid')) {
      return `Here are active discount codes:\n\n🎫 MAXIMA20 - 20% off food items\n🎫 RIMI10 - €10 off €50+ purchase\n🎫 BARBORA5 - Free delivery on €25+`;
    }

    // Store queries
    if (lowerMessage.includes('store') || lowerMessage.includes('veikals') || lowerMessage.includes('магазин')) {
      return `Popular stores in Latvia:\n\n🏪 Maxima - Best for bulk shopping\n🏪 Rimi - Premium quality products\n🏪 Barbora - Online delivery\n🏪 Citro - Local neighborhood stores`;
    }

    // Default response
    const responses = [
      currentLang === 'lv' ? 'Es varu palīdzēt jums ar budžeta plānošanu, ēdienu meklēšanu un atlaižu atrašanu. Ko jūs vēlaties zināt?' :
      currentLang === 'ru' ? 'Я могу помочь вам с планированием бюджета, поиском еды и скидок. Что бы вы хотели узнать?' :
      'I can help you with budget planning, meal suggestions, and finding deals. What would you like to know?',
      
      currentLang === 'lv' ? 'Mēģiniet jautāt par budžetu, ēdieniem vai piedāvājumiem!' :
      currentLang === 'ru' ? 'Попробуйте спросить о бюджете, еде или предложениях!' :
      'Try asking about budget, meals, or deals!',
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const getMealSuggestions = (price: string, lang: string): string => {
    const budget = parseFloat(price);
    
    if (budget <= 3) {
      return lang === 'lv' ? 
        '🍞 Maizes sendviči ar sieru - €2.50\n🥛 Piens + cepumi - €2.99\n🍌 Banāns + jogurts - €2.20' :
        lang === 'ru' ?
        '🍞 Бутерброды с сыром - €2.50\n🥛 Молоко + печенье - €2.99\n🍌 Банан + йогурт - €2.20' :
        '🍞 Cheese sandwiches - €2.50\n🥛 Milk + cookies - €2.99\n🍌 Banana + yogurt - €2.20';
    } else if (budget <= 7) {
      return lang === 'lv' ?
        '🍝 Pasta ar tomātu mērci - €4.50\n🥗 Salāti ar vistu - €6.20\n🍲 Zupa + maize - €5.80\n🍕 Mini pizza - €6.99' :
        lang === 'ru' ?
        '🍝 Паста с томатным соусом - €4.50\n🥗 Салат с курицей - €6.20\n🍲 Суп + хлеб - €5.80\n🍕 Мини пицца - €6.99' :
        '🍝 Pasta with tomato sauce - €4.50\n🥗 Chicken salad - €6.20\n🍲 Soup + bread - €5.80\n🍕 Mini pizza - €6.99';
    } else {
      return lang === 'lv' ?
        '🥘 Pilna maltīte ar gaļu - €8.50\n🍱 Sushi komplekts - €12.99\n🍔 Burgera ēdienkarti - €9.20\n🥩 Steiks ar garniru - €15.50' :
        lang === 'ru' ?
        '🥘 Полный обед с мясом - €8.50\n🍱 Суши сет - €12.99\n🍔 Бургер меню - €9.20\n🥩 Стейк с гарниром - €15.50' :
        '🥘 Full meal with meat - €8.50\n🍱 Sushi set - €12.99\n🍔 Burger meal - €9.20\n🥩 Steak with sides - €15.50';
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(inputText),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const quickActions = [
    {
      text: t('chat.examples.budget'),
      icon: DollarSign,
      color: 'bg-blue-100 text-blue-700 hover:bg-blue-200'
    },
    {
      text: t('chat.examples.meal'),
      icon: Utensils,
      color: 'bg-green-100 text-green-700 hover:bg-green-200'
    },
    {
      text: t('chat.examples.deals'),
      icon: ShoppingCart,
      color: 'bg-purple-100 text-purple-700 hover:bg-purple-200'
    },
    {
      text: t('chat.examples.coupon'),
      icon: Store,
      color: 'bg-orange-100 text-orange-700 hover:bg-orange-200'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('chat.title')}
        </h1>
        <Bot className="h-8 w-8 text-blue-500" />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={() => setInputText(action.text)}
              className={`p-3 rounded-xl transition-colors ${action.color} text-sm font-medium flex items-center justify-center space-x-2`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{action.text}</span>
            </button>
          );
        })}
      </div>

      {/* Chat Container */}
      <div className="glass rounded-2xl flex flex-col h-96">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 chat-message ${
                message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                message.sender === 'user' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}>
                {message.sender === 'user' ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                )}
              </div>
              <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                message.sender === 'user' ? 'text-right' : ''
              }`}>
                <div className={`rounded-2xl px-4 py-3 ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                }`}>
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <Bot className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 border border-gray-200 dark:border-gray-700">
                <div className="loading-dots text-gray-500">
                  <span></span>
                  <span></span>
                  <span></span>
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
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
            <button
              onClick={sendMessage}
              disabled={!inputText.trim() || isTyping}
              className="p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatTab;