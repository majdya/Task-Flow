import { Navigation } from './Navigation';
import type { UserRole } from '@/types';

interface LayoutProps {
  children: React.ReactNode;
  role: UserRole;
  onLogout: () => void;
}

export function Layout({ children, role, onLogout }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation role={role} onLogout={onLogout} />
      <main>{children}</main>
    </div>
  );
} 