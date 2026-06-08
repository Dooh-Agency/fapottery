import { useSiteImages, useUpdateSiteImage } from "@/hooks/useSiteImages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Upload } from "lucide-react";

const SECTION_LABELS: Record<string, string> = {
  "propuesta-educativa": "Propuesta Educativa",
  "produccion": "Producción",
  "colaboraciones": "Colaboraciones",
  "clases": "Clases",
  "catalogo": "Tienda",
  "novedades": "Novedades",
};

const SiteImagesManager = () => {
  const { data: images, isLoading } = useSiteImages();
  const update = useUpdateSiteImage();
  const [uploading, setUploading] = useState<string | null>(null);

  const handleUpload = async (sectionKey: string, file: File) => {
    setUploading(sectionKey);
    const ext = file.name.split(".").pop();
    const path = `${sectionKey}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("site-images").upload(path, file);
    if (error) {
      toast.error("Error al subir imagen: " + error.message);
      setUploading(null);
      return;
    }
    const { data } = supabase.storage.from("site-images").getPublicUrl(path);
    try {
      await update.mutateAsync({
        sectionKey,
        imageUrl: data.publicUrl,
        altText: SECTION_LABELS[sectionKey] + " header",
      });
      toast.success("Imagen actualizada");
    } catch (e: any) {
      toast.error(e.message);
    }
    setUploading(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl">Imágenes de cabecera</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Configurá la imagen hero de cada sección del sitio. Tamaño recomendado: 1920×270 px.
        </p>
      </div>

      {isLoading && <p className="text-muted-foreground text-sm">Cargando…</p>}

      {!isLoading && images && (
        <div className="grid gap-6">
          {images.map((img) => (
            <div key={img.id} className="border border-border bg-card p-5 space-y-3">
              <Label className="text-base font-serif">
                {SECTION_LABELS[img.section_key] ?? img.section_key}
              </Label>

              {img.image_url ? (
                <div className="w-full overflow-hidden border border-border">
                  <img
                    src={img.image_url}
                    alt={img.alt_text ?? ""}
                    className="w-full h-auto object-cover aspect-[10/1]"
                  />
                </div>
              ) : (
                <div className="w-full bg-muted flex items-center justify-center aspect-[10/1] text-muted-foreground text-sm">
                  Sin imagen
                </div>
              )}

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={uploading === img.section_key}
                  onClick={() => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = "image/*";
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) handleUpload(img.section_key, file);
                    };
                    input.click();
                  }}
                >
                  <Upload className="h-4 w-4 mr-1" />
                  {uploading === img.section_key ? "Subiendo…" : "Cambiar imagen"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SiteImagesManager;
