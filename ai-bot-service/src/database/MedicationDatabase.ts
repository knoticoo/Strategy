import { logger } from '../utils/logger';

export class MedicationDatabase {
  private medications: Map<string, any> = new Map();

  async saveMedication(medication: any): Promise<void> {
    try {
      const id = medication.id || Date.now().toString();
      this.medications.set(id, medication);
      logger.info(`Saved medication: ${id}`);
    } catch (error) {
      logger.error('Failed to save medication:', error);
      throw error;
    }
  }

  async getMedication(id: string): Promise<any | null> {
    try {
      return this.medications.get(id) || null;
    } catch (error) {
      logger.error('Failed to get medication:', error);
      throw error;
    }
  }

  async getAllMedications(): Promise<any[]> {
    try {
      return Array.from(this.medications.values());
    } catch (error) {
      logger.error('Failed to get all medications:', error);
      throw error;
    }
  }

  async deleteMedication(id: string): Promise<void> {
    try {
      this.medications.delete(id);
      logger.info(`Deleted medication: ${id}`);
    } catch (error) {
      logger.error('Failed to delete medication:', error);
      throw error;
    }
  }

  // Additional methods that routes expect
  async addMedication(medication: any): Promise<void> {
    return this.saveMedication(medication);
  }

  async getMedicationById(id: string): Promise<any | null> {
    return this.getMedication(id);
  }

  async searchMedications(query: string): Promise<any[]> {
    try {
      const allMedications = Array.from(this.medications.values());
      return allMedications.filter(med => 
        med.name?.toLowerCase().includes(query.toLowerCase()) ||
        med.description?.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      logger.error('Failed to search medications:', error);
      throw error;
    }
  }

  async getMedicinesBySpecies(species: string): Promise<any[]> {
    try {
      const allMedications = Array.from(this.medications.values());
      return allMedications.filter(med => 
        med.species?.includes(species) || med.species?.includes('general')
      );
    } catch (error) {
      logger.error('Failed to get medications by species:', error);
      throw error;
    }
  }

  async getStats(): Promise<any> {
    try {
      const allMedications = Array.from(this.medications.values());
      return {
        total: allMedications.length,
        byCategory: allMedications.reduce((acc: any, med: any) => {
          const category = med.category || 'unknown';
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {}),
        bySpecies: allMedications.reduce((acc: any, med: any) => {
          const species = med.species || ['unknown'];
          species.forEach((s: string) => {
            acc[s] = (acc[s] || 0) + 1;
          });
          return acc;
        }, {})
      };
    } catch (error) {
      logger.error('Failed to get medication stats:', error);
      throw error;
    }
  }
}