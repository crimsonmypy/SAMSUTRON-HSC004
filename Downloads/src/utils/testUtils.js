// utils/testUtils.js
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const validateTestData = (data) => {
  const { ph, turbidity, color } = data;
  
  if (ph < 0 || ph > 14) {
    throw new Error('pH must be between 0 and 14');
  }
  
  if (turbidity < 0 || turbidity > 100) {
    throw new Error('Turbidity must be between 0 and 100');
  }
  
  if (!color) {
    throw new Error('Color must be specified');
  }
  
  return true;
};

export const getStatusColor = (status) => {
  const colors = {
    healthy: '#10B981',
    normal: '#3B82F6',
    anomaly: '#F59E0B',
    'consult a doctor': '#F97316',
    critical: '#EF4444'
  };
  return colors[status] || '#FFFFFF';
};