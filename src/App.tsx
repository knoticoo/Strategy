import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { AdminPanel } from './components/Admin/AdminPanel';
import './i18n/config';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Main App Route */}
          <Route path="/" element={<Layout />} />
          
          {/* Admin Panel Route */}
          <Route path="/admin" element={<AdminPanel />} />
          
          {/* Redirect any unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;