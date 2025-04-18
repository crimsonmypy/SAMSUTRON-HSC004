// utils/mockApi.js
const analyzeUrine = (data) => {
  const { ph, turbidity, color } = data;
  
  // Reference ranges
  const REFERENCE_RANGES = {
    ph: { min: 6.0, max: 7.5, ideal: 6.5 },
    turbidity: { normal: '< 20', elevated: '20-40', high: '> 40' },
    color: ['pale_yellow', 'yellow']
  };

  // Analysis logic with confidence scores
  let status = 'normal';
  let recommendation = [];
  let confidence = 0.9;
  let healthImplications = [];
  let riskFactors = [];

  // pH Analysis
  if (ph < 4.5 || ph > 8) {
    status = 'critical';
    confidence = 0.95;
    healthImplications.push(
      ph < 4.5 ? 'Extremely acidic urine may indicate metabolic acidosis or kidney problems' :
      'Highly alkaline urine may suggest urinary tract infection or kidney stones'
    );
    riskFactors.push('Severe pH imbalance', 'Possible underlying medical condition');
    recommendation.push('Seek immediate medical attention', 'Complete blood work recommended');
  } else if (ph < 5 || ph > 7.5) {
    status = 'consult a doctor';
    confidence = 0.85;
    healthImplications.push(
      ph < 5 ? 'Acidic urine may indicate diet issues or mild metabolic disorders' :
      'Alkaline urine could suggest bacterial infection or diet influence'
    );
    riskFactors.push('pH outside normal range', 'Dietary factors');
    recommendation.push('Schedule a medical consultation', 'Monitor fluid intake');
  } else if (ph < 5.5 || ph > 7) {
    status = 'anomaly';
    confidence = 0.8;
    healthImplications.push('Slight pH imbalance may affect mineral absorption');
    riskFactors.push('Minor pH deviation', 'Possible dietary influence');
    recommendation.push('Adjust diet', 'Increase water intake');
  } else if (ph >= 6 && ph <= 6.5) {
    status = 'healthy';
    confidence = 0.95;
    healthImplications.push('Optimal pH for mineral balance and kidney function');
    recommendation.push('Maintain current healthy habits');
  }

  // Turbidity Analysis
  if (turbidity > 80) {
    status = 'critical';
    confidence = Math.max(confidence, 0.9);
    healthImplications.push('High turbidity may indicate severe infection or kidney issues');
    riskFactors.push('Possible urinary tract infection', 'Kidney stones');
    recommendation.push('Emergency medical evaluation needed');
  } else if (turbidity > 60) {
    status = Math.min(status === 'critical' ? 'critical' : 'consult a doctor');
    confidence = Math.max(confidence, 0.85);
    healthImplications.push('Elevated turbidity suggests possible infection or inflammation');
    riskFactors.push('Moderate infection risk', 'Dehydration');
    recommendation.push('Consult healthcare provider', 'Increase fluid intake');
  } else if (turbidity > 40) {
    status = Math.min(status === 'critical' ? 'critical' : 'anomaly');
    confidence = Math.max(confidence, 0.8);
    healthImplications.push('Mild turbidity elevation may indicate minor inflammation');
    riskFactors.push('Mild inflammation', 'Possible dehydration');
    recommendation.push('Monitor symptoms', 'Drink more water');
  }

  return {
    status,
    confidence: Math.round(confidence * 100),
    recommendation: recommendation.filter((item, index) => recommendation.indexOf(item) === index),
    healthImplications: healthImplications.filter((item, index) => healthImplications.indexOf(item) === index),
    riskFactors: riskFactors.filter((item, index) => riskFactors.indexOf(item) === index),
    referenceRanges: REFERENCE_RANGES,
    timestamp: new Date().toISOString()
  };
};

export const api = {
  analyzeTest: async (testData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return analyzeUrine(testData);
  }
};