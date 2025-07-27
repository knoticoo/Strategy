import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Plus, TrendingUp, TrendingDown, CreditCard, Wallet, ArrowUpRight, ArrowDownRight, DollarSign, Receipt, Target, Eye, EyeOff, Lightbulb, Home, Bell, Star, AlertTriangle } from 'lucide-react';
import smartInsightsService, { SmartInsight, FinancialGoal } from '../services/smartInsightsService';
import latvianBankService from '../services/latvianBankService';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
}

interface Budget {
  category: string;
  allocated: number;
  spent: number;
  color: string;
}

const BudgetApp: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'income',
      amount: 3000,
      category: 'Salary',
      description: 'Monthly salary',
      date: '2024-01-01'
    },
    {
      id: '2',
      type: 'expense',
      amount: 800,
      category: 'Rent',
      description: 'Monthly rent payment',
      date: '2024-01-02'
    },
    {
      id: '3',
      type: 'expense',
      amount: 150,
      category: 'Food',
      description: 'Groceries',
      date: '2024-01-03'
    },
    {
      id: '4',
      type: 'expense',
      amount: 50,
      category: 'Transport',
      description: 'Bus pass',
      date: '2024-01-04'
    }
  ]);

  const [budgets, setBudgets] = useState<Budget[]>([
    { category: 'Food', allocated: 500, spent: 150, color: '#10B981' },
    { category: 'Transport', allocated: 200, spent: 50, color: '#3B82F6' },
    { category: 'Entertainment', allocated: 300, spent: 0, color: '#8B5CF6' },
    { category: 'Rent', allocated: 1000, spent: 800, color: '#F59E0B' },
    { category: 'Utilities', allocated: 200, spent: 0, color: '#EF4444' }
  ]);

  const [newTransaction, setNewTransaction] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    category: '',
    description: ''
  });

  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [hideBalances, setHideBalances] = useState(false);

  // Smart Insights State
  const [insights, setInsights] = useState<SmartInsight[]>([]);
  const [financialGoals, setFinancialGoals] = useState<FinancialGoal[]>([]);
  const [affordability, setAffordability] = useState<any>(null);
  const [showInsights, setShowInsights] = useState(true);
  const [loading, setLoading] = useState(false);
  const revolutBalance = 2145.67;

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  // Generate smart insights when transactions change
  useEffect(() => {
    generateInsights();
  }, [transactions]);

  const generateInsights = async () => {
    if (transactions.length === 0) return;
    
    setLoading(true);
    try {
      // Generate spending pattern insights
      const spendingInsights = await smartInsightsService.analyzeSpendingPatterns(transactions);
      
      // Generate financial goals
      const monthlyIncome = totalIncome || 2500; // Use calculated or default
      const currentSavings = balance > 0 ? balance : 0;
      const goals = smartInsightsService.generateSavingsGoals(monthlyIncome, currentSavings);
      
      // Calculate affordability
      const affordabilityData = latvianBankService.calculateAffordability(monthlyIncome);
      
      setInsights(spendingInsights);
      setFinancialGoals(goals);
      setAffordability(affordabilityData);
    } catch (error) {
      console.error('Error generating insights:', error);
    } finally {
      setLoading(false);
    }
  };

  // Prepare data for charts
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const chartData = Object.entries(expensesByCategory).map(([category, amount]) => ({
    name: category,
    value: amount,
    color: budgets.find(b => b.category === category)?.color || '#8B5CF6'
  }));

  const monthlyData = [
    { month: 'Jan', income: 3000, expenses: 1000 },
    { month: 'Feb', income: 3200, expenses: 1200 },
    { month: 'Mar', income: 3100, expenses: 1100 },
    { month: 'Apr', income: 3300, expenses: 1300 },
    { month: 'May', income: 3000, expenses: 1000 },
    { month: 'Jun', income: 3400, expenses: 1400 }
  ];

  const handleAddTransaction = () => {
    if (newTransaction.amount && newTransaction.category && newTransaction.description) {
      const transaction: Transaction = {
        id: Date.now().toString(),
        type: newTransaction.type,
        amount: parseFloat(newTransaction.amount),
        category: newTransaction.category,
        description: newTransaction.description,
        date: new Date().toISOString().split('T')[0]
      };

      setTransactions([transaction, ...transactions]);
      
      if (newTransaction.type === 'expense') {
        setBudgets(budgets.map(budget => 
          budget.category === newTransaction.category
            ? { ...budget, spent: budget.spent + parseFloat(newTransaction.amount) }
            : budget
        ));
      }

      setNewTransaction({ type: 'expense', amount: '', category: '', description: '' });
      setShowAddTransaction(false);
    }
  };

  const connectToRevolut = () => {
    alert('Revolut integration would require API keys and OAuth setup. This is a demo showing how the UI would look.');
  };

  const formatCurrency = (amount: number) => {
    return hideBalances ? '•••••' : `$${amount.toLocaleString()}`;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your financial overview.</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <button
            onClick={() => setHideBalances(!hideBalances)}
            className="btn-secondary"
          >
            {hideBalances ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
            {hideBalances ? 'Show' : 'Hide'} Balances
          </button>
          <button
            onClick={() => setShowAddTransaction(true)}
            className="btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </button>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Balance */}
        <div className="gradient-card gradient-blue rounded-2xl p-6 text-white">
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Balance</p>
              <p className="text-3xl font-bold text-shadow mt-1">{formatCurrency(balance)}</p>
              <div className="flex items-center mt-2 text-blue-100">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-sm">+2.5% this month</span>
              </div>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-xl">
              <Wallet className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Income */}
        <div className="gradient-card gradient-green rounded-2xl p-6 text-white">
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium">Monthly Income</p>
              <p className="text-3xl font-bold text-shadow mt-1">{formatCurrency(totalIncome)}</p>
              <div className="flex items-center mt-2 text-emerald-100">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span className="text-sm">+5.2% vs last month</span>
              </div>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-xl">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Expenses */}
        <div className="gradient-card gradient-orange rounded-2xl p-6 text-white">
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Monthly Expenses</p>
              <p className="text-3xl font-bold text-shadow mt-1">{formatCurrency(totalExpenses)}</p>
              <div className="flex items-center mt-2 text-orange-100">
                <ArrowDownRight className="h-4 w-4 mr-1" />
                <span className="text-sm">-1.8% vs last month</span>
              </div>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-xl">
              <Receipt className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Revolut Card */}
        <div className="gradient-card gradient-purple rounded-2xl p-6 text-white">
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Revolut Account</p>
              <p className="text-3xl font-bold text-shadow mt-1">{formatCurrency(revolutBalance)}</p>
              <button
                onClick={connectToRevolut}
                className="mt-2 text-xs bg-white bg-opacity-20 px-3 py-1 rounded-full hover:bg-opacity-30 transition-colors"
              >
                Sync Account
              </button>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-xl">
              <CreditCard className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Expense Distribution */}
        <div className="chart-container">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Expense Distribution</h3>
            <div className="badge badge-primary">This Month</div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Overview */}
        <div className="chart-container">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Trends</h3>
            <div className="badge badge-success">6 Months</div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => [`$${value}`, '']} />
              <Bar dataKey="income" fill="#10B981" name="Income" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" fill="#EF4444" name="Expenses" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Budget Overview */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
              <Target className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Budget Overview</h3>
              <p className="text-sm text-gray-500">Track your spending against your budget goals</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          {budgets.map((budget) => {
            const percentage = (budget.spent / budget.allocated) * 100;
            const isOverBudget = percentage > 100;
            const remaining = budget.allocated - budget.spent;
            
            return (
              <div key={budget.category} className="p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: budget.color }}
                    />
                    <span className="font-medium text-gray-900">{budget.category}</span>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${isOverBudget ? 'text-danger-600' : 'text-gray-900'}`}>
                      ${budget.spent} / ${budget.allocated}
                    </p>
                    <p className={`text-xs ${remaining >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                      {remaining >= 0 ? `$${remaining} remaining` : `$${Math.abs(remaining)} over budget`}
                    </p>
                  </div>
                </div>
                
                <div className="progress-bar">
                  <div
                    className={`progress-fill ${isOverBudget ? 'bg-danger-500' : 'bg-gradient-to-r from-primary-500 to-primary-600'}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
                
                <div className="flex items-center justify-between mt-2 text-xs">
                  <span className="text-gray-500">{percentage.toFixed(1)}% used</span>
                  {isOverBudget && (
                    <span className="badge badge-danger">Over Budget</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showAddTransaction && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-large max-w-md w-full p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Add New Transaction</h3>
              <button
                onClick={() => setShowAddTransaction(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Plus className="h-5 w-5 rotate-45" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setNewTransaction({...newTransaction, type: 'expense'})}
                    className={`p-3 rounded-xl border text-sm font-medium transition-colors ${
                      newTransaction.type === 'expense'
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    Expense
                  </button>
                  <button
                    onClick={() => setNewTransaction({...newTransaction, type: 'income'})}
                    className={`p-3 rounded-xl border text-sm font-medium transition-colors ${
                      newTransaction.type === 'income'
                        ? 'border-success-500 bg-success-50 text-success-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    Income
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    placeholder="0.00"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                    className="input-field pl-10"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={newTransaction.category}
                  onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
                  className="select-field"
                >
                  <option value="">Select Category</option>
                  <option value="Food">Food & Dining</option>
                  <option value="Transport">Transportation</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Rent">Housing & Rent</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Salary">Salary</option>
                  <option value="Freelance">Freelance</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  placeholder="What was this for?"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                  className="input-field"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddTransaction(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTransaction}
                className="btn-primary flex-1"
              >
                Add Transaction
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Smart Insights */}
      {showInsights && insights.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Lightbulb className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Smart Insights</h3>
                <p className="text-sm text-gray-500">AI-powered financial recommendations</p>
              </div>
            </div>
            <button
              onClick={() => setShowInsights(!showInsights)}
              className="btn-secondary"
            >
              {loading ? 'Analyzing...' : 'Refresh'}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Insights List */}
            <div className="space-y-4">
              {insights.slice(0, 4).map((insight) => (
                <div
                  key={insight.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    insight.impact === 'high' ? 'border-red-500 bg-red-50' :
                    insight.impact === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                    'border-blue-500 bg-blue-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 text-sm">{insight.title}</h4>
                    <div className="flex items-center">
                      {insight.type === 'warning' ? (
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      ) : insight.type === 'saving' ? (
                        <Target className="h-4 w-4 text-green-500" />
                      ) : insight.type === 'property' ? (
                        <Home className="h-4 w-4 text-blue-500" />
                      ) : (
                        <Star className="h-4 w-4 text-purple-500" />
                      )}
                      <span className="ml-1 text-xs text-gray-500">{insight.confidence}%</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                  <p className="text-sm font-medium text-gray-900">{insight.recommendation}</p>
                  {insight.potentialSaving && (
                    <div className="mt-2 text-sm text-green-600 font-medium">
                      💰 Potential savings: €{insight.potentialSaving.toFixed(0)}/month
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Property Affordability & Goals */}
            <div className="space-y-6">
              {/* Property Affordability */}
              {affordability && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Home className="h-4 w-4 mr-2 text-blue-600" />
                    Property Affordability
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Max property price:</span>
                      <span className="font-medium">€{affordability.recommendedPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Max monthly payment:</span>
                      <span className="font-medium">€{affordability.maxMonthlyPayment.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Debt-to-income ratio:</span>
                      <span className={`font-medium ${
                        affordability.debtToIncomeRatio <= 30 ? 'text-green-600' :
                        affordability.debtToIncomeRatio <= 40 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {affordability.debtToIncomeRatio.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Financial Goals */}
              {financialGoals.length > 0 && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Target className="h-4 w-4 mr-2 text-green-600" />
                    Savings Goals
                  </h4>
                  <div className="space-y-3">
                    {financialGoals.slice(0, 2).map((goal) => (
                      <div key={goal.id} className="bg-white rounded-lg p-3 border border-green-100">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm text-gray-900">{goal.name}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            goal.priority === 'high' ? 'bg-red-100 text-red-700' :
                            goal.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {goal.priority}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Target:</span>
                            <span className="font-medium">€{goal.targetAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Current:</span>
                            <span className="font-medium">€{goal.currentAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Monthly:</span>
                            <span className="font-medium text-green-600">€{goal.monthlyContribution.toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ 
                                width: `${Math.min(100, (goal.currentAmount / goal.targetAmount) * 100)}%` 
                              }}
                            />
                          </div>
                          <div className="text-xs text-gray-500">
                            {((goal.currentAmount / goal.targetAmount) * 100).toFixed(1)}% complete
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-success-100 rounded-xl flex items-center justify-center">
              <Receipt className="h-5 w-5 text-success-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
              <p className="text-sm text-gray-500">Your latest financial activity</p>
            </div>
          </div>
          <button className="btn-secondary">View All</button>
        </div>

        <div className="space-y-1">
          {transactions.slice(0, 8).map((transaction) => (
            <div key={transaction.id} className="transaction-item">
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  transaction.type === 'income' ? 'bg-success-100' : 'bg-danger-100'
                }`}>
                  {transaction.type === 'income' ? (
                    <TrendingUp className="h-5 w-5 text-success-600" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-danger-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{transaction.description}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`badge ${
                      transaction.type === 'income' ? 'badge-success' : 'badge-primary'
                    }`}>
                      {transaction.category}
                    </span>
                    <span className="text-xs text-gray-500">{transaction.date}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.type === 'income' ? 'text-success-600' : 'text-danger-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BudgetApp;