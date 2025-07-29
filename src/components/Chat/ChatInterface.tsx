import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, Bot, User, AlertTriangle, Sparkles, Brain, Stethoscope } from 'lucide-react';
import { PetSpecies, ChatMessage } from '../../types';
import { generateVetAdvice } from '../../services/aiService';
import { PetSelector } from './PetSelector';
import { EmergencyWarning } from './EmergencyWarning';

export const ChatInterface: React.FC = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedPet, setSelectedPet] = useState<PetSpecies | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const [aiStatus, setAiStatus] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const emergencyKeywords = [
    'difficulty breathing', 'not breathing', 'collapsed', 'unconscious', 'bleeding heavily',
    'poisoning', 'seizure', 'blue gums', 'choking', 'severe pain',
    'elpošanas grūtības', 'neelpo', 'sabrucis', 'bezsamaņā', 'stipri asiņo',
    'saindēšanās', 'krampji', 'zilas smaganas', 'nosmok', 'stipras sāpes',
    'затрудненное дыхание', 'не дышит', 'упал в обморок', 'без сознания', 'сильное кровотечение',
    'отравление', 'судороги', 'синие десны', 'задыхается', 'сильная боль'
  ];

  const checkForEmergency = (message: string): boolean => {
    return emergencyKeywords.some(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase())
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !selectedPet || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Check for emergency keywords
    if (checkForEmergency(inputValue)) {
      setShowEmergency(true);
    }

    setIsLoading(true);
    setAiStatus('🔍 Analyzing your query...');

    try {
      // Show AI working status
      setAiStatus('🌐 Searching veterinary databases...');
      
      // Simulate some delay to show the AI is working
      await new Promise(resolve => setTimeout(resolve, 800));
      setAiStatus('🤖 Analyzing symptoms and conditions...');
      
      await new Promise(resolve => setTimeout(resolve, 600));
      setAiStatus('💊 Discovering relevant medications...');
      
      await new Promise(resolve => setTimeout(resolve, 500));
      setAiStatus('🌍 Translating medical information...');

      const aiResponse = await generateVetAdvice(inputValue, selectedPet);
      
      setAiStatus('✅ Response ready!');
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      setAiStatus('❌ Error occurred');
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: t('chat.errorMessage'),
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setAiStatus('');
    }
  };

  // Dynamic example questions based on selected pet
  const getExampleQuestions = (petType: PetSpecies | null) => {
    if (!petType) return [];

    const examples = {
      dog: [
        { lv: "Mans suns zaudē matus", ru: "Моя собака теряет шерсть", en: "My dog is losing hair" },
        { lv: "Suns daudz vemj", ru: "Собака часто рвет", en: "Dog is vomiting frequently" },
        { lv: "Suns klepoj", ru: "Собака кашляет", en: "Dog is coughing" },
        { lv: "Sunim sāp acis", ru: "У собаки болят глаза", en: "Dog has sore eyes" }
      ],
      cat: [
        { lv: "Kaķis zaudē matus", ru: "Кошка теряет шерсть", en: "Cat is losing hair" },
        { lv: "Kaķis daudz vemj", ru: "Кошка часто рвет", en: "Cat is vomiting frequently" },
        { lv: "Kaķis nevar čurāt", ru: "Кошка не может мочиться", en: "Cat cannot urinate" },
        { lv: "Kaķim sāp acis", ru: "У кошки болят глаза", en: "Cat has sore eyes" }
      ],
      bird: [
        { lv: "Putns neēd", ru: "Птица не ест", en: "Bird is not eating" },
        { lv: "Putns nevar lidot", ru: "Птица не может летать", en: "Bird cannot fly" },
        { lv: "Putns smagi elpo", ru: "Птица тяжело дышит", en: "Bird is breathing heavily" },
        { lv: "Putnam izkrišana spalvas", ru: "У птицы выпадают перья", en: "Bird is losing feathers" }
      ],
      rabbit: [
        { lv: "Trusis šķauda", ru: "Кролик чихает", en: "Rabbit is sneezing" },
        { lv: "Trusis neēd", ru: "Кролик не ест", en: "Rabbit is not eating" },
        { lv: "Trusim caureja", ru: "У кролика диарея", en: "Rabbit has diarrhea" },
        { lv: "Trusis guļ daudz", ru: "Кролик много спит", en: "Rabbit sleeps too much" }
      ],
      hamster: [
        { lv: "Kāmis neēd", ru: "Хомяк не ест", en: "Hamster is not eating" },
        { lv: "Kāmis daudz guļ", ru: "Хомяк много спит", en: "Hamster sleeps too much" },
        { lv: "Kāmim pietūkums", ru: "У хомяка опухоль", en: "Hamster has swelling" },
        { lv: "Kāmis smagi elpo", ru: "Хомяк тяжело дышит", en: "Hamster is breathing heavily" }
      ],
      guinea_pig: [
        { lv: "Jūras cūciņa neēd", ru: "Морская свинка не ест", en: "Guinea pig is not eating" },
        { lv: "Jūras cūciņa klepoj", ru: "Морская свинка кашляет", en: "Guinea pig is coughing" },
        { lv: "Jūras cūciņai caureja", ru: "У морской свинки диарея", en: "Guinea pig has diarrhea" },
        { lv: "Jūras cūciņa zaudē svaru", ru: "Морская свинка теряет вес", en: "Guinea pig is losing weight" }
      ],
      fish: [
        { lv: "Zivs peld uz sāniem", ru: "Рыба плавает на боку", en: "Fish is swimming sideways" },
        { lv: "Zivij balti plankumi", ru: "У рыбы белые пятна", en: "Fish has white spots" },
        { lv: "Zivs neēd", ru: "Рыба не ест", en: "Fish is not eating" },
        { lv: "Zivij saplēstas spuras", ru: "У рыбы порванные плавники", en: "Fish has torn fins" }
      ],
      reptile: [
        { lv: "Rāpulis neēd", ru: "Рептилия не ест", en: "Reptile is not eating" },
        { lv: "Rāpulim ādas problēmas", ru: "У рептилии проблемы с кожей", en: "Reptile has skin problems" },
        { lv: "Rāpulis neaktīvs", ru: "Рептилия неактивна", en: "Reptile is inactive" },
        { lv: "Rāpulim acis aizvērtas", ru: "У рептилии закрыты глаза", en: "Reptile has closed eyes" }
      ]
    };

    return examples[petType] || [];
  };

  const exampleQuestions = getExampleQuestions(selectedPet);

  const handleExampleClick = (question: string) => {
    setInputValue(question);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary-300 rounded-full"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-accent-300 rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-primary-200 rounded-full"></div>
        <div className="absolute bottom-32 right-1/3 w-24 h-24 bg-accent-200 rounded-full"></div>
      </div>

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 p-6 relative z-10">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-lg">
            <Stethoscope className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              {t('welcome.aiConsultation')}
            </h2>
            <p className="text-gray-600 text-sm flex items-center space-x-1">
              <Brain className="h-4 w-4" />
              <span>AI-powered veterinary assistance</span>
              <Sparkles className="h-4 w-4 text-yellow-500" />
            </p>
          </div>
        </div>

        {!selectedPet && (
          <div className="bg-gradient-to-r from-primary-50 to-indigo-50 rounded-xl p-4 border border-primary-200">
            <h3 className="font-semibold text-primary-800 mb-3 flex items-center space-x-2">
              <span>🐾</span>
              <span>{t('chat.selectPetType')}</span>
            </h3>
            <PetSelector onSelect={setSelectedPet} />
          </div>
        )}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10">
        {messages.length === 0 && selectedPet && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary-100 to-primary-200 rounded-full mb-6">
              <Bot className="h-10 w-10 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {t('chat.welcomeMessage')}
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {t('chat.welcomeDescription')}
            </p>
            
            {/* Example Questions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
              {exampleQuestions.map((q, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(q.lv)}
                  className="p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200/50 hover:border-primary-300 hover:bg-white/90 transition-all duration-200 text-left group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-primary-400 to-primary-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-white text-sm">💭</span>
                    </div>
                    <span className="text-gray-700 group-hover:text-primary-700 font-medium">
                      {q.lv}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`flex max-w-4xl ${
                message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              } space-x-3`}
            >
              {/* Avatar */}
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-accent-400 to-accent-500 ml-3'
                    : 'bg-gradient-to-r from-primary-400 to-primary-500 mr-3'
                }`}
              >
                {message.sender === 'user' ? (
                  <User className="h-5 w-5 text-white" />
                ) : (
                  <Bot className="h-5 w-5 text-white" />
                )}
              </div>

              {/* Message Content */}
              <div
                className={`rounded-2xl px-6 py-4 shadow-sm ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white'
                    : 'bg-white/80 backdrop-blur-sm border border-gray-200/50 text-gray-800'
                }`}
              >
                <div className="prose prose-sm max-w-none">
                  {message.content.split('\n').map((line, index) => {
                    // Handle headers with **text**
                    if (line.startsWith('**') && line.endsWith('**')) {
                      return (
                        <h4 key={index} className={`font-bold mb-2 mt-3 ${
                          message.sender === 'user' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {line.replace(/\*\*/g, '')}
                        </h4>
                      );
                    }
                    // Handle emoji headers like 🔍 **TEXT**
                    if (line.includes('**') && (line.includes('🔍') || line.includes('🎯') || line.includes('💡') || line.includes('💊') || line.includes('🍽️') || line.includes('🟢') || line.includes('🟡') || line.includes('🟠') || line.includes('🔴') || line.includes('📋'))) {
                      return (
                        <h4 key={index} className={`font-bold mb-2 mt-4 text-lg ${
                          message.sender === 'user' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {line.replace(/\*\*/g, '')}
                        </h4>
                      );
                    }
                    // Handle bullet points
                    if (line.startsWith('• ') || line.startsWith('- ')) {
                      return (
                        <p key={index} className={`mb-1 ml-4 ${
                          message.sender === 'user' ? 'text-white/90' : 'text-gray-700'
                        }`}>
                          {line}
                        </p>
                      );
                    }
                    // Handle numbered lists
                    if (/^\d+\./.test(line.trim())) {
                      return (
                        <p key={index} className={`mb-1 ml-4 ${
                          message.sender === 'user' ? 'text-white/90' : 'text-gray-700'
                        }`}>
                          {line}
                        </p>
                      );
                    }
                    // Handle empty lines
                    if (line.trim() === '') {
                      return <div key={index} className="h-2"></div>;
                    }
                    // Regular text
                    return (
                      <p key={index} className={`mb-1 ${
                        message.sender === 'user' ? 'text-white/90' : 'text-gray-700'
                      }`}>
                        {line}
                      </p>
                    );
                  })}
                </div>
                <div className={`text-xs mt-3 ${
                  message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Loading Animation */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex max-w-4xl flex-row space-x-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-r from-primary-400 to-primary-500 flex items-center justify-center mr-3">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl px-6 py-4 shadow-sm">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-gray-600 ml-3">
                    {aiStatus || 'AI is analyzing...'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      {selectedPet && (
        <div className="bg-white/80 backdrop-blur-sm border-t border-gray-200/50 p-6 relative z-10">
          <form onSubmit={handleSubmit} className="flex space-x-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={t('chat.inputPlaceholder')}
                className="w-full px-6 py-4 bg-white/90 backdrop-blur-sm border border-gray-300/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-500"
                disabled={isLoading}
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Sparkles className="h-5 w-5" />
              </div>
            </div>
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-2xl font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl disabled:shadow-none transform hover:scale-105 disabled:scale-100"
            >
              <Send className="h-5 w-5" />
              <span>{t('chat.sendButton')}</span>
            </button>
          </form>
          
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500 flex items-center justify-center space-x-1">
              <AlertTriangle className="h-3 w-3" />
              <span>{t('chat.disclaimer')}</span>
            </p>
          </div>
        </div>
      )}

      {/* Emergency Warning Modal */}
      {showEmergency && (
        <EmergencyWarning onClose={() => setShowEmergency(false)} />
      )}
    </div>
  );
};