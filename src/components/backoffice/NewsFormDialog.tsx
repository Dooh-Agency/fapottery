import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bold, Link, PanelTop, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { NewsItem } from "@/hooks/useNews";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial: NewsItem | null;
  onSave: (values: Partial<NewsItem> & { title: string }) => Promise<void>;
  saving: boolean;
}

export function NewsFormDialog({ open, onOpenChange, initial, onSave, saving }: Props) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [instagramUrl, setInstagramUrl] = useState("");
  const [locationMapUrl, setLocationMapUrl] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [uploading, setUploading] = useState(false);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) {
      setTitle(initial?.title ?? "");
      setBody(initial?.body ?? "");
      setImageUrl(initial?.image_url ?? "");
      setImages(initial?.images ?? []);
      setInstagramUrl(initial?.instagram_url ?? "");
      setLocationMapUrl(initial?.location_map_url ?? "");
      setIsPublished(initial?.is_published ?? false);
    }
  }, [open, initial]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("news-images").upload(path, file);
    if (error) {
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("news-images").getPublicUrl(path);
    setImageUrl(data.publicUrl);
    setUploading(false);
  };

  const wrapSelectionBold = () => {
    const textarea = bodyRef.current;
    if (!textarea || textarea.selectionStart === textarea.selectionEnd) return;
    const { selectionStart, selectionEnd, value } = textarea;
    const selected = value.slice(selectionStart, selectionEnd);
    setBody(value.slice(0, selectionStart) + `**${selected}**` + value.slice(selectionEnd));
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(selectionStart + 2, selectionEnd + 2);
    });
  };

  const wrapSelectionAsCallout = () => {
    const textarea = bodyRef.current;
    if (!textarea || textarea.selectionStart === textarea.selectionEnd) return;
    const { selectionStart, selectionEnd, value } = textarea;
    const selected = value.slice(selectionStart, selectionEnd);
    const prefix = ":::destacado\n";
    const suffix = "\n:::";
    setBody(value.slice(0, selectionStart) + prefix + selected + suffix + value.slice(selectionEnd));
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(selectionStart + prefix.length, selectionStart + prefix.length + selected.length);
    });
  };

  const wrapSelectionAsLink = () => {
    const textarea = bodyRef.current;
    if (!textarea || textarea.selectionStart === textarea.selectionEnd) return;
    const url = window.prompt("Pegá la URL del enlace (https://...)");
    if (!url) return;
    try {
      const parsed = new URL(url);
      if (parsed.protocol !== "https:" && parsed.protocol !== "http:") throw new Error();
    } catch {
      window.alert("Ingresá una URL válida que empiece por http:// o https://");
      return;
    }
    const { selectionStart, selectionEnd, value } = textarea;
    const selected = value.slice(selectionStart, selectionEnd);
    const link = `[${selected}](${url})`;
    setBody(value.slice(0, selectionStart) + link + value.slice(selectionEnd));
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(selectionStart + 1, selectionStart + 1 + selected.length);
    });
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      const urls = await Promise.all(Array.from(files).map(async (file) => {
        const extension = file.name.split(".").pop();
        const path = `${crypto.randomUUID()}.${extension}`;
        const { error } = await supabase.storage.from("news-images").upload(path, file);
        if (error) throw error;
        return supabase.storage.from("news-images").getPublicUrl(path).data.publicUrl;
      }));
      setImages((current) => [...current, ...urls]);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const values: Partial<NewsItem> & { title: string } = {
      id: initial?.id,
      title,
      body: body || null,
      image_url: imageUrl || null,
      images,
      instagram_url: instagramUrl || null,
      is_published: isPublished,
      published_at: isPublished ? (initial?.published_at ?? new Date().toISOString()) : null,
    };

    // Mientras la migración de Maps no se haya aplicado, no enviamos una columna inexistente.
    // Cuando exista, también permite limpiar un enlace ya guardado.
    if (locationMapUrl || initial?.location_map_url) {
      values.location_map_url = locationMapUrl || null;
    }

    onSave(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif">{initial ? "Editar novedad" : "Nueva novedad"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Título *</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <Label>Texto de detalle</Label>
              <div className="flex gap-1">
                <Button type="button" variant="outline" size="sm" onClick={wrapSelectionBold} title="Negrita">
                  <Bold className="h-4 w-4" />
                  <span className="sr-only">Negrita</span>
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={wrapSelectionAsCallout} title="Destacado">
                  <PanelTop className="h-4 w-4" />
                  <span className="sr-only">Destacado</span>
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={wrapSelectionAsLink} title="Insertar enlace">
                  <Link className="h-4 w-4" />
                  <span className="sr-only">Insertar enlace</span>
                </Button>
              </div>
            </div>
            <Textarea ref={bodyRef} value={body} onChange={(e) => setBody(e.target.value)} rows={7} />
            <p className="text-xs text-muted-foreground">Seleccioná un texto y usá los botones para ponerlo en negrita, destacado o enlazado.</p>
          </div>
          <div className="space-y-2">
            <Label>Galería adicional</Label>
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {images.map((url, index) => (
                  <div key={url} className="relative aspect-square overflow-hidden border border-border">
                    <img src={url} alt="" className="h-full w-full object-cover" />
                    <Button type="button" variant="destructive" size="icon" className="absolute right-1 top-1 h-7 w-7" onClick={() => setImages((current) => current.filter((_, i) => i !== index))}>
                      <Trash2 className="h-3.5 w-3.5" />
                      <span className="sr-only">Quitar imagen</span>
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <Input type="file" accept="image/*" multiple onChange={handleGalleryUpload} disabled={uploading} />
            <p className="text-xs text-muted-foreground">Estas imágenes aparecerán después de la portada en el detalle público.</p>
          </div>
          <div>
            <Label>Imagen</Label>
            {imageUrl && (
              <img src={imageUrl} alt="" className="w-full h-40 object-cover mb-2" />
            )}
            <Input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} />
          </div>
          <div>
            <Label>Link de Instagram</Label>
            <Input value={instagramUrl} onChange={(e) => setInstagramUrl(e.target.value)} placeholder="https://www.instagram.com/p/..." />
          </div>
          <div>
            <Label>URL de Google Maps</Label>
            <Input value={locationMapUrl} onChange={(e) => setLocationMapUrl(e.target.value)} placeholder="https://maps.app.goo.gl/..." />
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={isPublished} onCheckedChange={setIsPublished} />
            <Label>Publicada</Label>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={saving || uploading || !title}>{saving ? "Guardando…" : "Guardar"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
