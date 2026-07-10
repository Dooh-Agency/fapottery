import { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Link } from "@/components/LocalizedLink";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { useClassTypes, useClassSchedules, useCreateReservation, type ClassSchedule } from "@/hooks/useClasses";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { getLanguageFromPathname } from "@/i18n";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, CalendarDays, Clock, Users, MapPin, ExternalLink } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const ClaseDetalle = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { t } = useTranslation();
  const isEn = getLanguageFromPathname(location.pathname) === "en";
  const dateLocale = isEn ? enUS : es;
  const { data: classTypes, isLoading: loadingTypes } = useClassTypes(true);
  const item = classTypes?.find((ct) => ct.id === id);
  const { data: schedules, isLoading: loadingSchedules } = useClassSchedules(id);
  const createReservation = useCreateReservation();

  const [selectedSchedule, setSelectedSchedule] = useState<ClassSchedule | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "stripe">("cash");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ fullName?: string; email?: string }>({});

  const openBooking = (schedule: ClassSchedule) => {
    setSelectedSchedule(schedule);
    setFullName("");
    setEmail("");
    setPhone("");
    setPaymentMethod("cash");
    setErrors({});
    setBookingOpen(true);
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!fullName.trim()) newErrors.fullName = t("claseDetalle.errorNombre");
    if (!email.trim()) newErrors.email = t("claseDetalle.errorEmailRequerido");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = t("claseDetalle.errorEmailInvalido");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBook = async () => {
    if (!validate() || !selectedSchedule) return;
    setSubmitting(true);

    try {
      if (paymentMethod === "stripe") {
        const res = await createReservation.mutateAsync({
          schedule_id: selectedSchedule.id,
          full_name: fullName.trim(),
          email: email.trim(),
          phone: phone.trim() || null,
          payment_method: "stripe",
          payment_status: "pending",
        });

        const { data, error } = await supabase.functions.invoke("create-class-checkout", {
          body: { reservation_id: res.id, schedule_id: selectedSchedule.id },
        });
        if (error) throw error;
        if (data?.url) window.open(data.url, "_blank");
        toast.success(t("claseDetalle.toastRedirigiendo"));
        setBookingOpen(false);
      } else {
        await createReservation.mutateAsync({
          schedule_id: selectedSchedule.id,
          full_name: fullName.trim(),
          email: email.trim(),
          phone: phone.trim() || null,
          payment_method: "cash",
          payment_status: "pending",
        });
        toast.success(t("claseDetalle.toastReservaOk"));
        setBookingOpen(false);
      }
    } catch (e: any) {
      toast.error(e.message || t("claseDetalle.toastError"));
    } finally {
      setSubmitting(false);
    }
  };

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
        <SEO title={t("claseDetalle.noEncontradaTitle")} path="/clases" />
        <section className="section-padding">
          <div className="container mx-auto px-6 text-center">
            <h1 className="font-serif text-2xl mb-4">{t("claseDetalle.noEncontradaTitle")}</h1>
            <Link to="/clases" className="body-text underline">← {t("claseDetalle.volver")}</Link>
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

  return (
    <Layout>
      <SEO title={title} description={description?.slice(0, 155) || ""} path={`/clases/${item.id}`} />
      <section className="pt-10 md:pt-14 pb-20 md:pb-28">
        <div className="container mx-auto px-6">
          <Link to="/clases" className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] font-sans text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" /> {t("claseDetalle.volver")}
          </Link>

          {cta.image_url && (
            <div className="w-full aspect-[16/6] overflow-hidden mb-10">
              <img
                src={cta.image_url}
                alt={title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Columna principal */}
            <div className="lg:col-span-2 space-y-6">
              <h1 className="font-serif font-bold text-2xl md:text-3xl lg:text-4xl mb-2">{title}</h1>

              {description && (
                <div className="body-text whitespace-pre-line space-y-4">{description}</div>
              )}

              {faq.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-base font-semibold text-foreground mb-3">{t("claseDetalle.faqTitle")}</h2>
                  <Accordion type="single" collapsible className="w-full">
                    {faq.map((f, i) => (
                      <AccordionItem key={i} value={`faq-${i}`}>
                        <AccordionTrigger className="text-sm text-left font-medium">
                          {f.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground whitespace-pre-line">
                          {f.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              )}
            </div>

            {/* Columna lateral — info + reserva */}
            <div className="space-y-5">
              <div className="border border-border bg-card p-5 space-y-4">
                {Number(item.price) > 0 && (
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

                {loadingSchedules ? (
                  <p className="text-sm text-muted-foreground pt-2 border-t border-border">{t("claseDetalle.cargandoFechas")}</p>
                ) : upcoming.length > 0 ? (
                  <div className="space-y-2 pt-2 border-t border-border">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("claseDetalle.proximasFechas")}</p>
                    {upcoming.map((s) => (
                      <div key={s.id} className="space-y-1">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          <span className="text-sm font-medium capitalize">
                            {format(new Date(s.scheduled_date + "T00:00:00"), dateLocale === enUS ? "EEEE d MMMM" : "EEEE d 'de' MMMM", { locale: dateLocale })}
                          </span>
                        </div>
                        <div className="flex items-center justify-between pl-5">
                          <span className="text-xs text-muted-foreground">{formatTime(s.start_time)} – {formatTime(s.end_time)}</span>
                          <Badge variant={s.spots_available > 0 ? "default" : "secondary"} className="text-[10px]">
                            {s.spots_available > 0 ? t("claseDetalle.vacantes", { count: s.spots_available }) : t("claseDetalle.completo")}
                          </Badge>
                        </div>
                        {s.notes && <p className="text-xs text-muted-foreground italic pl-5">{s.notes}</p>}
                        <Button
                          className="w-full mt-1"
                          variant="default"
                          disabled={s.spots_available <= 0}
                          onClick={() => openBooking(s)}
                        >
                          {s.spots_available > 0 ? t("claseDetalle.apuntarme") : t("claseDetalle.sinVacantes")}
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground pt-2 border-t border-border">
                    {t("claseDetalle.sinFechas")}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Dialog */}
      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-serif">{t("claseDetalle.reservarClase")}</DialogTitle>
          </DialogHeader>
          {selectedSchedule && (
            <form
              className="space-y-4"
              onSubmit={(e) => { e.preventDefault(); handleBook(); }}
              noValidate
            >
              <p className="text-sm text-muted-foreground">
                {title} — {format(new Date(selectedSchedule.scheduled_date + "T00:00:00"), "EEEE d MMM yyyy", { locale: dateLocale })} · {formatTime(selectedSchedule.start_time)}
              </p>

              <div className="space-y-1">
                <Label htmlFor="booking-name">{t("claseDetalle.nombreCompleto")} <span aria-hidden="true">*</span></Label>
                <Input id="booking-name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder={t("claseDetalle.nombrePlaceholder")} required autoComplete="name" aria-invalid={!!errors.fullName} aria-describedby={errors.fullName ? "name-error" : undefined} />
                {errors.fullName && <p id="name-error" className="text-xs text-destructive" role="alert">{errors.fullName}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="booking-email">{t("claseDetalle.email")} <span aria-hidden="true">*</span></Label>
                <Input id="booking-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" required autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} />
                {errors.email && <p id="email-error" className="text-xs text-destructive" role="alert">{errors.email}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="booking-phone">{t("claseDetalle.telefono")}</Label>
                <Input id="booking-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+34 600 000 000" autoComplete="tel" />
              </div>

              <fieldset className="space-y-2">
                <legend className="text-sm font-medium">{t("claseDetalle.metodoPago")}</legend>
                <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as "cash" | "stripe")}>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="cash" id="pay-cash" />
                    <Label htmlFor="pay-cash" className="font-normal text-sm">{t("claseDetalle.efectivo")}</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="stripe" id="pay-stripe" />
                    <Label htmlFor="pay-stripe" className="font-normal text-sm">{t("claseDetalle.tarjeta")}</Label>
                  </div>
                </RadioGroup>
                {paymentMethod === "stripe" && (
                  <p className="text-xs text-muted-foreground pt-1">{t("claseDetalle.senaInfo")}</p>
                )}
              </fieldset>

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? t("claseDetalle.procesando") : paymentMethod === "stripe" ? t("claseDetalle.pagarYReservar") : t("claseDetalle.confirmarReserva")}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default ClaseDetalle;
