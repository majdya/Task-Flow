import { Button } from '@/components/ui/button';
import type { UserRole } from '@/types';

interface NavigationProps {
  role: UserRole;
  onLogout: () => void;
}

export function Navigation({ role, onLogout }: NavigationProps) {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <a href="/" className="text-xl font-bold">
              TaskFlow
            </a>
            {role === 'teacher' ? (
              <a href="/teacher/dashboard" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </a>
            ) : (
              <a href="/student/dashboard" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </a>
            )}
          </div>
          <Button variant="outline" onClick={onLogout}>
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
} 