import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { useCheckAuth } from '@/lib/hooks/useAuth'
import Header from '../components/Header'

export const Route = createRootRoute({
  component: () => {
    const { data: auth, isLoading } = useCheckAuth();
    const isLoginPage = window.location.pathname === '/';

    if (isLoading) {
      return <div>Loading...</div>;
    }

    // Show protected layout for authenticated users
    if (auth) {
      return (
        <div className="min-h-screen">
          <Header />
          <Outlet />
          <TanStackRouterDevtools />
        </div>
      );
    }

    // Show login page for unauthenticated users
    if (!auth && !isLoginPage) {
      window.location.href = '/';
      return null;
    }

    return (
      <div className="min-h-screen">
        <Outlet />
        <TanStackRouterDevtools />
      </div>
    );
  }
});
