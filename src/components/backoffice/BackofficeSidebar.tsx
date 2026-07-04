import { LayoutDashboard, ShoppingBag, GraduationCap, Newspaper, Image, LayoutGrid, Users, LogOut } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/hooks/useAuth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import logoMenu from "@/assets/logo-menu.svg";

const menuItems = [
  { title: "Dashboard", url: "/backoffice", icon: LayoutDashboard },
  { title: "Tienda", url: "/backoffice/catalogo", icon: ShoppingBag },
  { title: "Clases", url: "/backoffice/clases", icon: GraduationCap },
  { title: "Novedades", url: "/backoffice/novedades", icon: Newspaper },
  { title: "Imágenes", url: "/backoffice/imagenes", icon: Image },
  { title: "Servicios Home", url: "/backoffice/servicios-home", icon: LayoutGrid },
];

const adminItems = [
  { title: "Usuarios", url: "/backoffice/usuarios", icon: Users },
];

export function BackofficeSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { hasRole, signOut, user } = useAuth();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="p-4 flex justify-center">
          {!collapsed && <img src={logoMenu} alt="FA Pottery" className="h-10" />}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Gestión</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/backoffice"}
                      className="hover:bg-sidebar-accent/50"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {hasRole("admin") && (
          <SidebarGroup>
            <SidebarGroupLabel>Administración</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className="hover:bg-sidebar-accent/50"
                        activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-4">
        {!collapsed && user && (
          <p className="text-xs text-sidebar-foreground/60 truncate mb-2">{user.email}</p>
        )}
        <SidebarMenuButton onClick={signOut} className="hover:bg-sidebar-accent/50 w-full">
          <LogOut className="mr-2 h-4 w-4" />
          {!collapsed && <span>Cerrar sesión</span>}
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
