import { Medicine } from '../types';

export const medicinesDatabase: Medicine[] = [
  // Antibiotics
  {
    id: 'amoxicillin',
    name: 'Amoxicillin',
    category: 'antibiotics',
    description: 'Platīgā spektra antibiotika, kas efektīva pret dažādām baktēriju infekcijām',
    usage: 'Ārstē elpceļu infekcijas, ādas infekcijas, urīnceļu infekcijas',
    dosage: {
      dog: '10-20 mg/kg ķermeņa svara 2-3 reizes dienā',
      cat: '10-15 mg/kg ķermeņa svara 2 reizes dienā',
      rabbit: '15-20 mg/kg ķermeņa svara 2 reizes dienā'
    },
    sideEffects: ['Kuņģa darbības traucējumi', 'Caureja', 'Alerģiskas reakcijas'],
    contraindications: ['Alerģija pret penicilīnu', 'Nieru mazspēja'],
    ingredients: ['Amoxicillin trihydrate'],
    forSpecies: ['dog', 'cat', 'rabbit'],
    prescriptionRequired: true
  },
  
  {
    id: 'doxycycline',
    name: 'Doxycycline',
    category: 'antibiotics',
    description: 'Tetraciklīna grupas antibiotika plašam spektram infekciju',
    usage: 'Ērču pārnēsātas slimības, elpceļu infekcijas, ādas problēmas',
    dosage: {
      dog: '5-10 mg/kg dienā',
      cat: '5 mg/kg dienā'
    },
    sideEffects: ['Vemšana', 'Kuņģa sāpes', 'Fotosensitivitāte'],
    contraindications: ['Grūsnība', 'Jaundzimušie dzīvnieki'],
    ingredients: ['Doxycycline hyclate'],
    forSpecies: ['dog', 'cat'],
    prescriptionRequired: true
  },

  // Pain killers
  {
    id: 'meloxicam',
    name: 'Meloxicam',
    category: 'painkillers',
    description: 'Nesteroīds pretiekaisuma līdzeklis sāpju un iekaisuma mazināšanai',
    usage: 'Artīta sāpes, pēcoperācijas sāpju mazināšana, iekaisuma mazināšana',
    dosage: {
      dog: '0.1-0.2 mg/kg pirmajā dienā, tad 0.05-0.1 mg/kg',
      cat: '0.05 mg/kg (tikai īslaicīgi)'
    },
    sideEffects: ['Kuņģa čūlas', 'Nieru problēmas', 'Aknu bojājumi'],
    contraindications: ['Nieru slimības', 'Kuņģa čūlas', 'Grūsnība'],
    ingredients: ['Meloxicam'],
    forSpecies: ['dog', 'cat'],
    prescriptionRequired: true
  },

  // Vitamins
  {
    id: 'vitamin-b-complex',
    name: 'B vitamīnu komplekss',
    category: 'vitamins',
    description: 'Vitamīnu B grupas komplekss metabolisma uzlabošanai',
    usage: 'Stresa situācijās, rekonvalescences periodā, uztura papildināšanai',
    dosage: {
      dog: '1-2 ml dienā atkarībā no svara',
      cat: '0.5-1 ml dienā',
      rabbit: '0.5 ml dienā',
      bird: '0.1-0.2 ml dienā'
    },
    sideEffects: ['Reti - alerģiskas reakcijas'],
    contraindications: ['Alerģija pret B vitamīniem'],
    ingredients: ['Thiamine', 'Riboflavin', 'Niacin', 'B6', 'B12', 'Folic acid'],
    forSpecies: ['dog', 'cat', 'rabbit', 'bird', 'hamster', 'guinea_pig'],
    prescriptionRequired: false
  },

  {
    id: 'omega-3',
    name: 'Omega-3 taukskābes',
    category: 'supplements',
    description: 'Zivju eļļa ar omega-3 taukskābēm ādas un spalvas veselībai',
    usage: 'Ādas problēmas, spalvas kvalitātes uzlabošana, iekaisuma mazināšana',
    dosage: {
      dog: '20-55 mg/kg dienā EPA+DHA',
      cat: '20-40 mg/kg dienā EPA+DHA'
    },
    sideEffects: ['Caureja lielās devās', 'Zivju smaka'],
    contraindications: ['Alerģija pret zivīm'],
    ingredients: ['EPA', 'DHA', 'Zivju eļļa'],
    forSpecies: ['dog', 'cat'],
    prescriptionRequired: false
  },

  // Pet Foods
  {
    id: 'royal-canin-digestive',
    name: 'Royal Canin Digestive Care',
    category: 'food',
    description: 'Speciāla barība gremošanas sistēmas atbalstam',
    usage: 'Gremošanas traucējumi, jutīgs kuņģis, uztura nepanesamība',
    dosage: {
      dog: 'Atkarībā no svara: 95-310g dienā',
      cat: '40-85g dienā atkarībā no svara'
    },
    sideEffects: ['Reti - alerģiskas reakcijas uz sastāvdaļām'],
    contraindications: ['Alerģija pret konkrētām olbaltumvielām'],
    ingredients: ['Rīsi', 'Vistas gaļas milti', 'Kukurūza', 'Prebiotiki', 'Omega-3'],
    forSpecies: ['dog', 'cat'],
    prescriptionRequired: false
  },

  {
    id: 'hills-kidney-care',
    name: "Hill's Prescription Diet k/d",
    category: 'food',
    description: 'Terapeitiskā barība nieru slimību gadījumā',
    usage: 'Hronisku nieru slimību atbalsts, urīnpūšļa akmeņu profilakse',
    dosage: {
      dog: 'Atkarībā no svara un nieru funkcijas',
      cat: 'Atkarībā no svara un nieru funkcijas'
    },
    sideEffects: ['Sākumā iespējama barības atteikšana'],
    contraindications: ['Grūsnība', 'Zīdīšanas periods', 'Augšanas periods'],
    ingredients: ['Samazināts olbaltumvielu daudzums', 'Kontrolēts fosfora līmenis', 'Omega-3'],
    forSpecies: ['dog', 'cat'],
    prescriptionRequired: true
  },

  // Antiparasitic
  {
    id: 'frontline-plus',
    name: 'Frontline Plus',
    category: 'antiparasitic',
    description: 'Pretparazītu līdzeklis pret blusām un ērcēm',
    usage: 'Blusu un ērču profilakse un ārstēšana',
    dosage: {
      dog: 'Viena pipete mēnesī atkarībā no svara',
      cat: 'Viena pipete mēnesī'
    },
    sideEffects: ['Ādas kairinājums aplikācijas vietā', 'Reti - alerģiskas reakcijas'],
    contraindications: ['Vecums zem 8 nedēļām', 'Grūsnība (piesardzīgi)'],
    ingredients: ['Fipronil', 'S-methoprene'],
    forSpecies: ['dog', 'cat'],
    prescriptionRequired: false
  },

  // Digestive
  {
    id: 'probiotics-paste',
    name: 'Probiotiku pasta',
    category: 'digestive',
    description: 'Probiotiku komplekss zarnu mikrofloras atjaunošanai',
    usage: 'Antibiotikas terapijas laikā, gremošanas traucējumi, stresa situācijās',
    dosage: {
      dog: '2-5g dienā atkarībā no svara',
      cat: '1-2g dienā',
      rabbit: '1g dienā',
      guinea_pig: '0.5g dienā'
    },
    sideEffects: ['Ļoti reti - kuņģa diskomforts'],
    contraindications: ['Nav zināmas'],
    ingredients: ['Lactobacillus', 'Bifidobacterium', 'Enterococcus', 'Prebiotiki'],
    forSpecies: ['dog', 'cat', 'rabbit', 'guinea_pig', 'hamster'],
    prescriptionRequired: false
  },

  // Skin care
  {
    id: 'chlorhexidine-shampoo',
    name: 'Chlorhexidine šampūns',
    category: 'skin_care',
    description: 'Antiseptisks šampūns ādas infekciju ārstēšanai',
    usage: 'Bakteriālas ādas infekcijas, dermatīts, seborejas',
    dosage: {
      dog: 'Mazgāt 2-3 reizes nedēļā',
      cat: 'Mazgāt 1-2 reizes nedēļā'
    },
    sideEffects: ['Ādas sausums', 'Reti - kontakta dermatīts'],
    contraindications: ['Alerģija pret chlorhexidine'],
    ingredients: ['Chlorhexidine gluconate 2%', 'Mīkstinātāji'],
    forSpecies: ['dog', 'cat'],
    prescriptionRequired: false
  }
];

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

  if (filters?.category) {
    results = results.filter(medicine => medicine.category === filters.category);
  }

  if (filters?.species) {
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