import { Outlet, createRootRoute, useNavigate } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { useCheckAuth } from '@/lib/hooks/useAuth'
import { Header } from "@/components/Header"
import { useEffect } from 'react'

const LOGIN_PATH = '/';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const { data: auth, isLoading } = useCheckAuth();
  const navigate = useNavigate();
  const isLoginPage = window.location.pathname === LOGIN_PATH;

  useEffect(() => {
    if (!isLoading && !auth && !isLoginPage) {
      navigate({ to: LOGIN_PATH });
    }
  }, [auth, isLoading, isLoginPage, navigate]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!auth && !isLoginPage) {
    return null;
  }

  return (
    <div className="min-h-screen">
      {auth && <Header />}
      <Outlet />
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </div>
  );
}
