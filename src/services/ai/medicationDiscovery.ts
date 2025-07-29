// Automatic medication discovery and integration system

import { Medicine, PetSpecies, MedicineCategory } from '../../types';
import { veterinaryWebScraper, ScrapedData } from './webScraper';
import { veterinaryTranslator } from './translator';
import { vetDatabase } from '../database/vetDatabase';

export interface DiscoveredMedication {
  name: string;
  description: {
    lv: string;
    ru: string;
    en: string;
  };
  usage: {
    lv: string;
    ru: string;
    en: string;
  };
  dosage: {
    [key in PetSpecies]?: {
      lv: string;
      ru: string;
      en: string;
    };
  };
  sideEffects: Array<{
    lv: string;
    ru: string;
    en: string;
  }>;
  contraindications: Array<{
    lv: string;
    ru: string;
    en: string;
  }>;
  ingredients: Array<{
    lv: string;
    ru: string;
    en: string;
  }>;
  forSpecies: PetSpecies[];
  category: MedicineCategory;
  prescriptionRequired: boolean;
  confidence: number;
  sources: string[];
}

class MedicationDiscoveryEngine {
  private discoveryHistory: Map<string, DiscoveredMedication> = new Map();
  private lastDiscovery: Date = new Date();
  private readonly DISCOVERY_INTERVAL = 6 * 60 * 60 * 1000; // 6 hours

  // Medication name patterns to identify in text
  private medicationPatterns = {
    en: [
      /\b([A-Z][a-z]+(?:cillin|mycin|zole|prazole|dine|sine|ine|ol|al))\b/g, // Common drug suffixes
      /\b(Amoxicillin|Doxycycline|Prednisolone|Meloxicam|Gabapentin|Tramadol|Furosemide|Enalapril|Digoxin|Insulin)\b/gi,
      /\b([A-Z][a-z]+ (?:tablets?|capsules?|drops?|cream|ointment|injection|solution))\b/gi,
      /\b(Frontline|Advantage|Revolution|Heartgard|NexGard|Bravecto|Seresto)\b/gi // Brand names
    ],
    ru: [
      /\b([А-Я][а-я]+(?:циллин|мицин|зол|празол|дин|син|ин|ол|ал))\b/g,
      /\b(Амоксициллин|Доксициклин|Преднизолон|Мелоксикам|Габапентин|Трамадол|Фуросемид|Эналаприл|Дигоксин|Инсулин)\b/gi,
      /\b([А-Я][а-я]+ (?:таблетки|капсулы|капли|крем|мазь|инъекция|раствор))\b/gi
    ],
    lv: [
      /\b([A-Z][a-z]+(?:cilīns|micīns|zols|prazols|dīns|sīns|īns|ols|āls))\b/g,
      /\b(Amoksicilīns|Doksiciklīns|Prednisolons|Meloksikāms|Gabapentīns|Tramadols|Furosemīds|Enalaprils|Digoksīns|Insulīns)\b/gi,
      /\b([A-Z][a-z]+ (?:tabletes|kapsulas|pilieni|krēms|ziede|injekcija|šķīdums))\b/gi
    ]
  };

  // Category classification patterns
  private categoryPatterns = {
    antibiotics: ['antibiotic', 'antimicrobial', 'амицилlin', 'mycin', 'антибиотик', 'antibiotika'],
    painkillers: ['analgesic', 'pain relief', 'nsaid', 'обезболивающее', 'pretsāpju'],
    vitamins: ['vitamin', 'supplement', 'витамин', 'vitamīns'],
    antiparasitic: ['antiparasitic', 'flea', 'tick', 'worm', 'противопаразитарный', 'pretparazītu'],
    digestive: ['digestive', 'gastro', 'probiotic', 'пищеварительный', 'gremošanas'],
    skin_care: ['topical', 'dermal', 'skin', 'кожный', 'ādas']
  };

  constructor() {
    this.startAutomaticDiscovery();
  }

  private startAutomaticDiscovery() {
    // Run discovery immediately
    this.discoverNewMedications();
    
    // Set up periodic discovery
    setInterval(() => {
      this.discoverNewMedications();
    }, this.DISCOVERY_INTERVAL);
  }

  async discoverNewMedications(): Promise<DiscoveredMedication[]> {
    console.log('🔍 Starting automatic medication discovery...');
    
    try {
      // Get fresh data from all sources
      const allScrapedData = await veterinaryWebScraper.scrapeAllSources();
      
      const discoveredMedications: DiscoveredMedication[] = [];
      
      for (const data of allScrapedData) {
        const medications = await this.extractMedicationsFromData(data);
        discoveredMedications.push(...medications);
      }
      
      // Remove duplicates and validate
      const uniqueMedications = this.deduplicateAndValidate(discoveredMedications);
      
      // Translate to all languages
      const translatedMedications = await this.translateMedications(uniqueMedications);
      
      // Add to database
      const addedCount = await this.addMedicationsToDatabase(translatedMedications);
      
      console.log(`✅ Discovery complete: Found ${discoveredMedications.length} medications, added ${addedCount} new ones`);
      
      this.lastDiscovery = new Date();
      return translatedMedications;
      
    } catch (error) {
      console.error('❌ Medication discovery failed:', error);
      return [];
    }
  }

  private async extractMedicationsFromData(data: ScrapedData): Promise<DiscoveredMedication[]> {
    const medications: DiscoveredMedication[] = [];
    const language = data.language;
    const patterns = this.medicationPatterns[language] || this.medicationPatterns.en;
    
    const text = `${data.title} ${data.content}`;
    
    for (const pattern of patterns) {
      const matches = text.match(pattern);
      if (matches) {
        for (const match of matches) {
          const medication = await this.createMedicationFromMatch(match, data);
          if (medication) {
            medications.push(medication);
          }
        }
      }
    }
    
    // Also extract from medicines array in scraped data
    for (const medicineName of data.medicines) {
      const medication = await this.createMedicationFromName(medicineName, data);
      if (medication) {
        medications.push(medication);
      }
    }
    
    return medications;
  }

  private async createMedicationFromMatch(medicationName: string, source: ScrapedData): Promise<DiscoveredMedication | null> {
    try {
      // Clean up the medication name
      const cleanName = medicationName.trim().replace(/\s+/g, ' ');
      
      // Skip if already exists
      if (this.discoveryHistory.has(cleanName.toLowerCase())) {
        return null;
      }
      
      // Determine category
      const category = this.classifyMedication(cleanName, source.content);
      
      // Extract information from surrounding context
      const medicationInfo = this.extractMedicationInfo(cleanName, source.content);
      
      const medication: DiscoveredMedication = {
        name: cleanName,
        description: {
          [source.language]: medicationInfo.description,
          lv: '',
          ru: '',
          en: ''
        },
        usage: {
          [source.language]: medicationInfo.usage,
          lv: '',
          ru: '',
          en: ''
        },
        dosage: {},
        sideEffects: medicationInfo.sideEffects.map(effect => ({
          [source.language]: effect,
          lv: '',
          ru: '',
          en: ''
        })),
        contraindications: medicationInfo.contraindications.map(contra => ({
          [source.language]: contra,
          lv: '',
          ru: '',
          en: ''
        })),
        ingredients: medicationInfo.ingredients.map(ingredient => ({
          [source.language]: ingredient,
          lv: '',
          ru: '',
          en: ''
        })),
        forSpecies: source.species as PetSpecies[],
        category,
        prescriptionRequired: this.isPrescriptionRequired(cleanName, source.content),
        confidence: this.calculateMedicationConfidence(medicationInfo, source),
        sources: [source.source]
      };
      
      // Add dosage information if found
      const dosageInfo = this.extractDosageInfo(cleanName, source.content, source.species as PetSpecies[]);
      for (const [species, dose] of Object.entries(dosageInfo)) {
        medication.dosage[species as PetSpecies] = {
          [source.language]: dose,
          lv: '',
          ru: '',
          en: ''
        };
      }
      
      this.discoveryHistory.set(cleanName.toLowerCase(), medication);
      return medication;
      
    } catch (error) {
      console.error(`Failed to create medication from ${medicationName}:`, error);
      return null;
    }
  }

  private async createMedicationFromName(medicationName: string, source: ScrapedData): Promise<DiscoveredMedication | null> {
    return this.createMedicationFromMatch(medicationName, source);
  }

  private classifyMedication(name: string, content: string): MedicineCategory {
    const nameAndContent = `${name} ${content}`.toLowerCase();
    
    for (const [category, keywords] of Object.entries(this.categoryPatterns)) {
      if (keywords.some(keyword => nameAndContent.includes(keyword.toLowerCase()))) {
        return category as MedicineCategory;
      }
    }
    
    return 'supplements'; // Default category
  }

  private extractMedicationInfo(name: string, content: string) {
    const sentences = content.split(/[.!?]+/);
    const relevantSentences = sentences.filter(sentence => 
      sentence.toLowerCase().includes(name.toLowerCase())
    );
    
    const info = {
      description: this.extractDescription(name, relevantSentences),
      usage: this.extractUsage(name, relevantSentences),
      sideEffects: this.extractSideEffects(relevantSentences),
      contraindications: this.extractContraindications(relevantSentences),
      ingredients: this.extractIngredients(name, relevantSentences)
    };
    
    return info;
  }

  private extractDescription(name: string, sentences: string[]): string {
    for (const sentence of sentences) {
      if (sentence.toLowerCase().includes(name.toLowerCase()) && 
          (sentence.includes('is') || sentence.includes('является') || sentence.includes('ir'))) {
        return sentence.trim().substring(0, 200) + '...';
      }
    }
    return `${name} is a veterinary medication.`;
  }

  private extractUsage(_name: string, sentences: string[]): string {
    const usageKeywords = ['used for', 'treats', 'treatment', 'используется для', 'лечит', 'lieto', 'ārstē'];
    
    for (const sentence of sentences) {
      if (usageKeywords.some(keyword => sentence.toLowerCase().includes(keyword))) {
        return sentence.trim().substring(0, 200) + '...';
      }
    }
    return `Used for various veterinary conditions.`;
  }

  private extractSideEffects(sentences: string[]): string[] {
    const effects: string[] = [];
    const effectKeywords = ['side effect', 'adverse', 'побочный эффект', 'blakusparādība'];
    
    for (const sentence of sentences) {
      if (effectKeywords.some(keyword => sentence.toLowerCase().includes(keyword))) {
        effects.push(sentence.trim().substring(0, 100));
      }
    }
    
    return effects.length > 0 ? effects : ['Consult veterinarian for side effects'];
  }

  private extractContraindications(sentences: string[]): string[] {
    const contras: string[] = [];
    const contraKeywords = ['contraindicated', 'should not', 'противопоказан', 'nedrīkst'];
    
    for (const sentence of sentences) {
      if (contraKeywords.some(keyword => sentence.toLowerCase().includes(keyword))) {
        contras.push(sentence.trim().substring(0, 100));
      }
    }
    
    return contras.length > 0 ? contras : ['Consult veterinarian before use'];
  }

  private extractIngredients(name: string, sentences: string[]): string[] {
    const ingredients: string[] = [];
    const ingredientKeywords = ['contains', 'active ingredient', 'состав', 'sastāvs'];
    
    for (const sentence of sentences) {
      if (ingredientKeywords.some(keyword => sentence.toLowerCase().includes(keyword))) {
        // Extract potential ingredients (simplified)
        const words = sentence.split(/[\s,]+/);
        const chemicalPattern = /^[A-Z][a-z]+(?:ine|ate|ide|ium)$/;
        for (const word of words) {
          if (chemicalPattern.test(word)) {
            ingredients.push(word);
          }
        }
      }
    }
    
    return ingredients.length > 0 ? ingredients : [name];
  }

  private extractDosageInfo(_name: string, content: string, species: PetSpecies[]): Record<string, string> {
    const dosages: Record<string, string> = {};
    const dosageKeywords = ['dosage', 'dose', 'дозировка', 'deva'];
    
    const sentences = content.split(/[.!?]+/);
    for (const sentence of sentences) {
      if (dosageKeywords.some(keyword => sentence.toLowerCase().includes(keyword))) {
        for (const spec of species) {
          const speciesKeywords = {
            dog: ['dog', 'canine', 'собака', 'suns'],
            cat: ['cat', 'feline', 'кошка', 'kaķis'],
            bird: ['bird', 'avian', 'птица', 'putns'],
            rabbit: ['rabbit', 'кролик', 'trusis'],
            hamster: ['hamster', 'хомяк', 'kāmis'],
            guinea_pig: ['guinea pig', 'морская свинка', 'jūras cūciņa'],
            fish: ['fish', 'рыба', 'zivs'],
            reptile: ['reptile', 'рептилия', 'rāpulis']
          };
          
          const keywords = speciesKeywords[spec] || [];
          if (keywords.some(keyword => sentence.toLowerCase().includes(keyword))) {
            dosages[spec] = sentence.trim().substring(0, 100);
          }
        }
      }
    }
    
    return dosages;
  }

  private isPrescriptionRequired(name: string, content: string): boolean {
    const prescriptionKeywords = [
      'prescription', 'veterinary prescription', 'рецепт', 'recepte',
      'controlled', 'rx only', 'по рецепту', 'ar recepti'
    ];
    
    const nameAndContent = `${name} ${content}`.toLowerCase();
    return prescriptionKeywords.some(keyword => nameAndContent.includes(keyword));
  }

  private calculateMedicationConfidence(info: any, source: ScrapedData): number {
    let confidence = source.reliability;
    
    // Increase confidence based on available information
    if (info.description.length > 50) confidence += 0.1;
    if (info.usage.length > 30) confidence += 0.1;
    if (info.sideEffects.length > 0) confidence += 0.05;
    if (info.contraindications.length > 0) confidence += 0.05;
    if (info.ingredients.length > 0) confidence += 0.05;
    
    return Math.min(confidence, 1.0);
  }

  private deduplicateAndValidate(medications: DiscoveredMedication[]): DiscoveredMedication[] {
    const unique = new Map<string, DiscoveredMedication>();
    
    for (const med of medications) {
      const key = med.name.toLowerCase();
      if (!unique.has(key) || unique.get(key)!.confidence < med.confidence) {
        // Validate medication
        if (this.validateMedication(med)) {
          unique.set(key, med);
        }
      }
    }
    
    return Array.from(unique.values());
  }

  private validateMedication(medication: DiscoveredMedication): boolean {
    // Basic validation rules
    if (!medication.name || medication.name.length < 3) return false;
    if (!medication.forSpecies || medication.forSpecies.length === 0) return false;
    if (medication.confidence < 0.3) return false;
    
    // Check if name looks like a real medication
    const validNamePattern = /^[A-Za-z][A-Za-z0-9\s\-]+$/;
    if (!validNamePattern.test(medication.name)) return false;
    
    return true;
  }

  private async translateMedications(medications: DiscoveredMedication[]): Promise<DiscoveredMedication[]> {
    const translated: DiscoveredMedication[] = [];
    
    for (const med of medications) {
      try {
        const translatedMed = await this.translateSingleMedication(med);
        translated.push(translatedMed);
      } catch (error) {
        console.error(`Failed to translate medication ${med.name}:`, error);
        // Include original if translation fails
        translated.push(med);
      }
    }
    
    return translated;
  }

  private async translateSingleMedication(medication: DiscoveredMedication): Promise<DiscoveredMedication> {
    const languages: Array<'en' | 'lv' | 'ru'> = ['en', 'lv', 'ru'];
    const sourceLanguage = Object.keys(medication.description).find(key => 
      medication.description[key as keyof typeof medication.description] !== ''
    ) as 'en' | 'lv' | 'ru';
    
    if (!sourceLanguage) return medication;
    
    // Translate description and usage
    for (const targetLang of languages) {
      if (targetLang === sourceLanguage) continue;
      
      if (!medication.description[targetLang]) {
        const descTranslation = await veterinaryTranslator.translateText({
          text: medication.description[sourceLanguage],
          fromLanguage: sourceLanguage,
          toLanguage: targetLang,
          context: 'medical'
        });
        medication.description[targetLang] = descTranslation.translatedText;
      }
      
      if (!medication.usage[targetLang]) {
        const usageTranslation = await veterinaryTranslator.translateText({
          text: medication.usage[sourceLanguage],
          fromLanguage: sourceLanguage,
          toLanguage: targetLang,
          context: 'treatments'
        });
        medication.usage[targetLang] = usageTranslation.translatedText;
      }
    }
    
    // Translate arrays (side effects, contraindications, ingredients)
    medication.sideEffects = await this.translateStringArray(medication.sideEffects, sourceLanguage);
    medication.contraindications = await this.translateStringArray(medication.contraindications, sourceLanguage);
    medication.ingredients = await this.translateStringArray(medication.ingredients, sourceLanguage);
    
    // Translate dosages
    for (const species of Object.keys(medication.dosage)) {
      if (medication.dosage[species as PetSpecies]) {
        medication.dosage[species as PetSpecies] = await this.translateDosage(
          medication.dosage[species as PetSpecies]!,
          sourceLanguage
        );
      }
    }
    
    return medication;
  }

  private async translateStringArray(
    array: Array<{ lv: string; ru: string; en: string }>,
    sourceLanguage: 'en' | 'lv' | 'ru'
  ): Promise<Array<{ lv: string; ru: string; en: string }>> {
    const translated = [];
    
    for (const item of array) {
      const translatedItem = { lv: '', ru: '', en: '' };
      translatedItem[sourceLanguage] = item[sourceLanguage];
      
      for (const targetLang of ['en', 'lv', 'ru'] as const) {
        if (targetLang === sourceLanguage) continue;
        
        const translation = await veterinaryTranslator.translateText({
          text: item[sourceLanguage],
          fromLanguage: sourceLanguage,
          toLanguage: targetLang,
          context: 'medical'
        });
        translatedItem[targetLang] = translation.translatedText;
      }
      
      translated.push(translatedItem);
    }
    
    return translated;
  }

  private async translateDosage(
    dosage: { lv: string; ru: string; en: string },
    sourceLanguage: 'en' | 'lv' | 'ru'
  ): Promise<{ lv: string; ru: string; en: string }> {
    const translated = { lv: '', ru: '', en: '' };
    translated[sourceLanguage] = dosage[sourceLanguage];
    
    for (const targetLang of ['en', 'lv', 'ru'] as const) {
      if (targetLang === sourceLanguage) continue;
      
      const translation = await veterinaryTranslator.translateText({
        text: dosage[sourceLanguage],
        fromLanguage: sourceLanguage,
        toLanguage: targetLang,
        context: 'treatments'
      });
      translated[targetLang] = translation.translatedText;
    }
    
    return translated;
  }

  private async addMedicationsToDatabase(medications: DiscoveredMedication[]): Promise<number> {
    let addedCount = 0;
    
    for (const discoveredMed of medications) {
      try {
        // Check if medication already exists in database
        const existingMeds = vetDatabase.getAllMedicines();
        const exists = existingMeds.some(med => 
          med.name.toLowerCase() === discoveredMed.name.toLowerCase()
        );
        
        if (!exists) {
          // Convert to Medicine format
          const medicine: Medicine = this.convertToMedicineFormat(discoveredMed);
          
          // Add to database (this would need to be implemented in vetDatabase)
          await this.addMedicineToDatabase(medicine);
          addedCount++;
          
          console.log(`✅ Added new medication: ${discoveredMed.name}`);
        }
      } catch (error) {
        console.error(`Failed to add medication ${discoveredMed.name}:`, error);
      }
    }
    
    return addedCount;
  }

  private convertToMedicineFormat(discovered: DiscoveredMedication): Medicine {
    // For now, use the first available language for the basic Medicine format
    const primaryLang = discovered.description.en || discovered.description.lv || discovered.description.ru;
    const primaryUsage = discovered.usage.en || discovered.usage.lv || discovered.usage.ru;
    
    return {
      id: discovered.name.toLowerCase().replace(/\s+/g, '-'),
      name: discovered.name,
      category: discovered.category,
      description: primaryLang,
      usage: primaryUsage,
      dosage: Object.fromEntries(
        Object.entries(discovered.dosage).map(([species, dose]) => [
          species,
          dose.en || dose.lv || dose.ru
        ])
      ),
      sideEffects: discovered.sideEffects.map(effect => 
        effect.en || effect.lv || effect.ru
      ),
      contraindications: discovered.contraindications.map(contra => 
        contra.en || contra.lv || contra.ru
      ),
      ingredients: discovered.ingredients.map(ingredient => 
        ingredient.en || ingredient.lv || ingredient.ru
      ),
      forSpecies: discovered.forSpecies,
      prescriptionRequired: discovered.prescriptionRequired
    };
  }

  private async addMedicineToDatabase(medicine: Medicine): Promise<void> {
    // This would need to be implemented in the vetDatabase
    // For now, we'll simulate adding to a dynamic medicines array
    console.log(`Adding ${medicine.name} to database...`);
    
    // In a real implementation, this would persist to a database
    // vetDatabase.addMedicine(medicine);
  }

  // Public methods for manual discovery
  async discoverMedicationsForQuery(query: string): Promise<DiscoveredMedication[]> {
    const scrapedData = await veterinaryWebScraper.scrapeAllSources();
    const relevantData = scrapedData.filter(data => 
      data.content.toLowerCase().includes(query.toLowerCase()) ||
      data.title.toLowerCase().includes(query.toLowerCase())
    );
    
    const medications: DiscoveredMedication[] = [];
    for (const data of relevantData) {
      const extracted = await this.extractMedicationsFromData(data);
      medications.push(...extracted);
    }
    
    return this.deduplicateAndValidate(medications);
  }

  getDiscoveryStats() {
    return {
      totalDiscovered: this.discoveryHistory.size,
      lastDiscovery: this.lastDiscovery,
      discoveryInterval: this.DISCOVERY_INTERVAL / (1000 * 60 * 60), // in hours
      categories: Object.keys(this.categoryPatterns)
    };
  }

  getDiscoveredMedications(): DiscoveredMedication[] {
    return Array.from(this.discoveryHistory.values());
  }
}

// Singleton instance
export const medicationDiscoveryEngine = new MedicationDiscoveryEngine();