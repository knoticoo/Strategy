// Symptom analysis utilities

export interface SymptomAnalysis {
  symptoms: string[];
  urgencyLevel: 'low' | 'medium' | 'high' | 'emergency';
  category: 'skin' | 'digestive' | 'respiratory' | 'behavioral' | 'urinary' | 'general';
}

export const extractSymptoms = (query: string): string[] => {
  const symptoms: string[] = [];
  
  const symptomKeywords = [
    { keywords: ['mati', 'spalva', 'izkrišana', 'шерсть', 'выпадает'], symptom: 'hair_loss' },
    { keywords: ['neēd', 'apetīte', 'не ест', 'аппетит'], symptom: 'appetite_loss' },
    { keywords: ['vemšana', 'vem', 'рвота', 'тошнота'], symptom: 'vomiting' },
    { keywords: ['caureja', 'понос', 'диарея'], symptom: 'diarrhea' },
    { keywords: ['kluss', 'guļ', 'тихий', 'спит'], symptom: 'lethargy' },
    { keywords: ['klepus', 'кашель'], symptom: 'coughing' },
    { keywords: ['sāpes', 'боль'], symptom: 'pain' },
    { keywords: ['karstums', 'drudzis', 'температура', 'жар'], symptom: 'fever' },
    { keywords: ['niez', 'kasās', 'зуд', 'чешется'], symptom: 'itching' },
    { keywords: ['elpošana', 'elpo', 'дыхание', 'дышит'], symptom: 'breathing' },
    { keywords: ['urīns', 'čurā', 'моча', 'мочится'], symptom: 'urination' },
    { keywords: ['acis', 'глаза'], symptom: 'eyes' },
    { keywords: ['ausis', 'уши'], symptom: 'ears' },
    { keywords: ['zobi', 'зубы'], symptom: 'teeth' },
    { keywords: ['pincis', 'хромает'], symptom: 'limping' }
  ];
  
  const lowerQuery = query.toLowerCase();
  symptomKeywords.forEach(item => {
    if (item.keywords.some(keyword => lowerQuery.includes(keyword))) {
      symptoms.push(item.symptom);
    }
  });
  
  return symptoms;
};

export const assessUrgency = (symptoms: string[]): 'low' | 'medium' | 'high' | 'emergency' => {
  const emergencySymptoms = ['breathing', 'fever', 'pain', 'vomiting'];
  const highUrgencySymptoms = ['diarrhea', 'lethargy', 'urination'];
  const mediumUrgencySymptoms = ['appetite_loss', 'coughing', 'eyes', 'ears'];
  
  if (symptoms.some(s => emergencySymptoms.includes(s))) return 'emergency';
  if (symptoms.some(s => highUrgencySymptoms.includes(s))) return 'high';
  if (symptoms.some(s => mediumUrgencySymptoms.includes(s))) return 'medium';
  return 'low';
};

export const categorizeSymptoms = (symptoms: string[]): 'skin' | 'digestive' | 'respiratory' | 'behavioral' | 'urinary' | 'general' => {
  const skinSymptoms = ['hair_loss', 'itching'];
  const digestiveSymptoms = ['vomiting', 'diarrhea', 'appetite_loss'];
  const respiratorySymptoms = ['coughing', 'breathing'];
  const behavioralSymptoms = ['lethargy'];
  const urinarySymptoms = ['urination'];
  
  if (symptoms.some(s => skinSymptoms.includes(s))) return 'skin';
  if (symptoms.some(s => digestiveSymptoms.includes(s))) return 'digestive';
  if (symptoms.some(s => respiratorySymptoms.includes(s))) return 'respiratory';
  if (symptoms.some(s => behavioralSymptoms.includes(s))) return 'behavioral';
  if (symptoms.some(s => urinarySymptoms.includes(s))) return 'urinary';
  return 'general';
};

export const analyzeSymptoms = (query: string): SymptomAnalysis => {
  const symptoms = extractSymptoms(query);
  const urgencyLevel = assessUrgency(symptoms);
  const category = categorizeSymptoms(symptoms);
  
  return {
    symptoms,
    urgencyLevel,
    category
  };
};