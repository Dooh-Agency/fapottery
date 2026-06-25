import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logoMenu from "@/assets/logo-menu.svg";

const navItems = [
  { label: "CLASES", path: "/clases" },
  { label: "PROPUESTA EDUCATIVA", path: "/propuesta-educativa" },
  { label: "PRODUCCIÓN", path: "/produccion" },
  { label: "TIENDA", path: "/tienda" },
  { label: "COLABORACIONES", path: "/colaboraciones" },
  { label: "NOVEDADES", path: "/novedades" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

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
        <Link to="/" className="flex items-center" aria-label="FA Pottery Studio — Inicio">
          <img src={logoMenu} alt="" className="h-[5rem]" aria-hidden="true" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8" aria-label="Navegación principal">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-xs uppercase tracking-[0.15em] font-sans font-medium transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                location.pathname === item.path
                  ? "text-foreground underline underline-offset-4 decoration-[1px]"
                  : "text-muted-foreground"
              }`}
              aria-current={location.pathname === item.path ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA + Mobile Toggle */}
        <div className="flex items-center gap-4">
          <Link
            to="/clases"
            className="hidden sm:inline-block border border-foreground bg-foreground text-primary-foreground text-xs uppercase tracking-[0.15em] font-sans font-medium px-5 py-2.5 hover:bg-transparent hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Reservar clase
          </Link>
          <button
            className="lg:hidden text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
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
          aria-label="Navegación principal"
        >
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`text-sm uppercase tracking-[0.15em] font-sans font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                location.pathname === item.path
                  ? "text-foreground underline underline-offset-4 decoration-[1px]"
                  : "text-muted-foreground"
              }`}
              aria-current={location.pathname === item.path ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/clases"
            className="sm:hidden border border-foreground bg-foreground text-primary-foreground text-sm uppercase tracking-[0.15em] font-sans font-medium px-5 py-2.5 text-center mt-2 hover:bg-transparent hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Reservar clase
          </Link>
        </nav>
      )}
    </header>
  );
};

export default Header;
