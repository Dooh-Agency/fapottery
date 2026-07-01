import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import DynamicHeroBanner from "@/components/DynamicHeroBanner";
import { useClassTypes } from "@/hooks/useClasses";
import { Link, useSearchParams } from "react-router-dom";

const CATEGORY_LABELS: Record<string, string> = {
  regulares: "Clases regulares",
  workshops: "Workshops",
  personalizadas: "Clases personalizadas",
};

const Clases = () => {
  const { data: classTypes, isLoading } = useClassTypes(true);
  const [searchParams] = useSearchParams();
  const tipo = searchParams.get("tipo");

  const items = (classTypes || []).filter((ct) => {
    if (!tipo) return true;
    const cta = ct as any;
    return cta.category === tipo || ct.title.toLowerCase().includes(tipo.toLowerCase());
  });

  return (
    <Layout>
      <SEO
        title="Clases"
        description="Reservá tu lugar en clases de cerámica. Torno, modelado, workshops y más."
        path="/clases"
      />
      <DynamicHeroBanner
        sectionKey="clases"
        fallbackSrc=""
        fallbackAlt="Clases del estudio"
        flush
        title="Clases"
      />
      <section className="section-padding" aria-label="Clases disponibles">
        <div className="container mx-auto px-6">
          <p className="body-text text-center max-w-xl mx-auto mb-12">
            Explorá las opciones de talleres y reservá tu lugar.
          </p>

          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" role="status" aria-label="Cargando clases">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse bg-muted aspect-[4/5]" aria-hidden="true" />
              ))}
              <span className="sr-only">Cargando clases…</span>
            </div>
          )}

          {!isLoading && items.length === 0 && (
            <p className="body-text text-center text-muted-foreground">
              Próximamente se publicarán clases.
            </p>
          )}

          {!isLoading && items.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((ct) => {
                const cta = ct as any;
                return (
                  <Link
                    key={ct.id}
                    to={`/clases/${ct.id}`}
                    className="group border border-border bg-card overflow-hidden flex flex-col focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    aria-label={`Ver detalles de: ${ct.title}`}
                  >
                    {cta.image_url && (
                      <div className="aspect-[4/5] overflow-hidden">
                        <img
                          src={cta.image_url}
                          alt={`Imagen de la clase: ${ct.title}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 motion-reduce:transition-none"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="p-5 flex flex-col flex-1">
                      {cta.category && (
                        <span className="label-sm mb-2">{CATEGORY_LABELS[cta.category] || cta.category}</span>
                      )}
                      <h2 className="font-serif font-bold text-lg mb-2">{ct.title}</h2>
                      {ct.description && (
                        <p className="body-text line-clamp-3 flex-1">{ct.description}</p>
                      )}
                      <div className="flex items-center justify-between mt-3">
                        {Number(ct.price) > 0 && (
                          <span className="text-sm font-serif font-semibold text-foreground">€{ct.price}</span>
                        )}
                        <span className="text-xs uppercase tracking-[0.15em] font-sans text-muted-foreground">
                          Ver más →
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Clases;
