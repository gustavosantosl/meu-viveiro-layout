import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";

const Header = () => {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6 shadow-soft">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary text-white font-bold">
            MV
          </div>
          <h1 className="text-xl font-bold text-foreground">Meu Viveiro</h1>
        </div>
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