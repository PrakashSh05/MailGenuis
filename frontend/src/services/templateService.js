import api from './api';

export const templateService = {
  getLibrary: async () => {
    const response = await api.get('/api/v1/templates/library');
    return response.data;
  },

  getTemplates: async (params) => {
    const response = await api.get('/api/v1/templates', { params });
    return response.data;
  },

  createTemplate: async (data) => {
    const response = await api.post('/api/v1/templates', data);
    return response.data;
  },

  updateTemplate: async (id, data) => {
    const response = await api.put(`/api/v1/templates/${id}`, data);
    return response.data;
  },

  deleteTemplate: async (id) => {
    const response = await api.delete(`/api/v1/templates/${id}`);
    return response.data;
  }
};

export default templateService;
