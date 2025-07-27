import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Wallet, Home, Menu, X, TrendingUp, Bell, Settings, User } from 'lucide-react';
import BudgetApp from './components/BudgetApp';
import HouseSearch from './components/HouseSearch';
import './App.css';

const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold text-gray-900">FinanceHub</h1>
                  <p className="text-xs text-gray-500">Budget & Property</p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-2">
              <Link
                to="/"
                className={`nav-link ${
                  isActive('/') || isActive('')
                    ? 'nav-link-active'
                    : 'nav-link-inactive'
                }`}
              >
                <Wallet className="h-4 w-4 mr-2" />
                Budget
              </Link>
              <Link
                to="/house-search"
                className={`nav-link ${
                  isActive('/house-search')
                    ? 'nav-link-active'
                    : 'nav-link-inactive'
                }`}
              >
                <Home className="h-4 w-4 mr-2" />
                Properties
              </Link>
            </div>

            {/* Right Side Icons */}
            <div className="hidden md:flex items-center space-x-3">
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                <Bell className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                <Settings className="h-5 w-5" />
              </button>
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <div className="px-4 py-4 space-y-2">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className={`nav-link w-full ${
                  isActive('/') || isActive('')
                    ? 'nav-link-active'
                    : 'nav-link-inactive'
                }`}
              >
                <Wallet className="h-4 w-4 mr-3" />
                Budget Management
              </Link>
              <Link
                to="/house-search"
                onClick={() => setIsMenuOpen(false)}
                className={`nav-link w-full ${
                  isActive('/house-search')
                    ? 'nav-link-active'
                    : 'nav-link-inactive'
                }`}
              >
                <Home className="h-4 w-4 mr-3" />
                Property Search
              </Link>
              
              {/* Mobile Menu Footer */}
              <div className="pt-4 border-t border-gray-100 mt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">John Doe</p>
                      <p className="text-xs text-gray-500">Premium Account</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                      <Bell className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                      <Settings className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="animate-fade-in">
            <Routes>
              <Route path="/" element={<BudgetApp />} />
              <Route path="/house-search" element={<HouseSearch />} />
            </Routes>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-100 mt-16">
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-3 mb-4 md:mb-0">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">FinanceHub</p>
                  <p className="text-xs text-gray-500">Smart Financial Management</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <button className="hover:text-gray-900 transition-colors">Privacy</button>
                <button className="hover:text-gray-900 transition-colors">Terms</button>
                <button className="hover:text-gray-900 transition-colors">Support</button>
                <span>© 2024 FinanceHub</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
