const testimonios = [
  {
    quote:
      "Las clases con Florencia cambiaron completamente mi relación con la cerámica. Jamás me había animado a hacer. El grupo era de 6 y la enseñanza fue super personalizada y el espacio es increíble.",
    name: "Laura M.",
    context: "Alumna de clases regulares, Riviera, La Cala de Mijas",
  },
  {
    quote:
      "Organizamos un workshop de cerámica para el equipo de trabajo y fue una experiencia hermosa. Flor tiene una capacidad y una paciencia increible, para que todos se sientan cómodos haciendo cerámica desde el primer momento.",
    name: "Carlos R.",
    context: "Team building corporativo",
  },
  {
    quote:
      "Mi primera vez haciendo cerámica. Hice una taza con un bowl, y cada vez que los uso siento que hay algo especial. No están perfectos, pero los amo!! Además le compré una ensaladera y nota que cada pieza está hecha con cuidado y amor. Es mi preferida.",
    name: "Ana P.",
    context: "Clienta y alumna de Workshop Cerámica & Picoteo, Maui Paddle Surf",
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
          Lo que dicen quienes ya vivieron una experiencia cerámica conmigo
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
