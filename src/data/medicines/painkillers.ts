import { Medicine } from '../../types';

export const painkillers: Medicine[] = [
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

  {
    id: 'carprofen',
    name: 'Carprofen (Rimadyl)',
    category: 'painkillers',
    description: 'NSAID sāpju un iekaisuma kontrolei suniem',
    usage: 'Osteoartīts, pēcoperācijas sāpes, hroniskas sāpes',
    dosage: {
      dog: '2-4 mg/kg dienā, sadalīts 1-2 devās'
    },
    sideEffects: ['Kuņģa-zarnu traucējumi', 'Aknu enzīmu paaugstināšanās', 'Nieru disfunkcija'],
    contraindications: ['Aknu slimības', 'Nieru mazspēja', 'Asiņošanas traucējumi'],
    ingredients: ['Carprofen'],
    forSpecies: ['dog'],
    prescriptionRequired: true
  },

  {
    id: 'tramadol',
    name: 'Tramadol',
    category: 'painkillers',
    description: 'Opiātu analgētiķis vidēji stiprām līdz stiprām sāpēm',
    usage: 'Hroniskas sāpes, pēcoperācijas sāpju kontrole, vēža sāpes',
    dosage: {
      dog: '2-5 mg/kg 2-3 reizes dienā',
      cat: '1-4 mg/kg 2-3 reizes dienā'
    },
    sideEffects: ['Miegainība', 'Vemšana', 'Konstipācija', 'Reibonis'],
    contraindications: ['Galvas traumas', 'Elpošanas depresija', 'Epilepsija'],
    ingredients: ['Tramadol hydrochloride'],
    forSpecies: ['dog', 'cat'],
    prescriptionRequired: true
  },

  {
    id: 'gabapentin',
    name: 'Gabapentin',
    category: 'painkillers',
    description: 'Pretkonvulsīvs līdzeklis, kas izmantots neiropātisko sāpju ārstēšanai',
    usage: 'Neiropātiskas sāpes, trauksmes mazināšana, epilepsijas papildu ārstēšana',
    dosage: {
      dog: '10-20 mg/kg 2-3 reizes dienā',
      cat: '5-10 mg/kg 2-3 reizes dienā'
    },
    sideEffects: ['Miegainība', 'Ataksija', 'Reibonis'],
    contraindications: ['Nieru mazspēja (deva jāsamazina)'],
    ingredients: ['Gabapentin'],
    forSpecies: ['dog', 'cat'],
    prescriptionRequired: true
  },

  {
    id: 'firocoxib',
    name: 'Firocoxib (Previcox)',
    category: 'painkillers',
    description: 'COX-2 selektīvs inhibitors suniem',
    usage: 'Osteoartīta sāpju un iekaisuma kontrole',
    dosage: {
      dog: '5 mg/kg dienā'
    },
    sideEffects: ['Kuņģa-zarnu traucējumi', 'Nieru disfunkcija', 'Aknu problēmas'],
    contraindications: ['Kuņģa čūlas', 'Nieru/aknu slimības', 'Sirds mazspēja'],
    ingredients: ['Firocoxib'],
    forSpecies: ['dog'],
    prescriptionRequired: true
  },

  {
    id: 'buprenorphine',
    name: 'Buprenorphine',
    category: 'painkillers',
    description: 'Daļējs opiātu agonists stipru sāpju ārstēšanai',
    usage: 'Pēcoperācijas sāpes, akūtas sāpes, vēža sāpes',
    dosage: {
      dog: '0.01-0.03 mg/kg 3-4 reizes dienā',
      cat: '0.01-0.03 mg/kg 2-3 reizes dienā',
      rabbit: '0.02-0.05 mg/kg 2-3 reizes dienā'
    },
    sideEffects: ['Elpošanas depresija', 'Miegainība', 'Konstipācija'],
    contraindications: ['Smaga elpošanas nepietiekamība', 'Galvas traumas'],
    ingredients: ['Buprenorphine hydrochloride'],
    forSpecies: ['dog', 'cat', 'rabbit'],
    prescriptionRequired: true
  }
];