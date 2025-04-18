// components/TestResult.jsx
import React, { useContext } from 'react';
import { TestContext } from '../context/TestContext';

function TestResult() {
  const { currentTest } = useContext(TestContext);

  if (!currentTest) return null;

  const getStatusColor = (status) => {
    const colors = {
      healthy: 'text-green-500',
      normal: 'text-blue-500',
      anomaly: 'text-yellow-500',
      'consult a doctor': 'text-orange-500',
      critical: 'text-red-500'
    };
    return colors[status] || 'text-white';
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-orange-500">Analysis Result</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">Confidence:</span>
          <span className="text-lg font-semibold text-orange-500">{currentTest.confidence}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Test Parameters */}
        <div className="bg-gray-700/50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-orange-400">Test Parameters</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">pH Level</p>
              <p className="text-lg font-medium">{currentTest.ph}</p>
              <p className="text-xs text-gray-500">Reference: {currentTest.referenceRanges.ph.min}-{currentTest.referenceRanges.ph.max}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Turbidity</p>
              <p className="text-lg font-medium">{currentTest.turbidity}</p>
              <p className="text-xs text-gray-500">Normal: {currentTest.referenceRanges.turbidity.normal}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-400">Color</p>
              <p className="text-lg font-medium capitalize">{currentTest.color.replace('_', ' ')}</p>
            </div>
          </div>
        </div>

        {/* Status and Health Implications */}
        <div className="bg-gray-700/50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-orange-400">Status Assessment</h3>
          <div className="space-y-2">
            <p className={`text-lg font-bold ${getStatusColor(currentTest.status)}`}>
              {currentTest.status.toUpperCase()}
            </p>
            <div className="space-y-1">
              {currentTest.healthImplications.map((implication, index) => (
                <p key={index} className="text-sm text-gray-300">{implication}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Risk Factors */}
        <div className="bg-gray-700/50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-orange-400">Risk Factors</h3>
          <ul className="list-disc list-inside space-y-1">
            {currentTest.riskFactors.map((factor, index) => (
              <li key={index} className="text-sm text-gray-300">{factor}</li>
            ))}
          </ul>
        </div>

        {/* Recommendations */}
        <div className="bg-gray-700/50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-orange-400">Recommendations</h3>
          <ul className="list-disc list-inside space-y-1">
            {currentTest.recommendation.map((rec, index) => (
              <li key={index} className="text-sm text-gray-300">{rec}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default TestResult;