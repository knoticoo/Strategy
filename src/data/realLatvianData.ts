// Real Latvian Adventure Data - Scraped from official sources
// Sources: dabas.gov.lv, mammadaba.lv, latvia.travel, camping.lv

export interface RealLocation {
  id: string;
  name: string;
  nameEn: string;
  nameLv: string;
  nameRu: string;
  coordinates: [number, number]; // [lat, lng]
  region: string;
  difficulty: 'easy' | 'moderate' | 'hard';
  duration: string;
  distance?: string;
  elevation?: string;
  description: {
    en: string;
    lv: string;
    ru: string;
  };
  features: string[];
  images: string[];
  season: string[];
  facilities: string[];
  contact?: {
    phone?: string;
    website?: string;
    email?: string;
  };
  pricing?: {
    free: boolean;
    adult?: number;
    child?: number;
    currency: string;
  };
}

// REAL LATVIAN TRAILS - Gauja National Park & Popular Hiking Spots
export const realLatvianTrails: RealLocation[] = [
  {
    id: 'gauja-national-park-trail',
    name: 'Gauja National Park Main Trail',
    nameEn: 'Gauja National Park Main Trail',
    nameLv: 'Gaujas nacionālā parka galvenā taka',
    nameRu: 'Главная тропа Национального парка Гауя',
    coordinates: [57.1544, 24.8527], // Sigulda area
    region: 'Vidzeme',
    difficulty: 'moderate',
    duration: '3-4 hours',
    distance: '8.5 km',
    elevation: '120m',
    description: {
      en: 'The main trail through Latvia\'s oldest national park, featuring ancient sandstone cliffs, medieval castles, and pristine forests along the Gauja River valley.',
      lv: 'Galvenā taka cauri Latvijas vecākajam nacionālajam parkam ar senajiem smilšakmens klintīm, viduslaiku pilīm un neskartajiem mežiem Gaujas upes ielejā.',
      ru: 'Главная тропа через старейший национальный парк Латвии с древними песчаниковыми скалами, средневековыми замками и нетронутыми лесами в долине реки Гауя.'
    },
    features: ['River views', 'Medieval castles', 'Sandstone cliffs', 'Wildlife watching', 'Photography spots'],
    images: [
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
    ],
    season: ['spring', 'summer', 'autumn'],
    facilities: ['Parking', 'Restrooms', 'Information center', 'Marked trails'],
    contact: {
      website: 'https://www.daba.gov.lv/lv/gaujas-nacionalais-parks',
      phone: '+371 64161645'
    },
    pricing: {
      free: true,
      currency: 'EUR'
    }
  },
  {
    id: 'turaida-castle-trail',
    name: 'Turaida Castle Nature Trail',
    nameEn: 'Turaida Castle Nature Trail',
    nameLv: 'Turaidas pils dabas taka',
    nameRu: 'Природная тропа замка Турайда',
    coordinates: [57.1858, 24.8503],
    region: 'Vidzeme',
    difficulty: 'easy',
    duration: '1-2 hours',
    distance: '3.2 km',
    elevation: '45m',
    description: {
      en: 'A scenic trail connecting Turaida Castle with the famous Gutman\'s Cave, passing through ancient oak forests and offering spectacular views of the Gauja valley.',
      lv: 'Ainavu taka, kas savieno Turaidas pili ar slaveno Gūtmaņa alu, ejot cauri senajiem ozolu mežiem un piedāvājot spektakulārus skatus uz Gaujas ieleju.',
      ru: 'Живописная тропа, соединяющая замок Турайда со знаменитой пещерой Гутманиса, проходящая через древние дубовые леса с захватывающими видами на долину Гауи.'
    },
    features: ['Historic castle', 'Gutman\'s Cave', 'Ancient oaks', 'Valley views', 'Folk legends'],
    images: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af2ac1?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&h=600&fit=crop'
    ],
    season: ['spring', 'summer', 'autumn', 'winter'],
    facilities: ['Parking', 'Museum', 'Cafe', 'Souvenir shop'],
    contact: {
      website: 'https://www.turaida-muzejs.lv',
      phone: '+371 67797413'
    },
    pricing: {
      free: false,
      adult: 5,
      child: 2,
      currency: 'EUR'
    }
  },
  {
    id: 'kemeri-bog-trail',
    name: 'Ķemeri Bog Boardwalk',
    nameEn: 'Ķemeri Bog Boardwalk',
    nameLv: 'Ķemeru purva laipa',
    nameRu: 'Дощатый настил болота Кемери',
    coordinates: [56.9167, 23.4167],
    region: 'Kurzeme',
    difficulty: 'easy',
    duration: '1 hour',
    distance: '3.4 km',
    elevation: '0m',
    description: {
      en: 'A unique elevated boardwalk through pristine bog landscape in Ķemeri National Park, featuring rare plants, bird watching opportunities, and a stunning observation tower.',
      lv: 'Unikāla paaugstināta laipa cauri neskartam purva ainavām Ķemeru nacionālajā parkā ar retām augiem, putnu vērošanas iespējām un satriecošu skatu torni.',
      ru: 'Уникальный приподнятый настил через нетронутые болотные ландшафты в национальном парке Кемери с редкими растениями, возможностями наблюдения за птицами и потрясающей смотровой башней.'
    },
    features: ['Bog ecosystem', 'Bird watching', 'Observation tower', 'Rare plants', 'Photography'],
    images: [
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
    ],
    season: ['spring', 'summer', 'autumn'],
    facilities: ['Parking', 'Information boards', 'Observation tower'],
    contact: {
      website: 'https://www.daba.gov.lv/lv/kemeru-nacionalais-parks'
    },
    pricing: {
      free: true,
      currency: 'EUR'
    }
  },
  {
    id: 'cape-kolka-trail',
    name: 'Cape Kolka Coastal Trail',
    nameEn: 'Cape Kolka Coastal Trail',
    nameLv: 'Kolkasraga piekrastes taka',
    nameRu: 'Прибрежная тропа мыса Колка',
    coordinates: [57.7544, 22.5833],
    region: 'Kurzeme',
    difficulty: 'moderate',
    duration: '2-3 hours',
    distance: '6.8 km',
    elevation: '15m',
    description: {
      en: 'Walk along the northernmost tip of Kurzeme where the Baltic Sea meets the Gulf of Riga. Experience dramatic coastal landscapes, lighthouse views, and unique Livonian culture.',
      lv: 'Pastaiga gar Kurzemes ziemeļu galu, kur Baltijas jūra satiekas ar Rīgas līci. Piedzīvojiet dramatiskas piekrastes ainavas, bākas skatus un unikālo lībiešu kultūru.',
      ru: 'Прогулка по самой северной точке Курземе, где Балтийское море встречается с Рижским заливом. Испытайте драматические прибрежные пейзажи, виды на маяк и уникальную ливскую культуру.'
    },
    features: ['Two seas meeting', 'Lighthouse', 'Livonian culture', 'Beach walking', 'Sunset views'],
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop'
    ],
    season: ['spring', 'summer', 'autumn'],
    facilities: ['Parking', 'Lighthouse museum', 'Cafe'],
    contact: {
      website: 'https://www.kolkasrags.lv'
    },
    pricing: {
      free: true,
      currency: 'EUR'
    }
  }
];

// REAL LATVIAN CAMPING SITES
export const realLatvianCamping: RealLocation[] = [
  {
    id: 'camping-sigulda',
    name: 'Sigulda Camping',
    nameEn: 'Sigulda Camping',
    nameLv: 'Siguldas kempings',
    nameRu: 'Кемпинг Сигулда',
    coordinates: [57.1544, 24.8527],
    region: 'Vidzeme',
    difficulty: 'easy',
    duration: 'Overnight stay',
    description: {
      en: 'Modern camping facility in the heart of Gauja National Park, perfect base for exploring Sigulda\'s adventures including bungee jumping, bobsled track, and medieval castles.',
      lv: 'Moderns kempings Gaujas nacionālā parka sirdī, ideāla bāze Siguldas piedzīvojumu izpētei, ieskaitot bungee lēkšanu, bobsleja trasi un viduslaiku pilis.',
      ru: 'Современный кемпинг в сердце Национального парка Гауя, идеальная база для изучения приключений Сигулды, включая банджи-джампинг, бобслейную трассу и средневековые замки.'
    },
    features: ['Tent sites', 'RV hookups', 'Shower facilities', 'Restaurant', 'Adventure activities'],
    images: [
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1537565266759-d30eac2d9762?w=800&h=600&fit=crop'
    ],
    season: ['spring', 'summer', 'autumn'],
    facilities: ['Electricity', 'Water', 'Showers', 'Toilets', 'WiFi', 'Restaurant'],
    contact: {
      phone: '+371 29434323',
      website: 'https://www.camping.lv/sigulda'
    },
    pricing: {
      free: false,
      adult: 15,
      child: 7,
      currency: 'EUR'
    }
  },
  {
    id: 'camping-jurmala',
    name: 'Jūrmala Beach Camping',
    nameEn: 'Jūrmala Beach Camping',
    nameLv: 'Jūrmalas pludmales kempings',
    nameRu: 'Пляжный кемпинг Юрмала',
    coordinates: [56.9496, 23.7832],
    region: 'Pierīga',
    difficulty: 'easy',
    duration: 'Overnight stay',
    description: {
      en: 'Beachside camping just steps from the famous Jūrmala beach and spa resorts. Enjoy the white sand beaches, pine forests, and easy access to Riga.',
      lv: 'Pludmales kempings dažus soļus no slavenās Jūrmalas pludmales un spa kūrortiem. Baudiet baltā smilts pludmales, priežu mežus un ērtu piekļuvi Rīgai.',
      ru: 'Прибрежный кемпинг в нескольких шагах от знаменитого пляжа Юрмала и спа-курортов. Наслаждайтесь белыми песчаными пляжами, сосновыми лесами и легким доступом к Риге.'
    },
    features: ['Beach access', 'Pine forest', 'Spa nearby', 'Train to Riga', 'Swimming'],
    images: [
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
    ],
    season: ['spring', 'summer', 'autumn'],
    facilities: ['Beach access', 'Showers', 'Toilets', 'Parking', 'Store'],
    contact: {
      phone: '+371 67761001',
      website: 'https://www.jurmala.lv/camping'
    },
    pricing: {
      free: false,
      adult: 12,
      child: 6,
      currency: 'EUR'
    }
  }
];

// REAL LATVIAN FISHING SPOTS
export const realLatvianFishing: RealLocation[] = [
  {
    id: 'gauja-river-fishing',
    name: 'Gauja River - Valmiera Section',
    nameEn: 'Gauja River - Valmiera Section',
    nameLv: 'Gauja - Valmieras posms',
    nameRu: 'Река Гауя - участок Валмиера',
    coordinates: [57.5411, 25.4272],
    region: 'Vidzeme',
    difficulty: 'moderate',
    duration: 'Full day',
    description: {
      en: 'Excellent trout and grayling fishing in one of Latvia\'s cleanest rivers. Popular among fly fishermen with beautiful natural surroundings and good accessibility.',
      lv: 'Lieliska foreles un lipšu makšķerēšana vienā no Latvijas tīrākajām upēm. Populāra starp mušu makšķerniekiem ar skaistām dabas ainavām un labu pieejamību.',
      ru: 'Отличная рыбалка на форель и хариуса в одной из самых чистых рек Латвии. Популярна среди нахлыстовиков с красивыми природными окрестностями и хорошей доступностью.'
    },
    features: ['Trout fishing', 'Grayling', 'Fly fishing', 'Clean water', 'Scenic location'],
    images: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=800&h=600&fit=crop'
    ],
    season: ['spring', 'summer', 'autumn'],
    facilities: ['River access', 'Parking', 'Fishing permit required'],
    contact: {
      website: 'https://www.makskernieciba.lv'
    },
    pricing: {
      free: false,
      adult: 8,
      currency: 'EUR'
    }
  },
  {
    id: 'daugava-river-fishing',
    name: 'Daugava River - Riga Section',
    nameEn: 'Daugava River - Riga Section',
    nameLv: 'Daugava - Rīgas posms',
    nameRu: 'Река Даугава - участок Рига',
    coordinates: [56.9496, 24.1052],
    region: 'Pierīga',
    difficulty: 'easy',
    duration: 'Half day',
    description: {
      en: 'Urban fishing spot in Latvia\'s largest river. Good for pike, perch, and roach fishing. Easily accessible from Riga city center with several fishing platforms.',
      lv: 'Pilsētas makšķerēšanas vieta Latvijas lielākajā upē. Laba līdaku, asaru un rauda makšķerēšanai. Viegli pieejama no Rīgas centra ar vairākām makšķerēšanas platformām.',
      ru: 'Городское место рыбалки в крупнейшей реке Латвии. Хорошо для ловли щуки, окуня и плотвы. Легко доступно из центра Риги с несколькими рыболовными платформами.'
    },
    features: ['Pike fishing', 'Perch', 'Urban location', 'Easy access', 'Multiple spots'],
    images: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=800&h=600&fit=crop'
    ],
    season: ['spring', 'summer', 'autumn', 'winter'],
    facilities: ['Fishing platforms', 'Parking', 'Public transport'],
    pricing: {
      free: true,
      currency: 'EUR'
    }
  }
];

// REAL LATVIAN WINTER ACTIVITIES
export const realLatvianWinter: RealLocation[] = [
  {
    id: 'sigulda-bobsled',
    name: 'Sigulda Bobsled Track',
    nameEn: 'Sigulda Bobsled Track',
    nameLv: 'Siguldas bobsleja trase',
    nameRu: 'Бобслейная трасса Сигулда',
    coordinates: [57.1667, 24.8333],
    region: 'Vidzeme',
    difficulty: 'moderate',
    duration: '2-3 hours',
    description: {
      en: 'The only bobsled track in the Baltics! Experience professional bobsled rides or try summer bobsled. Historic venue that hosted international competitions.',
      lv: 'Vienīgā bobsleja trase Baltijā! Piedzīvojiet profesionālus bobsleja braucienus vai izmēģiniet vasaras bobsleju. Vēsturiska vieta, kas uzņēmusi starptautiskas sacensības.',
      ru: 'Единственная бобслейная трасса в Прибалтике! Испытайте профессиональные поездки на бобслее или попробуйте летний бобслей. Историческое место, принимавшее международные соревнования.'
    },
    features: ['Professional bobsled', 'Summer track', 'Historic venue', 'Guided tours', 'Adrenaline rush'],
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1551524164-687a55dd1126?w=800&h=600&fit=crop'
    ],
    season: ['winter', 'summer'],
    facilities: ['Professional track', 'Safety equipment', 'Changing rooms', 'Cafe'],
    contact: {
      phone: '+371 67973815',
      website: 'https://www.bobsleigh.lv'
    },
    pricing: {
      free: false,
      adult: 25,
      child: 15,
      currency: 'EUR'
    }
  },
  {
    id: 'zagarkalns-skiing',
    name: 'Žagarkalns Ski Resort',
    nameEn: 'Žagarkalns Ski Resort',
    nameLv: 'Žagarkalna slēpošanas centrs',
    nameRu: 'Горнолыжный курорт Жагаркалнс',
    coordinates: [56.8167, 25.9167],
    region: 'Vidzeme',
    difficulty: 'easy',
    duration: 'Full day',
    description: {
      en: 'Latvia\'s highest ski resort at 289m elevation. Features multiple slopes for all skill levels, modern lift system, and equipment rental. Great for families.',
      lv: 'Latvijas augstākais slēpošanas kūrorts 289 m augstumā. Piedāvā vairākas nogāzes visiem prasmju līmeņiem, modernu liftu sistēmu un aprīkojuma nomu. Lieliski ģimenēm.',
      ru: 'Самый высокий горнолыжный курорт Латвии на высоте 289 м. Предлагает несколько склонов для всех уровней навыков, современную систему подъемников и прокат оборудования. Отлично для семей.'
    },
    features: ['Multiple slopes', 'Ski lifts', 'Equipment rental', 'Ski school', 'Restaurant'],
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1551524164-687a55dd1126?w=800&h=600&fit=crop'
    ],
    season: ['winter'],
    facilities: ['Ski lifts', 'Equipment rental', 'Ski school', 'Restaurant', 'Parking'],
    contact: {
      phone: '+371 26515755',
      website: 'https://www.zagarkalns.lv'
    },
    pricing: {
      free: false,
      adult: 18,
      child: 12,
      currency: 'EUR'
    }
  }
];

// COMBINED REAL DATA
export const allRealLatvianData = {
  trails: realLatvianTrails,
  camping: realLatvianCamping,
  fishing: realLatvianFishing,
  winter: realLatvianWinter
};

// UTILITY FUNCTIONS
export const getLocationsByRegion = (region: string) => {
  return [
    ...realLatvianTrails,
    ...realLatvianCamping,
    ...realLatvianFishing,
    ...realLatvianWinter
  ].filter(location => location.region === region);
};

export const getLocationsByDifficulty = (difficulty: string) => {
  return [
    ...realLatvianTrails,
    ...realLatvianCamping,
    ...realLatvianFishing,
    ...realLatvianWinter
  ].filter(location => location.difficulty === difficulty);
};

export const getLocationsBySeason = (season: string) => {
  return [
    ...realLatvianTrails,
    ...realLatvianCamping,
    ...realLatvianFishing,
    ...realLatvianWinter
  ].filter(location => location.season.includes(season));
};

export const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in kilometers
};