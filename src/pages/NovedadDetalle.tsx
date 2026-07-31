import { useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Link } from "@/components/LocalizedLink";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { useNews } from "@/hooks/useNews";
import { Instagram, ArrowLeft, ChevronLeft, ChevronRight, ExternalLink, MapPin } from "lucide-react";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { getLanguageFromPathname } from "@/i18n";
import { renderActivityDescription } from "@/lib/richText";
import { useState } from "react";

const NovedadDetalle = () => {
  const { id } = useParams<{ id: string }>();
  const { data: news, isLoading } = useNews(true);
  const item = news?.find((n) => n.id === id);
  const { t } = useTranslation();
  const location = useLocation();
  const isEn = getLanguageFromPathname(location.pathname) === "en";
  const dateLocale = isEn ? enUS : es;
  const [selectedImage, setSelectedImage] = useState(0);

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

  const title = (isEn && item.title_en) || item.title;
  const body = (isEn && item.body_en) || item.body;
  const images = [item.image_url, ...(item.images || [])].filter((image): image is string => Boolean(image));

  return (
    <Layout>
      <SEO title={title} description={body?.slice(0, 155) || ""} path={`/novedades/${item.id}`} />
      <section className="pt-10 md:pt-14 pb-20 md:pb-28">
        <div className="container mx-auto px-6">
          <Link to="/novedades" className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] font-sans text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" /> {t("novedadDetalle.volver")}
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
            {/* Image */}
            {images.length > 0 && (
              <div className="w-full">
                <div className="relative overflow-hidden">
                  <img
                  src={images[selectedImage]}
                  alt={title}
                  className="w-full h-auto object-cover"
                />
                  {images.length > 1 && (
                    <>
                      <button type="button" aria-label="Imagen anterior" onClick={() => setSelectedImage((current) => (current - 1 + images.length) % images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 hover:bg-background">
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button type="button" aria-label="Imagen siguiente" onClick={() => setSelectedImage((current) => (current + 1) % images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 hover:bg-background">
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </div>
                {images.length > 1 && <div className="mt-3 flex gap-2 overflow-x-auto">{images.map((image, index) => <button type="button" key={image} onClick={() => setSelectedImage(index)} className={`h-16 w-16 shrink-0 overflow-hidden border ${selectedImage === index ? "border-foreground" : "border-border"}`}><img src={image} alt="" className="h-full w-full object-cover" /></button>)}</div>}
              </div>
            )}

            {/* Content */}
            <div className={images.length === 0 ? "md:col-span-2 max-w-2xl" : ""}>
              {item.published_at && (
                <time className="label-sm block mb-3" dateTime={item.published_at}>
                  {format(new Date(item.published_at), dateLocale === enUS ? "MMMM d, yyyy" : "d 'de' MMMM yyyy", { locale: dateLocale })}
                </time>
              )}
              <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl mb-6">{title}</h1>
              {body && (
                <div className="body-text whitespace-pre-line space-y-4">{renderActivityDescription(body)}</div>
              )}
              {item.location_map_url && (
                <a
                  href={item.location_map_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] font-sans text-muted-foreground hover:text-foreground transition-colors mt-8"
                >
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  {t("novedadDetalle.verMapa")} <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              )}
              {item.instagram_url && (
                <a
                  href={item.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] font-sans text-muted-foreground hover:text-foreground transition-colors mt-8 ml-5"
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
