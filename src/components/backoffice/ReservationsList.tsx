import { useReservations, useUpdateReservationStatus, type ClassReservation } from "@/hooks/useClasses";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import { Check, X } from "lucide-react";

const statusLabels: Record<string, string> = { pending: "Pendiente", confirmed: "Confirmada", cancelled: "Cancelada" };
const statusVariant: Record<string, "default" | "secondary" | "destructive"> = { pending: "secondary", confirmed: "default", cancelled: "destructive" };
const paymentLabels: Record<string, string> = { stripe: "Stripe", cash: "Efectivo" };

const ReservationsList = () => {
  const { data: reservations, isLoading } = useReservations();
  const updateStatus = useUpdateReservationStatus();

  const handleStatus = async (id: string, status: string) => {
    try {
      await updateStatus.mutateAsync({ id, status });
      toast.success(`Reserva ${statusLabels[status]?.toLowerCase()}`);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  if (isLoading) return <p className="text-muted-foreground text-sm">Cargando...</p>;
  if (!reservations?.length) return <p className="text-muted-foreground text-sm">No hay reservas aún.</p>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Clase</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Pago</TableHead>
          <TableHead>Seña / Saldo</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reservations.map((r) => (
          <TableRow key={r.id}>
            <TableCell className="font-medium text-sm">{r.full_name}</TableCell>
            <TableCell className="text-sm">{r.email}</TableCell>
            <TableCell className="text-sm">{r.class_schedules?.class_types?.title || "—"}</TableCell>
            <TableCell className="text-sm">
              {r.class_schedules?.scheduled_date
                ? format(new Date(r.class_schedules.scheduled_date + "T00:00:00"), "d MMM yyyy", { locale: es })
                : "—"}
            </TableCell>
            <TableCell><Badge variant="secondary" className="text-[10px]">{paymentLabels[r.payment_method] || r.payment_method}</Badge></TableCell>
            <TableCell className="text-sm">
              {r.payment_method === "stripe" && r.amount_paid != null ? (
                <>
                  €{r.amount_paid} pagado
                  {r.class_schedules?.class_types?.price != null && (
                    <span className="text-muted-foreground"> · saldo €{(Number(r.class_schedules.class_types.price) - Number(r.amount_paid)).toFixed(2)}</span>
                  )}
                </>
              ) : (
                "—"
              )}
            </TableCell>
            <TableCell>
              <Badge variant={statusVariant[r.payment_status] || "secondary"} className="text-[10px]">
                {statusLabels[r.payment_status] || r.payment_status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              {r.payment_status === "pending" && (
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon" title="Confirmar" onClick={() => handleStatus(r.id, "confirmed")}>
                    <Check className="h-4 w-4 text-green-600" />
                  </Button>
                  <Button variant="ghost" size="icon" title="Cancelar" onClick={() => handleStatus(r.id, "cancelled")}>
                    <X className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ReservationsList;
