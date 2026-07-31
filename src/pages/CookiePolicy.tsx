import { useTranslation } from "react-i18next";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";

const SECTION_KEYS = ["what", "technical", "analytics", "manage", "contact"] as const;

const CookiePolicy = () => {
  const { t } = useTranslation();
  const title = t("cookies.title");
  const intro = t("cookies.intro");

  return (
    <Layout>
      <SEO title={title} description={intro} path="/cookies" />
      <section className="section-padding">
        <div className="container mx-auto max-w-3xl px-6">
          <h1 className="font-serif text-4xl md:text-5xl">{title}</h1>
          <p className="body-text mt-6">{intro}</p>
          <div className="mt-10 space-y-8">
            {SECTION_KEYS.map((key) => (
              <section key={key}>
                <h2 className="font-serif text-2xl">{t(`cookies.sections.${key}.title`)}</h2>
                <p className="body-text mt-2">{t(`cookies.sections.${key}.body`)}</p>
              </section>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CookiePolicy;
