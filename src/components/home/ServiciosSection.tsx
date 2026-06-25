import { Link } from "react-router-dom";
import clasesRegularesImg from "@/assets/fa-clases-regulares.avif";
import workshopsImg from "@/assets/fa-workshops.avif";
import produccionImg from "@/assets/produccion-header.avif";

const servicios = [
  {
    image: clasesRegularesImg,
    label: "Propuesta educativa",
    title: "Clases de torno y modelado",
    description:
      "Grupos reducidos para garantizar un acompañamiento cercano. Clases regulares, workshops y sesiones personalizadas.",
    price: "Desde €35 / clase",
    cta: { label: "Ver clases y reservar", to: "/clases" },
  },
  {
    image: workshopsImg,
    label: "Experiencias",
    title: "Workshops para empresas y espacios",
    description:
      "Actividades cerámicas adaptadas al contexto: team building, eventos culturales, instancias formativas en tu espacio.",
    price: "Consultar precio",
    cta: { label: "Consultar disponibilidad", to: "/colaboraciones" },
  },
  {
    image: produccionImg,
    label: "Tienda",
    title: "Piezas de cerámica artesanal",
    description:
      "Piezas funcionales y únicas, realizadas a mano en torno y modelado. Series limitadas que podés llevarte a casa.",
    price: "Desde €18",
    cta: { label: "Explorar tienda", to: "/tienda" },
  },
];

const ServiciosSection = () => (
  <section className="py-20 md:py-28 bg-cream" aria-labelledby="servicios-heading">
    <div className="container mx-auto px-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14 md:mb-16">
        <h2
          id="servicios-heading"
          className="text-2xl sm:text-3xl md:text-4xl font-serif text-foreground leading-tight max-w-sm"
        >
          ¿Qué podés encontrar en FA Pottery?
        </h2>
        <p className="text-[15px] md:text-base text-muted-foreground font-sans max-w-xs">
          Clases, piezas y experiencias cerámicas. Todo con una mirada de diseño y un proceso artesanal.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
        {servicios.map((s) => (
          <article key={s.title} className="flex flex-col bg-background group">
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={s.image}
                alt={s.title}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500 motion-reduce:transition-none"
                loading="lazy"
              />
            </div>
            <div className="p-6 flex flex-col flex-1">
              <p className="label-sm mb-3">{s.label}</p>
              <h3 className="font-serif text-lg md:text-xl text-foreground leading-snug mb-3">
                {s.title}
              </h3>
              <p className="text-[14px] md:text-[15px] leading-relaxed text-muted-foreground font-sans mb-4 flex-1">
                {s.description}
              </p>
              <p className="text-sm font-sans font-semibold text-foreground mb-5">
                {s.price}
              </p>
              <Link
                to={s.cta.to}
                className="btn-outline-sm text-center"
              >
                {s.cta.label}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default ServiciosSection;
