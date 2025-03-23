import { createFileRoute } from "@tanstack/react-router";
import { LoginForm } from '../components/auth/LoginForm';
import type { UserRole } from '../types';
import { useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute("/")({
  component: IndexPage,
});

function IndexPage() {
  const navigate = useNavigate();

  const handleLogin = (username: string, password: string, role: UserRole) => {
    console.log('Login successful:', { username, role });
    console.log('Role type check:', { 
      role, 
      isTeacher: role === 'teacher',
      roleType: typeof role,
      comparison: role.toLowerCase() === 'teacher'
    });
    
    if (role.toLowerCase() === 'teacher') {
      console.log('Navigating to teacher dashboard');
      navigate({ to: '/teacher/dashboard' });
    } else {
      console.log('Navigating to student dashboard');
      navigate({ to: '/student/dashboard' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <LoginForm onSubmit={handleLogin} />
    </div>
  );
}
