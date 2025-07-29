import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, Bot, User, AlertTriangle, Loader2 } from 'lucide-react';
import { ChatMessage, PetSpecies } from '../../types';
import { PetSelector } from './PetSelector';
import { EmergencyWarning } from './EmergencyWarning';
import { generateVetAdvice } from '../../services/aiService';

export const ChatInterface: React.FC = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedPetType, setSelectedPetType] = useState<PetSpecies | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showEmergencyWarning, setShowEmergencyWarning] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const emergencyKeywords = [
    'не дышит', 'не дыхает', 'кровь', 'асиньш', 'судороги', 'krampi', 
    'отравление', 'saindēšanās', 'без сознания', 'bezsamaņā', 'emergency', 'urgent'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const checkForEmergency = (message: string): boolean => {
    const lowerMessage = message.toLowerCase();
    return emergencyKeywords.some(keyword => lowerMessage.includes(keyword));
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !selectedPetType) return;

    const isEmergency = checkForEmergency(inputMessage);
    if (isEmergency) {
      setShowEmergencyWarning(true);
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString(),
      petContext: {
        species: selectedPetType,
        symptoms: []
      }
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const aiResponse = await generateVetAdvice(inputMessage, selectedPetType);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: t('common.error') + ': ' + (error as Error).message,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const exampleQuestions = [
    { text: t('chat.examples.hairLoss'), species: 'dog' as PetSpecies },
    { text: t('chat.examples.appetite'), species: 'cat' as PetSpecies },
    { text: t('chat.examples.behavior'), species: 'bird' as PetSpecies }
  ];

  const handleExampleClick = (question: string, species: PetSpecies) => {
    setSelectedPetType(species);
    setInputMessage(question);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-primary-100 p-3 rounded-full">
            <Bot className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{t('chat.title')}</h2>
            <p className="text-gray-600">{t('welcome.description')}</p>
          </div>
        </div>

        {/* Pet Selector */}
        <div className="mb-6">
          <PetSelector
            selectedPet={selectedPetType}
            onPetSelect={setSelectedPetType}
          />
        </div>

        {/* Chat Messages */}
        <div className="bg-gray-50 rounded-lg p-4 h-96 overflow-y-auto mb-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Bot className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600 mb-6">{t('welcome.description')}</p>
              
              {/* Example Questions */}
              <div className="w-full max-w-md">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  {t('chat.examples.title')}
                </h3>
                <div className="space-y-2">
                  {exampleQuestions.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => handleExampleClick(example.text, example.species)}
                      className="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200 text-sm"
                    >
                      {example.text}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`chat-message ${message.role}`}>
                    <div className="flex items-start space-x-2">
                      {message.role === 'assistant' && (
                        <Bot className="h-5 w-5 text-primary-600 mt-0.5" />
                      )}
                      {message.role === 'user' && (
                        <User className="h-5 w-5 text-white mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        <p className={`text-xs mt-2 ${
                          message.role === 'user' ? 'text-primary-200' : 'text-gray-500'
                        }`}>
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="chat-message assistant">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-5 w-5 text-primary-600 animate-spin" />
                      <span>{t('chat.thinking')}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="flex space-x-2">
          <div className="flex-1">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t('chat.placeholder')}
              disabled={!selectedPetType || isLoading}
              className="input-field resize-none"
              rows={3}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || !selectedPetType || isLoading}
            className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>

        {!selectedPetType && (
          <p className="text-sm text-amber-600 mt-2 flex items-center">
            <AlertTriangle className="h-4 w-4 mr-1" />
            {t('chat.selectPet')}
          </p>
        )}
      </div>

      {/* Emergency Warning Modal */}
      {showEmergencyWarning && (
        <EmergencyWarning onClose={() => setShowEmergencyWarning(false)} />
      )}
    </div>
  );
};