import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import DynamicHeroBanner from "@/components/DynamicHeroBanner";
import produccionHeader from "@/assets/produccion-header.jpg";

const Produccion = () => (
  <Layout>
    <SEO
      title="Producción"
      description="Piezas de cerámica funcional y contemporánea, realizadas a mano en torno y modelado. Series limitadas y piezas únicas."
      path="/produccion"
    />
    <DynamicHeroBanner
      sectionKey="produccion"
      fallbackSrc={produccionHeader}
      fallbackAlt="Colección de piezas de cerámica artesanal en el estudio"
      flush
      title="Producción"
    />

    {/* Two-column content */}
    <section className="pt-[37px] md:pt-[46px] pb-10 md:pb-14">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-[2.1rem] font-serif text-foreground leading-snug">
              La producción de piezas FA Pottery se centra en cerámica funcional
              y contemporánea, realizada a mano en torno y mediante técnicas de
              modelado.
            </h2>
          </div>

          <div className="space-y-5">
            <p className="body-text">
              Trabajo con series pequeñas, ediciones limitadas y piezas únicas, permitiendo que cada objeto conserve las huellas del proceso y del material. Las variaciones entre piezas no son un error, sino parte de su identidad.
            </p>
            <p className="body-text">
              Cada objeto está pensado para ser usado, habitado y acompañado en la vida cotidiana.
            </p>

            <ul className="space-y-1.5 text-[15px] md:text-base text-foreground font-sans pl-5 pt-2" aria-label="Tipos de producción">
              <li className="list-disc">Piezas funcionales</li>
              <li className="list-disc">Series limitadas</li>
              <li className="list-disc">Piezas únicas / de autor</li>
            </ul>

            <a
              href="https://wa.me/+34681816030"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline mt-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              ¡DÉMOSLE FORMA A TU IDEA!
            </a>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default Produccion;
