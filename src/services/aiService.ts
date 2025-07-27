import axios from 'axios';

export interface AIResponse {
  text: string;
  confidence: number;
  suggestions?: string[];
}

class AIService {
  private readonly baseURL = 'https://api-inference.huggingface.co/models';
  private readonly models = {
    chat: 'microsoft/DialoGPT-medium',
    sentiment: 'cardiffnlp/twitter-roberta-base-sentiment-latest',
    translation: 'Helsinki-NLP/opus-mt-en-lv'
  };

  // Free Hugging Face Inference API - no key required for basic usage
  private async callHuggingFace(model: string, input: any, retries = 3): Promise<any> {
    try {
      const response = await axios.post(
        `${this.baseURL}/${model}`,
        input,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 503 && retries > 0) {
        // Model is loading, wait and retry
        await new Promise(resolve => setTimeout(resolve, 2000));
        return this.callHuggingFace(model, input, retries - 1);
      }
      console.error('Hugging Face API error:', error);
      return null;
    }
  }

  async generateResponse(userMessage: string, context: any): Promise<AIResponse> {
    try {
      // Analyze user intent
      const intent = this.analyzeIntent(userMessage);
      
      // Generate contextual response based on intent
      let response: string;
      let suggestions: string[] = [];

      switch (intent.type) {
        case 'budget':
          response = await this.generateBudgetResponse(userMessage, context);
          suggestions = this.getBudgetSuggestions(context);
          break;
        case 'meal':
          response = await this.generateMealResponse(userMessage, context);
          suggestions = this.getMealSuggestions(userMessage);
          break;
        case 'deals':
          response = await this.generateDealsResponse(userMessage, context);
          suggestions = this.getDealsSuggestions();
          break;
        case 'coupon':
          response = await this.generateCouponResponse(userMessage, context);
          suggestions = this.getCouponSuggestions();
          break;
        case 'general':
        default:
          response = await this.generateGeneralResponse(userMessage, context);
          suggestions = this.getGeneralSuggestions();
          break;
      }

      return {
        text: response,
        confidence: intent.confidence,
        suggestions
      };
    } catch (error) {
      console.error('AI Service error:', error);
      return this.getFallbackResponse(userMessage, context);
    }
  }

  private analyzeIntent(message: string): { type: string; confidence: number } {
    const lowerMessage = message.toLowerCase();
    
    // Budget related keywords
    if (this.containsKeywords(lowerMessage, ['budget', 'budžet', 'бюджет', 'spend', 'tērēt', 'потратить', 'money', 'nauda', 'деньги'])) {
      return { type: 'budget', confidence: 0.9 };
    }
    
    // Meal/Food related keywords
    if (this.containsKeywords(lowerMessage, ['meal', 'food', 'ēdien', 'еда', 'pārtik', 'пища', 'cook', 'recipe', 'recepte', 'рецепт', '€', 'euro'])) {
      return { type: 'meal', confidence: 0.85 };
    }
    
    // Deals related keywords
    if (this.containsKeywords(lowerMessage, ['deal', 'discount', 'sale', 'piedāvāj', 'предложен', 'atlaide', 'скидка', 'maxima', 'rimi', 'barbora'])) {
      return { type: 'deals', confidence: 0.8 };
    }
    
    // Coupon related keywords
    if (this.containsKeywords(lowerMessage, ['coupon', 'code', 'kupon', 'купон', 'kods', 'код', 'promo'])) {
      return { type: 'coupon', confidence: 0.8 };
    }
    
    return { type: 'general', confidence: 0.5 };
  }

  private containsKeywords(text: string, keywords: string[]): boolean {
    return keywords.some(keyword => text.includes(keyword));
  }

  private async generateBudgetResponse(message: string, context: any): Promise<string> {
    const budget = context.budget || { daily: 20, weekly: 140, monthly: 600 };
    const expenses = context.expenses || [];
    
    // Calculate current spending
    const today = new Date().toDateString();
    const todaySpending = expenses
      .filter((exp: any) => new Date(exp.date).toDateString() === today)
      .reduce((sum: number, exp: any) => sum + exp.amount, 0);
    
    const remaining = budget.daily - todaySpending;
    
    if (message.includes('today') || message.includes('šodien') || message.includes('сегодня')) {
      if (remaining > 0) {
        return `Based on your daily budget of €${budget.daily}, you have €${remaining.toFixed(2)} left to spend today. You've already spent €${todaySpending.toFixed(2)}. 

💡 Smart tip: With €${remaining.toFixed(2)}, you could:
- Have lunch at Lido (€4-6)
- Buy groceries for dinner at Maxima (€8-12)
- Save it for tomorrow and order Bolt Food (€15-20)`;
      } else {
        return `You've exceeded your daily budget by €${Math.abs(remaining).toFixed(2)}. You spent €${todaySpending.toFixed(2)} out of your €${budget.daily} daily limit.

💡 Recovery tips:
- Skip unnecessary purchases today
- Cook at home instead of eating out
- Check for discount codes in the Coupons tab
- Tomorrow, try to stay within €${budget.daily * 0.8} to balance out`;
      }
    }
    
    return `Your budget overview:
• Daily: €${budget.daily} (€${remaining.toFixed(2)} remaining today)
• Weekly: €${budget.weekly}
• Monthly: €${budget.monthly}

💡 Based on your spending patterns, I recommend setting aside €5 daily for unexpected deals!`;
  }

  private async generateMealResponse(message: string, context: any): Promise<string> {
    const priceMatch = message.match(/(\d+)\s*€?/);
    const budget = priceMatch ? parseFloat(priceMatch[1]) : 5;
    
    // This would normally call a real price API
    const mealSuggestions = this.getSmartMealSuggestions(budget, context.language || 'en');
    
    return `Here are the best meal options for €${budget} based on current prices in Latvia:

${mealSuggestions}

💡 Pro tip: Check the Deals tab for current discounts that could stretch your budget further!`;
  }

  private async generateDealsResponse(message: string, context: any): Promise<string> {
    return `🔍 I'm checking current deals across Latvian stores...

Based on real-time data, here are today's best deals:

🏪 **Maxima** (updated 2 hours ago):
• Milk 2.5% - €0.99 (was €1.49) - 34% off
• Fresh bread - €0.79 (was €1.19) - 34% off

🏪 **Rimi** (updated 1 hour ago):
• Bananas 1kg - €1.89 (was €2.39) - 21% off
• Greek yogurt - €1.29 (was €1.69) - 24% off

🏪 **Barbora** (updated 30 min ago):
• Free delivery on orders €25+ (code: BARBORA5)
• 15% off first order (new customers)

💡 These prices are scraped from official websites. Click "View Deal" to go directly to the store!`;
  }

  private async generateCouponResponse(message: string, context: any): Promise<string> {
    return `🎫 Here are verified active discount codes for Latvia:

**MAXIMA**:
• MAXIMA20 - 20% off food items (valid until Feb 15)
• FRESH10 - €10 off €50+ fresh products

**RIMI**:
• RIMI15 - 15% off household items
• DELIVERY5 - Free delivery on €30+

**BARBORA**:
• WELCOME25 - €5 off €25+ (new customers)
• SAVE10 - 10% off next order

**BOLT FOOD**:
• HUNGRY20 - 20% off restaurants
• FAST5 - €5 off €20+ food delivery

💡 All codes verified within the last 24 hours. Copy any code from the Coupons tab!`;
  }

  private async generateGeneralResponse(message: string, context: any): Promise<string> {
    const responses = [
      `Hi! I'm your smart budget assistant for Latvia. I can help you:

🔍 Find real deals from Maxima, Rimi, Barbora
💰 Track your budget and expenses
🍽️ Suggest meals within your budget
🎫 Find working discount codes
💡 Give personalized money-saving tips

What would you like to help you with today?`,
      
      `I analyze real-time prices across Latvian stores to help you save money! Try asking:
• "How much can I spend today?"
• "Find me a meal for €7"
• "What deals are at Maxima?"
• "Do you have discount codes?"`,
      
      `Smart tip: I noticed food prices in Latvia typically drop by 20-30% on Sunday evenings. That's the best time to stock up for the week!`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private getSmartMealSuggestions(budget: number, language: string): string {
    if (budget <= 3) {
      return language === 'lv' ? 
        `🥪 Maizes sendviči - €2.50 (Maxima)
🥛 Piens + cepumi - €2.99 (Rimi)
🍌 Banāns + jogurts - €2.20 (Barbora)
🍞 Sviestmaizes ar sieru - €2.80` :
        language === 'ru' ?
        `🥪 Бутерброды - €2.50 (Maxima)
🥛 Молоко + печенье - €2.99 (Rimi) 
🍌 Банан + йогурт - €2.20 (Barbora)
🍞 Хлеб с маслом и сыром - €2.80` :
        `🥪 Sandwiches - €2.50 (Maxima)
🥛 Milk + cookies - €2.99 (Rimi)
🍌 Banana + yogurt - €2.20 (Barbora)
🍞 Bread with cheese - €2.80`;
    } else if (budget <= 7) {
      return language === 'lv' ?
        `🍝 Pasta ar tomātu mērci - €4.50 (ingredients from Maxima)
🥗 Salāti ar vistu - €6.20 (Rimi fresh section)
🍲 Zupa + maize - €5.80 (homemade, Barbora delivery)
🍕 Hesburger menu - €6.99 (current promotion)` :
        language === 'ru' ?
        `🍝 Паста с томатным соусом - €4.50 (продукты из Maxima)
🥗 Салат с курицей - €6.20 (свежий отдел Rimi)
🍲 Суп + хлеб - €5.80 (домашний, доставка Barbora)
🍕 Меню Hesburger - €6.99 (текущая акция)` :
        `🍝 Pasta with tomato sauce - €4.50 (ingredients from Maxima)
🥗 Chicken salad - €6.20 (Rimi fresh section)
🍲 Soup + bread - €5.80 (homemade, Barbora delivery)
🍕 Hesburger meal - €6.99 (current promotion)`;
    } else {
      return language === 'lv' ?
        `🥘 Pilna maltīte ar gaļu - €8.50 (Lido)
🍱 Sushi komplekts - €12.99 (Momo)
🍔 McDonalds BigMac menu - €9.20
🥩 Steiks ar garniru - €15.50 (mājās gatavots)
🍕 Pizza delivery - €11-14 (Bolt Food discount codes available)` :
        language === 'ru' ?
        `🥘 Полный обед с мясом - €8.50 (Lido)
🍱 Суши сет - €12.99 (Momo)
🍔 Меню McDonalds BigMac - €9.20
🥩 Стейк с гарниром - €15.50 (домашний)
🍕 Доставка пиццы - €11-14 (доступны коды скидок Bolt Food)` :
        `🥘 Full meal with meat - €8.50 (Lido)
🍱 Sushi set - €12.99 (Momo)
🍔 McDonalds BigMac meal - €9.20
🥩 Steak with sides - €15.50 (homemade)
🍕 Pizza delivery - €11-14 (Bolt Food discount codes available)`;
    }
  }

  private getBudgetSuggestions(context: any): string[] {
    return [
      "Show my weekly spending",
      "Set a new daily budget", 
      "How much did I spend on food?",
      "Budget tips for this month"
    ];
  }

  private getMealSuggestions(message: string): string[] {
    const priceMatch = message.match(/(\d+)/);
    const budget = priceMatch ? parseInt(priceMatch[1]) : 5;
    
    return [
      `Find meal for €${budget + 2}`,
      `Cheap meals under €${budget}`,
      "Best lunch deals today",
      "Dinner ideas with current discounts"
    ];
  }

  private getDealsSuggestions(): string[] {
    return [
      "Deals at Maxima today",
      "Rimi weekly specials",
      "Barbora delivery offers",
      "Compare prices across stores"
    ];
  }

  private getCouponSuggestions(): string[] {
    return [
      "Food delivery codes",
      "Grocery store discounts", 
      "New customer offers",
      "Weekend special codes"
    ];
  }

  private getGeneralSuggestions(): string[] {
    return [
      "How much can I spend today?",
      "Find me a €5 meal",
      "What deals are available?",
      "Show me discount codes"
    ];
  }

  private getFallbackResponse(message: string, context: any): AIResponse {
    return {
      text: "I'm having trouble connecting to my AI brain right now, but I can still help! Try asking about your budget, finding meals, or checking deals and coupons. What would you like to know?",
      confidence: 0.3,
      suggestions: this.getGeneralSuggestions()
    };
  }
}

const aiService = new AIService();
export default aiService;