import { useState } from "react";
import { useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Link } from "@/components/LocalizedLink";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getLanguageFromPathname } from "@/i18n";
import { CalendarDays, MapPin, Users, Check, MessageCircle, ExternalLink } from "lucide-react";
import inspiracionFresas from "@/assets/inspiracion-fresas.png";
import lugarMaui from "@/assets/lugar-maui.jpg";
import florenciaTaller from "@/assets/flor-taller.png";
import potteryBananas from "@/assets/pottery.bananas.png";
import EventInterestDialog from "@/components/EventInterestDialog";

// Landing de campaña para el workshop "Breakfast & Paint" (sábado 18 de julio).
// Pensada como destino del anuncio/reel de Instagram: una sola pieza, un solo objetivo
// (lista de espera por WhatsApp cuando se agota el aforo). Reutiliza el sistema visual del sitio: Gilroy, paleta crema/oliva,
// esquinas rectas y tipografía editorial con énfasis en itálica.
// Bilingüe es/en: el mismo componente sirve /breakfast-and-paint y /en/breakfast-and-paint;
// el idioma se resuelve por la ruta (getLanguageFromPathname) y el copy vive en el diccionario COPY.

const MAPS_URL = "https://maps.app.goo.gl/mXd7rfaHWKiPZJ9A7";
// Maui Paddle Surf · Playa Butibamba (Mijas): 36.5011708, -4.6830377
const MAP_EMBED = "https://maps.google.com/maps?q=36.5011708,-4.6830377&z=16&output=embed";
const ACTIVIDAD_ID = "56fbca84-e350-4738-a57f-9d6be48501cf";

// Foto limpia (escena de desayuno) para el fondo del hero — legible bajo el titular.
const HERO_IMG =
  "https://pglbbwycichoaeltulin.supabase.co/storage/v1/object/public/class-images/7ad16f01-f5eb-416b-86cd-396acda40cba.png";
// El flyer de la actividad (con texto y marca ya diseñados) funciona como imagen de compartir en redes.
const SOCIAL_IMG =
  "https://pglbbwycichoaeltulin.supabase.co/storage/v1/object/public/class-images/1783717916521.png";
const GALLERY = [
  "https://pglbbwycichoaeltulin.supabase.co/storage/v1/object/public/class-images/06d805a6-8304-4266-b7d8-f8d6619371f2.png",
  "https://pglbbwycichoaeltulin.supabase.co/storage/v1/object/public/class-images/a859371c-fa4d-4b48-af6d-eceeb5fc8beb.png",
  "https://pglbbwycichoaeltulin.supabase.co/storage/v1/object/public/class-images/600ac69e-8cc6-4e79-a07f-6e37f957ebc1.png",
  "https://pglbbwycichoaeltulin.supabase.co/storage/v1/object/public/class-images/59ca0a9f-a6f6-4380-8113-d966cc5ec773.png",
  inspiracionFresas,
  potteryBananas,
];

const COPY = {
  es: {
    seoTitle: "Breakfast & Paint · Cupos agotados",
    seoDesc:
      "El workshop Breakfast & Paint del sábado 18 de julio en Málaga tiene los cupos agotados. La lista de interés está abierta para el próximo evento.",
    whatsapp:
      "¡Hola! Quiero sumarme a la lista de interés para el próximo evento de «Workshop: Pinta tu Set de Desayuno»: sábado 1 de agosto, de 11:00 a 13:00 h. ¿Me enviáis la información para reservar?",
    heroLabel: "Sábado 18 de julio · Málaga · a pasos del mar",
    heroStatus: "CUPOS AGOTADOS",
    heroWaitlist: "Lista de interés abierta para el próximo evento.",
    heroLeadStrong: "Pinta tu propio Set de cerámica,",
    heroLeadRest:
      " mientras desayunas a pasos del mar. En unos días te lo llevarás a casa, listo para usar.",
    heroCta: "Quiero recibir info del próximo evento",
    perPerson: "/ persona",
    strip: ["CUPOS AGOTADOS", "2 horas de taller", "Set de cerámica incluido", "Desayuno a pasos del mar"],
    planLabel: "El plan",
    planLeadPre: "¿Hay algo mejor que empezar el día con un buen desayuno? Sí: ",
    planLeadEm: "hacerlo en una vajilla pintada por ti.",
    planBody:
      "Una mañana donde la creatividad se mezcla con el aroma del café y el placer de compartir. Pintas, desayunas y te llevas un objeto único, creado con tus manos. De la cocción y el acabado nos encargamos nosotros.",
    stepsLabel: "Cómo funciona",
    stepsTitle: "No necesitas experiencia previa",
    steps: [
      {
        titulo: "Decoras tu set",
        texto:
          "Recibes una taza de café con leche y una bandeja de cerámica. Con engobes, pigmentos y técnicas sencillas, creas un diseño completamente tuyo.",
      },
      {
        titulo: "Nosotros lo cocemos",
        texto:
          "Cocemos tus piezas con un acabado profesional. Tú solo disfrutas de la mañana y del desayuno compartido.",
      },
      {
        titulo: "Te lo llevas a casa",
        texto:
          "Pocos días después recoges tu set, listo para usar cada mañana. Un objeto único, hecho por ti.",
      },
    ],
    incluyeLabel: "Todo incluido",
    incluyeTitle: "Solo trae ganas de pasarlo bien",
    incluyeNote:
      "No necesitas experiencia previa, solo ganas de pasar un rato bonito y llevarte a casa un objeto único, creado por ti.",
    incluye: [
      "Set de desayuno de cerámica (taza + bandeja) listo para decorar.",
      "Todos los materiales, engobes y pigmentos que vas a necesitar.",
      "Cocción y acabado profesional de tus piezas, listas para usar.",
      "Desayuno: un café, un zumo natural y una mesa con frutas y cosas ricas para compartir.",
    ],
    detallesLabel: "Los detalles",
    detallesTitle: "Todo lo que necesitas saber",
    dFechaLabel: "Fecha",
    dFecha: "Sábado 18 de julio",
    dFechaSub: "De 11:00 a 13:00 h · 2 horas",
    dLugarLabel: "Lugar",
    dLugar: "Maui Paddle Surf",
    dLugarSub: "Playa Butibamba",
    dMapa: "Ver en Google Maps",
    dPrecioLabel: "Precio",
    dPrecio: "45 € por persona",
    dPrecioSub: "Todo incluido",
    dPlazasLabel: "Plazas",
    dPlazas: "Cupos agotados",
    dPlazasSub: "Lista de interés abierta",
    lugarLabel: "El lugar",
    lugarTitle: "A pasos del mar",
    lugarBody:
      "A pasitos de la playa Butibamba, en Maui Paddle Surf (Mijas Costa).",
    quienLabel: "Quién te recibe",
    quienTitle: "Hola, soy Flor",
    quienBody:
      "Soy diseñadora gráfica y ceramista. En este taller te acompaño paso a paso y a tu ritmo: no hace falta saber nada, solo animarse. Yo me encargo de que tu set quede bonito y salga del horno listo para tu próximo desayuno.",
    galeriaLabel: "Para inspirarte",
    galeriaTitle: "Lo que puedes crear",
    galeriaSub: "Ejemplos de sets pintados a mano en talleres como este.",
    faqLabel: "Preguntas frecuentes",
    faqTitle: "Antes de reservar",
    faq: [
      {
        q: "¿Necesito experiencia previa?",
        a: "Para nada. El taller está pensado para todos los niveles: usamos técnicas sencillas y te guiamos en todo momento para que tu diseño quede único y personal.",
      },
      {
        q: "¿Qué incluye el taller?",
        a: "El set de desayuno de cerámica (taza + bandeja), todos los materiales, engobes y pigmentos, la cocción y el acabado profesional de tus piezas, y un desayuno con un café, un zumo natural y una mesa con frutas y cosas ricas para compartir.",
      },
      {
        q: "¿Cuándo retiro mis piezas?",
        a: "Nosotros nos encargamos de cocer y dar acabado a tus piezas. Pocos días después del taller estarán listas para que las recojas y te las lleves a casa, preparadas para usar.",
      },
      {
        q: "¿Cómo reservo mi plaza?",
        a: "Los cupos para esta fecha están agotados. Súmate a la lista de interés y te enviaré la información para reservar el próximo evento.",
      },
    ],
    cierreLabel: "Cupos agotados",
    cierreTitlePre: "Este workshop ya está ",
    cierreTitleEm: "completo",
    cierreBody:
      "La edición del sábado 18 de julio en Maui Paddle Surf está completa. Súmate a la lista de interés y te enviaré la información para reservar el próximo evento.",
    cierreCta: "Quiero recibir info del próximo evento",
    cierreContact: "Te responde Florencia · FA Pottery Studio · +34 681 816 030",
    cierreLink: "Ver todos los detalles de la actividad",
  },
  en: {
    seoTitle: "Breakfast & Paint · Sold out",
    seoDesc:
      "The Breakfast & Paint workshop on Saturday, July 18 in Málaga is sold out. The interest list is open for the next event.",
    whatsapp:
      "Hi! I'd like to join the interest list for the next Breakfast & Paint event: Saturday, August 1, from 11:00 am to 1:00 pm. Could you send me the booking information?",
    heroLabel: "Saturday, July 18 · Málaga · steps from the sea",
    heroStatus: "SOLD OUT",
    heroWaitlist: "Interest list open for the next event.",
    heroLeadStrong: "Paint your own ceramic set",
    heroLeadRest:
      " while you have breakfast steps from the sea. In a few days you'll take it home, ready to use.",
    heroCta: "Get info about the next event",
    perPerson: "/ per person",
    strip: ["SOLD OUT", "2-hour workshop", "Ceramic set included", "Breakfast steps from the sea"],
    planLabel: "The plan",
    planLeadPre: "Is there anything better than starting the day with a good breakfast? Yes: ",
    planLeadEm: "doing it on tableware you painted yourself.",
    planBody:
      "A morning where creativity blends with the smell of coffee and the joy of sharing. You paint, you have breakfast, and you take home a one-of-a-kind object made with your own hands. We take care of the firing and finishing.",
    stepsLabel: "How it works",
    stepsTitle: "No experience needed",
    steps: [
      {
        titulo: "You decorate your set",
        texto:
          "You'll get a coffee cup and a ceramic tray. With engobes, pigments and simple techniques, you create a design that's entirely yours.",
      },
      {
        titulo: "We fire it for you",
        texto:
          "We fire your pieces with a professional finish. You just enjoy the morning and the shared breakfast.",
      },
      {
        titulo: "You take it home",
        texto:
          "A few days later you pick up your set, ready to use every morning. A unique object, made by you.",
      },
    ],
    incluyeLabel: "All included",
    incluyeTitle: "Just bring the will to enjoy it",
    incluyeNote:
      "No previous experience needed — just the wish to have a lovely time and take home a unique object, created by you.",
    incluye: [
      "A ceramic breakfast set (cup + tray) ready to decorate.",
      "All the materials, engobes and pigments you'll need.",
      "Professional firing and finishing of your pieces, ready to use.",
      "Breakfast: a coffee, a fresh juice and a table with fruit and tasty things to share.",
    ],
    detallesLabel: "The details",
    detallesTitle: "Everything you need to know",
    dFechaLabel: "Date",
    dFecha: "Saturday, July 18",
    dFechaSub: "From 11:00 to 13:00 · 2 hours",
    dLugarLabel: "Location",
    dLugar: "Maui Paddle Surf",
    dLugarSub: "Playa Butibamba",
    dMapa: "View on Google Maps",
    dPrecioLabel: "Price",
    dPrecio: "€45 per person",
    dPrecioSub: "Everything included",
    dPlazasLabel: "Spots",
    dPlazas: "Sold out",
    dPlazasSub: "Interest list open",
    lugarLabel: "The venue",
    lugarTitle: "Steps from the sea",
    lugarBody:
      "Just steps from Butibamba beach, at Maui Paddle Surf (Mijas Costa).",
    quienLabel: "Who you'll meet",
    quienTitle: "Hi, I'm Flor",
    quienBody:
      "I'm a graphic designer and ceramist. In this workshop I guide you step by step, at your own pace — no experience needed, just the will to give it a go. I'll make sure your set turns out beautiful and comes out of the kiln ready for your next breakfast.",
    galeriaLabel: "For inspiration",
    galeriaTitle: "What you can create",
    galeriaSub: "Examples of sets hand-painted in workshops like this one.",
    faqLabel: "FAQ",
    faqTitle: "Before you book",
    faq: [
      {
        q: "Do I need previous experience?",
        a: "Not at all. The workshop is designed for all levels: we use simple techniques and guide you throughout, so your design turns out unique and personal.",
      },
      {
        q: "What's included in the workshop?",
        a: "The ceramic breakfast set (cup + tray), all materials, engobes and pigments, professional firing and finishing of your pieces, and a breakfast with a coffee, a fresh juice and a table of fruit and tasty things to share.",
      },
      {
        q: "When do I pick up my pieces?",
        a: "We take care of firing and finishing your pieces. A few days after the workshop they'll be ready for you to pick up and take home, ready to use.",
      },
      {
        q: "How do I book my spot?",
        a: "This date is sold out. Join the interest list and we will send you the information to book the next event.",
      },
    ],
    cierreLabel: "Sold out",
    cierreTitlePre: "This workshop is already ",
    cierreTitleEm: "fully booked",
    cierreBody:
      "The Saturday, July 18 edition at Maui Paddle Surf is fully booked. Join the interest list and we will send you the information to book the next event.",
    cierreCta: "Get info about the next event",
    cierreContact: "Florencia will reply · FA Pottery Studio · +34 681 816 030",
    cierreLink: "See all the activity details",
  },
} as const;

const BreakfastPaint = () => {
  const location = useLocation();
  const lang = getLanguageFromPathname(location.pathname);
  const c = COPY[lang];
  const [interestOpen, setInterestOpen] = useState(false);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Breakfast & Paint — Pinta tu Set de Desayuno",
    startDate: "2026-07-18T11:00:00+02:00",
    endDate: "2026-07-18T13:00:00+02:00",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: "Maui Paddle Surf",
      address: "Playa Butibamba, Málaga, ES",
    },
    image: SOCIAL_IMG,
    description: c.seoDesc,
    offers: {
      "@type": "Offer",
      price: "45",
      priceCurrency: "EUR",
      availability: "https://schema.org/SoldOut",
      url: "https://fapottery.com/breakfast-and-paint",
    },
    organizer: { "@type": "Organization", name: "FA Pottery Studio", url: "https://fapottery.com" },
  };

  return (
    <Layout>
      <SEO
        title={c.seoTitle}
        description={c.seoDesc}
        path="/breakfast-and-paint"
        image={SOCIAL_IMG}
        type="event"
        jsonLd={jsonLd}
      />

      {/* ─────────────── HERO ─────────────── */}
      <section
        className="relative h-[88vh] min-h-[560px] flex flex-col justify-end"
        aria-label="Breakfast & Paint"
      >
        <div className="absolute inset-0" aria-hidden="true">
          <img src={HERO_IMG} alt="" className="w-full h-full object-cover" />
        </div>
        <div
          className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/35 to-foreground/15"
          aria-hidden="true"
        />

        <div className="container mx-auto px-6 relative z-10 pb-12 md:pb-16 lg:pb-20">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-background/90 font-sans font-medium mb-5">
            {c.heroLabel}
          </p>
          <h1
            className="text-[3rem] sm:text-6xl md:text-7xl lg:text-[5.5rem] font-serif font-normal text-background text-left leading-[0.98] tracking-[-0.02em] mb-4"
            style={{ fontVariationSettings: "'opsz' 96", fontWeight: 400 }}
          >
            Breakfast <span className="text-background/85">&amp;</span> Paint
          </h1>
          <p className="max-w-lg mb-8 text-lg md:text-2xl leading-relaxed text-background/80 font-sans">
            <span className="font-semibold text-background">{c.heroLeadStrong}</span>
            {c.heroLeadRest}
          </p>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-stretch gap-3 sm:gap-0">
              <p className="inline-flex items-center justify-center border border-background bg-background px-5 py-4 font-sans text-xs font-bold uppercase tracking-[0.2em] text-foreground">
                {c.heroStatus}
              </p>
              <button
                type="button"
                onClick={() => setInterestOpen(true)}
                className="inline-flex items-center justify-center gap-2 border border-background bg-foreground/30 px-5 py-4 font-sans text-xs font-medium uppercase tracking-[0.12em] text-background transition-colors duration-300 hover:bg-background hover:text-foreground"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" /> {c.heroCta}
              </button>
            </div>
            <p className="text-sm text-background/90 font-sans">{c.heroWaitlist}</p>
            <p className="text-background/90 font-sans">
              <span className="font-serif text-2xl align-middle">€45</span>{" "}
              <span className="text-xs uppercase tracking-[0.15em] align-middle">{c.perPerson}</span>
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────── FRANJA DE DATOS ─────────────── */}
      <section className="bg-foreground text-background">
        <div className="container mx-auto px-6">
          <ul className="flex flex-wrap justify-center items-center gap-x-4 sm:gap-x-6 gap-y-2 py-4 text-[10px] sm:text-xs uppercase tracking-[0.2em] font-medium text-center">
            {c.strip.map((s, i) => (
              <li key={i} className="flex items-center gap-x-4 sm:gap-x-6">
                <span>{s}</span>
                {i < c.strip.length - 1 && (
                  <span className="text-background/40" aria-hidden="true">·</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─────────────── EL PLAN ─────────────── */}
      <section className="section-padding">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <p className="label-sm mb-6">{c.planLabel}</p>
          <p className="font-serif text-2xl md:text-3xl lg:text-[2.2rem] leading-[1.35] text-foreground">
            {c.planLeadPre}
            <span className="text-accent">{c.planLeadEm}</span>
          </p>
          <p className="body-text text-muted-foreground mt-8 max-w-xl mx-auto">{c.planBody}</p>
        </div>
      </section>

      {/* ─────────────── CÓMO FUNCIONA ─────────────── */}
      <section className="section-padding bg-secondary/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <p className="label-sm mb-4">{c.stepsLabel}</p>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground">{c.stepsTitle}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border">
            {c.steps.map((p, i) => (
              <div key={i} className="bg-background p-8 md:p-10">
                <span className="font-serif text-4xl text-accent block mb-5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-serif text-xl text-foreground mb-3">{p.titulo}</h3>
                <p className="body-text text-muted-foreground">{p.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────── QUÉ INCLUYE ─────────────── */}
      <section className="section-padding">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="label-sm mb-4">{c.incluyeLabel}</p>
              <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-6">{c.incluyeTitle}</h2>
              <p className="font-serif text-lg text-muted-foreground border-l-2 border-accent pl-5">
                {c.incluyeNote}
              </p>
            </div>
            <ul className="space-y-5">
              {c.incluye.map((item, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <span
                    className="shrink-0 mt-0.5 w-6 h-6 border border-foreground flex items-center justify-center"
                    aria-hidden="true"
                  >
                    <Check className="h-3.5 w-3.5 text-foreground" />
                  </span>
                  <span className="body-text text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ─────────────── DETALLES ─────────────── */}
      <section className="section-padding bg-secondary/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <p className="label-sm mb-4">{c.detallesLabel}</p>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground">{c.detallesTitle}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border">
            <div className="bg-background p-8">
              <CalendarDays className="h-5 w-5 text-accent mb-4" aria-hidden="true" />
              <p className="label-sm mb-2">{c.dFechaLabel}</p>
              <p className="font-serif text-xl text-foreground leading-snug">{c.dFecha}</p>
              <p className="text-sm text-muted-foreground mt-1">{c.dFechaSub}</p>
            </div>
            <div className="bg-background p-8">
              <MapPin className="h-5 w-5 text-accent mb-4" aria-hidden="true" />
              <p className="label-sm mb-2">{c.dLugarLabel}</p>
              <p className="font-serif text-xl text-foreground leading-snug">{c.dLugar}</p>
              <p className="text-sm text-muted-foreground mt-1">{c.dLugarSub}</p>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-foreground underline underline-offset-2 mt-2"
              >
                {c.dMapa} <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <div className="bg-background p-8">
              <span className="block text-accent mb-4 font-serif text-lg leading-none">€</span>
              <p className="label-sm mb-2">{c.dPrecioLabel}</p>
              <p className="font-serif text-xl text-foreground leading-snug">{c.dPrecio}</p>
              <p className="text-sm text-muted-foreground mt-1">{c.dPrecioSub}</p>
            </div>
            <div className="bg-background p-8">
              <Users className="h-5 w-5 text-accent mb-4" aria-hidden="true" />
              <p className="label-sm mb-2">{c.dPlazasLabel}</p>
              <p className="font-serif text-xl text-foreground leading-snug">{c.dPlazas}</p>
              <p className="text-sm text-muted-foreground mt-1">{c.dPlazasSub}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────── EL LUGAR ─────────────── */}
      <section className="section-padding">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <p className="label-sm mb-4">{c.lugarLabel}</p>
              <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-6">{c.lugarTitle}</h2>
              <p className="body-text text-muted-foreground max-w-md">{c.lugarBody}</p>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-8 border border-foreground text-foreground font-sans text-xs tracking-[0.2em] uppercase px-6 py-3 hover:bg-foreground hover:text-background transition-colors duration-300"
              >
                {c.dMapa} <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
            <div className="space-y-4">
              <div className="aspect-[4/3] bg-muted overflow-hidden">
                <img src={lugarMaui} alt="Taller de cerámica montado en Maui Paddle Surf, Málaga" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="border border-border bg-muted">
                <iframe
                  title={c.lugarTitle}
                  src={MAP_EMBED}
                  className="w-full h-[260px] md:h-[300px] block"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────── GALERÍA ─────────────── */}
      <section className="section-padding bg-secondary/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <p className="label-sm mb-4">{c.galeriaLabel}</p>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground">{c.galeriaTitle}</h2>
            <p className="body-text text-muted-foreground mt-3">{c.galeriaSub}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {GALLERY.map((src, i) => (
              <div key={i} className="aspect-[4/5] bg-muted overflow-hidden">
                <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────── QUIÉN TE RECIBE ─────────────── */}
      <section className="section-padding">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="aspect-[4/5] bg-muted overflow-hidden lg:max-w-md">
              <img
                src={florenciaTaller}
                alt="Flor — FA Pottery Studio"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div>
              <p className="label-sm mb-4">{c.quienLabel}</p>
              <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-6">{c.quienTitle}</h2>
              <p className="body-text text-muted-foreground max-w-md">{c.quienBody}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────── FAQ ─────────────── */}
      <section className="section-padding bg-secondary/50">
        <div className="container mx-auto px-6 max-w-2xl">
          <div className="text-center mb-10">
            <p className="label-sm mb-4">{c.faqLabel}</p>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground">{c.faqTitle}</h2>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {c.faq.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left font-medium text-foreground">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ─────────────── CIERRE ─────────────── */}
      <section className="section-padding bg-foreground text-background">
        <div className="container mx-auto px-6 text-center max-w-2xl">
          <p className="text-[10px] uppercase tracking-[0.3em] text-background/60 mb-6">{c.cierreLabel}</p>
          <h2 className="font-serif text-3xl md:text-5xl leading-[1.1] mb-5">
            {c.cierreTitlePre}
            <span className="text-accent">{c.cierreTitleEm}</span>
          </h2>
          <p className="body-text text-background/80 max-w-lg mx-auto mb-10">{c.cierreBody}</p>
          <button
            type="button"
            onClick={() => setInterestOpen(true)}
            className="inline-flex items-center justify-center gap-2 border border-background bg-background text-foreground font-sans text-xs tracking-[0.2em] uppercase px-10 py-4 hover:bg-transparent hover:text-background transition-colors duration-300"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" /> {c.cierreCta}
          </button>
          <p className="text-xs text-background/50 mt-6">{c.cierreContact}</p>
          <div className="mt-8">
            <Link
              to={`/actividades/${ACTIVIDAD_ID}`}
              className="text-xs uppercase tracking-[0.15em] text-background/70 underline underline-offset-4 hover:text-background transition-colors"
            >
              {c.cierreLink}
            </Link>
          </div>
        </div>
      </section>
      <EventInterestDialog open={interestOpen} onOpenChange={setInterestOpen} source="landing" />
    </Layout>
  );
};

export default BreakfastPaint;
