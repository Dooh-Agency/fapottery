import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X } from "lucide-react";
import { Link, localizePath } from "@/components/LocalizedLink";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import logoMenu from "@/assets/logo-menu.svg";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    { label: t("nav.clases"), path: "/clases" },
    { label: t("nav.propuestaEducativaCorta"), path: "/propuesta-educativa" },
    { label: t("nav.produccion"), path: "/produccion" },
    { label: t("nav.tienda"), path: "/tienda" },
    { label: t("nav.giftCard"), path: "/bono-regalo" },
    { label: t("nav.colaboracionesCorta"), path: "/colaboraciones" },
    { label: t("nav.novedades"), path: "/novedades" },
  ];

  const isActive = (path: string) => location.pathname === localizePath(path, location.pathname);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Trap focus doesn't apply here since it's a simple menu, but prevent body scroll
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center" aria-label={t("nav.inicioAria")}>
          <img src={logoMenu} alt="" className="h-[5rem]" aria-hidden="true" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8" aria-label={t("nav.navegacionPrincipal")}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-xs uppercase tracking-[0.15em] font-sans font-medium transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                isActive(item.path)
                  ? "text-foreground underline underline-offset-4 decoration-[1px]"
                  : "text-muted-foreground"
              }`}
              aria-current={isActive(item.path) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA + Language + Mobile Toggle */}
        <div className="flex items-center gap-4">
          <LanguageSwitcher className="hidden sm:flex" />
          <Link
            to="/clases"
            className="hidden sm:inline-block border border-foreground bg-foreground text-primary-foreground text-xs uppercase tracking-[0.15em] font-sans font-medium px-5 py-2.5 hover:bg-transparent hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {t("nav.reservarClase")}
          </Link>
          <button
            className="lg:hidden text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? t("nav.cerrarMenu") : t("nav.abrirMenu")}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
          >
            {mobileOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <nav
          id="mobile-nav"
          className="lg:hidden border-t border-border bg-background px-6 py-6 flex flex-col gap-4"
          aria-label={t("nav.navegacionPrincipal")}
        >
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`text-sm uppercase tracking-[0.15em] font-sans font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                isActive(item.path)
                  ? "text-foreground underline underline-offset-4 decoration-[1px]"
                  : "text-muted-foreground"
              }`}
              aria-current={isActive(item.path) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
          <LanguageSwitcher className="mt-2" />
          <Link
            to="/clases"
            className="sm:hidden border border-foreground bg-foreground text-primary-foreground text-sm uppercase tracking-[0.15em] font-sans font-medium px-5 py-2.5 text-center mt-2 hover:bg-transparent hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {t("nav.reservarClase")}
          </Link>
        </nav>
      )}
    </header>
  );
};

export default Header;
