import { Link } from "react-router-dom";
import logoFooter from "@/assets/logo-footer.svg";

const Footer = () => {
  return (
    <footer className="bg-background text-foreground" aria-label="Pie de página">
      {/* Logo */}
      <div className="container mx-auto px-6 pt-16 pb-4">
        <div className="mb-12">
          <img src={logoFooter} alt="" className="h-[5rem]" aria-hidden="true" />
        </div>

        {/* Divider */}
        <hr className="border-border mb-10" />

        {/* 4-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12">
          {/* Brand */}
          <div>
            <p className="text-sm font-sans font-semibold mb-2">Diseño y cerámica de autor, creada por Florencia Álvarez</p>
            <p className="text-sm leading-relaxed text-muted-foreground font-sans">
              Producción artesanal, piezas funcionales y una práctica que une diseño, oficio y experiencia docente.
            </p>
          </div>

          {/* Málaga */}
          <div>
            <h2 className="text-sm font-sans font-semibold mb-2">
              FA POTTERY Studio
            </h2>
            <p className="text-sm text-muted-foreground font-sans mb-1">Málaga, España</p>
            <a
              href="https://wa.me/+34681816030"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground font-sans underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Whatsapp: +34 6 81 81 60 30
            </a>
          </div>

          {/* Buenos Aires */}
          <div>
            <h2 className="text-sm font-sans font-semibold mb-2">
              KANSO Studio
            </h2>
            <p className="text-sm text-muted-foreground font-sans mb-1">Buenos Aires, Argentina</p>
            <a
              href="https://wa.me/+5491121788786"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground font-sans underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Whatsapp: +54 9 11 21 78 87 86
            </a>
          </div>

          {/* Nav Links */}
          <nav aria-label="Enlaces del pie de página" className="flex flex-col gap-1.5">
            {[
              { label: "Inicio", path: "/" },
              { label: "Propuesta educativa", path: "/propuesta-educativa" },
              { label: "Producción", path: "/produccion" },
              { label: "Tienda", path: "/tienda" },
              { label: "Colaboraciones", path: "/colaboraciones" },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-sm text-muted-foreground hover:text-foreground font-sans focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {item.label}
              </Link>
            ))}
            <a
              href="https://wa.me/+34681816030"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground font-sans focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              ¡Apúntate!
            </a>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-6 pb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground font-sans">
            © {new Date().getFullYear()} FA Pottery Studio · Ceramics Design · Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            {/* Instagram */}
            <a
              href="https://instagram.com/fapottery"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              aria-label="Instagram de FA Pottery"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            {/* Facebook */}
            <a
              href="https://facebook.com/fapottery"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              aria-label="Facebook de FA Pottery"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
