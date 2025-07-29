import { v4 as uuidv4 } from 'uuid';
import { RealWebScraper } from './RealWebScraper';
import { RealTranslator } from './RealTranslator';
import { RealAIProvider } from './RealAIProvider';
import { MedicationDatabase } from '../database/MedicationDatabase';
import { logger } from '../utils/logger';

export interface ChatRequest {
  query: string;
  species: 'dog' | 'cat' | 'bird' | 'rabbit' | 'hamster' | 'guinea_pig' | 'fish' | 'reptile';
  language: 'en' | 'lv' | 'ru';
  sessionId: string;
  context: {
    previousQueries?: string[];
    petAge?: string;
    petBreed?: string;
    symptoms?: string[];
  };
}

export interface ChatResponse {
  sessionId: string;
  answer: string;
  confidence: number;
  language: 'en' | 'lv' | 'ru';
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  recommendations: string[];
  followUpQuestions: string[];
  sources: string[];
  provider: string;
  reasoning: string;
}

export interface TranslationResponse {
  translatedText: string;
  fromLanguage: 'en' | 'lv' | 'ru';
  toLanguage: 'en' | 'lv' | 'ru';
  confidence: number;
  service: string;
}

export interface FeedbackData {
  rating: number;
  feedback?: string;
  helpful: boolean;
}

export class AIVeterinaryBot {
  private webScraper: RealWebScraper;
  private translator: RealTranslator;
  private aiProvider: RealAIProvider;
  private medicationDb: MedicationDatabase;
  private conversationHistory: Map<string, any[]> = new Map();

  constructor() {
    this.webScraper = new RealWebScraper();
    this.translator = new RealTranslator();
    this.aiProvider = new RealAIProvider();
    this.medicationDb = new MedicationDatabase();
    
    logger.info('🤖 AI Veterinary Bot initialized with real external services');
  }

  async generateResponse(request: ChatRequest): Promise<ChatResponse> {
    const startTime = Date.now();
    logger.info(`🧠 Processing query: "${request.query}" for ${request.species} in ${request.language}`);

    try {
      // Step 1: Detect and normalize language
      const detectedLanguage = await this.translator.detectLanguage(request.query);
      const workingLanguage = request.language || detectedLanguage;

      // Step 2: Translate query to English for processing if needed
      let englishQuery = request.query;
      if (workingLanguage !== 'en') {
        const translation = await this.translator.translateText(request.query, workingLanguage, 'en', 'medical');
        englishQuery = translation.translatedText;
        logger.info(`🌍 Query translated: "${request.query}" -> "${englishQuery}"`);
      }

      // Step 3: Gather external knowledge
      const externalData = await this.gatherKnowledge(englishQuery, request.species);
      logger.info(`📚 Gathered ${externalData.length} external sources`);

      // Step 4: Check for medications in query
      const medicationInfo = await this.getMedicationInfo(englishQuery);
      
      // Step 5: Build context for AI
      const context = this.buildAIContext(englishQuery, request.species, externalData, medicationInfo, request.context);

      // Step 6: Generate AI response
      const aiResponse = await this.aiProvider.generateVeterinaryResponse(
        englishQuery,
        request.species,
        context
      );

      // Step 7: Translate response back to user's language
      let finalAnswer = aiResponse.answer;
      if (workingLanguage !== 'en') {
        const translatedResponse = await this.translator.translateText(
          aiResponse.answer,
          'en',
          workingLanguage,
          'medical'
        );
        finalAnswer = translatedResponse.translatedText;
      }

      // Step 8: Generate recommendations and follow-up questions
      const recommendations = await this.generateRecommendations(request.species, workingLanguage, aiResponse.urgency);
      const followUpQuestions = await this.generateFollowUpQuestions(englishQuery, request.species, workingLanguage);

      // Step 9: Store conversation
      this.storeConversation(request.sessionId, {
        query: request.query,
        response: finalAnswer,
        confidence: aiResponse.confidence,
        processingTime: Date.now() - startTime
      });

      const response: ChatResponse = {
        sessionId: request.sessionId,
        answer: finalAnswer,
        confidence: aiResponse.confidence,
        language: workingLanguage,
        urgency: aiResponse.urgency,
        recommendations,
        followUpQuestions,
        sources: externalData.map(d => d.url).filter(Boolean),
        provider: aiResponse.provider,
        reasoning: aiResponse.reasoning
      };

      logger.info(`✅ Response generated in ${Date.now() - startTime}ms with ${Math.round(aiResponse.confidence * 100)}% confidence`);
      return response;

    } catch (error) {
      logger.error('❌ Failed to generate response:', error);
      return this.generateFallbackResponse(request);
    }
  }

  private async gatherKnowledge(query: string, species: string): Promise<any[]> {
    try {
      // Search multiple sources in parallel
      const [wikipediaResults, veterinaryResults] = await Promise.all([
        this.webScraper.searchWikipedia(query, species),
        this.webScraper.searchVeterinarySites(query, species)
      ]);

      return [...wikipediaResults, ...veterinaryResults]
        .sort((a, b) => b.reliability - a.reliability)
        .slice(0, 8); // Top 8 most reliable sources

    } catch (error) {
      logger.error('⚠️ Knowledge gathering failed:', error);
      return [];
    }
  }

  private async getMedicationInfo(query: string): Promise<any[]> {
    try {
      // Check if query mentions medications
      const medicationKeywords = /\b(medicine|medication|drug|pill|tablet|treatment|dose|dosage|antibiotic|painkiller|vaccine)\b/gi;
      
      if (!medicationKeywords.test(query)) {
        return [];
      }

      // Search medication database
      const medications = await this.medicationDb.searchMedications(query);
      logger.info(`💊 Found ${medications.length} relevant medications`);
      
      return medications;

    } catch (error) {
      logger.error('⚠️ Medication search failed:', error);
      return [];
    }
  }

  private buildAIContext(
    query: string, 
    species: string, 
    externalData: any[], 
    medicationInfo: any[],
    userContext: any
  ): string {
    let context = `Veterinary query about a ${species}: "${query}"\n\n`;

    // Add external sources
    if (externalData.length > 0) {
      context += "RELEVANT VETERINARY INFORMATION:\n";
      externalData.slice(0, 5).forEach((data, index) => {
        context += `${index + 1}. ${data.title}: ${data.content.substring(0, 300)}...\n`;
      });
      context += '\n';
    }

    // Add medication information
    if (medicationInfo.length > 0) {
      context += "RELEVANT MEDICATIONS:\n";
      medicationInfo.slice(0, 3).forEach((med, index) => {
        context += `${index + 1}. ${med.name}: ${med.description}\n`;
        if (med.dosage) context += `   Dosage: ${med.dosage}\n`;
        if (med.sideEffects) context += `   Side effects: ${med.sideEffects}\n`;
      });
      context += '\n';
    }

    // Add user context
    if (userContext.petAge) context += `Pet age: ${userContext.petAge}\n`;
    if (userContext.petBreed) context += `Pet breed: ${userContext.petBreed}\n`;
    if (userContext.symptoms && userContext.symptoms.length > 0) {
      context += `Reported symptoms: ${userContext.symptoms.join(', ')}\n`;
    }

    return context;
  }

  private async generateRecommendations(
    species: string, 
    language: 'en' | 'lv' | 'ru', 
    urgency: string
  ): Promise<string[]> {
    const baseRecommendations = [
      'Consult with a qualified veterinarian for proper diagnosis',
      'Monitor your pet\'s symptoms closely',
      'Ensure your pet has access to fresh water',
      'Keep your pet comfortable and stress-free',
      'Follow up if symptoms worsen or persist'
    ];

    // Add urgency-specific recommendations
    if (urgency === 'emergency') {
      baseRecommendations.unshift('Seek immediate emergency veterinary care');
    } else if (urgency === 'high') {
      baseRecommendations.unshift('Schedule a veterinary appointment within 24 hours');
    }

    // Translate if needed
    if (language !== 'en') {
      const translatedRecs = await Promise.all(
        baseRecommendations.map(rec => 
          this.translator.translateText(rec, 'en', language, 'medical')
        )
      );
      return translatedRecs.map(t => t.translatedText);
    }

    return baseRecommendations;
  }

  private async generateFollowUpQuestions(
    query: string, 
    species: string, 
    language: 'en' | 'lv' | 'ru'
  ): Promise<string[]> {
    const baseQuestions = [
      'How long have you noticed these symptoms?',
      'Has your pet\'s appetite or behavior changed recently?',
      'Are there any other symptoms you\'ve observed?',
      'Has your pet been exposed to anything unusual?',
      'Is your pet up to date on vaccinations?'
    ];

    // Translate if needed
    if (language !== 'en') {
      const translatedQuestions = await Promise.all(
        baseQuestions.map(q => 
          this.translator.translateText(q, 'en', language, 'general')
        )
      );
      return translatedQuestions.map(t => t.translatedText);
    }

    return baseQuestions;
  }

  async translateText(
    text: string, 
    from: 'en' | 'lv' | 'ru' | undefined, 
    to: 'en' | 'lv' | 'ru', 
    context?: string
  ): Promise<TranslationResponse> {
    try {
      const translation = await this.translator.translateText(
        text, 
        from || await this.translator.detectLanguage(text), 
        to, 
        context as any
      );

      return {
        translatedText: translation.translatedText,
        fromLanguage: translation.fromLanguage,
        toLanguage: translation.toLanguage,
        confidence: translation.confidence,
        service: translation.service
      };

    } catch (error) {
      logger.error('❌ Translation failed:', error);
      throw new Error('Translation service unavailable');
    }
  }

  async getSuggestedQuestions(species: string, language: 'en' | 'lv' | 'ru'): Promise<string[]> {
    const suggestions = {
      dog: [
        'My dog is losing hair, what could be causing this?',
        'My dog has been vomiting, should I be worried?',
        'What are the signs of hip dysplasia in dogs?',
        'My dog is not eating, what should I do?',
        'How often should I bathe my dog?'
      ],
      cat: [
        'My cat is not using the litter box, why?',
        'My cat has been hiding, is this normal?',
        'What are the symptoms of kidney disease in cats?',
        'My cat is coughing, what could it be?',
        'How can I tell if my cat is in pain?'
      ],
      bird: [
        'My bird is plucking its feathers, why?',
        'What are signs of respiratory problems in birds?',
        'My bird is not singing, should I be concerned?',
        'What is the proper diet for my bird?',
        'How can I tell if my bird is sick?'
      ],
      // Add more species...
    };

    const speciesSuggestions = suggestions[species as keyof typeof suggestions] || suggestions.dog;

    if (language !== 'en') {
      const translated = await Promise.all(
        speciesSuggestions.map(q => 
          this.translator.translateText(q, 'en', language, 'general')
        )
      );
      return translated.map(t => t.translatedText);
    }

    return speciesSuggestions;
  }

  async learnFromFeedback(conversationId: string, feedback: FeedbackData): Promise<void> {
    try {
      logger.info(`📚 Learning from feedback: ${feedback.rating}/5 stars for conversation ${conversationId}`);
      
      // Store feedback for future improvements
      // This could update AI model weights, improve response templates, etc.
      
      // For now, we'll log it for analysis
      logger.info(`Feedback details: Helpful=${feedback.helpful}, Rating=${feedback.rating}, Comment="${feedback.feedback}"`);
      
    } catch (error) {
      logger.error('❌ Failed to process feedback:', error);
    }
  }

  private storeConversation(sessionId: string, conversation: any): void {
    if (!this.conversationHistory.has(sessionId)) {
      this.conversationHistory.set(sessionId, []);
    }
    
    this.conversationHistory.get(sessionId)!.push({
      timestamp: new Date(),
      ...conversation
    });

    // Keep only last 20 conversations per session
    const history = this.conversationHistory.get(sessionId)!;
    if (history.length > 20) {
      this.conversationHistory.set(sessionId, history.slice(-20));
    }
  }

  private generateFallbackResponse(request: ChatRequest): ChatResponse {
    logger.warn('🔄 Generating fallback response');
    
    return {
      sessionId: request.sessionId,
      answer: `I apologize, but I'm experiencing technical difficulties processing your question about your ${request.species}. Please consult with a qualified veterinarian who can provide proper diagnosis and treatment. Your pet's health is important, and professional veterinary care is always the best option.`,
      confidence: 0.3,
      language: request.language,
      urgency: 'medium',
      recommendations: [
        'Consult a veterinarian immediately if this is an emergency',
        'Monitor your pet closely',
        'Ensure your pet is comfortable'
      ],
      followUpQuestions: [
        'Is this an emergency situation?',
        'How long have you noticed these symptoms?'
      ],
      sources: [],
      provider: 'Fallback System',
      reasoning: 'Fallback response due to technical difficulties'
    };
  }

  getStats(): any {
    return {
      conversationSessions: this.conversationHistory.size,
      totalConversations: Array.from(this.conversationHistory.values()).reduce((sum, conv) => sum + conv.length, 0),
      webScraperStats: this.webScraper.getStats(),
      translatorStats: this.translator.getStats(),
      aiProviderStats: this.aiProvider.getStats(),
      uptime: process.uptime()
    };
  }
}

export default AIVeterinaryBot;