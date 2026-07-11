import { useTranslation } from "react-i18next";
import { Link } from "@/components/LocalizedLink";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import DynamicHeroBanner from "@/components/DynamicHeroBanner";
import clasesRegularesImg from "@/assets/fa-clases-regulares.avif";
import workshopsImg from "@/assets/fa-workshops.avif";
import clasesPersonalizadasImg from "@/assets/fa-clases-personalizadas.avif";
import heroImg from "@/assets/propuesta-educativa-header.jpeg";

const PropuestaEducativa = () => {
  const { t } = useTranslation();

  const classTypes = [
    {
      image: clasesRegularesImg,
      title: t("propuestaEducativa.type1Title"),
      altImg: t("propuestaEducativa.type1Alt"),
      filterParam: "regulares",
      paragraphs: [t("propuestaEducativa.type1P1"), t("propuestaEducativa.type1P2"), t("propuestaEducativa.type1P3")],
    },
    {
      image: workshopsImg,
      title: t("propuestaEducativa.type2Title"),
      altImg: t("propuestaEducativa.type2Alt"),
      filterParam: "workshops",
      paragraphs: [t("propuestaEducativa.type2P1"), t("propuestaEducativa.type2P2")],
    },
    {
      image: clasesPersonalizadasImg,
      title: t("propuestaEducativa.type3Title"),
      altImg: t("propuestaEducativa.type3Alt"),
      filterParam: "personalizadas",
      paragraphs: [t("propuestaEducativa.type3P1"), t("propuestaEducativa.type3P2")],
    },
  ];

  return (
    <Layout>
      <SEO
        title={t("propuestaEducativa.seoTitle")}
        description={t("propuestaEducativa.seoDescription")}
        path="/propuesta-educativa"
      />
      <DynamicHeroBanner
        sectionKey="propuesta-educativa"
        fallbackSrc={heroImg}
        fallbackAlt={t("propuestaEducativa.heroAlt")}
        flush
        title={t("propuestaEducativa.heroTitle")}
      />

      {/* Two-column content — matching Producción layout */}
      <section className="pt-[37px] md:pt-[46px] pb-10 md:pb-14">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-[2.1rem] font-serif text-foreground leading-snug">
                {t("propuestaEducativa.heading")}
              </h2>
            </div>

            <div className="space-y-5">
              <p className="body-text">{t("propuestaEducativa.p1")}</p>
              <p className="body-text">{t("propuestaEducativa.p2")}</p>
              <p className="body-text">
                {t("propuestaEducativa.p3Pre")}{" "}
                <strong className="font-semibold text-foreground">{t("propuestaEducativa.p3Strong")}</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA rápida antes de los tipos */}
      <section className="pb-6 md:pb-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border border-border p-5 md:p-6">
            <div>
              <p className="label-sm mb-1">{t("propuestaEducativa.ctaBoxTitle")}</p>
              <p className="text-sm font-sans text-muted-foreground">{t("propuestaEducativa.ctaBoxSubtitle")}</p>
            </div>
            <Link
              to="/actividades"
              className="inline-block shrink-0 border border-foreground bg-foreground text-primary-foreground font-sans text-xs tracking-[0.2em] uppercase px-7 py-3.5 hover:bg-transparent hover:text-foreground transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {t("propuestaEducativa.ctaBoxButton")}
            </Link>
          </div>
        </div>
      </section>

      {/* Class Types */}
      <section className="w-full bg-cream section-padding" aria-label={t("propuestaEducativa.tiposAria")}>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            {classTypes.map((cls) => (
              <article key={cls.title} className="flex flex-col">
                <img
                  src={cls.image}
                  alt={cls.altImg}
                  className="w-full aspect-[4/3] object-cover mb-6"
                  loading="lazy"
                />
                <h2 className="text-sm md:text-base font-sans font-semibold text-foreground mb-4 leading-snug">
                  {cls.title}
                </h2>
                <div className="space-y-4 body-text flex-1">
                  {cls.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
                <Link
                  to={`/actividades?tipo=${cls.filterParam}`}
                  className="btn-outline-sm mt-8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring text-center"
                >
                  {t("propuestaEducativa.verFechas")}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PropuestaEducativa;
