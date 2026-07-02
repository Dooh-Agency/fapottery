import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import DynamicHeroBanner from "@/components/DynamicHeroBanner";
import { useNews } from "@/hooks/useNews";
import { useSiteImage } from "@/hooks/useSiteImages";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Link } from "react-router-dom";

const Novedades = () => {
  const { data: news, isLoading } = useNews(true);
  const { data: siteImage } = useSiteImage("novedades");

  return (
    <Layout>
      <SEO
        title="Novedades"
        description="Últimas noticias, eventos y novedades de FA Pottery Studio."
        path="/novedades"
      />
      <DynamicHeroBanner
        sectionKey="novedades"
        fallbackSrc=""
        fallbackAlt="Novedades del estudio"
        flush
        title="Novedades"
      />
      <section className="section-padding" aria-label="Novedades del estudio">
        <div className="container mx-auto px-6">
          <p className="body-text text-center max-w-xl mx-auto mb-12">
            {siteImage?.subtitle || "Últimas noticias, eventos y novedades del estudio."}
          </p>

          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" role="status" aria-label="Cargando novedades">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse bg-muted aspect-[4/5]" aria-hidden="true" />
              ))}
              <span className="sr-only">Cargando novedades…</span>
            </div>
          )}

          {!isLoading && news && news.length === 0 && (
            <p className="body-text text-center text-muted-foreground">
              No hay novedades por el momento. ¡Volvé pronto!
            </p>
          )}

          {!isLoading && news && news.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item) => (
                <Link
                  key={item.id}
                  to={`/novedades/${item.id}`}
                  className="group border border-border bg-card overflow-hidden flex flex-col focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  aria-label={`Leer más sobre: ${item.title}`}
                >
                  {item.image_url && (
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={item.image_url}
                        alt={`Imagen de la novedad: ${item.title}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 motion-reduce:transition-none"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-5 flex flex-col flex-1">
                    {item.published_at && (
                      <time className="label-sm mb-2" dateTime={item.published_at}>
                        {format(new Date(item.published_at), "d MMM yyyy", { locale: es })}
                      </time>
                    )}
                    <h2 className="font-serif text-lg mb-2">{item.title}</h2>
                    {item.body && (
                      <p className="body-text line-clamp-3 flex-1">{item.body}</p>
                    )}
                    <span className="text-xs uppercase tracking-[0.15em] font-sans text-muted-foreground mt-3">
                      Leer más →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Novedades;
