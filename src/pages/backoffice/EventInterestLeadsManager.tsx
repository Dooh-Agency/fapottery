import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEventInterestLeads, useUpdateEventInterestLeadStatus } from "@/hooks/useEventInterestLeads";
import { toast } from "sonner";

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

  const updateLeadStatus = async (id: string, status: string) => {
    try {
      await updateStatus.mutateAsync({ id, status });
      toast.success("Estado actualizado");
    } catch {
      toast.error("No se pudo actualizar el estado");
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-2xl">Leads de eventos</h1>
        <p className="mt-1 text-sm text-muted-foreground">Preinscripciones de Breakfast &amp; Paint · 1 de agosto.</p>
      </div>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Cargando…</p>
      ) : !leads?.length ? (
        <p className="text-sm text-muted-foreground">Todavía no hay preinscripciones.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contacto</TableHead>
              <TableHead>Origen</TableHead>
              <TableHead>Novedades</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default EventInterestLeadsManager;
