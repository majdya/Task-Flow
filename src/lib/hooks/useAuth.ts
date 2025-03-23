import { useMutation, useQuery } from '@tanstack/react-query';
import api from '../api';
import type { UserRole } from '@/types';
import { useNavigate } from '@tanstack/react-router';

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

interface AuthUser {
  id: string;
  username: string;
  role: UserRole;
}

function parseJwt(token: string): { role: string; exp: number } | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => 
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''));
    const parsed = JSON.parse(jsonPayload);
    return {
      role: parsed['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
      exp: parsed.exp
    };
  } catch (error) {
    console.error('Error parsing JWT:', error);
    return null;
  }
}

function isTokenExpired(exp: number): boolean {
  if (!exp) return true;
  const currentTime = Math.floor(Date.now() / 1000);
  return currentTime >= exp;
}

export function useCheckAuth() {
  return useQuery({
    queryKey: ['auth'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const decoded = parseJwt(token);
      if (!decoded || isTokenExpired(decoded.exp)) {
        localStorage.removeItem('token');
        throw new Error('Token expired');
      }

      try {
        const { data } = await api.get<AuthUser>('/Account/me');
        return {
          user: {
            ...data,
            role: decoded.role as UserRole,
          }
        };
      } catch (error) {
        localStorage.removeItem('token');
        throw error;
      }
    },
    retry: 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
  });
}

export function useLogin() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { data } = await api.post<LoginResponse>('/Account/login', credentials);
      
      const decoded = parseJwt(data.token);
      if (!decoded || isTokenExpired(decoded.exp)) {
        throw new Error('Invalid token received');
      }

      localStorage.setItem('token', data.token);
      
      return {
        user: {
          ...data.user,
          role: decoded.role as UserRole,
        }
      };
    },
    onSuccess: (data) => {
      const dashboardPath = data.user.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard';
      navigate({ to: dashboardPath });
    },
  });
}

export function useLogout() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      localStorage.removeItem('token');
    },
    onSuccess: () => {
      navigate({ to: '/' });
    }
  });
} 