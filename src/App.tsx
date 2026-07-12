import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useParams, Navigate } from "react-router-dom";
import { localizePath } from "@/components/LocalizedLink";
import { AuthProvider } from "@/hooks/useAuth";
import { initGTM } from "@/lib/analytics";
import { getLanguageFromPathname } from "@/i18n";
import SkipLink from "@/components/SkipLink";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Index from "./pages/Index";
import PropuestaEducativa from "./pages/PropuestaEducativa";
import Produccion from "./pages/Produccion";
import Colaboraciones from "./pages/Colaboraciones";
import FaLanding from "./pages/FaLanding";
import BreakfastPaint from "./pages/BreakfastPaint";
import Clases from "./pages/Clases";
import ClaseDetalle from "./pages/ClaseDetalle";
import Catalogo from "./pages/Catalogo";
import PiezaDetalle from "./pages/PiezaDetalle";
import Novedades from "./pages/Novedades";
import NovedadDetalle from "./pages/NovedadDetalle";
import NotFound from "./pages/NotFound";
import BackofficeLogin from "./pages/BackofficeLogin";
import BackofficeLayout from "./components/backoffice/BackofficeLayout";
import Dashboard from "./pages/backoffice/Dashboard";
import CatalogManager from "./pages/backoffice/CatalogManager";
import ClassManager from "./pages/backoffice/ClassManager";
import NewsManager from "./pages/backoffice/NewsManager";
import SiteImagesManager from "./pages/backoffice/SiteImagesManager";
import HomeServicesManager from "./pages/backoffice/HomeServicesManager";
import Placeholder from "./pages/backoffice/Placeholder";

const queryClient = new QueryClient();

initGTM();

const PublicShell = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    <SkipLink />
    <Header />
    <main id="main-content" className="flex-1" role="main">
      {children}
    </main>
    <Footer />
    <WhatsAppButton />
  </div>
);

// Redirige las URLs viejas de /clases a /actividades sin perder el idioma activo,
// para no romper links guardados ni el posicionamiento que ya tenían.
const RedirectToActividades = () => {
  const location = useLocation();
  return <Navigate to={localizePath("/actividades", location.pathname)} replace />;
};

const RedirectToActividadDetalle = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  return <Navigate to={localizePath(`/actividades/${id}`, location.pathname)} replace />;
};

const PublicPages = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/propuesta-educativa" element={<PropuestaEducativa />} />
    <Route path="/propuestaeducativa" element={<PropuestaEducativa />} />
    <Route path="/produccion" element={<Produccion />} />
    <Route path="/colaboraciones" element={<Colaboraciones />} />
    <Route path="/tienda" element={<Catalogo />} />
    <Route path="/tienda/:id" element={<PiezaDetalle />} />
    <Route path="/catalogo" element={<Catalogo />} />
    <Route path="/catalogo/:id" element={<PiezaDetalle />} />
    <Route path="/fa" element={<FaLanding />} />
    <Route path="/breakfast-and-paint" element={<BreakfastPaint />} />
    <Route path="/actividades" element={<Clases />} />
    <Route path="/actividades/:id" element={<ClaseDetalle />} />
    <Route path="/clases" element={<RedirectToActividades />} />
    <Route path="/clases/:id" element={<RedirectToActividadDetalle />} />
    <Route path="/novedades" element={<Novedades />} />
    <Route path="/novedades/:id" element={<NovedadDetalle />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const AppRoutes = () => {
  const location = useLocation();
  const { i18n } = useTranslation();
  const isBackoffice = location.pathname.startsWith("/backoffice");

  useEffect(() => {
    const lang = getLanguageFromPathname(location.pathname);
    if (i18n.language !== lang) i18n.changeLanguage(lang);
    document.documentElement.lang = lang;
  }, [location.pathname, i18n]);

  return isBackoffice ? (
    <Routes>
      <Route path="/backoffice/login" element={<BackofficeLogin />} />
      <Route path="/backoffice" element={<BackofficeLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="catalogo" element={<CatalogManager />} />
        <Route path="clases" element={<ClassManager />} />
        <Route path="novedades" element={<NewsManager />} />
        <Route path="imagenes" element={<SiteImagesManager />} />
        <Route path="servicios-home" element={<HomeServicesManager />} />
        <Route path="usuarios" element={<Placeholder title="Usuarios" description="Gestión de usuarios y roles. Próximamente." />} />
      </Route>
    </Routes>
  ) : (
    <PublicShell>
      <Routes>
        <Route path="/en/*" element={<PublicPages />} />
        <Route path="/*" element={<PublicPages />} />
      </Routes>
    </PublicShell>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
