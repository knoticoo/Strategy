import { Medicine } from '../../types';
import { antibiotics } from './antibiotics';
import { painkillers } from './painkillers';
import { antiparasitic } from './antiparasitic';
import { vitamins } from './vitamins';
import { supplements } from './supplements';
import { digestive } from './digestive';
import { skinCare } from './skinCare';
import { petFoods } from './petFoods';

// Combine all medicine categories
export const medicinesDatabase: Medicine[] = [
  ...antibiotics,
  ...painkillers,
  ...antiparasitic,
  ...vitamins,
  ...supplements,
  ...digestive,
  ...skinCare,
  ...petFoods
];

// Export individual categories for specific use cases
export {
  antibiotics,
  painkillers,
  antiparasitic,
  vitamins,
  supplements,
  digestive,
  skinCare,
  petFoods
};

// Helper functions for searching and filtering
export const searchMedicines = (query: string, filters?: { category?: string; species?: string }): Medicine[] => {
  let results = medicinesDatabase;

  if (query.trim()) {
    const searchTerm = query.toLowerCase();
    results = results.filter(medicine => 
      medicine.name.toLowerCase().includes(searchTerm) ||
      medicine.description.toLowerCase().includes(searchTerm) ||
      medicine.usage.toLowerCase().includes(searchTerm) ||
      medicine.ingredients.some(ingredient => ingredient.toLowerCase().includes(searchTerm))
    );
  }

  if (filters?.category && filters.category !== 'all') {
    results = results.filter(medicine => medicine.category === filters.category);
  }

  if (filters?.species && filters.species !== 'all') {
    results = results.filter(medicine => medicine.forSpecies.includes(filters.species as any));
  }

  return results;
};

export const getMedicineById = (id: string): Medicine | undefined => {
  return medicinesDatabase.find(medicine => medicine.id === id);
};

export const getMedicinesByCategory = (category: string): Medicine[] => {
  return medicinesDatabase.filter(medicine => medicine.category === category);
};

export const getMedicinesForSpecies = (species: string): Medicine[] => {
  return medicinesDatabase.filter(medicine => medicine.forSpecies.includes(species as any));
};

export const getMedicinesByPrescriptionStatus = (prescriptionRequired: boolean): Medicine[] => {
  return medicinesDatabase.filter(medicine => medicine.prescriptionRequired === prescriptionRequired);
};

// Get statistics about the medicine database
export const getDatabaseStats = () => {
  const totalMedicines = medicinesDatabase.length;
  const prescriptionMedicines = getMedicinesByPrescriptionStatus(true).length;
  const otcMedicines = getMedicinesByPrescriptionStatus(false).length;
  
  const categoryCounts = medicinesDatabase.reduce((acc, medicine) => {
    acc[medicine.category] = (acc[medicine.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const speciesCounts = medicinesDatabase.reduce((acc, medicine) => {
    medicine.forSpecies.forEach(species => {
      acc[species] = (acc[species] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  return {
    totalMedicines,
    prescriptionMedicines,
    otcMedicines,
    categoryCounts,
    speciesCounts
  };
};