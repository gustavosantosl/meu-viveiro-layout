import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  Package,
  BarChart3,
  DollarSign,
  Users,
  FileText,
  CheckSquare,
} from "lucide-react";
import { ShrimpIcon } from "@/components/icons/ShrimpIcon";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Fazenda", url: "/fazenda", icon: Home },
  { title: "Cultivo", url: "/cultivo", icon: ShrimpIcon },
  { title: "Estoque", url: "/estoque", icon: Package },
  { title: "Coleta de Dados", url: "/coleta-dados", icon: BarChart3 },
  { title: "Financeiro", url: "/financeiro", icon: DollarSign },
  { title: "Funcionários", url: "/funcionarios", icon: Users },
  { title: "Tarefas", url: "/tarefas", icon: CheckSquare },
  { title: "Relatórios", url: "/relatorios", icon: FileText },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium" 
      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground";

  return (
    <Sidebar
      className={`${collapsed ? "w-16" : "w-64"} bg-sidebar border-sidebar-border`}
      collapsible="icon"
    >
      <SidebarContent className="bg-sidebar">
        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="text-sidebar-foreground/70 text-xs uppercase tracking-wider mb-4">
            {!collapsed && "Navegação"}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-11">
                    <NavLink 
                      to={item.url} 
                      end 
                      className={getNavCls}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && (
                        <span className="ml-3 text-sm font-medium">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}