import React from 'react';
import { useState } from 'react';
import Header from './components/Layout/Header';
import Navigation from './components/Layout/Navigation';
import IdCardGenerator from './components/IdCard/IdCardGenerator';
import IdCardScanner from './components/IdCard/IdCardScanner';
import EntryLogger from './components/Entry/EntryLogger';
import EntryScanner from './components/Entry/EntryScanner';

const App = () => {
  const [activeTab, setActiveTab] = useState('idcard-generator');

  const renderContent = () => {
    switch (activeTab) {
      case 'idcard-generator':
        return <IdCardGenerator />;
      case 'idcard-scanner':
        return <IdCardScanner />;
      case 'entry-logger':
        return <EntryLogger />;
      case 'entry-scanner':
        return <EntryScanner />;
      default:
        return <IdCardGenerator />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;