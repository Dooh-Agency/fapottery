import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, MessageCircle, ArrowRight } from "lucide-react";
import { Link } from "@/components/LocalizedLink";
import { getLanguageFromPathname } from "@/i18n";
import EventInterestDialog from "@/components/EventInterestDialog";

// Lightbox de promoción del evento "Breakfast & Paint" (sábado 18 de julio).
// - Aparece solo en la Home (se monta desde Index).
// - Se muestra una vez por sesión, a los ~3 segundos.
// - Se auto-desactiva pasado el evento, para no dejar un popup vencido.
// Enlaza a la landing /breakfast-and-paint y a la lista de interés del próximo evento.

const EVENT_END = new Date("2026-07-18T23:59:00+02:00");
const SESSION_KEY = "bp-promo-sold-out-2026-07-18-shown";
const PROMO_IMG =
  "https://pglbbwycichoaeltulin.supabase.co/storage/v1/object/public/class-images/7ad16f01-f5eb-416b-86cd-396acda40cba.png";

const COPY = {
  es: {
    badge: "Sábado 18 de julio · Málaga",
    soldOut: "VACANTES AGOTADAS",
    waitlist: "Lista de interés abierta para el próximo evento.",
    cta: "Ver el evento",
    wa: "Quiero recibir info del próximo evento",
    close: "Cerrar",
    whatsapp:
      "¡Hola! Quiero sumarme a la lista de interés para el próximo evento de «Workshop: Pinta tu Set de Desayuno»: sábado 1 de agosto, de 11:00 a 13:00 h. ¿Me enviáis la información para reservar?",
  },
  en: {
    badge: "Saturday, July 18 · Málaga",
    soldOut: "SOLD OUT",
    waitlist: "Interest list open for the next event.",
    cta: "See the event",
    wa: "Get info about the next event",
    close: "Close",
    whatsapp:
      "Hi! I'd like to join the interest list for the next Breakfast & Paint event: Saturday, August 1, from 11:00 am to 1:00 pm. Could you send me the booking information?",
  },
} as const;

const EventPromoModal = () => {
  const location = useLocation();
  const lang = getLanguageFromPathname(location.pathname);
  const c = COPY[lang];
  const [open, setOpen] = useState(false);
  const [interestOpen, setInterestOpen] = useState(false);

  useEffect(() => {
    if (Date.now() > EVENT_END.getTime()) return; // evento pasado — no mostrar
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return; // ya se mostró en esta sesión
    } catch {
      /* sessionStorage no disponible: mostrar igual */
    }
    const timer = setTimeout(() => {
      setOpen(true);
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* noop */
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[100] bg-foreground/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="fixed left-1/2 top-1/2 z-[100] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 overflow-hidden border border-foreground bg-background shadow-xl focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
        >
          <div className="relative">
            <img src={PROMO_IMG} alt="" className="h-40 w-full object-cover" />
            <span className="absolute left-4 top-4 bg-background/90 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.15em] text-foreground">
              {c.badge}
            </span>
            <DialogPrimitive.Close
              aria-label={c.close}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center bg-background/90 text-foreground transition-colors hover:bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <X className="h-4 w-4" />
            </DialogPrimitive.Close>
          </div>

          <div className="p-6 text-center">
            <DialogPrimitive.Title
              className="font-serif text-3xl font-normal leading-none tracking-[-0.02em] text-foreground"
              style={{ fontVariationSettings: "'opsz' 96" }}
            >
              Breakfast &amp; Paint
            </DialogPrimitive.Title>
            <div className="mt-4 space-y-2">
              <p className="inline-flex bg-foreground px-3 py-1.5 font-sans text-xs font-bold uppercase tracking-[0.16em] text-background">
                {c.soldOut}
              </p>
              <p className="body-text text-sm text-muted-foreground">{c.waitlist}</p>
            </div>

            <div className="mt-6 flex flex-col gap-2.5">
              <Link
                to="/breakfast-and-paint"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center gap-2 border border-foreground bg-foreground px-6 py-3.5 font-sans text-xs uppercase tracking-[0.2em] text-primary-foreground transition-colors duration-300 hover:bg-transparent hover:text-foreground"
              >
                {c.cta} <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                type="button"
                onClick={() => setInterestOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 text-xs uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-foreground"
              >
                <MessageCircle className="h-3.5 w-3.5" /> {c.wa}
              </button>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
      <EventInterestDialog open={interestOpen} onOpenChange={setInterestOpen} source="popup" />
    </DialogPrimitive.Root>
  );
};

export default EventPromoModal;
