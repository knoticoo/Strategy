import { PetSpecies } from '../types';
import { searchMedicines } from '../data/medicines';

// This is a mock AI service that provides structured veterinary advice
// In a real application, you would integrate with OpenAI API or another AI service

interface VetAdviceResponse {
  assessment: string;
  possibleCauses: string[];
  recommendations: string[];
  urgencyLevel: 'low' | 'medium' | 'high';
  suggestedMedicines: string[];
  dietaryAdvice: string[];
  whenToSeeVet: string;
}

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

const generateStructuredAdvice = (query: string, species: PetSpecies): VetAdviceResponse => {
  const lowerQuery = query.toLowerCase();
  const speciesInfo = petSpeciesInfo[species];
  
  // Analyze symptoms from query
  const symptoms = extractSymptoms(lowerQuery);
  const urgency = assessUrgency(symptoms);
  
  // Generate contextual advice based on species and symptoms
  let assessment = `Pamatojoties uz jūsu aprakstu par ${speciesInfo.name}, `;
  let possibleCauses: string[] = [];
  let recommendations: string[] = [];
  let suggestedMedicines: string[] = [];
  let dietaryAdvice: string[] = [];
  
  // Hair loss / Fur loss
  if (lowerQuery.includes('mati') || lowerQuery.includes('spalva') || lowerQuery.includes('izkrišana') || 
      lowerQuery.includes('шерсть') || lowerQuery.includes('выпадает')) {
    assessment += 'šķiet, ka jūsu mājdzīvniekam ir matu/spalvas izkrišanas problēmas.';
    possibleCauses = [
      'Alerģiskas reakcijas (pārtika, vides faktori)',
      'Parazīti (bluses, ērces, ādas ērces)',
      'Hormonu disbalanss',
      'Stress vai uzvedības problēmas',
      'Sēnīšu vai bakteriālu infekciju',
      'Uztura trūkums (omega-3, vitamīni)'
    ];
    recommendations = [
      'Pārbaudiet, vai nav parazītu (bluses, ērces)',
      'Novērtējiet pēdējās izmaiņas uzturā vai vidē',
      'Nodrošiniet kvalitatīvu uzturu ar omega-3 taukskābēm',
      'Maziniet stresa faktorus',
      'Regulāri ķemmējiet un pārbaudiet ādu'
    ];
    suggestedMedicines = ['omega-3', 'frontline-plus', 'chlorhexidine-shampoo'];
    dietaryAdvice = [
      'Pievienojiet omega-3 taukskābes uzturā',
      'Izvairieties no zināmiem alerģēniem',
      'Nodrošiniet augstas kvalitātes olbaltumvielas'
    ];
  }
  
  // Appetite problems
  else if (lowerQuery.includes('neēd') || lowerQuery.includes('apetīte') || lowerQuery.includes('не ест') || 
           lowerQuery.includes('аппетит')) {
    assessment += 'ir novērojamas ēšanas problēmas.';
    possibleCauses = [
      'Stress vai vides izmaiņas',
      'Zobu vai mutes dobuma problēmas',
      'Gremošanas sistēmas traucējumi',
      'Infekcijas slimības',
      'Barības kvalitātes problēmas',
      'Sāpes vai diskomforts'
    ];
    recommendations = [
      'Pārbaudiet mutes dobumu un zobus',
      'Piedāvājiet dažādas barības iespējas',
      'Nodrošiniet klusu, drošu ēšanas vietu',
      'Uzraugiet citus simptomus (vemšana, caureja)',
      'Pārbaudiet barības derīguma termiņu'
    ];
    suggestedMedicines = ['probiotics-paste', 'vitamin-b-complex'];
    dietaryAdvice = [
      'Piedāvājiet mazas, biežas porcijas',
      'Izmēģiniet dažādas barības tekstūras',
      'Nodrošiniet tīru, svaigu ūdeni'
    ];
  }
  
  // Behavioral changes
  else if (lowerQuery.includes('uzvedība') || lowerQuery.includes('kluss') || lowerQuery.includes('guļ') ||
           lowerQuery.includes('поведение') || lowerQuery.includes('тихий') || lowerQuery.includes('спит')) {
    assessment += 'ir novērojamas uzvedības izmaiņas.';
    possibleCauses = [
      'Slimība vai sāpes',
      'Stress vai trauksme',
      'Vides izmaiņas',
      'Vecuma saistītas izmaiņas',
      'Hormonu izmaiņas',
      'Neirologiskas problēmas'
    ];
    recommendations = [
      'Novērojiet citus simptomus (ēšana, dzeršana, kustības)',
      'Nodrošiniet klusu, drošu vidi',
      'Saglabājiet ierasto rutīnu',
      'Pārbaudiet, vai nav fizisko sāpju pazīmju',
      'Dokumentējiet uzvedības izmaiņas'
    ];
    suggestedMedicines = ['vitamin-b-complex'];
    dietaryAdvice = [
      'Nodrošiniet viegli sagremojamu barību',
      'Pievienojiet probiotikus stresa mazināšanai'
    ];
  }
  
  // General advice if no specific symptoms detected
  else {
    assessment += 'ir nepieciešama sīkāka analīze.';
    possibleCauses = [
      'Dažādi faktori var ietekmēt mājdzīvnieka veselību',
      'Nepieciešama detalizētāka simptomu novērtēšana'
    ];
    recommendations = [
      'Detalizēti aprakstiet visus novērotos simptomus',
      'Fiksējiet simptomu ilgumu un intensitāti',
      'Novērtējiet ēšanas un dzeršanas paradumus',
      'Pārbaudiet fizisko aktivitāti'
    ];
    suggestedMedicines = ['vitamin-b-complex'];
    dietaryAdvice = ['Nodrošiniet kvalitatīvu, sabalansētu uzturu'];
  }
  
  const whenToSeeVet = urgency === 'high' ? 
    'Nekavējoties vērsieties pie veterinārārsta!' :
    urgency === 'medium' ?
    'Ieteicams konsultēties ar veterinārārstu 1-2 dienu laikā.' :
    'Ja simptomi turpinās vai pasliktinās, konsultējieties ar veterinārārstu.';
  
  return {
    assessment,
    possibleCauses,
    recommendations,
    urgencyLevel: urgency,
    suggestedMedicines,
    dietaryAdvice,
    whenToSeeVet
  };
};

const extractSymptoms = (query: string): string[] => {
  const symptoms: string[] = [];
  
  const symptomKeywords = [
    { keywords: ['mati', 'spalva', 'izkrišana', 'шерсть', 'выпадает'], symptom: 'hair_loss' },
    { keywords: ['neēd', 'apetīte', 'не ест', 'аппетит'], symptom: 'appetite_loss' },
    { keywords: ['vemšana', 'vem', 'рвота', 'тошнота'], symptom: 'vomiting' },
    { keywords: ['caureja', 'понос', 'диарея'], symptom: 'diarrhea' },
    { keywords: ['kluss', 'guļ', 'тихий', 'спит'], symptom: 'lethargy' },
    { keywords: ['klepus', 'кашель'], symptom: 'coughing' },
    { keywords: ['sāpes', 'боль'], symptom: 'pain' }
  ];
  
  symptomKeywords.forEach(item => {
    if (item.keywords.some(keyword => query.includes(keyword))) {
      symptoms.push(item.symptom);
    }
  });
  
  return symptoms;
};

const assessUrgency = (symptoms: string[]): 'low' | 'medium' | 'high' => {
  const highUrgencySymptoms = ['vomiting', 'diarrhea', 'pain'];
  const mediumUrgencySymptoms = ['appetite_loss', 'lethargy', 'coughing'];
  
  if (symptoms.some(s => highUrgencySymptoms.includes(s))) return 'high';
  if (symptoms.some(s => mediumUrgencySymptoms.includes(s))) return 'medium';
  return 'low';
};

export const generateVetAdvice = async (query: string, species: PetSpecies): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const advice = generateStructuredAdvice(query, species);
  const speciesInfo = petSpeciesInfo[species];
  
  // Find relevant medicines
  const relevantMedicines = advice.suggestedMedicines
    .map(id => searchMedicines('', { species }).find(m => m.id === id))
    .filter(Boolean);
  
  // Format the response
  let response = `🔍 **NOVĒRTĒJUMS**\n${advice.assessment}\n\n`;
  
  response += `🎯 **IESPĒJAMIE IEMESLI**\n`;
  advice.possibleCauses.forEach((cause, index) => {
    response += `${index + 1}. ${cause}\n`;
  });
  response += '\n';
  
  response += `💡 **IETEIKUMI**\n`;
  advice.recommendations.forEach((rec, index) => {
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
  
  if (advice.dietaryAdvice.length > 0) {
    response += `🍽️ **UZTURA IETEIKUMI**\n`;
    advice.dietaryAdvice.forEach((diet, index) => {
      response += `${index + 1}. ${diet}\n`;
    });
    response += '\n';
  }
  
  response += `⚠️ **KAD VĒRSTIES PIE VETERINĀRĀRSTA**\n${advice.whenToSeeVet}\n\n`;
  
  response += `📋 **SVARĪGA INFORMĀCIJA PAR ${speciesInfo.name.toUpperCase()}**\n`;
  response += `• Vidējais svars: ${speciesInfo.avgWeight}\n`;
  response += `• Vidējais dzīves ilgums: ${speciesInfo.lifespan}\n`;
  response += `• Biežākās problēmas: ${speciesInfo.commonIssues.join(', ')}\n\n`;
  
  response += `⚠️ **SVARĪGI**: Šī informācija ir tikai informatīviem nolūkiem un neaizstāj profesionālu veterinārārsta konsultāciju. Nopietnu simptomu gadījumā nekavējoties vērsieties pie speciālista!`;
  
  return response;
};