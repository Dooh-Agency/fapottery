import { useState } from "react";
import { useTranslation } from "react-i18next";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import EventInterestDialog from "@/components/EventInterestDialog";
import { CalendarDays, Check, Clock3, MapPin, MessageCircle, Sparkles } from "lucide-react";
import lugarMaui from "@/assets/lugar-maui.jpg";
import florenciaTaller from "@/assets/flor-taller.png";
import inspiracionFresas from "@/assets/inspiracion-fresas.png";

const MAPS_URL = "https://maps.app.goo.gl/mXd7rfaHWKiPZJ9A7";
const SOCIAL_IMG = "https://pglbbwycichoaeltulin.supabase.co/storage/v1/object/public/class-images/1783717916521.png";

const BreakfastPaintAugust = () => {
  const { t } = useTranslation();
  const [interestOpen, setInterestOpen] = useState(false);
  const included = t("breakfastPaintAugust.included", { returnObjects: true }) as string[];

  return (
    <Layout>
      <SEO
        title={t("breakfastPaintAugust.seoTitle")}
        description={t("breakfastPaintAugust.seoDescription")}
        path="/breakfast-and-paint-agosto"
        image={SOCIAL_IMG}
      />

      <section className="bg-secondary/50">
        <div className="container mx-auto grid min-h-[calc(100svh-5rem)] items-stretch lg:grid-cols-[1.05fr_.95fr]">
          <div className="flex flex-col justify-between px-6 py-14 sm:px-10 lg:px-16 lg:py-20">
            <p className="label-sm">{t("breakfastPaintAugust.eyebrow")}</p>
            <div className="my-12 lg:my-0">
              <h1 className="font-serif text-5xl leading-[.92] tracking-[-.04em] text-foreground sm:text-7xl lg:text-[5.7rem]">
                Breakfast<br />&amp; <em className="text-accent">Paint</em>
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
                {t("breakfastPaintAugust.heroText")}
              </p>
            </div>
            <div className="max-w-xl border-t border-foreground pt-5">
              <div className="grid grid-cols-2 gap-4 text-sm text-foreground sm:grid-cols-3">
                <p><strong className="block font-serif text-xl">01.08</strong>{t("breakfastPaintAugust.dateShort")}</p>
                <p><strong className="block font-serif text-xl">11–13 h</strong>{t("breakfastPaintAugust.duration")}</p>
                <p><strong className="block font-serif text-xl">45 €</strong>{t("breakfastPaintAugust.allIncluded")}</p>
              </div>
              <button type="button" onClick={() => setInterestOpen(true)} className="mt-8 inline-flex items-center gap-2 bg-foreground px-7 py-4 text-xs font-medium uppercase tracking-[.18em] text-background transition-colors hover:bg-accent">
                <MessageCircle className="h-4 w-4" /> {t("breakfastPaintAugust.heroCta")}
              </button>
              <p className="mt-3 text-xs text-muted-foreground">{t("breakfastPaintAugust.depositNote")}</p>
            </div>
          </div>
          <div className="min-h-[440px] overflow-hidden bg-muted lg:min-h-full">
            <img src={inspiracionFresas} alt={t("breakfastPaintAugust.heroAlt")} className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-background">
        <div className="container mx-auto grid divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0">
          {[
            [CalendarDays, t("breakfastPaintAugust.date"), t("breakfastPaintAugust.dateValue")],
            [Clock3, t("breakfastPaintAugust.when"), t("breakfastPaintAugust.whenValue")],
            [MapPin, t("breakfastPaintAugust.where"), t("breakfastPaintAugust.whereValue")],
          ].map(([Icon, label, value]) => {
            const DetailIcon = Icon as typeof CalendarDays;
            return <div key={label as string} className="flex gap-4 px-6 py-6 sm:px-10"><DetailIcon className="mt-1 h-5 w-5 text-accent" /><p><span className="label-sm block mb-1">{label as string}</span><span className="font-serif text-lg">{value as string}</span></p></div>;
          })}
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="label-sm mb-5">{t("breakfastPaintAugust.experienceLabel")}</p>
            <h2 className="font-serif text-4xl leading-tight sm:text-5xl">{t("breakfastPaintAugust.experienceTitle")}</h2>
            <p className="body-text mt-7 max-w-xl text-muted-foreground">{t("breakfastPaintAugust.experienceText")}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <img src={lugarMaui} alt={t("breakfastPaintAugust.placeAlt")} className="aspect-[4/5] h-full w-full object-cover" loading="lazy" />
            <img src={florenciaTaller} alt={t("breakfastPaintAugust.florAlt")} className="mt-10 aspect-[4/5] h-full w-full object-cover" loading="lazy" />
          </div>
        </div>
      </section>

      <section className="section-padding bg-foreground text-background">
        <div className="container mx-auto grid gap-12 lg:grid-cols-[.75fr_1.25fr]">
          <div><p className="label-sm text-background/60">{t("breakfastPaintAugust.includedLabel")}</p><h2 className="mt-5 font-serif text-4xl leading-tight">{t("breakfastPaintAugust.includedTitle")}</h2></div>
          <ul className="grid gap-5 sm:grid-cols-2">
            {included.map((item) => <li key={item} className="flex gap-3 text-background/85"><Check className="mt-1 h-4 w-4 shrink-0 text-accent" />{item}</li>)}
          </ul>
        </div>
      </section>

      <section className="section-padding bg-secondary/50">
        <div className="container mx-auto max-w-3xl text-center">
          <Sparkles className="mx-auto h-6 w-6 text-accent" />
          <p className="label-sm mt-5">{t("breakfastPaintAugust.reserveLabel")}</p>
          <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">{t("breakfastPaintAugust.reserveTitle")}</h2>
          <p className="body-text mx-auto mt-6 max-w-xl text-muted-foreground">{t("breakfastPaintAugust.reserveText")}</p>
          <button type="button" onClick={() => setInterestOpen(true)} className="mt-9 inline-flex items-center gap-2 border border-foreground px-8 py-4 text-xs font-medium uppercase tracking-[.18em] transition-colors hover:bg-foreground hover:text-background">
            {t("breakfastPaintAugust.reserveCta")}
          </button>
        </div>
      </section>
      <EventInterestDialog open={interestOpen} onOpenChange={setInterestOpen} source="landing" />
    </Layout>
  );
};

export default BreakfastPaintAugust;
