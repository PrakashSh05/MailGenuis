import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Inject JWT token into headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Catch 401 unauthorized errors and normalize API errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      
      // Auto logout on 401 Unauthorized
      if (status === 401) {
        window.dispatchEvent(new Event('auth-logout'));
      }
      
      // Extract custom backend ApiError envelope structure if present
      const apiError = error.response.data;
      if (apiError && apiError.error) {
        return Promise.reject({
          message: apiError.error.message || 'An error occurred',
          status: status,
          details: apiError.error.details || null,
          timestamp: apiError.error.timestamp || null,
          path: apiError.error.path || null,
          raw: error
        });
      }
    }
    
    // Fallback for network errors or unformatted responses
    return Promise.reject({
      message: error.message || 'Network error occurred',
      status: error.response?.status || 500,
      details: null,
      raw: error
    });
  }
);

export default api;
