// components/TestForm.jsx
import React, { useState, useContext } from 'react';
import { TestContext } from '../context/TestContext';

function TestForm() {
  const { addTest } = useContext(TestContext);
  const [formData, setFormData] = useState({
    ph: '',
    turbidity: '',
    color: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addTest({
      ...formData,
      ph: parseFloat(formData.ph),
      turbidity: parseInt(formData.turbidity),
      date: new Date().toISOString()
    });
    setFormData({ ph: '', turbidity: '', color: '' });
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-orange-500">New Test</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-2">pH Level (0-14)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="14"
            required
            value={formData.ph}
            onChange={(e) => setFormData({ ...formData, ph: e.target.value })}
            className="w-full bg-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div>
          <label className="block text-sm mb-2">Turbidity Score (0-100)</label>
          <input
            type="number"
            min="0"
            max="100"
            required
            value={formData.turbidity}
            onChange={(e) => setFormData({ ...formData, turbidity: e.target.value })}
            className="w-full bg-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div>
          <label className="block text-sm mb-2">Color</label>
          <select
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            required
            className="w-full bg-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Select color</option>
            <option value="pale_yellow">Pale Yellow</option>
            <option value="yellow">Yellow</option>
            <option value="dark_yellow">Dark Yellow</option>
            <option value="amber">Amber</option>
            <option value="red">Red</option>
            <option value="other">Other</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition-colors"
        >
          Analyze Sample
        </button>
      </form>
    </div>
  );
}

export default TestForm;