interface AIResponse {
  response: string;
  confidence: number;
  suggestions: string[];
  language: string;
}

interface BudgetContext {
  balance: number;
  expenses: any[];
  dailyBudget: number;
  weeklyBudget: number;
  monthlyBudget: number;
}

class FreeAIService {
  private conversationHistory: string[] = [];
  private budgetTips = {
    en: [
      "Try meal planning to reduce food costs by 20-30%",
      "Use the Store Locator to find the nearest discount stores",
      "Check our Coupons tab for active discounts at Maxima and Rimi",
      "Consider buying in bulk at hypermarkets for better prices",
      "Track your daily spending to identify unnecessary expenses"
    ],
    lv: [
      "Izmēģiniet ēdiena plānošanu, lai samazinātu pārtikas izmaksas par 20-30%",
      "Izmantojiet veikalu meklētāju, lai atrastu tuvākos atlaižu veikalus",
      "Pārbaudiet mūsu Kuponu sadaļu aktīvajām atlaidēm Maximā un Rimi",
      "Apsveriet iespēju pirkt lielākos daudzumos hiperveikalos labākām cenām",
      "Sekojiet saviem ikdienas tēriņiem, lai identificētu nevajadzīgus izdevumus"
    ],
    ru: [
      "Попробуйте планирование питания, чтобы снизить расходы на еду на 20-30%",
      "Используйте поиск магазинов, чтобы найти ближайшие дисконтные магазины",
      "Проверьте раздел купонов для активных скидок в Maxima и Rimi",
      "Рассмотрите покупки оптом в гипермаркетах для лучших цен",
      "Отслеживайте ежедневные расходы, чтобы выявить ненужные траты"
    ]
  };

  private storeInfo = {
    en: {
      maxima: "Maxima is Latvia's largest retail chain with hypermarkets offering competitive prices",
      rimi: "Rimi specializes in quality products and fresh food, located in major shopping centers",
      barbora: "Barbora offers convenient online grocery shopping with pickup points across Latvia",
      mego: "Mego provides 24/7 fuel services with convenience stores across Latvia",
      apotheka: "Apotheka is a leading pharmacy chain offering prescription drugs and health consultations"
    },
    lv: {
      maxima: "Maxima ir Latvijas lielākais mazumtirdzniecības tīkls ar hiperveikaliem, kas piedāvā konkurētspējīgas cenas",
      rimi: "Rimi specializējas kvalitatīvos produktos un svaigā pārtikā, atrodas lielos iepirkšanās centros",
      barbora: "Barbora piedāvā ērtu tiešsaistes pārtikas iepirkšanos ar saņemšanas punktiem visā Latvijā",
      mego: "Mego nodrošina 24/7 degvielas pakalpojumus ar ērtības veikaliem visā Latvijā",
      apotheka: "Apotheka ir vadošais aptieku tīkls, kas piedāvā recepšu medikamentus un veselības konsultācijas"
    },
    ru: {
      maxima: "Maxima - крупнейшая розничная сеть Латвии с гипермаркетами, предлагающими конкурентные цены",
      rimi: "Rimi специализируется на качественных продуктах и свежей еде, расположена в крупных торговых центрах",
      barbora: "Barbora предлагает удобные онлайн-покупки продуктов с пунктами выдачи по всей Латвии",
      mego: "Mego предоставляет круглосуточные услуги заправки с магазинами удобств по всей Латвии",
      apotheka: "Apotheka - ведущая сеть аптек, предлагающая рецептурные лекарства и консультации по здоровью"
    }
  };

  private responses = {
    en: {
      greeting: ["Hello! I'm your Latvian budget assistant. How can I help you save money today?", "Hi there! Ready to optimize your spending in Latvia?"],
      budget: ["Let me analyze your budget...", "Looking at your spending patterns..."],
      stores: ["I can help you find the best stores for your needs!", "Let me suggest some great shopping options!"],
      coupons: ["Don't forget to check our coupons section for active discounts!", "I see some great deals available right now!"],
      general: ["That's an interesting question! Let me help you with that.", "I'm here to help with your budget and shopping needs!"]
    },
    lv: {
      greeting: ["Sveiki! Es esmu jūsu Latvijas budžeta asistents. Kā varu palīdzēt jums šodien taupīt naudu?", "Labdien! Vai esat gatavs optimizēt savus tēriņus Latvijā?"],
      budget: ["Ļaujiet man analizēt jūsu budžetu...", "Skatos jūsu tēriņu modeļus..."],
      stores: ["Es varu palīdzēt jums atrast labākos veikalus jūsu vajadzībām!", "Ļaujiet man ieteikt dažas lieliskas iepirkšanās iespējas!"],
      coupons: ["Neaizmirstiet pārbaudīt mūsu kuponu sadaļu aktīvajām atlaidēm!", "Es redzu dažas lieliskas piedāvājumus, kas ir pieejami tūlīt!"],
      general: ["Tas ir interesants jautājums! Ļaujiet man palīdzēt jums ar to.", "Es esmu šeit, lai palīdzētu ar jūsu budžetu un iepirkšanās vajadzībām!"]
    },
    ru: {
      greeting: ["Привет! Я ваш помощник по бюджету в Латвии. Как я могу помочь вам сэкономить деньги сегодня?", "Здравствуйте! Готовы оптимизировать свои расходы в Латвии?"],
      budget: ["Позвольте мне проанализировать ваш бюджет...", "Изучаю ваши модели трат..."],
      stores: ["Я могу помочь вам найти лучшие магазины для ваших нужд!", "Позвольте мне предложить отличные варианты для покупок!"],
      coupons: ["Не забудьте проверить раздел купонов для активных скидок!", "Я вижу отличные предложения, доступные прямо сейчас!"],
      general: ["Интересный вопрос! Позвольте мне помочь вам с этим.", "Я здесь, чтобы помочь с вашим бюджетом и покупками!"]
    }
  };

  detectLanguage(text: string): string {
    const latvianWords = ['budžets', 'nauda', 'veikals', 'cena', 'atlaide', 'pārtika', 'tēriņi', 'maxima', 'rimi'];
    const russianWords = ['бюджет', 'деньги', 'магазин', 'цена', 'скидка', 'еда', 'расходы', 'максима', 'рими'];
    
    const lowerText = text.toLowerCase();
    
    const latvianCount = latvianWords.filter(word => lowerText.includes(word)).length;
    const russianCount = russianWords.filter(word => lowerText.includes(word)).length;
    
    if (latvianCount > russianCount && latvianCount > 0) return 'lv';
    if (russianCount > 0) return 'ru';
    return 'en';
  }

  analyzeIntent(message: string, language: string): string {
    const lowerMessage = message.toLowerCase();
    
    // Budget-related keywords
    const budgetKeywords = ['budget', 'money', 'spend', 'save', 'expense', 'cost', 'price', 'budžets', 'nauda', 'tēriņi', 'cena', 'бюджет', 'деньги', 'расходы', 'цена'];
    if (budgetKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return 'budget';
    }
    
    // Store-related keywords
    const storeKeywords = ['store', 'shop', 'maxima', 'rimi', 'barbora', 'mego', 'veikals', 'магазин', 'покупки'];
    if (storeKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return 'stores';
    }
    
    // Coupon-related keywords
    const couponKeywords = ['coupon', 'discount', 'deal', 'offer', 'kupons', 'atlaide', 'купон', 'скидка'];
    if (couponKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return 'coupons';
    }
    
    // Greeting keywords
    const greetingKeywords = ['hello', 'hi', 'hey', 'sveiki', 'labdien', 'привет', 'здравствуйте'];
    if (greetingKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return 'greeting';
    }
    
    return 'general';
  }

  generateBudgetAdvice(context: BudgetContext, language: string): string {
    const responses = this.responses[language as keyof typeof this.responses] || this.responses.en;
    const tips = this.budgetTips[language as keyof typeof this.budgetTips] || this.budgetTips.en;
    
    let advice = responses.budget[Math.floor(Math.random() * responses.budget.length)] + "\n\n";
    
    // Analyze spending
    const totalSpending = context.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const averageDaily = totalSpending / 30; // Approximate daily average
    
    if (context.balance < 50) {
      advice += language === 'lv' ? "Jūsu bilance ir zema! " : 
                language === 'ru' ? "Ваш баланс низкий! " : 
                "Your balance is low! ";
    }
    
    if (averageDaily > context.dailyBudget) {
      advice += language === 'lv' ? "Jūs tērējat vairāk nekā plānots. " : 
                language === 'ru' ? "Вы тратите больше запланированного. " : 
                "You're spending more than planned. ";
    }
    
    // Add a random tip
    advice += "\n\n💡 " + tips[Math.floor(Math.random() * tips.length)];
    
    return advice;
  }

  generateStoreAdvice(message: string, language: string): string {
    const lowerMessage = message.toLowerCase();
    const responses = this.responses[language as keyof typeof this.responses] || this.responses.en;
    const storeInfo = this.storeInfo[language as keyof typeof this.storeInfo] || this.storeInfo.en;
    
    let advice = responses.stores[Math.floor(Math.random() * responses.stores.length)] + "\n\n";
    
    // Check for specific store mentions
    if (lowerMessage.includes('maxima')) {
      advice += "🏪 " + storeInfo.maxima + "\n\n";
    }
    if (lowerMessage.includes('rimi')) {
      advice += "🛒 " + storeInfo.rimi + "\n\n";
    }
    if (lowerMessage.includes('barbora')) {
      advice += "🚚 " + storeInfo.barbora + "\n\n";
    }
    if (lowerMessage.includes('mego')) {
      advice += "⛽ " + storeInfo.mego + "\n\n";
    }
    if (lowerMessage.includes('apotheka')) {
      advice += "💊 " + storeInfo.apotheka + "\n\n";
    }
    
    // Add store locator suggestion
    advice += language === 'lv' ? "📍 Izmantojiet mūsu Veikalu meklētāju, lai atrastu tuvākos veikalus!" :
              language === 'ru' ? "📍 Используйте наш поиск магазинов, чтобы найти ближайшие магазины!" :
              "📍 Use our Store Locator to find the nearest stores!";
    
    return advice;
  }

  generateResponse(message: string, context?: BudgetContext): Promise<AIResponse> {
    return new Promise((resolve) => {
      // Simulate thinking time
      setTimeout(() => {
        const language = this.detectLanguage(message);
        const intent = this.analyzeIntent(message, language);
        const responses = this.responses[language as keyof typeof this.responses] || this.responses.en;
        
        let response = "";
        let suggestions: string[] = [];
        
        switch (intent) {
          case 'greeting':
            response = responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
            suggestions = language === 'lv' ? 
              ["Kāds ir mans budžets?", "Parādīt tuvākos veikalus", "Kur ir labākās atlaides?"] :
              language === 'ru' ?
              ["Какой мой бюджет?", "Показать ближайшие магазины", "Где лучшие скидки?"] :
              ["What's my budget?", "Show nearest stores", "Where are the best deals?"];
            break;
            
          case 'budget':
            response = context ? this.generateBudgetAdvice(context, language) : responses.budget[0];
            suggestions = language === 'lv' ?
              ["Kā taupīt naudu?", "Parādīt tēriņus", "Budžeta padomi"] :
              language === 'ru' ?
              ["Как сэкономить?", "Показать расходы", "Советы по бюджету"] :
              ["How to save money?", "Show my expenses", "Budget tips"];
            break;
            
          case 'stores':
            response = this.generateStoreAdvice(message, language);
            suggestions = language === 'lv' ?
              ["Tuvākie veikali", "Maxima vs Rimi", "Degvielas cenas"] :
              language === 'ru' ?
              ["Ближайшие магазины", "Maxima против Rimi", "Цены на топливо"] :
              ["Nearest stores", "Maxima vs Rimi", "Fuel prices"];
            break;
            
          case 'coupons':
            response = responses.coupons[Math.floor(Math.random() * responses.coupons.length)];
            suggestions = language === 'lv' ?
              ["Rādīt kuponus", "Labākās atlaides", "Kā izmantot kuponus"] :
              language === 'ru' ?
              ["Показать купоны", "Лучшие скидки", "Как использовать купоны"] :
              ["Show coupons", "Best deals", "How to use coupons"];
            break;
            
          default:
            response = responses.general[Math.floor(Math.random() * responses.general.length)];
            suggestions = language === 'lv' ?
              ["Palīdzība ar budžetu", "Atrast veikalus", "Aktīvie kuponi"] :
              language === 'ru' ?
              ["Помощь с бюджетом", "Найти магазины", "Активные купоны"] :
              ["Help with budget", "Find stores", "Active coupons"];
        }
        
        // Add conversation to history
        this.conversationHistory.push(message, response);
        
        // Keep only last 10 messages
        if (this.conversationHistory.length > 10) {
          this.conversationHistory = this.conversationHistory.slice(-10);
        }
        
        resolve({
          response,
          confidence: 0.85 + Math.random() * 0.15, // 85-100% confidence
          suggestions,
          language
        });
      }, 500 + Math.random() * 1000); // 0.5-1.5 second delay for realism
    });
  }

  resetConversation(): void {
    this.conversationHistory = [];
  }
}

const freeAiService = new FreeAIService();
export default freeAiService;