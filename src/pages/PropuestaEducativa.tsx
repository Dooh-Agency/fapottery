import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import DynamicHeroBanner from "@/components/DynamicHeroBanner";
import clasesRegularesImg from "@/assets/fa-clases-regulares.avif";
import workshopsImg from "@/assets/fa-workshops.avif";
import clasesPersonalizadasImg from "@/assets/fa-clases-personalizadas.avif";
import heroImg from "@/assets/propuesta-educativa-header.jpeg";

const classTypes = [
  {
    image: clasesRegularesImg,
    title: "Clases regulares de torno y modelado",
    altImg: "Alumna trabajando en torno alfarero durante una clase regular",
    filterParam: "regulares",
    paragraphs: [
      "Clases de cerámica en torno alfarero y modelado en mesa dictadas en mi propio espacio de trabajo.",
      "Los grupos son reducidos para garantizar un acompañamiento cercano, respetando el ritmo y el proceso de cada persona.",
      "Las clases combinan técnica, práctica y observación del material, y están orientadas tanto a personas que se inician como a quienes desean profundizar su práctica cerámica.",
    ],
  },
  {
    image: workshopsImg,
    title: "Workshops y clases en espacios externos (talleres, empresas y centros de arte)",
    altImg: "Grupo de personas participando en un workshop de cerámica",
    filterParam: "workshops",
    paragraphs: [
      "Propuestas de talleres y workshops de cerámica dictados en espacios anfitriones: talleres, empresas, estudios y centros de arte.",
      "Las actividades se adaptan al contexto y al público del lugar, pudiendo funcionar como experiencias puntuales, instancias formativas o encuentros de team building, siempre con foco en el hacer manual y el trabajo colectivo.",
    ],
  },
  {
    image: clasesPersonalizadasImg,
    title: "Clases personalizadas (a domicilio o en mi espacio, individuales o grupales)",
    altImg: "Sesión de clase personalizada de cerámica con acompañamiento individual",
    filterParam: "personalizadas",
    paragraphs: [
      "Clases diseñadas a medida para personas o grupos que buscan un acompañamiento más específico y personalizado.",
      "Pueden realizarse a domicilio o en el estudio, y se ajustan a los objetivos, nivel y ritmo de cada participante, permitiendo profundizar en técnica, proceso y desarrollo personal.",
    ],
  },
];

const PropuestaEducativa = () => (
  <Layout>
    <SEO
      title="Propuesta Educativa"
      description="Clases de cerámica en torno y modelado. Grupos reducidos, workshops y clases personalizadas con Florencia Alvarez."
      path="/propuesta-educativa"
    />
    <DynamicHeroBanner
      sectionKey="propuesta-educativa"
      fallbackSrc={heroImg}
      fallbackAlt="Manos trabajando arcilla en un taller de cerámica"
      flush
      title="Propuesta educativa"
    />

    {/* Two-column content — matching Producción layout */}
    <section className="pt-[37px] md:pt-[46px] pb-10 md:pb-14">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-[2.1rem] font-serif text-foreground leading-snug">
              La enseñanza es una parte fundamental de mi práctica cerámica
            </h2>
          </div>

          <div className="space-y-5">
            <p className="body-text">
              Concibo el aprendizaje como un proceso de exploración técnica y personal, donde cada alumna y alumno desarrolla su propio vínculo con el material.
            </p>
            <p className="body-text">
              Cuento con experiencia en la enseñanza de cerámica, modelado y torno alfarero para adultos y niños, trabajando desde un enfoque personalizado, respetuoso de los tiempos y orientado tanto a la técnica como a la creatividad.
            </p>
            <p className="body-text">
              Ofrezco trabajar en una práctica abierta al intercambio, porque{" "}
              <strong className="font-semibold text-foreground">la cerámica también es encuentro.</strong>
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* CTA rápida antes de los tipos */}
    <section className="pb-6 md:pb-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border border-border p-5 md:p-6">
          <div>
            <p className="label-sm mb-1">¿Listo/a para empezar?</p>
            <p className="text-sm font-sans text-muted-foreground">Grupos reducidos · Todos los niveles · Desde €35 / clase</p>
          </div>
          <Link
            to="/clases"
            className="inline-block shrink-0 border border-foreground bg-foreground text-primary-foreground font-sans text-xs tracking-[0.2em] uppercase px-7 py-3.5 hover:bg-transparent hover:text-foreground transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Ver fechas disponibles
          </Link>
        </div>
      </div>
    </section>

    {/* Class Types */}
    <section className="w-full bg-cream section-padding" aria-label="Tipos de clases">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {classTypes.map((cls) => (
            <article key={cls.title} className="flex flex-col">
              <img
                src={cls.image}
                alt={cls.altImg}
                className="w-full aspect-[4/3] object-cover mb-6"
                loading="lazy"
              />
              <h2 className="text-sm md:text-base font-sans font-semibold text-foreground mb-4 leading-snug">
                {cls.title}
              </h2>
              <div className="space-y-4 body-text flex-1">
                {cls.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              <Link
                to={`/clases?tipo=${cls.filterParam}`}
                className="btn-outline-sm mt-8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring text-center"
              >
                Ver fechas y reservar
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default PropuestaEducativa;
