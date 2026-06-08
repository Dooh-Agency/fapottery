const ManifiestoSection = () => {
  return (
    <section className="relative py-32 md:py-44 overflow-hidden" aria-label="Manifiesto">
      {/* Background video — decorative, respects reduced motion */}
      <video
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover motion-reduce:hidden"
      >
        <source src="/videos/manifiesto-background.mp4" type="video/mp4" />
      </video>
      {/* Fallback for reduced motion */}
      <div className="absolute inset-0 bg-foreground/80 hidden motion-reduce:block" />
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-foreground/70 motion-reduce:bg-foreground/85" />

      <div className="container mx-auto px-6 relative z-10 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-primary-foreground/70 font-sans mb-8">
          Manifiesto
        </p>
        <blockquote className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-primary-foreground leading-snug max-w-4xl mx-auto">
          Una práctica donde cada objeto refleja una forma de mirar, hacer y enseñar cerámica.
        </blockquote>
      </div>
    </section>
  );
};

export default ManifiestoSection;
