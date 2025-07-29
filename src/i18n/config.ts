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
        remove: 'Remove',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        success: 'Success',
        next: 'Next',
        previous: 'Previous',
        submit: 'Submit',
        of: 'of',
        time: {
          now: 'now',
          minutes: '{{count}}m ago',
          hours: '{{count}}h ago',
          days: '{{count}}d ago'
        }
      },
      
      // Profile
      profile: {
        loginRequired: 'Please log in to view your profile',
        tabs: {
          overview: 'Overview',
          gallery: 'Gallery',
          achievements: 'Achievements',
          social: 'Social',
          activity: 'Activity',
          settings: 'Settings'
        },
        bio: {
          aboutMe: 'About Me',
          edit: 'Edit Bio',
          save: 'Save Bio',
          cancel: 'Cancel',
          placeholder: 'Tell us about yourself and your adventures...',
          noBio: 'No bio added yet. Click edit to add your story!'
        },
        stats: {
          trailsCompleted: 'Trails Completed',
          photosShared: 'Photos Shared',
          points: 'Points',
          level: 'Level'
        },
        gallery: {
          title: 'Photo Gallery',
          addPhoto: 'Add Photo',
          noPhotos: 'No photos yet',
          sharePhotos: 'Share your adventure photos with the community!',
          caption: 'Photo Caption',
          upload: 'Upload Photo',
          cancel: 'Cancel'
        },
        achievements: {
          title: 'Achievements',
          unlocked: '{{count}} of {{total}} unlocked',
          categories: {
            trails: 'Trail Explorer',
            social: 'Social Butterfly',
            photos: 'Photo Master',
            special: 'Special Awards'
          }
        },
        social: {
          title: 'Social Connections',
          followers: 'Followers',
          following: 'Following',
          follow: 'Follow',
          unfollow: 'Unfollow',
          noConnections: 'No social connections yet',
          startFollowing: 'Start following other adventurers to see their activities!'
        },
        settings: {
          title: 'Profile Settings',
          theme: 'Profile Theme',
          verification: 'Verification',
          getVerified: 'Get Verified',
          verificationDesc: 'Become a verified guide by completing 10 trails and receiving positive reviews',
          privacy: 'Privacy Settings',
          makePublic: 'Make profile public',
          showActivity: 'Show activity timeline',
          findByEmail: 'Allow others to find me by email'
        }
      },
      
      // Trails
      trails: {
        title: 'Adventure Trails',
        subtitle: 'Discover Latvia\'s most beautiful hiking and adventure trails',
        searchPlaceholder: 'Search trails, locations, features...',
        filters: {
          allDifficulties: 'All Difficulties',
          easy: 'Easy',
          moderate: 'Moderate',
          hard: 'Hard',
          allRegions: 'All Regions',
          allSeasons: 'All Seasons',
          allTypes: 'All Types'
        },
        found: 'Found {{count}} trails',
        info: {
          distance: 'Distance',
          duration: 'Duration',
          elevation: 'Elevation',
          features: 'Features',
          contact: 'Contact',
          location: 'Location',
          getDirections: 'Get directions',
          addToFavorites: 'Add to favourites',
          trailInfo: 'Trail Info',
          parking: 'Parking',
          available: 'Available',
          notAvailable: 'N/A'
        },
        viewModes: {
          map: 'Map',
          list: 'List'
        },
        noResults: {
          title: 'No trails found',
          message: 'Try adjusting your search criteria'
        },
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

      // Education
      education: {
        title: 'Educational Hub',
        subtitle: 'Expand your knowledge of nature, history, culture, and outdoor skills through interactive learning experiences',
        categories: {
          nature: 'Nature Education',
          history: 'Historical Sites',
          culture: 'Cultural Heritage',
          photography: 'Photography',
          survival: 'Survival Skills'
        },
        descriptions: {
          nature: 'Flora, fauna, and ecosystems',
          history: 'Medieval castles and ancient stories',
          culture: 'Traditions and folk wisdom',
          photography: 'Capture stunning nature shots',
          survival: 'Wilderness safety and skills'
        },
        searchPlaceholder: 'Search educational content...',
        filters: {
          allLevels: 'All Levels',
          beginner: 'Beginner',
          intermediate: 'Intermediate',
          advanced: 'Advanced'
        },
        content: {
          duration: '{{count}} min',
          completedBy: '{{count}} completed',
          progress: 'Progress',
          completed: 'Completed',
          markComplete: 'Mark Complete',
          takeQuiz: 'Take Quiz',
          watchVideo: 'Watch Video',
          markAsWatched: 'Mark as Watched',
          playingVideo: 'Playing Educational Video...',
          videoContent: 'Educational video content',
          relatedLocation: 'Related Location',
          proTips: '💡 Pro Tips',
          alternativeOptions: '🔄 Alternative Options'
        },
        quiz: {
          title: 'Knowledge Quiz',
          question: 'Question',
          selectAnswer: 'Select the best answer:',
          correct: 'Correct! Well done!',
          correctMessage: 'You selected the right answer.',
          incorrect: 'Incorrect',
          incorrectMessage: 'The correct answer is highlighted in green.',
          submit: 'Submit Answer',
          finish: 'Finish Quiz',
          completed: 'Quiz completed! Score: {{score}}/{{total}} ({{percentage}}%)'
        },
        empty: 'Please log in to access educational content and track your learning progress.'
      },

      // AI Planner
      aiPlanner: {
        title: 'AI Adventure Planner',
        subtitle: 'Let artificial intelligence create the perfect adventure plan tailored to your preferences, budget, and experience level',
        steps: {
          preferences: 'Preferences',
          planning: 'AI Planning',
          results: 'Your Plans'
        },
        preferences: {
          title: 'Tell us about your adventure preferences',
          fitnessLevel: 'Fitness Level',
          interests: 'Interests (Select multiple)',
          groupSize: 'Group Size',
          duration: 'Duration (days)',
          budgetRange: 'Budget Range (EUR)',
          transportation: 'Transportation',
          accommodation: 'Accommodation',
          generatePlans: 'Generate AI Plans'
        },
        planning: {
          title: 'AI is crafting your perfect adventure...',
          analyzing: 'Analyzing your preferences...',
          weather: 'Checking weather conditions...',
          optimizing: 'Optimizing routes and activities...',
          calculating: 'Calculating budget estimates...'
        },
        results: {
          match: '{{score}}% match',
          totalEstimated: 'total estimated',
          transport: 'Transport',
          accommodation: 'Accommodation',
          riskLevel: 'Risk Level',
          viewDetails: 'View Details',
          budgetBreakdown: 'Budget Breakdown',
          equipmentList: 'Equipment List',
          exportPlan: 'Export Plan',
          share: 'Share',
          createAnother: 'Create Another Plan',
          recommendedEquipment: 'Recommended Equipment',
          essential: 'Essential',
          detailedItinerary: 'Detailed Itinerary',
          day: 'Day {{number}}',
          meals: 'Meals',
          breakfast: 'Breakfast',
          lunch: 'Lunch',
          dinner: 'Dinner'
        },
        empty: 'Please log in to access personalized adventure planning with AI recommendations.'
      },

      // Notifications
      notifications: {
        title: 'Notifications',
        unread: 'unread',
        empty: 'No notifications yet',
        emptyFiltered: 'No notifications match your filter',
        emptyDescription: 'When you get notifications, they\'ll show up here',
        loading: 'Loading notifications...',
        markAllRead: 'Mark all as read',
        markRead: 'Mark as read',
        delete: 'Delete notification',
        viewAll: 'View all notifications',
        newFollower: 'New Follower',
        newFollowerMessage: '{{name}} started following you',
        photoLiked: 'Photo Liked',
        photoLikedMessage: '{{name}} liked your photo from {{trail}}',
        achievementUnlocked: 'Achievement Unlocked',
        achievementMessage: 'You earned the "{{achievement}}" badge!',
        newComment: 'New Comment',
        commentMessage: '{{name}} commented on your {{trail}} post',
        welcomeBack: 'Welcome Back',
        welcomeMessage: 'Continue your adventure journey!',
        filters: {
          all: 'All',
          unread: 'Unread',
          mentions: 'Mentions',
          follows: 'Follows'
        },
        settings: 'Notification Settings',
        settingsDescription: 'Choose what notifications you want to receive',
        settings: {
          email: 'Email notifications',
          push: 'Push notifications',
          mentions: 'Mentions and replies',
          follows: 'New followers',
          likes: 'Likes on your posts',
          comments: 'Comments on your posts',
          achievements: 'Achievement unlocks',
          trails: 'Trail updates'
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
        bio: {
          aboutMe: 'Обо мне',
          edit: 'Редактировать биографию',
          save: 'Сохранить биографию',
          cancel: 'Отменить',
          placeholder: 'Расскажите нам о себе и своих приключениях...',
          noBio: 'Биография еще не добавлена. Нажмите редактировать, чтобы добавить свою историю!'
        },
        stats: {
          trailsCompleted: 'Пройдено троп',
          photosShared: 'Фото поделились',
          points: 'Очки',
          level: 'Уровень'
        },
        gallery: {
          addPhoto: 'Добавить фото',
          noPhotos: 'Пока нет фотографий',
          sharePhotos: 'Поделитесь фотографиями своих приключений с сообществом!'
        },
        achievements: {
          title: 'Достижения',
          unlocked: '{{count}} из {{total}} разблокировано',
          categories: {
            trails: 'Исследователь троп',
            social: 'Социальная бабочка',
            photos: 'Мастер фото',
            special: 'Особые награды'
          }
        },
        social: {
          title: 'Социальные связи',
          followers: 'Подписчики',
          following: 'Подписки',
          follow: 'Подписаться',
          unfollow: 'Отписаться',
          noConnections: 'Пока нет социальных связей',
          startFollowing: 'Начните следить за другими путешественниками, чтобы видеть их активность!'
        },
        settings: {
          title: 'Настройки профиля',
          theme: 'Тема профиля',
          verification: 'Верификация',
          getVerified: 'Получить верификацию',
          verificationDesc: 'Станьте верифицированным гидом, пройдя 10 троп и получив положительные отзывы',
          privacy: 'Настройки конфиденциальности',
          makePublic: 'Сделать профиль публичным',
          showActivity: 'Показать временную шкалу активности',
          findByEmail: 'Разрешить другим находить меня по электронной почте'
        }
      },
      
      // Trails
      trails: {
        title: 'Природные Тропы',
        subtitle: 'Исследуйте красивые пешеходные тропы Латвии',
        searchPlaceholder: 'Поиск троп, мест, особенностей...',
        filters: {
          allDifficulties: 'Все Сложности',
          easy: 'Легко',
          moderate: 'Средне',
          hard: 'Трудно',
          allRegions: 'Все Регионы',
          allSeasons: 'Все Сезоны',
          allTypes: 'Все Типы'
        },
        found: 'Найдено {{count}} троп',
        info: {
          distance: 'Расстояние',
          duration: 'Продолжительность',
          elevation: 'Высота',
          features: 'Особенности',
          contact: 'Контакт',
          location: 'Местоположение',
          getDirections: 'Получить маршрут',
          addToFavorites: 'Добавить в избранное',
          trailInfo: 'Информация о тропе',
          parking: 'Парковка',
          available: 'Доступно',
          notAvailable: 'Н/Д'
        },
        viewModes: {
          map: 'Карта',
          list: 'Список'
        },
        noResults: {
          title: 'Тропы не найдены',
          message: 'Попробуйте изменить критерии поиска'
        },
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
      
      // Profile
      profile: {
        bio: {
          aboutMe: 'Обо мне',
          edit: 'Редактировать биографию',
          save: 'Сохранить биографию',
          cancel: 'Отменить',
          placeholder: 'Расскажите нам о себе и своих приключениях...',
          noBio: 'Биография еще не добавлена. Нажмите редактировать, чтобы добавить свою историю!'
        },
        stats: {
          trailsCompleted: 'Пройдено троп',
          photosShared: 'Фото поделились',
        },
        achievements: {
          title: 'Достижения',
          earned: 'Заработано',
          progress: 'Прогресс'
        },
        social: {
          title: 'Социальные связи',
          followers: 'Подписчики',
          following: 'Подписки',
          follow: 'Подписаться',
          unfollow: 'Отписаться',
          noConnections: 'Пока нет социальных связей',
          startFollowing: 'Начните следить за другими искателями приключений, чтобы видеть их активность!'
        },
        gallery: {
          title: 'Фото галерея',
          addPhoto: 'Добавить фото',
          noPhotos: 'Пока нет фото',
          sharePhotos: 'Поделитесь своими фотографиями приключений с сообществом!',
          caption: 'Подпись к фото',
          upload: 'Загрузить фото',
          cancel: 'Отменить'
        },
        settings: {
          title: 'Настройки профиля',
          theme: 'Тема профиля',
          verification: 'Верификация',
          getVerified: 'Получить верификацию',
          verificationDesc: 'Станьте верифицированным гидом, пройдя 10 троп и получив положительные отзывы',
          privacy: 'Настройки приватности',
          makePublic: 'Сделать профиль публичным',
          showActivity: 'Показывать временную шкалу активности',
          findByEmail: 'Разрешить другим найти меня по email'
        }
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