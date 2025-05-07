import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    const originalRequest = error.config;
    
    // Handle authentication errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Clear localStorage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // If not on login page already, redirect
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api; 