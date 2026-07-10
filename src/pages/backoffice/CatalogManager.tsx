import { useState } from "react";
import { useAllPieces, useDeletePiece, type Piece } from "@/hooks/usePieces";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Pencil, Trash2 } from "lucide-react";
import PieceFormDialog from "@/components/backoffice/PieceFormDialog";
import OrdersList from "@/components/backoffice/OrdersList";
import GiftCardsList from "@/components/backoffice/GiftCardsList";

const categoryLabels: Record<Piece["category"], string> = {
  tazas: "Tazas",
  platos: "Platos",
  bowls: "Bowls",
  jarrones: "Jarrones",
  decoracion: "Decoración",
  otro: "Otro",
};

const CatalogManager = () => {
  const { data: pieces, isLoading } = useAllPieces();
  const deletePiece = useDeletePiece();
  const [editingPiece, setEditingPiece] = useState<Piece | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleDelete = (piece: Piece) => {
    if (confirm(`¿Eliminar "${piece.title}"?`)) {
      deletePiece.mutate(piece.id);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl">Tienda</h1>

      <Tabs defaultValue="pieces">
        <TabsList>
          <TabsTrigger value="pieces">Piezas</TabsTrigger>
          <TabsTrigger value="orders">Pedidos</TabsTrigger>
          <TabsTrigger value="giftcards">Bonos regalo</TabsTrigger>
        </TabsList>

        <TabsContent value="pieces" className="mt-4 space-y-6">
          <div className="flex items-center justify-end">
            <Button
              onClick={() => { setEditingPiece(null); setShowForm(true); }}
              className="font-sans text-xs uppercase tracking-[0.15em]"
            >
              <Plus className="h-4 w-4 mr-1" /> Nueva pieza
            </Button>
          </div>

          {isLoading ? (
            <p className="text-muted-foreground text-sm">Cargando...</p>
          ) : !pieces?.length ? (
            <p className="text-muted-foreground text-sm">No hay piezas aún. Creá la primera.</p>
          ) : (
            <div className="grid gap-4">
              {pieces.map((piece) => (
                <div
                  key={piece.id}
                  className="border border-border bg-card p-4 flex items-center gap-4"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 bg-muted flex-shrink-0 overflow-hidden">
                    {piece.images?.[0] ? (
                      <img src={piece.images[0]} alt={piece.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                        Sin img
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-sans font-medium text-sm truncate">{piece.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={piece.status === "published" ? "default" : "secondary"} className="text-[10px]">
                        {piece.status === "published" ? "Publicado" : "Borrador"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{categoryLabels[piece.category]}</span>
                      <span className="text-xs font-medium">€{piece.price}</span>
                      <span className="text-xs text-muted-foreground">Stock: {piece.stock}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => { setEditingPiece(piece); setShowForm(true); }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(piece)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <PieceFormDialog
            open={showForm}
            onOpenChange={setShowForm}
            piece={editingPiece}
          />
        </TabsContent>

        <TabsContent value="orders" className="mt-4">
          <OrdersList />
        </TabsContent>

        <TabsContent value="giftcards" className="mt-4">
          <GiftCardsList />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CatalogManager;
