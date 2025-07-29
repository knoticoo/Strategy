import { PetSpecies } from '../types';
import { vetDatabase } from './database/vetDatabase';
import { detectLanguage, getResponseTemplate, SupportedLanguage } from './languageDetector';
import { analyzeSymptoms } from './vetAdvice/symptomAnalyzer';
import { generateTreatmentRecommendations } from './vetAdvice/treatmentRecommendations';

// Multilingual pet species information
const getPetSpeciesInfo = (species: PetSpecies, _language: SupportedLanguage) => {
  const speciesData = {
    dog: {
      name: { lv: 'suns', ru: 'собака', en: 'dog' },
      commonIssues: { 
        lv: ['matu izkrišana', 'gremošanas problēmas', 'ādas kairinājums', 'ausu infekcijas'],
        ru: ['выпадение шерсти', 'проблемы пищеварения', 'раздражение кожи', 'ушные инфекции'],
        en: ['hair loss', 'digestive problems', 'skin irritation', 'ear infections']
      },
      avgWeight: { lv: '5-50kg', ru: '5-50кг', en: '5-50kg' },
      lifespan: { lv: '10-15 gadi', ru: '10-15 лет', en: '10-15 years' }
    },
    cat: {
      name: { lv: 'kaķis', ru: 'кошка', en: 'cat' },
      commonIssues: { 
        lv: ['urīnceļu problēmas', 'spalvas izkrišana', 'vemšana', 'zobu problēmas'],
        ru: ['проблемы мочевыводящих путей', 'выпадение шерсти', 'рвота', 'проблемы с зубами'],
        en: ['urinary problems', 'hair loss', 'vomiting', 'dental problems']
      },
      avgWeight: { lv: '3-7kg', ru: '3-7кг', en: '3-7kg' },
      lifespan: { lv: '12-18 gadi', ru: '12-18 лет', en: '12-18 years' }
    },
    bird: {
      name: { lv: 'putns', ru: 'птица', en: 'bird' },
      commonIssues: { 
        lv: ['elpošanas problēmas', 'spalvu izkrišana', 'uzvedības izmaiņas', 'knābja problēmas'],
        ru: ['проблемы дыхания', 'выпадение перьев', 'изменения поведения', 'проблемы с клювом'],
        en: ['breathing problems', 'feather loss', 'behavioral changes', 'beak problems']
      },
      avgWeight: { lv: '0.02-2kg', ru: '0.02-2кг', en: '0.02-2kg' },
      lifespan: { lv: '5-100 gadi', ru: '5-100 лет', en: '5-100 years' }
    },
    rabbit: {
      name: { lv: 'trusis', ru: 'кролик', en: 'rabbit' },
      commonIssues: { 
        lv: ['gremošanas traucējumi', 'zobu problēmas', 'ādas parazīti', 'urīnceļu infekcijas'],
        ru: ['расстройства пищеварения', 'проблемы с зубами', 'кожные паразиты', 'инфекции мочевыводящих путей'],
        en: ['digestive disorders', 'dental problems', 'skin parasites', 'urinary infections']
      },
      avgWeight: { lv: '1-5kg', ru: '1-5кг', en: '1-5kg' },
      lifespan: { lv: '8-12 gadi', ru: '8-12 лет', en: '8-12 years' }
    },
    hamster: {
      name: { lv: 'kāmis', ru: 'хомяк', en: 'hamster' },
      commonIssues: { 
        lv: ['mitrās astes', 'audzēji', 'ādas problēmas', 'zobu problēmas'],
        ru: ['мокрый хвост', 'опухоли', 'проблемы с кожей', 'проблемы с зубами'],
        en: ['wet tail', 'tumors', 'skin problems', 'dental problems']
      },
      avgWeight: { lv: '0.1-0.2kg', ru: '0.1-0.2кг', en: '0.1-0.2kg' },
      lifespan: { lv: '2-3 gadi', ru: '2-3 года', en: '2-3 years' }
    },
    guinea_pig: {
      name: { lv: 'jūras cūciņa', ru: 'морская свинка', en: 'guinea pig' },
      commonIssues: { 
        lv: ['C vitamīna trūkums', 'elpošanas problēmas', 'ādas problēmas', 'zobu problēmas'],
        ru: ['дефицит витамина C', 'проблемы дыхания', 'проблемы с кожей', 'проблемы с зубами'],
        en: ['vitamin C deficiency', 'breathing problems', 'skin problems', 'dental problems']
      },
      avgWeight: { lv: '0.7-1.2kg', ru: '0.7-1.2кг', en: '0.7-1.2kg' },
      lifespan: { lv: '4-8 gadi', ru: '4-8 лет', en: '4-8 years' }
    },
    fish: {
      name: { lv: 'zivs', ru: 'рыба', en: 'fish' },
      commonIssues: { 
        lv: ['ūdens kvalitātes problēmas', 'sēnīšu infekcijas', 'parazīti', 'uzvedības izmaiņas'],
        ru: ['проблемы качества воды', 'грибковые инфекции', 'паразиты', 'изменения поведения'],
        en: ['water quality issues', 'fungal infections', 'parasites', 'behavioral changes']
      },
      avgWeight: { lv: '0.001-10kg', ru: '0.001-10кг', en: '0.001-10kg' },
      lifespan: { lv: '1-20 gadi', ru: '1-20 лет', en: '1-20 years' }
    },
    reptile: {
      name: { lv: 'rāpulis', ru: 'рептилия', en: 'reptile' },
      commonIssues: { 
        lv: ['temperatūras regulācijas problēmas', 'ādas nomešanas problēmas', 'gremošanas traucējumi', 'metaboliskās slimības'],
        ru: ['проблемы терморегуляции', 'проблемы линьки', 'расстройства пищеварения', 'метаболические заболевания'],
        en: ['temperature regulation problems', 'shedding problems', 'digestive disorders', 'metabolic diseases']
      },
      avgWeight: { lv: '0.01-100kg', ru: '0.01-100кг', en: '0.01-100kg' },
      lifespan: { lv: '5-50 gadi', ru: '5-50 лет', en: '5-50 years' }
    }
  };

  return speciesData[species];
};

export const generateVetAdvice = async (query: string, species: PetSpecies): Promise<string> => {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Detect the language of the user's query
  const detectedLanguage = detectLanguage(query);
  
  // Search knowledge base for relevant information
  const knowledgeResults = vetDatabase.searchKnowledge(query, species);
  
  // Use traditional analysis as fallback
  const symptomAnalysis = analyzeSymptoms(query);
  const treatmentRecommendation = generateTreatmentRecommendations(query, species, symptomAnalysis);
  
  // Get species information in the detected language
  const speciesInfo = getPetSpeciesInfo(species, detectedLanguage);
  
  // Find relevant medicines using the database
  let relevantMedicines = vetDatabase.getEffectiveMedicines(
    knowledgeResults[0]?.conditions[0] || 'general', 
    species
  );
  
  // If no specific medicines found, use suggested medicines from treatment recommendation
  if (relevantMedicines.length === 0) {
    relevantMedicines = treatmentRecommendation.suggestedMedicines
      .map(id => vetDatabase.getAllMedicines().find(m => m.id === id))
      .filter(Boolean) as any[];
  }
  
  // Build response in the detected language
  let response = `${getResponseTemplate('assessment', detectedLanguage)}\n`;
  
  // Use knowledge base results if available, otherwise use traditional analysis
  if (knowledgeResults.length > 0) {
    const knowledge = knowledgeResults[0];
    response += `${knowledge.treatments.join(', ')}\n\n`;
    
    response += `${getResponseTemplate('possibleCauses', detectedLanguage)}\n`;
    knowledge.conditions.forEach((condition, index) => {
      response += `${index + 1}. ${condition}\n`;
    });
  } else {
    response += `${treatmentRecommendation.assessment}\n\n`;
    
    response += `${getResponseTemplate('possibleCauses', detectedLanguage)}\n`;
    treatmentRecommendation.possibleCauses.forEach((cause, index) => {
      response += `${index + 1}. ${cause}\n`;
    });
  }
  response += '\n';
  
  response += `${getResponseTemplate('recommendations', detectedLanguage)}\n`;
  treatmentRecommendation.recommendations.forEach((rec, index) => {
    response += `${index + 1}. ${rec}\n`;
  });
  response += '\n';
  
  if (relevantMedicines.length > 0) {
    response += `${getResponseTemplate('suggestedMedicines', detectedLanguage)}\n`;
    relevantMedicines.slice(0, 3).forEach(medicine => { // Limit to top 3 medicines
      response += `• **${medicine.name}**: ${medicine.description}\n`;
      if (medicine.dosage[species]) {
        response += `  ${getResponseTemplate('dosage', detectedLanguage)} ${medicine.dosage[species]}\n`;
      }
    });
    response += '\n';
  }
  
  if (treatmentRecommendation.dietaryAdvice.length > 0) {
    response += `${getResponseTemplate('dietaryAdvice', detectedLanguage)}\n`;
    treatmentRecommendation.dietaryAdvice.forEach((diet, index) => {
      response += `${index + 1}. ${diet}\n`;
    });
    response += '\n';
  }
  
  // Add urgency indicator
  const urgencyEmoji = {
    low: '🟢',
    medium: '🟡', 
    high: '🟠',
    emergency: '🔴'
  };
  
  const urgency = knowledgeResults[0]?.urgency || treatmentRecommendation.urgencyLevel;
  response += `${urgencyEmoji[urgency]} ${getResponseTemplate('whenToSeeVet', detectedLanguage)}\n${treatmentRecommendation.whenToSeeVet}\n\n`;
  
  // Add species-specific information
  response += `${getResponseTemplate('petInfo', detectedLanguage)} ${speciesInfo.name[detectedLanguage].toUpperCase()}**\n`;
  response += `• ${getResponseTemplate('avgWeight', detectedLanguage)} ${speciesInfo.avgWeight[detectedLanguage]}\n`;
  response += `• ${getResponseTemplate('lifespan', detectedLanguage)} ${speciesInfo.lifespan[detectedLanguage]}\n`;
  response += `• ${getResponseTemplate('commonIssues', detectedLanguage)} ${speciesInfo.commonIssues[detectedLanguage].join(', ')}\n\n`;
  
  // Add warning in the detected language
  response += getResponseTemplate('warning', detectedLanguage);
  
  // Learn from this query
  vetDatabase.learnFromQuery({
    id: `query-${Date.now()}`,
    query,
    language: detectedLanguage,
    species,
    timestamp: new Date(),
    response
  });
  
  return response;
};