import { Outlet, createRootRoute, redirect } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { useCheckAuth } from '@/lib/hooks/useAuth'
import Header from '../components/Header'

export const Route = createRootRoute({
  component: () => {
    const { data: auth, isLoading } = useCheckAuth();

    // If we're loading the auth state, show a loading state
    if (isLoading) {
      return <div>Loading...</div>;
    }

    // If we have auth data, show the protected layout
    if (auth) {
      return (
        <div className="min-h-screen">
          <Header />
          <Outlet />
          <TanStackRouterDevtools />
        </div>
      );
    }

    // If no auth, show just the outlet (for login page)
    return (
      <div className="min-h-screen">
        <Outlet />
        <TanStackRouterDevtools />
      </div>
    );
  },
  beforeLoad: ({ context, location }) => {
    const token = localStorage.getItem('token');
    const isLoginPage = location.pathname === '/';

    // If there's no token and we're not on the login page, redirect to login
    if (!token && !isLoginPage) {
      throw redirect({
        to: '/',
      });
    }

    // If there's a token and we're on the login page, redirect to appropriate dashboard
    if (token && isLoginPage) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] as string;
      
      throw redirect({
        to: role.toLowerCase() === 'teacher' ? '/teacher/dashboard' : '/student/dashboard',
      });
    }

    return context;
  },
})
