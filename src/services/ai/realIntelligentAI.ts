import { realVeterinaryWebScraper, ScrapedVetData } from './realWebScraper';
import { realVeterinaryTranslator, SupportedLanguage } from './realTranslator';
import axios from 'axios';

export interface RealAIResponse {
  answer: string;
  confidence: number;
  sources: string[];
  language: SupportedLanguage;
  reasoning: string;
  recommendations: string[];
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  followUp: string[];
}

export interface AIServiceConfig {
  provider: 'openai' | 'anthropic' | 'local' | 'fallback';
  apiKey?: string;
  model?: string;
  maxTokens?: number;
}

class RealIntelligentVeterinaryAI {
  private config: AIServiceConfig;
  private conversationHistory: Map<string, any[]> = new Map();
  private knowledgeBase: Map<string, ScrapedVetData[]> = new Map();

  constructor(config: AIServiceConfig = { provider: 'fallback' }) {
    this.config = config;
    console.log(`🤖 REAL AI INITIALIZED: Provider = ${config.provider}`);
  }

  async generateIntelligentResponse(
    query: string, 
    species: string, 
    language: SupportedLanguage = 'en'
  ): Promise<RealAIResponse> {
    console.log(`🧠 REAL AI PROCESSING: "${query}" for ${species} in ${language}`);

    try {
      // Step 1: Gather real external data
      const externalData = await this.gatherExternalKnowledge(query, species);
      
      // Step 2: Translate query if needed
      const englishQuery = language !== 'en' 
        ? (await realVeterinaryTranslator.autoTranslate(query, 'en')).translatedText
        : query;

      // Step 3: Generate AI response using external service
      const aiResponse = await this.callExternalAI(englishQuery, species, externalData);
      
      // Step 4: Translate response back to user's language
      const finalResponse = language !== 'en'
        ? (await realVeterinaryTranslator.autoTranslate(aiResponse.answer, language)).translatedText
        : aiResponse.answer;

      // Step 5: Enhance with real-time data
      const enhancedResponse: RealAIResponse = {
        ...aiResponse,
        answer: finalResponse,
        language,
        sources: externalData.map(d => d.url).filter(Boolean),
        recommendations: await this.generateRecommendations(query, species, language),
        followUp: await this.generateFollowUpQuestions(query, species, language)
      };

      // Store in conversation history
      this.storeConversation(query, enhancedResponse);

      console.log(`✅ REAL AI RESPONSE GENERATED: Confidence ${Math.round(enhancedResponse.confidence * 100)}%`);
      return enhancedResponse;

    } catch (error) {
      console.error('Real AI processing failed:', error);
      return this.generateFallbackResponse(query, species, language);
    }
  }

  private async gatherExternalKnowledge(query: string, species: string): Promise<ScrapedVetData[]> {
    console.log(`📚 GATHERING REAL KNOWLEDGE: Searching external sources for "${query}"`);
    
    const cacheKey = `${query}-${species}`;
    if (this.knowledgeBase.has(cacheKey)) {
      return this.knowledgeBase.get(cacheKey)!;
    }

    // Search real veterinary sources
    const searchResults = await realVeterinaryWebScraper.searchVeterinaryData(query, species);
    
    // Get medication info if query mentions medications
    if (this.containsMedicationTerms(query)) {
      const medicationResults = await realVeterinaryWebScraper.getMedicationInfo(query);
      searchResults.push(...medicationResults);
    }

    // Cache the results
    this.knowledgeBase.set(cacheKey, searchResults);
    
    console.log(`📖 KNOWLEDGE GATHERED: Found ${searchResults.length} relevant sources`);
    return searchResults;
  }

  private async callExternalAI(
    query: string, 
    species: string, 
    context: ScrapedVetData[]
  ): Promise<Omit<RealAIResponse, 'language' | 'recommendations' | 'followUp'>> {
    
    const contextText = context
      .slice(0, 5) // Limit context to avoid token limits
      .map(data => `Source: ${data.title}\nContent: ${data.content.substring(0, 300)}`)
      .join('\n\n');

    const prompt = this.buildVeterinaryPrompt(query, species, contextText);

    switch (this.config.provider) {
      case 'openai':
        return await this.callOpenAI(prompt);
      case 'anthropic':
        return await this.callAnthropic(prompt);
      case 'local':
        return await this.callLocalAI(prompt);
      default:
        return this.generateSmartFallback(query, species, context);
    }
  }

  private async callOpenAI(prompt: string): Promise<Omit<RealAIResponse, 'language' | 'recommendations' | 'followUp'>> {
    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: this.config.model || 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert veterinarian AI assistant. Provide accurate, helpful veterinary advice based on the given context. Always recommend consulting a real veterinarian for serious issues.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: this.config.maxTokens || 500,
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      const aiAnswer = response.data.choices[0]?.message?.content || '';
      
      return {
        answer: aiAnswer,
        confidence: 0.9,
        sources: [],
        reasoning: 'Generated using OpenAI GPT with veterinary context',
        urgency: this.assessUrgency(aiAnswer)
      };

    } catch (error) {
      console.error('OpenAI API call failed:', error);
      throw error;
    }
  }

  private async callAnthropic(prompt: string): Promise<Omit<RealAIResponse, 'language' | 'recommendations' | 'followUp'>> {
    try {
      const response = await axios.post('https://api.anthropic.com/v1/messages', {
        model: this.config.model || 'claude-3-sonnet-20240229',
        max_tokens: this.config.maxTokens || 500,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      }, {
        headers: {
          'x-api-key': this.config.apiKey,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        }
      });

      const aiAnswer = response.data.content[0]?.text || '';
      
      return {
        answer: aiAnswer,
        confidence: 0.95,
        sources: [],
        reasoning: 'Generated using Anthropic Claude with veterinary context',
        urgency: this.assessUrgency(aiAnswer)
      };

    } catch (error) {
      console.error('Anthropic API call failed:', error);
      throw error;
    }
  }

  private async callLocalAI(prompt: string): Promise<Omit<RealAIResponse, 'language' | 'recommendations' | 'followUp'>> {
    try {
      // Assuming a local AI service running on localhost:11434 (like Ollama)
      const response = await axios.post('http://localhost:11434/api/generate', {
        model: this.config.model || 'llama2',
        prompt: prompt,
        stream: false
      });

      const aiAnswer = response.data.response || '';
      
      return {
        answer: aiAnswer,
        confidence: 0.8,
        sources: [],
        reasoning: 'Generated using local AI model',
        urgency: this.assessUrgency(aiAnswer)
      };

    } catch (error) {
      console.error('Local AI call failed:', error);
      throw error;
    }
  }

  private generateSmartFallback(
    query: string, 
    species: string, 
    context: ScrapedVetData[]
  ): Omit<RealAIResponse, 'language' | 'recommendations' | 'followUp'> {
    console.log('🔄 Using intelligent fallback response generation');
    
    // Analyze context to generate a smart response
    const relevantInfo = context
      .filter(data => data.species.includes(species) || data.species.includes('general'))
      .slice(0, 3);

    let answer = '';
    
    if (relevantInfo.length > 0) {
      answer = `Based on current veterinary information:\n\n`;
      
      relevantInfo.forEach((info, index) => {
        answer += `${index + 1}. ${info.title}: ${info.content.substring(0, 200)}...\n\n`;
      });
      
      answer += `For your ${species}, I recommend consulting with a veterinarian for proper diagnosis and treatment. `;
      answer += `The symptoms you described may require professional medical attention.`;
    } else {
      answer = this.generateBasicResponse(query, species);
    }

    return {
      answer,
      confidence: 0.7,
      sources: relevantInfo.map(info => info.url).filter(Boolean),
      reasoning: 'Generated using intelligent fallback with real veterinary data',
      urgency: this.assessUrgencyFromQuery(query)
    };
  }

  private buildVeterinaryPrompt(query: string, species: string, context: string): string {
    return `As a veterinary AI assistant, please analyze this query about a ${species}:

QUERY: "${query}"

RELEVANT VETERINARY INFORMATION:
${context}

Please provide:
1. A comprehensive answer based on the veterinary information provided
2. Specific advice for this ${species}
3. Any warning signs that require immediate veterinary attention
4. General care recommendations

Important: Always recommend consulting a real veterinarian for proper diagnosis and treatment. Base your response on the provided veterinary sources.`;
  }

  private assessUrgency(response: string): 'low' | 'medium' | 'high' | 'emergency' {
    const emergencyKeywords = /\b(emergency|urgent|immediate|critical|severe|toxic|poisoning|bleeding|unconscious|seizure|difficulty breathing)\b/gi;
    const highKeywords = /\b(serious|concerning|worrying|pain|infection|fever|vomiting|diarrhea)\b/gi;
    const mediumKeywords = /\b(monitor|watch|observe|mild|slight|minor)\b/gi;

    if (emergencyKeywords.test(response)) return 'emergency';
    if (highKeywords.test(response)) return 'high';
    if (mediumKeywords.test(response)) return 'medium';
    return 'low';
  }

  private assessUrgencyFromQuery(query: string): 'low' | 'medium' | 'high' | 'emergency' {
    return this.assessUrgency(query);
  }

  private async generateRecommendations(
    query: string, 
    species: string, 
    language: SupportedLanguage
  ): Promise<string[]> {
    const baseRecommendations = [
      'Consult with a veterinarian for proper diagnosis',
      'Monitor your pet\'s symptoms closely',
      'Ensure your pet has access to fresh water',
      'Keep your pet comfortable and stress-free',
      'Follow up if symptoms worsen or persist'
    ];

    // Translate recommendations if needed
    if (language !== 'en') {
      const translatedRecs = await Promise.all(
        baseRecommendations.map(rec => 
          realVeterinaryTranslator.autoTranslate(rec, language)
        )
      );
      return translatedRecs.map(t => t.translatedText);
    }

    return baseRecommendations;
  }

  private async generateFollowUpQuestions(
    query: string, 
    species: string, 
    language: SupportedLanguage
  ): Promise<string[]> {
    const baseQuestions = [
      'How long have you noticed these symptoms?',
      'Has your pet\'s appetite or behavior changed?',
      'Are there any other symptoms you\'ve observed?',
      'Has your pet been exposed to anything unusual recently?',
      'Is your pet up to date on vaccinations?'
    ];

    // Translate questions if needed
    if (language !== 'en') {
      const translatedQuestions = await Promise.all(
        baseQuestions.map(q => 
          realVeterinaryTranslator.autoTranslate(q, language)
        )
      );
      return translatedQuestions.map(t => t.translatedText);
    }

    return baseQuestions;
  }

  private containsMedicationTerms(query: string): boolean {
    const medicationTerms = /\b(medicine|medication|drug|pill|tablet|treatment|dose|dosage|prescription|antibiotic|painkiller)\b/gi;
    return medicationTerms.test(query);
  }

  private generateBasicResponse(query: string, species: string): string {
    return `Thank you for your question about your ${species}. While I'd like to provide specific advice, I recommend consulting with a qualified veterinarian who can properly examine your pet and provide accurate diagnosis and treatment recommendations. Every pet is unique, and professional veterinary care is essential for their health and wellbeing.`;
  }

  private generateFallbackResponse(
    query: string, 
    species: string, 
    language: SupportedLanguage
  ): RealAIResponse {
    const basicAnswer = this.generateBasicResponse(query, species);
    
    return {
      answer: basicAnswer,
      confidence: 0.5,
      sources: [],
      language,
      reasoning: 'Fallback response due to AI service unavailability',
      recommendations: ['Consult a veterinarian', 'Monitor your pet closely'],
      urgency: 'medium',
      followUp: ['How long have symptoms persisted?', 'Any other concerns?']
    };
  }

  private storeConversation(query: string, response: RealAIResponse): void {
    const sessionId = 'current'; // In a real app, this would be user-specific
    
    if (!this.conversationHistory.has(sessionId)) {
      this.conversationHistory.set(sessionId, []);
    }
    
    this.conversationHistory.get(sessionId)!.push({
      timestamp: new Date(),
      query,
      response: response.answer,
      confidence: response.confidence,
      sources: response.sources
    });
  }

  updateConfig(newConfig: Partial<AIServiceConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log(`🔧 AI Config updated: ${JSON.stringify(this.config)}`);
  }

  getStats(): { 
    conversations: number; 
    knowledgeBaseSize: number; 
    provider: string;
    cacheSize: number;
  } {
    return {
      conversations: Array.from(this.conversationHistory.values()).reduce((sum, conv) => sum + conv.length, 0),
      knowledgeBaseSize: this.knowledgeBase.size,
      provider: this.config.provider,
      cacheSize: this.knowledgeBase.size
    };
  }
}

export const realIntelligentVeterinaryAI = new RealIntelligentVeterinaryAI();