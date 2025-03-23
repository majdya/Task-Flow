import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7071/api', // Adjust this to your .NET backend URL
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // This is important for CORS
});

// Add request interceptor for authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api; 