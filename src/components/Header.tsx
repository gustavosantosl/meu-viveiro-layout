import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/icons/Logo";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User } from "lucide-react";

const Header = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6 shadow-soft">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <Logo variant="light" size="md" />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User size={16} />
          <span className="hidden sm:inline">{user?.email}</span>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={signOut}
          className="gap-2"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Sair</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;