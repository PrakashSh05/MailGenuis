import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/api/v1/auth/login', { email, password });
    return response.data; // Returns ApiResponse<AuthResponse>
  },

  register: async (fullName, email, password) => {
    const response = await api.post('/api/v1/auth/register', { fullName, email, password });
    return response.data; // Returns ApiResponse<AuthResponse>
  },

  logout: async () => {
    try {
      const response = await api.post('/api/v1/auth/logout');
      return response.data;
    } catch (e) {
      console.error('Logout API failed:', e);
      return null;
    }
  },

  refreshSession: async () => {
    const response = await api.get('/api/v1/profile');
    return response.data; // Returns ApiResponse<ProfileResponse>
  },

  getCurrentUser: () => {
    try {
      const user = sessionStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }
};

export default authService;
