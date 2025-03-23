import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7071/api', // Adjust this to your .NET backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('Request config:', {
    url: config.url,
    method: config.method,
    headers: config.headers,
  });
  return config;
}, (error) => {
  console.error('Request interceptor error:', error);
  return Promise.reject(error);
});

// Add response interceptor for handling auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token might be expired or invalid
      console.error('Authentication error:', error);
      localStorage.removeItem('token'); // Clear invalid token
      window.location.href = '/'; // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default api; 