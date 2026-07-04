import { useSiteImages, useUpdateSiteImage } from "@/hooks/useSiteImages";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Upload, X } from "lucide-react";

const DEFAULT_BG_COLOR = "#F8F6F1";

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
  const [savingSubtitle, setSavingSubtitle] = useState<string | null>(null);
  const [subtitleDrafts, setSubtitleDrafts] = useState<Record<string, string>>({});
  const [removingImage, setRemovingImage] = useState<string | null>(null);
  const [savingBgColor, setSavingBgColor] = useState<string | null>(null);
  const [bgColorDrafts, setBgColorDrafts] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!images) return;
    setSubtitleDrafts((prev) => {
      const next = { ...prev };
      for (const img of images) {
        if (!(img.section_key in next)) next[img.section_key] = img.subtitle ?? "";
      }
      return next;
    });
    setBgColorDrafts((prev) => {
      const next = { ...prev };
      for (const img of images) {
        if (!(img.section_key in next)) next[img.section_key] = img.bg_color ?? DEFAULT_BG_COLOR;
      }
      return next;
    });
  }, [images]);

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

  const handleSaveSubtitle = async (sectionKey: string) => {
    setSavingSubtitle(sectionKey);
    try {
      await update.mutateAsync({ sectionKey, subtitle: subtitleDrafts[sectionKey] ?? "" });
      toast.success("Texto actualizado");
    } catch (e: any) {
      toast.error(e.message);
    }
    setSavingSubtitle(null);
  };

  const handleRemoveImage = async (sectionKey: string) => {
    setRemovingImage(sectionKey);
    try {
      await update.mutateAsync({ sectionKey, imageUrl: "" });
      toast.success("Imagen quitada. Ahora se muestra el color de fondo.");
    } catch (e: any) {
      toast.error(e.message);
    }
    setRemovingImage(null);
  };

  const handleSaveBgColor = async (sectionKey: string) => {
    setSavingBgColor(sectionKey);
    try {
      await update.mutateAsync({ sectionKey, bgColor: bgColorDrafts[sectionKey] ?? DEFAULT_BG_COLOR });
      toast.success("Color de fondo actualizado");
    } catch (e: any) {
      toast.error(e.message);
    }
    setSavingBgColor(null);
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
                <div
                  className="w-full flex items-center justify-center aspect-[10/1] text-sm border border-border"
                  style={{ backgroundColor: img.bg_color || DEFAULT_BG_COLOR }}
                >
                  <span className="text-muted-foreground">Sin imagen — se muestra este color de fondo</span>
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
                {img.image_url && (
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={removingImage === img.section_key}
                    onClick={() => handleRemoveImage(img.section_key)}
                  >
                    <X className="h-4 w-4 mr-1" />
                    {removingImage === img.section_key ? "Quitando…" : "Quitar imagen (usar color)"}
                  </Button>
                )}
              </div>

              <div className="space-y-2 pt-2 border-t border-border">
                <Label htmlFor={`bgcolor-${img.section_key}`} className="text-sm">
                  Color de fondo (se usa cuando no hay imagen)
                </Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    id={`bgcolor-${img.section_key}`}
                    value={bgColorDrafts[img.section_key] ?? DEFAULT_BG_COLOR}
                    onChange={(e) =>
                      setBgColorDrafts((prev) => ({ ...prev, [img.section_key]: e.target.value }))
                    }
                    className="h-9 w-12 border border-border rounded cursor-pointer"
                  />
                  <Input
                    value={bgColorDrafts[img.section_key] ?? DEFAULT_BG_COLOR}
                    onChange={(e) =>
                      setBgColorDrafts((prev) => ({ ...prev, [img.section_key]: e.target.value }))
                    }
                    placeholder="#F8F6F1"
                    className="max-w-[140px]"
                  />
                  <Button
                    size="sm"
                    disabled={
                      savingBgColor === img.section_key ||
                      (bgColorDrafts[img.section_key] ?? DEFAULT_BG_COLOR) === (img.bg_color ?? DEFAULT_BG_COLOR)
                    }
                    onClick={() => handleSaveBgColor(img.section_key)}
                  >
                    {savingBgColor === img.section_key ? "Guardando…" : "Guardar color"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Si el título de esta sección se muestra en blanco, elegí un color oscuro para que se lea bien.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-border">
                <Label htmlFor={`subtitle-${img.section_key}`} className="text-sm">
                  Texto debajo del hero
                </Label>
                <Textarea
                  id={`subtitle-${img.section_key}`}
                  rows={2}
                  value={subtitleDrafts[img.section_key] ?? ""}
                  onChange={(e) =>
                    setSubtitleDrafts((prev) => ({ ...prev, [img.section_key]: e.target.value }))
                  }
                  placeholder="Ej: Explorá las opciones de talleres y reservá tu lugar."
                />
                <Button
                  size="sm"
                  disabled={
                    savingSubtitle === img.section_key ||
                    (subtitleDrafts[img.section_key] ?? "") === (img.subtitle ?? "")
                  }
                  onClick={() => handleSaveSubtitle(img.section_key)}
                >
                  {savingSubtitle === img.section_key ? "Guardando…" : "Guardar texto"}
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
