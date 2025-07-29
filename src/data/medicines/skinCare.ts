import { Medicine } from '../../types';

export const skinCare: Medicine[] = [
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
  },

  {
    id: 'ketoconazole-shampoo',
    name: 'Ketoconazole šampūns',
    category: 'skin_care',
    description: 'Pretseņu šampūns Malassezia un citām sēnītēm',
    usage: 'Sēnīšu dermatīts, Malassezia, seborejas dermatīts',
    dosage: {
      dog: 'Mazgāt 2 reizes nedēļā 2-4 nedēļas',
      cat: 'Mazgāt 1-2 reizes nedēļā'
    },
    sideEffects: ['Ādas kairinājums', 'Sausums'],
    contraindications: ['Alerģija pret ketoconazole', 'Ādas bojājumi'],
    ingredients: ['Ketoconazole 2%', 'Mīkstinātāji'],
    forSpecies: ['dog', 'cat'],
    prescriptionRequired: false
  },

  {
    id: 'hydrocortisone-cream',
    name: 'Hidrokortizons krēms',
    category: 'skin_care',
    description: 'Pretiekaisuma krēms ādas kairinājumam',
    usage: 'Ādas kairinājums, alerģisks dermatīts, insektu kodumi',
    dosage: {
      dog: 'Uzklāt plānu kārtu 2-3 reizes dienā',
      cat: 'Uzklāt plānu kārtu 1-2 reizes dienā'
    },
    sideEffects: ['Ādas plānināšanās ilgstošā lietošanā', 'Sistēmiska ietekme'],
    contraindications: ['Vīrusu vai sēnīšu infekcijas', 'Brūces'],
    ingredients: ['Hydrocortisone 1%'],
    forSpecies: ['dog', 'cat'],
    prescriptionRequired: false
  },

  {
    id: 'mupirocin-ointment',
    name: 'Mupirocin ziede',
    category: 'skin_care',
    description: 'Antibakteriāla ziede ādas infekcijām',
    usage: 'Bakteriālas ādas infekcijas, pioderma, brūču infekcijas',
    dosage: {
      dog: 'Uzklāt 2-3 reizes dienā 7-10 dienas',
      cat: 'Uzklāt 2 reizes dienā 7-10 dienas'
    },
    sideEffects: ['Vietējs kairinājums', 'Alerģiskas reakcijas'],
    contraindications: ['Alerģija pret mupirocin'],
    ingredients: ['Mupirocin 2%'],
    forSpecies: ['dog', 'cat'],
    prescriptionRequired: true
  },

  {
    id: 'silver-sulfadiazine',
    name: 'Sudraba sulfadiazīns',
    category: 'skin_care',
    description: 'Antimikrobu krēms apdegumu un brūču ārstēšanai',
    usage: 'Apdegumi, brūces, ādas čūlas, infekciju profilakse',
    dosage: {
      dog: 'Uzklāt plānu kārtu 1-2 reizes dienā',
      cat: 'Uzklāt plānu kārtu 1 reizi dienā',
      rabbit: 'Uzklāt plānu kārtu 1 reizi dienā'
    },
    sideEffects: ['Ādas kairinājums', 'Alerģiskas reakcijas'],
    contraindications: ['Alerģija pret sulfamidiem', 'Grūsnība'],
    ingredients: ['Silver sulfadiazine 1%'],
    forSpecies: ['dog', 'cat', 'rabbit'],
    prescriptionRequired: true
  },

  {
    id: 'betamethasone-cream',
    name: 'Betametazon krēms',
    category: 'skin_care',
    description: 'Spēcīgs kortikosteroīds iekaisuma kontrolei',
    usage: 'Smags dermatīts, alerģiskas reakcijas, autoimūnas ādas slimības',
    dosage: {
      dog: 'Uzklāt plānu kārtu 1-2 reizes dienā īslaicīgi',
      cat: 'Uzklāt plānu kārtu 1 reizi dienā īslaicīgi'
    },
    sideEffects: ['Ādas atrofija', 'Sistēmiska ietekme', 'Imunitātes nomākums'],
    contraindications: ['Infekcijas', 'Brūces', 'Ilgstoša lietošana'],
    ingredients: ['Betamethasone valerate 0.1%'],
    forSpecies: ['dog', 'cat'],
    prescriptionRequired: true
  },

  {
    id: 'aloe-vera-gel',
    name: 'Aloe Vera gēls',
    category: 'skin_care',
    description: 'Dabīgs mīkstinošs un dziedinošs gēls',
    usage: 'Ādas kairinājums, apdegumi, sausā āda, brūču dzīšana',
    dosage: {
      dog: 'Uzklāt pēc nepieciešamības',
      cat: 'Uzklāt pēc nepieciešamības',
      rabbit: 'Uzklāt pēc nepieciešamības',
      guinea_pig: 'Uzklāt pēc nepieciešamības'
    },
    sideEffects: ['Reti - alerģiskas reakcijas'],
    contraindications: ['Alerģija pret aloe'],
    ingredients: ['Aloe barbadensis extract'],
    forSpecies: ['dog', 'cat', 'rabbit', 'guinea_pig'],
    prescriptionRequired: false
  },

  {
    id: 'oatmeal-shampoo',
    name: 'Auzu šampūns',
    category: 'skin_care',
    description: 'Mīkstinošs šampūns jutīgai ādai',
    usage: 'Jutīga āda, sausums, kairinājums, alerģisks dermatīts',
    dosage: {
      dog: 'Mazgāt 1-2 reizes nedēļā',
      cat: 'Mazgāt 1 reizi nedēļā'
    },
    sideEffects: ['Nav zināmas'],
    contraindications: ['Alerģija pret auzām'],
    ingredients: ['Colloidal oatmeal', 'Mīkstinātāji'],
    forSpecies: ['dog', 'cat'],
    prescriptionRequired: false
  }
];