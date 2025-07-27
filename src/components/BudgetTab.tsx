import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar,
  PieChart,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Edit3,
  Trash2
} from 'lucide-react';

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

interface Budget {
  daily: number;
  weekly: number;
  monthly: number;
}

const BudgetTab: React.FC = () => {
  const { t } = useTranslation();
  const [budget, setBudget] = useState<Budget>({
    daily: 20,
    weekly: 140,
    monthly: 600
  });
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: 'food'
  });

  // Load data from localStorage
  useEffect(() => {
    const savedBudget = localStorage.getItem('budget');
    const savedExpenses = localStorage.getItem('expenses');
    
    if (savedBudget) {
      setBudget(JSON.parse(savedBudget));
    }
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('budget', JSON.stringify(budget));
  }, [budget]);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = () => {
    if (!newExpense.description || !newExpense.amount) return;

    const expense: Expense = {
      id: Date.now().toString(),
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      date: new Date().toISOString()
    };

    setExpenses([expense, ...expenses]);
    setNewExpense({ description: '', amount: '', category: 'food' });
    setShowAddExpense(false);
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  // Calculate spending
  const today = new Date().toDateString();
  const thisWeek = new Date();
  thisWeek.setDate(thisWeek.getDate() - 7);
  const thisMonth = new Date();
  thisMonth.setMonth(thisMonth.getMonth() - 1);

  const todaySpending = expenses
    .filter(exp => new Date(exp.date).toDateString() === today)
    .reduce((sum, exp) => sum + exp.amount, 0);

  const weekSpending = expenses
    .filter(exp => new Date(exp.date) >= thisWeek)
    .reduce((sum, exp) => sum + exp.amount, 0);

  const monthSpending = expenses
    .filter(exp => new Date(exp.date) >= thisMonth)
    .reduce((sum, exp) => sum + exp.amount, 0);

  // Calculate remaining budget
  const dailyRemaining = budget.daily - todaySpending;
  const weeklyRemaining = budget.weekly - weekSpending;
  const monthlyRemaining = budget.monthly - monthSpending;

  // AI Insights
  const generateInsights = () => {
    const insights = [];
    
    if (todaySpending > budget.daily) {
      insights.push({
        type: 'warning',
        message: t('budget.insights.overspending', { category: t('budget.categories.food') })
      });
    }
    
    if (weeklyRemaining > budget.weekly * 0.3) {
      insights.push({
        type: 'success',
        message: t('budget.insights.saving', { amount: `€${weeklyRemaining.toFixed(2)}` })
      });
    }
    
    insights.push({
      type: 'info',
      message: t('budget.insights.recommendation', { store: 'Maxima' })
    });
    
    return insights;
  };

  const insights = generateInsights();

  const categories = [
    { id: 'food', name: t('budget.categories.food'), color: 'bg-red-500' },
    { id: 'transport', name: t('budget.categories.transport'), color: 'bg-blue-500' },
    { id: 'shopping', name: t('budget.categories.shopping'), color: 'bg-purple-500' },
    { id: 'entertainment', name: t('budget.categories.entertainment'), color: 'bg-pink-500' },
    { id: 'bills', name: t('budget.categories.bills'), color: 'bg-orange-500' },
    { id: 'other', name: t('budget.categories.other'), color: 'bg-gray-500' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('budget.title')}
        </h1>
        <button
          onClick={() => setShowAddExpense(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>{t('budget.addExpense')}</span>
        </button>
      </div>

      {/* Budget Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Daily Budget */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('budget.dailyBudget')}
            </h3>
            <Calendar className="h-5 w-5 text-blue-500" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t('budget.currentSpending')}
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                €{todaySpending.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t('budget.remainingBudget')}
              </span>
              <span className={`font-semibold ${
                dailyRemaining >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                €{dailyRemaining.toFixed(2)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  todaySpending <= budget.daily ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{
                  width: `${Math.min((todaySpending / budget.daily) * 100, 100)}%`
                }}
              />
            </div>
          </div>
        </div>

        {/* Weekly Budget */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('budget.weeklyBudget')}
            </h3>
            <BarChart3 className="h-5 w-5 text-green-500" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t('budget.currentSpending')}
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                €{weekSpending.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t('budget.remainingBudget')}
              </span>
              <span className={`font-semibold ${
                weeklyRemaining >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                €{weeklyRemaining.toFixed(2)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  weekSpending <= budget.weekly ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{
                  width: `${Math.min((weekSpending / budget.weekly) * 100, 100)}%`
                }}
              />
            </div>
          </div>
        </div>

        {/* Monthly Budget */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('budget.monthlyBudget')}
            </h3>
            <PieChart className="h-5 w-5 text-purple-500" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t('budget.currentSpending')}
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                €{monthSpending.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t('budget.remainingBudget')}
              </span>
              <span className={`font-semibold ${
                monthlyRemaining >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                €{monthlyRemaining.toFixed(2)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  monthSpending <= budget.monthly ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{
                  width: `${Math.min((monthSpending / budget.monthly) * 100, 100)}%`
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
          {t('budget.insights.title')}
        </h3>
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <div
              key={index}
              className={`flex items-start space-x-3 p-3 rounded-xl ${
                insight.type === 'warning' ? 'bg-red-50 dark:bg-red-900/20' :
                insight.type === 'success' ? 'bg-green-50 dark:bg-green-900/20' :
                'bg-blue-50 dark:bg-blue-900/20'
              }`}
            >
              {insight.type === 'warning' && <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />}
              {insight.type === 'success' && <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />}
              {insight.type === 'info' && <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5" />}
              <p className="text-sm text-gray-700 dark:text-gray-300">{insight.message}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Expenses
        </h3>
        {expenses.length === 0 ? (
          <div className="text-center py-8">
            <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No expenses yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {expenses.slice(0, 5).map((expense) => {
              const category = categories.find(cat => cat.id === expense.category);
              return (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${category?.color || 'bg-gray-500'}`} />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {expense.description}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {category?.name} • {new Date(expense.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      €{expense.amount.toFixed(2)}
                    </span>
                    <button
                      onClick={() => deleteExpense(expense.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('budget.addExpense')}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('budget.expenseDescription')}
                </label>
                <input
                  type="text"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="e.g., Lunch at restaurant"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('budget.expenseAmount')}
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('budget.expenseCategory')}
                </label>
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddExpense(false)}
                className="flex-1 btn-secondary"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={addExpense}
                className="flex-1 btn-primary"
                disabled={!newExpense.description || !newExpense.amount}
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