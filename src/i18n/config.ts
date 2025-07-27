import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // App
      app: {
        title: 'Latvian Budget & Deals Assistant',
        subtitle: 'AI-powered budget tracking for Latvia'
      },
      
      // Navigation
      nav: {
        budget: 'Budget',
        deals: 'Deals',
        coupons: 'Coupons',
        stores: 'Store Locator',
        chat: 'AI Chat'
      },
      
      // Common
      common: {
        add: 'Add',
        edit: 'Edit',
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        search: 'Search',
        filter: 'Filter',
        refresh: 'Refresh',
        loading: 'Loading...',
        close: 'Close',
        open: 'Open',
        closed: 'Closed',
        yes: 'Yes',
        no: 'No',
        back: 'Back',
        next: 'Next',
        copied: 'Copied!',
        copy: 'Copy'
      },
      
      // Budget Tab
      budget: {
        title: 'Budget Tracker',
        subtitle: 'Track your expenses and manage your money',
        daily: 'Daily Budget',
        weekly: 'Weekly Budget',
        monthly: 'Monthly Budget',
        addExpense: 'Add Expense',
        recentExpenses: 'Recent Expenses',
        noExpenses: 'No expenses yet. Add your first expense!',
        description: 'Description',
        amount: 'Amount',
        category: 'Category',
        balance: 'Balance',
        currentBalance: 'Current Balance',
        editBalance: 'Edit Balance',
        editBudget: 'Edit Budget',
        editBudgetLimits: 'Edit Budget Limits',
        dailyBudgetEur: 'Daily Budget (EUR)',
        weeklyBudgetEur: 'Weekly Budget (EUR)',
        monthlyBudgetEur: 'Monthly Budget (EUR)',
        setLimits: 'Set your spending limits for better budget tracking',
        saveBudget: 'Save Budget',
        balanceDeduction: 'Amount will be deducted from your balance',
        smartTracking: 'Smart Budget Tracking',
        smartTrackingDesc: 'Set your budget limits and track expenses automatically. All data is saved locally in your browser.',
        insights: {
          title: 'AI Insights',
          overDaily: 'You\'ve exceeded your daily budget today',
          underDaily: 'You\'re within your daily budget - great job!',
          nearMonthly: 'You\'re approaching your monthly budget limit',
          foodHigh: 'Food expenses are high this month',
          onTrack: 'You\'re on track with your budget goals!',
          lowBalance: 'Your balance is getting low. Consider checking the deals tab for savings!'
        },
        categories: {
          food: 'Food',
          transport: 'Transport',
          entertainment: 'Entertainment',
          shopping: 'Shopping',
          bills: 'Bills',
          other: 'Other'
        }
      },
      
      // Deals Tab
      deals: {
        title: 'Best Deals',
        subtitle: 'Discover amazing deals across Latvia',
        totalDeals: 'Total Deals',
        avgDiscount: 'Avg. Discount',
        activeStores: 'Active Stores',
        lastUpdated: 'Last Updated',
        store: 'Store',
        category: 'Category',
        sortBy: 'Sort By',
        distance: 'Distance',
        discount: 'Discount',
        name: 'Name',
        rating: 'Rating',
        allStores: 'All Stores',
        allCategories: 'All Categories',
        validUntil: 'Valid until',
        getDirections: 'Get Directions',
        noDeals: 'No deals found matching your criteria',
        smartDiscovery: 'Smart Deal Discovery',
        smartDiscoveryDesc: 'Our AI analyzes store promotions, weekly flyers, and community reports to find the best deals across Latvia.',
        features: {
          flyerAnalysis: 'Weekly store flyers analysis',
          communityVerification: 'Community deal verification',
          aiComparison: 'AI-powered price comparison',
          storeLocator: 'Use Store Locator for directions'
        }
      },
      
      // Coupons Tab
      coupons: {
        title: 'Discount Coupons',
        subtitle: 'Active discount codes for Latvian stores',
        activeCoupons: 'Active Coupons',
        avgSuccessRate: 'Avg Success Rate',
        totalSavings: 'Total Savings',
        partnerStores: 'Partner Stores',
        code: 'Code',
        copyCoupon: 'Copy Coupon',
        copied: 'Copied!',
        minPurchase: 'Min. purchase',
        maxDiscount: 'Max. discount',
        expires: 'Expires',
        successRate: 'Success rate',
        timesUsed: 'Times used',
        verified: 'Verified',
        visitStore: 'Visit Store',
        noCoupons: 'No coupons found for the selected filters',
        liveVerification: 'Live Coupon Verification Active',
        liveVerificationDesc: 'All coupon codes are verified in real-time from official store APIs and community reports. Success rates are updated based on actual usage data.'
      },
      
      // Store Locator Tab
      stores: {
        title: 'Store Locator',
        subtitle: 'Find nearby stores across Latvia',
        storesFound: 'Stores Found',
        openNow: 'Open Now',
        withParking: 'With Parking',
        avgRating: 'Avg Rating',
        storeChain: 'Store Chain',
        city: 'City',
        allChains: 'All Chains',
        allCities: 'All Cities',
        directions: 'Directions',
        phone: 'Phone',
        features: 'Features',
        parking: 'Parking',
        atm: 'ATM',
        rating: 'Rating',
        noStores: 'No stores found matching your criteria',
        locationBased: 'Location-Based Search',
        locationBasedDesc: 'Distances calculated from your current location. Grant location access for more accurate results.',
        locationBasedDescDenied: 'Enable location access to see distances to stores and get personalized recommendations.',
        storeTypes: {
          hypermarket: 'Hypermarket',
          large: 'Large Store',
          medium: 'Medium Store',
          small: 'Small Store'
        }
      },
      
      // Chat Tab
      chat: {
        title: 'AI Assistant',
        subtitle: 'Get smart budget advice and local insights',
        typeMessage: 'Type your message...',
        quickActions: 'Quick Actions',
        quickBudget: 'Check my budget',
        quickStores: 'Find nearby stores',
        quickDeals: 'Show best deals',
        quickCoupons: 'Available coupons',
        quickMeal: 'Meal for €5',
        quickSavings: 'How to save money',
        confidence: 'Confidence',
        suggestions: 'Suggestions',
        aiThinking: 'AI is thinking...',
        welcomeMessage: 'Hello! I\'m your Latvian budget assistant. How can I help you save money today?',
        errorMessage: 'Sorry, I encountered an error. Please try again or ask something else.'
      }
    }
  },
  
  lv: {
    translation: {
      // App
      app: {
        title: 'Latvijas Budžeta un Piedāvājumu Asistents',
        subtitle: 'AI darbināma budžeta izsekošana Latvijai'
      },
      
      // Navigation
      nav: {
        budget: 'Budžets',
        deals: 'Piedāvājumi',
        coupons: 'Kuponi',
        stores: 'Veikalu Meklētājs',
        chat: 'AI Čats'
      },
      
      // Common
      common: {
        add: 'Pievienot',
        edit: 'Rediģēt',
        save: 'Saglabāt',
        cancel: 'Atcelt',
        delete: 'Dzēst',
        search: 'Meklēt',
        filter: 'Filtrēt',
        refresh: 'Atjaunot',
        loading: 'Ielādē...',
        close: 'Aizvērt',
        open: 'Atvērts',
        closed: 'Slēgts',
        yes: 'Jā',
        no: 'Nē',
        back: 'Atpakaļ',
        next: 'Tālāk',
        copied: 'Nokopēts!',
        copy: 'Kopēt'
      },
      
      // Budget Tab
      budget: {
        title: 'Budžeta Izsekotājs',
        subtitle: 'Sekojiet saviem tēriņiem un pārvaldiet naudu',
        daily: 'Dienas Budžets',
        weekly: 'Nedēļas Budžets',
        monthly: 'Mēneša Budžets',
        addExpense: 'Pievienot Tēriņu',
        recentExpenses: 'Pēdējie Tēriņi',
        noExpenses: 'Nav tēriņu. Pievienojiet savu pirmo tēriņu!',
        description: 'Apraksts',
        amount: 'Summa',
        category: 'Kategorija',
        balance: 'Bilance',
        currentBalance: 'Pašreizējā Bilance',
        editBalance: 'Rediģēt Bilanci',
        editBudget: 'Rediģēt Budžetu',
        editBudgetLimits: 'Rediģēt Budžeta Limitus',
        dailyBudgetEur: 'Dienas Budžets (EUR)',
        weeklyBudgetEur: 'Nedēļas Budžets (EUR)',
        monthlyBudgetEur: 'Mēneša Budžets (EUR)',
        setLimits: 'Iestatiet savus tēriņu limitus labākai budžeta izsekošanai',
        saveBudget: 'Saglabāt Budžetu',
        balanceDeduction: 'Summa tiks atskaitīta no jūsu bilances',
        smartTracking: 'Viedā Budžeta Izsekošana',
        smartTrackingDesc: 'Iestatiet budžeta limitus un automātiski sekojiet tēriņiem. Visi dati tiek saglabāti lokāli jūsu pārlūkprogrammā.',
        insights: {
          title: 'AI Ieskati',
          overDaily: 'Jūs esat pārsniedzis dienas budžetu šodien',
          underDaily: 'Jūs iekļaujaties dienas budžetā - lieliski!',
          nearMonthly: 'Jūs tuvojaties mēneša budžeta limitam',
          foodHigh: 'Pārtikas tēriņi ir augsti šomēnes',
          onTrack: 'Jūs esat pareizajā ceļā ar budžeta mērķiem!',
          lowBalance: 'Jūsu bilance kļūst zema. Apsveriet piedāvājumu sadaļu ietaupījumiem!'
        },
        categories: {
          food: 'Pārtika',
          transport: 'Transports',
          entertainment: 'Izklaide',
          shopping: 'Iepirkšanās',
          bills: 'Rēķini',
          other: 'Cits'
        }
      },
      
      // Deals Tab
      deals: {
        title: 'Labākie Piedāvājumi',
        subtitle: 'Atklājiet neticamus piedāvājumus visā Latvijā',
        totalDeals: 'Kopā Piedāvājumi',
        avgDiscount: 'Vid. Atlaide',
        activeStores: 'Aktīvie Veikali',
        lastUpdated: 'Pēdējo reizi Atjaunots',
        store: 'Veikals',
        category: 'Kategorija',
        sortBy: 'Kārtot pēc',
        distance: 'Attālums',
        discount: 'Atlaide',
        name: 'Nosaukums',
        rating: 'Vērtējums',
        allStores: 'Visi Veikali',
        allCategories: 'Visas Kategorijas',
        validUntil: 'Derīgs līdz',
        getDirections: 'Iegūt Norādes',
        noDeals: 'Nav atrasti piedāvājumi, kas atbilst jūsu kritērijiem',
        smartDiscovery: 'Viedā Piedāvājumu Atklāšana',
        smartDiscoveryDesc: 'Mūsu AI analizē veikalu akcijas, nedēļas bukletus un kopienas ziņojumus, lai atrastu labākos piedāvājumus Latvijā.',
        features: {
          flyerAnalysis: 'Nedēļas veikalu buklesu analīze',
          communityVerification: 'Kopienas piedāvājumu pārbaude',
          aiComparison: 'AI darbināma cenu salīdzināšana',
          storeLocator: 'Izmantojiet Veikalu Meklētāju norādēm'
        }
      },
      
      // Coupons Tab
      coupons: {
        title: 'Atlaižu Kuponi',
        subtitle: 'Aktīvie atlaižu kodi Latvijas veikaliem',
        activeCoupons: 'Aktīvie Kuponi',
        avgSuccessRate: 'Vid. Veiksmes Līmenis',
        totalSavings: 'Kopējie Ietaupījumi',
        partnerStores: 'Partneru Veikali',
        code: 'Kods',
        copyCoupon: 'Kopēt Kuponu',
        copied: 'Nokopēts!',
        minPurchase: 'Min. pirkums',
        maxDiscount: 'Maks. atlaide',
        expires: 'Beidzas',
        successRate: 'Veiksmes līmenis',
        timesUsed: 'Reižu izmantots',
        verified: 'Pārbaudīts',
        visitStore: 'Apmeklēt Veikalu',
        noCoupons: 'Nav atrasti kuponi atlasītajiem filtriem',
        liveVerification: 'Dzīvā Kuponu Pārbaude Aktīva',
        liveVerificationDesc: 'Visi kuponu kodi tiek pārbaudīti reāllaikā no oficiālajiem veikalu API un kopienas ziņojumiem. Veiksmes līmeņi tiek atjaunoti, pamatojoties uz faktiskajiem lietošanas datiem.'
      },
      
      // Store Locator Tab
      stores: {
        title: 'Veikalu Meklētājs',
        subtitle: 'Atrodiet tuvējos veikalus visā Latvijā',
        storesFound: 'Atrasto Veikalu',
        openNow: 'Tagad Atvērti',
        withParking: 'Ar Stāvvietu',
        avgRating: 'Vid. Vērtējums',
        storeChain: 'Veikalu Ķēde',
        city: 'Pilsēta',
        allChains: 'Visas Ķēdes',
        allCities: 'Visas Pilsētas',
        directions: 'Norādes',
        phone: 'Tālrunis',
        features: 'Funkcijas',
        parking: 'Stāvvieta',
        atm: 'Bankomāts',
        rating: 'Vērtējums',
        noStores: 'Nav atrasti veikali, kas atbilst jūsu kritērijiem',
        locationBased: 'Atrašanās Vietas Meklēšana',
        locationBasedDesc: 'Attālumi aprēķināti no jūsu pašreizējās atrašanās vietas. Atļaujiet piekļuvi atrašanās vietai precīzākiem rezultātiem.',
        locationBasedDescDenied: 'Iespējojiet piekļuvi atrašanās vietai, lai redzētu attālumus līdz veikaliem un saņemtu personalizētus ieteikumus.',
        storeTypes: {
          hypermarket: 'Hiperveikals',
          large: 'Liels Veikals',
          medium: 'Vidējs Veikals',
          small: 'Mazs Veikals'
        }
      },
      
      // Chat Tab
      chat: {
        title: 'AI Asistents',
        subtitle: 'Saņemiet viedus budžeta padomus un vietējos ieskatus',
        typeMessage: 'Ierakstiet savu ziņojumu...',
        quickActions: 'Ātrās Darbības',
        quickBudget: 'Pārbaudīt manu budžetu',
        quickStores: 'Atrast tuvējos veikalus',
        quickDeals: 'Rādīt labākos piedāvājumus',
        quickCoupons: 'Pieejamie kuponi',
        quickMeal: 'Ēdiens par €5',
        quickSavings: 'Kā taupīt naudu',
        confidence: 'Pārliecība',
        suggestions: 'Ieteikumi',
        aiThinking: 'AI domā...',
        welcomeMessage: 'Sveiki! Es esmu jūsu Latvijas budžeta asistents. Kā varu palīdzēt jums šodien taupīt naudu?',
        errorMessage: 'Atvainojiet, es saskāros ar kļūdu. Lūdzu, mēģiniet vēlreiz vai jautājiet kaut ko citu.'
      }
    }
  },
  
  ru: {
    translation: {
      // App
      app: {
        title: 'Латвийский Помощник по Бюджету и Скидкам',
        subtitle: 'Отслеживание бюджета с ИИ для Латвии'
      },
      
      // Navigation
      nav: {
        budget: 'Бюджет',
        deals: 'Скидки',
        coupons: 'Купоны',
        stores: 'Поиск Магазинов',
        chat: 'ИИ Чат'
      },
      
      // Common
      common: {
        add: 'Добавить',
        edit: 'Редактировать',
        save: 'Сохранить',
        cancel: 'Отмена',
        delete: 'Удалить',
        search: 'Поиск',
        filter: 'Фильтр',
        refresh: 'Обновить',
        loading: 'Загрузка...',
        close: 'Закрыть',
        open: 'Открыто',
        closed: 'Закрыто',
        yes: 'Да',
        no: 'Нет',
        back: 'Назад',
        next: 'Далее',
        copied: 'Скопировано!',
        copy: 'Копировать'
      },
      
      // Budget Tab
      budget: {
        title: 'Трекер Бюджета',
        subtitle: 'Отслеживайте расходы и управляйте деньгами',
        daily: 'Дневной Бюджет',
        weekly: 'Недельный Бюджет',
        monthly: 'Месячный Бюджет',
        addExpense: 'Добавить Расход',
        recentExpenses: 'Последние Расходы',
        noExpenses: 'Пока нет расходов. Добавьте свой первый расход!',
        description: 'Описание',
        amount: 'Сумма',
        category: 'Категория',
        balance: 'Баланс',
        currentBalance: 'Текущий Баланс',
        editBalance: 'Редактировать Баланс',
        editBudget: 'Редактировать Бюджет',
        editBudgetLimits: 'Редактировать Лимиты Бюджета',
        dailyBudgetEur: 'Дневной Бюджет (EUR)',
        weeklyBudgetEur: 'Недельный Бюджет (EUR)',
        monthlyBudgetEur: 'Месячный Бюджет (EUR)',
        setLimits: 'Установите лимиты расходов для лучшего отслеживания бюджета',
        saveBudget: 'Сохранить Бюджет',
        balanceDeduction: 'Сумма будет вычтена из вашего баланса',
        smartTracking: 'Умное Отслеживание Бюджета',
        smartTrackingDesc: 'Устанавливайте лимиты бюджета и автоматически отслеживайте расходы. Все данные сохраняются локально в вашем браузере.',
        insights: {
          title: 'ИИ Аналитика',
          overDaily: 'Вы превысили дневной бюджет сегодня',
          underDaily: 'Вы в рамках дневного бюджета - отлично!',
          nearMonthly: 'Вы приближаетесь к лимиту месячного бюджета',
          foodHigh: 'Расходы на еду высоки в этом месяце',
          onTrack: 'Вы на правильном пути с целями бюджета!',
          lowBalance: 'Ваш баланс становится низким. Рассмотрите вкладку со скидками для экономии!'
        },
        categories: {
          food: 'Еда',
          transport: 'Транспорт',
          entertainment: 'Развлечения',
          shopping: 'Покупки',
          bills: 'Счета',
          other: 'Другое'
        }
      },
      
      // Deals Tab
      deals: {
        title: 'Лучшие Скидки',
        subtitle: 'Откройте удивительные скидки по всей Латвии',
        totalDeals: 'Всего Скидок',
        avgDiscount: 'Средняя Скидка',
        activeStores: 'Активные Магазины',
        lastUpdated: 'Последнее Обновление',
        store: 'Магазин',
        category: 'Категория',
        sortBy: 'Сортировать по',
        distance: 'Расстояние',
        discount: 'Скидка',
        name: 'Название',
        rating: 'Рейтинг',
        allStores: 'Все Магазины',
        allCategories: 'Все Категории',
        validUntil: 'Действительно до',
        getDirections: 'Проложить Маршрут',
        noDeals: 'Не найдено скидок, соответствующих вашим критериям',
        smartDiscovery: 'Умное Обнаружение Скидок',
        smartDiscoveryDesc: 'Наш ИИ анализирует акции магазинов, еженедельные флаеры и отчеты сообщества, чтобы найти лучшие скидки в Латвии.',
        features: {
          flyerAnalysis: 'Анализ еженедельных флаеров магазинов',
          communityVerification: 'Проверка скидок сообществом',
          aiComparison: 'Сравнение цен с помощью ИИ',
          storeLocator: 'Используйте Поиск Магазинов для направлений'
        }
      },
      
      // Coupons Tab
      coupons: {
        title: 'Скидочные Купоны',
        subtitle: 'Активные коды скидок для латвийских магазинов',
        activeCoupons: 'Активные Купоны',
        avgSuccessRate: 'Средний Процент Успеха',
        totalSavings: 'Общая Экономия',
        partnerStores: 'Партнерские Магазины',
        code: 'Код',
        copyCoupon: 'Копировать Купон',
        copied: 'Скопировано!',
        minPurchase: 'Мин. покупка',
        maxDiscount: 'Макс. скидка',
        expires: 'Истекает',
        successRate: 'Процент успеха',
        timesUsed: 'Раз использован',
        verified: 'Проверено',
        visitStore: 'Посетить Магазин',
        noCoupons: 'Не найдено купонов для выбранных фильтров',
        liveVerification: 'Активна Живая Проверка Купонов',
        liveVerificationDesc: 'Все коды купонов проверяются в реальном времени из официальных API магазинов и отчетов сообщества. Показатели успеха обновляются на основе фактических данных использования.'
      },
      
      // Store Locator Tab
      stores: {
        title: 'Поиск Магазинов',
        subtitle: 'Найдите ближайшие магазины по всей Латвии',
        storesFound: 'Найдено Магазинов',
        openNow: 'Открыто Сейчас',
        withParking: 'С Парковкой',
        avgRating: 'Средний Рейтинг',
        storeChain: 'Сеть Магазинов',
        city: 'Город',
        allChains: 'Все Сети',
        allCities: 'Все Города',
        directions: 'Маршрут',
        phone: 'Телефон',
        features: 'Особенности',
        parking: 'Парковка',
        atm: 'Банкомат',
        rating: 'Рейтинг',
        noStores: 'Не найдено магазинов, соответствующих вашим критериям',
        locationBased: 'Поиск по Местоположению',
        locationBasedDesc: 'Расстояния рассчитаны от вашего текущего местоположения. Разрешите доступ к местоположению для более точных результатов.',
        locationBasedDescDenied: 'Включите доступ к местоположению, чтобы видеть расстояния до магазинов и получать персонализированные рекомендации.',
        storeTypes: {
          hypermarket: 'Гипермаркет',
          large: 'Большой Магазин',
          medium: 'Средний Магазин',
          small: 'Малый Магазин'
        }
      },
      
      // Chat Tab
      chat: {
        title: 'ИИ Помощник',
        subtitle: 'Получите умные советы по бюджету и местную информацию',
        typeMessage: 'Введите ваше сообщение...',
        quickActions: 'Быстрые Действия',
        quickBudget: 'Проверить мой бюджет',
        quickStores: 'Найти ближайшие магазины',
        quickDeals: 'Показать лучшие скидки',
        quickCoupons: 'Доступные купоны',
        quickMeal: 'Еда за €5',
        quickSavings: 'Как сэкономить деньги',
        confidence: 'Уверенность',
        suggestions: 'Предложения',
        aiThinking: 'ИИ думает...',
        welcomeMessage: 'Привет! Я ваш помощник по бюджету в Латвии. Как я могу помочь вам сэкономить деньги сегодня?',
        errorMessage: 'Извините, я столкнулся с ошибкой. Пожалуйста, попробуйте еще раз или спросите что-то еще.'
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