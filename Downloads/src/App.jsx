// App.jsx
import React from 'react';
import { TestProvider } from './context/TestContext';
import Header from './components/Header';
import TestForm from './components/TestForm';
import TestResult from './components/TestResult';
import TestHistory from './components/TestHistory';

function App() {
  return (
    <TestProvider>
      <div className="min-h-screen bg-gray-900 text-white">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              <TestForm />
              <TestResult />
            </div>
            <TestHistory />
          </div>
        </main>
      </div>
    </TestProvider>
  );
}

export default App;