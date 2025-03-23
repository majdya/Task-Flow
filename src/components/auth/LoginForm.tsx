import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { UserRole } from '@/types';
import { useLogin } from '@/lib/hooks/useAuth';
import { toast } from 'sonner';

interface LoginFormProps {
  onSubmit: (username: string, password: string, role: UserRole) => void;
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const login = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login.mutateAsync({ username, password });
      console.log('Login response:', response); // Debug log
      console.log('User role:', response.user.role); // Debug log
      onSubmit(username, password, response.user.role);
    } catch (error) {
      console.error('Login error:', error); // Debug log
      toast.error('Login failed. Please check your credentials.');
    }
  };

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Welcome to TaskFlow</CardTitle>
        <CardDescription>Sign in to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              Username
            </label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={login.isPending}>
            {login.isPending ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 