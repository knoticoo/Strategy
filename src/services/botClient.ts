import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { PetSpecies } from '../types';

export interface BotChatRequest {
  query: string;
  species: PetSpecies;
  language?: 'en' | 'lv' | 'ru';
  sessionId?: string;
  context?: {
    previousQueries?: string[];
    petAge?: string;
    petBreed?: string;
    symptoms?: string[];
  };
}

export interface BotChatResponse {
  conversationId: string;
  sessionId: string;
  answer: string;
  confidence: number;
  language: 'en' | 'lv' | 'ru';
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  recommendations: string[];
  followUp: string[];
  sources: string[];
  metadata: {
    processingTime: number;
    aiProvider: string;
    reasoning: string;
    totalSources: number;
  };
}

export interface BotTranslationRequest {
  text: string;
  from?: 'en' | 'lv' | 'ru';
  to: 'en' | 'lv' | 'ru';
  context?: 'medical' | 'general';
}

export interface BotTranslationResponse {
  originalText: string;
  translatedText: string;
  fromLanguage: 'en' | 'lv' | 'ru';
  toLanguage: 'en' | 'lv' | 'ru';
  confidence: number;
  service: string;
}

export interface BotFeedback {
  conversationId: string;
  rating: number;
  feedback?: string;
  helpful: boolean;
}

export interface BotHealthStatus {
  status: 'healthy' | 'degraded' | 'down';
  version: string;
  uptime: number;
  stats: {
    totalConversations: number;
    averageResponseTime: number;
    successRate: number;
  };
}

class AIBotClient {
  private client: AxiosInstance;
  private baseURL: string;
  private sessionId: string | null = null;

  constructor(baseURL: string = 'http://localhost:3001') {
    this.baseURL = baseURL;
    this.client = axios.create({
      baseURL: `${baseURL}/api/v1`,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        console.log(`🤖 Bot API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('🤖 Bot API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => {
        console.log(`✅ Bot API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('❌ Bot API Error:', error?.response?.data || error.message);
        
        // Handle specific error cases
        if (error.code === 'ECONNREFUSED') {
          throw new Error('AI Bot Service is not available. Please try again later.');
        }
        
        if (error.response?.status === 429) {
          throw new Error('Too many requests. Please wait a moment before trying again.');
        }
        
        if (error.response?.status >= 500) {
          throw new Error('AI Bot Service is experiencing issues. Please try again later.');
        }
        
        return Promise.reject(error);
      }
    );
  }

  /**
   * Send a chat message to the AI bot
   */
  async chat(request: BotChatRequest): Promise<BotChatResponse> {
    try {
      const payload = {
        ...request,
        sessionId: request.sessionId || this.sessionId || this.generateSessionId()
      };

      const response: AxiosResponse<{ success: boolean; data: BotChatResponse }> = 
        await this.client.post('/chat/ask', payload);

      if (!response.data.success) {
        throw new Error('Bot chat request failed');
      }

      // Store session ID for future requests
      this.sessionId = response.data.data.sessionId;

      return response.data.data;

    } catch (error) {
      console.error('🤖 Chat request failed:', error);
      
      // Return fallback response if bot service is down
      return this.generateFallbackResponse(request);
    }
  }

  /**
   * Translate text using the bot's translation service
   */
  async translate(request: BotTranslationRequest): Promise<BotTranslationResponse> {
    try {
      const response: AxiosResponse<{ success: boolean; data: BotTranslationResponse }> = 
        await this.client.post('/chat/translate', request);

      if (!response.data.success) {
        throw new Error('Translation request failed');
      }

      return response.data.data;

    } catch (error) {
      console.error('🌍 Translation failed:', error);
      throw new Error('Translation service is currently unavailable');
    }
  }

  /**
   * Get suggested questions for a specific pet species
   */
  async getSuggestions(species: PetSpecies, language: 'en' | 'lv' | 'ru' = 'en'): Promise<string[]> {
    try {
      const response: AxiosResponse<{ success: boolean; data: { suggestions: string[] } }> = 
        await this.client.get(`/chat/suggestions/${species}`, {
          params: { language }
        });

      if (!response.data.success) {
        throw new Error('Failed to get suggestions');
      }

      return response.data.data.suggestions;

    } catch (error) {
      console.error('💡 Failed to get suggestions:', error);
      
      // Return fallback suggestions
      return this.getFallbackSuggestions(species, language);
    }
  }

  /**
   * Submit feedback for a conversation
   */
  async submitFeedback(feedback: BotFeedback): Promise<void> {
    try {
      const response: AxiosResponse<{ success: boolean }> = 
        await this.client.post('/chat/feedback', feedback);

      if (!response.data.success) {
        throw new Error('Failed to submit feedback');
      }

    } catch (error) {
      console.error('📝 Failed to submit feedback:', error);
      // Silently fail for feedback - not critical
    }
  }

  /**
   * Get conversation history for current session
   */
  async getHistory(limit: number = 10): Promise<any[]> {
    if (!this.sessionId) {
      return [];
    }

    try {
      const response: AxiosResponse<{ success: boolean; data: { conversations: any[] } }> = 
        await this.client.get(`/chat/history/${this.sessionId}`, {
          params: { limit }
        });

      if (!response.data.success) {
        return [];
      }

      return response.data.data.conversations;

    } catch (error) {
      console.error('📚 Failed to get history:', error);
      return [];
    }
  }

  /**
   * Check bot service health
   */
  async checkHealth(): Promise<BotHealthStatus> {
    try {
      const response: AxiosResponse<BotHealthStatus> = 
        await this.client.get('/health');

      return response.data;

    } catch (error) {
      console.error('🏥 Health check failed:', error);
      
      return {
        status: 'down',
        version: 'unknown',
        uptime: 0,
        stats: {
          totalConversations: 0,
          averageResponseTime: 0,
          successRate: 0
        }
      };
    }
  }

  /**
   * Get available medicines
   */
  async getMedicines(query?: string, species?: PetSpecies): Promise<any[]> {
    try {
      const response: AxiosResponse<{ success: boolean; data: any[] }> = 
        await this.client.get('/medicines', {
          params: { query, species }
        });

      if (!response.data.success) {
        return [];
      }

      return response.data.data;

    } catch (error) {
      console.error('💊 Failed to get medicines:', error);
      return [];
    }
  }

  /**
   * Get bot analytics and stats
   */
  async getStats(): Promise<any> {
    try {
      const response: AxiosResponse<{ success: boolean; data: any }> = 
        await this.client.get('/analytics/stats');

      if (!response.data.success) {
        return null;
      }

      return response.data.data;

    } catch (error) {
      console.error('📊 Failed to get stats:', error);
      return null;
    }
  }

  /**
   * Set custom session ID
   */
  setSessionId(sessionId: string): void {
    this.sessionId = sessionId;
  }

  /**
   * Get current session ID
   */
  getSessionId(): string | null {
    return this.sessionId;
  }

  /**
   * Clear session
   */
  clearSession(): void {
    this.sessionId = null;
  }

  /**
   * Update bot service URL
   */
  updateBaseURL(baseURL: string): void {
    this.baseURL = baseURL;
    this.client.defaults.baseURL = `${baseURL}/api/v1`;
  }

  private generateSessionId(): string {
    return 'session-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now();
  }

  private generateFallbackResponse(request: BotChatRequest): BotChatResponse {
    return {
      conversationId: 'fallback-' + Date.now(),
      sessionId: this.sessionId || this.generateSessionId(),
      answer: `I apologize, but the AI bot service is currently unavailable. For your ${request.species}'s health concern, please consult with a qualified veterinarian who can provide proper diagnosis and treatment. Your pet's health is important, and professional veterinary care is always the best option.`,
      confidence: 0,
      language: request.language || 'en',
      urgency: 'medium',
      recommendations: [
        'Consult a veterinarian if this is urgent',
        'Monitor your pet closely',
        'Ensure your pet is comfortable'
      ],
      followUp: [
        'Is this an emergency?',
        'How long have you noticed these symptoms?'
      ],
      sources: [],
      metadata: {
        processingTime: 0,
        aiProvider: 'Fallback System',
        reasoning: 'Bot service unavailable',
        totalSources: 0
      }
    };
  }

  private getFallbackSuggestions(species: PetSpecies, language: 'en' | 'lv' | 'ru'): string[] {
    const suggestions = {
      dog: ['My dog is not eating', 'My dog is vomiting', 'My dog has diarrhea'],
      cat: ['My cat is hiding', 'My cat is not using litter box', 'My cat is coughing'],
      bird: ['My bird is not singing', 'My bird is plucking feathers', 'My bird looks sick'],
      rabbit: ['My rabbit is not eating', 'My rabbit has soft stool', 'My rabbit is lethargic'],
      hamster: ['My hamster is not active', 'My hamster has wet tail', 'My hamster is losing weight'],
      guinea_pig: ['My guinea pig is wheezing', 'My guinea pig has scurvy', 'My guinea pig is not eating'],
      fish: ['My fish is floating', 'My fish has white spots', 'My fish is not swimming'],
      reptile: ['My reptile is not eating', 'My reptile has shed problems', 'My reptile is lethargic']
    };

    return suggestions[species] || suggestions.dog;
  }
}

// Create singleton instance
export const botClient = new AIBotClient(
  process.env.VITE_BOT_SERVICE_URL || 'http://localhost:3001'
);

export default botClient;