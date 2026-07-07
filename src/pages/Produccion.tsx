import { useTranslation } from "react-i18next";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import DynamicHeroBanner from "@/components/DynamicHeroBanner";
import produccionHeader from "@/assets/produccion-header.jpg";

const Produccion = () => {
  const { t } = useTranslation();
  return (
    <Layout>
      <SEO
        title={t("produccion.seoTitle")}
        description={t("produccion.seoDescription")}
        path="/produccion"
      />
      <DynamicHeroBanner
        sectionKey="produccion"
        fallbackSrc={produccionHeader}
        fallbackAlt={t("produccion.heroAlt")}
        flush
        title={t("produccion.heroTitle")}
      />

      {/* Two-column content */}
      <section className="pt-[37px] md:pt-[46px] pb-10 md:pb-14">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-[2.1rem] font-serif text-foreground leading-snug">
                {t("produccion.heading")}
              </h2>
            </div>

            <div className="space-y-5">
              <p className="body-text">{t("produccion.p1")}</p>
              <p className="body-text">{t("produccion.p2")}</p>

              <ul className="space-y-1.5 text-[15px] md:text-base text-foreground font-sans pl-5 pt-2" aria-label={t("produccion.listAria")}>
                <li className="list-disc">{t("produccion.li1")}</li>
                <li className="list-disc">{t("produccion.li2")}</li>
                <li className="list-disc">{t("produccion.li3")}</li>
              </ul>

              <a
                href="https://wa.me/+34681816030"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline mt-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {t("produccion.cta")}
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Produccion;
