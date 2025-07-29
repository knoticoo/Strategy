import { Medicine } from '../../types';

export const digestive: Medicine[] = [
  {
    id: 'omeprazole',
    name: 'Omeprazole',
    category: 'digestive',
    description: 'Protonu sūkņa inhibitors kuņģa skābes samazināšanai',
    usage: 'Kuņģa čūlas, GERD, kuņģa skābes pārprodukcija',
    dosage: {
      dog: '0.5-1 mg/kg dienā',
      cat: '0.5-1 mg/kg dienā'
    },
    sideEffects: ['Caureja', 'Vemšana', 'Miegainība'],
    contraindications: ['Alerģija pret PPI', 'Aknu slimības'],
    ingredients: ['Omeprazole'],
    forSpecies: ['dog', 'cat'],
    prescriptionRequired: true
  },

  {
    id: 'famotidine',
    name: 'Famotidine (Pepcid)',
    category: 'digestive',
    description: 'H2 receptoru antagonists kuņģa skābes mazināšanai',
    usage: 'Kuņģa čūlas, skābes reflukss, kuņģa kairinājums',
    dosage: {
      dog: '0.25-0.5 mg/kg 2 reizes dienā',
      cat: '0.25-0.5 mg/kg 2 reizes dienā'
    },
    sideEffects: ['Miegainība', 'Caureja', 'Galvassāpes'],
    contraindications: ['Nieru slimības', 'Grūsnība'],
    ingredients: ['Famotidine'],
    forSpecies: ['dog', 'cat'],
    prescriptionRequired: false
  },

  {
    id: 'sucralfate',
    name: 'Sucralfate',
    category: 'digestive',
    description: 'Kuņģa gļotādas aizsargājošs līdzeklis',
    usage: 'Kuņģa un divpadsmitpirkstu zarnas čūlas, gļotādas bojājumi',
    dosage: {
      dog: '0.5-1 g 3-4 reizes dienā',
      cat: '0.25-0.5 g 3-4 reizes dienā'
    },
    sideEffects: ['Konstipācija', 'Kuņģa diskomforts'],
    contraindications: ['Nieru mazspēja'],
    ingredients: ['Sucralfate'],
    forSpecies: ['dog', 'cat'],
    prescriptionRequired: true
  },

  {
    id: 'loperamide',
    name: 'Loperamide',
    category: 'digestive',
    description: 'Pretcaurejas līdzeklis zarnu motilitātes samazināšanai',
    usage: 'Akūta caureja, zarnu iekaisuma sindroma simptomi',
    dosage: {
      dog: '0.1-0.2 mg/kg 2-3 reizes dienā'
    },
    sideEffects: ['Konstipācija', 'Miegainība', 'Vemšana'],
    contraindications: ['Kaķi (toksisks)', 'Akūts kolīts', 'Zarnu obstrukcija'],
    ingredients: ['Loperamide hydrochloride'],
    forSpecies: ['dog'],
    prescriptionRequired: false
  },

  {
    id: 'simethicone',
    name: 'Simethicone',
    category: 'digestive',
    description: 'Pretputošanās līdzeklis gāzu burbuļu sadalīšanai',
    usage: 'Meteorisms, gāzu uzkrāšanās, kuņģa uzpūšanās',
    dosage: {
      dog: '20-40 mg 3-4 reizes dienā',
      cat: '20 mg 2-3 reizes dienā',
      rabbit: '10-20 mg 2-3 reizes dienā'
    },
    sideEffects: ['Nav zināmas'],
    contraindications: ['Nav zināmas'],
    ingredients: ['Simethicone'],
    forSpecies: ['dog', 'cat', 'rabbit'],
    prescriptionRequired: false
  },

  {
    id: 'cisapride',
    name: 'Cisapride',
    category: 'digestive',
    description: 'Prokinetiķis zarnu motilitātes stimulēšanai',
    usage: 'Zarnu stāze, gastroparēze, konstipācija',
    dosage: {
      dog: '0.1-0.5 mg/kg 3 reizes dienā',
      cat: '0.1-0.5 mg/kg 3 reizes dienā',
      rabbit: '0.5 mg/kg 3 reizes dienā'
    },
    sideEffects: ['Caureja', 'Vemšana', 'Sāpes vēderā'],
    contraindications: ['Zarnu obstrukcija', 'Perforation', 'Sirds aritmijas'],
    ingredients: ['Cisapride'],
    forSpecies: ['dog', 'cat', 'rabbit'],
    prescriptionRequired: true
  },

  {
    id: 'lactulose',
    name: 'Lactulose',
    category: 'digestive',
    description: 'Osmotisks laksatīvs konstipācijas ārstēšanai',
    usage: 'Konstipācija, hepatiskā encefalopātija',
    dosage: {
      dog: '1-3 ml/kg 2-3 reizes dienā',
      cat: '1-3 ml/kg 2-3 reizes dienā'
    },
    sideEffects: ['Caureja', 'Meteorisms', 'Sāpes vēderā'],
    contraindications: ['Zarnu obstrukcija', 'Galaktozēmija'],
    ingredients: ['Lactulose'],
    forSpecies: ['dog', 'cat'],
    prescriptionRequired: false
  },

  {
    id: 'psyllium',
    name: 'Psyllium (Blusas sēklu čaumalas)',
    category: 'digestive',
    description: 'Šķīstošās škiedrvielas avots zarnu veselībai',
    usage: 'Konstipācija, caureja, zarnu veselības uzturēšana',
    dosage: {
      dog: '1-4 tējkarotes dienā ar ūdeni',
      cat: '1/4-1 tējkarote dienā ar ūdeni',
      rabbit: '1/4 tējkarote dienā'
    },
    sideEffects: ['Meteorisms', 'Zarnu obstrukcija ja nepietiek šķidruma'],
    contraindications: ['Zarnu obstrukcija', 'Rīšanas grūtības'],
    ingredients: ['Psyllium husk'],
    forSpecies: ['dog', 'cat', 'rabbit'],
    prescriptionRequired: false
  }
];