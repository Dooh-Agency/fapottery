import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Link } from "@/components/LocalizedLink";
import { getLanguageFromPathname } from "@/i18n";
import { trackEvent } from "@/lib/analytics";
import { EVENT_INTEREST_KEY, useCreateEventInterestLead } from "@/hooks/useEventInterestLeads";

const WHATSAPP_NUMBER = "+34681816030";

const schema = z.object({
  full_name: z.string().trim().max(100).optional(),
  email: z.string().trim().email("Ingresá un email válido"),
  marketing_consent: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  source: "landing" | "popup" | "activity";
}

const COPY = {
  es: {
    title: "Empezá tu reserva",
    description: "Deja tu email y te enviaré por WhatsApp los datos para confirmar tu plaza en Breakfast & Paint: sábado 1 de agosto · 11:00 a 13:00.",
    name: "Nombre (opcional)",
    email: "Tu email",
    marketing: "Opcional: quiero recibir por email próximas actividades, piezas y novedades de FA Pottery.",
    privacy: "Usaré tus datos para enviarte la información de este evento. Puedes consultar cómo los trato en mi política de privacidad.",
    submit: "Continuar mi reserva",
    successTitle: "¡Listo! Ya recibí tus datos.",
    successDescription: "Escríbeme por WhatsApp para recibir los datos de la reserva y confirmar tu plaza.",
    whatsappPrompt: "¿Prefieres hablar ahora?",
    whatsappCta: "Escríbeme por WhatsApp",
    whatsapp: "¡Hola! Soy {{name}}. Me anoté con {{email}} en la preinscripción del Breakfast & Paint del sábado 1 de agosto, de 11:00 a 13:00 h. Quiero recibir la información para reservar.",
  },
  en: {
    title: "Start your booking",
    description: "Leave your email and we will send you the details on WhatsApp to confirm your place at Breakfast & Paint: Saturday, August 1 · 11 am to 1 pm.",
    name: "Name (optional)",
    email: "Your email",
    marketing: "Optional: I would like to receive upcoming activities, pieces and FA Pottery news by email.",
    privacy: "We will use your details to send information about this event. You can see how we handle them in our privacy policy.",
    submit: "Continue my booking",
    successTitle: "Your details have been received!",
    successDescription: "Write to us on WhatsApp to receive the booking details and confirm your place.",
    whatsappPrompt: "Would you rather talk now?",
    whatsappCta: "Write on WhatsApp",
    whatsapp: "Hi! I'm {{name}}. I registered with {{email}} for the Breakfast & Paint pre-registration list on Saturday, August 1, from 11:00 am to 1:00 pm. I'd like to receive the booking information.",
  },
} as const;

const EventInterestDialog = ({ open, onOpenChange, source }: Props) => {
  const location = useLocation();
  const lang = getLanguageFromPathname(location.pathname);
  const c = COPY[lang];
  const createLead = useCreateEventInterestLead();
  const [submittedLead, setSubmittedLead] = useState<{ email: string; name: string } | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { full_name: "", email: "", marketing_consent: false },
  });

  useEffect(() => {
    if (open) {
      form.reset();
      setSubmittedLead(null);
    }
  }, [open, form]);

  const onSubmit = async (values: FormValues) => {
    const params = new URLSearchParams(window.location.search);
    const email = values.email.toLowerCase();
    await createLead.mutateAsync({
      event_key: EVENT_INTEREST_KEY,
      entry_point: source,
      full_name: values.full_name || null,
      email,
      event_consent: true,
      marketing_consent: values.marketing_consent,
      source_path: location.pathname,
      referrer: document.referrer || null,
      utm_source: params.get("utm_source"),
      utm_medium: params.get("utm_medium"),
      utm_campaign: params.get("utm_campaign"),
      utm_content: params.get("utm_content"),
      utm_term: params.get("utm_term"),
    });

    trackEvent("generate_lead_event_interest", { event_key: EVENT_INTEREST_KEY, source, marketing_consent: values.marketing_consent });
    setSubmittedLead({ email, name: values.full_name?.trim() || "" });
  };

  const whatsappUrl = submittedLead
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(c.whatsapp.replace("{{name}}", submittedLead.name).replace("{{email}}", submittedLead.email))}`
    : "#";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">{c.title}</DialogTitle>
          <DialogDescription className="border-l-4 border-foreground bg-muted px-4 py-3 text-base leading-relaxed text-foreground">
            {c.description}
          </DialogDescription>
        </DialogHeader>
        {submittedLead ? (
          <div className="space-y-5 text-center">
            <CheckCircle2 className="mx-auto h-9 w-9 text-foreground" aria-hidden="true" />
            <div>
              <h3 className="font-serif text-2xl">{c.successTitle}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.successDescription}</p>
            </div>
            <div className="border-t border-border pt-5">
              <p className="text-sm text-muted-foreground">{c.whatsappPrompt}</p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("generate_lead_whatsapp", { event_key: EVENT_INTEREST_KEY, source })}
                className="mt-3 inline-flex items-center justify-center gap-2 text-sm font-medium underline underline-offset-4 hover:text-muted-foreground"
              >
                <MessageCircle className="h-4 w-4" /> {c.whatsappCta}
              </a>
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="full_name" render={({ field }) => (
              <FormItem><FormLabel>{c.name}</FormLabel><FormControl><Input autoComplete="name" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem><FormLabel>{c.email}</FormLabel><FormControl><Input type="email" autoComplete="email" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="marketing_consent" render={({ field }) => (
              <FormItem className="flex items-start gap-3 space-y-0">
                <FormControl><Checkbox checked={field.value} onCheckedChange={(checked) => field.onChange(checked === true)} /></FormControl>
                <FormLabel className="!mt-0 text-sm font-normal leading-snug">{c.marketing}</FormLabel>
              </FormItem>
            )} />
            <p className="text-xs leading-relaxed text-muted-foreground">
              {c.privacy} <Link to="/privacidad" className="underline underline-offset-2">{lang === "es" ? "Política de privacidad" : "Privacy policy"}</Link>.
            </p>
            <Button type="submit" className="w-full" disabled={createLead.isPending}>
              <MessageCircle className="mr-2 h-4 w-4" /> {createLead.isPending ? "…" : c.submit}
            </Button>
            {createLead.isError && <p className="text-sm text-destructive">{lang === "es" ? "No pudimos guardar tu preinscripción. Probá nuevamente." : "We could not save your registration. Please try again."}</p>}
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EventInterestDialog;
