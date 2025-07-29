import { PetSpecies } from '../types';
import { searchMedicines } from '../data/medicines';
import { analyzeSymptoms } from './vetAdvice/symptomAnalyzer';
import { generateTreatmentRecommendations } from './vetAdvice/treatmentRecommendations';

const petSpeciesInfo = {
  dog: {
    name: 'suns',
    commonIssues: ['matu izkrišana', 'gremošanas problēmas', 'ādas kairinājums', 'ausu infekcijas'],
    avgWeight: '5-50kg',
    lifespan: '10-15 gadi'
  },
  cat: {
    name: 'kaķis',
    commonIssues: ['urīnceļu problēmas', 'spalvas izkrišana', 'vemšana', 'zobu problēmas'],
    avgWeight: '3-7kg',
    lifespan: '12-18 gadi'
  },
  bird: {
    name: 'putns',
    commonIssues: ['elpošanas problēmas', 'spalvu izkrišana', 'uzvedības izmaiņas', 'knābja problēmas'],
    avgWeight: '0.02-2kg',
    lifespan: '5-100 gadi'
  },
  rabbit: {
    name: 'trusis',
    commonIssues: ['gremošanas traucējumi', 'zobu problēmas', 'ādas parazīti', 'urīnceļu infekcijas'],
    avgWeight: '1-5kg',
    lifespan: '8-12 gadi'
  },
  hamster: {
    name: 'kāmis',
    commonIssues: ['mitrās astes', 'audzēji', 'ādas problēmas', 'zobu problēmas'],
    avgWeight: '0.1-0.2kg',
    lifespan: '2-3 gadi'
  },
  guinea_pig: {
    name: 'jūras cūciņa',
    commonIssues: ['C vitamīna trūkums', 'elpošanas problēmas', 'ādas problēmas', 'zobu problēmas'],
    avgWeight: '0.7-1.2kg',
    lifespan: '4-8 gadi'
  },
  fish: {
    name: 'zivs',
    commonIssues: ['ūdens kvalitātes problēmas', 'sēnīšu infekcijas', 'parazīti', 'uzvedības izmaiņas'],
    avgWeight: '0.001-10kg',
    lifespan: '1-20 gadi'
  },
  reptile: {
    name: 'rāpulis',
    commonIssues: ['ādas nomešanas problēmas', 'metaboliskas kaulu slimības', 'parazīti', 'temperatūras stress'],
    avgWeight: '0.01-100kg',
    lifespan: '5-50 gadi'
  }
};

export const generateVetAdvice = async (query: string, species: PetSpecies): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Analyze symptoms using the new modular system
  const symptomAnalysis = analyzeSymptoms(query);
  const treatmentRecommendation = generateTreatmentRecommendations(query, species, symptomAnalysis);
  const speciesInfo = petSpeciesInfo[species];
  
  // Find relevant medicines
  const relevantMedicines = treatmentRecommendation.suggestedMedicines
    .map(id => searchMedicines('', { species }).find(m => m.id === id))
    .filter(Boolean);
  
  // Format the response
  let response = `🔍 **NOVĒRTĒJUMS**\n${treatmentRecommendation.assessment}\n\n`;
  
  response += `🎯 **IESPĒJAMIE IEMESLI**\n`;
  treatmentRecommendation.possibleCauses.forEach((cause, index) => {
    response += `${index + 1}. ${cause}\n`;
  });
  response += '\n';
  
  response += `💡 **IETEIKUMI**\n`;
  treatmentRecommendation.recommendations.forEach((rec, index) => {
    response += `${index + 1}. ${rec}\n`;
  });
  response += '\n';
  
  if (relevantMedicines.length > 0) {
    response += `💊 **IETEICAMIE PREPARĀTI**\n`;
    relevantMedicines.forEach(medicine => {
      response += `• **${medicine!.name}**: ${medicine!.description}\n`;
      if (medicine!.dosage[species]) {
        response += `  Deva: ${medicine!.dosage[species]}\n`;
      }
    });
    response += '\n';
  }
  
  if (treatmentRecommendation.dietaryAdvice.length > 0) {
    response += `🍽️ **UZTURA IETEIKUMI**\n`;
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
  
  response += `${urgencyEmoji[treatmentRecommendation.urgencyLevel]} **KAD VĒRSTIES PIE VETERINĀRĀRSTA**\n${treatmentRecommendation.whenToSeeVet}\n\n`;
  
  response += `📋 **SVARĪGA INFORMĀCIJA PAR ${speciesInfo.name.toUpperCase()}**\n`;
  response += `• Vidējais svars: ${speciesInfo.avgWeight}\n`;
  response += `• Vidējais dzīves ilgums: ${speciesInfo.lifespan}\n`;
  response += `• Biežākās problēmas: ${speciesInfo.commonIssues.join(', ')}\n\n`;
  
  response += `⚠️ **SVARĪGI**: Šī informācija ir tikai informatīviem nolūkiem un neaizstāj profesionālu veterinārārsta konsultāciju. Nopietnu simptomu gadījumā nekavējoties vērsieties pie speciālista!`;
  
  return response;
};