import { useEffect, useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { X, Upload } from "lucide-react";
import { useUpsertPiece, uploadPieceImage, type Piece } from "@/hooks/usePieces";
import { useAuth } from "@/hooks/useAuth";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  piece: Piece | null;
}

const categories = [
  { value: "tazas", label: "Tazas" },
  { value: "platos", label: "Platos" },
  { value: "bowls", label: "Bowls" },
  { value: "jarrones", label: "Jarrones" },
  { value: "decoracion", label: "Decoración" },
  { value: "otro", label: "Otro" },
] as const;

const PieceFormDialog = ({ open, onOpenChange, piece }: Props) => {
  const upsert = useUpsertPiece();
  const { user } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("0");
  const [category, setCategory] = useState<Piece["category"]>("otro");
  const [stock, setStock] = useState("1");
  const [published, setPublished] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (piece) {
      setTitle(piece.title);
      setDescription(piece.description || "");
      setPrice(String(piece.price));
      setCategory(piece.category);
      setStock(String(piece.stock));
      setPublished(piece.status === "published");
      setImages(piece.images || []);
    } else {
      setTitle(""); setDescription(""); setPrice("0");
      setCategory("otro"); setStock("1"); setPublished(false); setImages([]);
    }
  }, [piece, open]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const url = await uploadPieceImage(file);
        urls.push(url);
      }
      setImages((prev) => [...prev, ...urls]);
    } catch {
      // error handled by hook
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    upsert.mutate(
      {
        ...(piece?.id ? { id: piece.id } : {}),
        title,
        description: description || null,
        price: parseFloat(price) || 0,
        category,
        stock: parseInt(stock) || 0,
        status: published ? "published" : "draft",
        images,
        created_by: piece?.created_by || user?.id || null,
      } as any,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif">{piece ? "Editar pieza" : "Nueva pieza"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="font-sans text-xs uppercase tracking-wider">Título</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label className="font-sans text-xs uppercase tracking-wider">Descripción</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-sans text-xs uppercase tracking-wider">Precio (€)</Label>
              <Input type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label className="font-sans text-xs uppercase tracking-wider">Stock</Label>
              <Input type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-sans text-xs uppercase tracking-wider">Categoría</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as Piece["category"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Images */}
          <div className="space-y-2">
            <Label className="font-sans text-xs uppercase tracking-wider">Imágenes</Label>
            <div className="flex flex-wrap gap-2">
              {images.map((url, i) => (
                <div key={i} className="relative w-20 h-20 border border-border overflow-hidden group">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-0 right-0 bg-destructive text-destructive-foreground p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="w-20 h-20 border border-dashed border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <Upload className="h-5 w-5" />
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
          </div>

          <div className="flex items-center gap-3">
            <Switch checked={published} onCheckedChange={setPublished} />
            <Label className="font-sans text-xs uppercase tracking-wider">
              {published ? "Publicado" : "Borrador"}
            </Label>
          </div>

          <Button type="submit" disabled={upsert.isPending} className="w-full font-sans text-xs uppercase tracking-[0.15em]">
            {upsert.isPending ? "Guardando..." : "Guardar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PieceFormDialog;
