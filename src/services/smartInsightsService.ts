// Smart Insights Service - AI-Powered Financial & Property Recommendations
import axios from 'axios';
import { Transaction } from '../components/BudgetApp';
import { SSProperty } from './ssLvScrapingService';
import latvianBankService, { MortgageCalculation } from './latvianBankService';

export interface SmartInsight {
  id: string;
  type: 'spending' | 'saving' | 'investment' | 'property' | 'mortgage' | 'warning';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: string;
  recommendation: string;
  potentialSaving?: number;
  confidence: number;
  actionable: boolean;
  deadline?: string;
  relatedData?: any;
}

export interface SpendingPattern {
  category: string;
  averageMonthly: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  seasonality: boolean;
  anomalies: Array<{
    date: string;
    amount: number;
    reason: string;
  }>;
}

export interface PropertyRecommendation {
  property: SSProperty;
  score: number;
  reasons: string[];
  mortgageOptions: MortgageCalculation[];
  affordabilityRatio: number;
  investmentPotential: number;
}

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  monthlyContribution: number;
  priority: 'high' | 'medium' | 'low';
  category: 'house' | 'emergency' | 'vacation' | 'education' | 'retirement';
}

export interface MarketForecast {
  region: string;
  currentAvgPrice: number;
  predictedPriceIn6Months: number;
  predictedPriceIn1Year: number;
  confidence: number;
  factors: string[];
  recommendation: 'buy_now' | 'wait' | 'consider';
}

class SmartInsightsService {
  /**
   * Analyze spending patterns and generate AI insights
   */
  async analyzeSpendingPatterns(transactions: Transaction[]): Promise<SmartInsight[]> {
    const insights: SmartInsight[] = [];
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const last3Months = new Date(now.getFullYear(), now.getMonth() - 3, 1);

    // Group transactions by category
    const categorySpending = this.groupTransactionsByCategory(transactions);
    const monthlySpending = this.calculateMonthlySpending(transactions);

    // Analyze each category for patterns
    for (const [category, amount] of Object.entries(categorySpending)) {
      const categoryTransactions = transactions.filter(t => 
        t.category === category && t.type === 'expense'
      );

      // High spending category insight
      if (amount > monthlySpending * 0.3) {
        insights.push({
          id: `high-spend-${category}`,
          type: 'spending',
          title: `Augsti tēriņi kategorijā "${category}"`,
          description: `Jūs tērējat €${amount.toFixed(2)} mēnesī kategorijā "${category}", kas veido ${((amount/monthlySpending)*100).toFixed(1)}% no kopējiem tēriņiem.`,
          impact: 'high',
          category: category,
          recommendation: `Izskatiet ${category} tēriņus detalizēti. Mēģiniet samazināt par 15-20%, lai ietaupītu €${(amount * 0.175).toFixed(2)} mēnesī.`,
          potentialSaving: amount * 0.175,
          confidence: 85,
          actionable: true,
          relatedData: { category, amount, percentage: (amount/monthlySpending)*100 }
        });
      }

      // Unusual spending spike
      const avgSpending = categoryTransactions.reduce((sum, t) => sum + t.amount, 0) / categoryTransactions.length;
      const recentSpike = categoryTransactions
        .filter(t => new Date(t.date) > lastMonth)
        .find(t => t.amount > avgSpending * 2);

      if (recentSpike) {
        insights.push({
          id: `spike-${category}`,
          type: 'warning',
          title: `Neparasti augsti tēriņi: ${category}`,
          description: `Aizvadītajā mēnesī kategorijā "${category}" bija €${recentSpike.amount} tēriņi, kas ir ievērojami virs vidējā.`,
          impact: 'medium',
          category: category,
          recommendation: `Pārbaudiet šos tēriņus un izvērtējiet, vai tie bija nepieciešami vai atkārtojas.`,
          confidence: 75,
          actionable: true,
          relatedData: { transaction: recentSpike, avgSpending }
        });
      }
    }

    // Savings opportunities
    const totalIncome = this.calculateTotalIncome(transactions);
    const savingsRate = ((totalIncome - monthlySpending) / totalIncome) * 100;

    if (savingsRate < 20) {
      insights.push({
        id: 'low-savings',
        type: 'saving',
        title: 'Zema uzkrājumu likme',
        description: `Jūsu uzkrājumu likme ir ${savingsRate.toFixed(1)}%. Eksperte iesaka vismaz 20% no ienākumiem.`,
        impact: 'high',
        category: 'Uzkrājumi',
        recommendation: `Mēģiniet samazināt tēriņus par €${((totalIncome * 0.2 - (totalIncome - monthlySpending))).toFixed(2)} mēnesī, lai sasniegtu 20% uzkrājumu likmi.`,
        confidence: 90,
        actionable: true,
        relatedData: { currentRate: savingsRate, targetRate: 20 }
      });
    }

    // Property affordability insight
    const propertyAffordability = latvianBankService.calculateAffordability(totalIncome);
    insights.push({
      id: 'property-affordability',
      type: 'property',
      title: 'Jūsu mājas iegādes iespējas',
      description: `Ar jūsu ienākumiem (€${totalIncome.toFixed(2)}) varat atļauties īpašumu līdz €${propertyAffordability.recommendedPrice.toFixed(0)}.`,
      impact: 'medium',
      category: 'Nekustamais īpašums',
      recommendation: `Maksimālā mēneša maksājuma summa: €${propertyAffordability.maxMonthlyPayment.toFixed(2)}. Sāciet krāt pirmsmaksu!`,
      confidence: 80,
      actionable: true,
      relatedData: propertyAffordability
    });

    return insights.slice(0, 8); // Return top 8 insights
  }

  /**
   * Generate personalized property recommendations
   */
  async generatePropertyRecommendations(
    budget: number,
    monthlyIncome: number,
    preferences: {
      location?: string;
      rooms?: number;
      type?: 'apartment' | 'house';
      maxCommute?: number;
    }
  ): Promise<PropertyRecommendation[]> {
    // Import the scraping service
    const ssLvService = (await import('./ssLvScrapingService')).default;
    
    // Search for properties within budget
    const properties = await ssLvService.searchProperties({
      maxPrice: budget,
      location: preferences.location,
      rooms: preferences.rooms ? [preferences.rooms] : undefined,
      type: preferences.type,
      sortBy: 'price_asc'
    });

    const recommendations: PropertyRecommendation[] = [];

    for (const property of properties.slice(0, 10)) {
      const score = this.calculatePropertyScore(property, preferences, monthlyIncome);
      const mortgageOptions = latvianBankService.compareAllBanks(
        property.price,
        20, // 20% down payment
        25  // 25 years
      );

      const bestMortgage = mortgageOptions[0];
      const affordabilityRatio = bestMortgage ? 
        (bestMortgage.monthlyPayment / monthlyIncome) * 100 : 100;

      recommendations.push({
        property,
        score,
        reasons: this.generateRecommendationReasons(property, preferences, affordabilityRatio),
        mortgageOptions: mortgageOptions.slice(0, 3),
        affordabilityRatio,
        investmentPotential: this.calculateInvestmentPotential(property)
      });
    }

    return recommendations
      .filter(r => r.affordabilityRatio <= 40) // Only affordable properties
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }

  /**
   * Generate market forecasts for different regions
   */
  async generateMarketForecasts(regions: string[]): Promise<MarketForecast[]> {
    const forecasts: MarketForecast[] = [];

    for (const region of regions) {
      // Simulate AI-powered market analysis
      const currentPrice = this.getRegionAveragePrice(region);
      const growthRate = this.predictGrowthRate(region);
      
      const forecast: MarketForecast = {
        region,
        currentAvgPrice: currentPrice,
        predictedPriceIn6Months: currentPrice * (1 + growthRate * 0.5),
        predictedPriceIn1Year: currentPrice * (1 + growthRate),
        confidence: this.calculateForecastConfidence(region),
        factors: this.getMarketFactors(region),
        recommendation: this.getMarketRecommendation(region, growthRate)
      };

      forecasts.push(forecast);
    }

    return forecasts;
  }

  /**
   * Create personalized savings goals
   */
  generateSavingsGoals(
    monthlyIncome: number,
    currentSavings: number,
    targetHousePrice?: number
  ): FinancialGoal[] {
    const goals: FinancialGoal[] = [];

    // Emergency fund
    const emergencyTarget = monthlyIncome * 6;
    goals.push({
      id: 'emergency-fund',
      name: 'Ārkārtas situāciju fonds',
      targetAmount: emergencyTarget,
      currentAmount: Math.min(currentSavings * 0.3, emergencyTarget),
      deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      monthlyContribution: Math.max(100, monthlyIncome * 0.1),
      priority: 'high',
      category: 'emergency'
    });

    // House down payment
    if (targetHousePrice) {
      const downPayment = targetHousePrice * 0.2;
      const timeToSave = Math.max(12, downPayment / (monthlyIncome * 0.15)); // months
      
      goals.push({
        id: 'house-down-payment',
        name: 'Pirmsmaksa mājai',
        targetAmount: downPayment,
        currentAmount: currentSavings * 0.7,
        deadline: new Date(Date.now() + timeToSave * 30 * 24 * 60 * 60 * 1000).toISOString(),
        monthlyContribution: downPayment / timeToSave,
        priority: 'high',
        category: 'house'
      });
    }

    return goals;
  }

  /**
   * Detect spending anomalies using simple ML-like patterns
   */
  detectSpendingAnomalies(transactions: Transaction[]): SmartInsight[] {
    const insights: SmartInsight[] = [];
    const now = new Date();
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Group by day of week to find patterns
    const dayOfWeekSpending = new Array(7).fill(0);
    const dayOfWeekCounts = new Array(7).fill(0);

    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const date = new Date(t.date);
        const dayOfWeek = date.getDay();
        dayOfWeekSpending[dayOfWeek] += t.amount;
        dayOfWeekCounts[dayOfWeek]++;
      });

    // Calculate averages
    const avgSpendingByDay = dayOfWeekSpending.map((total, i) => 
      dayOfWeekCounts[i] > 0 ? total / dayOfWeekCounts[i] : 0
    );

    // Find unusual weekend spending
    const weekendAvg = (avgSpendingByDay[0] + avgSpendingByDay[6]) / 2;
    const weekdayAvg = avgSpendingByDay.slice(1, 6).reduce((sum, val) => sum + val, 0) / 5;

    if (weekendAvg > weekdayAvg * 1.5) {
      insights.push({
        id: 'weekend-spending',
        type: 'spending',
        title: 'Augsti tēriņi nedēļas nogalēs',
        description: `Nedēļas nogalēs jūs tērējat vidēji €${weekendAvg.toFixed(2)}, kas ir ${((weekendAvg/weekdayAvg - 1) * 100).toFixed(1)}% vairāk nekā darba dienās.`,
        impact: 'medium',
        category: 'Izklaide',
        recommendation: 'Plānojiet nedēļas nogales budžetu un meklējiet lētākas izklaides iespējas.',
        potentialSaving: (weekendAvg - weekdayAvg) * 8, // 8 weekends per month
        confidence: 70,
        actionable: true
      });
    }

    return insights;
  }

  /**
   * Private helper methods
   */
  private groupTransactionsByCategory(transactions: Transaction[]): Record<string, number> {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);
  }

  private calculateMonthlySpending(transactions: Transaction[]): number {
    const expenses = transactions.filter(t => t.type === 'expense');
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
    
    // Get unique months
    const months = new Set(expenses.map(t => t.date.substring(0, 7)));
    return totalExpenses / Math.max(months.size, 1);
  }

  private calculateTotalIncome(transactions: Transaction[]): number {
    const income = transactions.filter(t => t.type === 'income');
    const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
    
    // Get unique months
    const months = new Set(income.map(t => t.date.substring(0, 7)));
    return totalIncome / Math.max(months.size, 1);
  }

  private calculatePropertyScore(
    property: SSProperty, 
    preferences: any, 
    monthlyIncome: number
  ): number {
    let score = 50; // Base score

    // Location match
    if (preferences.location && property.location.toLowerCase().includes(preferences.location.toLowerCase())) {
      score += 20;
    }

    // Price affordability (30% of income rule)
    const mortgagePayment = property.price * 0.8 * 0.004; // Rough monthly payment estimate
    const affordabilityRatio = (mortgagePayment / monthlyIncome) * 100;
    
    if (affordabilityRatio <= 25) score += 15;
    else if (affordabilityRatio <= 35) score += 10;
    else if (affordabilityRatio <= 40) score += 5;

    // Property condition
    if (property.condition === 'new') score += 10;
    else if (property.condition === 'renovated') score += 8;
    else if (property.condition === 'good') score += 5;

    // Features
    if (property.balcony) score += 3;
    if (property.cellar) score += 2;
    if (property.parkingSpaces && property.parkingSpaces > 0) score += 5;

    // Price per sqm value
    const avgPricePerSqm = property.district === 'Centrs' ? 1650 : 1200;
    if (property.pricePerSqm && property.pricePerSqm < avgPricePerSqm * 0.9) {
      score += 10; // Good value
    }

    return Math.min(100, Math.max(0, score));
  }

  private generateRecommendationReasons(
    property: SSProperty, 
    preferences: any, 
    affordabilityRatio: number
  ): string[] {
    const reasons: string[] = [];

    if (affordabilityRatio <= 30) {
      reasons.push('Labi pieejams jūsu budžetam');
    }

    if (property.condition === 'renovated' || property.condition === 'new') {
      reasons.push('Laba tehniskā stāvokļa');
    }

    if (property.pricePerSqm && property.pricePerSqm < 1400) {
      reasons.push('Izdevīga cena par kvadrātmetru');
    }

    if (property.features.length > 3) {
      reasons.push('Daudz papildu ērtību');
    }

    if (property.coordinates) {
      reasons.push('Laba atrašanās vieta');
    }

    return reasons.slice(0, 4);
  }

  private calculateInvestmentPotential(property: SSProperty): number {
    let potential = 50; // Base

    // Location factor
    if (property.district === 'Centrs') potential += 20;
    else if (property.district === 'Jugla') potential += 15;
    else if (property.district === 'Jūrmala') potential += 10;

    // Property type
    if (property.type === 'apartment') potential += 10;

    // Age factor
    if (property.yearBuilt && property.yearBuilt > 2000) potential += 15;
    else if (property.yearBuilt && property.yearBuilt > 1980) potential += 5;

    return Math.min(100, potential);
  }

  private getRegionAveragePrice(region: string): number {
    const priceMap: Record<string, number> = {
      'Rīga - Centrs': 85000,
      'Rīga - Jugla': 68000,
      'Jūrmala': 75000,
      'Liepāja': 45000,
      'Daugavpils': 35000
    };
    return priceMap[region] || 60000;
  }

  private predictGrowthRate(region: string): number {
    // Simulated growth rates based on market factors
    const growthMap: Record<string, number> = {
      'Rīga - Centrs': 0.058,
      'Rīga - Jugla': 0.062,
      'Jūrmala': 0.039,
      'Liepāja': 0.021,
      'Daugavpils': 0.018
    };
    return growthMap[region] || 0.035;
  }

  private calculateForecastConfidence(region: string): number {
    // Higher confidence for more active markets
    const confidenceMap: Record<string, number> = {
      'Rīga - Centrs': 85,
      'Rīga - Jugla': 80,
      'Jūrmala': 75,
      'Liepāja': 70,
      'Daugavpils': 65
    };
    return confidenceMap[region] || 70;
  }

  private getMarketFactors(region: string): string[] {
    const factorsMap: Record<string, string[]> = {
      'Rīga - Centrs': ['Augsta pieprasījuma', 'Ierobežota zemesgabala pieejamība', 'Biznesa centrs'],
      'Rīga - Jugla': ['Jauni projekti', 'Laba transporta pieejamība', 'Ģimeņu rajons'],
      'Jūrmala': ['Tūrisma attīstība', 'Unikāla atrašanās vieta', 'Sezonāla pieprasījuma'],
      'Liepāja': ['Ostas attīstība', 'Ekonomiskā izaugsme', 'Mājokļu reformas'],
      'Daugavpils': ['Stabilas cenas', 'Pieejami mājokļi', 'Industriālā attīstība']
    };
    return factorsMap[region] || ['Vispārējie tirgus apstākļi'];
  }

  private getMarketRecommendation(region: string, growthRate: number): 'buy_now' | 'wait' | 'consider' {
    if (growthRate > 0.05) return 'buy_now';
    if (growthRate < 0.02) return 'wait';
    return 'consider';
  }
}

export default new SmartInsightsService();