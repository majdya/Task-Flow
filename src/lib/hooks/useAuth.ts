import { useMutation, useQuery } from '@tanstack/react-query';
import api from '../api';
import type { UserRole } from '@/types';
import { useNavigate } from '@tanstack/react-router';

const AUTH_STORAGE_KEY = 'token';
const ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
const STALE_TIME = 1000 * 60 * 5; // 5 minutes

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

class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

function parseJwt(token: string): { role: string; exp: number } | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) {
      throw new AuthError('Invalid token format');
    }

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => 
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''));
    const parsed = JSON.parse(jsonPayload);

    if (!parsed[ROLE_CLAIM] || !parsed.exp) {
      throw new AuthError('Missing required claims in token');
    }

    return {
      role: parsed[ROLE_CLAIM],
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

function clearToken() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

function setToken(token: string) {
  localStorage.setItem(AUTH_STORAGE_KEY, token);
}

function getToken(): string | null {
  return localStorage.getItem(AUTH_STORAGE_KEY);
}

export function useCheckAuth() {
  return useQuery({
    queryKey: ['auth'],
    queryFn: async () => {
      const token = getToken();
      if (!token) {
        throw new AuthError('No token found');
      }

      const decoded = parseJwt(token);
      if (!decoded || isTokenExpired(decoded.exp)) {
        clearToken();
        throw new AuthError('Token expired');
      }

      return {
        user: {
          role: decoded.role,
        }
      };
    },
    retry: false,
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
        throw new AuthError('Invalid token received');
      }

      setToken(data.token);
      
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