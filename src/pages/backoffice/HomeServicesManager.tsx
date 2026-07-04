import { useEffect, useState } from "react";
import { useHomeServices, useUpdateHomeService, type HomeService } from "@/hooks/useHomeServices";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import ImageUploader from "@/components/backoffice/ImageUploader";

type Draft = {
  label: string;
  title: string;
  description: string;
  price: string;
  cta_label: string;
  cta_link: string;
  image_url: string;
};

const toDraft = (s: HomeService): Draft => ({
  label: s.label,
  title: s.title,
  description: s.description ?? "",
  price: s.price ?? "",
  cta_label: s.cta_label,
  cta_link: s.cta_link,
  image_url: s.image_url,
});

const HomeServicesManager = () => {
  const { data: services, isLoading } = useHomeServices();
  const update = useUpdateHomeService();
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    if (!services) return;
    setDrafts((prev) => {
      const next = { ...prev };
      for (const s of services) {
        if (!(s.id in next)) next[s.id] = toDraft(s);
      }
      return next;
    });
  }, [services]);

  const updateDraft = (id: string, field: keyof Draft, value: string) => {
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  const handleSave = async (id: string) => {
    const draft = drafts[id];
    if (!draft) return;
    setSaving(id);
    try {
      await update.mutateAsync({ id, ...draft });
      toast.success("Tarjeta actualizada");
    } catch (e: any) {
      toast.error(e.message);
    }
    setSaving(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl">Servicios (Home)</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Configurá las 3 tarjetas de "¿Qué podés encontrar en FA Pottery?" en la home. Tamaño de imagen recomendado: 800×600 px (relación 4:3).
        </p>
      </div>

      {isLoading && <p className="text-muted-foreground text-sm">Cargando…</p>}

      {!isLoading && services && (
        <div className="grid gap-6">
          {services.map((s) => {
            const draft = drafts[s.id] ?? toDraft(s);
            return (
              <div key={s.id} className="border border-border bg-card p-5 space-y-4">
                <Label className="text-base font-serif">Tarjeta {s.position}</Label>

                <ImageUploader
                  label="Imagen"
                  value={draft.image_url}
                  onChange={(url) => updateDraft(s.id, "image_url", url)}
                  bucket="site-images"
                  folder="services"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor={`label-${s.id}`}>Categoría (arriba del título)</Label>
                    <Input
                      id={`label-${s.id}`}
                      value={draft.label}
                      onChange={(e) => updateDraft(s.id, "label", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`price-${s.id}`}>Precio</Label>
                    <Input
                      id={`price-${s.id}`}
                      value={draft.price}
                      onChange={(e) => updateDraft(s.id, "price", e.target.value)}
                      placeholder="Ej: Desde €35 / clase"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor={`title-${s.id}`}>Título</Label>
                  <Input
                    id={`title-${s.id}`}
                    value={draft.title}
                    onChange={(e) => updateDraft(s.id, "title", e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor={`desc-${s.id}`}>Descripción</Label>
                  <Textarea
                    id={`desc-${s.id}`}
                    rows={3}
                    value={draft.description}
                    onChange={(e) => updateDraft(s.id, "description", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor={`cta-label-${s.id}`}>Texto del botón</Label>
                    <Input
                      id={`cta-label-${s.id}`}
                      value={draft.cta_label}
                      onChange={(e) => updateDraft(s.id, "cta_label", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`cta-link-${s.id}`}>Link del botón</Label>
                    <Input
                      id={`cta-link-${s.id}`}
                      value={draft.cta_link}
                      onChange={(e) => updateDraft(s.id, "cta_link", e.target.value)}
                      placeholder="/clases"
                    />
                  </div>
                </div>

                <Button size="sm" disabled={saving === s.id} onClick={() => handleSave(s.id)}>
                  {saving === s.id ? "Guardando…" : "Guardar cambios"}
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HomeServicesManager;
