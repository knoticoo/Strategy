import { PetSpecies } from '../../types';
import { SymptomAnalysis } from './symptomAnalyzer';

export interface TreatmentRecommendation {
  assessment: string;
  possibleCauses: string[];
  recommendations: string[];
  suggestedMedicines: string[];
  dietaryAdvice: string[];
  whenToSeeVet: string;
  urgencyLevel: 'low' | 'medium' | 'high' | 'emergency';
}

const petSpeciesInfo = {
  dog: {
    name: 'suns',
    commonIssues: ['matu izkrišana', 'gremošanas problēmas', 'ādas kairinājums', 'ausu infekcijas'],
    avgWeight: '5-50kg',
    lifespan: '10-15 gadi'
  },
  cat: {
    name: 'kaķis',
    commonIssues: ['urīnceļu problēmas', 'spalvas izkrišana', 'vemšana', 'zobu problēmas'],
    avgWeight: '3-7kg',
    lifespan: '12-18 gadi'
  },
  bird: {
    name: 'putns',
    commonIssues: ['elpošanas problēmas', 'spalvu izkrišana', 'uzvedības izmaiņas', 'knābja problēmas'],
    avgWeight: '0.02-2kg',
    lifespan: '5-100 gadi'
  },
  rabbit: {
    name: 'trusis',
    commonIssues: ['gremošanas traucējumi', 'zobu problēmas', 'ādas parazīti', 'urīnceļu infekcijas'],
    avgWeight: '1-5kg',
    lifespan: '8-12 gadi'
  },
  hamster: {
    name: 'kāmis',
    commonIssues: ['mitrās astes', 'audzēji', 'ādas problēmas', 'zobu problēmas'],
    avgWeight: '0.1-0.2kg',
    lifespan: '2-3 gadi'
  },
  guinea_pig: {
    name: 'jūras cūciņa',
    commonIssues: ['C vitamīna trūkums', 'elpošanas problēmas', 'ādas problēmas', 'zobu problēmas'],
    avgWeight: '0.7-1.2kg',
    lifespan: '4-8 gadi'
  },
  fish: {
    name: 'zivs',
    commonIssues: ['ūdens kvalitātes problēmas', 'sēnīšu infekcijas', 'parazīti', 'uzvedības izmaiņas'],
    avgWeight: '0.001-10kg',
    lifespan: '1-20 gadi'
  },
  reptile: {
    name: 'rāpulis',
    commonIssues: ['ādas nomešanas problēmas', 'metaboliskas kaulu slimības', 'parazīti', 'temperatūras stress'],
    avgWeight: '0.01-100kg',
    lifespan: '5-50 gadi'
  }
};

export const generateTreatmentRecommendations = (
  _query: string, 
  species: PetSpecies, 
  symptomAnalysis: SymptomAnalysis
): TreatmentRecommendation => {
  const speciesInfo = petSpeciesInfo[species];
  let assessment = `Pamatojoties uz jūsu aprakstu par ${speciesInfo.name}, `;
  let possibleCauses: string[] = [];
  let recommendations: string[] = [];
  let suggestedMedicines: string[] = [];
  let dietaryAdvice: string[] = [];

  // Generate recommendations based on symptom category
  switch (symptomAnalysis.category) {
    case 'skin':
      assessment += 'šķiet, ka jūsu mājdzīvniekam ir ādas vai spalvas problēmas.';
      possibleCauses = [
        'Alerģiskas reakcijas (pārtika, vides faktori)',
        'Parazīti (bluses, ērces, ādas ērces)',
        'Hormonu disbalanss',
        'Stress vai uzvedības problēmas',
        'Sēnīšu vai bakteriālu infekciju',
        'Uztura trūkums (omega-3, vitamīni)'
      ];
      recommendations = [
        'Pārbaudiet, vai nav parazītu (bluses, ērces)',
        'Novērtējiet pēdējās izmaiņas uzturā vai vidē',
        'Nodrošiniet kvalitatīvu uzturu ar omega-3 taukskābēm',
        'Maziniet stresa faktorus',
        'Regulāri ķemmējiet un pārbaudiet ādu'
      ];
      suggestedMedicines = ['omega-3', 'frontline-plus', 'chlorhexidine-shampoo', 'aloe-vera-gel'];
      dietaryAdvice = [
        'Pievienojiet omega-3 taukskābes uzturā',
        'Izvairieties no zināmiem alerģēniem',
        'Nodrošiniet augstas kvalitātes olbaltumvielas'
      ];
      break;

    case 'digestive':
      assessment += 'ir novērojamas gremošanas sistēmas problēmas.';
      possibleCauses = [
        'Uztura nepanesamība vai alerģijas',
        'Zarnu infekcijas vai parazīti',
        'Stress vai vides izmaiņas',
        'Barības kvalitātes problēmas',
        'Kuņģa-zarnu trakta iekaisums',
        'Toksīnu iedarbība'
      ];
      recommendations = [
        'Nodrošiniet pietiekamu šķidruma daudzumu',
        'Piedāvājiet viegli sagremojamu barību',
        'Uzraugiet simptomu izmaiņas',
        'Izvairieties no barības izmaiņām',
        'Nodrošiniet klusu, drošu vidi'
      ];
      suggestedMedicines = ['probiotics-paste', 'famotidine', 'psyllium', 'royal-canin-digestive'];
      dietaryAdvice = [
        'Piedāvājiet mazas, biežas porcijas',
        'Izmantojiet viegli sagremojamu barību',
        'Pievienojiet probiotikus'
      ];
      break;

    case 'respiratory':
      assessment += 'ir novērojamas elpošanas sistēmas problēmas.';
      possibleCauses = [
        'Augšējo elpceļu infekcijas',
        'Alerģiskas reakcijas',
        'Ārējie kairinātāji (dūmi, putekļi)',
        'Sirds problēmas',
        'Plaušu infekcijas',
        'Elpceļu obstrukcija'
      ];
      recommendations = [
        'Nodrošiniet tīru, mitru gaisu',
        'Izvairieties no kairinātājiem',
        'Uzraugiet elpošanas biežumu',
        'Nodrošiniet klusu vidi',
        'Nekavējoties vērsieties pie veterinārārsta'
      ];
      suggestedMedicines = ['vitamin-c', 'lysine'];
      dietaryAdvice = [
        'Nodrošiniet vieglu, uzturvielām bagātu barību',
        'Pievienojiet imunitāti stiprinošus papildinājumus'
      ];
      break;

    case 'urinary':
      assessment += 'ir novērojamas urīnceļu problēmas.';
      possibleCauses = [
        'Urīnceļu infekcijas',
        'Urīnpūšļa akmeņi',
        'Nieru problēmas',
        'Diabēts',
        'Stress',
        'Nepietiekams šķidruma daudzums'
      ];
      recommendations = [
        'Nodrošiniet pastāvīgu piekļuvi tīram ūdenim',
        'Uzraugiet urināšanas biežumu',
        'Pārbaudiet urīna krāsu un smaržu',
        'Samaziniet stresa faktorus',
        'Konsultējieties ar veterinārārstu'
      ];
      suggestedMedicines = ['cranberry-extract', 'hills-urinary-care'];
      dietaryAdvice = [
        'Palieliniet šķidruma patēriņu',
        'Izmantojiet urīnceļu veselībai paredzētu barību',
        'Samaziniet minerālvielu daudzumu'
      ];
      break;

    case 'behavioral':
      assessment += 'ir novērojamas uzvedības izmaiņas.';
      possibleCauses = [
        'Slimība vai sāpes',
        'Stress vai trauksme',
        'Vides izmaiņas',
        'Vecuma saistītas izmaiņas',
        'Hormonu izmaiņas',
        'Neirologiskas problēmas'
      ];
      recommendations = [
        'Novērojiet citus simptomus',
        'Nodrošiniet klusu, drošu vidi',
        'Saglabājiet ierasto rutīnu',
        'Pārbaudiet fizisko aktivitāti',
        'Dokumentējiet izmaiņas'
      ];
      suggestedMedicines = ['vitamin-b-complex', 'probiotics-paste'];
      dietaryAdvice = [
        'Nodrošiniet viegli sagremojamu barību',
        'Pievienojiet probiotikus stresa mazināšanai'
      ];
      break;

    default:
      assessment += 'ir nepieciešama sīkāka analīze.';
      possibleCauses = [
        'Dažādi faktori var ietekmēt mājdzīvnieka veselību',
        'Nepieciešama detalizētāka simptomu novērtēšana'
      ];
      recommendations = [
        'Detalizēti aprakstiet visus novērotos simptomus',
        'Fiksējiet simptomu ilgumu un intensitāti',
        'Novērtējiet ēšanas un dzeršanas paradumus',
        'Pārbaudiet fizisko aktivitāti'
      ];
      suggestedMedicines = ['vitamin-b-complex', 'multivitamin'];
      dietaryAdvice = ['Nodrošiniet kvalitatīvu, sabalansētu uzturu'];
  }

  const whenToSeeVet = symptomAnalysis.urgencyLevel === 'emergency' ? 
    'Nekavējoties vērsieties pie veterinārārsta!' :
    symptomAnalysis.urgencyLevel === 'high' ?
    'Ieteicams konsultēties ar veterinārārstu šodien vai rīt.' :
    symptomAnalysis.urgencyLevel === 'medium' ?
    'Ieteicams konsultēties ar veterinārārstu 1-2 dienu laikā.' :
    'Ja simptomi turpinās vai pasliktinās, konsultējieties ar veterinārārstu.';

  return {
    assessment,
    possibleCauses,
    recommendations,
    suggestedMedicines,
    dietaryAdvice,
    whenToSeeVet,
    urgencyLevel: symptomAnalysis.urgencyLevel
  };
};