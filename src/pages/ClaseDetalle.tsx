import { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Link } from "@/components/LocalizedLink";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { useClassTypes, useClassSchedules, type ClassSchedule } from "@/hooks/useClasses";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { getLanguageFromPathname } from "@/i18n";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarDays, Clock, Users, MapPin, ExternalLink, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { renderActivityDescription, renderBoldText } from "@/lib/richText";
import EventInterestDialog from "@/components/EventInterestDialog";

const WHATSAPP_NUMBER = "+34681816030";
const BREAKFAST_PAINT_ACTIVITY_ID = "56fbca84-e350-4738-a57f-9d6be48501cf";

const TIPO_LABEL_KEYS: Record<string, string> = {
  regulares: "claseDetalle.tipoRegulares",
  workshops: "claseDetalle.tipoWorkshops",
  personalizadas: "claseDetalle.tipoPersonalizadas",
};

const ClaseDetalle = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { t } = useTranslation();
  const isEn = getLanguageFromPathname(location.pathname) === "en";
  const dateLocale = isEn ? enUS : es;
  const { data: classTypes, isLoading: loadingTypes } = useClassTypes(true);
  const item = classTypes?.find((ct) => ct.id === id);
  const { data: schedules, isLoading: loadingSchedules } = useClassSchedules(id);
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState(0);
  const [interestOpen, setInterestOpen] = useState(false);

  const formatTime = (time: string) => time.slice(0, 5);

  const upcoming = (schedules || []).filter(
    (s) => !s.is_cancelled && new Date(s.scheduled_date + "T23:59:59") >= new Date()
  );

  if (loadingTypes) {
    return (
      <Layout>
        <section className="section-padding">
          <div className="container mx-auto px-6 text-center">
            <p className="text-muted-foreground text-sm">{t("claseDetalle.cargando")}</p>
          </div>
        </section>
      </Layout>
    );
  }

  if (!item) {
    return (
      <Layout>
        <SEO title={t("claseDetalle.noEncontradaTitle")} path="/actividades" />
        <section className="section-padding">
          <div className="container mx-auto px-6 text-center">
            <h1 className="font-serif text-2xl mb-4">{t("claseDetalle.noEncontradaTitle")}</h1>
            <Link to="/actividades" className="body-text underline">← {t("claseDetalle.volver")}</Link>
          </div>
        </section>
      </Layout>
    );
  }

  const cta = item as any;
  const title = (isEn && cta.title_en) || item.title;
  const description = (isEn && cta.description_en) || item.description;
  const faq: { question: string; answer: string }[] =
    (isEn && Array.isArray(cta.faq_en) && cta.faq_en.length > 0 ? cta.faq_en : Array.isArray(cta.faq) ? cta.faq : []);
  const galleryImages: string[] = item.images || [];
  const images: string[] = cta.image_url
    ? [cta.image_url, ...galleryImages.filter((url) => url !== cta.image_url)]
    : galleryImages;
  const tipoLabel = t(TIPO_LABEL_KEYS[cta.category] || TIPO_LABEL_KEYS.regulares);
  const options: { label: string; price: number }[] = Array.isArray(cta.options) ? cta.options : [];
  const selectedOption = options[selectedOptionIdx];
  const isBreakfastPaint = item.id === BREAKFAST_PAINT_ACTIVITY_ID;

  const whatsappUrl = (s: ClassSchedule) => {
    const dateStr = format(new Date(s.scheduled_date + "T00:00:00"), "EEEE d 'de' MMMM", { locale: dateLocale });
    const message = t("claseDetalle.whatsappMensaje", { title, date: dateStr, time: formatTime(s.start_time) });
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  const waitlistWhatsappUrl = (s: ClassSchedule) => {
    const dateStr = format(new Date(s.scheduled_date + "T00:00:00"), "EEEE d 'de' MMMM", { locale: dateLocale });
    const message = t("claseDetalle.whatsappMensajeListaEspera", { title, date: dateStr });
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  const optionWhatsappUrl = () => {
    if (!selectedOption) return "#";
    const message = t("claseDetalle.whatsappMensajeOpcion", { title, option: selectedOption.label, price: selectedOption.price });
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  return (
    <Layout>
      <SEO title={title} description={description?.slice(0, 155) || ""} path={`/actividades/${item.id}`} />
      <section className="pt-10 md:pt-14 pb-20 md:pb-28">
        <div className="container mx-auto px-6">
          <Link to="/actividades" className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] font-sans text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" /> {t("claseDetalle.volver")}
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Galería */}
            <div>
              {images.length > 0 ? (
                <div className="flex flex-col-reverse md:flex-row gap-3">
                  {/* Miniaturas — columna a la izquierda en desktop */}
                  {images.length > 1 && (
                    <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:justify-between md:self-stretch md:min-h-0 shrink-0 md:bg-secondary/50 md:p-2">
                      {images.map((url, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImgIdx(idx)}
                          className={`w-16 h-16 md:w-20 md:h-20 flex-shrink-0 overflow-hidden border-2 transition-colors ${
                            idx === selectedImgIdx ? "border-foreground" : "border-transparent hover:border-border"
                          }`}
                          aria-label={t("claseDetalle.verImagen", { n: idx + 1 })}
                          aria-current={idx === selectedImgIdx ? "true" : undefined}
                        >
                          <img src={url} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Imagen principal */}
                  <div className="relative flex-1 aspect-[4/5] bg-muted overflow-hidden">
                    <img
                      src={images[selectedImgIdx]}
                      alt={title}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={() => setSelectedImgIdx((i) => (i - 1 + images.length) % images.length)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/80 rounded-full p-1.5 hover:bg-background transition-colors"
                          aria-label={t("claseDetalle.imagenAnterior")}
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setSelectedImgIdx((i) => (i + 1) % images.length)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/80 rounded-full p-1.5 hover:bg-background transition-colors"
                          aria-label={t("claseDetalle.imagenSiguiente")}
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="aspect-[4/5] bg-muted flex items-center justify-center text-muted-foreground text-sm">
                  {t("claseDetalle.sinImagen")}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="space-y-6">
              <h1 className="font-serif font-bold text-2xl md:text-3xl lg:text-4xl">{title}</h1>

              {options.length === 0 && Number(item.price) > 0 && (
                <div>
                  <p className="text-2xl font-serif font-semibold text-foreground">€{item.price}</p>
                  <p className="text-xs text-muted-foreground">{t("claseDetalle.porPersona")}</p>
                </div>
              )}

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4 shrink-0" />
                  <span>{item.duration_minutes} {t("claseDetalle.minutos")}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4 shrink-0" />
                  <span>{t("claseDetalle.maxAlumnos", { count: item.max_students })}</span>
                </div>
                {cta.location_text && (
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                    <div>
                      <span>{cta.location_text}</span>
                      {cta.location_map_url && (
                        <a
                          href={cta.location_map_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-foreground underline underline-offset-2 mt-0.5"
                        >
                          {t("claseDetalle.verMapa")} <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {description && (
                <div className="body-text whitespace-pre-line space-y-4 pt-2 border-t border-border">{renderActivityDescription(description)}</div>
              )}

              <div className="pt-2 border-t border-border">
                {options.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("claseDetalle.elegirOpcion")}</p>
                    <div className="flex flex-wrap gap-2">
                      {options.map((opt, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedOptionIdx(idx)}
                          aria-pressed={selectedOptionIdx === idx}
                          className={`font-sans text-sm px-4 py-2.5 border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                            selectedOptionIdx === idx
                              ? "border-foreground bg-foreground text-primary-foreground"
                              : "border-border text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {opt.label} · €{opt.price}
                        </button>
                      ))}
                    </div>
                    <Button className="w-full mt-1" variant="default" asChild>
                      <a href={optionWhatsappUrl()} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="h-4 w-4 mr-1.5" aria-hidden="true" />
                        {t("claseDetalle.reservarWhatsapp", { tipo: tipoLabel })}
                      </a>
                    </Button>
                  </div>
                ) : loadingSchedules ? (
                  <p className="text-sm text-muted-foreground">{t("claseDetalle.cargandoFechas")}</p>
                ) : upcoming.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("claseDetalle.proximasFechas")}</p>
                    {upcoming.map((s) => (
                      <div key={s.id} className="space-y-1 border border-border bg-card p-3">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          <span className="text-sm font-medium capitalize">
                            {format(new Date(s.scheduled_date + "T00:00:00"), dateLocale === enUS ? "EEEE d MMMM" : "EEEE d 'de' MMMM", { locale: dateLocale })}
                          </span>
                        </div>
                        <div className="flex items-center justify-between pl-5">
                          <span className="text-xs text-muted-foreground">{formatTime(s.start_time)} – {formatTime(s.end_time)}</span>
                          <Badge variant={s.spots_available > 0 ? "default" : "secondary"} className="text-[10px]">
                            {s.spots_available > 0 ? t("claseDetalle.vacantes", { count: s.spots_available }) : isBreakfastPaint ? t("claseDetalle.cuposAgotados") : t("claseDetalle.completo")}
                          </Badge>
                        </div>
                        {s.notes && <p className="text-xs text-muted-foreground italic pl-5">{s.notes}</p>}
                        {s.spots_available > 0 ? (
                          <Button className="w-full mt-1" variant="default" asChild>
                            <a href={whatsappUrl(s)} target="_blank" rel="noopener noreferrer">
                              <MessageCircle className="h-4 w-4 mr-1.5" aria-hidden="true" />
                              {t("claseDetalle.reservarWhatsapp", { tipo: tipoLabel })}
                            </a>
                          </Button>
                        ) : isBreakfastPaint ? (
                          <Button className="w-full mt-1" variant="default" onClick={() => setInterestOpen(true)}>
                            <MessageCircle className="h-4 w-4 mr-1.5" aria-hidden="true" />
                            {t("claseDetalle.listaInteresProximoEvento")}
                          </Button>
                        ) : (
                          <Button className="w-full mt-1" variant="default" asChild>
                            <a href={waitlistWhatsappUrl(s)} target="_blank" rel="noopener noreferrer">
                              <MessageCircle className="h-4 w-4 mr-1.5" aria-hidden="true" />
                              {t("claseDetalle.listaEsperaWhatsapp")}
                            </a>
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {t("claseDetalle.sinFechas")}
                  </p>
                )}
              </div>
            </div>
          </div>

          {faq.length > 0 && (
            <div className="mt-16 max-w-2xl">
              <h2 className="text-base font-semibold text-foreground mb-3">{t("claseDetalle.faqTitle")}</h2>
              <Accordion type="single" collapsible className="w-full">
                {faq.map((f, i) => (
                  <AccordionItem key={i} value={`faq-${i}`}>
                    <AccordionTrigger className="text-sm text-left font-medium">
                      {f.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground whitespace-pre-line">
                      {renderBoldText(f.answer)}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
        </div>
      </section>
      {isBreakfastPaint && <EventInterestDialog open={interestOpen} onOpenChange={setInterestOpen} source="activity" />}
    </Layout>
  );
};

export default ClaseDetalle;
