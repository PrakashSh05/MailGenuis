import api from './api';

export const profileService = {
  getProfile: async () => {
    const response = await api.get('/api/v1/profile');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put('/api/v1/profile', data);
    return response.data;
  },

  changePassword: async (data) => {
    const response = await api.put('/api/v1/profile/password', data);
    return response.data;
  },

  updateSettings: async (data) => {
    const response = await api.put('/api/v1/profile/settings', data);
    return response.data;
  }
};

export default profileService;
