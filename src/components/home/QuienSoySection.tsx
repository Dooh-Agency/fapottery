import { Link } from "react-router-dom";
import quienSoyImg from "@/assets/quien_soy_1.avif";

const QuienSoySection = () => {
  return (
    <section className="py-20 md:py-28 bg-background" aria-labelledby="quien-soy-heading">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
          {/* Photo */}
          <div className="aspect-[3/4] w-full overflow-hidden">
            <img src={quienSoyImg} alt="Retrato de Florencia Alvarez, ceramista y diseñadora" className="w-full h-full object-cover grayscale" loading="lazy" />
          </div>

          {/* Text */}
          <div className="flex flex-col justify-start pt-0 md:pt-8">
            <p className="label-sm mb-6">
              Quién soy
            </p>
            <h2 id="quien-soy-heading" className="text-2xl sm:text-3xl md:text-4xl font-serif text-foreground leading-snug mb-8">
              El oficio, el diseño y la experiencia se integran en cada objeto
            </h2>
            <div className="space-y-5 text-[15px] md:text-base leading-relaxed text-foreground font-sans mb-10">
              <p>
                Soy Florencia Alvarez, ceramista y diseñadora.
              </p>
              <p>
                Mi formación de grado en Diseño Gráfico y comunicación se redefinió en una mirada proyectual que, con el tiempo, trasladó al trabajo con el barro. La cerámica se convirtió así en mi principal medio de expresión: un territorio donde pensar, hacer y producir desde el material.
              </p>
              <p>
                Me formé en torno alfarero, modelado y desarrollo de esmaltes, y desde hace más de cuatro años dicto clases de cerámica para adultos y niños, acompañando procesos técnicos y creativos desde un enfoque cercano, personalizado y consciente del ritmo de cada persona.
              </p>
              <p>
                Actualmente desarrollo producción artesanal y gestiono mi estudio como un espacio donde conviven práctica con piezas funcionales, series limitadas, enseñanza y colaboraciones con talleres, residencias y espacios culturales.
              </p>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/clases"
                className="btn-outline-sm text-center"
              >
                Ver clases disponibles
              </Link>
              <a
                href="https://wa.me/+34681816030"
                target="_blank"
                rel="noopener noreferrer"
                className="text-center border border-border text-muted-foreground font-sans text-xs tracking-[0.2em] uppercase px-8 py-3 hover:border-foreground hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                ¿Hablamos?
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuienSoySection;
