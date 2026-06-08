import { Navigate, Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { BackofficeSidebar } from "./BackofficeSidebar";
import { useAuth } from "@/hooks/useAuth";

const BackofficeLayout = () => {
  const { user, loading, roles } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground font-sans text-sm">Cargando...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/backoffice/login" replace />;
  }

  // Only admin or colaborador can access
  if (roles.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center space-y-2">
          <p className="font-serif text-lg">Sin acceso</p>
          <p className="text-muted-foreground font-sans text-sm">
            Tu cuenta no tiene permisos para acceder al backoffice.
          </p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <BackofficeSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-12 flex items-center border-b border-border px-4">
            <SidebarTrigger />
          </header>
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default BackofficeLayout;
