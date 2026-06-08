import heroBackground from "@/assets/home-hero-background.jpg";

const HeroSection = () => {
  return (
    <section className="relative h-[85vh] md:h-[90vh] flex flex-col justify-end" aria-label="Presentación">
      {/* Background image — decorative */}
      <div className="absolute inset-0" aria-hidden="true">
        <img src={heroBackground} alt="" className="w-full h-full object-cover" />
      </div>

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
        <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-muted-foreground font-sans font-medium">
          Una mirada, un oficio, una forma de hacer.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
