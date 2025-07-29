import { Medicine } from '../../types';

export const vitamins: Medicine[] = [
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
    id: 'vitamin-c',
    name: 'C vitamīns (Askorbīnskābe)',
    category: 'vitamins',
    description: 'Ūdenī šķīstošs vitamīns imunitātes stiprināšanai',
    usage: 'Imunitātes stiprināšana, stress, C vitamīna trūkums',
    dosage: {
      guinea_pig: '30-50 mg dienā (obligāti nepieciešams)',
      rabbit: '10-30 mg dienā',
      bird: '5-10 mg dienā'
    },
    sideEffects: ['Lielās devās - caureja', 'Urīnpūšļa akmeņi'],
    contraindications: ['Nieru akmeņi anamnēzē'],
    ingredients: ['Ascorbic acid'],
    forSpecies: ['guinea_pig', 'rabbit', 'bird'],
    prescriptionRequired: false
  },

  {
    id: 'vitamin-d3',
    name: 'D3 vitamīns (Holekalciferols)',
    category: 'vitamins',
    description: 'Kalcija un fosfora metabolisma regulators',
    usage: 'Kaulu slimību profilakse, rachīts, metaboliskas kaulu slimības',
    dosage: {
      dog: '400-800 IU dienā',
      cat: '200-400 IU dienā',
      bird: '100-200 IU dienā',
      reptile: '200-400 IU dienā (vai UV apgaismojums)'
    },
    sideEffects: ['Hiperkacēmija lielās devās', 'Nieru bojājumi'],
    contraindications: ['Hiperkacēmija', 'Nieru slimības'],
    ingredients: ['Cholecalciferol'],
    forSpecies: ['dog', 'cat', 'bird', 'reptile'],
    prescriptionRequired: false
  },

  {
    id: 'vitamin-e',
    name: 'E vitamīns (Tokoferols)',
    category: 'vitamins',
    description: 'Antioksidants šūnu aizsardzībai',
    usage: 'Muskuļu slimības, reproduktīvās problēmas, ādas veselība',
    dosage: {
      dog: '10-50 IU dienā atkarībā no svara',
      cat: '10-30 IU dienā'
    },
    sideEffects: ['Reti - asiņošanas traucējumi lielās devās'],
    contraindications: ['Antikoagulanta terapija'],
    ingredients: ['Alpha-tocopherol'],
    forSpecies: ['dog', 'cat'],
    prescriptionRequired: false
  },

  {
    id: 'calcium-supplement',
    name: 'Kalcija papildinājums',
    category: 'vitamins',
    description: 'Kalcija avots kaulu un zobu veselībai',
    usage: 'Kalcija trūkums, grūsnība, zīdīšana, augšana',
    dosage: {
      dog: '50-90 mg/kg dienā',
      cat: '50-90 mg/kg dienā',
      rabbit: '100-200 mg dienā',
      guinea_pig: '100-200 mg dienā',
      bird: '50-100 mg dienā'
    },
    sideEffects: ['Konstipācija', 'Hiperkacēmija lielās devās'],
    contraindications: ['Nieru akmeņi', 'Hiperkacēmija'],
    ingredients: ['Calcium carbonate', 'Calcium gluconate'],
    forSpecies: ['dog', 'cat', 'rabbit', 'guinea_pig', 'bird'],
    prescriptionRequired: false
  },

  {
    id: 'multivitamin',
    name: 'Multivitamīnu komplekss',
    category: 'vitamins',
    description: 'Pilnvērtīgs vitamīnu un minerālvielu komplekss',
    usage: 'Vispārēja veselības uzlabošana, uztura papildināšana',
    dosage: {
      dog: 'Atkarībā no svara - sekot ražotāja norādījumiem',
      cat: 'Atkarībā no svara - sekot ražotāja norādījumiem',
      rabbit: '1/4 no suņa devas',
      guinea_pig: '1/4 no suņa devas',
      bird: '1/8 no suņa devas'
    },
    sideEffects: ['Reti - kuņģa diskomforts'],
    contraindications: ['Alerģija pret kādu no sastāvdaļām'],
    ingredients: ['Vitamīni A, D, E, C, B komplekss', 'Minerālvielas', 'Aminoskābes'],
    forSpecies: ['dog', 'cat', 'rabbit', 'guinea_pig', 'bird'],
    prescriptionRequired: false
  }
];