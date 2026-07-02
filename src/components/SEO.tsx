import { Helmet } from "react-helmet-async";

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
const DEFAULT_DESC = "FA Pottery Studio por Florencia Alvarez. Cerámica artesanal, clases y producción en Málaga y Buenos Aires.";

const SEO = ({
  title,
  description = DEFAULT_DESC,
  path = "/",
  image,
  type = "website",
  jsonLd,
}: SEOProps) => {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — Cerámica desde una mirada personal`;
  const url = `${BASE_URL}${path}`;

  const defaultJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE_NAME,
    description: DEFAULT_DESC,
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
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      {image && <meta property="og:image" content={image} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {/* JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd || defaultJsonLd)}
      </script>
    </Helmet>
  );
};

export default SEO;
