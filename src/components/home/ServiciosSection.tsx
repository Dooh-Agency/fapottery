import { Link } from "react-router-dom";
import { useHomeServices } from "@/hooks/useHomeServices";
import clasesRegularesImg from "@/assets/fa-clases-regulares.avif";
import workshopsImg from "@/assets/fa-workshops.avif";

const FALLBACK_IMAGES: Record<number, string> = {
  1: clasesRegularesImg,
  2: workshopsImg,
};

const ServiciosSection = () => {
  const { data: services, isLoading } = useHomeServices();

  return (
    <section className="py-20 md:py-28 bg-cream" aria-labelledby="servicios-heading">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14 md:mb-16">
          <h2
            id="servicios-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-serif text-foreground leading-tight max-w-sm"
          >
            ¿Qué podés encontrar en FA Pottery?
          </h2>
          <p className="text-[15px] md:text-base text-muted-foreground font-sans max-w-xs">
            Clases, piezas y experiencias cerámicas. Todo con una mirada de diseño y un proceso artesanal.
          </p>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6" role="status" aria-label="Cargando">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-muted aspect-[4/3]" aria-hidden="true" />
            ))}
            <span className="sr-only">Cargando…</span>
          </div>
        )}

        {!isLoading && services && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            {services.map((s) => {
              const image = s.image_url || FALLBACK_IMAGES[s.position];
              return (
                <article key={s.id} className="flex flex-col bg-background group">
                  {image ? (
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={image}
                        alt={s.title}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500 motion-reduce:transition-none"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[4/3] bg-muted" aria-hidden="true" />
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <p className="label-sm mb-3">{s.label}</p>
                    <h3 className="font-serif font-bold text-lg md:text-xl text-foreground leading-snug mb-3">
                      {s.title}
                    </h3>
                    {s.description && (
                      <p className="text-[14px] md:text-[15px] leading-relaxed text-muted-foreground font-sans mb-4 flex-1">
                        {s.description}
                      </p>
                    )}
                    {s.price && (
                      <p className="text-sm font-sans font-semibold text-foreground mb-5">
                        {s.price}
                      </p>
                    )}
                    <Link to={s.cta_link} className="btn-outline-sm text-center">
                      {s.cta_label}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default ServiciosSection;
