import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  lv: {
    translation: {
      // Navigation
      nav: {
        chat: 'AI Konsultācija',
        medicines: 'Medikamenti',
        pets: 'Mājdzīvnieki',
        about: 'Par mums'
      },
      
      // Welcome & Headers
      welcome: {
        title: 'AI Veterinārais Asistents',
        subtitle: 'Profesionāla palīdzība jūsu mājdzīvniekiem 24/7',
        description: 'Saņemiet ekspertu padomus par mājdzīvnieku veselību, medikamentiem un uztura jautājumiem',
        aiConsultation: 'AI Veterinārā Konsultācija'
      },
      
      // Chat Interface
      chat: {
        title: 'AI Veterinārā Konsultācija',
        placeholder: 'Aprakstiet sava mājdzīvnieka problēmu...',
        inputPlaceholder: 'Aprakstiet sava mājdzīvnieka problēmu...',
        send: 'Sūtīt',
        sendButton: 'Sūtīt',
        thinking: 'Analizē...',
        selectPet: 'Izvēlieties mājdzīvnieka veidu',
        selectPetType: 'Izvēlieties mājdzīvnieka veidu',
        welcomeMessage: 'Sveiki! Es esmu jūsu AI veterinārais asistents',
        welcomeDescription: 'Aprakstiet sava mājdzīvnieka simptomus vai problēmu, un es sniegs profesionālus padomus',
        disclaimer: 'Šī informācija neaizstāj veterinārārsta konsultāciju',
        errorMessage: 'Radās kļūda. Lūdzu, mēģiniet vēlreiz.',
        petTypes: {
          dog: 'Suns',
          cat: 'Kaķis',
          bird: 'Putns',
          rabbit: 'Trusis',
          hamster: 'Kāmis',
          guinea_pig: 'Jūras cūciņa',
          fish: 'Zivs',
          reptile: 'Rāpulis'
        },
        examples: {
          title: 'Piemēri jautājumiem:',
          hairLoss: 'Manam sunim izkrišanas mati - kāds varētu būt iemesls?',
          appetite: 'Kaķis neēd jau otro dienu, kas darāms?',
          behavior: 'Putns ir kļuvis ļoti kluss un guļ daudz'
        }
      },
      
      // Medicine Database
      medicines: {
        title: 'Medikamentu un Barības Datubāze',
        search: 'Meklēt medikamentu vai barību...',
        searchButton: 'Meklēt',
        categories: {
          all: 'Visi',
          antibiotics: 'Antibiotikas',
          painkillers: 'Pretsāpju',
          vitamins: 'Vitamīni',
          food: 'Barība',
          supplements: 'Piedevas',
          antiparasitic: 'Pretparazītu līdzekļi',
          digestive: 'Gremošanas sistēmai',
          skin_care: 'Ādas kopšanai'
        },
        prescriptionRequired: 'Nepieciešama recepte',
        details: {
          usage: 'Lietošana',
          dosage: 'Deva',
          sideEffects: 'Blakusparādības',
          contraindications: 'Kontrindikācijas',
          ingredients: 'Sastāvs',
          suitableFor: 'Piemērots dzīvniekiem',
          important: 'Svarīgi!',
          warning: 'Pirms jebkura medikamenta lietošanas konsultējieties ar veterinārārstu. Nepareiza deva var būt bīstama jūsu mājdzīvnieka veselībai.'
        }
      },
      
      // Pet Profiles
      pets: {
        title: 'Mājdzīvnieku Profili',
        addNew: 'Pievienot jaunu',
        name: 'Vārds',
        species: 'Suga',
        breed: 'Šķirne',
        age: 'Vecums',
        weight: 'Svars',
        medicalHistory: 'Medicīniskā vēsture',
        allergies: 'Alerģijas',
        currentMedications: 'Pašreizējie medikamenti'
      },
      
      // Common
      common: {
        loading: 'Ielādē...',
        error: 'Radās kļūda',
        retry: 'Mēģināt vēlreiz',
        save: 'Saglabāt',
        cancel: 'Atcelt',
        edit: 'Rediģēt',
        delete: 'Dzēst',
        confirm: 'Apstiprināt',
        back: 'Atpakaļ',
        next: 'Tālāk',
        close: 'Aizvērt',
        search: 'Meklēt',
        clear: 'Notīrīt'
      },
      
      // Emergency
      emergency: {
        title: 'Ārkārtas gadījums!',
        warning: 'Ja jūsu mājdzīvniekam ir nopietnas veselības problēmas, nekavējoties vērsieties pie veterinārārsta!',
        symptoms: 'Ārkārtas simptomi:',
        symptomsList: [
          'Apgrūtināta elpošana',
          'Bezsamaņa',
          'Stipras sāpes',
          'Asiņošana',
          'Saindēšanās pazīmes'
        ]
      }
    }
  },
  
  ru: {
    translation: {
      // Navigation
      nav: {
        chat: 'ИИ Консультация',
        medicines: 'Медикаменты',
        pets: 'Питомцы',
        about: 'О нас'
      },
      
      // Welcome & Headers
      welcome: {
        title: 'ИИ Ветеринарный Ассистент',
        subtitle: 'Профессиональная помощь вашим питомцам 24/7',
        description: 'Получите экспертные советы по здоровью питомцев, медикаментам и вопросам питания',
        aiConsultation: 'ИИ Ветеринарная Консультация'
      },
      
      // Chat Interface
      chat: {
        title: 'ИИ Ветеринарная Консультация',
        placeholder: 'Опишите проблему вашего питомца...',
        inputPlaceholder: 'Опишите проблему вашего питомца...',
        send: 'Отправить',
        sendButton: 'Отправить',
        thinking: 'Анализирую...',
        selectPet: 'Выберите тип питомца',
        selectPetType: 'Выберите тип питомца',
        welcomeMessage: 'Привет! Я ваш ИИ ветеринарный ассистент',
        welcomeDescription: 'Опишите симптомы или проблему вашего питомца, и я дам профессиональные советы',
        disclaimer: 'Эта информация не заменяет консультацию ветеринара',
        errorMessage: 'Произошла ошибка. Пожалуйста, попробуйте снова.',
        petTypes: {
          dog: 'Собака',
          cat: 'Кошка',
          bird: 'Птица',
          rabbit: 'Кролик',
          hamster: 'Хомяк',
          guinea_pig: 'Морская свинка',
          fish: 'Рыба',
          reptile: 'Рептилия'
        },
        examples: {
          title: 'Примеры вопросов:',
          hairLoss: 'У моей собаки выпадает шерсть - в чем может быть причина?',
          appetite: 'Кошка не ест уже второй день, что делать?',
          behavior: 'Птица стала очень тихой и много спит'
        }
      },
      
      // Medicine Database
      medicines: {
        title: 'База Данных Медикаментов и Корма',
        search: 'Поиск медикаментов или корма...',
        searchButton: 'Найти',
        categories: {
          all: 'Все',
          antibiotics: 'Антибиотики',
          painkillers: 'Обезболивающие',
          vitamins: 'Витамины',
          food: 'Корм',
          supplements: 'Добавки',
          antiparasitic: 'Противопаразитарные',
          digestive: 'Для пищеварения',
          skin_care: 'Уход за кожей'
        },
        prescriptionRequired: 'Требуется рецепт',
        details: {
          usage: 'Применение',
          dosage: 'Дозировка',
          sideEffects: 'Побочные эффекты',
          contraindications: 'Противопоказания',
          ingredients: 'Состав',
          suitableFor: 'Подходит для животных',
          important: 'Важно!',
          warning: 'Перед применением любого медикамента проконсультируйтесь с ветеринаром. Неправильная дозировка может быть опасна для здоровья вашего питомца.'
        }
      },
      
      // Pet Profiles
      pets: {
        title: 'Профили Питомцев',
        addNew: 'Добавить нового',
        name: 'Имя',
        species: 'Вид',
        breed: 'Порода',
        age: 'Возраст',
        weight: 'Вес',
        medicalHistory: 'Медицинская история',
        allergies: 'Аллергии',
        currentMedications: 'Текущие медикаменты'
      },
      
      // Common
      common: {
        loading: 'Загрузка...',
        error: 'Произошла ошибка',
        retry: 'Попробовать снова',
        save: 'Сохранить',
        cancel: 'Отмена',
        edit: 'Редактировать',
        delete: 'Удалить',
        confirm: 'Подтвердить',
        back: 'Назад',
        next: 'Далее',
        close: 'Закрыть',
        search: 'Поиск',
        clear: 'Очистить'
      },
      
      // Emergency
      emergency: {
        title: 'Экстренный случай!',
        warning: 'Если у вашего питомца серьезные проблемы со здоровьем, немедленно обратитесь к ветеринару!',
        symptoms: 'Экстренные симптомы:',
        symptomsList: [
          'Затрудненное дыхание',
          'Потеря сознания',
          'Сильная боль',
          'Кровотечение',
          'Признаки отравления'
        ]
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'lv',
    debug: false,
    
    interpolation: {
      escapeValue: false,
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    }
  });

export default i18n;