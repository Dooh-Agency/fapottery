const testimonios = [
  {
    quote:
      "Las clases con Florencia cambiaron completamente mi relación con la cerámica. El grupo reducido hace que el aprendizaje sea muy personalizado y el espacio es increíble.",
    name: "Laura M.",
    context: "Alumna de clases regulares, Málaga",
  },
  {
    quote:
      "Organizamos un workshop de cerámica para el equipo y fue una experiencia memorable. Flo tiene una capacidad increíble para que todos se sientan cómodos con el barro desde el primer momento.",
    name: "Carlos R.",
    context: "Team building corporativo",
  },
  {
    quote:
      "Compré una taza y un bowl, y cada vez que los uso siento que hay algo especial en ellos. Se nota que cada pieza está hecha con cuidado y criterio.",
    name: "Ana P.",
    context: "Clienta de la tienda online",
  },
];

const TestimoniosSection = () => (
  <section className="py-20 md:py-28 bg-background" aria-labelledby="testimonios-heading">
    <div className="container mx-auto px-6">
      <div className="mb-14 md:mb-16 text-center">
        <p className="label-sm mb-4">Testimonios</p>
        <h2
          id="testimonios-heading"
          className="text-2xl sm:text-3xl md:text-4xl font-serif text-foreground leading-tight max-w-2xl mx-auto"
        >
          Lo que dicen quienes ya pasaron por el estudio
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
        {testimonios.map((t) => (
          <blockquote key={t.name} className="flex flex-col border-t border-border pt-8">
            <p className="text-[15px] md:text-base leading-relaxed text-foreground font-serif italic flex-1 mb-6">
              "{t.quote}"
            </p>
            <footer>
              <p className="text-sm font-sans font-semibold text-foreground">{t.name}</p>
              <p className="text-xs text-muted-foreground font-sans">{t.context}</p>
            </footer>
          </blockquote>
        ))}
      </div>
    </div>
  </section>
);

export default TestimoniosSection;
