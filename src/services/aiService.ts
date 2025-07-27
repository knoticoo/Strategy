import axios from 'axios';

export interface AIResponse {
  text: string;
  confidence: number;
  suggestions?: string[];
  language: string;
}

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

class AIService {
  private readonly openAIKey = process.env.REACT_APP_OPENAI_API_KEY || '';
  private readonly openAIURL = 'https://api.openai.com/v1/chat/completions';
  
  // Free alternative - use OpenAI-compatible APIs
  private readonly freeAIEndpoints = [
    'https://api.groq.com/openai/v1/chat/completions', // Free Groq API
    'https://openrouter.ai/api/v1/chat/completions',    // OpenRouter free tier
  ];

  private conversationHistory: OpenAIMessage[] = [];

  async generateResponse(userMessage: string, context: any): Promise<AIResponse> {
    try {
      const detectedLanguage = this.detectLanguage(userMessage);
      
      // Build system prompt with context
      const systemPrompt = this.buildSystemPrompt(context, detectedLanguage);
      
      // Add system message if not exists
      if (this.conversationHistory.length === 0) {
        this.conversationHistory.push({
          role: 'system',
          content: systemPrompt
        });
      }

      // Add user message
      this.conversationHistory.push({
        role: 'user',
        content: userMessage
      });

      // Keep only last 10 messages to avoid token limits
      if (this.conversationHistory.length > 11) {
        this.conversationHistory = [
          this.conversationHistory[0], // Keep system prompt
          ...this.conversationHistory.slice(-10)
        ];
      }

      let aiResponse: string;
      
      // Try OpenAI first, fallback to free alternatives
      if (this.openAIKey) {
        aiResponse = await this.callOpenAI(this.conversationHistory);
      } else {
        aiResponse = await this.callFreeAI(this.conversationHistory);
      }

      // Add assistant response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: aiResponse
      });

      const suggestions = this.generateSuggestions(userMessage, detectedLanguage);

      return {
        text: aiResponse,
        confidence: 0.9,
        suggestions,
        language: detectedLanguage
      };

    } catch (error) {
      console.error('AI Service error:', error);
      return this.getFallbackResponse(userMessage, context);
    }
  }

  private async callOpenAI(messages: OpenAIMessage[]): Promise<string> {
    const response = await axios.post(
      this.openAIURL,
      {
        model: 'gpt-3.5-turbo',
        messages,
        max_tokens: 500,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${this.openAIKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content;
  }

  private async callFreeAI(messages: OpenAIMessage[]): Promise<string> {
    // Try Groq (free API with good performance)
    try {
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'mixtral-8x7b-32768',
          messages,
          max_tokens: 500,
          temperature: 0.7,
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_GROQ_API_KEY || ''}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Groq API error:', error);
      
      // Fallback to local intelligent responses
      return this.generateIntelligentFallback(messages);
    }
  }

  private detectLanguage(text: string): string {
    const latvianWords = ['es', 'jūs', 'var', 'tērēt', 'budžets', 'nauda', 'eiro', 'veikals', 'pārtika', 'atlaide'];
    const russianWords = ['я', 'вы', 'могу', 'тратить', 'бюджет', 'деньги', 'евро', 'магазин', 'еда', 'скидка'];
    
    const lowerText = text.toLowerCase();
    
    const latvianCount = latvianWords.filter(word => lowerText.includes(word)).length;
    const russianCount = russianWords.filter(word => lowerText.includes(word)).length;
    
    if (latvianCount > russianCount && latvianCount > 0) return 'lv';
    if (russianCount > 0) return 'ru';
    return 'en';
  }

  private buildSystemPrompt(context: any, language: string): string {
    const budget = context.budget || { daily: 20, weekly: 140, monthly: 600 };
    const expenses = context.expenses || [];
    
    const todaySpending = expenses
      .filter((exp: any) => new Date(exp.date).toDateString() === new Date().toDateString())
      .reduce((sum: number, exp: any) => sum + exp.amount, 0);

    const prompts = {
      en: `You are a smart budget assistant for Latvia. User's context:
- Daily budget: €${budget.daily} (spent today: €${todaySpending.toFixed(2)})
- Weekly budget: €${budget.weekly}
- Monthly budget: €${budget.monthly}
- Recent expenses: ${expenses.slice(0, 3).map((e: any) => `€${e.amount} on ${e.description}`).join(', ')}

You help with:
- Budget analysis and advice
- Meal suggestions with real prices from Maxima, Rimi, Barbora
- Finding deals and discount codes
- Smart money-saving tips for Latvia

Be conversational, helpful, and use specific Latvian store data when relevant.`,

      lv: `Tu esi viedais budžeta asistents Latvijai. Lietotāja konteksts:
- Dienas budžets: €${budget.daily} (šodien iztērēts: €${todaySpending.toFixed(2)})
- Nedēļas budžets: €${budget.weekly}
- Mēneša budžets: €${budget.monthly}
- Pēdējie izdevumi: ${expenses.slice(0, 3).map((e: any) => `€${e.amount} par ${e.description}`).join(', ')}

Tu palīdzi ar:
- Budžeta analīzi un padomiem
- Ēdienu ieteikumiem ar reālām cenām no Maxima, Rimi, Barbora
- Piedāvājumu un atlaižu kodu meklēšanu
- Viediem naudas taupīšanas padomiem Latvijai

Esi sarunvalodīgs, palīdzīgs un izmanto specifiskus Latvijas veikalu datus.`,

      ru: `Ты умный помощник по бюджету для Латвии. Контекст пользователя:
- Дневной бюджет: €${budget.daily} (потрачено сегодня: €${todaySpending.toFixed(2)})
- Недельный бюджет: €${budget.weekly}
- Месячный бюджет: €${budget.monthly}
- Последние расходы: ${expenses.slice(0, 3).map((e: any) => `€${e.amount} на ${e.description}`).join(', ')}

Ты помогаешь с:
- Анализом бюджета и советами
- Предложениями еды с реальными ценами из Maxima, Rimi, Barbora
- Поиском скидок и промокодов
- Умными советами по экономии денег в Латвии

Будь разговорчивым, полезным и используй конкретные данные латвийских магазинов.`
    };

    return prompts[language as keyof typeof prompts] || prompts.en;
  }

  private generateIntelligentFallback(messages: OpenAIMessage[]): string {
    const userMessage = messages[messages.length - 1].content.toLowerCase();
    const language = this.detectLanguage(userMessage);

    // Budget queries
    if (userMessage.includes('budget') || userMessage.includes('budžet') || userMessage.includes('бюджет') ||
        userMessage.includes('spend') || userMessage.includes('tērēt') || userMessage.includes('потратить')) {
      
      if (language === 'lv') {
        return 'Pamatojoties uz jūsu budžetu, šodien jums ir atlikuši aptuveni €15. Vai vēlaties, lai es ieteiktu, kā labāk izmantot šo naudu, vai arī meklējam labākos piedāvājumus veikalos?';
      } else if (language === 'ru') {
        return 'Исходя из вашего бюджета, у вас осталось примерно €15 на сегодня. Хотите, чтобы я порекомендовал, как лучше потратить эти деньги, или поищем лучшие предложения в магазинах?';
      }
      return 'Based on your budget, you have about €15 left for today. Would you like me to suggest how to best use this money, or shall we look for the best deals in stores?';
    }

    // Meal queries
    if (userMessage.includes('meal') || userMessage.includes('food') || userMessage.includes('ēdien') || 
        userMessage.includes('еда') || userMessage.includes('€') || userMessage.includes('euro')) {
      
      const priceMatch = userMessage.match(/(\d+)/);
      const budget = priceMatch ? parseInt(priceMatch[1]) : 5;
      
      if (language === 'lv') {
        return `Par €${budget} jūs varat iegādāties:\n• Pasta ar tomātu mērci (€${Math.min(budget, 4.50)}) - Maxima\n• Sviestmaizes ar sieru (€${Math.min(budget, 3.20)}) - Rimi\n• Banāns + jogurts (€${Math.min(budget, 2.80)}) - Barbora\n\nVai meklējam konkrētas akcijas šodien?`;
      } else if (language === 'ru') {
        return `За €${budget} вы можете купить:\n• Паста с томатным соусом (€${Math.min(budget, 4.50)}) - Maxima\n• Бутерброды с сыром (€${Math.min(budget, 3.20)}) - Rimi\n• Банан + йогурт (€${Math.min(budget, 2.80)}) - Barbora\n\nИщем конкретные акции на сегодня?`;
      }
      return `For €${budget} you can get:\n• Pasta with tomato sauce (€${Math.min(budget, 4.50)}) - Maxima\n• Cheese sandwiches (€${Math.min(budget, 3.20)}) - Rimi\n• Banana + yogurt (€${Math.min(budget, 2.80)}) - Barbora\n\nShall we look for specific deals today?`;
    }

    // Default responses
    const defaults = {
      lv: 'Es saprotu jūsu jautājumu. Kā es varu palīdzēt ar budžeta plānošanu, ēdienu meklēšanu vai atlaižu atrašanu? Jautājiet man konkrēti!',
      ru: 'Я понимаю ваш вопрос. Как я могу помочь с планированием бюджета, поиском еды или поиском скидок? Спрашивайте конкретно!',
      en: 'I understand your question. How can I help with budget planning, finding food, or discovering deals? Ask me specifically!'
    };

    return defaults[language as keyof typeof defaults] || defaults.en;
  }

  private generateSuggestions(userMessage: string, language: string): string[] {
    const suggestions = {
      lv: [
        'Cik man šodien atlikts tērēšanai?',
        'Atrodi man ēdienu par 7€',
        'Kādas ir labākās akcijas Maximā?',
        'Vai ir atlaižu kodi Barbora?'
      ],
      ru: [
        'Сколько я могу потратить сегодня?',
        'Найди еду на 7€',
        'Какие лучшие акции в Maxima?',
        'Есть промокоды для Barbora?'
      ],
      en: [
        'How much can I spend today?',
        'Find me food for €7',
        'What are the best deals at Maxima?',
        'Any discount codes for Barbora?'
      ]
    };

    return suggestions[language as keyof typeof suggestions] || suggestions.en;
  }

  private getFallbackResponse(message: string, context: any): AIResponse {
    const language = this.detectLanguage(message);
    
    const responses = {
      lv: 'Atvainojiet, es pagaidām nevarēju saņemt atbildi no sava viedā smadzeņu centra. Bet es joprojām varu palīdzēt ar budžeta jautājumiem un veikalu piedāvājumiem!',
      ru: 'Извините, я не смог получить ответ от своего умного мозгового центра. Но я все еще могу помочь с вопросами бюджета и предложениями магазинов!',
      en: 'Sorry, I couldn\'t get a response from my smart brain center right now. But I can still help with budget questions and store deals!'
    };

    return {
      text: responses[language as keyof typeof responses] || responses.en,
      confidence: 0.3,
      suggestions: this.generateSuggestions(message, language),
      language
    };
  }

  // Method to reset conversation
  public resetConversation(): void {
    this.conversationHistory = [];
  }
}

const aiService = new AIService();
export default aiService;