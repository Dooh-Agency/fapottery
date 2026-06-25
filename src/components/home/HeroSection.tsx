import { Link } from "react-router-dom";
import heroBackground from "@/assets/home-hero-background.jpg";

const HeroSection = () => {
  return (
    <section className="relative h-[85vh] md:h-[90vh] flex flex-col justify-end" aria-label="Presentación">
      {/* Background image — decorative */}
      <div className="absolute inset-0" aria-hidden="true">
        <img src={heroBackground} alt="" className="w-full h-full object-cover" />
      </div>

      {/* Subtle gradient overlay for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" aria-hidden="true" />

      <div className="container mx-auto px-6 relative z-10 pb-14 md:pb-16 lg:pb-20">
        {/* Main heading */}
        <h1
          className="text-[2.2rem] sm:text-5xl md:text-6xl lg:text-[4.2rem] xl:text-[4.8rem] font-serif font-normal text-foreground text-left leading-[1.08] max-w-2xl tracking-[-0.01em] mb-3 md:mb-5"
          style={{ fontVariationSettings: "'opsz' 96", fontWeight: 400 }}
        >
          Cerámica desde<br />una mirada{" "}
          <em className="italic">personal</em>
        </h1>

        {/* Subtitle */}
        <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-muted-foreground font-sans font-medium mb-8 md:mb-10">
          Clases · Piezas · Colaboraciones · Málaga
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Link
            to="/clases"
            className="inline-block border border-foreground bg-foreground text-primary-foreground font-sans text-xs tracking-[0.2em] uppercase px-8 py-4 hover:bg-transparent hover:text-foreground transition-colors duration-300 text-center"
          >
            Ver clases disponibles
          </Link>
          <Link
            to="/tienda"
            className="inline-block border border-foreground text-foreground font-sans text-xs tracking-[0.2em] uppercase px-8 py-4 hover:bg-foreground hover:text-primary-foreground transition-colors duration-300 text-center bg-background/40 backdrop-blur-sm"
          >
            Explorar tienda
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
