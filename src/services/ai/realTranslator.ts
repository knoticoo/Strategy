import axios from 'axios';

export type SupportedLanguage = 'en' | 'lv' | 'ru';

export interface RealTranslationRequest {
  text: string;
  from: SupportedLanguage;
  to: SupportedLanguage;
  context?: 'medical' | 'veterinary' | 'general';
}

export interface RealTranslationResponse {
  translatedText: string;
  originalText: string;
  fromLanguage: SupportedLanguage;
  toLanguage: SupportedLanguage;
  confidence: number;
  service: string;
}

// Language detection patterns (improved)
const LANGUAGE_PATTERNS = {
  lv: {
    chars: /[āčēģīķļņšūž]/g,
    words: /\b(un|ir|nav|kas|kur|kad|kā|vai|bet|arī|tikai|vēl|jau|ļoti|daudz|mazs|liels|labs|slikts|jauns|vecs|dzīvnieks|kaķis|suns|putns|zivs|ārstēšana|slimība|veselība)\b/gi
  },
  ru: {
    chars: /[а-яё]/g,
    words: /\b(и|в|не|на|я|быть|тот|все|она|так|его|но|да|ты|к|у|же|вы|за|бы|по|только|ее|мне|было|вот|от|меня|еще|нет|о|из|ему|теперь|когда|даже|ну|вдруг|ли|если|уже|или|ни|быстро|животное|кошка|собака|птица|рыба|лечение|болезнь|здоровье)\b/gi
  },
  en: {
    chars: /[a-z]/g,
    words: /\b(the|be|to|of|and|a|in|that|have|i|it|for|not|on|with|he|as|you|do|at|this|but|his|by|from|they|she|or|an|will|my|one|all|would|there|their|we|him|been|has|had|which|more|when|who|oil|its|now|find|long|down|day|did|get|come|made|may|part|over|new|sound|take|only|little|work|know|place|year|live|me|back|give|most|very|after|move|much|name|good|sentence|man|think|say|great|where|help|through|line|right|too|means|old|any|same|tell|boy|follow|came|want|show|also|around|form|three|small|set|put|end|why|again|turn|here|off|went|old|number|great|tell|men|say|small|every|found|still|between|mane|thought|head|under|story|saw|left|don't|few|while|along|might|close|something|seem|next|hard|open|example|begin|life|always|those|both|paper|together|got|group|often|run|important|until|children|side|feet|car|mile|night|walk|white|sea|began|grow|took|river|four|carry|state|once|book|hear|stop|without|second|later|miss|idea|enough|eat|face|watch|far|indian|really|almost|let|above|girl|sometimes|mountain|cut|young|talk|soon|list|song|leave|family|it's|animal|cat|dog|bird|fish|treatment|disease|health|veterinary|medicine|pet)\b/gi
  }
};

class RealVeterinaryTranslator {
  private translationCache: Map<string, RealTranslationResponse> = new Map();
  private fallbackDictionary: Map<string, { [key in SupportedLanguage]: string }> = new Map();

  constructor() {
    this.initializeFallbackDictionary();
  }

  async translateText(request: RealTranslationRequest): Promise<RealTranslationResponse> {
    const cacheKey = `${request.text}-${request.from}-${request.to}`;
    
    if (this.translationCache.has(cacheKey)) {
      return this.translationCache.get(cacheKey)!;
    }

    console.log(`🌍 REAL TRANSLATION: "${request.text}" from ${request.from} to ${request.to}`);

    try {
      // Try Google Translate API first
      const googleResult = await this.translateWithGoogle(request);
      if (googleResult) {
        this.translationCache.set(cacheKey, googleResult);
        return googleResult;
      }
    } catch (error) {
      console.warn('Google Translate failed, trying alternatives:', error);
    }

    try {
      // Try LibreTranslate as backup
      const libreResult = await this.translateWithLibre(request);
      if (libreResult) {
        this.translationCache.set(cacheKey, libreResult);
        return libreResult;
      }
    } catch (error) {
      console.warn('LibreTranslate failed, using fallback:', error);
    }

    // Fallback to dictionary-based translation
    const fallbackResult = this.translateWithFallback(request);
    this.translationCache.set(cacheKey, fallbackResult);
    return fallbackResult;
  }

  private async translateWithGoogle(request: RealTranslationRequest): Promise<RealTranslationResponse | null> {
    try {
      // Using Google Translate's free endpoint (limited but works for basic use)
      const response = await axios.get('https://translate.googleapis.com/translate_a/single', {
        params: {
          client: 'gtx',
          sl: request.from,
          tl: request.to,
          dt: 't',
          q: request.text
        },
        timeout: 5000
      });

      if (response.data && response.data[0] && response.data[0][0]) {
        const translatedText = response.data[0][0][0];
        
        return {
          translatedText,
          originalText: request.text,
          fromLanguage: request.from,
          toLanguage: request.to,
          confidence: 0.9,
          service: 'Google Translate'
        };
      }
    } catch (error) {
      console.warn('Google Translate API error:', error);
    }
    
    return null;
  }

  private async translateWithLibre(request: RealTranslationRequest): Promise<RealTranslationResponse | null> {
    try {
      // LibreTranslate free instance
      const response = await axios.post('https://libretranslate.de/translate', {
        q: request.text,
        source: request.from,
        target: request.to,
        format: 'text'
      }, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.translatedText) {
        return {
          translatedText: response.data.translatedText,
          originalText: request.text,
          fromLanguage: request.from,
          toLanguage: request.to,
          confidence: 0.8,
          service: 'LibreTranslate'
        };
      }
    } catch (error) {
      console.warn('LibreTranslate API error:', error);
    }
    
    return null;
  }

  private translateWithFallback(request: RealTranslationRequest): RealTranslationResponse {
    console.log('🔄 Using fallback dictionary translation');
    
    let translatedText = request.text;
    let wordsTranslated = 0;
    const totalWords = request.text.split(' ').length;

    // Apply dictionary translations
    for (const [key, translations] of this.fallbackDictionary.entries()) {
      const regex = new RegExp(`\\b${key}\\b`, 'gi');
      if (regex.test(translatedText) && translations[request.to]) {
        translatedText = translatedText.replace(regex, translations[request.to]);
        wordsTranslated++;
      }
    }

    const confidence = Math.min(0.7, wordsTranslated / totalWords);

    return {
      translatedText,
      originalText: request.text,
      fromLanguage: request.from,
      toLanguage: request.to,
      confidence,
      service: 'Fallback Dictionary'
    };
  }

  async autoTranslate(
    text: string, 
    targetLanguage: SupportedLanguage, 
    context?: string
  ): Promise<RealTranslationResponse> {
    const detectedLanguage = this.detectLanguage(text);
    
    if (detectedLanguage === targetLanguage) {
      return {
        translatedText: text,
        originalText: text,
        fromLanguage: detectedLanguage,
        toLanguage: targetLanguage,
        confidence: 1.0,
        service: 'No Translation Needed'
      };
    }

    return await this.translateText({
      text,
      from: detectedLanguage,
      to: targetLanguage,
      context: context as any
    });
  }

  detectLanguage(text: string): SupportedLanguage {
    const scores = { en: 0, lv: 0, ru: 0 };
    
    for (const [lang, patterns] of Object.entries(LANGUAGE_PATTERNS)) {
      const langKey = lang as SupportedLanguage;
      
      // Character-based detection
      const charMatches = (text.match(patterns.chars) || []).length;
      scores[langKey] += charMatches * 2;
      
      // Word-based detection
      const wordMatches = (text.match(patterns.words) || []).length;
      scores[langKey] += wordMatches * 5;
    }

    // Return language with highest score
    const detectedLang = Object.entries(scores).reduce((a, b) => 
      scores[a[0] as SupportedLanguage] > scores[b[0] as SupportedLanguage] ? a : b
    )[0] as SupportedLanguage;

    console.log(`🔍 Language detection: "${text.substring(0, 50)}..." -> ${detectedLang} (scores: ${JSON.stringify(scores)})`);
    
    return detectedLang;
  }

  private initializeFallbackDictionary() {
    // Essential veterinary terms for fallback translation
    const terms = [
      // Animals
      ['dog', { en: 'dog', lv: 'suns', ru: 'собака' }],
      ['cat', { en: 'cat', lv: 'kaķis', ru: 'кошка' }],
      ['bird', { en: 'bird', lv: 'putns', ru: 'птица' }],
      ['fish', { en: 'fish', lv: 'zivs', ru: 'рыба' }],
      ['rabbit', { en: 'rabbit', lv: 'trusis', ru: 'кролик' }],
      ['hamster', { en: 'hamster', lv: 'kāmis', ru: 'хомяк' }],
      
      // Health terms
      ['health', { en: 'health', lv: 'veselība', ru: 'здоровье' }],
      ['disease', { en: 'disease', lv: 'slimība', ru: 'болезнь' }],
      ['treatment', { en: 'treatment', lv: 'ārstēšana', ru: 'лечение' }],
      ['medicine', { en: 'medicine', lv: 'zāles', ru: 'лекарство' }],
      ['symptoms', { en: 'symptoms', lv: 'simptomi', ru: 'симптомы' }],
      ['diagnosis', { en: 'diagnosis', lv: 'diagnoze', ru: 'диагноз' }],
      ['veterinarian', { en: 'veterinarian', lv: 'veterinārārsts', ru: 'ветеринар' }],
      ['pain', { en: 'pain', lv: 'sāpes', ru: 'боль' }],
      ['infection', { en: 'infection', lv: 'infekcija', ru: 'инфекция' }],
      ['allergy', { en: 'allergy', lv: 'alerģija', ru: 'аллергия' }],
      
      // Body parts
      ['eye', { en: 'eye', lv: 'acs', ru: 'глаз' }],
      ['ear', { en: 'ear', lv: 'auss', ru: 'ухо' }],
      ['skin', { en: 'skin', lv: 'āda', ru: 'кожа' }],
      ['fur', { en: 'fur', lv: 'spalva', ru: 'шерсть' }],
      ['teeth', { en: 'teeth', lv: 'zobi', ru: 'зубы' }],
      ['stomach', { en: 'stomach', lv: 'kuņģis', ru: 'желудок' }],
      
      // Common issues
      ['vomiting', { en: 'vomiting', lv: 'vemšana', ru: 'рвота' }],
      ['diarrhea', { en: 'diarrhea', lv: 'caureja', ru: 'диарея' }],
      ['cough', { en: 'cough', lv: 'klepus', ru: 'кашель' }],
      ['fever', { en: 'fever', lv: 'drudzis', ru: 'лихорадка' }],
      ['appetite', { en: 'appetite', lv: 'apetīte', ru: 'аппетит' }],
      ['weight', { en: 'weight', lv: 'svars', ru: 'вес' }],
      ['behavior', { en: 'behavior', lv: 'uzvedība', ru: 'поведение' }],
      
      // Actions
      ['eating', { en: 'eating', lv: 'ēšana', ru: 'еда' }],
      ['drinking', { en: 'drinking', lv: 'dzeršana', ru: 'питье' }],
      ['sleeping', { en: 'sleeping', lv: 'gulēšana', ru: 'сон' }],
      ['playing', { en: 'playing', lv: 'spēlēšana', ru: 'игра' }],
      ['walking', { en: 'walking', lv: 'staigāšana', ru: 'ходьба' }]
    ];

    for (const [key, translations] of terms) {
      this.fallbackDictionary.set(key, translations as { [key in SupportedLanguage]: string });
    }
  }

  getTranslationStats(): { cacheSize: number; dictionarySize: number } {
    return {
      cacheSize: this.translationCache.size,
      dictionarySize: this.fallbackDictionary.size
    };
  }
}

export const realVeterinaryTranslator = new RealVeterinaryTranslator();