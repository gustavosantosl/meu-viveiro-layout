import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Logo } from "@/components/icons/Logo";

const Header = () => {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6 shadow-soft">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <Logo variant="light" size="md" />
      </div>

      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarFallback className="bg-primary text-primary-foreground">
            U
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default Header;