import { PetSpecies } from '../../types';
import { SymptomAnalysis } from './symptomAnalyzer';

export interface TreatmentRecommendation {
  assessment: string;
  possibleCauses: string[];
  recommendations: string[];
  suggestedMedicines: string[];
  dietaryAdvice: string[];
  urgencyLevel: 'low' | 'medium' | 'high' | 'emergency';
  whenToSeeVet: string;
}

// Multilingual response templates
const responseTemplates = {
  lv: {
    assessment: {
      skin: 'Pamatojoties uz aprakstītajiem simptomiem, iespējamas ādas problēmas.',
      digestive: 'Aprakstītie simptomi liecina par iespējām gremošanas sistēmas problēmām.',
      respiratory: 'Simptomi norāda uz iespējām elpošanas sistēmas problēmām.',
      urinary: 'Aprakstītie simptomi var liecināt par urīnceļu problēmām.',
      behavioral: 'Novērotās uzvedības izmaiņas var liecināt par dažādiem veselības jautājumiem.',
      general: 'Nepieciešama sīkāka simptomu analīze, lai noteiktu precīzu diagnozi.'
    },
    causes: {
      skin: ['Alerģiskas reakcijas', 'Parazītu infekcijas', 'Bakteriālas vai sēnīšu infekcijas', 'Hormonu disbalanss', 'Stress vai vides faktori'],
      digestive: ['Nepareiza uztura', 'Pārtikas alerģijas', 'Parazīti', 'Infekcijas', 'Stress'],
      respiratory: ['Alerģijas', 'Infekcijas', 'Ārējie kairinātāji', 'Sirds problēmas', 'Elpceļu obstrukcija'],
      urinary: ['Urīnceļu infekcijas', 'Akmeņi', 'Cistīts', 'Nieru problēmas', 'Hormonu izmaiņas'],
      behavioral: ['Stress', 'Slimības', 'Vides izmaiņas', 'Vecuma izmaiņas', 'Sociālie faktori'],
      general: ['Dažādi faktori var ietekmēt mājdzīvnieka veselību', 'Nepieciešama detalizētāka simptomu novērtēšana']
    },
    recommendations: {
      skin: ['Uzturiet tīru un sausu dzīves vidi', 'Izvairieties no zināmiem alerģēniem', 'Lietojiet maigus šampūnus', 'Novērojiet simptomu izmaiņas'],
      digestive: ['Īslaicīgs badošanas periods', 'Pakāpeniska pāreja uz vieglu diētu', 'Nodrošiniet pietiekamu šķidruma daudzumu', 'Izvairieties no jauna barības'],
      respiratory: ['Nodrošiniet tīru gaisu', 'Izvairieties no kairinātājiem', 'Uzturiet mitrumu telpā', 'Novērojiet elpošanas biežumu'],
      urinary: ['Palieliniet ūdens patēriņu', 'Biežāk dodiet iespēju справить нужду', 'Specializēta diēta', 'Uzturiet tīrību'],
      behavioral: ['Samaziniet stress faktorus', 'Nodrošiniet regulāru rutīnu', 'Palieliniet fizisko aktivitāti', 'Novērojiet izmaiņas'],
      general: ['Detalizēti aprakstiet visus novērotos simptomus', 'Fiksējiet simptomu ilgumu un intensitāti', 'Novērojiet ēšanas un dzeršanas paradumus']
    },
    urgencyLevels: {
      low: 'Novērojiet 24-48 stundas, ja simptomi nepasliktinās',
      medium: 'Konsultējieties ar veterinārārstu 1-2 dienu laikā',
      high: 'Vērsieties pie veterinārārsta šodien',
      emergency: 'Nekavējoties dodieties uz veterinārklīniku!'
    }
  },
  ru: {
    assessment: {
      skin: 'На основе описанных симптомов возможны проблемы с кожей.',
      digestive: 'Описанные симптомы указывают на возможные проблемы пищеварительной системы.',
      respiratory: 'Симптомы указывают на возможные проблемы дыхательной системы.',
      urinary: 'Описанные симптомы могут указывать на проблемы мочевыводящих путей.',
      behavioral: 'Наблюдаемые изменения в поведении могут указывать на различные проблемы со здоровьем.',
      general: 'Необходим более детальный анализ симптомов для точной диагностики.'
    },
    causes: {
      skin: ['Аллергические реакции', 'Паразитарные инфекции', 'Бактериальные или грибковые инфекции', 'Гормональный дисбаланс', 'Стресс или факторы окружающей среды'],
      digestive: ['Неправильное питание', 'Пищевые аллергии', 'Паразиты', 'Инфекции', 'Стресс'],
      respiratory: ['Аллергии', 'Инфекции', 'Внешние раздражители', 'Проблемы с сердцем', 'Обструкция дыхательных путей'],
      urinary: ['Инфекции мочевыводящих путей', 'Камни', 'Цистит', 'Проблемы с почками', 'Гормональные изменения'],
      behavioral: ['Стресс', 'Болезни', 'Изменения в окружающей среде', 'Возрастные изменения', 'Социальные факторы'],
      general: ['Различные факторы могут влиять на здоровье питомца', 'Необходима более детальная оценка симптомов']
    },
    recommendations: {
      skin: ['Поддерживайте чистую и сухую среду обитания', 'Избегайте известных аллергенов', 'Используйте мягкие шампуни', 'Наблюдайте за изменениями симптомов'],
      digestive: ['Кратковременное голодание', 'Постепенный переход на легкую диету', 'Обеспечьте достаточное количество жидкости', 'Избегайте нового корма'],
      respiratory: ['Обеспечьте чистый воздух', 'Избегайте раздражителей', 'Поддерживайте влажность в помещении', 'Наблюдайте за частотой дыхания'],
      urinary: ['Увеличьте потребление воды', 'Чаще предоставляйте возможность справить нужду', 'Специализированная диета', 'Поддерживайте чистоту'],
      behavioral: ['Уменьшите стресс-факторы', 'Обеспечьте регулярный режим', 'Увеличьте физическую активность', 'Наблюдайте за изменениями'],
      general: ['Детально опишите все наблюдаемые симптомы', 'Зафиксируйте продолжительность и интенсивность симптомов', 'Наблюдайте за привычками питания и питья']
    },
    urgencyLevels: {
      low: 'Наблюдайте 24-48 часов, если симптомы не ухудшаются',
      medium: 'Проконсультируйтесь с ветеринаром в течение 1-2 дней',
      high: 'Обратитесь к ветеринару сегодня',
      emergency: 'Немедленно обратитесь в ветеринарную клинику!'
    }
  },
  en: {
    assessment: {
      skin: 'Based on the described symptoms, skin problems are possible.',
      digestive: 'The described symptoms indicate possible digestive system problems.',
      respiratory: 'Symptoms indicate possible respiratory system problems.',
      urinary: 'The described symptoms may indicate urinary tract problems.',
      behavioral: 'Observed behavioral changes may indicate various health issues.',
      general: 'More detailed symptom analysis is needed for accurate diagnosis.'
    },
    causes: {
      skin: ['Allergic reactions', 'Parasitic infections', 'Bacterial or fungal infections', 'Hormonal imbalance', 'Stress or environmental factors'],
      digestive: ['Improper nutrition', 'Food allergies', 'Parasites', 'Infections', 'Stress'],
      respiratory: ['Allergies', 'Infections', 'External irritants', 'Heart problems', 'Airway obstruction'],
      urinary: ['Urinary tract infections', 'Stones', 'Cystitis', 'Kidney problems', 'Hormonal changes'],
      behavioral: ['Stress', 'Illness', 'Environmental changes', 'Age-related changes', 'Social factors'],
      general: ['Various factors can affect pet health', 'More detailed symptom assessment needed']
    },
    recommendations: {
      skin: ['Maintain clean and dry living environment', 'Avoid known allergens', 'Use gentle shampoos', 'Monitor symptom changes'],
      digestive: ['Short-term fasting', 'Gradual transition to bland diet', 'Ensure adequate fluid intake', 'Avoid new food'],
      respiratory: ['Provide clean air', 'Avoid irritants', 'Maintain room humidity', 'Monitor breathing rate'],
      urinary: ['Increase water intake', 'Provide frequent bathroom opportunities', 'Specialized diet', 'Maintain cleanliness'],
      behavioral: ['Reduce stress factors', 'Provide regular routine', 'Increase physical activity', 'Monitor changes'],
      general: ['Describe all observed symptoms in detail', 'Record symptom duration and intensity', 'Monitor eating and drinking habits']
    },
    urgencyLevels: {
      low: 'Monitor for 24-48 hours if symptoms don\'t worsen',
      medium: 'Consult with veterinarian within 1-2 days',
      high: 'See veterinarian today',
      emergency: 'Go to veterinary clinic immediately!'
    }
  }
};

export const generateTreatmentRecommendations = (
  _query: string, 
  species: PetSpecies, 
  symptomAnalysis: SymptomAnalysis,
  language: 'lv' | 'ru' | 'en' = 'lv'
): TreatmentRecommendation => {
  const t = responseTemplates[language];
  
  // Determine assessment based on symptom category
  const assessment = t.assessment[symptomAnalysis.category] || t.assessment.general;
  
  // Get possible causes
  const possibleCauses = t.causes[symptomAnalysis.category] || t.causes.general;
  
  // Get recommendations
  const recommendations = t.recommendations[symptomAnalysis.category] || t.recommendations.general;
  
  // Suggest medicines based on symptoms and species
  const suggestedMedicines: string[] = [];
  
  // Basic medicine suggestions based on symptom category
  switch (symptomAnalysis.category) {
    case 'skin':
      if (species === 'dog' || species === 'cat') {
        suggestedMedicines.push('chlorhexidine-shampoo', 'hydrocortisone-cream');
      }
      break;
    case 'digestive':
      if (species === 'dog' || species === 'cat') {
        suggestedMedicines.push('omeprazole', 'probiotics-paste');
      }
      break;
    case 'respiratory':
      if (species === 'bird') {
        suggestedMedicines.push('vitamin-a');
      }
      break;
  }
  
  // Dietary advice based on category
  const dietaryAdvice: string[] = [];
  if (symptomAnalysis.category === 'digestive') {
    if (language === 'lv') {
      dietaryAdvice.push('Viegla, viegli sagremojama barība', 'Mazas porcijas biežāk', 'Pietiekams ūdens daudzums');
    } else if (language === 'ru') {
      dietaryAdvice.push('Легкая, легко усваиваемая пища', 'Маленькие порции чаще', 'Достаточное количество воды');
    } else {
      dietaryAdvice.push('Light, easily digestible food', 'Small portions more frequently', 'Adequate water supply');
    }
  }
  
  // Determine urgency level
  let urgencyLevel: 'low' | 'medium' | 'high' | 'emergency' = 'medium';
  if (symptomAnalysis.urgencyLevel === 'emergency') {
    urgencyLevel = 'emergency';
  } else if (symptomAnalysis.urgencyLevel === 'high') {
    urgencyLevel = 'high';
  } else if (symptomAnalysis.urgencyLevel === 'low') {
    urgencyLevel = 'low';
  }
  
  const whenToSeeVet = t.urgencyLevels[urgencyLevel];
  
  return {
    assessment,
    possibleCauses,
    recommendations,
    suggestedMedicines,
    dietaryAdvice,
    urgencyLevel,
    whenToSeeVet
  };
};