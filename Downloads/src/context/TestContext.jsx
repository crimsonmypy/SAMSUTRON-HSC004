// context/TestContext.jsx
import React, { createContext, useState } from 'react';
import { api } from '../utils/mockApi';
import { validateTestData } from '../utils/testUtils';

export const TestContext = createContext();

export function TestProvider({ children }) {
  const [testHistory, setTestHistory] = useState([]);
  const [currentTest, setCurrentTest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addTest = async (testData) => {
    try {
      setLoading(true);
      setError(null);
      validateTestData(testData);
      
      const result = await api.analyzeTest(testData);
      const newTest = {
        ...testData,
        ...result
      };
      
      setCurrentTest(newTest);
      setTestHistory(prev => [newTest, ...prev]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setTestHistory([]);
    setCurrentTest(null);
  };

  return (
    <TestContext.Provider value={{
      testHistory,
      currentTest,
      loading,
      error,
      addTest,
      clearHistory
    }}>
      {children}
    </TestContext.Provider>
  );
}