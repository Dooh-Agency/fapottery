import { useState } from "react";
import { useNews, useUpsertNews, useDeleteNews, type NewsItem } from "@/hooks/useNews";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { NewsFormDialog } from "@/components/backoffice/NewsFormDialog";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const NewsManager = () => {
  const { data: news, isLoading } = useNews(false);
  const upsert = useUpsertNews();
  const remove = useDeleteNews();
  const [editing, setEditing] = useState<NewsItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSave = async (values: Partial<NewsItem> & { title: string }) => {
    try {
      await upsert.mutateAsync(values);
      toast.success(values.id ? "Novedad actualizada" : "Novedad creada");
      setDialogOpen(false);
      setEditing(null);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta novedad?")) return;
    try {
      await remove.mutateAsync(id);
      toast.success("Novedad eliminada");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl">Novedades</h1>
        <Button
          onClick={() => { setEditing(null); setDialogOpen(true); }}
          size="sm"
        >
          <Plus className="h-4 w-4 mr-1" /> Nueva
        </Button>
      </div>

      {isLoading && <p className="text-muted-foreground text-sm">Cargando…</p>}

      {!isLoading && news && (
        <div className="grid gap-4">
          {news.length === 0 && (
            <p className="text-muted-foreground text-sm">No hay novedades todavía.</p>
          )}
          {news.map((item) => (
            <div key={item.id} className="border border-border bg-card p-4 flex gap-4 items-start">
              {item.image_url && (
                <img src={item.image_url} alt="" className="w-20 h-20 object-cover flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {item.is_published ? (
                    <Eye className="h-3.5 w-3.5 text-foreground" />
                  ) : (
                    <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                  <span className="font-serif text-base truncate">{item.title}</span>
                </div>
                {item.published_at && (
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(item.published_at), "d MMM yyyy", { locale: es })}
                  </p>
                )}
                {item.body && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{item.body}</p>
                )}
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => { setEditing(item); setDialogOpen(true); }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <NewsFormDialog
        open={dialogOpen}
        onOpenChange={(open) => { setDialogOpen(open); if (!open) setEditing(null); }}
        initial={editing}
        onSave={handleSave}
        saving={upsert.isPending}
      />
    </div>
  );
};

export default NewsManager;
