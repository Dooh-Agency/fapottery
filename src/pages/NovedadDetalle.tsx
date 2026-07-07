import { useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Link } from "@/components/LocalizedLink";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { useNews } from "@/hooks/useNews";
import { Instagram, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { getLanguageFromPathname } from "@/i18n";

const NovedadDetalle = () => {
  const { id } = useParams<{ id: string }>();
  const { data: news, isLoading } = useNews(true);
  const item = news?.find((n) => n.id === id);
  const { t } = useTranslation();
  const location = useLocation();
  const dateLocale = getLanguageFromPathname(location.pathname) === "en" ? enUS : es;

  if (isLoading) {
    return (
      <Layout>
        <section className="section-padding">
          <div className="container mx-auto px-6 text-center">
            <p className="text-muted-foreground text-sm">{t("novedadDetalle.cargando")}</p>
          </div>
        </section>
      </Layout>
    );
  }

  if (!item) {
    return (
      <Layout>
        <SEO title={t("novedadDetalle.noEncontradaTitle")} path="/novedades" />
        <section className="section-padding">
          <div className="container mx-auto px-6 text-center">
            <h1 className="font-serif text-2xl mb-4">{t("novedadDetalle.noEncontradaTitle")}</h1>
            <Link to="/novedades" className="body-text underline">← {t("novedadDetalle.volver")}</Link>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO title={item.title} description={item.body?.slice(0, 155) || ""} path={`/novedades/${item.id}`} />
      <section className="pt-10 md:pt-14 pb-20 md:pb-28">
        <div className="container mx-auto px-6">
          <Link to="/novedades" className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] font-sans text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" /> {t("novedadDetalle.volver")}
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
            {/* Image */}
            {item.image_url && (
              <div className="w-full overflow-hidden">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div className={!item.image_url ? "md:col-span-2 max-w-2xl" : ""}>
              {item.published_at && (
                <time className="label-sm block mb-3" dateTime={item.published_at}>
                  {format(new Date(item.published_at), dateLocale === enUS ? "MMMM d, yyyy" : "d 'de' MMMM yyyy", { locale: dateLocale })}
                </time>
              )}
              <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl mb-6">{item.title}</h1>
              {item.body && (
                <div className="body-text whitespace-pre-line space-y-4">{item.body}</div>
              )}
              {item.instagram_url && (
                <a
                  href={item.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] font-sans text-muted-foreground hover:text-foreground transition-colors mt-8"
                >
                  <Instagram className="h-4 w-4" aria-hidden="true" />
                  {t("novedadDetalle.verInstagram")}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default NovedadDetalle;
