import axios from 'axios';
import { parse } from 'node-html-parser';

export interface RealVeterinarySource {
  name: string;
  baseUrl: string;
  language: 'en' | 'lv' | 'ru';
  type: 'wikipedia' | 'medical' | 'veterinary';
  searchEndpoint?: string;
  apiKey?: string;
}

export interface ScrapedVetData {
  title: string;
  content: string;
  url: string;
  language: 'en' | 'lv' | 'ru';
  species: string[];
  category: string;
  reliability: number;
  lastUpdated: Date;
  sources: string[];
}

const REAL_VETERINARY_SOURCES: RealVeterinarySource[] = [
  {
    name: 'Wikipedia API (English)',
    baseUrl: 'https://en.wikipedia.org/api/rest_v1',
    language: 'en',
    type: 'wikipedia',
    searchEndpoint: '/page/summary/'
  },
  {
    name: 'Wikipedia API (Russian)',
    baseUrl: 'https://ru.wikipedia.org/api/rest_v1',
    language: 'ru',
    type: 'wikipedia',
    searchEndpoint: '/page/summary/'
  },
  {
    name: 'PetMD',
    baseUrl: 'https://www.petmd.com',
    language: 'en',
    type: 'veterinary'
  },
  {
    name: 'VetLabel FDA Database',
    baseUrl: 'https://vetlabel.com',
    language: 'en',
    type: 'medical'
  },
  {
    name: 'AVMA Resources',
    baseUrl: 'https://www.avma.org',
    language: 'en',
    type: 'veterinary'
  }
];

class RealVeterinaryWebScraper {
  private cache: Map<string, ScrapedVetData[]> = new Map();
  private sources: RealVeterinarySource[] = REAL_VETERINARY_SOURCES;

  async searchVeterinaryData(query: string, species?: string): Promise<ScrapedVetData[]> {
    const cacheKey = `${query}-${species || 'all'}`;
    
    if (this.cache.has(cacheKey)) {
      console.log(`🔄 Cache hit for query: "${query}"`);
      return this.cache.get(cacheKey)!;
    }

    console.log(`🌐 REAL WEB SCRAPING: Searching for "${query}" across ${this.sources.length} sources`);
    
    const allResults: ScrapedVetData[] = [];

    // Search Wikipedia APIs
    for (const source of this.sources.filter(s => s.type === 'wikipedia')) {
      try {
        const wikiResults = await this.searchWikipedia(query, source, species);
        allResults.push(...wikiResults);
      } catch (error) {
        console.warn(`⚠️ Wikipedia search failed for ${source.name}:`, error);
      }
    }

    // Search veterinary websites
    for (const source of this.sources.filter(s => s.type === 'veterinary')) {
      try {
        const vetResults = await this.searchVeterinaryWebsite(query, source, species);
        allResults.push(...vetResults);
      } catch (error) {
        console.warn(`⚠️ Veterinary site search failed for ${source.name}:`, error);
      }
    }

    // Sort by reliability and relevance
    const sortedResults = allResults
      .sort((a, b) => b.reliability - a.reliability)
      .slice(0, 10);

    this.cache.set(cacheKey, sortedResults);
    console.log(`✅ REAL SCRAPING COMPLETE: Found ${sortedResults.length} results for "${query}"`);
    
    return sortedResults;
  }

  private async searchWikipedia(
    query: string, 
    source: RealVeterinarySource, 
    species?: string
  ): Promise<ScrapedVetData[]> {
    const results: ScrapedVetData[] = [];
    
    // Search for veterinary terms related to the query
    const searchTerms = this.generateVeterinarySearchTerms(query, species);
    
    for (const term of searchTerms.slice(0, 3)) {
      try {
        const response = await axios.get(
          `${source.baseUrl}/page/summary/${encodeURIComponent(term)}`,
          {
            timeout: 5000,
            headers: {
              'User-Agent': 'AI-Pet-Doctor/1.0 (Educational Use)'
            }
          }
        );

        if (response.data && response.data.extract) {
          results.push({
            title: response.data.title,
            content: response.data.extract,
            url: response.data.content_urls?.desktop?.page || '',
            language: source.language,
            species: species ? [species] : this.extractSpeciesFromContent(response.data.extract),
            category: this.categorizeContent(response.data.extract),
            reliability: 0.9, // Wikipedia is highly reliable
            lastUpdated: new Date(),
            sources: [source.name]
          });
        }
      } catch (error) {
        console.warn(`Failed to fetch Wikipedia page for "${term}":`, error);
      }
    }

    return results;
  }

  private async searchVeterinaryWebsite(
    query: string, 
    source: RealVeterinarySource, 
    species?: string
  ): Promise<ScrapedVetData[]> {
    const results: ScrapedVetData[] = [];
    
    try {
      // For demonstration, we'll search the main page and look for relevant content
      const response = await axios.get(source.baseUrl, {
        timeout: 10000,
        headers: {
          'User-Agent': 'AI-Pet-Doctor/1.0 (Educational Use)'
        }
      });

      const root = parse(response.data);
      
      // Extract relevant content based on query
      const relevantElements = root.querySelectorAll('article, .content, .post, .entry');
      
      for (const element of relevantElements.slice(0, 5)) {
        const text = element.text;
        if (this.isRelevantToQuery(text, query)) {
          results.push({
            title: this.extractTitle(element) || `${source.name} - ${query}`,
            content: text.substring(0, 500) + '...',
            url: source.baseUrl,
            language: source.language,
            species: species ? [species] : this.extractSpeciesFromContent(text),
            category: this.categorizeContent(text),
            reliability: 0.8, // Veterinary websites are reliable
            lastUpdated: new Date(),
            sources: [source.name]
          });
        }
      }
    } catch (error) {
      console.warn(`Failed to scrape ${source.name}:`, error);
    }

    return results;
  }

  private generateVeterinarySearchTerms(query: string, species?: string): string[] {
    const baseTerms = [
      query,
      `${query} veterinary`,
      `${query} animal health`,
      `${query} pet medicine`
    ];

    if (species) {
      baseTerms.push(
        `${query} ${species}`,
        `${species} ${query}`,
        `${species} health ${query}`
      );
    }

    // Add common veterinary terms
    const veterinaryTerms = [
      'disease', 'treatment', 'symptoms', 'diagnosis', 'medication',
      'therapy', 'prevention', 'care', 'health', 'condition'
    ];

    for (const term of veterinaryTerms) {
      if (query.toLowerCase().includes(term)) {
        baseTerms.push(`${query.replace(term, '').trim()} ${term}`);
      }
    }

    return [...new Set(baseTerms)]; // Remove duplicates
  }

  private extractSpeciesFromContent(content: string): string[] {
    const species: string[] = [];
    const speciesPatterns = {
      dog: /\b(dog|canine|puppy|puppies)\b/gi,
      cat: /\b(cat|feline|kitten|kittens)\b/gi,
      bird: /\b(bird|avian|parrot|canary)\b/gi,
      rabbit: /\b(rabbit|bunny|hare)\b/gi,
      hamster: /\b(hamster|gerbil|guinea pig)\b/gi,
      fish: /\b(fish|aquatic|goldfish|tropical)\b/gi,
      reptile: /\b(reptile|snake|lizard|turtle|gecko)\b/gi,
      horse: /\b(horse|equine|pony|stallion|mare)\b/gi
    };

    for (const [animal, pattern] of Object.entries(speciesPatterns)) {
      if (pattern.test(content)) {
        species.push(animal);
      }
    }

    return species.length > 0 ? species : ['general'];
  }

  private categorizeContent(content: string): string {
    const categories = {
      'skin': /\b(skin|dermat|itch|scratch|rash|fur|hair|coat)\b/gi,
      'digestive': /\b(digest|stomach|intestin|diarrhea|vomit|nausea)\b/gi,
      'respiratory': /\b(breath|lung|cough|sneez|respiratory|pneumonia)\b/gi,
      'cardiac': /\b(heart|cardiac|circulation|blood|pulse)\b/gi,
      'neurological': /\b(brain|neuro|seizure|paralysis|behavior)\b/gi,
      'orthopedic': /\b(bone|joint|muscle|ligament|fracture|arthritis)\b/gi,
      'ophthalmologic': /\b(eye|vision|blind|cataract|cornea)\b/gi,
      'urinary': /\b(kidney|bladder|urin|nephro|cystitis)\b/gi,
      'reproductive': /\b(reproduct|pregnan|birth|mating|estrus)\b/gi,
      'infectious': /\b(infect|virus|bacteria|parasit|vaccine)\b/gi
    };

    for (const [category, pattern] of Object.entries(categories)) {
      if (pattern.test(content)) {
        return category;
      }
    }

    return 'general';
  }

  private isRelevantToQuery(content: string, query: string): boolean {
    const queryWords = query.toLowerCase().split(' ');
    const contentLower = content.toLowerCase();
    
    return queryWords.some(word => 
      word.length > 3 && contentLower.includes(word)
    );
  }

  private extractTitle(element: any): string | null {
    const titleSelectors = ['h1', 'h2', 'h3', '.title', '.headline'];
    
    for (const selector of titleSelectors) {
      const titleEl = element.querySelector(selector);
      if (titleEl && titleEl.text.trim()) {
        return titleEl.text.trim();
      }
    }
    
    return null;
  }

  async getMedicationInfo(medicationName: string): Promise<ScrapedVetData[]> {
    console.log(`💊 REAL MEDICATION SEARCH: Looking up "${medicationName}"`);
    
    const medicationQueries = [
      `${medicationName} veterinary medicine`,
      `${medicationName} animal medication`,
      `${medicationName} pet drug`,
      `${medicationName} dosage animals`
    ];

    const results: ScrapedVetData[] = [];

    for (const query of medicationQueries) {
      const searchResults = await this.searchVeterinaryData(query);
      results.push(...searchResults);
    }

    // Remove duplicates and return top results
    const uniqueResults = results.filter((result, index, self) => 
      index === self.findIndex(r => r.title === result.title)
    );

    return uniqueResults.slice(0, 5);
  }

  getSearchStats(): { totalSearches: number; cacheSize: number; sources: number } {
    return {
      totalSearches: this.cache.size,
      cacheSize: this.cache.size,
      sources: this.sources.length
    };
  }
}

export const realVeterinaryWebScraper = new RealVeterinaryWebScraper();