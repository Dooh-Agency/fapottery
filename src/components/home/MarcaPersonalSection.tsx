import { Link } from "react-router-dom";
import forma1 from "@/assets/forma1.svg";
import forma2 from "@/assets/forma2.svg";
import forma3 from "@/assets/forma3.svg";

const features = [
  {
    icon: forma1,
    title: "Producción artesanal",
    description:
      "Piezas hechas a mano, en series pequeñas o como objetos únicos. Cada pieza conserva las huellas del proceso y del material.",
    cta: { label: "Ver piezas", to: "/tienda" },
  },
  {
    icon: forma2,
    title: "Propuesta educativa",
    description:
      "Clases de torno y modelado en grupos reducidos, workshops y clases personalizadas para adultos y niños.",
    cta: { label: "Ver clases", to: "/clases" },
  },
  {
    icon: forma3,
    title: "Colaboraciones",
    description:
      "Experiencias cerámicas para talleres, empresas y espacios culturales. Proyectos a medida y team building.",
    cta: { label: "Colaborar", to: "/colaboraciones" },
  },
];

const MarcaPersonalSection = () => {
  return (
    <section className="py-20 md:py-28 bg-background" aria-labelledby="marca-personal-heading">
      <div className="container mx-auto px-6">
        {/* Top 3-column text grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-16 md:mb-24">
          <div>
            <h2 id="marca-personal-heading" className="text-2xl sm:text-3xl md:text-4xl font-serif text-foreground leading-tight">
              FA Pottery como marca personal
            </h2>
          </div>
          <div>
            <p className="text-[15px] md:text-base leading-relaxed text-foreground font-sans">
              Un espacio de trabajo y exploración donde cada pieza nace del contacto directo con el material, el tiempo y el proceso.
            </p>
          </div>
          <div>
            <p className="text-[15px] md:text-base leading-relaxed text-foreground font-sans">
              Desde Argentina y España, desarrollando una práctica arraigada en la cerámica funcional y contemporánea, combinando producción artesanal, series limitadas y piezas únicas. Junto con propuestas educativas y colaboraciones con talleres y espacios culturales.
            </p>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-border mb-16 md:mb-20" />

        {/* 3-column features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {features.map((feature) => (
            <div key={feature.title} className="flex flex-col items-start text-left">
              <div className="mb-6 h-16" aria-hidden="true">
                <img src={feature.icon} alt="" className="h-full w-auto" />
              </div>
              <h3 className="text-sm font-sans font-bold text-foreground mb-2 tracking-wide">
                {feature.title}
              </h3>
              <p className="text-[15px] md:text-base leading-relaxed text-foreground font-sans mb-6 flex-1">
                {feature.description}
              </p>
              <Link
                to={feature.cta.to}
                className="text-xs uppercase tracking-[0.2em] font-sans text-foreground border-b border-foreground pb-0.5 hover:opacity-60 transition-opacity"
              >
                {feature.cta.label} →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MarcaPersonalSection;
