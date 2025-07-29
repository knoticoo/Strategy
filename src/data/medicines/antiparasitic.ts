import { Medicine } from '../../types';

export const antiparasitic: Medicine[] = [
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

  {
    id: 'advantage-multi',
    name: 'Advantage Multi',
    category: 'antiparasitic',
    description: 'Plašā spektra pretparazītu līdzeklis',
    usage: 'Bluses, sirds tārpi, zarnu parazīti, ādas ērces',
    dosage: {
      dog: 'Mēnesī vienu reizi, deva atkarīga no svara',
      cat: 'Mēnesī vienu reizi, deva atkarīga no svara'
    },
    sideEffects: ['Vietējs ādas kairinājums', 'Miegainība', 'Vemšana'],
    contraindications: ['Vecums zem 7 nedēļām', 'Slimība'],
    ingredients: ['Imidacloprid', 'Moxidectin'],
    forSpecies: ['dog', 'cat'],
    prescriptionRequired: true
  },

  {
    id: 'revolution',
    name: 'Revolution (Selamectin)',
    category: 'antiparasitic',
    description: 'Sistēmisks pretparazītu līdzeklis',
    usage: 'Bluses, ērces, sirds tārpi, ausu ērces, sarkoptiskā krauze',
    dosage: {
      dog: '6 mg/kg mēnesī vienu reizi',
      cat: '6 mg/kg mēnesī vienu reizi',
      rabbit: '6-18 mg/kg (tikai veterinārārsta uzraudzībā)'
    },
    sideEffects: ['Matu izkrišana aplikācijas vietā', 'Ādas kairinājums'],
    contraindications: ['Vecums zem 6 nedēļām', 'Slimība'],
    ingredients: ['Selamectin'],
    forSpecies: ['dog', 'cat', 'rabbit'],
    prescriptionRequired: true
  },

  {
    id: 'ivermectin',
    name: 'Ivermectin',
    category: 'antiparasitic',
    description: 'Plašā spektra pretparazītu līdzeklis',
    usage: 'Sirds tārpi, zarnu tārpi, ādas parazīti',
    dosage: {
      dog: '6-12 μg/kg sirds tārpu profilaksei',
      rabbit: '0.2-0.4 mg/kg ādas parazītiem',
      guinea_pig: '0.2 mg/kg ādas parazītiem'
    },
    sideEffects: ['Neirologiski simptomi jutīgām šķirnēm', 'Vemšana', 'Caureja'],
    contraindications: ['Collie, Australian Shepherd (MDR1 mutācija)', 'Vecums zem 6 nedēļām'],
    ingredients: ['Ivermectin'],
    forSpecies: ['dog', 'rabbit', 'guinea_pig'],
    prescriptionRequired: true
  },

  {
    id: 'fenbendazole',
    name: 'Fenbendazole (Panacur)',
    category: 'antiparasitic',
    description: 'Benzimidazola grupas pretparazītu līdzeklis',
    usage: 'Zarnu tārpi, Giardia, plaušu tārpi',
    dosage: {
      dog: '50 mg/kg 3 dienas pēc kārtas',
      cat: '50 mg/kg 3 dienas pēc kārtas',
      rabbit: '20 mg/kg 5 dienas pēc kārtas',
      guinea_pig: '20 mg/kg 5 dienas pēc kārtas'
    },
    sideEffects: ['Reti - vemšana', 'Caureja'],
    contraindications: ['Grūsnības pirmā trešdaļa'],
    ingredients: ['Fenbendazole'],
    forSpecies: ['dog', 'cat', 'rabbit', 'guinea_pig'],
    prescriptionRequired: false
  },

  {
    id: 'praziquantel',
    name: 'Praziquantel',
    category: 'antiparasitic',
    description: 'Pretparazītu līdzeklis lentveida tārpiem',
    usage: 'Lentveida tārpi, Dipylidium, Taenia',
    dosage: {
      dog: '5-10 mg/kg vienreizēji',
      cat: '5-10 mg/kg vienreizēji'
    },
    sideEffects: ['Vemšana', 'Caureja', 'Miegainība'],
    contraindications: ['Vecums zem 4 nedēļām', 'Grūsnība'],
    ingredients: ['Praziquantel'],
    forSpecies: ['dog', 'cat'],
    prescriptionRequired: false
  },

  {
    id: 'milbemycin-oxime',
    name: 'Milbemycin Oxime',
    category: 'antiparasitic',
    description: 'Makrocikliskais laktona pretparazītu līdzeklis',
    usage: 'Sirds tārpu profilakse, zarnu tārpi',
    dosage: {
      dog: '0.5-1 mg/kg mēnesī',
      cat: '2 mg/kg mēnesī'
    },
    sideEffects: ['Vemšana', 'Caureja', 'Miegainība'],
    contraindications: ['MDR1 mutācija (Collie, Australian Shepherd)', 'Vecums zem 4 nedēļām'],
    ingredients: ['Milbemycin oxime'],
    forSpecies: ['dog', 'cat'],
    prescriptionRequired: true
  }
];