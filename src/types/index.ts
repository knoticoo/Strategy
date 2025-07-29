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
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  petContext?: {
    species: PetSpecies;
    symptoms: string[];
  };
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
  imageUrl?: string;
}

export type MedicineCategory = 'antibiotics' | 'painkillers' | 'vitamins' | 'food' | 'supplements' | 'antiparasitic' | 'digestive' | 'skin_care';

export interface VetAdvice {
  symptoms: string[];
  possibleCauses: string[];
  recommendedActions: string[];
  urgencyLevel: 'low' | 'medium' | 'high' | 'emergency';
  recommendedMedicines?: string[];
  dietaryRecommendations?: string[];
  whenToSeeVet: string;
}

export interface EmergencySymptom {
  id: string;
  name: string;
  description: string;
  species: PetSpecies[];
  urgency: 'high' | 'emergency';
}

export interface SearchFilters {
  category?: MedicineCategory;
  species?: PetSpecies;
  prescriptionRequired?: boolean;
  query?: string;
}

export interface AppState {
  currentLanguage: 'lv' | 'ru';
  pets: Pet[];
  chatHistory: ChatMessage[];
  favorites: string[];
}