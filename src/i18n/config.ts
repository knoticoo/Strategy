import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // App
      app: {
        title: 'Latvian Adventure Finder',
        subtitle: 'Discover Latvia\'s hidden gems and outdoor adventures'
      },
      
      // Navigation
      nav: {
        trails: 'Trails',
        camping: 'Camping',
        fishing: 'Fishing',
        winter: 'Winter Sports',
        favorites: 'Favorites',
        community: 'Community',
        gamification: 'Gamification',
        auth: 'Account'
      },
      
      // Common
      common: {
        search: 'Search',
        filter: 'Filter',
        map: 'Map',
        list: 'List',
        difficulty: 'Difficulty',
        distance: 'Distance',
        duration: 'Duration',
        rating: 'Rating',
        reviews: 'Reviews',
        directions: 'Directions',
        parking: 'Parking',
        facilities: 'Facilities',
        weather: 'Weather',
        gear: 'Gear',
        safety: 'Safety',
        offline: 'Offline',
        loading: 'Loading...',
        error: 'Error loading data',
        noResults: 'No results found',
        showMore: 'Show More',
        close: 'Close',
        save: 'Save',
        share: 'Share',
        favorite: 'Favorite',
        remove: 'Remove'
      },
      
      // Trails
      trails: {
        title: 'Nature Trails',
        subtitle: 'Explore Latvia\'s beautiful hiking paths',
        types: {
          hiking: 'Hiking',
          cycling: 'Cycling',
          walking: 'Walking',
          running: 'Running',
          nature: 'Nature Study'
        },
        difficulty: {
          easy: 'Easy',
          moderate: 'Moderate',
          hard: 'Hard',
          expert: 'Expert'
        },
        features: {
          scenic: 'Scenic Views',
          wildlife: 'Wildlife',
          historical: 'Historical Sites',
          waterfall: 'Waterfall',
          lake: 'Lake',
          forest: 'Forest',
          coastal: 'Coastal',
          educational: 'Educational Trail'
        }
      },
      
      // Camping
      camping: {
        title: 'Camping Sites',
        subtitle: 'Find perfect spots for your outdoor stay',
        types: {
          tent: 'Tent Camping',
          rv: 'RV/Caravan',
          cabin: 'Cabin',
          glamping: 'Glamping',
          wild: 'Wild Camping'
        },
        amenities: {
          toilets: 'Toilets',
          showers: 'Showers',
          water: 'Drinking Water',
          electricity: 'Electricity',
          wifi: 'WiFi',
          shop: 'Shop',
          restaurant: 'Restaurant',
          playground: 'Playground',
          firepit: 'Fire Pit',
          bbq: 'BBQ Area'
        }
      },
      
      // Fishing
      fishing: {
        title: 'Fishing Spots',
        subtitle: 'Best places for fishing in Latvia',
        types: {
          river: 'River Fishing',
          lake: 'Lake Fishing',
          sea: 'Sea Fishing',
          fly: 'Fly Fishing',
          ice: 'Ice Fishing'
        },
        species: {
          pike: 'Pike',
          perch: 'Perch',
          trout: 'Trout',
          salmon: 'Salmon',
          carp: 'Carp',
          bream: 'Bream'
        },
        licenses: {
          required: 'License Required',
          daily: 'Daily Permit',
          seasonal: 'Seasonal License',
          free: 'Free Fishing'
        }
      },
      
      // Winter Sports
      winter: {
        title: 'Winter Sports',
        subtitle: 'Snow adventures across Latvia',
        activities: {
          skiing: 'Cross-country Skiing',
          snowshoeing: 'Snowshoeing',
          sledding: 'Sledding',
          skating: 'Ice Skating',
          hockey: 'Ice Hockey'
        },
        conditions: {
          excellent: 'Excellent',
          good: 'Good',
          fair: 'Fair',
          poor: 'Poor',
          closed: 'Closed'
        }
      },
      
      // Transport & Parking
      transport: {
        title: 'Getting There',
        subtitle: 'Smart transport and parking solutions',
        parking: {
          title: 'Parking',
          available: 'Available Spots',
          price: 'Price per hour',
          free: 'Free Parking',
          paid: 'Paid Parking',
          ev: 'EV Charging',
          disabled: 'Disabled Access'
        },
        publicTransport: {
          title: 'Public Transport',
          bus: 'Bus',
          train: 'Train',
          tram: 'Tram',
          schedule: 'Schedule',
          tickets: 'Tickets',
          realTime: 'Real-time Updates'
        },
        driving: {
          title: 'Driving Directions',
          time: 'Estimated Time',
          traffic: 'Traffic Conditions',
          tolls: 'Tolls',
          fuel: 'Fuel Stations'
        }
      },
      
      // Weather
      weather: {
        current: 'Current Weather',
        forecast: 'Forecast',
        conditions: {
          sunny: 'Sunny',
          cloudy: 'Cloudy',
          rainy: 'Rainy',
          snowy: 'Snowy',
          stormy: 'Stormy',
          foggy: 'Foggy'
        },
        recommendations: {
          perfect: 'Perfect weather for outdoor activities',
          good: 'Good conditions, slight precautions needed',
          fair: 'Fair weather, check gear recommendations',
          poor: 'Poor conditions, consider postponing'
        }
      },
      
      // Gear
      gear: {
        title: 'Recommended Gear',
        essential: 'Essential',
        optional: 'Optional',
        categories: {
          clothing: 'Clothing',
          footwear: 'Footwear',
          safety: 'Safety Equipment',
          navigation: 'Navigation',
          camping: 'Camping Gear',
          food: 'Food & Water'
        },
        buyNow: 'Buy Now',
        rentNear: 'Rent Nearby'
      },

      // Auth
      auth: {
        login: 'Login',
        register: 'Register',
        profile: 'Profile',
        loginSubtitle: 'Sign in to track your adventures',
        registerSubtitle: 'Create an account to get started',
        name: 'Full Name',
        email: 'Email Address',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        location: 'Location',
        loginButton: 'Sign In',
        registerButton: 'Create Account',
        noAccount: "Don't have an account?",
        hasAccount: 'Already have an account?',
        registerLink: 'Sign up here',
        loginLink: 'Sign in here',
        features: 'Why Join?'
      }
    }
  },
  
  lv: {
    translation: {
      // App
      app: {
        title: 'Latvijas Piedzīvojumu Meklētājs',
        subtitle: 'Atklājiet Latvijas slēptās pērles un dabas piedzīvojumus'
      },
      
      // Navigation
      nav: {
        trails: 'Takas',
        camping: 'Kempings',
        fishing: 'Makšķerēšana',
        winter: 'Ziemas Sports',
        favorites: 'Favorīti',
        community: 'Kopiena',
        gamification: 'Spēle',
        auth: 'Konts'
      },
      
      // Common
      common: {
        search: 'Meklēt',
        filter: 'Filtrēt',
        map: 'Karte',
        list: 'Saraksts',
        difficulty: 'Grūtība',
        distance: 'Attālums',
        duration: 'Ilgums',
        rating: 'Vērtējums',
        reviews: 'Atsauksmes',
        directions: 'Norādes',
        parking: 'Stāvvieta',
        facilities: 'Ērtības',
        weather: 'Laiks',
        gear: 'Aprīkojums',
        safety: 'Drošība',
        offline: 'Bezsaistē',
        loading: 'Ielādē...',
        error: 'Kļūda ielādējot datus',
        noResults: 'Nav atrasti rezultāti',
        showMore: 'Rādīt Vairāk',
        close: 'Aizvērt',
        save: 'Saglabāt',
        share: 'Dalīties',
        favorite: 'Favorīts',
        remove: 'Noņemt'
      },
      
      // Trails
      trails: {
        title: 'Dabas Takas',
        subtitle: 'Izpētiet Latvijas skaistās pārgājienu takas',
        types: {
          hiking: 'Pārgājiens',
          cycling: 'Riteņbraukšana',
          walking: 'Pastaigas',
          running: 'Skriešana',
          nature: 'Dabas Izpēte'
        },
        difficulty: {
          easy: 'Viegla',
          moderate: 'Vidēja',
          hard: 'Grūta',
          expert: 'Ekspertu'
        },
        features: {
          scenic: 'Skaidrskati',
          wildlife: 'Dzīvnieki',
          historical: 'Vēsturiskas Vietas',
          waterfall: 'Ūdenskritums',
          lake: 'Ezers',
          forest: 'Mežs',
          coastal: 'Piekraste',
          educational: 'Izglītojoša Taka'
        }
      },
      
      // Camping
      camping: {
        title: 'Kempingu Vietas',
        subtitle: 'Atrodiet perfektas vietas jūsu piedzīvojumiem',
        types: {
          tent: 'Telšu Kempings',
          rv: 'Autofurgoni',
          cabin: 'Namiņš',
          glamping: 'Glamping',
          wild: 'Savvaļas Kempings'
        },
        amenities: {
          toilets: 'Tualetes',
          showers: 'Dušas',
          water: 'Dzeramais Ūdens',
          electricity: 'Elektrība',
          wifi: 'WiFi',
          shop: 'Veikals',
          restaurant: 'Restorāns',
          playground: 'Rotaļu Laukums',
          firepit: 'Ugunskura Vieta',
          bbq: 'BBQ Zona'
        }
      },
      
      // Fishing
      fishing: {
        title: 'Makšķerēšanas Vietas',
        subtitle: 'Labākās vietas makšķerēšanai Latvijā',
        types: {
          river: 'Upes Makšķerēšana',
          lake: 'Ezeru Makšķerēšana',
          sea: 'Jūras Makšķerēšana',
          fly: 'Mušiņmakšķerēšana',
          ice: 'Ledus Makšķerēšana'
        },
        species: {
          pike: 'Līdaka',
          perch: 'Asaris',
          trout: 'Forele',
          salmon: 'Lasis',
          carp: 'Karpa',
          bream: 'Platess'
        },
        licenses: {
          required: 'Nepieciešama Licence',
          daily: 'Dienas Atļauja',
          seasonal: 'Sezonas Licence',
          free: 'Brīva Makšķerēšana'
        }
      },
      
      // Winter Sports
      winter: {
        title: 'Ziemas Sports',
        subtitle: 'Sniega piedzīvojumi visā Latvijā',
        activities: {
          skiing: 'Distanču Slēpošana',
          snowshoeing: 'Sniega Kurpes',
          sledding: 'Kamaniņas',
          skating: 'Slidošana',
          hockey: 'Hokejs'
        },
        conditions: {
          excellent: 'Izcili',
          good: 'Labi',
          fair: 'Vidēji',
          poor: 'Slikti',
          closed: 'Slēgts'
        }
      },
      
      // Transport & Parking
      transport: {
        title: 'Kā Nokļūt',
        subtitle: 'Viedie transporta un stāvvietu risinājumi',
        parking: {
          title: 'Stāvvieta',
          available: 'Pieejamās Vietas',
          price: 'Cena stundā',
          free: 'Bezmaksas Stāvvieta',
          paid: 'Maksas Stāvvieta',
          ev: 'EV Uzlāde',
          disabled: 'Invalīdu Piekļuve'
        },
        publicTransport: {
          title: 'Sabiedriskais Transports',
          bus: 'Autobuss',
          train: 'Vilciens',
          tram: 'Tramvajs',
          schedule: 'Saraksts',
          tickets: 'Biļetes',
          realTime: 'Reāllaika Atjauninājumi'
        },
        driving: {
          title: 'Braukšanas Norādes',
          time: 'Plānotais Laiks',
          traffic: 'Satiksmes Apstākļi',
          tolls: 'Maksas Ceļi',
          fuel: 'Degvielas Stacijas'
        }
      },
      
      // Weather
      weather: {
        current: 'Pašreizējais Laiks',
        forecast: 'Prognoze',
        conditions: {
          sunny: 'Saulains',
          cloudy: 'Mākoņains',
          rainy: 'Lietains',
          snowy: 'Sniegains',
          stormy: 'Vētrains',
          foggy: 'Miglains'
        },
        recommendations: {
          perfect: 'Perfekts laiks aktivitātēm ārā',
          good: 'Labi apstākļi, neliela uzmanība nepieciešama',
          fair: 'Vidēji apstākļi, pārbaudiet aprīkojuma ieteikumus',
          poor: 'Slikti apstākļi, apsveriet atlikšanu'
        }
      },
      
      // Gear
      gear: {
        title: 'Ieteiktais Aprīkojums',
        essential: 'Būtisks',
        optional: 'Neobligāts',
        categories: {
          clothing: 'Apģērbs',
          footwear: 'Apavi',
          safety: 'Drošības Aprīkojums',
          navigation: 'Navigācija',
          camping: 'Kempinga Aprīkojums',
          food: 'Ēdiens un Ūdens'
        },
        buyNow: 'Pirkt Tagad',
        rentNear: 'Īrēt Tuvumā'
      },

      // Auth
      auth: {
        login: 'Pieteikšanās',
        register: 'Reģistrācija',
        profile: 'Profils',
        loginSubtitle: 'Piesakieties, lai izsekotu savus piedzīvojumus',
        registerSubtitle: 'Izveidojiet kontu, lai sāktu',
        name: 'Pilns Vārds',
        email: 'E-pasta Adrese',
        password: 'Parole',
        confirmPassword: 'Apstiprināt Paroli',
        location: 'Atrašanās Vieta',
        loginButton: 'Pieteikties',
        registerButton: 'Izveidot Kontu',
        noAccount: 'Nav konta?',
        hasAccount: 'Jau ir konts?',
        registerLink: 'Reģistrējieties šeit',
        loginLink: 'Pieteikšanās šeit',
        features: 'Kāpēc Pievienoties?'
      }
    }
  },
  
  ru: {
    translation: {
      // App
      app: {
        title: 'Приключения Латвии',
        subtitle: 'Откройте скрытые жемчужины и приключения на природе Латвии'
      },
      
      // Navigation
      nav: {
        trails: 'Тропы',
        camping: 'Кемпинг',
        fishing: 'Рыбалка',
        winter: 'Зимний Спорт',
        favorites: 'Избранное',
        community: 'Сообщество',
        gamification: 'Игра',
        auth: 'Аккаунт'
      },
      
      // Common
      common: {
        search: 'Поиск',
        filter: 'Фильтр',
        map: 'Карта',
        list: 'Список',
        difficulty: 'Сложность',
        distance: 'Расстояние',
        duration: 'Продолжительность',
        rating: 'Рейтинг',
        reviews: 'Отзывы',
        directions: 'Маршрут',
        parking: 'Парковка',
        facilities: 'Удобства',
        weather: 'Погода',
        gear: 'Снаряжение',
        safety: 'Безопасность',
        offline: 'Офлайн',
        loading: 'Загрузка...',
        error: 'Ошибка загрузки данных',
        noResults: 'Результаты не найдены',
        showMore: 'Показать Больше',
        close: 'Закрыть',
        save: 'Сохранить',
        share: 'Поделиться',
        favorite: 'Избранное',
        remove: 'Удалить'
      },
      
      // Trails
      trails: {
        title: 'Природные Тропы',
        subtitle: 'Исследуйте красивые пешеходные тропы Латвии',
        types: {
          hiking: 'Пешие Походы',
          cycling: 'Велоспорт',
          walking: 'Прогулки',
          running: 'Бег',
          nature: 'Изучение Природы'
        },
        difficulty: {
          easy: 'Легкая',
          moderate: 'Умеренная',
          hard: 'Сложная',
          expert: 'Экспертная'
        },
        features: {
          scenic: 'Живописные Виды',
          wildlife: 'Дикая Природа',
          historical: 'Исторические Места',
          waterfall: 'Водопад',
          lake: 'Озеро',
          forest: 'Лес',
          coastal: 'Побережье',
          educational: 'Образовательная Тропа'
        }
      },
      
      // Camping
      camping: {
        title: 'Места для Кемпинга',
        subtitle: 'Найдите идеальные места для отдыха на природе',
        types: {
          tent: 'Палаточный Кемпинг',
          rv: 'Автодома',
          cabin: 'Домик',
          glamping: 'Глэмпинг',
          wild: 'Дикий Кемпинг'
        },
        amenities: {
          toilets: 'Туалеты',
          showers: 'Душевые',
          water: 'Питьевая Вода',
          electricity: 'Электричество',
          wifi: 'WiFi',
          shop: 'Магазин',
          restaurant: 'Ресторан',
          playground: 'Детская Площадка',
          firepit: 'Место для Костра',
          bbq: 'Зона BBQ'
        }
      },
      
      // Fishing
      fishing: {
        title: 'Места для Рыбалки',
        subtitle: 'Лучшие места для рыбалки в Латвии',
        types: {
          river: 'Речная Рыбалка',
          lake: 'Озерная Рыбалка',
          sea: 'Морская Рыбалка',
          fly: 'Нахлыст',
          ice: 'Подледная Рыбалка'
        },
        species: {
          pike: 'Щука',
          perch: 'Окунь',
          trout: 'Форель',
          salmon: 'Лосось',
          carp: 'Карп',
          bream: 'Лещ'
        },
        licenses: {
          required: 'Лицензия Требуется',
          daily: 'Дневное Разрешение',
          seasonal: 'Сезонная Лицензия',
          free: 'Свободная Рыбалка'
        }
      },
      
      // Winter Sports
      winter: {
        title: 'Зимние Виды Спорта',
        subtitle: 'Снежные приключения по всей Латвии',
        activities: {
          skiing: 'Лыжные Гонки',
          snowshoeing: 'Снегоступы',
          sledding: 'Санки',
          skating: 'Катание на Коньках',
          hockey: 'Хоккей'
        },
        conditions: {
          excellent: 'Отлично',
          good: 'Хорошо',
          fair: 'Удовлетворительно',
          poor: 'Плохо',
          closed: 'Закрыто'
        }
      },
      
      // Transport & Parking
      transport: {
        title: 'Как Добраться',
        subtitle: 'Умные решения для транспорта и парковки',
        parking: {
          title: 'Парковка',
          available: 'Доступные Места',
          price: 'Цена за час',
          free: 'Бесплатная Парковка',
          paid: 'Платная Парковка',
          ev: 'Зарядка EV',
          disabled: 'Доступ для Инвалидов'
        },
        publicTransport: {
          title: 'Общественный Транспорт',
          bus: 'Автобус',
          train: 'Поезд',
          tram: 'Трамвай',
          schedule: 'Расписание',
          tickets: 'Билеты',
          realTime: 'Обновления в Реальном Времени'
        },
        driving: {
          title: 'Маршрут на Автомобиле',
          time: 'Расчетное Время',
          traffic: 'Дорожные Условия',
          tolls: 'Платные Дороги',
          fuel: 'Заправочные Станции'
        }
      },
      
      // Weather
      weather: {
        current: 'Текущая Погода',
        forecast: 'Прогноз',
        conditions: {
          sunny: 'Солнечно',
          cloudy: 'Облачно',
          rainy: 'Дождливо',
          snowy: 'Снежно',
          stormy: 'Шторм',
          foggy: 'Туман'
        },
        recommendations: {
          perfect: 'Идеальная погода для активного отдыха',
          good: 'Хорошие условия, небольшие меры предосторожности',
          fair: 'Удовлетворительная погода, проверьте рекомендации по снаряжению',
          poor: 'Плохие условия, рассмотрите перенос'
        }
      },
      
      // Gear
      gear: {
        title: 'Рекомендуемое Снаряжение',
        essential: 'Обязательное',
        optional: 'Необязательное',
        categories: {
          clothing: 'Одежда',
          footwear: 'Обувь',
          safety: 'Снаряжение Безопасности',
          navigation: 'Навигация',
          camping: 'Снаряжение для Кемпинга',
          food: 'Еда и Вода'
        },
        buyNow: 'Купить Сейчас',
        rentNear: 'Арендовать Рядом'
      },

      // Auth
      auth: {
        login: 'Вход',
        register: 'Регистрация',
        profile: 'Профиль',
        loginSubtitle: 'Войдите, чтобы отслеживать свои приключения',
        registerSubtitle: 'Создайте аккаунт, чтобы начать',
        name: 'Полное Имя',
        email: 'Адрес Электронной Почты',
        password: 'Пароль',
        confirmPassword: 'Подтвердить Пароль',
        location: 'Местоположение',
        loginButton: 'Войти',
        registerButton: 'Создать Аккаунт',
        noAccount: 'Нет аккаунта?',
        hasAccount: 'Уже есть аккаунт?',
        registerLink: 'Зарегистрируйтесь здесь',
        loginLink: 'Войдите здесь',
        features: 'Зачем Присоединяться?'
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;