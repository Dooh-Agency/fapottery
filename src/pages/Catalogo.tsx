import { useTranslation } from "react-i18next";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import DynamicHeroBanner from "@/components/DynamicHeroBanner";
import { usePublishedPieces, type Piece } from "@/hooks/usePieces";
import { useSiteImage } from "@/hooks/useSiteImages";
import { useState } from "react";
import { Link } from "@/components/LocalizedLink";

const allCategories: Piece["category"][] = ["tazas", "platos", "bowls", "jarrones", "decoracion", "otro"];

const Catalogo = () => {
  const { data: pieces, isLoading } = usePublishedPieces();
  const { data: siteImage } = useSiteImage("catalogo");
  const [filter, setFilter] = useState<Piece["category"] | "all">("all");
  const { t } = useTranslation();

  const categoryLabels: Record<Piece["category"], string> = {
    tazas: t("catalogo.categoriaTazas"),
    platos: t("catalogo.categoriaPlatos"),
    bowls: t("catalogo.categoriaBowls"),
    jarrones: t("catalogo.categoriaJarrones"),
    decoracion: t("catalogo.categoriaDecoracion"),
    otro: t("catalogo.categoriaOtro"),
  };

  const filtered = filter === "all" ? pieces : pieces?.filter((p) => p.category === filter);

  return (
    <Layout>
      <SEO
        title={t("catalogo.seoTitle")}
        description={t("catalogo.seoDescription")}
        path="/tienda"
      />
      <DynamicHeroBanner
        sectionKey="catalogo"
        fallbackSrc=""
        fallbackAlt={t("catalogo.heroAlt")}
        flush
        title={t("catalogo.heroTitle")}
      />
      <section className="pt-[37px] md:pt-[46px] pb-20 md:pb-28" aria-label={t("catalogo.heroTitle")}>
        <div className="container mx-auto px-6">
          <p className="text-center text-muted-foreground font-sans text-[15px] md:text-base mb-10">
            {siteImage?.subtitle || t("catalogo.defaultSubtitle")}
          </p>

          {/* Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-10" role="group" aria-label={t("catalogo.filtrarAria")}>
            <button
              onClick={() => setFilter("all")}
              aria-pressed={filter === "all"}
              className={`font-sans text-xs uppercase tracking-[0.15em] px-4 py-2 border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                filter === "all"
                  ? "border-foreground bg-foreground text-primary-foreground"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("catalogo.todas")}
            </button>
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                aria-pressed={filter === cat}
                className={`font-sans text-xs uppercase tracking-[0.15em] px-4 py-2 border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                  filter === cat
                    ? "border-foreground bg-foreground text-primary-foreground"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {categoryLabels[cat]}
              </button>
            ))}
          </div>

          {isLoading ? (
            <p className="text-center text-muted-foreground text-sm" role="status">{t("catalogo.cargando")}</p>
          ) : !filtered?.length ? (
            <p className="text-center text-muted-foreground text-sm">{t("catalogo.vacio")}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
              {filtered.map((piece) => (
                <article key={piece.id} role="listitem" className="group flex flex-col">
                  <Link
                    to={`/tienda/${piece.id}`}
                    className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring block"
                    aria-label={`${piece.title}, €${piece.price}`}
                  >
                    <div className="aspect-square bg-muted overflow-hidden mb-3">
                      {piece.images?.[0] ? (
                        <img
                          src={piece.images[0]}
                          alt={piece.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 motion-reduce:transition-none"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs" aria-hidden="true">
                          {t("catalogo.sinImagen")}
                        </div>
                      )}
                    </div>
                    <p className="font-sans text-sm font-medium">{piece.title}</p>
                    <p className="font-sans text-base font-serif mb-3">€{piece.price}</p>
                  </Link>
                  <div className="flex gap-2 mt-auto">
                    <Link
                      to={`/tienda/${piece.id}`}
                      className="flex-1 text-center border border-foreground text-foreground font-sans text-[10px] tracking-[0.18em] uppercase px-3 py-2.5 hover:bg-foreground hover:text-primary-foreground transition-colors duration-200"
                    >
                      {t("catalogo.verPieza")}
                    </Link>
                    <a
                      href={`https://wa.me/+34681816030?text=${encodeURIComponent(t("catalogo.whatsappMensaje", { title: piece.title, price: piece.price }))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center border border-border text-muted-foreground font-sans text-[10px] tracking-[0.18em] uppercase px-3 py-2.5 hover:border-foreground hover:text-foreground transition-colors duration-200"
                      aria-label={`${t("catalogo.consultar")} — ${piece.title}`}
                    >
                      {t("catalogo.consultar")}
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Catalogo;
