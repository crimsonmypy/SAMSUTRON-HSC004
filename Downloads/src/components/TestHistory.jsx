// components/TestHistory.jsx
import React, { useContext } from 'react';
import { TestContext } from '../context/TestContext';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function TestHistory() {
  const { testHistory } = useContext(TestContext);

  const chartData = {
    labels: testHistory.map(test => new Date(test.date).toLocaleDateString()),
    datasets: [
      {
        label: 'pH Level',
        data: testHistory.map(test => test.ph),
        borderColor: '#f97316',
        tension: 0.1
      },
      {
        label: 'Turbidity',
        data: testHistory.map(test => test.turbidity),
        borderColor: '#3b82f6',
        tension: 0.1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'white'
        }
      }
    },
    scales: {
      y: {
        ticks: { color: 'white' }
      },
      x: {
        ticks: { color: 'white' }
      }
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-orange-500">Test History</h2>
      <div className="mb-6">
        <Line data={chartData} options={chartOptions} />
      </div>
      <div className="space-y-4">
        {testHistory.map((test, index) => (
          <div key={index} className="bg-gray-700 p-4 rounded">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">
                {new Date(test.date).toLocaleString()}
              </span>
              <span className={`text-sm font-semibold ${
                test.status === 'healthy' ? 'text-green-500' :
                test.status === 'normal' ? 'text-blue-500' :
                test.status === 'anomaly' ? 'text-yellow-500' :
                test.status === 'consult a doctor' ? 'text-orange-500' :
                'text-red-500'
              }`}>
                {test.status.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TestHistory;