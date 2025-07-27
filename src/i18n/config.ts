import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Language resources
const resources = {
  en: {
    translation: {
      // Navigation
      nav: {
        budget: 'Budget',
        deals: 'Deals',
        coupons: 'Coupons',
        chat: 'AI Assistant'
      },
      
      // Common
      common: {
        loading: 'Loading...',
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        add: 'Add',
        search: 'Search',
        filter: 'Filter',
        price: 'Price',
        currency: '€',
        settings: 'Settings',
        language: 'Language'
      },

      // Budget Tab
      budget: {
        title: 'Budget Tracker',
        dailyBudget: 'Daily Budget',
        weeklyBudget: 'Weekly Budget',
        monthlyBudget: 'Monthly Budget',
        currentSpending: 'Current Spending',
        remainingBudget: 'Remaining Budget',
        addExpense: 'Add Expense',
        expenseDescription: 'Description',
        expenseAmount: 'Amount',
        expenseCategory: 'Category',
        categories: {
          food: 'Food',
          transport: 'Transport',
          shopping: 'Shopping',
          entertainment: 'Entertainment',
          bills: 'Bills',
          other: 'Other'
        },
        insights: {
          title: 'AI Insights',
          overspending: 'You are overspending in {{category}}',
          saving: 'Great! You saved {{amount}} this week',
          recommendation: 'Try shopping at {{store}} for better deals'
        }
      },

      // Deals Tab
      deals: {
        title: 'Best Deals',
        stores: {
          maxima: 'Maxima',
          rimi: 'Rimi',
          barbora: 'Barbora',
          citro: 'Citro'
        },
        categories: {
          all: 'All Categories',
          food: 'Food & Drinks',
          household: 'Household',
          personal: 'Personal Care',
          electronics: 'Electronics'
        },
        discount: 'Discount',
        originalPrice: 'Original Price',
        salePrice: 'Sale Price',
        validUntil: 'Valid until',
        viewDeal: 'View Deal'
      },

      // Coupons Tab
      coupons: {
        title: 'Discount Coupons',
        code: 'Code',
        description: 'Description',
        minPurchase: 'Min. Purchase',
        maxDiscount: 'Max. Discount',
        expiresOn: 'Expires on',
        copyCoupon: 'Copy Code',
        copied: 'Copied!',
        active: 'Active',
        expired: 'Expired'
      },

      // AI Chat
      chat: {
        title: 'AI Budget Assistant',
        placeholder: 'Ask me about budgets, deals, or meal planning...',
        examples: {
          budget: 'How much can I spend today?',
          meal: 'Find me a 5€ meal',
          deals: 'What are the best deals at Maxima?',
          coupon: 'Do you have any discount codes?'
        },
        responses: {
          welcome: 'Hello! I\'m your AI budget assistant. How can I help you save money today?',
          budgetCheck: 'Based on your budget, you have {{amount}} left for today.',
          mealSuggestion: 'Here are some {{price}} meal ideas from local stores:',
          dealAlert: 'I found some great deals for you!'
        }
      }
    }
  },
  lv: {
    translation: {
      // Navigation
      nav: {
        budget: 'Budžets',
        deals: 'Piedāvājumi',
        coupons: 'Kuponi',
        chat: 'AI Asistents'
      },
      
      // Common
      common: {
        loading: 'Ielādē...',
        save: 'Saglabāt',
        cancel: 'Atcelt',
        delete: 'Dzēst',
        edit: 'Rediģēt',
        add: 'Pievienot',
        search: 'Meklēt',
        filter: 'Filtrēt',
        price: 'Cena',
        currency: '€',
        settings: 'Iestatījumi',
        language: 'Valoda'
      },

      // Budget Tab
      budget: {
        title: 'Budžeta Sekotājs',
        dailyBudget: 'Dienas Budžets',
        weeklyBudget: 'Nedēļas Budžets',
        monthlyBudget: 'Mēneša Budžets',
        currentSpending: 'Pašreizējie Tēriņi',
        remainingBudget: 'Atlikušais Budžets',
        addExpense: 'Pievienot Izdevumu',
        expenseDescription: 'Apraksts',
        expenseAmount: 'Summa',
        expenseCategory: 'Kategorija',
        categories: {
          food: 'Pārtika',
          transport: 'Transports',
          shopping: 'Iepirkšanās',
          entertainment: 'Izklaide',
          bills: 'Rēķini',
          other: 'Cits'
        },
        insights: {
          title: 'AI Ieskati',
          overspending: 'Jūs pārtērējat kategorijā {{category}}',
          saving: 'Lieliski! Jūs ietaupījāt {{amount}} šonedēļ',
          recommendation: 'Mēģiniet iepirkties veikalā {{store}} labākiem piedāvājumiem'
        }
      },

      // Deals Tab
      deals: {
        title: 'Labākie Piedāvājumi',
        stores: {
          maxima: 'Maxima',
          rimi: 'Rimi',
          barbora: 'Barbora',
          citro: 'Citro'
        },
        categories: {
          all: 'Visas Kategorijas',
          food: 'Pārtika un Dzērieni',
          household: 'Mājsaimniecība',
          personal: 'Personīgā Aprūpe',
          electronics: 'Elektronika'
        },
        discount: 'Atlaide',
        originalPrice: 'Sākotnējā Cena',
        salePrice: 'Akcijas Cena',
        validUntil: 'Derīgs līdz',
        viewDeal: 'Skatīt Piedāvājumu'
      },

      // Coupons Tab
      coupons: {
        title: 'Atlaižu Kuponi',
        code: 'Kods',
        description: 'Apraksts',
        minPurchase: 'Min. Pirkums',
        maxDiscount: 'Maks. Atlaide',
        expiresOn: 'Beidzas',
        copyCoupon: 'Kopēt Kodu',
        copied: 'Nokopēts!',
        active: 'Aktīvs',
        expired: 'Beidzies'
      },

      // AI Chat
      chat: {
        title: 'AI Budžeta Asistents',
        placeholder: 'Jautājiet man par budžetiem, piedāvājumiem vai ēdienu plānošanu...',
        examples: {
          budget: 'Cik es varu tērēt šodien?',
          meal: 'Atrodiet man 5€ ēdienu',
          deals: 'Kādi ir labākie piedāvājumi Maximā?',
          coupon: 'Vai jums ir atlaižu kodi?'
        },
        responses: {
          welcome: 'Sveiki! Es esmu jūsu AI budžeta asistents. Kā es varu palīdzēt jums ietaupīt naudu šodien?',
          budgetCheck: 'Pamatojoties uz jūsu budžetu, jums ir {{amount}} atlikuši šodienai.',
          mealSuggestion: 'Šeit ir daži {{price}} ēdienu ieteikumi no vietējiem veikaliem:',
          dealAlert: 'Es atradu jums dažus lieliski piedāvājumus!'
        }
      }
    }
  },
  ru: {
    translation: {
      // Navigation
      nav: {
        budget: 'Бюджет',
        deals: 'Предложения',
        coupons: 'Купоны',
        chat: 'AI Помощник'
      },
      
      // Common
      common: {
        loading: 'Загрузка...',
        save: 'Сохранить',
        cancel: 'Отмена',
        delete: 'Удалить',
        edit: 'Редактировать',
        add: 'Добавить',
        search: 'Поиск',
        filter: 'Фильтр',
        price: 'Цена',
        currency: '€',
        settings: 'Настройки',
        language: 'Язык'
      },

      // Budget Tab
      budget: {
        title: 'Трекер Бюджета',
        dailyBudget: 'Дневной Бюджет',
        weeklyBudget: 'Недельный Бюджет',
        monthlyBudget: 'Месячный Бюджет',
        currentSpending: 'Текущие Расходы',
        remainingBudget: 'Остаток Бюджета',
        addExpense: 'Добавить Расход',
        expenseDescription: 'Описание',
        expenseAmount: 'Сумма',
        expenseCategory: 'Категория',
        categories: {
          food: 'Еда',
          transport: 'Транспорт',
          shopping: 'Покупки',
          entertainment: 'Развлечения',
          bills: 'Счета',
          other: 'Другое'
        },
        insights: {
          title: 'AI Анализ',
          overspending: 'Вы превышаете бюджет в категории {{category}}',
          saving: 'Отлично! Вы сэкономили {{amount}} на этой неделе',
          recommendation: 'Попробуйте покупать в {{store}} для лучших предложений'
        }
      },

      // Deals Tab
      deals: {
        title: 'Лучшие Предложения',
        stores: {
          maxima: 'Maxima',
          rimi: 'Rimi',
          barbora: 'Barbora',
          citro: 'Citro'
        },
        categories: {
          all: 'Все Категории',
          food: 'Еда и Напитки',
          household: 'Для Дома',
          personal: 'Личная Гигиена',
          electronics: 'Электроника'
        },
        discount: 'Скидка',
        originalPrice: 'Первоначальная Цена',
        salePrice: 'Цена Акции',
        validUntil: 'Действует до',
        viewDeal: 'Посмотреть Предложение'
      },

      // Coupons Tab
      coupons: {
        title: 'Купоны на Скидку',
        code: 'Код',
        description: 'Описание',
        minPurchase: 'Мин. Покупка',
        maxDiscount: 'Макс. Скидка',
        expiresOn: 'Истекает',
        copyCoupon: 'Копировать Код',
        copied: 'Скопировано!',
        active: 'Активный',
        expired: 'Истёк'
      },

      // AI Chat
      chat: {
        title: 'AI Помощник по Бюджету',
        placeholder: 'Спросите меня о бюджетах, предложениях или планировании питания...',
        examples: {
          budget: 'Сколько я могу потратить сегодня?',
          meal: 'Найдите мне еду на 5€',
          deals: 'Какие лучшие предложения в Maxima?',
          coupon: 'У вас есть коды скидок?'
        },
        responses: {
          welcome: 'Привет! Я ваш AI помощник по бюджету. Как я могу помочь вам сэкономить деньги сегодня?',
          budgetCheck: 'На основе вашего бюджета, у вас осталось {{amount}} на сегодня.',
          mealSuggestion: 'Вот несколько идей еды за {{price}} из местных магазинов:',
          dealAlert: 'Я нашёл для вас отличные предложения!'
        }
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
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false,
    }
  });

export default i18n;