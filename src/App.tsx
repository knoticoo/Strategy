import { useState } from 'react';
import { Header } from './components/Layout/Header';
import { ChatInterface } from './components/Chat/ChatInterface';
import { MedicineSearch } from './components/Medicines/MedicineSearch';

function App() {
  const [activeTab, setActiveTab] = useState('chat');

  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatInterface />;
      case 'medicines':
        return <MedicineSearch />;
      case 'pets':
        return (
          <div className="max-w-4xl mx-auto p-4">
            <div className="card text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Mājdzīvnieku profili
              </h2>
              <p className="text-gray-600 mb-6">
                Šī funkcija tiks pievienota drīzumā. Jūs varēsiet izveidot un pārvaldīt savu mājdzīvnieku profilus.
              </p>
              <div className="text-6xl mb-4">🐾</div>
              <p className="text-sm text-gray-500">
                Pagaidām izmantojiet AI konsultāciju un medikamentu datubāzi
              </p>
            </div>
          </div>
        );
      default:
        return <ChatInterface />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="pb-8">
        {renderContent()}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600 mb-2">
              AI Veterinārais Asistents - Profesionāla palīdzība jūsu mājdzīvniekiem
            </p>
            <p className="text-sm text-gray-500">
              ⚠️ Svarīgi: Šī informācija ir tikai informatīviem nolūkiem un neaizstāj profesionālu veterinārārsta konsultāciju.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;