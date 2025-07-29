import { Router, Request, Response } from 'express';
import { localAIProvider } from '../services/LocalAIProvider';
import { logger } from '../utils/logger';
import { MedicationDatabase } from '../database/MedicationDatabase';

const router = Router();
const medicationDb = new MedicationDatabase();

// GET /api/v1/medicines - Get all medicines (populated by AI)
router.get('/', async (req: Request, res: Response) => {
  const { species, category, search, limit = 50 } = req.query;

  try {
    logger.info('📋 Fetching medicines list from local AI...');

    // Try to get from database first
    let medicines = await medicationDb.searchMedications(search as string || '');

    // If database is empty or we need more medicines, generate with AI
    if (medicines.length === 0) {
      logger.info('💊 Database empty, generating medicines with local AI...');
      
      const aiMedicines = await localAIProvider.generateMedicationsList();
      
      // Store in database for future use
      for (const med of aiMedicines) {
        await medicationDb.addMedication({
          id: med.name.toLowerCase().replace(/\s+/g, '-'),
          name: med.name,
          description: med.description,
          category: med.category || 'general',
          species: med.species || ['general'],
          dosage: {},
          sideEffects: [],
          contraindications: [],
          usage: med.description,
          activeIngredients: [],
          source: 'Local AI Model',
          confidence: med.confidence || 0.8,
          lastUpdated: new Date()
        });
      }

      medicines = aiMedicines;
    }

    // Apply filters
    if (species) {
      medicines = medicines.filter(med => 
        med.species.includes(species as string) || med.species.includes('general')
      );
    }

    if (category) {
      medicines = medicines.filter(med => med.category === category);
    }

    // Limit results
    medicines = medicines.slice(0, parseInt(limit as string));

    res.json({
      success: true,
      data: medicines,
      metadata: {
        total: medicines.length,
        filters: { species, category, search },
        source: 'Local AI + Database'
      }
    });

  } catch (error) {
    logger.error('❌ Failed to fetch medicines:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch medicines',
      message: 'Unable to generate medicines list with local AI'
    });
  }
});

// GET /api/v1/medicines/:id - Get specific medicine details
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    logger.info(`🔍 Looking up medicine: ${id}`);

    // Try database first
    let medicine = await medicationDb.getMedicationById(id);

    // If not found, generate with AI
    if (!medicine) {
      logger.info(`💊 Medicine not in database, generating with AI...`);
      
      const aiMedicines = await localAIProvider.getMedicationInfo(id);
      if (aiMedicines.length > 0) {
        medicine = aiMedicines[0];
        
        // Store in database
        await medicationDb.addMedication({
          id: id,
          name: medicine.name,
          description: medicine.description,
          category: medicine.category || 'general',
          species: medicine.species || ['general'],
          dosage: {},
          sideEffects: [],
          contraindications: [],
          usage: medicine.description,
          activeIngredients: [],
          source: 'Local AI Model',
          confidence: medicine.confidence || 0.8,
          lastUpdated: new Date()
        });
      }
    }

    if (!medicine) {
      return res.status(404).json({
        success: false,
        error: 'Medicine not found',
        message: `No information available for medicine: ${id}`
      });
    }

    res.json({
      success: true,
      data: medicine
    });

  } catch (error) {
    logger.error('❌ Failed to fetch medicine details:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch medicine details'
    });
  }
});

// POST /api/v1/medicines/generate - Generate new medicines for specific species
router.post('/generate', async (req: Request, res: Response) => {
  const { species, count = 10, category } = req.body;

  try {
    logger.info(`🧬 Generating ${count} medicines for ${species}...`);

    const medicines = [];
    
    // Generate medicines using AI
    for (let i = 0; i < count; i++) {
      const query = category 
        ? `Tell me about a ${category} medication used for ${species}s. Include name, usage, dosage, and side effects.`
        : `Tell me about a medication commonly used for ${species}s. Include name, usage, dosage, and side effects.`;

      try {
        const response = await localAIProvider.generateVeterinaryResponse(
          query,
          species,
          'medication_generation'
        );

        // Extract medicine name from response (simple parsing)
        const lines = response.answer.split('\n');
        const nameMatch = lines[0].match(/^([A-Za-z\s]+)/);
        const medicineName = nameMatch ? nameMatch[1].trim() : `Medicine_${i + 1}`;

        const medicine = {
          id: medicineName.toLowerCase().replace(/\s+/g, '-'),
          name: medicineName,
          description: response.answer,
          category: category || 'general',
          species: [species],
          source: 'Local AI Generated',
          confidence: response.confidence,
          urgency: response.urgency
        };

        medicines.push(medicine);

        // Store in database
        await medicationDb.addMedication({
          ...medicine,
          dosage: {},
          sideEffects: [],
          contraindications: [],
          usage: response.answer,
          activeIngredients: [],
          lastUpdated: new Date()
        });

        // Small delay to prevent overwhelming the AI
        await new Promise(resolve => setTimeout(resolve, 2000));

      } catch (error) {
        logger.warn(`Failed to generate medicine ${i + 1}:`, error);
      }
    }

    res.json({
      success: true,
      data: medicines,
      metadata: {
        generated: medicines.length,
        requested: count,
        species,
        category
      }
    });

  } catch (error) {
    logger.error('❌ Failed to generate medicines:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to generate medicines'
    });
  }
});

// GET /api/v1/medicines/species/:species - Get medicines for specific species
router.get('/species/:species', async (req: Request, res: Response) => {
  const { species } = req.params;
  const { limit = 20 } = req.query;

  try {
    logger.info(`🐾 Getting medicines for species: ${species}`);

    // Get species-specific medicines
    let medicines = await medicationDb.getMedicinesBySpecies(species);

    // If no specific medicines, generate some
    if (medicines.length === 0) {
      logger.info(`💊 No medicines found for ${species}, generating with AI...`);
      
      const query = `List common medications used for ${species}s, including their uses and dosages.`;
      const response = await localAIProvider.generateVeterinaryResponse(
        query,
        species,
        'species_medications'
      );

      // Create a general medicine entry for this species
      const medicine = {
        id: `${species}-general-medications`,
        name: `${species.charAt(0).toUpperCase() + species.slice(1)} Medications`,
        description: response.answer,
        category: 'species-specific',
        species: [species],
        source: 'Local AI Generated',
        confidence: response.confidence
      };

      medicines = [medicine];

      // Store in database
      await medicationDb.addMedication({
        ...medicine,
        dosage: {},
        sideEffects: [],
        contraindications: [],
        usage: response.answer,
        activeIngredients: [],
        lastUpdated: new Date()
      });
    }

    medicines = medicines.slice(0, parseInt(limit as string));

    res.json({
      success: true,
      data: medicines,
      metadata: {
        species,
        total: medicines.length,
        source: 'Local AI + Database'
      }
    });

  } catch (error) {
    logger.error('❌ Failed to fetch species medicines:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch species medicines'
    });
  }
});

// POST /api/v1/medicines/search - Advanced medicine search
router.post('/search', async (req: Request, res: Response) => {
  const { query, species, symptoms, limit = 10 } = req.body;

  try {
    logger.info(`🔍 Advanced medicine search: "${query}"`);

    // First try database search
    let medicines = await medicationDb.searchMedications(query);

    // If no results, use AI to find relevant medicines
    if (medicines.length === 0 && query) {
      logger.info('💊 No database results, searching with AI...');
      
      const searchQuery = symptoms 
        ? `What medications are used to treat ${symptoms.join(', ')} in ${species || 'animals'}? Query: ${query}`
        : `Find medications related to: ${query} for ${species || 'animals'}`;

      const response = await localAIProvider.generateVeterinaryResponse(
        searchQuery,
        species || 'general',
        'medication_search'
      );

      // Create search result
      const searchResult = {
        id: `search-${Date.now()}`,
        name: `Search Results: ${query}`,
        description: response.answer,
        category: 'search-result',
        species: species ? [species] : ['general'],
        source: 'Local AI Search',
        confidence: response.confidence,
        searchQuery: query,
        symptoms: symptoms || []
      };

      medicines = [searchResult];
    }

    medicines = medicines.slice(0, limit);

    res.json({
      success: true,
      data: medicines,
      metadata: {
        query,
        species,
        symptoms,
        total: medicines.length,
        source: medicines.length > 0 ? medicines[0].source : 'No results'
      }
    });

  } catch (error) {
    logger.error('❌ Failed to search medicines:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to search medicines'
    });
  }
});

// GET /api/v1/medicines/stats - Get medicine database statistics
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const stats = await medicationDb.getStats();
    const aiStats = localAIProvider.getStats();

    res.json({
      success: true,
      data: {
        database: stats,
        ai: aiStats,
        integration: 'Local AI + Database',
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('❌ Failed to get medicine stats:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to get statistics'
    });
  }
});

export default router;