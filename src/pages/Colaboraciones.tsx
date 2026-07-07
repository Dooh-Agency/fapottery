import { useTranslation } from "react-i18next";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import DynamicHeroBanner from "@/components/DynamicHeroBanner";
import colaboracionesImg from "@/assets/colaboraciones-imagen.avif";
import forma4 from "@/assets/forma4.svg";
import forma3 from "@/assets/forma3-2.svg";

const Colaboraciones = () => {
  const { t } = useTranslation();

  const qa = [
    { title: t("colaboraciones.qa1Title"), text: t("colaboraciones.qa1Text") },
    { title: t("colaboraciones.qa2Title"), text: t("colaboraciones.qa2Text") },
    { title: t("colaboraciones.qa3Title"), text: t("colaboraciones.qa3Text") },
  ];

  return (
    <Layout>
      <SEO
        title={t("colaboraciones.seoTitle")}
        description={t("colaboraciones.seoDescription")}
        path="/colaboraciones"
      />
      <DynamicHeroBanner
        sectionKey="colaboraciones"
        fallbackSrc=""
        fallbackAlt={t("colaboraciones.heroAlt")}
        flush
        title={t("colaboraciones.heroTitle")}
      />

      {/* Experiencias Pottery */}
      <section className="pt-[37px] md:pt-[46px] pb-20 md:pb-28 bg-background" aria-labelledby="experiencias-heading">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
            {/* Left column */}
            <div>
              <p className="label-sm mb-8">{t("colaboraciones.experienciasLabel")}</p>
              <h2 id="experiencias-heading" className="text-2xl sm:text-3xl md:text-4xl font-serif text-foreground leading-snug mb-2">
                {t("colaboraciones.experienciasHeading")}
              </h2>

              {/* SVG shapes — decorative */}
              <div className="mt-8 relative" style={{ height: '280px' }} aria-hidden="true">
                <img src={forma4} alt="" className="absolute left-8 top-0 w-16 h-auto" />
                <img src={forma3} alt="" className="absolute left-1/2 -translate-x-1/2 top-12 w-52 h-auto" />
              </div>
            </div>

            {/* Right column — Q&A */}
            <div className="space-y-10 pt-0 md:pt-20">
              {qa.map((item) => (
                <article key={item.title} className="border-t border-border pt-8">
                  <h3 className="text-base font-sans font-semibold text-foreground mb-3">
                    {item.title}
                  </h3>
                  <p className="body-text">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Creando conexiones */}
      <section className="section-padding bg-background" aria-labelledby="conexiones-heading">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
            {/* Photo */}
            <figure className="w-full max-w-md overflow-hidden">
              <img src={colaboracionesImg} alt={t("colaboraciones.imgAlt")} className="w-full h-auto object-cover" loading="lazy" />
            </figure>

            {/* Text */}
            <div className="flex flex-col justify-center">
              <h2 id="conexiones-heading" className="text-3xl sm:text-4xl md:text-5xl font-serif text-foreground leading-tight mb-1">
                {t("colaboraciones.conexionesHeading")}
              </h2>
              <p className="text-2xl sm:text-3xl md:text-4xl font-serif italic text-foreground/70 leading-tight mb-10 underline decoration-1 underline-offset-4" lang="en">
                {t("colaboraciones.conexionesSubheading")}
              </p>

              <div className="space-y-5 body-text">
                <p>{t("colaboraciones.p1")}</p>
                <p>{t("colaboraciones.p2")}</p>
                <p>{t("colaboraciones.p3")}</p>
              </div>

              <a
                href="https://wa.me/+34681816030"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline mt-10 md:w-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {t("colaboraciones.cta")}
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Colaboraciones;
