import { Medicine } from '../../types';

export const supplements: Medicine[] = [
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

  {
    id: 'probiotics-paste',
    name: 'Probiotiku pasta',
    category: 'supplements',
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

  {
    id: 'glucosamine-chondroitin',
    name: 'Glikozamīns + Hondroitīns',
    category: 'supplements',
    description: 'Locītavu veselības uzturēšanai un skrimšļa atjaunošanai',
    usage: 'Artīts, locītavu sāpes, skrimšļa bojājumi, vecuma izmaiņas',
    dosage: {
      dog: '20 mg/kg glikozamīna + 15 mg/kg hondroitīna dienā',
      cat: '15 mg/kg glikozamīna + 10 mg/kg hondroitīna dienā'
    },
    sideEffects: ['Kuņģa diskomforts', 'Caureja'],
    contraindications: ['Diabēts (piesardzīgi)', 'Asiņošanas traucējumi'],
    ingredients: ['Glucosamine sulfate', 'Chondroitin sulfate', 'MSM'],
    forSpecies: ['dog', 'cat'],
    prescriptionRequired: false
  },

  {
    id: 'digestive-enzymes',
    name: 'Gremošanas enzīmi',
    category: 'supplements',
    description: 'Enzīmu komplekss gremošanas uzlabošanai',
    usage: 'Gremošanas traucējumi, pankreāta nepietiekamība, uztura nepanesamība',
    dosage: {
      dog: '1-2 kapsulas ar ēdienu',
      cat: '1/2-1 kapsula ar ēdienu',
      rabbit: '1/4 kapsulas ar ēdienu'
    },
    sideEffects: ['Reti - kuņģa diskomforts'],
    contraindications: ['Akūts pankreātīts'],
    ingredients: ['Amilāze', 'Lipāze', 'Proteāze', 'Celulāze'],
    forSpecies: ['dog', 'cat', 'rabbit'],
    prescriptionRequired: false
  },

  {
    id: 'milk-thistle',
    name: 'Pieneņu ekstrakts (Silymarin)',
    category: 'supplements',
    description: 'Dabīgs aknu aizsardzības līdzeklis',
    usage: 'Aknu atbalsts, toksīnu izvadīšana, aknu slimību profilakse',
    dosage: {
      dog: '10-15 mg/kg dienā',
      cat: '10 mg/kg dienā'
    },
    sideEffects: ['Reti - caureja', 'Alerģiskas reakcijas'],
    contraindications: ['Grūsnība', 'Alerģija pret augu'],
    ingredients: ['Silymarin', 'Pieneņu ekstrakts'],
    forSpecies: ['dog', 'cat'],
    prescriptionRequired: false
  },

  {
    id: 'cranberry-extract',
    name: 'Dzērveņu ekstrakts',
    category: 'supplements',
    description: 'Urīnceļu veselības atbalsts',
    usage: 'Urīnceļu infekciju profilakse, cistīta atbalsta terapija',
    dosage: {
      dog: '10-20 mg/kg dienā',
      cat: '10-15 mg/kg dienā'
    },
    sideEffects: ['Kuņģa diskomforts lielās devās'],
    contraindications: ['Nieru akmeņi', 'Diabēts (piesardzīgi)'],
    ingredients: ['Cranberry extract', 'Proanthocyanidins'],
    forSpecies: ['dog', 'cat'],
    prescriptionRequired: false
  },

  {
    id: 'coq10',
    name: 'Koenzīms Q10',
    category: 'supplements',
    description: 'Antioksidants sirds un enerģijas atbalstam',
    usage: 'Sirds slimības, enerģijas trūkums, vecuma izmaiņas',
    dosage: {
      dog: '1-3 mg/kg dienā',
      cat: '1-2 mg/kg dienā'
    },
    sideEffects: ['Reti - kuņģa diskomforts'],
    contraindications: ['Antikoagulanta terapija (piesardzīgi)'],
    ingredients: ['Ubiquinone', 'Coenzyme Q10'],
    forSpecies: ['dog', 'cat'],
    prescriptionRequired: false
  },

  {
    id: 'lysine',
    name: 'L-Lizīns',
    category: 'supplements',
    description: 'Aminoskābe imunitātes stiprināšanai un vīrusu ierobežošanai',
    usage: 'Herpesvīrusa infekcijas kaķiem, imunitātes stiprināšana',
    dosage: {
      cat: '250-500 mg 2 reizes dienā',
      dog: '500-1000 mg dienā'
    },
    sideEffects: ['Kuņģa diskomforts lielās devās'],
    contraindications: ['Nav zināmas'],
    ingredients: ['L-Lysine hydrochloride'],
    forSpecies: ['cat', 'dog'],
    prescriptionRequired: false
  }
];