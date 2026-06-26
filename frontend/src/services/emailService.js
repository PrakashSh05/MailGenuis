import api from './api';

export const emailService = {
  generateEmail: async (data) => {
    const response = await api.post('/api/v1/emails/generate', data);
    return response.data;
  },

  applyAction: async (id, actionRequest) => {
    const response = await api.post(`/api/v1/emails/action`, actionRequest);
    // Since the backend Action endpoint might take the preview text in actionRequest rather than id in url path. 
    // Wait, the backend design from the prompt says `POST /api/v1/emails/action`. It doesn't have an {id} in the path!
    // The prompt says POST /emails/action.
    return response.data;
  },

  saveEmail: async (saveEmailRequest) => {
    const response = await api.post('/api/v1/emails', saveEmailRequest);
    return response.data;
  },

  getEmailHistory: async (params) => {
    const response = await api.get('/api/v1/emails', { params });
    return response.data;
  },

  getEmail: async (id) => {
    const response = await api.get(`/api/v1/emails/${id}`);
    return response.data;
  },

  toggleFavorite: async (id, isFavorite) => {
    const response = await api.patch(`/api/v1/emails/${id}/favorite`, { isFavorite });
    return response.data;
  },

  deleteEmail: async (id) => {
    const response = await api.delete(`/api/v1/emails/${id}`);
    return response.data;
  }
};

export default emailService;
