import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { usePublishedPieces, type Piece } from "@/hooks/usePieces";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, MessageCircle, CreditCard, ChevronLeft, ChevronRight } from "lucide-react";

const categoryLabels: Record<Piece["category"], string> = {
  tazas: "Tazas",
  platos: "Platos",
  bowls: "Bowls",
  jarrones: "Jarrones",
  decoracion: "Decoración",
  otro: "Otro",
};

const PiezaDetalle = () => {
  const { id } = useParams<{ id: string }>();
  const { data: pieces, isLoading } = usePublishedPieces();
  const piece = pieces?.find((p) => p.id === id);
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [purchasing, setPurchasing] = useState(false);
  const { toast } = useToast();

  const images = piece?.images?.filter(Boolean) ?? [];

  const whatsappUrl = (p: Piece) =>
    `https://wa.me/+34681816030?text=${encodeURIComponent(`Hola! Me interesa la pieza "${p.title}" (€${p.price}). ¿Está disponible?`)}`;

  const handleBuy = async (p: Piece) => {
    setPurchasing(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-piece-checkout", {
        body: { pieceId: p.id },
      });
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
    setPurchasing(false);
  };

  if (isLoading) {
    return (
      <Layout>
        <section className="section-padding">
          <div className="container mx-auto px-6 text-center">
            <p className="text-muted-foreground text-sm">Cargando…</p>
          </div>
        </section>
      </Layout>
    );
  }

  if (!piece) {
    return (
      <Layout>
        <SEO title="Pieza no encontrada" path="/tienda" />
        <section className="section-padding">
          <div className="container mx-auto px-6 text-center">
            <h1 className="font-serif text-2xl mb-4">Pieza no encontrada</h1>
            <Link to="/tienda" className="body-text underline">← Volver a la tienda</Link>
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
            <ArrowLeft className="h-4 w-4" /> Volver a la tienda
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
                      aria-label={`Ver imagen ${idx + 1}`}
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
                    alt={`${piece.title} — imagen ${selectedImgIdx + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">Sin imagen</div>
                )}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImgIdx((i) => (i - 1 + images.length) % images.length)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 rounded-full p-1.5 hover:bg-background transition-colors"
                      aria-label="Imagen anterior"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setSelectedImgIdx((i) => (i + 1) % images.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 rounded-full p-1.5 hover:bg-background transition-colors"
                      aria-label="Imagen siguiente"
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
                {piece.stock > 0 ? `${piece.stock} disponible(s)` : "Agotado"}
              </p>

              {piece.stock > 0 && (
                <div className="space-y-3">
                  <button
                    onClick={() => handleBuy(piece)}
                    disabled={purchasing}
                    className="btn-outline flex items-center justify-center gap-2"
                  >
                    <CreditCard className="h-4 w-4" aria-hidden="true" />
                    {purchasing ? "Procesando..." : "Comprar ahora"}
                  </button>
                  <a
                    href={whatsappUrl(piece)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline flex items-center justify-center gap-2 !bg-transparent"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden="true" /> Consultar por WhatsApp
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PiezaDetalle;
