import { useTranslation } from "react-i18next";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import DynamicHeroBanner from "@/components/DynamicHeroBanner";
import { useNews } from "@/hooks/useNews";
import { useSiteImage } from "@/hooks/useSiteImages";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { useLocation } from "react-router-dom";
import { Link } from "@/components/LocalizedLink";
import { getLanguageFromPathname } from "@/i18n";

const Novedades = () => {
  const { data: news, isLoading } = useNews(true);
  const { data: siteImage } = useSiteImage("novedades");
  const { t } = useTranslation();
  const location = useLocation();
  const isEn = getLanguageFromPathname(location.pathname) === "en";
  const dateLocale = isEn ? enUS : es;

  return (
    <Layout>
      <SEO
        title={t("novedades.seoTitle")}
        description={t("novedades.seoDescription")}
        path="/novedades"
      />
      <DynamicHeroBanner
        sectionKey="novedades"
        fallbackSrc=""
        fallbackAlt={t("novedades.heroAlt")}
        flush
        title={t("novedades.heroTitle")}
        aspectClassName="aspect-[7.2/1] md:aspect-[10/1]"
        titleClassName="font-sans text-foreground text-xs sm:text-sm md:text-base lg:text-lg uppercase tracking-[0.25em] font-light"
        overlayClassName="bg-gradient-to-t from-white/60 via-white/40 to-white/10"
      />
      <section className="pt-[37px] md:pt-[46px] pb-20 md:pb-28" aria-label={t("novedades.heroTitle")}>
        <div className="container mx-auto px-6">
          <p className="body-text text-center max-w-xl mx-auto mb-12">
            {siteImage?.subtitle || t("novedades.defaultSubtitle")}
          </p>

          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" role="status" aria-label={t("novedades.cargando")}>
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse bg-muted aspect-[4/5]" aria-hidden="true" />
              ))}
              <span className="sr-only">{t("novedades.cargando")}</span>
            </div>
          )}

          {!isLoading && news && news.length === 0 && (
            <p className="body-text text-center text-muted-foreground">
              {t("novedades.vacio")}
            </p>
          )}

          {!isLoading && news && news.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item) => {
                const title = (isEn && item.title_en) || item.title;
                const body = (isEn && item.body_en) || item.body;
                return (
                  <Link
                    key={item.id}
                    to={`/novedades/${item.id}`}
                    className="group bg-card overflow-hidden flex flex-col focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    aria-label={`${t("novedades.leerMas")} — ${title}`}
                  >
                    {item.image_url && (
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={item.image_url}
                          alt={title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 motion-reduce:transition-none"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="p-5 flex flex-col flex-1">
                      {item.published_at && (
                        <time className="label-sm mb-2" dateTime={item.published_at}>
                          {format(new Date(item.published_at), "d MMM yyyy", { locale: dateLocale })}
                        </time>
                      )}
                      <h2 className="font-serif font-bold text-lg mb-2">{title}</h2>
                      {body && (
                        <p className="body-text line-clamp-3 flex-1">{body}</p>
                      )}
                      <span className="text-xs uppercase tracking-[0.15em] font-sans text-muted-foreground mt-3">
                        {t("novedades.leerMas")}
                      </span>
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

export default Novedades;
