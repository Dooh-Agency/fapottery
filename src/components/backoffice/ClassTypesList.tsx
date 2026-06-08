import { useState } from "react";
import { useClassTypes, useDeleteClassType, type ClassType } from "@/hooks/useClasses";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";
import ClassTypeFormDialog from "./ClassTypeFormDialog";

const ClassTypesList = () => {
  const { data: types, isLoading } = useClassTypes(false);
  const deleteType = useDeleteClassType();
  const [editing, setEditing] = useState<ClassType | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleDelete = (ct: ClassType) => {
    if (confirm(`¿Eliminar "${ct.title}"? Se borrarán también sus horarios y reservas.`)) {
      deleteType.mutate(ct.id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="font-sans text-xs uppercase tracking-[0.15em]"
        >
          <Plus className="h-4 w-4 mr-1" /> Nuevo tipo
        </Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Cargando...</p>
      ) : !types?.length ? (
        <p className="text-muted-foreground text-sm">No hay tipos de clase. Creá el primero.</p>
      ) : (
        <div className="grid gap-3">
          {types.map((ct) => (
            <div key={ct.id} className="border border-border bg-card p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-sans font-medium text-sm">{ct.title}</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <Badge variant={ct.is_active ? "default" : "secondary"} className="text-[10px]">
                    {ct.is_active ? "Activo" : "Inactivo"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{ct.duration_minutes} min</span>
                  <span className="text-xs text-muted-foreground">Máx. {ct.max_students} alumnos</span>
                  <span className="text-xs font-medium">€{ct.price}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => { setEditing(ct); setShowForm(true); }}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(ct)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ClassTypeFormDialog open={showForm} onOpenChange={setShowForm} classType={editing} />
    </div>
  );
};

export default ClassTypesList;
