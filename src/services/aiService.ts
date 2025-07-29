import { PetSpecies } from '../types';
import { botClient, BotChatRequest } from './botClient';
import { useTranslation } from 'react-i18next';

// Simple language detection for fallback
const detectLanguage = (text: string): 'en' | 'lv' | 'ru' => {
  // Latvian characters
  if (/[āčēģīķļņšūž]/g.test(text)) return 'lv';
  
  // Russian characters
  if (/[а-яё]/g.test(text.toLowerCase())) return 'ru';
  
  // Default to English
  return 'en';
};

export const generateVetAdvice = async (query: string, species: PetSpecies): Promise<string> => {
  try {
    console.log(`🚀 REAL AI BOT SERVICE: Processing "${query}" for ${species}`);
    
    // Detect user's language
    const detectedLanguage = detectLanguage(query);
    console.log(`🌍 Language detected: ${detectedLanguage}`);

    // Prepare bot request
    const botRequest: BotChatRequest = {
      query,
      species,
      language: detectedLanguage,
      context: {
        // Add any additional context if available
        symptoms: extractSymptoms(query)
      }
    };

    // Call the AI bot service
    const botResponse = await botClient.chat(botRequest);
    
    console.log(`✅ REAL BOT RESPONSE: Confidence ${Math.round(botResponse.confidence * 100)}%, Sources: ${botResponse.sources.length}`);
    
    // Format the comprehensive response
    let finalResponse = `${botResponse.answer}\n\n`;
    
    // Add recommendations if available
    if (botResponse.recommendations.length > 0) {
      finalResponse += `**${getLocalizedText('recommendations', detectedLanguage)}:**\n`;
      botResponse.recommendations.forEach((rec, index) => {
        finalResponse += `${index + 1}. ${rec}\n`;
      });
      finalResponse += '\n';
    }

    // Add urgency indicator
    if (botResponse.urgency === 'emergency') {
      finalResponse += `⚠️ **${getLocalizedText('urgent', detectedLanguage)}**: ${getLocalizedText('emergencyText', detectedLanguage)}\n\n`;
    } else if (botResponse.urgency === 'high') {
      finalResponse += `⚡ **${getLocalizedText('important', detectedLanguage)}**: ${getLocalizedText('consultSoon', detectedLanguage)}\n\n`;
    }

    // Add sources if available
    if (botResponse.sources.length > 0) {
      finalResponse += `**${getLocalizedText('sources', detectedLanguage)}:** ${botResponse.sources.length} ${getLocalizedText('veterinaryResources', detectedLanguage)}\n`;
    }

    // Add confidence indicator
    const confidenceEmoji = botResponse.confidence > 0.8 ? '🎯' : botResponse.confidence > 0.6 ? '📊' : '🔍';
    finalResponse += `${confidenceEmoji} **${getLocalizedText('confidence', detectedLanguage)}:** ${Math.round(botResponse.confidence * 100)}%\n`;
    
    // Add processing info
    finalResponse += `🤖 **${getLocalizedText('provider', detectedLanguage)}:** ${botResponse.metadata.aiProvider}\n`;
    finalResponse += `⚡ **${getLocalizedText('processingTime', detectedLanguage)}:** ${botResponse.metadata.processingTime}ms\n`;
    
    // Add reasoning for transparency
    if (botResponse.metadata.reasoning) {
      finalResponse += `🧠 **${getLocalizedText('analysis', detectedLanguage)}:** ${botResponse.metadata.reasoning}\n`;
    }

    return finalResponse;

  } catch (error) {
    console.error('Real AI bot service failed, using fallback:', error);
    return generateFallbackResponse(query, species);
  }
};

// Extract potential symptoms from query
const extractSymptoms = (query: string): string[] => {
  const symptoms: string[] = [];
  const symptomKeywords = [
    'vomiting', 'diarrhea', 'coughing', 'sneezing', 'fever', 'lethargy', 
    'loss of appetite', 'not eating', 'hiding', 'aggressive', 'limping',
    'scratching', 'itching', 'hair loss', 'bleeding', 'swelling',
    'рвота', 'понос', 'кашель', 'чихание', 'лихорадка', 'вялость',
    'vemšana', 'caureja', 'klepus', 'šķaudīšana', 'drudzis', 'nespēks'
  ];

  const lowerQuery = query.toLowerCase();
  symptomKeywords.forEach(symptom => {
    if (lowerQuery.includes(symptom.toLowerCase())) {
      symptoms.push(symptom);
    }
  });

  return symptoms;
};

// Get localized text for common terms
const getLocalizedText = (key: string, language: 'en' | 'lv' | 'ru'): string => {
  const translations = {
    recommendations: {
      en: 'Recommendations',
      lv: 'Ieteikumi',
      ru: 'Рекомендации'
    },
    urgent: {
      en: 'URGENT',
      lv: 'STEIDZAMI',
      ru: 'СРОЧНО'
    },
    important: {
      en: 'Important',
      lv: 'Svarīgi',
      ru: 'Важно'
    },
    emergencyText: {
      en: 'This may require immediate veterinary attention!',
      lv: 'Tas var prasīt tūlītēju veterinārārsta uzmanību!',
      ru: 'Это может потребовать немедленного внимания ветеринара!'
    },
    consultSoon: {
      en: 'Please consult a veterinarian soon.',
      lv: 'Lūdzu, drīz vērsieties pie veterinārārsta.',
      ru: 'Пожалуйста, скоро обратитесь к ветеринару.'
    },
    sources: {
      en: 'Sources consulted',
      lv: 'Izmantotie avoti',
      ru: 'Использованные источники'
    },
    veterinaryResources: {
      en: 'veterinary resources',
      lv: 'veterinārās resursi',
      ru: 'ветеринарные ресурсы'
    },
    confidence: {
      en: 'Confidence',
      lv: 'Pārliecība',
      ru: 'Уверенность'
    },
    provider: {
      en: 'AI Provider',
      lv: 'AI Sniedzējs',
      ru: 'AI Провайдер'
    },
    processingTime: {
      en: 'Processing Time',
      lv: 'Apstrādes laiks',
      ru: 'Время обработки'
    },
    analysis: {
      en: 'Analysis',
      lv: 'Analīze',
      ru: 'Анализ'
    }
  };

  return translations[key as keyof typeof translations]?.[language] || translations[key as keyof typeof translations]?.en || key;
};

// Fallback response when bot service is unavailable
const generateFallbackResponse = (query: string, species: PetSpecies): string => {
  const language = detectLanguage(query);
  
  const fallbackMessages = {
    en: `Thank you for your question about your ${species}. I'm currently experiencing technical difficulties with the AI bot service, but I want to ensure you get the help you need.

**Immediate recommendations:**
1. If this is an emergency (difficulty breathing, severe bleeding, unconsciousness, seizures), contact an emergency veterinarian immediately
2. For non-emergency concerns, schedule an appointment with your regular veterinarian
3. Monitor your pet closely and note any changes in behavior, appetite, or symptoms
4. Ensure your pet has access to fresh water and a comfortable environment

**Emergency contacts:**
- Your local veterinary clinic
- Animal emergency services in your area
- Pet poison control hotline (if suspected poisoning)

I apologize for the technical difficulties. Your pet's health is important, and professional veterinary care is always the best option for proper diagnosis and treatment.

🔧 **System Status:** AI Bot Service Unavailable - Please try again later.`,
    
    lv: `Paldies par jautājumu par jūsu ${species}. Man pašlaik ir tehniskas problēmas ar AI bota servisu, bet es vēlos nodrošināt, ka jūs saņemat nepieciešamo palīdzību.

**Tūlītēji ieteikumi:**
1. Ja tas ir neatliekams gadījums (elpošanas grūtības, spēcīga asiņošana, bezsamaņa, krampji), nekavējoties sazinieties ar neatliekamās palīdzības veterinārārstu
2. Neatliekamu problēmu gadījumā piesakieties pie sava parastā veterinārārsta
3. Rūpīgi novērojiet savu mājdzīvnieku un atzīmējiet jebkādas izmaiņas uzvedībā, apetītē vai simptomos
4. Nodrošiniet, lai jūsu mājdzīvniekam būtu pieeja svaigam ūdenim un ērtai videi

**Neatliekamās palīdzības kontakti:**
- Jūsu vietējā veterinārā klīnika
- Dzīvnieku neatliekamās palīdzības dienesti jūsu apkārtnē
- Mājdzīvnieku saindēšanās kontroles tālrunis (ja ir aizdomas par saindēšanos)

Es atvainojos par tehniskajām grūtībām. Jūsu mājdzīvnieka veselība ir svarīga, un profesionāla veterinārā aprūpe vienmēr ir labākā iespēja pareizai diagnozei un ārstēšanai.

🔧 **Sistēmas statuss:** AI Bota serviss nav pieejams - Lūdzu, mēģiniet vēlāk.`,
    
    ru: `Спасибо за ваш вопрос о вашем ${species}. У меня сейчас технические трудности с сервисом AI-бота, но я хочу убедиться, что вы получите необходимую помощь.

**Срочные рекомендации:**
1. Если это экстренная ситуация (затрудненное дыхание, сильное кровотечение, потеря сознания, судороги), немедленно обратитесь к ветеринару скорой помощи
2. При неэкстренных проблемах запишитесь на прием к вашему обычному ветеринару
3. Внимательно наблюдайте за вашим питомцем и отмечайте любые изменения в поведении, аппетите или симптомах
4. Убедитесь, что у вашего питомца есть доступ к свежей воде и комфортной обстановке

**Контакты экстренных служб:**
- Ваша местная ветеринарная клиника
- Службы экстренной помощи животным в вашем районе
- Горячая линия по отравлениям домашних животных (при подозрении на отравление)

Я извиняюсь за технические трудности. Здоровье вашего питомца важно, и профессиональная ветеринарная помощь всегда является лучшим вариантом для правильной диагностики и лечения.

🔧 **Статус системы:** Сервис AI-бота недоступен - Пожалуйста, попробуйте позже.`
  };

  return fallbackMessages[language];
};

// Export additional utility functions
export const translateText = async (text: string, to: 'en' | 'lv' | 'ru'): Promise<string> => {
  try {
    const translation = await botClient.translate({
      text,
      to,
      context: 'medical'
    });
    return translation.translatedText;
  } catch (error) {
    console.error('Translation failed:', error);
    return text; // Return original text if translation fails
  }
};

export const getSuggestedQuestions = async (species: PetSpecies, language: 'en' | 'lv' | 'ru' = 'en'): Promise<string[]> => {
  try {
    return await botClient.getSuggestions(species, language);
  } catch (error) {
    console.error('Failed to get suggestions:', error);
    return []; // Return empty array if suggestions fail
  }
};

export const submitFeedback = async (conversationId: string, rating: number, feedback?: string, helpful: boolean = true): Promise<void> => {
  try {
    await botClient.submitFeedback({
      conversationId,
      rating,
      feedback,
      helpful
    });
  } catch (error) {
    console.error('Failed to submit feedback:', error);
    // Silently fail for feedback
  }
};

export const getBotHealth = async () => {
  try {
    return await botClient.checkHealth();
  } catch (error) {
    console.error('Failed to check bot health:', error);
    return {
      status: 'down' as const,
      version: 'unknown',
      uptime: 0,
      stats: {
        totalConversations: 0,
        averageResponseTime: 0,
        successRate: 0
      }
    };
  }
};

export const getBotStats = async () => {
  try {
    return await botClient.getStats();
  } catch (error) {
    console.error('Failed to get bot stats:', error);
    return null;
  }
};