// Automatic translation service for veterinary content

export type SupportedLanguage = 'en' | 'lv' | 'ru';

export interface TranslationRequest {
  text: string;
  fromLanguage: SupportedLanguage;
  toLanguage: SupportedLanguage;
  context?: 'medical' | 'general' | 'symptoms' | 'treatments';
}

export interface TranslationResponse {
  originalText: string;
  translatedText: string;
  fromLanguage: SupportedLanguage;
  toLanguage: SupportedLanguage;
  confidence: number;
}

// Comprehensive veterinary translation dictionaries
const VETERINARY_TRANSLATIONS = {
  // Medical conditions
  conditions: {
    'dermatitis': { en: 'dermatitis', lv: 'dermatīts', ru: 'дерматит' },
    'allergies': { en: 'allergies', lv: 'alerģijas', ru: 'аллергии' },
    'parasites': { en: 'parasites', lv: 'parazīti', ru: 'паразиты' },
    'gastroenteritis': { en: 'gastroenteritis', lv: 'gastroenterīts', ru: 'гастроэнтерит' },
    'pneumonia': { en: 'pneumonia', lv: 'pneimonija', ru: 'пневмония' },
    'urinary_tract_infection': { en: 'urinary tract infection', lv: 'urīnceļu infekcija', ru: 'инфекция мочевыводящих путей' },
    'kidney_disease': { en: 'kidney disease', lv: 'nieru slimība', ru: 'заболевание почек' },
    'heart_failure': { en: 'heart failure', lv: 'sirds mazspēja', ru: 'сердечная недостаточность' },
    'diabetes': { en: 'diabetes', lv: 'diabēts', ru: 'диабет' },
    'arthritis': { en: 'arthritis', lv: 'artrīts', ru: 'артрит' },
    'cancer': { en: 'cancer', lv: 'vēzis', ru: 'рак' },
    'infection': { en: 'infection', lv: 'infekcija', ru: 'инфекция' }
  },

  // Symptoms
  symptoms: {
    'hair_loss': { en: 'hair loss', lv: 'matu izkrišana', ru: 'выпадение шерсти' },
    'vomiting': { en: 'vomiting', lv: 'vemšana', ru: 'рвота' },
    'diarrhea': { en: 'diarrhea', lv: 'caureja', ru: 'диарея' },
    'difficulty_breathing': { en: 'difficulty breathing', lv: 'elpošanas grūtības', ru: 'затрудненное дыхание' },
    'frequent_urination': { en: 'frequent urination', lv: 'biežas urināšanas', ru: 'частое мочеиспускание' },
    'lethargy': { en: 'lethargy', lv: 'letarģija', ru: 'вялость' },
    'itching': { en: 'itching', lv: 'nieze', ru: 'зуд' },
    'coughing': { en: 'coughing', lv: 'klepus', ru: 'кашель' },
    'loss_of_appetite': { en: 'loss of appetite', lv: 'apetītes zudums', ru: 'потеря аппетита' },
    'fever': { en: 'fever', lv: 'drudzis', ru: 'лихорадка' },
    'pain': { en: 'pain', lv: 'sāpes', ru: 'боль' },
    'swelling': { en: 'swelling', lv: 'pietūkums', ru: 'отек' },
    'bleeding': { en: 'bleeding', lv: 'asiņošana', ru: 'кровотечение' }
  },

  // Treatments
  treatments: {
    'antibiotics': { en: 'antibiotics', lv: 'antibiotikas', ru: 'антибиотики' },
    'pain_management': { en: 'pain management', lv: 'sāpju pārvaldība', ru: 'обезболивание' },
    'dietary_changes': { en: 'dietary changes', lv: 'uztura izmaiņas', ru: 'изменения в питании' },
    'surgery': { en: 'surgery', lv: 'ķirurģija', ru: 'хирургия' },
    'medication': { en: 'medication', lv: 'medikamenti', ru: 'лекарства' },
    'vaccination': { en: 'vaccination', lv: 'vakcinācija', ru: 'вакцинация' },
    'therapy': { en: 'therapy', lv: 'terapija', ru: 'терапия' },
    'rest': { en: 'rest', lv: 'atpūta', ru: 'покой' },
    'hydration': { en: 'hydration', lv: 'hidratācija', ru: 'гидратация' }
  },

  // Body parts
  anatomy: {
    'eye': { en: 'eye', lv: 'acs', ru: 'глаз' },
    'ear': { en: 'ear', lv: 'ausis', ru: 'ухо' },
    'nose': { en: 'nose', lv: 'deguns', ru: 'нос' },
    'mouth': { en: 'mouth', lv: 'mute', ru: 'рот' },
    'tooth': { en: 'tooth', lv: 'zobs', ru: 'зуб' },
    'skin': { en: 'skin', lv: 'āda', ru: 'кожа' },
    'fur': { en: 'fur', lv: 'spalva', ru: 'шерсть' },
    'paw': { en: 'paw', lv: 'ķepa', ru: 'лапа' },
    'tail': { en: 'tail', lv: 'aste', ru: 'хвост' },
    'stomach': { en: 'stomach', lv: 'kuņģis', ru: 'желудок' },
    'kidney': { en: 'kidney', lv: 'niere', ru: 'почка' },
    'liver': { en: 'liver', lv: 'aknas', ru: 'печень' },
    'heart': { en: 'heart', lv: 'sirds', ru: 'сердце' },
    'lung': { en: 'lung', lv: 'plaušas', ru: 'легкое' }
  },

  // Common phrases
  phrases: {
    'my_pet_has': { en: 'my pet has', lv: 'manam mājdzīvniekam ir', ru: 'у моего питомца' },
    'symptoms_include': { en: 'symptoms include', lv: 'simptomi ietver', ru: 'симптомы включают' },
    'treatment_options': { en: 'treatment options', lv: 'ārstēšanas iespējas', ru: 'варианты лечения' },
    'consult_veterinarian': { en: 'consult veterinarian', lv: 'konsultējieties ar veterinārārstu', ru: 'обратитесь к ветеринару' },
    'emergency_care': { en: 'emergency care', lv: 'neatliekamā palīdzība', ru: 'неотложная помощь' },
    'preventive_care': { en: 'preventive care', lv: 'profilaktiskā aprūpe', ru: 'профилактический уход' },
    'side_effects': { en: 'side effects', lv: 'blakusparādības', ru: 'побочные эффекты' },
    'dosage': { en: 'dosage', lv: 'deva', ru: 'дозировка' }
  }
};

// Common sentence patterns for translation
const SENTENCE_PATTERNS = {
  en: {
    assessment: 'Based on the symptoms described, {condition} is possible.',
    recommendation: 'I recommend {treatment} for this condition.',
    urgency: 'This requires {urgency_level} veterinary attention.',
    confidence: 'I am {confidence_level} confident in this assessment.'
  },
  lv: {
    assessment: 'Pamatojoties uz aprakstītajiem simptomiem, iespējams {condition}.',
    recommendation: 'Es iesaku {treatment} šim stāvoklim.',
    urgency: 'Tas prasa {urgency_level} veterinārārsta uzmanību.',
    confidence: 'Es esmu {confidence_level} pārliecināts par šo novērtējumu.'
  },
  ru: {
    assessment: 'На основе описанных симптомов возможно {condition}.',
    recommendation: 'Я рекомендую {treatment} для этого состояния.',
    urgency: 'Это требует {urgency_level} ветеринарного внимания.',
    confidence: 'Я {confidence_level} уверен в этой оценке.'
  }
};

class VeterinaryTranslator {
  private translationCache: Map<string, TranslationResponse> = new Map();

  async translateText(request: TranslationRequest): Promise<TranslationResponse> {
    // Check cache first
    const cacheKey = `${request.text}_${request.fromLanguage}_${request.toLanguage}`;
    const cached = this.translationCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    // If same language, return as is
    if (request.fromLanguage === request.toLanguage) {
      const response: TranslationResponse = {
        originalText: request.text,
        translatedText: request.text,
        fromLanguage: request.fromLanguage,
        toLanguage: request.toLanguage,
        confidence: 1.0
      };
      this.translationCache.set(cacheKey, response);
      return response;
    }

    // Perform translation
    const translatedText = await this.performTranslation(request);
    const confidence = this.calculateTranslationConfidence(request.text, translatedText, request.context);

    const response: TranslationResponse = {
      originalText: request.text,
      translatedText,
      fromLanguage: request.fromLanguage,
      toLanguage: request.toLanguage,
      confidence
    };

    // Cache the result
    this.translationCache.set(cacheKey, response);
    
    return response;
  }

  private async performTranslation(request: TranslationRequest): Promise<string> {
    let translatedText = request.text;

    // First, try dictionary-based translation for medical terms
    translatedText = this.translateMedicalTerms(translatedText, request.fromLanguage, request.toLanguage);

    // Then, apply pattern-based translation for common sentences
    translatedText = this.translateSentencePatterns(translatedText, request.fromLanguage, request.toLanguage);

    // Finally, apply contextual translation based on the type of content
    translatedText = await this.applyContextualTranslation(translatedText, request);

    return translatedText;
  }

  private translateMedicalTerms(text: string, fromLang: SupportedLanguage, toLang: SupportedLanguage): string {
    let translatedText = text;

    // Translate all medical dictionaries
    const dictionaries = [
      VETERINARY_TRANSLATIONS.conditions,
      VETERINARY_TRANSLATIONS.symptoms,
      VETERINARY_TRANSLATIONS.treatments,
      VETERINARY_TRANSLATIONS.anatomy,
      VETERINARY_TRANSLATIONS.phrases
    ];

    for (const dictionary of dictionaries) {
      for (const [key, translations] of Object.entries(dictionary)) {
        const fromTerm = translations[fromLang];
        const toTerm = translations[toLang];
        
        if (fromTerm && toTerm) {
          // Case-insensitive replacement
          const regex = new RegExp(`\\b${this.escapeRegex(fromTerm)}\\b`, 'gi');
          translatedText = translatedText.replace(regex, toTerm);
        }
      }
    }

    return translatedText;
  }

  private translateSentencePatterns(text: string, fromLang: SupportedLanguage, toLang: SupportedLanguage): string {
    let translatedText = text;

    const fromPatterns = SENTENCE_PATTERNS[fromLang];
    const toPatterns = SENTENCE_PATTERNS[toLang];

    if (fromPatterns && toPatterns) {
      for (const [key, fromPattern] of Object.entries(fromPatterns)) {
        const toPattern = toPatterns[key as keyof typeof toPatterns];
        if (toPattern) {
          // Simple pattern matching and replacement
          const regex = new RegExp(fromPattern.replace(/\{[^}]+\}/g, '(.+?)'), 'gi');
          const matches = text.match(regex);
          if (matches) {
            // This is a simplified implementation
            // In a real system, you'd need more sophisticated pattern matching
            translatedText = translatedText.replace(regex, toPattern);
          }
        }
      }
    }

    return translatedText;
  }

  private async applyContextualTranslation(text: string, request: TranslationRequest): Promise<string> {
    // Apply context-specific translations
    let translatedText = text;

    switch (request.context) {
      case 'medical':
        translatedText = this.translateMedicalContext(translatedText, request.fromLanguage, request.toLanguage);
        break;
      case 'symptoms':
        translatedText = this.translateSymptomsContext(translatedText, request.fromLanguage, request.toLanguage);
        break;
      case 'treatments':
        translatedText = this.translateTreatmentsContext(translatedText, request.fromLanguage, request.toLanguage);
        break;
      default:
        // General translation - already handled by medical terms
        break;
    }

    return translatedText;
  }

  private translateMedicalContext(text: string, fromLang: SupportedLanguage, toLang: SupportedLanguage): string {
    // Medical-specific translations
    const medicalPhrases = {
      'diagnosis': { en: 'diagnosis', lv: 'diagnoze', ru: 'диагноз' },
      'prognosis': { en: 'prognosis', lv: 'prognoze', ru: 'прогноз' },
      'chronic': { en: 'chronic', lv: 'hronisks', ru: 'хронический' },
      'acute': { en: 'acute', lv: 'akūts', ru: 'острый' },
      'severe': { en: 'severe', lv: 'smags', ru: 'тяжелый' },
      'mild': { en: 'mild', lv: 'viegls', ru: 'легкий' },
      'moderate': { en: 'moderate', lv: 'vidējs', ru: 'умеренный' }
    };

    let translatedText = text;
    for (const [key, translations] of Object.entries(medicalPhrases)) {
      const fromTerm = translations[fromLang];
      const toTerm = translations[toLang];
      
      if (fromTerm && toTerm) {
        const regex = new RegExp(`\\b${this.escapeRegex(fromTerm)}\\b`, 'gi');
        translatedText = translatedText.replace(regex, toTerm);
      }
    }

    return translatedText;
  }

  private translateSymptomsContext(text: string, fromLang: SupportedLanguage, toLang: SupportedLanguage): string {
    // Symptom-specific translations with intensity modifiers
    const intensityModifiers = {
      'very': { en: 'very', lv: 'ļoti', ru: 'очень' },
      'extremely': { en: 'extremely', lv: 'ārkārtīgi', ru: 'крайне' },
      'slightly': { en: 'slightly', lv: 'nedaudz', ru: 'слегка' },
      'occasionally': { en: 'occasionally', lv: 'dažreiz', ru: 'иногда' },
      'frequently': { en: 'frequently', lv: 'bieži', ru: 'часто' },
      'constantly': { en: 'constantly', lv: 'pastāvīgi', ru: 'постоянно' }
    };

    let translatedText = text;
    for (const [key, translations] of Object.entries(intensityModifiers)) {
      const fromTerm = translations[fromLang];
      const toTerm = translations[toLang];
      
      if (fromTerm && toTerm) {
        const regex = new RegExp(`\\b${this.escapeRegex(fromTerm)}\\b`, 'gi');
        translatedText = translatedText.replace(regex, toTerm);
      }
    }

    return translatedText;
  }

  private translateTreatmentsContext(text: string, fromLang: SupportedLanguage, toLang: SupportedLanguage): string {
    // Treatment-specific translations
    const treatmentPhrases = {
      'twice_daily': { en: 'twice daily', lv: '2 reizes dienā', ru: 'два раза в день' },
      'three_times_daily': { en: 'three times daily', lv: '3 reizes dienā', ru: 'три раза в день' },
      'as_needed': { en: 'as needed', lv: 'pēc nepieciešamības', ru: 'по мере необходимости' },
      'with_food': { en: 'with food', lv: 'ar ēdienu', ru: 'с едой' },
      'on_empty_stomach': { en: 'on empty stomach', lv: 'tukšā dūšā', ru: 'натощак' },
      'topical_application': { en: 'topical application', lv: 'lokāla lietošana', ru: 'местное применение' }
    };

    let translatedText = text;
    for (const [key, translations] of Object.entries(treatmentPhrases)) {
      const fromTerm = translations[fromLang];
      const toTerm = translations[toLang];
      
      if (fromTerm && toTerm) {
        const regex = new RegExp(`\\b${this.escapeRegex(fromTerm)}\\b`, 'gi');
        translatedText = translatedText.replace(regex, toTerm);
      }
    }

    return translatedText;
  }

  private calculateTranslationConfidence(originalText: string, translatedText: string, context?: string): number {
    let confidence = 0.7; // Base confidence

    // Increase confidence if medical terms were successfully translated
    const medicalTermsFound = this.countMedicalTerms(originalText);
    if (medicalTermsFound > 0) {
      confidence += 0.2;
    }

    // Increase confidence based on context
    if (context) {
      confidence += 0.1;
    }

    // Decrease confidence if text is very long (harder to translate accurately)
    if (originalText.length > 500) {
      confidence -= 0.1;
    }

    return Math.min(Math.max(confidence, 0.1), 1.0);
  }

  private countMedicalTerms(text: string): number {
    let count = 0;
    const allTerms = [
      ...Object.keys(VETERINARY_TRANSLATIONS.conditions),
      ...Object.keys(VETERINARY_TRANSLATIONS.symptoms),
      ...Object.keys(VETERINARY_TRANSLATIONS.treatments),
      ...Object.keys(VETERINARY_TRANSLATIONS.anatomy)
    ];

    const textLower = text.toLowerCase();
    for (const term of allTerms) {
      if (textLower.includes(term.replace(/_/g, ' '))) {
        count++;
      }
    }

    return count;
  }

  private escapeRegex(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Batch translation for multiple texts
  async translateBatch(requests: TranslationRequest[]): Promise<TranslationResponse[]> {
    const results: TranslationResponse[] = [];
    
    for (const request of requests) {
      const result = await this.translateText(request);
      results.push(result);
    }
    
    return results;
  }

  // Auto-detect language and translate to target language
  async autoTranslate(text: string, targetLanguage: SupportedLanguage, context?: string): Promise<TranslationResponse> {
    const detectedLanguage = this.detectLanguage(text);
    
    return this.translateText({
      text,
      fromLanguage: detectedLanguage,
      toLanguage: targetLanguage,
      context: context as any
    });
  }

  private detectLanguage(text: string): SupportedLanguage {
    // Simple language detection based on character patterns
    const textLower = text.toLowerCase();
    
    // Russian detection (Cyrillic characters)
    if (/[а-я]/i.test(text)) {
      return 'ru';
    }
    
    // Latvian detection (specific Latvian characters)
    if (/[āčēģīķļņšūž]/i.test(text)) {
      return 'lv';
    }
    
    // Check for Latvian-specific words
    const latvianWords = ['mājdzīvnieks', 'veterinārārsts', 'ārstēšana', 'simptomi'];
    if (latvianWords.some(word => textLower.includes(word))) {
      return 'lv';
    }
    
    // Check for Russian-specific words
    const russianWords = ['питомец', 'ветеринар', 'лечение', 'симптомы'];
    if (russianWords.some(word => textLower.includes(word))) {
      return 'ru';
    }
    
    // Default to English
    return 'en';
  }

  // Clear translation cache
  clearCache(): void {
    this.translationCache.clear();
  }

  // Get translation statistics
  getStats() {
    return {
      cacheSize: this.translationCache.size,
      supportedLanguages: ['en', 'lv', 'ru'],
      medicalTermsCount: Object.keys(VETERINARY_TRANSLATIONS.conditions).length +
                        Object.keys(VETERINARY_TRANSLATIONS.symptoms).length +
                        Object.keys(VETERINARY_TRANSLATIONS.treatments).length +
                        Object.keys(VETERINARY_TRANSLATIONS.anatomy).length
    };
  }
}

// Singleton instance
export const veterinaryTranslator = new VeterinaryTranslator();