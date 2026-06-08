import { useState } from "react";
import { useClassSchedules, useDeleteSchedule, useClassTypes, type ClassSchedule } from "@/hooks/useClasses";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import ScheduleFormDialog from "./ScheduleFormDialog";

const SchedulesList = () => {
  const { data: schedules, isLoading } = useClassSchedules();
  const deleteSchedule = useDeleteSchedule();
  const [editing, setEditing] = useState<ClassSchedule | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleDelete = (s: ClassSchedule) => {
    if (confirm("¿Eliminar este horario?")) deleteSchedule.mutate(s.id);
  };

  const formatTime = (t: string) => t.slice(0, 5);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => { setEditing(null); setShowForm(true); }} className="font-sans text-xs uppercase tracking-[0.15em]">
          <Plus className="h-4 w-4 mr-1" /> Nuevo horario
        </Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Cargando...</p>
      ) : !schedules?.length ? (
        <p className="text-muted-foreground text-sm">No hay horarios programados.</p>
      ) : (
        <div className="grid gap-3">
          {schedules.map((s) => (
            <div key={s.id} className="border border-border bg-card p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-sans font-medium text-sm">
                  {s.class_types?.title || "Clase"} — {format(new Date(s.scheduled_date + "T00:00:00"), "EEEE d MMM yyyy", { locale: es })}
                </p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-xs text-muted-foreground">{formatTime(s.start_time)} – {formatTime(s.end_time)}</span>
                  <Badge variant={s.is_cancelled ? "destructive" : s.spots_available > 0 ? "default" : "secondary"} className="text-[10px]">
                    {s.is_cancelled ? "Cancelado" : s.spots_available > 0 ? `${s.spots_available} vacantes` : "Completo"}
                  </Badge>
                  {s.notes && <span className="text-xs text-muted-foreground italic truncate max-w-[200px]">{s.notes}</span>}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => { setEditing(s); setShowForm(true); }}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(s)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ScheduleFormDialog open={showForm} onOpenChange={setShowForm} schedule={editing} />
    </div>
  );
};

export default SchedulesList;
