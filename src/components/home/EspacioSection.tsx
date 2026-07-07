import { useTranslation } from "react-i18next";
import img1 from "@/assets/fa_pottery_studio_1.avif";
import img2 from "@/assets/fa_potteri_studio_2.avif";
import img3 from "@/assets/fa_pottery_studio_3.avif";

const EspacioSection = () => {
  const { t } = useTranslation();
  return (
    <section className="relative" aria-label="El espacio">
      {/* Top beige background */}
      <div className="absolute top-0 left-0 right-0 h-[55%] bg-cream" aria-hidden="true" />
      {/* Bottom white background */}
      <div className="absolute bottom-0 left-0 right-0 h-[45%] bg-background" aria-hidden="true" />

      <div className="container mx-auto px-6 relative z-10 pt-24 md:pt-32 pb-16 md:pb-24">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-foreground text-center leading-tight max-w-3xl mx-auto mb-16 md:mb-20">
          {t("home.espacio.headingLine1")}
          <br />{t("home.espacio.headingLine2")}
        </h2>

        {/* 3 photos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="aspect-[3/4] w-full overflow-hidden">
            <img src={img1} alt={t("home.espacio.img1Alt")} className="w-full h-full object-cover" loading="lazy" />
          </div>
          <div className="aspect-[3/4] w-full overflow-hidden md:mt-16">
            <img src={img2} alt={t("home.espacio.img2Alt")} className="w-full h-full object-cover" loading="lazy" />
          </div>
          <div className="aspect-[3/4] w-full overflow-hidden">
            <img src={img3} alt={t("home.espacio.img3Alt")} className="w-full h-full object-cover" loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default EspacioSection;
