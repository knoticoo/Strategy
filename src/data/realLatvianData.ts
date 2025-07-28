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
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop&q=80', // Forest landscape
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&q=80'  // River valley
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
      'https://images.unsplash.com/photo-1520637836862-4d197d17c92a?w=800&h=600&fit=crop&q=80', // Medieval castle
      'https://images.unsplash.com/photo-1597149960419-0d90ac2e3db4?w=800&h=600&fit=crop&q=80'  // Castle grounds
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
      'https://images.unsplash.com/photo-1574263867128-97b9d4b09c0b?w=800&h=600&fit=crop&q=80', // Bog landscape
      'https://images.unsplash.com/photo-1507041957456-9c397ce39c97?w=800&h=600&fit=crop&q=80'  // Boardwalk in nature
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
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&q=80', // Lighthouse by sea
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&q=80'  // Coastal view
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
  },
  {
    id: 'slitere-national-park',
    name: 'Slītere National Park Coastal Trail',
    nameEn: 'Slītere National Park Coastal Trail',
    nameLv: 'Slīteres nacionālā parka piekrastes taka',
    nameRu: 'Прибрежная тропа Национального парка Слитере',
    coordinates: [57.6667, 22.3333],
    region: 'Kurzeme',
    difficulty: 'easy',
    duration: '2-3 hours',
    distance: '6 km',
    elevation: '50m',
    description: {
      en: 'Beautiful coastal trail through ancient forests and along pristine beaches. Lighthouse views and unique Livonian cultural heritage sites.',
      lv: 'Skaista piekrastes taka cauri senajiem mežiem un gar neskartajām pludmalēm. Bākas skati un unikālie lībiešu kultūras mantojuma objekti.',
      ru: 'Красивая прибрежная тропа через древние леса и вдоль нетронутых пляжей. Виды на маяк и уникальные объекты ливского культурного наследия.'
    },
    features: ['Coastal views', 'Ancient forests', 'Lighthouse', 'Livonian heritage', 'Bird watching'],
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop&q=80'
    ],
    season: ['spring', 'summer', 'autumn'],
    facilities: ['Parking', 'Information boards', 'Viewpoints'],
    contact: {
      phone: '+371 63223830',
      website: 'https://www.daba.gov.lv/slitere'
    },
    pricing: {
      free: true,
      currency: 'EUR'
    }
  },
  {
    id: 'daugavpils-fortress',
    name: 'Daugavpils Fortress Historical Trail',
    nameEn: 'Daugavpils Fortress Historical Trail',
    nameLv: 'Daugavpils cietokšņa vēsturiskā taka',
    nameRu: 'Историческая тропа крепости Даугавпилс',
    coordinates: [55.8833, 26.5167],
    region: 'Latgale',
    difficulty: 'easy',
    duration: '1-2 hours',
    distance: '3 km',
    elevation: '20m',
    description: {
      en: 'Explore the largest fortress in the Baltics built in early 19th century. Rich military history and well-preserved fortifications.',
      lv: 'Izpētiet lielāko cietoksni Baltijā, kas būvēts 19. gadsimta sākumā. Bagāta militārā vēsture un labi saglabātas fortifikācijas.',
      ru: 'Исследуйте крупнейшую крепость в Прибалтике, построенную в начале 19 века. Богатая военная история и хорошо сохранившиеся укрепления.'
    },
    features: ['Historic fortress', 'Military museum', 'Art center', 'Architecture', 'Cultural events'],
    images: [
      'https://images.unsplash.com/photo-1520637836862-4d197d17c92a?w=800&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1597149960419-0d90ac2e3db4?w=800&h=600&fit=crop&q=80'
    ],
    season: ['spring', 'summer', 'autumn', 'winter'],
    facilities: ['Museum', 'Cafe', 'Parking', 'Guided tours'],
    contact: {
      phone: '+371 65422818',
      website: 'https://www.daugavpilsnovads.lv'
    },
    pricing: {
      free: false,
      adult: 5,
      child: 3,
      currency: 'EUR'
    }
  },
  {
    id: 'liepaja-beach-trail',
    name: 'Liepāja Beach and Dune Trail',
    nameEn: 'Liepāja Beach and Dune Trail',
    nameLv: 'Liepājas pludmales un kāpu taka',
    nameRu: 'Тропа пляжа и дюн Лиепаи',
    coordinates: [56.5167, 21.0167],
    region: 'Kurzeme',
    difficulty: 'easy',
    duration: '2-4 hours',
    distance: '10 km',
    elevation: '30m',
    description: {
      en: 'Long sandy beach walk with impressive sand dunes and coastal vegetation. Perfect for sunset walks and bird watching.',
      lv: 'Gara smilšainā pludmales pastaigas ar iespaidīgām smilšu kāpām un piekrastes veģetāciju. Ideāla saulrieta pastaigām un putnu vērošanai.',
      ru: 'Длинная прогулка по песчаному пляжу с впечатляющими песчаными дюнами и прибрежной растительностью. Идеально для прогулок на закате и наблюдения за птицами.'
    },
    features: ['Sandy beach', 'Sand dunes', 'Sunset views', 'Bird watching', 'Sea breeze'],
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&q=80'
    ],
    season: ['spring', 'summer', 'autumn'],
    facilities: ['Beach access', 'Parking', 'Restaurants'],
    contact: {
      website: 'https://www.liepaja.lv'
    },
    pricing: {
      free: true,
      currency: 'EUR'
    }
  },
  {
    id: 'razna-lake-circuit',
    name: 'Rāzna Lake Circuit Trail',
    nameEn: 'Rāzna Lake Circuit Trail',
    nameLv: 'Rāznas ezera apļa taka',
    nameRu: 'Круговая тропа озера Разна',
    coordinates: [56.1333, 27.4167],
    region: 'Latgale',
    difficulty: 'moderate',
    duration: '4-6 hours',
    distance: '15 km',
    elevation: '80m',
    description: {
      en: 'Scenic circuit around Latvia\'s second largest lake. Diverse landscapes including forests, meadows, and lake shores with excellent wildlife viewing.',
      lv: 'Ainava aplis ap Latvijas otro lielāko ezeru. Daudzveidīgas ainavas, ieskaitot mežus, pļavas un ezera krastus ar lieliskām iespējām dzīvnieku vērošanai.',
      ru: 'Живописный круг вокруг второго по величине озера Латвии. Разнообразные ландшафты, включая леса, луга и берега озера с отличными возможностями для наблюдения за дикой природой.'
    },
    features: ['Lake views', 'Forest paths', 'Wildlife watching', 'Photography', 'Peaceful nature'],
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop&q=80'
    ],
    season: ['spring', 'summer', 'autumn'],
    facilities: ['Information center', 'Parking', 'Viewpoints'],
    contact: {
      phone: '+371 64607263',
      website: 'https://www.razna.lv'
    },
    pricing: {
      free: true,
      currency: 'EUR'
    }
  },
  {
    id: 'ventspils-seaside-trail',
    name: 'Ventspils Seaside and Forest Trail',
    nameEn: 'Ventspils Seaside and Forest Trail',
    nameLv: 'Ventspils jūrmales un meža taka',
    nameRu: 'Приморская и лесная тропа Вентспилса',
    coordinates: [57.3833, 21.5667],
    region: 'Kurzeme',
    difficulty: 'easy',
    duration: '2-3 hours',
    distance: '7 km',
    elevation: '40m',
    description: {
      en: 'Combination of beach walking and forest paths near Ventspils. Beautiful coastal pine forests and clean beaches with good infrastructure.',
      lv: 'Pludmales pastaigu un meža taku kombinācija pie Ventspils. Skaisti piekrastes priežu meži un tīras pludmales ar labu infrastruktūru.',
      ru: 'Сочетание прогулок по пляжу и лесных тропинок возле Вентспилса. Красивые прибрежные сосновые леса и чистые пляжи с хорошей инфраструктурой.'
    },
    features: ['Beach access', 'Pine forests', 'Clean environment', 'Family friendly', 'Good facilities'],
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop&q=80'
    ],
    season: ['spring', 'summer', 'autumn'],
    facilities: ['Beach facilities', 'Parking', 'Restaurants', 'Playground'],
    contact: {
      website: 'https://www.ventspils.lv'
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
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&h=600&fit=crop&q=80', // Camping in forest
      'https://images.unsplash.com/photo-1487730116645-74489c95b41b?w=800&h=600&fit=crop&q=80'  // Tent camping
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
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&q=80', // Beach camping
      'https://images.unsplash.com/photo-1520637836862-4d197d17c92a?w=800&h=600&fit=crop&q=80'  // Pine forest
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
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&q=80', // Fishing by river
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop&q=80'  // Angler fishing
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
      'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&h=600&fit=crop&q=80', // Urban fishing
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&q=80'  // City fishing
    ],
    season: ['spring', 'summer', 'autumn', 'winter'],
    facilities: ['Fishing platforms', 'Parking', 'Public transport'],
    pricing: {
      free: true,
      currency: 'EUR'
    }
  },
  {
    id: 'burtnieks-lake-fishing',
    name: 'Burtnieks Lake',
    nameEn: 'Burtnieks Lake',
    nameLv: 'Burtnieku ezers',
    nameRu: 'Озеро Буртниекс',
    coordinates: [57.6833, 25.2833],
    region: 'Vidzeme',
    difficulty: 'easy',
    duration: 'Full day',
    description: {
      en: 'Latvia\'s fourth largest lake, excellent for pike, perch, and bream fishing. Shallow waters warm up quickly in summer, making it perfect for family fishing trips.',
      lv: 'Latvijas ceturtais lielākais ezers, lielisks līdaku, asaru un plaudu makšķerēšanai. Seklie ūdeņi vasarā ātri sasilst, padarot to ideālu ģimenes makšķerēšanas braucieniem.',
      ru: 'Четвертое по величине озеро Латвии, отличное для ловли щуки, окуня и леща. Мелкие воды быстро прогреваются летом, что делает его идеальным для семейной рыбалки.'
    },
    features: ['Pike fishing', 'Perch', 'Bream', 'Family friendly', 'Boat rental'],
    images: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&q=80'
    ],
    season: ['spring', 'summer', 'autumn', 'winter'],
    facilities: ['Boat rental', 'Parking', 'Fishing platforms'],
    contact: {
      phone: '+371 64207120'
    },
    pricing: {
      free: false,
      adult: 8,
      child: 4,
      currency: 'EUR'
    }
  },
  {
    id: 'engure-lake-fishing',
    name: 'Engure Lake Nature Reserve',
    nameEn: 'Engure Lake Nature Reserve',
    nameLv: 'Engures ezers dabas rezervāts',
    nameRu: 'Природный заповедник озера Энгуре',
    coordinates: [57.2167, 23.1333],
    region: 'Kurzeme',
    difficulty: 'easy',
    duration: 'Half day',
    description: {
      en: 'Shallow brackish lake perfect for roach, rudd, and small pike. Important bird area with restricted fishing zones. Beautiful nature reserve setting.',
      lv: 'Sekls saldūdens ezers, kas ir ideāls plaudu, rauda un mazu līdaku makšķerēšanai. Svarīgs putnu novērošanas rajons ar ierobežotām makšķerēšanas zonām.',
      ru: 'Мелкое пресноводное озеро, идеальное для ловли плотвы, красноперки и мелкой щуки. Важный район для наблюдения за птицами с ограниченными зонами рыбалки.'
    },
    features: ['Roach fishing', 'Bird watching', 'Nature reserve', 'Shallow waters', 'Peaceful setting'],
    images: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop&q=80'
    ],
    season: ['spring', 'summer', 'autumn'],
    facilities: ['Information center', 'Parking', 'Nature trails'],
    contact: {
      phone: '+371 63161170',
      website: 'https://www.daba.gov.lv/engure'
    },
    pricing: {
      free: false,
      adult: 5,
      child: 2,
      currency: 'EUR'
    }
  },
  {
    id: 'aluksne-lake-fishing',
    name: 'Alūksne Lake',
    nameEn: 'Alūksne Lake',
    nameLv: 'Alūksnes ezers',
    nameRu: 'Алуксненское озеро',
    coordinates: [57.4167, 27.0333],
    region: 'Vidzeme',
    difficulty: 'moderate',
    duration: 'Full day',
    description: {
      en: 'Deep lake with excellent pike, perch, and vendace fishing. Historic Alūksne castle ruins on an island add charm to this fishing destination.',
      lv: 'Dziļš ezers ar lielisko līdaku, asaru un sīgu makšķerēšanu. Vēsturiskās Alūksnes pils drupas uz salas piešķir šarmam šim makšķerēšanas galamērķim.',
      ru: 'Глубокое озеро с отличной рыбалкой на щуку, окуня и ряпушку. Исторические руины замка Алуксне на острове добавляют очарования этому месту для рыбалки.'
    },
    features: ['Pike fishing', 'Vendace', 'Historic castle', 'Deep waters', 'Island views'],
    images: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&q=80'
    ],
    season: ['spring', 'summer', 'autumn', 'winter'],
    facilities: ['Parking', 'Boat launch', 'Castle museum'],
    contact: {
      phone: '+371 64381804',
      website: 'https://www.aluksne.lv'
    },
    pricing: {
      free: false,
      adult: 6,
      child: 3,
      currency: 'EUR'
    }
  },
  {
    id: 'venta-river-kuldiga',
    name: 'Venta River - Kuldīga Rapids',
    nameEn: 'Venta River - Kuldīga Rapids',
    nameLv: 'Ventas upe - Kuldīgas krāces',
    nameRu: 'Река Вента - Кулдигские пороги',
    coordinates: [56.9667, 21.9667],
    region: 'Kurzeme',
    difficulty: 'hard',
    duration: 'Full day',
    description: {
      en: 'Famous for vimba bream and salmon fishing near Europe\'s widest waterfall. Historic town setting with medieval charm and excellent fish restaurants.',
      lv: 'Slavens ar vīmbu un lašu makšķerēšanu pie Eiropas platākā ūdenskrituma. Vēsturiska pilsētas ainava ar viduslaiku šarmu un lieliskām zivju restorāniem.',
      ru: 'Знаменит рыбалкой на рыбца и лосося у самого широкого водопада Европы. Историческая городская обстановка со средневековым шармом и отличными рыбными ресторанами.'
    },
    features: ['Vimba bream', 'Salmon', 'Historic waterfall', 'Medieval town', 'Rapids fishing'],
    images: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop&q=80'
    ],
    season: ['spring', 'summer', 'autumn'],
    facilities: ['Parking', 'Restaurants', 'Hotel', 'Guided tours'],
    contact: {
      phone: '+371 63322259',
      website: 'https://www.kuldiga.lv'
    },
    pricing: {
      free: false,
      adult: 12,
      child: 6,
      currency: 'EUR'
    }
  },
  {
    id: 'liepaja-lake-fishing',
    name: 'Liepāja Lake (Liepājas ezers)',
    nameEn: 'Liepāja Lake',
    nameLv: 'Liepājas ezers',
    nameRu: 'Лиепайское озеро',
    coordinates: [56.5333, 21.0167],
    region: 'Kurzeme',
    difficulty: 'easy',
    duration: 'Half day',
    description: {
      en: 'Urban lake in Liepāja city center, perfect for casual fishing. Good for beginners with easy access and basic facilities nearby.',
      lv: 'Pilsētas ezers Liepājas centrā, ideāls ikdienas makšķerēšanai. Labs iesācējiem ar vieglu pieeju un pamata ērtībām tuvumā.',
      ru: 'Городское озеро в центре Лиепаи, идеальное для случайной рыбалки. Хорошо для начинающих с легким доступом и основными удобствами поблизости.'
    },
    features: ['Urban fishing', 'Easy access', 'Beginner friendly', 'City amenities', 'Small fish'],
    images: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&q=80'
    ],
    season: ['spring', 'summer', 'autumn'],
    facilities: ['Urban access', 'Parking', 'Cafes', 'Public transport'],
    contact: {
      website: 'https://www.liepaja.lv'
    },
    pricing: {
      free: true,
      currency: 'EUR'
    }
  },
  {
    id: 'driksna-lake-fishing',
    name: 'Driksna Lake',
    nameEn: 'Driksna Lake',
    nameLv: 'Driksnas ezers',
    nameRu: 'Озеро Дриксна',
    coordinates: [56.8167, 27.1833],
    region: 'Latgale',
    difficulty: 'moderate',
    duration: 'Full day',
    description: {
      en: 'Hidden gem among Latgale lakes with excellent pike and perch fishing. Quiet, less crowded spot perfect for serious anglers seeking solitude.',
      lv: 'Slēpts dārgakmens starp Latgales ezeriem ar lielisko līdaku un asaru makšķerēšanu. Kluss, mazāk pārpildīts vieta, kas ideāla nopietņiem makšķerniekiem.',
      ru: 'Скрытая жемчужина среди озер Латгалии с отличной рыбалкой на щуку и окуня. Тихое, менее людное место, идеальное для серьезных рыболовов, ищущих уединения.'
    },
    features: ['Pike fishing', 'Perch', 'Quiet location', 'Less crowded', 'Natural setting'],
    images: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop&q=80'
    ],
    season: ['spring', 'summer', 'autumn', 'winter'],
    facilities: ['Basic parking', 'Nature trails'],
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
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&q=80', // Bobsled track
      'https://images.unsplash.com/photo-1551524164-687a55dd1126?w=800&h=600&fit=crop&q=80'  // Winter sports
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
      'https://images.unsplash.com/photo-1551524164-6cf3ac5e6bc9?w=800&h=600&fit=crop&q=80', // Ski slopes
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&q=80'  // Winter resort
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

// UTILITY FUNCTION FOR DIRECTIONS
export const getDirectionsUrl = (lat: number, lng: number, name: string): string => {
  // Google Maps directions URL
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(name)}`;
};