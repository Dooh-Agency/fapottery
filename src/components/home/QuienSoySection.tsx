import { useTranslation } from "react-i18next";
import { Link } from "@/components/LocalizedLink";
import quienSoyImg from "@/assets/quien_soy_1.avif";

const QuienSoySection = () => {
  const { t } = useTranslation();
  return (
    <section className="py-20 md:py-28 bg-background" aria-labelledby="quien-soy-heading">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
          {/* Photo */}
          <div className="aspect-[3/4] w-full overflow-hidden">
            <img src={quienSoyImg} alt={t("home.quienSoy.imgAlt")} className="w-full h-full object-cover grayscale" loading="lazy" />
          </div>

          {/* Text */}
          <div className="flex flex-col justify-start pt-0 md:pt-8">
            <p className="label-sm mb-6">
              {t("home.quienSoy.label")}
            </p>
            <h2 id="quien-soy-heading" className="text-2xl sm:text-3xl md:text-4xl font-serif text-foreground leading-snug mb-8">
              {t("home.quienSoy.heading")}
            </h2>
            <div className="space-y-5 text-[15px] md:text-base leading-relaxed text-foreground font-sans mb-10">
              <p>{t("home.quienSoy.p1")}</p>
              <p>{t("home.quienSoy.p2")}</p>
              <p>{t("home.quienSoy.p3")}</p>
              <p>{t("home.quienSoy.p4")}</p>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/clases"
                className="btn-outline-sm text-center"
              >
                {t("home.quienSoy.ctaClases")}
              </Link>
              <a
                href="https://wa.me/+34681816030"
                target="_blank"
                rel="noopener noreferrer"
                className="text-center border border-border text-muted-foreground font-sans text-xs tracking-[0.2em] uppercase px-8 py-3 hover:border-foreground hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {t("home.quienSoy.ctaHablamos")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuienSoySection;
