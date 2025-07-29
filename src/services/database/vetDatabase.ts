// Comprehensive Veterinary Database with Learning Capabilities

import { Medicine, PetSpecies } from '../../types';
import { medicinesDatabase } from '../../data/medicines';

// Database interfaces
export interface VetKnowledge {
  id: string;
  symptoms: string[];
  conditions: string[];
  treatments: string[];
  medicines: string[];
  species: PetSpecies[];
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  sources: string[];
  lastUpdated: Date;
  confidence: number; // 0-1 scale
}

export interface UserQuery {
  id: string;
  query: string;
  language: 'lv' | 'ru' | 'en';
  species: PetSpecies;
  timestamp: Date;
  response: string;
  userFeedback?: 'helpful' | 'not_helpful';
}

export interface LearningData {
  symptomPatterns: Record<string, string[]>;
  treatmentOutcomes: Record<string, number>;
  commonQueries: Record<string, number>;
  medicineEffectiveness: Record<string, Record<PetSpecies, number>>;
}

class VeterinaryDatabase {
  private knowledge: VetKnowledge[] = [];
  private queryHistory: UserQuery[] = [];
  private learningData: LearningData = {
    symptomPatterns: {},
    treatmentOutcomes: {},
    commonQueries: {},
    medicineEffectiveness: {}
  };

  constructor() {
    this.initializeBaseKnowledge();
  }

  private initializeBaseKnowledge() {
    // Initialize with comprehensive veterinary knowledge
    const baseKnowledge: VetKnowledge[] = [
      {
        id: 'skin-issues-dogs',
        symptoms: ['hair loss', 'itching', 'scratching', 'red skin', 'rash', 'matu izkrišana', 'nieze', 'sarkana āda', 'выпадение шерсти', 'зуд', 'красная кожа'],
        conditions: ['dermatitis', 'allergies', 'fungal infection', 'bacterial infection', 'parasites'],
        treatments: ['medicated shampoo', 'topical antibiotics', 'antihistamines', 'dietary changes'],
        medicines: ['chlorhexidine-shampoo', 'ketoconazole-shampoo', 'hydrocortisone-cream'],
        species: ['dog', 'cat'],
        urgency: 'medium',
        sources: ['veterinary-manual', 'clinical-studies'],
        lastUpdated: new Date(),
        confidence: 0.9
      },
      {
        id: 'digestive-issues',
        symptoms: ['vomiting', 'diarrhea', 'loss of appetite', 'stomach pain', 'vemšana', 'caureja', 'apetītes zudums', 'рвота', 'диарея', 'потеря аппетита'],
        conditions: ['gastroenteritis', 'food poisoning', 'intestinal parasites', 'dietary indiscretion'],
        treatments: ['fasting', 'bland diet', 'probiotics', 'fluid therapy'],
        medicines: ['omeprazole', 'famotidine', 'probiotics-paste', 'digestive-enzymes'],
        species: ['dog', 'cat', 'rabbit'],
        urgency: 'medium',
        sources: ['veterinary-manual', 'clinical-studies'],
        lastUpdated: new Date(),
        confidence: 0.85
      },
      {
        id: 'respiratory-emergency',
        symptoms: ['difficulty breathing', 'gasping', 'blue gums', 'collapse', 'elpošanas grūtības', 'zilganas smaganas', 'затрудненное дыхание', 'синие десны'],
        conditions: ['pneumonia', 'heart failure', 'airway obstruction', 'allergic reaction'],
        treatments: ['immediate veterinary care', 'oxygen therapy', 'emergency medication'],
        medicines: ['emergency-contact'],
        species: ['dog', 'cat', 'bird', 'rabbit'],
        urgency: 'emergency',
        sources: ['emergency-protocols'],
        lastUpdated: new Date(),
        confidence: 1.0
      },
      {
        id: 'urinary-issues-cats',
        symptoms: ['frequent urination', 'blood in urine', 'straining', 'litter box avoidance', 'biežas urināšanas', 'asinis urīnā', 'частое мочеиспускание', 'кровь в моче'],
        conditions: ['urinary tract infection', 'bladder stones', 'feline idiopathic cystitis'],
        treatments: ['increased water intake', 'special diet', 'antibiotics', 'pain management'],
        medicines: ['cranberry-extract', 'meloxicam', 'amoxicillin'],
        species: ['cat'],
        urgency: 'high',
        sources: ['feline-medicine-textbook'],
        lastUpdated: new Date(),
        confidence: 0.9
      },
      {
        id: 'bird-respiratory',
        symptoms: ['wheezing', 'tail bobbing', 'open mouth breathing', 'discharge from nostrils', 'elpošanas skaņas', 'дыхание с открытым клювом'],
        conditions: ['respiratory infection', 'air sac infection', 'aspergillosis'],
        treatments: ['environmental humidity', 'antifungal medication', 'supportive care'],
        medicines: ['ketoconazole', 'vitamin-a', 'probiotics'],
        species: ['bird'],
        urgency: 'high',
        sources: ['avian-veterinary-manual'],
        lastUpdated: new Date(),
        confidence: 0.8
      }
    ];

    this.knowledge = baseKnowledge;
  }

  // Search knowledge base
  public searchKnowledge(query: string, species?: PetSpecies): VetKnowledge[] {
    const queryLower = query.toLowerCase();
    
    return this.knowledge
      .filter(knowledge => {
        // Check species match
        if (species && !knowledge.species.includes(species)) return false;
        
        // Check symptom matches
        const symptomMatch = knowledge.symptoms.some(symptom => 
          queryLower.includes(symptom.toLowerCase()) || 
          symptom.toLowerCase().includes(queryLower)
        );
        
        // Check condition matches
        const conditionMatch = knowledge.conditions.some(condition =>
          queryLower.includes(condition.toLowerCase()) ||
          condition.toLowerCase().includes(queryLower)
        );
        
        return symptomMatch || conditionMatch;
      })
      .sort((a, b) => b.confidence - a.confidence); // Sort by confidence
  }

  // Get medicines by effectiveness for species
  public getEffectiveMedicines(condition: string, species: PetSpecies): Medicine[] {
    const relevantKnowledge = this.knowledge.filter(k => 
      k.conditions.some(c => c.toLowerCase().includes(condition.toLowerCase())) &&
      k.species.includes(species)
    );

    const medicineIds = relevantKnowledge.flatMap(k => k.medicines);
    
    return medicinesDatabase.filter(medicine => 
      medicineIds.some(id => medicine.id.includes(id.replace('-', '')) || medicine.name.toLowerCase().includes(id.replace('-', ' '))) &&
      medicine.forSpecies.includes(species)
    );
  }

  // Learn from user interactions
  public learnFromQuery(query: UserQuery) {
    this.queryHistory.push(query);
    
    // Update common queries
    const queryKey = query.query.toLowerCase().trim();
    this.learningData.commonQueries[queryKey] = (this.learningData.commonQueries[queryKey] || 0) + 1;
    
    // Extract patterns for learning
    this.extractPatternsFromQuery(query);
  }

  private extractPatternsFromQuery(query: UserQuery) {
    const words = query.query.toLowerCase().split(/\s+/);
    
    // Look for symptom patterns
    const symptomWords = words.filter(word => 
      ['болит', 'sāp', 'hurts', 'pain', 'проблема', 'problēma', 'problem', 'болен', 'slims', 'sick'].includes(word)
    );
    
    if (symptomWords.length > 0) {
      const context = words.join(' ');
      if (!this.learningData.symptomPatterns[context]) {
        this.learningData.symptomPatterns[context] = [];
      }
      this.learningData.symptomPatterns[context].push(query.species);
    }
  }

  // Get learning insights
  public getLearningInsights() {
    return {
      totalQueries: this.queryHistory.length,
      mostCommonQueries: Object.entries(this.learningData.commonQueries)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10),
      knowledgeBaseSize: this.knowledge.length,
      averageConfidence: this.knowledge.reduce((sum, k) => sum + k.confidence, 0) / this.knowledge.length
    };
  }

  // Add new knowledge (learning capability)
  public addKnowledge(knowledge: Omit<VetKnowledge, 'id' | 'lastUpdated'>) {
    const newKnowledge: VetKnowledge = {
      ...knowledge,
      id: `learned-${Date.now()}`,
      lastUpdated: new Date()
    };
    
    this.knowledge.push(newKnowledge);
  }

  // Update knowledge confidence based on feedback
  public updateKnowledgeConfidence(knowledgeId: string, feedback: 'helpful' | 'not_helpful') {
    const knowledge = this.knowledge.find(k => k.id === knowledgeId);
    if (knowledge) {
      if (feedback === 'helpful') {
        knowledge.confidence = Math.min(1.0, knowledge.confidence + 0.1);
      } else {
        knowledge.confidence = Math.max(0.1, knowledge.confidence - 0.1);
      }
      knowledge.lastUpdated = new Date();
    }
  }

  // Get all medicines with enhanced search
  public getAllMedicines(): Medicine[] {
    return medicinesDatabase;
  }

  // Advanced medicine search with learning
  public searchMedicinesAdvanced(query: string, filters?: { species?: PetSpecies; category?: string }): Medicine[] {
    let results = medicinesDatabase;

    // Apply species filter
    if (filters?.species) {
      results = results.filter(medicine => medicine.forSpecies.includes(filters.species!));
    }

    // Apply category filter
    if (filters?.category && filters.category !== 'all') {
      results = results.filter(medicine => medicine.category === filters.category);
    }

    // Apply query filter
    if (query.trim()) {
      const queryLower = query.toLowerCase();
      results = results.filter(medicine =>
        medicine.name.toLowerCase().includes(queryLower) ||
        medicine.description.toLowerCase().includes(queryLower) ||
        medicine.usage.toLowerCase().includes(queryLower) ||
        medicine.ingredients.some(ing => ing.toLowerCase().includes(queryLower))
      );
    }

    return results;
  }
}

// Singleton instance
export const vetDatabase = new VeterinaryDatabase();