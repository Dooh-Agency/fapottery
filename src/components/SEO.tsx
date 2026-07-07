import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { getLanguageFromPathname } from "@/i18n";

interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: string;
  jsonLd?: Record<string, any>;
}

const SITE_NAME = "FA Pottery Studio";
const BASE_URL = "https://fapottery.com";

const SEO = ({
  title,
  description,
  path = "/",
  image,
  type = "website",
  jsonLd,
}: SEOProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const lang = getLanguageFromPathname(location.pathname);
  const resolvedDescription = description || t("seo.defaultDescription");
  const fullTitle = title ? `${title} — ${SITE_NAME}` : t("seo.defaultTitle");
  const esPath = path;
  const enPath = path === "/" ? "/en" : `/en${path}`;
  const url = `${BASE_URL}${lang === "en" ? enPath : esPath}`;

  const defaultJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE_NAME,
    description: resolvedDescription,
    url: BASE_URL,
    image: image || `${BASE_URL}/favicon.png`,
    founder: { "@type": "Person", name: "Florencia Alvarez" },
    address: [
      { "@type": "PostalAddress", addressLocality: "Málaga", addressCountry: "ES" },
      { "@type": "PostalAddress", addressLocality: "Buenos Aires", addressCountry: "AR" },
    ],
    sameAs: ["https://www.instagram.com/fa.pottery/"],
  };

  return (
    <Helmet>
      <html lang={lang} />
      <title>{fullTitle}</title>
      <meta name="description" content={resolvedDescription} />
      <link rel="canonical" href={url} />
      <link rel="alternate" hrefLang="es" href={`${BASE_URL}${esPath}`} />
      <link rel="alternate" hrefLang="en" href={`${BASE_URL}${enPath}`} />
      <link rel="alternate" hrefLang="x-default" href={`${BASE_URL}${esPath}`} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={resolvedDescription} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content={lang === "en" ? "en_US" : "es_ES"} />
      {image && <meta property="og:image" content={image} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={resolvedDescription} />
      {image && <meta name="twitter:image" content={image} />}

      {/* JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd || defaultJsonLd)}
      </script>
    </Helmet>
  );
};

export default SEO;
