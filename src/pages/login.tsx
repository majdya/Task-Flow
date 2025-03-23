import { LoginForm } from '@/components/auth/LoginForm';
import { Toaster } from 'sonner';
import type { UserRole } from '@/types';

export default function LoginPage() {
  const handleLogin = async (email: string, password: string, role: UserRole) => {
    try {
      // TODO: Implement actual authentication logic
      console.log('Login attempt:', { email, role });
      // For now, we'll just redirect based on role
      window.location.href = role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard';
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <LoginForm onSubmit={handleLogin} />
      <Toaster />
    </div>
  );
} 