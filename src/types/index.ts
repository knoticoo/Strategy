export interface Pet {
  id: string;
  name: string;
  species: PetSpecies;
  breed?: string;
  age: number;
  weight?: number;
  medicalHistory: string[];
  allergies: string[];
  currentMedications: string[];
  createdAt: string;
}

export type PetSpecies = 'dog' | 'cat' | 'bird' | 'rabbit' | 'hamster' | 'guinea_pig' | 'fish' | 'reptile';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Medicine {
  id: string;
  name: string;
  category: MedicineCategory;
  description: string;
  usage: string;
  dosage: {
    [key in PetSpecies]?: string;
  };
  sideEffects: string[];
  contraindications: string[];
  ingredients: string[];
  forSpecies: PetSpecies[];
  prescriptionRequired: boolean;
}

export type MedicineCategory = 'antibiotics' | 'painkillers' | 'vitamins' | 'food' | 'supplements' | 'antiparasitic' | 'digestive' | 'skin_care';

export interface VetAdvice {
  assessment: string;
  recommendations: string[];
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  followUp?: string;
}

export interface EmergencySymptom {
  keyword: string;
  severity: 'high' | 'critical';
  advice: string;
}

export interface SearchFilters {
  category?: MedicineCategory;
  species?: PetSpecies;
  prescriptionOnly?: boolean;
}

export interface AppState {
  selectedLanguage: 'lv' | 'ru' | 'en';
  currentPet?: PetSpecies;
  chatHistory: ChatMessage[];
}