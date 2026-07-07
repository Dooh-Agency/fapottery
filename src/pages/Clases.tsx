import { useTranslation } from "react-i18next";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import DynamicHeroBanner from "@/components/DynamicHeroBanner";
import { useClassTypes } from "@/hooks/useClasses";
import { useSiteImage } from "@/hooks/useSiteImages";
import { useSearchParams } from "react-router-dom";
import { Link } from "@/components/LocalizedLink";

const Clases = () => {
  const { data: classTypes, isLoading } = useClassTypes(true);
  const { data: siteImage } = useSiteImage("clases");
  const [searchParams] = useSearchParams();
  const tipo = searchParams.get("tipo");
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === "en";

  const CATEGORY_LABELS: Record<string, string> = {
    regulares: t("clases.categoriaRegulares"),
    workshops: t("clases.categoriaWorkshops"),
    personalizadas: t("clases.categoriaPersonalizadas"),
  };

  const items = (classTypes || []).filter((ct) => {
    if (!tipo) return true;
    const cta = ct as any;
    return cta.category === tipo || ct.title.toLowerCase().includes(tipo.toLowerCase());
  });

  return (
    <Layout>
      <SEO
        title={t("clases.seoTitle")}
        description={t("clases.seoDescription")}
        path="/clases"
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

          {!isLoading && items.length === 0 && (
            <p className="body-text text-center text-muted-foreground">
              {t("clases.vacio")}
            </p>
          )}

          {!isLoading && items.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((ct) => {
                const cta = ct as any;
                const title = (isEn && cta.title_en) || ct.title;
                const description = (isEn && cta.description_en) || ct.description;
                return (
                  <Link
                    key={ct.id}
                    to={`/clases/${ct.id}`}
                    className="group border border-border bg-card overflow-hidden flex flex-col focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    aria-label={title}
                  >
                    {cta.image_url && (
                      <div className="aspect-[4/5] overflow-hidden">
                        <img
                          src={cta.image_url}
                          alt={title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 motion-reduce:transition-none"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="p-5 flex flex-col flex-1">
                      {cta.category && (
                        <span className="label-sm mb-2">{CATEGORY_LABELS[cta.category] || cta.category}</span>
                      )}
                      <h2 className="font-serif font-bold text-lg mb-2">{title}</h2>
                      {description && (
                        <p className="body-text line-clamp-3 flex-1">{description}</p>
                      )}
                      <div className="flex items-center justify-between mt-3">
                        {Number(ct.price) > 0 && (
                          <span className="text-sm font-serif font-semibold text-foreground">€{ct.price}</span>
                        )}
                        <span className="text-xs uppercase tracking-[0.15em] font-sans text-muted-foreground">
                          {t("clases.verMas")}
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
