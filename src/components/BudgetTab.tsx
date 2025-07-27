import React, { useState, useEffect } from 'react';
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
  Wallet,
  Edit3,
  Save
} from 'lucide-react';

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  source: 'manual';
}

interface Budget {
  daily: number;
  weekly: number;
  monthly: number;
}

interface UserBalance {
  current: number;
  currency: string;
  lastUpdated: string;
}

const BudgetTab: React.FC = () => {
  const { t } = useTranslation();
  const [budget, setBudget] = useState<Budget>({ daily: 20, weekly: 140, monthly: 600 });
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [userBalance, setUserBalance] = useState<UserBalance>({ current: 500, currency: 'EUR', lastUpdated: new Date().toISOString() });
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showEditBalance, setShowEditBalance] = useState(false);
  const [newExpense, setNewExpense] = useState({ description: '', amount: '', category: 'food' });
  const [editBalance, setEditBalance] = useState('');

  // Load data from localStorage
  useEffect(() => {
    const savedBudget = localStorage.getItem('budget');
    const savedExpenses = localStorage.getItem('expenses');
    const savedBalance = localStorage.getItem('userBalance');
    
    if (savedBudget) setBudget(JSON.parse(savedBudget));
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
    if (savedBalance) setUserBalance(JSON.parse(savedBalance));
  }, []);

  // Save budget to localStorage
  useEffect(() => {
    localStorage.setItem('budget', JSON.stringify(budget));
  }, [budget]);

  // Save expenses to localStorage
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  // Save balance to localStorage
  useEffect(() => {
    localStorage.setItem('userBalance', JSON.stringify(userBalance));
  }, [userBalance]);

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
    
    // Deduct from balance
    setUserBalance(prev => ({
      ...prev,
      current: prev.current - expense.amount,
      lastUpdated: new Date().toISOString()
    }));
    
    setNewExpense({ description: '', amount: '', category: 'food' });
    setShowAddExpense(false);
  };

  const deleteExpense = (id: string) => {
    const expense = expenses.find(exp => exp.id === id);
    if (expense) {
      // Add amount back to balance
      setUserBalance(prev => ({
        ...prev,
        current: prev.current + expense.amount,
        lastUpdated: new Date().toISOString()
      }));
    }
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const saveBalance = () => {
    const newBalance = parseFloat(editBalance);
    if (!isNaN(newBalance) && newBalance >= 0) {
      setUserBalance({
        current: newBalance,
        currency: 'EUR',
        lastUpdated: new Date().toISOString()
      });
      setShowEditBalance(false);
      setEditBalance('');
    }
  };

  const openEditBalance = () => {
    setEditBalance(userBalance.current.toString());
    setShowEditBalance(true);
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

    if (userBalance.current < 50) {
      insights.push('Your balance is getting low. Consider checking the deals tab for savings!');
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

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header with Balance */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('budget.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('budget.subtitle')}
          </p>
        </div>
        
        {/* Current Balance */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg border border-green-200 dark:border-green-800">
            <Wallet className="h-5 w-5 mr-2" />
            <div className="text-right">
              <div className="text-lg font-bold">
                €{userBalance.current.toFixed(2)}
              </div>
              <div className="text-xs opacity-75">
                Current Balance
              </div>
            </div>
          </div>
          
          <button
            onClick={openEditBalance}
            className="flex items-center bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            title="Edit Balance"
          >
            <Edit3 className="h-4 w-4 mr-2" />
            Edit
          </button>
        </div>
      </div>

      {/* Balance Status */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Wallet className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-blue-700 dark:text-blue-400 font-medium">
              Manual Balance Management
            </span>
          </div>
          <span className="text-sm text-blue-600 dark:text-blue-400">
            Last updated: {new Date(userBalance.lastUpdated).toLocaleString()}
          </span>
        </div>
        <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
          Your expenses are automatically deducted from your balance. Edit your balance anytime.
        </p>
      </div>

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
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                          Manual
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      €{expense.amount.toFixed(2)}
                    </span>
                    <button
                      onClick={() => deleteExpense(expense.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Balance Modal */}
      {showEditBalance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Edit Current Balance
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Balance (EUR)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editBalance}
                  onChange={(e) => setEditBalance(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="500.00"
                  autoFocus
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Enter your current account balance. Expenses will be deducted automatically.
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowEditBalance(false);
                  setEditBalance('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveBalance}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </button>
            </div>
          </div>
        </div>
      )}

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
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Amount will be deducted from your balance: €{userBalance.current.toFixed(2)}
                </p>
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