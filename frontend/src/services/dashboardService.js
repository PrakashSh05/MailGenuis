import api from './api';

export const dashboardService = {
  getDashboardSummary: async () => {
    const response = await api.get('/api/v1/dashboard');
    return response.data;
  },

  getDashboardActivity: async () => {
    const response = await api.get('/api/v1/dashboard/activity');
    return response.data;
  },

  getDashboardStatistics: async () => {
    const response = await api.get('/api/v1/dashboard/statistics');
    return response.data;
  }
};

export default dashboardService;
