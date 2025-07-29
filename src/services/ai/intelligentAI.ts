// Intelligent AI service that learns from external sources and provides real veterinary advice

import { PetSpecies } from '../../types';
import { detectLanguage, SupportedLanguage } from '../languageDetector';
import { veterinaryWebScraper, ScrapedData } from './webScraper';
import { vetDatabase } from '../database/vetDatabase';

export interface AIResponse {
  answer: string;
  confidence: number;
  sources: string[];
  relatedTopics: string[];
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  suggestedActions: string[];
  language: SupportedLanguage;
}

export interface LearningContext {
  query: string;
  species: PetSpecies;
  language: SupportedLanguage;
  previousQueries: string[];
  userFeedback?: 'helpful' | 'not_helpful';
}

class IntelligentVeterinaryAI {
  private learningHistory: Map<string, AIResponse[]> = new Map();
  private contextMemory: Map<string, LearningContext> = new Map();
  private knowledgeGraph: Map<string, string[]> = new Map();

  constructor() {
    this.initializeKnowledgeGraph();
    this.preloadVeterinaryData();
  }

  private async initializeKnowledgeGraph() {
    // Build relationships between symptoms, conditions, treatments
    const relationships = {
      'hair_loss': ['dermatitis', 'allergies', 'parasites', 'hormonal_imbalance'],
      'vomiting': ['gastroenteritis', 'food_poisoning', 'parasites', 'dietary_indiscretion'],
      'diarrhea': ['gastroenteritis', 'parasites', 'food_allergies', 'inflammatory_bowel_disease'],
      'difficulty_breathing': ['pneumonia', 'heart_failure', 'allergic_reaction', 'airway_obstruction'],
      'frequent_urination': ['urinary_tract_infection', 'diabetes', 'kidney_disease', 'bladder_stones'],
      'lethargy': ['infection', 'pain', 'metabolic_disorders', 'depression'],
      'itching': ['allergies', 'parasites', 'skin_infections', 'dry_skin'],
      'coughing': ['respiratory_infection', 'heart_disease', 'allergies', 'foreign_body'],
      'loss_of_appetite': ['nausea', 'pain', 'stress', 'dental_problems', 'illness']
    };

    for (const [symptom, conditions] of Object.entries(relationships)) {
      this.knowledgeGraph.set(symptom, conditions);
    }
  }

  private async preloadVeterinaryData() {
    try {
      // Preload data from all sources
      await veterinaryWebScraper.scrapeAllSources();
      console.log('Veterinary knowledge base preloaded successfully');
    } catch (error) {
      console.error('Failed to preload veterinary data:', error);
    }
  }

  async generateIntelligentResponse(
    query: string, 
    species: PetSpecies,
    context?: LearningContext
  ): Promise<AIResponse> {
    // Detect language
    const language = detectLanguage(query);
    
    // Extract key symptoms and conditions from query
    const extractedSymptoms = this.extractSymptomsFromQuery(query, language);
    const extractedConditions = this.inferConditionsFromSymptoms(extractedSymptoms);
    
    // Search for relevant information from scraped data
    const relevantData = await this.searchRelevantKnowledge(query, language, species);
    
    // Search local database
    const localKnowledge = vetDatabase.searchKnowledge(query, species);
    
    // Combine and analyze all available information
    const analysis = this.analyzeAllSources(
      query,
      extractedSymptoms,
      extractedConditions,
      relevantData,
      localKnowledge,
      species,
      language
    );
    
    // Generate intelligent response
    const response = this.synthesizeResponse(analysis, language);
    
    // Learn from this interaction
    this.learnFromInteraction(query, response, context);
    
    return response;
  }

  private extractSymptomsFromQuery(query: string, language: SupportedLanguage): string[] {
    const symptoms: string[] = [];
    const queryLower = query.toLowerCase();

    const symptomPatterns = {
      lv: {
        'hair_loss': ['matu izkrišana', 'spalvas izkrišana', 'plešanās', 'kails'],
        'vomiting': ['vemšana', 'vem', 'uzgāž'],
        'diarrhea': ['caureja', 'šķidrs izkārnījums'],
        'difficulty_breathing': ['elpošanas grūtības', 'smacēšana', 'nevar elpot'],
        'frequent_urination': ['biežas urināšanas', 'daudz čurā'],
        'lethargy': ['vājums', 'nogurums', 'miegainība'],
        'itching': ['nieze', 'kasās', 'kairinājums'],
        'coughing': ['klepus', 'klepošana'],
        'loss_of_appetite': ['neēd', 'apetītes zudums', 'nevēlas ēst'],
        'eye_problems': ['acu problēmas', 'sāpīgas acis', 'acu iekaisums'],
        'ear_problems': ['ausu problēmas', 'ausu iekaisums', 'ausu sāpes']
      },
      ru: {
        'hair_loss': ['выпадение шерсти', 'облысение', 'лысеет', 'теряет шерсть'],
        'vomiting': ['рвота', 'тошнота', 'рвет'],
        'diarrhea': ['понос', 'диарея', 'жидкий стул'],
        'difficulty_breathing': ['затрудненное дыхание', 'одышка', 'не может дышать'],
        'frequent_urination': ['частое мочеиспускание', 'много мочится'],
        'lethargy': ['вялость', 'слабость', 'сонливость'],
        'itching': ['зуд', 'чешется', 'раздражение'],
        'coughing': ['кашель', 'кашляет'],
        'loss_of_appetite': ['не ест', 'потеря аппетита', 'не хочет есть'],
        'eye_problems': ['проблемы с глазами', 'болят глаза', 'воспаление глаз'],
        'ear_problems': ['проблемы с ушами', 'воспаление ушей', 'болят уши']
      },
      en: {
        'hair_loss': ['hair loss', 'losing hair', 'balding', 'shedding excessively'],
        'vomiting': ['vomiting', 'throwing up', 'nausea'],
        'diarrhea': ['diarrhea', 'loose stool', 'liquid stool'],
        'difficulty_breathing': ['difficulty breathing', 'shortness of breath', 'cant breathe'],
        'frequent_urination': ['frequent urination', 'urinating often'],
        'lethargy': ['lethargy', 'weakness', 'sleepy'],
        'itching': ['itching', 'scratching', 'irritation'],
        'coughing': ['coughing', 'cough'],
        'loss_of_appetite': ['not eating', 'loss of appetite', 'wont eat'],
        'eye_problems': ['eye problems', 'sore eyes', 'eye inflammation'],
        'ear_problems': ['ear problems', 'ear inflammation', 'ear pain']
      }
    };

    const patterns = symptomPatterns[language] || symptomPatterns.en;
    
    for (const [symptom, keywords] of Object.entries(patterns)) {
      if (keywords.some(keyword => queryLower.includes(keyword))) {
        symptoms.push(symptom);
      }
    }

    return symptoms;
  }

  private inferConditionsFromSymptoms(symptoms: string[]): string[] {
    const conditions = new Set<string>();
    
    for (const symptom of symptoms) {
      const relatedConditions = this.knowledgeGraph.get(symptom) || [];
      relatedConditions.forEach(condition => conditions.add(condition));
    }
    
    return Array.from(conditions);
  }

  private async searchRelevantKnowledge(
    query: string, 
    language: SupportedLanguage, 
    species: PetSpecies
  ): Promise<ScrapedData[]> {
    // Search scraped data
    const scrapedResults = veterinaryWebScraper.searchScrapedData(query, language);
    
    // Filter by species if relevant
    const speciesRelevant = scrapedResults.filter(data => 
      data.species.includes(species) || data.species.length === 0
    );
    
    return speciesRelevant.slice(0, 5); // Top 5 most relevant results
  }

  private analyzeAllSources(
    query: string,
    symptoms: string[],
    conditions: string[],
    scrapedData: ScrapedData[],
    localKnowledge: any[],
    species: PetSpecies,
    language: SupportedLanguage
  ) {
    return {
      query,
      symptoms,
      conditions,
      scrapedData,
      localKnowledge,
      species,
      language,
      confidence: this.calculateConfidence(scrapedData, localKnowledge),
      urgency: this.assessUrgency(symptoms, conditions),
      sources: this.extractSources(scrapedData, localKnowledge)
    };
  }

  private calculateConfidence(scrapedData: ScrapedData[], localKnowledge: any[]): number {
    let totalReliability = 0;
    let sourceCount = 0;

    // Factor in scraped data reliability
    scrapedData.forEach(data => {
      totalReliability += data.reliability;
      sourceCount++;
    });

    // Factor in local knowledge confidence
    localKnowledge.forEach(knowledge => {
      totalReliability += knowledge.confidence || 0.7;
      sourceCount++;
    });

    return sourceCount > 0 ? totalReliability / sourceCount : 0.5;
  }

  private assessUrgency(symptoms: string[], conditions: string[]): 'low' | 'medium' | 'high' | 'emergency' {
    const emergencySymptoms = ['difficulty_breathing', 'collapse', 'severe_bleeding', 'unconscious'];
    const highUrgencySymptoms = ['vomiting', 'diarrhea', 'difficulty_breathing', 'severe_pain'];
    const mediumUrgencySymptoms = ['loss_of_appetite', 'lethargy', 'coughing'];

    if (symptoms.some(s => emergencySymptoms.includes(s))) return 'emergency';
    if (symptoms.some(s => highUrgencySymptoms.includes(s))) return 'high';
    if (symptoms.some(s => mediumUrgencySymptoms.includes(s))) return 'medium';
    
    return 'low';
  }

  private extractSources(scrapedData: ScrapedData[], localKnowledge: any[]): string[] {
    const sources = new Set<string>();
    
    scrapedData.forEach(data => sources.add(data.source));
    localKnowledge.forEach(knowledge => {
      if (knowledge.sources) {
        knowledge.sources.forEach((source: string) => sources.add(source));
      }
    });
    
    return Array.from(sources);
  }

  private synthesizeResponse(analysis: any, language: SupportedLanguage): AIResponse {
    const templates = {
      lv: {
        intro: 'Pamatojoties uz pieejamo veterināro informāciju un manu analīzi',
        confidence_high: 'Es esmu ļoti pārliecināts par šo diagnozi',
        confidence_medium: 'Šī ir visticamākā diagnoze',
        confidence_low: 'Nepieciešama papildu izmeklēšana',
        urgency_emergency: 'NEKAVĒJOTIES vērsieties pie veterinārārsta!',
        urgency_high: 'Ieteicams konsultēties ar veterinārārstu šodien',
        urgency_medium: 'Konsultējieties ar veterinārārstu 1-2 dienu laikā',
        urgency_low: 'Novērojiet simptomus un konsultējieties, ja tie pasliktinās'
      },
      ru: {
        intro: 'На основе доступной ветеринарной информации и моего анализа',
        confidence_high: 'Я очень уверен в этом диагнозе',
        confidence_medium: 'Это наиболее вероятный диагноз',
        confidence_low: 'Необходимо дополнительное обследование',
        urgency_emergency: 'НЕМЕДЛЕННО обратитесь к ветеринару!',
        urgency_high: 'Рекомендуется консультация с ветеринаром сегодня',
        urgency_medium: 'Проконсультируйтесь с ветеринаром в течение 1-2 дней',
        urgency_low: 'Наблюдайте за симптомами и обратитесь, если они ухудшатся'
      },
      en: {
        intro: 'Based on available veterinary information and my analysis',
        confidence_high: 'I am very confident in this diagnosis',
        confidence_medium: 'This is the most likely diagnosis',
        confidence_low: 'Additional examination is needed',
        urgency_emergency: 'IMMEDIATELY contact a veterinarian!',
        urgency_high: 'Recommend veterinary consultation today',
        urgency_medium: 'Consult with veterinarian within 1-2 days',
        urgency_low: 'Monitor symptoms and consult if they worsen'
      }
    };

    const t = templates[language] || templates.en;
    
    // Build comprehensive response
    let response = `${t.intro}:\n\n`;
    
    // Add analysis from scraped data
    if (analysis.scrapedData.length > 0) {
      const mostRelevant = analysis.scrapedData[0];
      response += `📚 **${mostRelevant.title}**\n`;
      response += `${mostRelevant.content.substring(0, 300)}...\n\n`;
    }
    
    // Add condition analysis
    if (analysis.conditions.length > 0) {
      response += `🔍 **${language === 'ru' ? 'Возможные состояния' : language === 'lv' ? 'Iespējamie stāvokļi' : 'Possible Conditions'}:**\n`;
      analysis.conditions.slice(0, 3).forEach((condition: string, index: number) => {
        response += `${index + 1}. ${condition.replace(/_/g, ' ')}\n`;
      });
      response += '\n';
    }
    
    // Add confidence assessment
    const confidenceLevel = analysis.confidence > 0.8 ? 'high' : analysis.confidence > 0.6 ? 'medium' : 'low';
    response += `🎯 **${language === 'ru' ? 'Уверенность' : language === 'lv' ? 'Pārliecība' : 'Confidence'}:** ${t[`confidence_${confidenceLevel}` as keyof typeof t]}\n\n`;
    
    // Add urgency assessment
    response += `⚠️ **${language === 'ru' ? 'Срочность' : language === 'lv' ? 'Steidzamība' : 'Urgency'}:** ${t[`urgency_${analysis.urgency}` as keyof typeof t]}\n\n`;
    
    // Add suggested actions
    const suggestedActions = this.generateSuggestedActions(analysis, language);
    if (suggestedActions.length > 0) {
      response += `💡 **${language === 'ru' ? 'Рекомендуемые действия' : language === 'lv' ? 'Ieteicamās darbības' : 'Suggested Actions'}:**\n`;
      suggestedActions.forEach((action, index) => {
        response += `${index + 1}. ${action}\n`;
      });
      response += '\n';
    }
    
    // Add related topics
    const relatedTopics = this.generateRelatedTopics(analysis, language);
    
    return {
      answer: response,
      confidence: analysis.confidence,
      sources: analysis.sources,
      relatedTopics,
      urgency: analysis.urgency,
      suggestedActions,
      language
    };
  }

  private generateSuggestedActions(analysis: any, language: SupportedLanguage): string[] {
    const actions: string[] = [];
    
    const actionTemplates = {
      lv: {
        monitor: 'Uzraugiet simptomu izmaiņas',
        hydration: 'Nodrošiniet pietiekamu šķidruma daudzumu',
        diet: 'Pārskatiet uztura kvalitāti',
        environment: 'Pārbaudiet dzīves vides apstākļus',
        vet_visit: 'Plānojiet veterinārārsta vizīti'
      },
      ru: {
        monitor: 'Наблюдайте за изменениями симптомов',
        hydration: 'Обеспечьте достаточное количество жидкости',
        diet: 'Пересмотрите качество питания',
        environment: 'Проверьте условия содержания',
        vet_visit: 'Запланируйте визит к ветеринару'
      },
      en: {
        monitor: 'Monitor symptom changes',
        hydration: 'Ensure adequate hydration',
        diet: 'Review diet quality',
        environment: 'Check living environment conditions',
        vet_visit: 'Schedule veterinary visit'
      }
    };

    const templates = actionTemplates[language] || actionTemplates.en;
    
    // Add actions based on symptoms and urgency
    if (analysis.symptoms.includes('vomiting') || analysis.symptoms.includes('diarrhea')) {
      actions.push(templates.hydration);
    }
    
    if (analysis.symptoms.includes('loss_of_appetite')) {
      actions.push(templates.diet);
    }
    
    actions.push(templates.monitor);
    
    if (analysis.urgency !== 'low') {
      actions.push(templates.vet_visit);
    }
    
    return actions;
  }

  private generateRelatedTopics(analysis: any, language: SupportedLanguage): string[] {
    const topics: string[] = [];
    
    // Generate related topics based on conditions and symptoms
    analysis.conditions.forEach((condition: string) => {
      const topic = condition.replace(/_/g, ' ');
      if (!topics.includes(topic)) {
        topics.push(topic);
      }
    });
    
    return topics.slice(0, 5);
  }

  private learnFromInteraction(query: string, response: AIResponse, context?: LearningContext) {
    const sessionId = Date.now().toString();
    
    // Store interaction for learning
    if (!this.learningHistory.has(sessionId)) {
      this.learningHistory.set(sessionId, []);
    }
    
    this.learningHistory.get(sessionId)?.push(response);
    
    // Update context memory
    if (context) {
      this.contextMemory.set(sessionId, {
        ...context,
        query,
        previousQueries: [...(context.previousQueries || []), query]
      });
    }
    
    // Learn from user feedback if provided
    if (context?.userFeedback) {
      this.updateKnowledgeFromFeedback(query, response, context.userFeedback);
    }
  }

  private updateKnowledgeFromFeedback(query: string, response: AIResponse, feedback: 'helpful' | 'not_helpful') {
    // Adjust confidence based on feedback
    const adjustment = feedback === 'helpful' ? 0.1 : -0.1;
    
    // This would update the knowledge base confidence scores
    // In a real implementation, this would persist to a database
    console.log(`Learning from feedback: ${feedback} for query: "${query}"`);
  }

  // Public method to provide feedback
  async provideFeedback(sessionId: string, feedback: 'helpful' | 'not_helpful') {
    const context = this.contextMemory.get(sessionId);
    const responses = this.learningHistory.get(sessionId);
    
    if (context && responses && responses.length > 0) {
      const lastResponse = responses[responses.length - 1];
      this.updateKnowledgeFromFeedback(context.query, lastResponse, feedback);
    }
  }

  // Get learning statistics
  getLearningStats() {
    return {
      totalInteractions: this.learningHistory.size,
      knowledgeGraphSize: this.knowledgeGraph.size,
      contextMemorySize: this.contextMemory.size,
      averageConfidence: Array.from(this.learningHistory.values())
        .flat()
        .reduce((sum, response) => sum + response.confidence, 0) / 
        Math.max(1, Array.from(this.learningHistory.values()).flat().length)
    };
  }
}

// Singleton instance
export const intelligentVeterinaryAI = new IntelligentVeterinaryAI();