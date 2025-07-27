import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Plus, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  PieChart, 
  BarChart3, 
  CheckCircle, 
  Trash2,
  CreditCard,
  Link,
  RefreshCw,
  Zap
} from 'lucide-react';
import revolutService, { RevolutAccount } from '../services/revolutService';

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  source?: 'manual' | 'revolut';
}

interface Budget {
  daily: number;
  weekly: number;
  monthly: number;
}

const BudgetTab: React.FC = () => {
  const { t } = useTranslation();
  const [budget, setBudget] = useState<Budget>({ daily: 20, weekly: 140, monthly: 600 });
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [newExpense, setNewExpense] = useState({ description: '', amount: '', category: 'food' });
  
  // Revolut integration states
  const [revolutAccounts, setRevolutAccounts] = useState<RevolutAccount[]>([]);
  const [isRevolutConnected, setIsRevolutConnected] = useState(false);
  const [isRevolutLoading, setIsRevolutLoading] = useState(false);
  const [lastRevolutSync, setLastRevolutSync] = useState<Date | null>(null);

  // Auto-sync Revolut data if connected
  const syncRevolutData = useCallback(async () => {
    if (!revolutService.isAuthenticated()) return;
    
    setIsRevolutLoading(true);
    try {
      // Fetch accounts
      const accounts = await revolutService.getAccounts();
      setRevolutAccounts(accounts);
      
      // Fetch recent transactions and convert to expenses
      const transactions = await revolutService.getTransactionsByDateRange(
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        new Date()
      );
      
      const revolutExpenses: Expense[] = transactions
        .filter(tx => tx.type === 'CARD_PAYMENT' && tx.state === 'COMPLETED')
        .map(tx => ({
          id: `revolut_${tx.id}`,
          description: tx.legs[0]?.description || 'Revolut Payment',
          amount: Math.abs(tx.legs[0]?.amount || 0),
          category: categorizeRevolutTransaction(tx.legs[0]?.description || ''),
          date: tx.completedAt || tx.createdAt,
          source: 'revolut' as const
        }));
      
      // Merge with existing expenses (avoid duplicates)
      setExpenses(prev => {
        const manualExpenses = prev.filter(expense => expense.source !== 'revolut');
        return [...manualExpenses, ...revolutExpenses];
      });
      
      setLastRevolutSync(new Date());
    } catch (error) {
      console.error('Revolut sync error:', error);
    }
    setIsRevolutLoading(false);
  }, []);

  // Load data from localStorage
  useEffect(() => {
    const savedBudget = localStorage.getItem('budget');
    const savedExpenses = localStorage.getItem('expenses');
    
    if (savedBudget) setBudget(JSON.parse(savedBudget));
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));

    // Check Revolut connection status
    setIsRevolutConnected(revolutService.isAuthenticated());
    
    // Auto-sync Revolut data if connected
    if (revolutService.isAuthenticated()) {
      syncRevolutData();
    }
  }, [syncRevolutData]);

  // Save budget to localStorage
  useEffect(() => {
    localStorage.setItem('budget', JSON.stringify(budget));
  }, [budget]);

  // Save expenses to localStorage
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const connectRevolut = async () => {
    try {
      const authURL = revolutService.getAuthURL();
      window.open(authURL, '_blank', 'width=600,height=700');
      
      // Listen for the OAuth callback
      const handleMessage = async (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'REVOLUT_AUTH_SUCCESS') {
          const { code, state } = event.data;
          const success = await revolutService.exchangeCodeForTokens(code, state);
          
          if (success) {
            setIsRevolutConnected(true);
            await syncRevolutData();
          }
          
          window.removeEventListener('message', handleMessage);
        }
      };
      
      window.addEventListener('message', handleMessage);
    } catch (error) {
      console.error('Revolut connection error:', error);
    }
  };

  const disconnectRevolut = () => {
    revolutService.disconnect();
    setIsRevolutConnected(false);
    setRevolutAccounts([]);
    setLastRevolutSync(null);
    
    // Remove Revolut expenses
    setExpenses(prev => prev.filter(expense => expense.source !== 'revolut'));
  };

  const categorizeRevolutTransaction = (description: string): string => {
    const desc = description.toLowerCase();
    
    if (desc.includes('maxima') || desc.includes('rimi') || desc.includes('barbora') || 
        desc.includes('grocery') || desc.includes('food') || desc.includes('restaurant')) {
      return 'food';
    }
    if (desc.includes('transport') || desc.includes('bus') || desc.includes('taxi') || 
        desc.includes('fuel') || desc.includes('parking')) {
      return 'transport';
    }
    if (desc.includes('entertainment') || desc.includes('cinema') || desc.includes('bar') || 
        desc.includes('club') || desc.includes('game')) {
      return 'entertainment';
    }
    if (desc.includes('shop') || desc.includes('store') || desc.includes('clothing') || 
        desc.includes('amazon') || desc.includes('online')) {
      return 'shopping';
    }
    if (desc.includes('bill') || desc.includes('utility') || desc.includes('phone') || 
        desc.includes('internet') || desc.includes('insurance')) {
      return 'bills';
    }
    
    return 'other';
  };

  const addExpense = () => {
    if (!newExpense.description || !newExpense.amount) return;
    
    const expense: Expense = {
      id: Date.now().toString(),
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      date: new Date().toISOString(),
      source: 'manual'
    };
    
    setExpenses([expense, ...expenses]);
    setNewExpense({ description: '', amount: '', category: 'food' });
    setShowAddExpense(false);
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  // Calculate spending statistics
  const today = new Date().toDateString();
  const thisWeek = new Date();
  thisWeek.setDate(thisWeek.getDate() - 7);
  const thisMonth = new Date();
  thisMonth.setDate(1);

  const todaySpending = expenses
    .filter(expense => new Date(expense.date).toDateString() === today)
    .reduce((sum, expense) => sum + expense.amount, 0);

  const weekSpending = expenses
    .filter(expense => new Date(expense.date) >= thisWeek)
    .reduce((sum, expense) => sum + expense.amount, 0);

  const monthSpending = expenses
    .filter(expense => new Date(expense.date) >= thisMonth)
    .reduce((sum, expense) => sum + expense.amount, 0);

  const generateInsights = (): string[] => {
    const insights = [];
    
    if (todaySpending > budget.daily) {
      insights.push(t('budget.insights.overDaily'));
    } else {
      insights.push(t('budget.insights.underDaily'));
    }
    
    if (monthSpending > budget.monthly * 0.8) {
      insights.push(t('budget.insights.nearMonthly'));
    }
    
    const foodSpending = expenses
      .filter(expense => expense.category === 'food' && new Date(expense.date) >= thisMonth)
      .reduce((sum, expense) => sum + expense.amount, 0);
    
    if (foodSpending > monthSpending * 0.5) {
      insights.push(t('budget.insights.foodHigh'));
    }
    
    if (insights.length === 0) {
      insights.push(t('budget.insights.onTrack'));
    }
    
    return insights;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'food': return '🍽️';
      case 'transport': return '🚗';
      case 'entertainment': return '🎬';
      case 'shopping': return '🛍️';
      case 'bills': return '💡';
      default: return '💰';
    }
  };

  const revolutBalance = revolutAccounts.reduce((total, account) => 
    account.currency === 'EUR' ? total + account.balance : total, 0
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header with Revolut Integration */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('budget.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('budget.subtitle')}
          </p>
        </div>
        
        {/* Revolut Connection */}
        <div className="flex items-center space-x-4">
          {isRevolutConnected ? (
            <div className="flex items-center space-x-2">
              <div className="flex items-center bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-3 py-2 rounded-lg">
                <CreditCard className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">
                  €{revolutBalance.toFixed(2)} EUR
                </span>
              </div>
              
              <button
                onClick={syncRevolutData}
                disabled={isRevolutLoading}
                className="flex items-center bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRevolutLoading ? 'animate-spin' : ''}`} />
                <span className="text-sm">
                  {isRevolutLoading ? 'Syncing...' : 'Sync'}
                </span>
              </button>
              
              <button
                onClick={disconnectRevolut}
                className="text-gray-500 hover:text-red-600 p-2"
                title="Disconnect Revolut"
              >
                <Link className="h-4 w-4 rotate-45" />
              </button>
            </div>
          ) : (
            <button
              onClick={connectRevolut}
              className="flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Connect Revolut
            </button>
          )}
        </div>
      </div>

      {/* Revolut Sync Status */}
      {isRevolutConnected && lastRevolutSync && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Zap className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-blue-700 dark:text-blue-400 font-medium">
                Real-time Banking Integration Active
              </span>
            </div>
            <span className="text-sm text-blue-600 dark:text-blue-400">
              Last sync: {lastRevolutSync.toLocaleTimeString()}
            </span>
          </div>
          <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
            Your Revolut transactions are automatically imported and categorized.
          </p>
        </div>
      )}

      {/* Budget Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Daily Budget */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t('budget.daily')}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Today</p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Spent</span>
              <span className="font-medium text-gray-900 dark:text-white">
                €{todaySpending.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Remaining</span>
              <span className={`font-medium ${(budget.daily - todaySpending) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                €{(budget.daily - todaySpending).toFixed(2)}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  todaySpending <= budget.daily ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min((todaySpending / budget.daily) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Weekly Budget */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-purple-500 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t('budget.weekly')}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">This week</p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Spent</span>
              <span className="font-medium text-gray-900 dark:text-white">
                €{weekSpending.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Remaining</span>
              <span className={`font-medium ${(budget.weekly - weekSpending) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                €{(budget.weekly - weekSpending).toFixed(2)}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  weekSpending <= budget.weekly ? 'bg-purple-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min((weekSpending / budget.weekly) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Monthly Budget */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <PieChart className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t('budget.monthly')}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">This month</p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Spent</span>
              <span className="font-medium text-gray-900 dark:text-white">
                €{monthSpending.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Remaining</span>
              <span className={`font-medium ${(budget.monthly - monthSpending) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                €{(budget.monthly - monthSpending).toFixed(2)}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  monthSpending <= budget.monthly ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min((monthSpending / budget.monthly) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center mb-4">
          <TrendingUp className="h-6 w-6 text-blue-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('budget.insights.title')}
          </h3>
        </div>
        <div className="space-y-2">
          {generateInsights().map((insight, index) => (
            <div key={index} className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-gray-700 dark:text-gray-300">{insight}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('budget.recentExpenses')}
            </h3>
            <button
              onClick={() => setShowAddExpense(true)}
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t('budget.addExpense')}
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {expenses.length === 0 ? (
            <div className="text-center py-8">
              <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                {t('budget.noExpenses')}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {expenses.slice(0, 5).map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">
                      {getCategoryIcon(expense.category)}
                    </span>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {expense.description}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(expense.date).toLocaleDateString()}
                        </p>
                        {expense.source === 'revolut' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            <CreditCard className="h-3 w-3 mr-1" />
                            Revolut
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      €{expense.amount.toFixed(2)}
                    </span>
                    {expense.source === 'manual' && (
                      <button
                        onClick={() => deleteExpense(expense.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('budget.addExpense')}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('budget.description')}
                </label>
                <input
                  type="text"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Lunch at Lido"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('budget.amount')}
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('budget.category')}
                </label>
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="food">🍽️ Food</option>
                  <option value="transport">🚗 Transport</option>
                  <option value="entertainment">🎬 Entertainment</option>
                  <option value="shopping">🛍️ Shopping</option>
                  <option value="bills">💡 Bills</option>
                  <option value="other">💰 Other</option>
                </select>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddExpense(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={addExpense}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t('common.add')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetTab;