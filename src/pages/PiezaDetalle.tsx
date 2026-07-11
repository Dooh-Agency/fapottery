import { useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Link } from "@/components/LocalizedLink";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { usePublishedPieces, type Piece } from "@/hooks/usePieces";
import { ArrowLeft, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";

const PiezaDetalle = () => {
  const { id } = useParams<{ id: string }>();
  const { data: pieces, isLoading } = usePublishedPieces();
  const piece = pieces?.find((p) => p.id === id);
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const { t } = useTranslation();

  const categoryLabels: Record<Piece["category"], string> = {
    tazas: t("catalogo.categoriaTazas"),
    platos: t("catalogo.categoriaPlatos"),
    bowls: t("catalogo.categoriaBowls"),
    jarrones: t("catalogo.categoriaJarrones"),
    decoracion: t("catalogo.categoriaDecoracion"),
    otro: t("catalogo.categoriaOtro"),
  };

  const images = piece?.images?.filter(Boolean) ?? [];

  const whatsappUrl = (p: Piece) =>
    `https://wa.me/+34681816030?text=${encodeURIComponent(t("piezaDetalle.whatsappMensaje", { title: p.title, price: p.price }))}`;

  if (isLoading) {
    return (
      <Layout>
        <section className="section-padding">
          <div className="container mx-auto px-6 text-center">
            <p className="text-muted-foreground text-sm">{t("piezaDetalle.cargando")}</p>
          </div>
        </section>
      </Layout>
    );
  }

  if (!piece) {
    return (
      <Layout>
        <SEO title={t("piezaDetalle.noEncontradaTitle")} path="/tienda" />
        <section className="section-padding">
          <div className="container mx-auto px-6 text-center">
            <h1 className="font-serif text-2xl mb-4">{t("piezaDetalle.noEncontradaTitle")}</h1>
            <Link to="/tienda" className="body-text underline">← {t("piezaDetalle.volver")}</Link>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO title={piece.title} description={piece.description?.slice(0, 155) || `${piece.title} — €${piece.price}`} path={`/tienda/${piece.id}`} />
      <section className="pt-10 md:pt-14 pb-20 md:pb-28">
        <div className="container mx-auto px-6">
          <Link to="/tienda" className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] font-sans text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" /> {t("piezaDetalle.volver")}
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
            {/* Gallery */}
            <div className="flex flex-col-reverse md:flex-row gap-3">
              {/* Thumbnails — vertical sidebar like Kanso */}
              {images.length > 1 && (
                <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:max-h-[600px] shrink-0">
                  {images.map((url, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImgIdx(idx)}
                      className={`w-16 h-16 md:w-20 md:h-20 flex-shrink-0 overflow-hidden border-2 transition-colors ${
                        idx === selectedImgIdx ? "border-foreground" : "border-transparent hover:border-border"
                      }`}
                      aria-label={t("piezaDetalle.verImagen", { n: idx + 1 })}
                      aria-current={idx === selectedImgIdx ? "true" : undefined}
                    >
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Main image */}
              <div className="relative flex-1 aspect-square bg-muted overflow-hidden">
                {images.length > 0 ? (
                  <img
                    src={images[selectedImgIdx]}
                    alt={piece.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">{t("catalogo.sinImagen")}</div>
                )}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImgIdx((i) => (i - 1 + images.length) % images.length)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 rounded-full p-1.5 hover:bg-background transition-colors"
                      aria-label={t("piezaDetalle.imagenAnterior")}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setSelectedImgIdx((i) => (i + 1) % images.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 rounded-full p-1.5 hover:bg-background transition-colors"
                      aria-label={t("piezaDetalle.imagenSiguiente")}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-col">
              <p className="label-sm mb-3">{categoryLabels[piece.category]}</p>
              <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl mb-3">{piece.title}</h1>
              <p className="font-serif text-xl md:text-2xl mb-6">€{piece.price}</p>

              {piece.description && (
                <p className="body-text mb-6 whitespace-pre-line">{piece.description}</p>
              )}

              <p className="text-xs text-muted-foreground mb-8">
                {piece.stock > 0 ? t("piezaDetalle.disponibles", { count: piece.stock }) : t("piezaDetalle.agotado")}
              </p>

              {piece.stock > 0 && (
                <a
                  href={whatsappUrl(piece)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline flex items-center justify-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" /> {t("piezaDetalle.consultarWhatsapp")}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PiezaDetalle;
