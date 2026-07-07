import { useTranslation } from "react-i18next";
import { Link } from "@/components/LocalizedLink";
import forma1 from "@/assets/forma1.svg";
import forma2 from "@/assets/forma2.svg";
import forma3 from "@/assets/forma3.svg";

const MarcaPersonalSection = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: forma1,
      title: t("home.marcaPersonal.feature1Title"),
      description: t("home.marcaPersonal.feature1Desc"),
      cta: { label: t("home.marcaPersonal.feature1Cta"), to: "/tienda" },
    },
    {
      icon: forma2,
      title: t("home.marcaPersonal.feature2Title"),
      description: t("home.marcaPersonal.feature2Desc"),
      cta: { label: t("home.marcaPersonal.feature2Cta"), to: "/clases" },
    },
    {
      icon: forma3,
      title: t("home.marcaPersonal.feature3Title"),
      description: t("home.marcaPersonal.feature3Desc"),
      cta: { label: t("home.marcaPersonal.feature3Cta"), to: "/colaboraciones" },
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-background" aria-labelledby="marca-personal-heading">
      <div className="container mx-auto px-6">
        {/* Top 3-column text grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-16 md:mb-24">
          <div>
            <h2 id="marca-personal-heading" className="text-2xl sm:text-3xl md:text-4xl font-serif text-foreground leading-tight">
              {t("home.marcaPersonal.heading")}
            </h2>
          </div>
          <div>
            <p className="text-[15px] md:text-base leading-relaxed text-foreground font-sans">
              {t("home.marcaPersonal.text1")}
            </p>
          </div>
          <div>
            <p className="text-[15px] md:text-base leading-relaxed text-foreground font-sans">
              {t("home.marcaPersonal.text2")}
            </p>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-border mb-16 md:mb-20" />

        {/* 3-column features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {features.map((feature) => (
            <div key={feature.title} className="flex flex-col items-start text-left">
              <div className="mb-6 h-16" aria-hidden="true">
                <img src={feature.icon} alt="" className="h-full w-auto" />
              </div>
              <h3 className="text-sm font-sans font-bold text-foreground mb-2 tracking-wide">
                {feature.title}
              </h3>
              <p className="text-[15px] md:text-base leading-relaxed text-foreground font-sans mb-6 flex-1">
                {feature.description}
              </p>
              <Link
                to={feature.cta.to}
                className="text-xs uppercase tracking-[0.2em] font-sans text-foreground border-b border-foreground pb-0.5 hover:opacity-60 transition-opacity"
              >
                {feature.cta.label} →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MarcaPersonalSection;
