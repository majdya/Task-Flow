import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { useLogout } from "@/lib/hooks/useAuth";
import { LayoutDashboard, LogOut } from "lucide-react";

export function Header() {
  const navigate = useNavigate();
  const logout = useLogout();

  const handleLogout = async () => {
    await logout.mutateAsync();
  };

  const handleDashboard = () => {
    navigate({ to: '/student/dashboard' });
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">TaskFlow</h1>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={handleDashboard}
              className="flex items-center gap-2"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="flex items-center gap-2"
              disabled={logout.isPending}
            >
              <LogOut className="h-4 w-4" />
              {logout.isPending ? 'Logging out...' : 'Logout'}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
