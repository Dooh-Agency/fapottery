import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEventInterestLeads, useUpdateEventInterestLeadStatus } from "@/hooks/useEventInterestLeads";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { useDeleteEventInterestLead } from "@/hooks/useEventInterestLeads";
import { useMemo, useState } from "react";

const statusLabels: Record<string, string> = {
  new: "Nuevo",
  contacted: "Contactado",
  reserved: "Reservó",
  not_interested: "Sin interés",
};

const sourceLabels: Record<string, string> = { landing: "Landing", popup: "Popup", activity: "Actividad" };

const EventInterestLeadsManager = () => {
  const { data: leads, isLoading } = useEventInterestLeads();
  const updateStatus = useUpdateEventInterestLeadStatus();
  const deleteLead = useDeleteEventInterestLead();
  const [emailFilter, setEmailFilter] = useState("");
  const filteredLeads = useMemo(() => {
    const normalizedFilter = emailFilter.trim().toLowerCase();
    if (!normalizedFilter) return leads || [];
    return (leads || []).filter((lead) =>
      lead.email.toLowerCase().includes(normalizedFilter)
      || lead.full_name?.toLowerCase().includes(normalizedFilter),
    );
  }, [emailFilter, leads]);

  const updateLeadStatus = async (id: string, status: string) => {
    try {
      await updateStatus.mutateAsync({ id, status });
      toast.success("Estado actualizado");
    } catch {
      toast.error("No se pudo actualizar el estado");
    }
  };

  const removeLead = async (id: string, email: string) => {
    if (!confirm(`¿Eliminar la preinscripción de ${email}? Esta acción no se puede deshacer.`)) return;
    try {
      await deleteLead.mutateAsync(id);
      toast.success("Preinscripción eliminada");
    } catch {
      toast.error("No se pudo eliminar la preinscripción");
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-2xl">Registros de emails</h1>
        <p className="mt-1 text-sm text-muted-foreground">Consultas y preinscripciones registradas desde los formularios. Podés eliminar los registros de prueba para volver a probar un mismo email.</p>
      </div>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Cargando…</p>
      ) : !leads?.length ? (
        <p className="text-sm text-muted-foreground">Todavía no hay registros.</p>
      ) : (
        <>
          <Input
            value={emailFilter}
            onChange={(event) => setEmailFilter(event.target.value)}
            placeholder="Buscar por email o nombre"
            aria-label="Buscar registros de emails"
            className="max-w-sm"
          />
          {filteredLeads.length === 0 && <p className="text-sm text-muted-foreground">No encontramos registros con esa búsqueda.</p>}
          {filteredLeads.length > 0 && <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contacto</TableHead>
              <TableHead>Origen</TableHead>
              <TableHead>Novedades</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>
                  <p className="font-medium">{lead.full_name || "—"}</p>
                  <a className="text-sm underline underline-offset-2" href={`mailto:${lead.email}`}>{lead.email}</a>
                </TableCell>
                <TableCell className="text-sm">
                  <p>{sourceLabels[lead.entry_point] || lead.entry_point}</p>
                  {lead.utm_source && <p className="text-xs text-muted-foreground">{lead.utm_source}{lead.utm_campaign ? ` · ${lead.utm_campaign}` : ""}</p>}
                </TableCell>
                <TableCell><Badge variant={lead.marketing_consent ? "default" : "secondary"}>{lead.marketing_consent ? "Sí" : "No"}</Badge></TableCell>
                <TableCell className="text-sm">{format(new Date(lead.created_at), "d MMM yyyy · HH:mm", { locale: es })}</TableCell>
                <TableCell>
                  <select
                    aria-label={`Estado de ${lead.email}`}
                    className="h-9 rounded-md border border-input bg-background px-2 text-sm"
                    value={lead.status}
                    disabled={updateStatus.isPending}
                    onChange={(event) => updateLeadStatus(lead.id, event.target.value)}
                  >
                    {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" title="Eliminar registro" aria-label={`Eliminar registro de ${lead.email}`} disabled={deleteLead.isPending} onClick={() => removeLead(lead.id, lead.email)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          </Table>}
        </>
      )}
    </div>
  );
};

export default EventInterestLeadsManager;
