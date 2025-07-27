// Latvian Mortgage Calculator with Bank Comparisons
import React, { useState, useEffect, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calculator, Building, Calendar, Euro, AlertCircle, CheckCircle } from 'lucide-react';
import latvianBankService, { LatvianBank, MortgageCalculation } from '../services/latvianBankService';

interface MortgageCalculatorProps {
  propertyPrice?: number;
  onCalculationChange?: (calculations: MortgageCalculation[]) => void;
}

const MortgageCalculator: React.FC<MortgageCalculatorProps> = ({
  propertyPrice: initialPrice = 80000,
  onCalculationChange
}) => {
  const [propertyPrice, setPropertyPrice] = useState(initialPrice);
  const [downPaymentPercentage, setDownPaymentPercentage] = useState(20);
  const [loanTerm, setLoanTerm] = useState(25);
  const [monthlyIncome, setMonthlyIncome] = useState(2500);
  const [existingDebts, setExistingDebts] = useState(0);
  const [calculations, setCalculations] = useState<MortgageCalculation[]>([]);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [banks] = useState<LatvianBank[]>(latvianBankService.getBanks());
  const [affordability, setAffordability] = useState<any>(null);

  useEffect(() => {
    setPropertyPrice(initialPrice);
  }, [initialPrice]);

  const calculateMortgages = useCallback(() => {
    try {
      const results = latvianBankService.compareAllBanks(
        propertyPrice,
        downPaymentPercentage,
        loanTerm
      );
      setCalculations(results);
      if (onCalculationChange) {
        onCalculationChange(results);
      }
    } catch (error) {
      console.error('Mortgage calculation error:', error);
      setCalculations([]);
    }
  }, [propertyPrice, downPaymentPercentage, loanTerm, onCalculationChange]);

  const calculateAffordability = useCallback(() => {
    const result = latvianBankService.calculateAffordability(monthlyIncome, existingDebts);
    setAffordability(result);
  }, [monthlyIncome, existingDebts]);

  useEffect(() => {
    calculateMortgages();
    calculateAffordability();
  }, [calculateMortgages, calculateAffordability]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('lv-LV', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };

  const getAffordabilityColor = (ratio: number): string => {
    if (ratio <= 30) return 'text-green-600';
    if (ratio <= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAffordabilityIcon = (ratio: number) => {
    if (ratio <= 30) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (ratio <= 40) return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    return <AlertCircle className="h-5 w-5 text-red-600" />;
  };

  // Generate payment schedule for selected bank
  const generatePaymentSchedule = (calculation: MortgageCalculation) => {
    const schedule = [];
    const monthlyRate = calculation.interestRate / 100 / 12;
    const numberOfPayments = calculation.term * 12;
    let remainingBalance = calculation.loanAmount;
    
    for (let month = 1; month <= Math.min(60, numberOfPayments); month++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = calculation.monthlyPayment - interestPayment;
      remainingBalance -= principalPayment;
      
      if (month % 12 === 0 || month <= 12) {
        schedule.push({
          month,
          year: Math.ceil(month / 12),
          monthlyPayment: calculation.monthlyPayment,
          principal: principalPayment,
          interest: interestPayment,
          balance: remainingBalance
        });
      }
    }
    
    return schedule;
  };

  const chartData = calculations.map(calc => ({
    bank: calc.bank.name,
    monthlyPayment: Math.round(calc.monthlyPayment),
    totalCost: Math.round(calc.totalAmount),
    interestRate: calc.interestRate
  }));

  const pieData = calculations.length > 0 ? [
    { name: 'Galvenā summa', value: calculations[0].loanAmount, color: '#3b82f6' },
    { name: 'Procenti', value: calculations[0].totalInterest, color: '#ef4444' }
  ] : [];

  return (
    <div className="space-y-6">
      {/* Calculator Form */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <Calculator className="h-6 w-6 text-primary-600 mr-3" />
          <h2 className="text-xl font-bold text-gray-900">Latvijas Banku Hipotēku Kalkulators</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Īpašuma cena
              </label>
              <div className="relative">
                <Euro className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  value={propertyPrice}
                  onChange={(e) => setPropertyPrice(Number(e.target.value))}
                  className="pl-10 w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                  placeholder="80000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pirmsmaksa ({downPaymentPercentage}%)
              </label>
              <input
                type="range"
                min="10"
                max="50"
                value={downPaymentPercentage}
                onChange={(e) => setDownPaymentPercentage(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>10%</span>
                <span className="font-medium text-primary-600">
                  {formatCurrency(propertyPrice * downPaymentPercentage / 100)}
                </span>
                <span>50%</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kredīta termiņš
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <select
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(Number(e.target.value))}
                  className="pl-10 w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                >
                  <option value={15}>15 gadi</option>
                  <option value={20}>20 gadi</option>
                  <option value={25}>25 gadi</option>
                  <option value={30}>30 gadi</option>
                </select>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mēneša ienākumi
              </label>
              <div className="relative">
                <Euro className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                  className="pl-10 w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                  placeholder="2500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Esošie parādi (mēnesī)
              </label>
              <div className="relative">
                <Euro className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  value={existingDebts}
                  onChange={(e) => setExistingDebts(Number(e.target.value))}
                  className="pl-10 w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Affordability Indicator */}
            {affordability && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Maksātspēja</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Maksimālā mājas cena:</span>
                    <span className="font-medium">{formatCurrency(affordability.recommendedPrice)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Maks. mēneša maksājums:</span>
                    <span className="font-medium">{formatCurrency(affordability.maxMonthlyPayment)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bank Comparisons */}
      {calculations.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Banku Salīdzinājums</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            {calculations.slice(0, 3).map((calc, index) => (
              <div
                key={calc.bank.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedBank === calc.bank.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedBank(calc.bank.id)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Building className="h-5 w-5 text-gray-600 mr-2" />
                    <span className="font-semibold text-gray-900">{calc.bank.name}</span>
                  </div>
                  {index === 0 && (
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                      Labākais
                    </span>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Mēneša maksājums:</span>
                    <span className="font-bold text-primary-600">{formatCurrency(calc.monthlyPayment)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Kopējā summa:</span>
                    <span className="font-medium">{formatCurrency(calc.totalAmount)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Procenti:</span>
                    <span className="font-medium">{formatPercentage(calc.interestRate)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">DTI ratio:</span>
                    <div className="flex items-center">
                      {getAffordabilityIcon((calc.monthlyPayment / monthlyIncome) * 100)}
                      <span className={`ml-1 font-medium ${getAffordabilityColor((calc.monthlyPayment / monthlyIncome) * 100)}`}>
                        {formatPercentage((calc.monthlyPayment / monthlyIncome) * 100)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Payment Comparison */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Mēneša Maksājumu Salīdzinājums</h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="bank" 
                    tick={{ fontSize: 12 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value: number) => [formatCurrency(value), 'Mēneša maksājums']}
                    labelStyle={{ color: '#374151' }}
                  />
                  <Bar dataKey="monthlyPayment" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Loan Breakdown */}
            {calculations.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Kredīta Sadalījums</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center space-x-4 mt-2">
                  {pieData.map((entry, index) => (
                    <div key={index} className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: entry.color }}
                      ></div>
                      <span className="text-sm text-gray-600">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Detailed Payment Schedule */}
          {selectedBank && calculations.find(c => c.bank.id === selectedBank) && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Maksājumu Grafiks - {calculations.find(c => c.bank.id === selectedBank)?.bank.name}
              </h4>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Gads
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mēneša Maksājums
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Galvenā Summa
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Procenti
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Atlikums
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {generatePaymentSchedule(calculations.find(c => c.bank.id === selectedBank)!).map((payment, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {payment.year}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(payment.monthlyPayment)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(payment.principal)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(payment.interest)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(payment.balance)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tips and Info */}
      <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
        <h3 className="text-sm font-medium text-blue-900 mb-3">💡 Padomi Hipotēkas Ņemšanai</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <h4 className="font-medium mb-2">Pirms pieteikšanās:</h4>
            <ul className="space-y-1 text-blue-700">
              <li>• Sakrājiet vismaz 20% pirmsmaksai</li>
              <li>• Uzlabojiet kredītvēsturi</li>
              <li>• Sagatavot nepieciešamos dokumentus</li>
              <li>• Izvērtēt papildu izmaksas (noformēšana, apdrošināšana)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Latvijas banku prasības:</h4>
            <ul className="space-y-1 text-blue-700">
              <li>• DTI ratio maksimums 40%</li>
              <li>• Minimālā pirmsmaksa 15-25%</li>
              <li>• Stabilā darba vieta vismaz 6 mēnešus</li>
              <li>• Īpašuma apdrošināšana obligāta</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MortgageCalculator;