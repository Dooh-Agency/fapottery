import { useTranslation } from "react-i18next";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import DynamicHeroBanner from "@/components/DynamicHeroBanner";
import { useClassTypesWithSchedules, type ClassTypeWithSchedules } from "@/hooks/useClasses";
import { useSiteImage } from "@/hooks/useSiteImages";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { Link } from "@/components/LocalizedLink";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { renderBoldText } from "@/lib/richText";

const CLASS_CATEGORIES = ["regulares", "workshops", "personalizadas"] as const;

const isPastClassType = (ct: ClassTypeWithSchedules) => {
  // Las clases regulares y personalizadas son ofertas permanentes, no eventos puntuales:
  // solo los workshops (fecha única) pueden pasar a "eventos pasados".
  if (ct.category !== "workshops") return false;
  const activeSchedules = ct.class_schedules.filter((s) => !s.is_cancelled);
  if (activeSchedules.length === 0) return false; // sin fechas cargadas todavía: sigue vigente
  return !activeSchedules.some((s) => new Date(s.scheduled_date + "T23:59:59") >= new Date());
};

const Clases = () => {
  const { data: classTypes, isLoading } = useClassTypesWithSchedules(true);
  const { data: siteImage } = useSiteImage("clases");
  const [searchParams] = useSearchParams();
  const tipo = searchParams.get("tipo");
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === "en";
  const [filter, setFilter] = useState<string>(tipo || "all");

  const CATEGORY_LABELS: Record<string, string> = {
    regulares: t("clases.categoriaRegulares"),
    workshops: t("clases.categoriaWorkshops"),
    personalizadas: t("clases.categoriaPersonalizadas"),
  };

  const all = classTypes || [];
  const filtered = filter === "all" ? all : all.filter((ct) => ct.category === filter);

  const featured = all.filter((ct) => ct.is_featured && !isPastClassType(ct));
  const featuredIds = new Set(featured.map((ct) => ct.id));

  const current = filtered.filter((ct) => !isPastClassType(ct) && !featuredIds.has(ct.id));
  const past = filtered.filter((ct) => isPastClassType(ct));

  const renderCard = (ct: ClassTypeWithSchedules, big = false) => {
    const cta = ct as any;
    const title = (isEn && cta.title_en) || ct.title;
    const description = (isEn && cta.description_en) || ct.description;
    return (
      <Link
        key={ct.id}
        to={`/actividades/${ct.id}`}
        className={`group border border-border bg-card overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
          big ? "flex flex-col md:flex-row" : "flex flex-col"
        }`}
        aria-label={title}
      >
        {cta.image_url && (
          <div className={big ? "md:w-1/2 aspect-[4/5] md:aspect-auto overflow-hidden" : "aspect-[4/5] overflow-hidden"}>
            <img
              src={cta.image_url}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 motion-reduce:transition-none"
              loading="lazy"
            />
          </div>
        )}
        <div className={`p-5 flex flex-col flex-1 ${big ? "md:p-8 md:justify-center" : ""}`}>
          {cta.category && (
            <span className="label-sm mb-2">{CATEGORY_LABELS[cta.category] || cta.category}</span>
          )}
          <h2 className={big ? "font-serif font-bold text-2xl md:text-3xl mb-3" : "font-serif font-bold text-lg mb-2"}>
            {title}
          </h2>
          {description && (
            <p className={`body-text flex-1 ${big ? "line-clamp-4 md:line-clamp-6" : "line-clamp-3"}`}>{renderBoldText(description)}</p>
          )}
          <div className="flex items-center justify-between mt-3">
            {Number(ct.price) > 0 && (
              <span className={big ? "text-base font-serif font-semibold text-foreground" : "text-sm font-serif font-semibold text-foreground"}>
                €{ct.price}
              </span>
            )}
            <span className="text-xs uppercase tracking-[0.15em] font-sans text-muted-foreground">
              {t("clases.verMas")}
            </span>
          </div>
        </div>
      </Link>
    );
  };

  const renderPastCard = (ct: ClassTypeWithSchedules) => {
    const cta = ct as any;
    const title = (isEn && cta.title_en) || ct.title;
    return (
      <Link
        key={ct.id}
        to={`/actividades/${ct.id}`}
        className="group border border-border bg-card overflow-hidden flex flex-col focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        aria-label={title}
      >
        {cta.image_url && (
          <div className="aspect-square overflow-hidden">
            <img
              src={cta.image_url}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 motion-reduce:transition-none"
              loading="lazy"
            />
          </div>
        )}
        <p className="font-sans text-xs font-medium truncate p-2">{title}</p>
      </Link>
    );
  };

  return (
    <Layout>
      <SEO
        title={t("clases.seoTitle")}
        description={t("clases.seoDescription")}
        path="/actividades"
      />
      <DynamicHeroBanner
        sectionKey="clases"
        fallbackSrc=""
        fallbackAlt={t("clases.heroAlt")}
        flush
        title={t("clases.heroTitle")}
      />
      <section className="pt-[37px] md:pt-[46px] pb-20 md:pb-28" aria-label={t("clases.heroTitle")}>
        <div className="container mx-auto px-6">
          <p className="body-text text-center max-w-xl mx-auto mb-12">
            {siteImage?.subtitle || t("clases.defaultSubtitle")}
          </p>

          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" role="status" aria-label={t("clases.cargando")}>
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse bg-muted aspect-[4/5]" aria-hidden="true" />
              ))}
              <span className="sr-only">{t("clases.cargando")}</span>
            </div>
          )}

          {!isLoading && all.length === 0 && (
            <p className="body-text text-center text-muted-foreground">
              {t("clases.vacio")}
            </p>
          )}

          {!isLoading && all.length > 0 && (
            <>
              {/* Destacados */}
              {featured.length > 0 && (
                <div className="mb-16">
                  <h2 className="font-serif text-xl md:text-2xl mb-6">{t("clases.destacados")}</h2>
                  {featured.length === 1 ? (
                    renderCard(featured[0], true)
                  ) : (
                    <Carousel opts={{ align: "start" }}>
                      <CarouselContent>
                        {featured.map((ct) => (
                          <CarouselItem key={ct.id} className="basis-full lg:basis-[85%]">
                            {renderCard(ct, true)}
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious />
                      <CarouselNext />
                    </Carousel>
                  )}
                </div>
              )}

              {/* Filtro por categoría */}
              <div className="flex flex-wrap justify-center gap-2 mb-10" role="group" aria-label={t("clases.filtrarAria")}>
                <button
                  onClick={() => setFilter("all")}
                  aria-pressed={filter === "all"}
                  className={`font-sans text-xs uppercase tracking-[0.15em] px-4 py-2 border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                    filter === "all"
                      ? "border-foreground bg-foreground text-primary-foreground"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t("clases.todas")}
                </button>
                {CLASS_CATEGORIES.map((cat) => (
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
                    {CATEGORY_LABELS[cat]}
                  </button>
                ))}
              </div>

              {/* Próximas / vigentes */}
              {current.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {current.map((ct) => renderCard(ct))}
                </div>
              ) : (
                <p className="body-text text-center text-muted-foreground">{t("clases.vacio")}</p>
              )}

              {/* Pasadas */}
              {past.length > 0 && (
                <div className="mt-20">
                  <h2 className="font-serif text-xl md:text-2xl mb-6">{t("clases.eventosPasados")}</h2>
                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                    {past.map((ct) => renderPastCard(ct))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Clases;
