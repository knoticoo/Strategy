import { Medicine } from '../../types';

export const antibiotics: Medicine[] = [
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

  {
    id: 'cephalexin',
    name: 'Cephalexin',
    category: 'antibiotics',
    description: 'Cefalosporīna grupas antibiotika ādas un mīksto audu infekcijām',
    usage: 'Ādas infekcijas, brūču ārstēšana, pēcoperācijas profilakse',
    dosage: {
      dog: '15-25 mg/kg 2 reizes dienā',
      cat: '15-20 mg/kg 2 reizes dienā'
    },
    sideEffects: ['Kuņģa diskomforts', 'Caureja', 'Alerģiskas reakcijas'],
    contraindications: ['Alerģija pret cefalosporīniem', 'Nieru slimības'],
    ingredients: ['Cephalexin monohydrate'],
    forSpecies: ['dog', 'cat'],
    prescriptionRequired: true
  },

  {
    id: 'enrofloxacin',
    name: 'Enrofloxacin (Baytril)',
    category: 'antibiotics',
    description: 'Fluorohinolona grupas antibiotika plašam spektram',
    usage: 'Urīnceļu infekcijas, elpceļu infekcijas, zarnu infekcijas',
    dosage: {
      dog: '5-20 mg/kg dienā',
      cat: '5 mg/kg dienā',
      bird: '15 mg/kg 2 reizes dienā',
      rabbit: '10-20 mg/kg dienā'
    },
    sideEffects: ['Kuņģa traucējumi', 'Skrimšļa bojājumi jauniem dzīvniekiem'],
    contraindications: ['Vecums zem 1 gada', 'Grūsnība', 'Epilepsija'],
    ingredients: ['Enrofloxacin'],
    forSpecies: ['dog', 'cat', 'bird', 'rabbit'],
    prescriptionRequired: true
  },

  {
    id: 'metronidazole',
    name: 'Metronidazole',
    category: 'antibiotics',
    description: 'Pretmikrobu līdzeklis anaerobo baktēriju un parazītu ārstēšanai',
    usage: 'Zarnu infekcijas, Giardia, anaerobo baktēriju infekcijas',
    dosage: {
      dog: '10-25 mg/kg 2 reizes dienā',
      cat: '10-15 mg/kg 2 reizes dienā',
      bird: '20 mg/kg 2 reizes dienā'
    },
    sideEffects: ['Vemšana', 'Neirologiski traucējumi lielās devās', 'Apetītes zudums'],
    contraindications: ['Grūsnība', 'Aknu slimības', 'Neirologiski traucējumi'],
    ingredients: ['Metronidazole'],
    forSpecies: ['dog', 'cat', 'bird'],
    prescriptionRequired: true
  }
];