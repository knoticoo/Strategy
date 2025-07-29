// Language detection and response utilities

export type SupportedLanguage = 'lv' | 'ru' | 'en';

// Language detection patterns
const languagePatterns = {
  ru: [
    // Russian patterns - Cyrillic characters and common words
    /[а-яё]/i,
    /\b(что|как|где|когда|почему|собака|кошка|болит|помощь|лечение|медицина)\b/i
  ],
  lv: [
    // Latvian patterns - specific Latvian characters and words
    /[āčēģīķļņšūž]/i,
    /\b(kas|kā|kur|kad|kāpēc|suns|kaķis|sāp|palīdzība|ārstēšana|medicīna)\b/i
  ],
  en: [
    // English patterns - common English words
    /\b(what|how|where|when|why|dog|cat|hurts|help|treatment|medicine)\b/i
  ]
};

export const detectLanguage = (text: string): SupportedLanguage => {
  // Count matches for each language
  const scores = {
    ru: 0,
    lv: 0,
    en: 0
  };

  for (const [lang, patterns] of Object.entries(languagePatterns)) {
    for (const pattern of patterns) {
      if (pattern.test(text)) {
        scores[lang as SupportedLanguage] += 1;
      }
    }
  }

  // Return language with highest score, default to Latvian
  const maxScore = Math.max(...Object.values(scores));
  if (maxScore === 0) return 'lv'; // Default to Latvian

  return Object.entries(scores).find(([_, score]) => score === maxScore)?.[0] as SupportedLanguage || 'lv';
};

// Multilingual response templates
export const responseTemplates = {
  assessment: {
    lv: '🔍 **NOVĒRTĒJUMS**',
    ru: '🔍 **ОЦЕНКА**',
    en: '🔍 **ASSESSMENT**'
  },
  possibleCauses: {
    lv: '🎯 **IESPĒJAMIE IEMESLI**',
    ru: '🎯 **ВОЗМОЖНЫЕ ПРИЧИНЫ**',
    en: '🎯 **POSSIBLE CAUSES**'
  },
  recommendations: {
    lv: '💡 **IETEIKUMI**',
    ru: '💡 **РЕКОМЕНДАЦИИ**',
    en: '💡 **RECOMMENDATIONS**'
  },
  suggestedMedicines: {
    lv: '💊 **IETEICAMIE PREPARĀTI**',
    ru: '💊 **РЕКОМЕНДУЕМЫЕ ПРЕПАРАТЫ**',
    en: '💊 **SUGGESTED MEDICINES**'
  },
  dietaryAdvice: {
    lv: '🍽️ **UZTURA IETEIKUMI**',
    ru: '🍽️ **ДИЕТИЧЕСКИЕ РЕКОМЕНДАЦИИ**',
    en: '🍽️ **DIETARY ADVICE**'
  },
  whenToSeeVet: {
    lv: '**KAD VĒRSTIES PIE VETERINĀRĀRSTA**',
    ru: '**КОГДА ОБРАТИТЬСЯ К ВЕТЕРИНАРУ**',
    en: '**WHEN TO SEE A VET**'
  },
  petInfo: {
    lv: '📋 **SVARĪGA INFORMĀCIJA PAR',
    ru: '📋 **ВАЖНАЯ ИНФОРМАЦИЯ О',
    en: '📋 **IMPORTANT INFORMATION ABOUT'
  },
  dosage: {
    lv: 'Deva:',
    ru: 'Дозировка:',
    en: 'Dosage:'
  },
  avgWeight: {
    lv: 'Vidējais svars:',
    ru: 'Средний вес:',
    en: 'Average weight:'
  },
  lifespan: {
    lv: 'Vidējais dzīves ilgums:',
    ru: 'Средняя продолжительность жизни:',
    en: 'Average lifespan:'
  },
  commonIssues: {
    lv: 'Biežākās problēmas:',
    ru: 'Частые проблемы:',
    en: 'Common issues:'
  },
  warning: {
    lv: '⚠️ **SVARĪGI**: Šī informācija ir tikai informatīviem nolūkiem un neaizstāj profesionālu veterinārārsta konsultāciju. Nopietnu simptomu gadījumā nekavējoties vērsieties pie speciālista!',
    ru: '⚠️ **ВАЖНО**: Эта информация предназначена только для ознакомления и не заменяет профессиональную ветеринарную консультацию. При серьезных симптомах немедленно обратитесь к специалисту!',
    en: '⚠️ **IMPORTANT**: This information is for informational purposes only and does not replace professional veterinary consultation. For serious symptoms, contact a specialist immediately!'
  }
};

export const getResponseTemplate = (key: keyof typeof responseTemplates, language: SupportedLanguage): string => {
  return responseTemplates[key][language];
};