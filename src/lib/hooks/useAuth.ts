import { useMutation, useQuery } from '@tanstack/react-query';
import api from '../api';
import type { UserRole } from '@/types';

interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    role: UserRole;
  };
}

function parseJwt(token: string) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => 
    '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  ).join(''));
  return JSON.parse(jsonPayload);
}

export function useCheckAuth() {
  return useQuery({
    queryKey: ['auth'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      try {
        // Verify token is valid by making a request to a protected endpoint
        const { data } = await api.get('/Account/me');
        const decodedToken = parseJwt(token);
        const role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] as UserRole;
        
        return {
          ...data,
          user: {
            ...data.user,
            role,
          },
        };
      } catch (error) {
        // If token is invalid, remove it
        localStorage.removeItem('token');
        throw error;
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { data } = await api.post<LoginResponse>('/Account/login', {
        username: credentials.username,
        password: credentials.password,
      });
      
      // Store the token
      localStorage.setItem('token', data.token);
      
      // Parse the JWT to get the role from claims
      const decodedToken = parseJwt(data.token);
      const role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] as UserRole;
      
      return {
        ...data,
        user: {
          ...data.user,
          role,
        },
      };
    },
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      localStorage.removeItem('token');
      // You might want to call a logout endpoint here
    },
  });
} 