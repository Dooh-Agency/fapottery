import { useTranslation } from "react-i18next";
import Layout from "@/components/Layout";

const FaLanding = () => {
  const { t } = useTranslation();
  return (
    <Layout>
      <section className="py-32 md:py-44">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-4">{t("faLanding.title")}</h1>
          <p className="text-muted-foreground font-sans">{t("faLanding.text")}</p>
        </div>
      </section>
    </Layout>
  );
};

export default FaLanding;
