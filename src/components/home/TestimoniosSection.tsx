import { useTranslation } from "react-i18next";

const TestimoniosSection = () => {
  const { t } = useTranslation();

  const testimonios = [
    { quote: t("home.testimonios.quote1"), name: t("home.testimonios.name1"), context: t("home.testimonios.context1") },
    { quote: t("home.testimonios.quote2"), name: t("home.testimonios.name2"), context: t("home.testimonios.context2") },
    { quote: t("home.testimonios.quote3"), name: t("home.testimonios.name3"), context: t("home.testimonios.context3") },
  ];

  return (
    <section className="py-20 md:py-28 bg-background" aria-labelledby="testimonios-heading">
      <div className="container mx-auto px-6">
        <div className="mb-14 md:mb-16 text-center">
          <p className="label-sm mb-4">{t("home.testimonios.label")}</p>
          <h2
            id="testimonios-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-serif text-foreground leading-tight max-w-2xl mx-auto"
          >
            {t("home.testimonios.heading")}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {testimonios.map((item) => (
            <blockquote key={item.name} className="flex flex-col border-t border-border pt-8">
              <p className="text-[15px] md:text-base leading-relaxed text-foreground font-serif italic flex-1 mb-6">
                "{item.quote}"
              </p>
              <footer>
                <p className="text-sm font-sans font-semibold text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground font-sans">{item.context}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimoniosSection;
