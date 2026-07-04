import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import DynamicHeroBanner from "@/components/DynamicHeroBanner";
import colaboracionesImg from "@/assets/colaboraciones-imagen.avif";
import forma4 from "@/assets/forma4.svg";
import forma3 from "@/assets/forma3-2.svg";

const Colaboraciones = () => (
  <Layout>
    <SEO
      title="Colaboraciones"
      description="Proyectos colaborativos de cerámica. Trabajamos juntos para dar forma a ideas únicas con identidad propia."
      path="/colaboraciones"
    />
    <DynamicHeroBanner
      sectionKey="colaboraciones"
      fallbackSrc=""
      fallbackAlt="Colaboraciones header"
      flush
      title="Colaboraciones"
    />

    {/* Experiencias Pottery */}
    <section className="pt-[37px] md:pt-[46px] pb-20 md:pb-28 bg-background" aria-labelledby="experiencias-heading">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
          {/* Left column */}
          <div>
            <p className="label-sm mb-8">Experiencias Pottery</p>
            <h2 id="experiencias-heading" className="text-2xl sm:text-3xl md:text-4xl font-serif text-foreground leading-snug mb-2">
              Una práctica abierta al intercambio y al trabajo colectivo
            </h2>

            {/* SVG shapes — decorative */}
            <div className="mt-8 relative" style={{ height: '280px' }} aria-hidden="true">
              <img src={forma4} alt="" className="absolute left-8 top-0 w-16 h-auto" />
              <img src={forma3} alt="" className="absolute left-1/2 -translate-x-1/2 top-12 w-52 h-auto" />
            </div>
          </div>

          {/* Right column — Q&A */}
          <div className="space-y-10 pt-0 md:pt-20">
            {[
              {
                title: "¿Te gustaría recibirme en tu espacio?",
                text: "Me interesa colaborar con talleres, estudios y espacios culturales que valoren el proceso, el oficio y la experimentación.",
              },
              {
                title: "Desarrollo de proyectos",
                text: "Estoy disponible para desarrollar proyectos conjuntos, residencias temporales, propuestas educativas o producción colaborativa, tanto en contextos locales como internacionales.",
              },
              {
                title: "¿Quieres incorporar la actividad cerámica a tu espacio?",
                text: "Si cuentas con un espacio o proyecto y quiere explorar una colaboración, será un placer conversarlo.",
              },
            ].map((item) => (
              <article key={item.title} className="border-t border-border pt-8">
                <h3 className="text-base font-sans font-semibold text-foreground mb-3">
                  {item.title}
                </h3>
                <p className="body-text">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Creando conexiones */}
    <section className="section-padding bg-background" aria-labelledby="conexiones-heading">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
          {/* Photo */}
          <figure className="w-full max-w-md overflow-hidden">
            <img src={colaboracionesImg} alt="Florencia Alvarez trabajando en el taller de cerámica" className="w-full h-auto object-cover" loading="lazy" />
          </figure>

          {/* Text */}
          <div className="flex flex-col justify-center">
            <h2 id="conexiones-heading" className="text-3xl sm:text-4xl md:text-5xl font-serif text-foreground leading-tight mb-1">
              Creando conexiones
            </h2>
            <p className="text-2xl sm:text-3xl md:text-4xl font-serif italic text-foreground/70 leading-tight mb-10 underline decoration-1 underline-offset-4" lang="en">
              _Building connections_
            </p>

            <div className="space-y-5 body-text">
              <p>Creo en el intercambio como parte esencial del proceso creativo.</p>
              <p>Me interesa trabajar con personas y espacios que valoren el oficio, el aprendizaje y el desarrollo conjunto de proyectos.</p>
              <p>Si sentís que mi práctica puede dialogar con tu espacio, estaré encantada de conversar y explorar posibilidades.</p>
            </div>

            <a
              href="https://wa.me/+34681816030"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline mt-10 md:w-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              CONTÁCTAME
            </a>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default Colaboraciones;
