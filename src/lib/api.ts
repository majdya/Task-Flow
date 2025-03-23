import axios from 'axios';

const AUTH_STORAGE_KEY = 'token';

const api = axios.create({
  baseURL: 'https://localhost:7071/api', // .NET backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AUTH_STORAGE_KEY);
    if (token) {
      console.log('Adding token to request:', token.substring(0, 20) + '...');
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log('No token found for request');
    }
    console.log('Making request to:', config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('Response received from:', response.config.url);
    console.log('Response status:', response.status);
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    if (error.response?.status === 401) {
      console.log('Unauthorized request, clearing token');
      localStorage.removeItem(AUTH_STORAGE_KEY);
      // Only redirect if we're not already on the login page
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default api; 