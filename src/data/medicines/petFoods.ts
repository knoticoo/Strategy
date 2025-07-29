import { Medicine } from '../../types';

export const petFoods: Medicine[] = [
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

  {
    id: 'hills-urinary-care',
    name: "Hill's Prescription Diet c/d",
    category: 'food',
    description: 'Urīnceļu veselības atbalsta barība',
    usage: 'Urīnpūšļa akmeņi, cistīts, urīnceļu infekcijas',
    dosage: {
      dog: 'Atkarībā no svara: 140-420g dienā',
      cat: '55-85g dienā atkarībā no svara'
    },
    sideEffects: ['Sākumā iespējama barības atteikšana'],
    contraindications: ['Grūsnība', 'Zīdīšanas periods', 'Augšanas periods'],
    ingredients: ['Kontrolēts minerālvielu līmenis', 'Antioxidanti', 'Omega-3'],
    forSpecies: ['dog', 'cat'],
    prescriptionRequired: true
  },

  {
    id: 'royal-canin-hypoallergenic',
    name: 'Royal Canin Hypoallergenic',
    category: 'food',
    description: 'Hipoalerģēna barība pārtikas alerģiju gadījumā',
    usage: 'Pārtikas alerģijas, ādas problēmas, gremošanas traucējumi',
    dosage: {
      dog: 'Atkarībā no svara: 110-350g dienā',
      cat: '45-75g dienā atkarībā no svara'
    },
    sideEffects: ['Nav zināmas'],
    contraindications: ['Nav zināmas'],
    ingredients: ['Hidrolizētas olbaltumvielas', 'Rīsi', 'Augu eļļas'],
    forSpecies: ['dog', 'cat'],
    prescriptionRequired: true
  },

  {
    id: 'hills-metabolic',
    name: "Hill's Prescription Diet Metabolic",
    category: 'food',
    description: 'Svara kontroles barība aptaukošanās gadījumā',
    usage: 'Aptaukošanās, svara samazināšana, diabēta kontrole',
    dosage: {
      dog: 'Atkarībā no mērķa svara: 90-280g dienā',
      cat: '35-65g dienā atkarībā no mērķa svara'
    },
    sideEffects: ['Sākumā iespējams paaugstināts apetīts'],
    contraindications: ['Grūsnība', 'Zīdīšanas periods', 'Augšanas periods'],
    ingredients: ['Augsts šķiedrvielu saturs', 'L-karnitīns', 'Antioxidanti'],
    forSpecies: ['dog', 'cat'],
    prescriptionRequired: true
  },

  {
    id: 'purina-fortiflora',
    name: 'Purina Pro Plan FortiFlora',
    category: 'food',
    description: 'Probiotiku papildinājums zarnu veselībai',
    usage: 'Gremošanas traucējumi, antibiotikas terapijas atbalsts, stress',
    dosage: {
      dog: '1 paciņa dienā ar ēdienu',
      cat: '1 paciņa dienā ar ēdienu'
    },
    sideEffects: ['Nav zināmas'],
    contraindications: ['Nav zināmas'],
    ingredients: ['Enterococcus faecium', 'Vitamīni', 'Antioxidanti'],
    forSpecies: ['dog', 'cat'],
    prescriptionRequired: false
  },

  {
    id: 'oxbow-critical-care',
    name: 'Oxbow Critical Care',
    category: 'food',
    description: 'Īpaša barība slimiem vai atveseļojošiem grauzējiem',
    usage: 'Pēcoperācijas periods, slimība, svara zudums, barības atteikšana',
    dosage: {
      rabbit: '10-15ml/100g ķermeņa svara 3-4 reizes dienā',
      guinea_pig: '10-15ml/100g ķermeņa svara 3-4 reizes dienā',
      hamster: '5-10ml/100g ķermeņa svara 3-4 reizes dienā'
    },
    sideEffects: ['Nav zināmas'],
    contraindications: ['Nav zināmas'],
    ingredients: ['Timothy siens', 'Stabilizēti vitamīni', 'Prebiotiki'],
    forSpecies: ['rabbit', 'guinea_pig', 'hamster'],
    prescriptionRequired: false
  },

  {
    id: 'versele-laga-complete',
    name: 'Versele-Laga Complete Cuni',
    category: 'food',
    description: 'Pilnvērtīga granulētā barība truškošiem',
    usage: 'Ikdienas barošana, sabalansēta uztura nodrošināšana',
    dosage: {
      rabbit: '25-80g dienā atkarībā no svara un aktivitātes'
    },
    sideEffects: ['Nav zināmas'],
    contraindications: ['Nav zināmas'],
    ingredients: ['Timothy siens', 'Dārzeņi', 'Vitamīni', 'Minerālvielas'],
    forSpecies: ['rabbit'],
    prescriptionRequired: false
  },

  {
    id: 'zupreem-pellets',
    name: 'ZuPreem Natural Pellets',
    category: 'food',
    description: 'Dabīga granulētā barība putniem',
    usage: 'Ikdienas barošana, sabalansēta uztura nodrošināšana',
    dosage: {
      bird: 'Atkarībā no putna lieluma: 1-4 ēdamkarotes dienā'
    },
    sideEffects: ['Nav zināmas'],
    contraindications: ['Nav zināmas'],
    ingredients: ['Veseli graudaugi', 'Vitamīni', 'Minerālvielas', 'Aminoskābes'],
    forSpecies: ['bird'],
    prescriptionRequired: false
  },

  {
    id: 'tetra-goldfish-flakes',
    name: 'Tetra Goldfish Flakes',
    category: 'food',
    description: 'Speciāla barība zeltainajām zivtiņām',
    usage: 'Ikdienas barošana, krāsu uzlabošana, imunitātes stiprināšana',
    dosage: {
      fish: 'Mazs daudzums 2-3 reizes dienā, ko zivis apēd 2-3 minūtēs'
    },
    sideEffects: ['Ūdens piesārņošana ja pārbarot'],
    contraindications: ['Nav zināmas'],
    ingredients: ['Zivju milti', 'Augu olbaltumvielas', 'Vitamīni', 'Karotinoīdi'],
    forSpecies: ['fish'],
    prescriptionRequired: false
  }
];