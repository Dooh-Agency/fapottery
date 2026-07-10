import { usePieceOrdersAdmin } from "@/hooks/usePieceOrders";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const statusLabels: Record<string, string> = { pending: "Pendiente", paid: "Pagado", cancelled: "Cancelado" };
const statusVariant: Record<string, "default" | "secondary" | "destructive"> = { pending: "secondary", paid: "default", cancelled: "destructive" };

const OrdersList = () => {
  const { data: orders, isLoading } = usePieceOrdersAdmin();

  if (isLoading) return <p className="text-muted-foreground text-sm">Cargando...</p>;
  if (!orders?.length) return <p className="text-muted-foreground text-sm">No hay pedidos aún.</p>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Pieza</TableHead>
          <TableHead>Cantidad</TableHead>
          <TableHead>Monto</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Estado</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((o) => (
          <TableRow key={o.id}>
            <TableCell className="font-medium text-sm">{o.pieces?.title || "—"}</TableCell>
            <TableCell className="text-sm">{o.quantity}</TableCell>
            <TableCell className="text-sm">€{o.amount}</TableCell>
            <TableCell className="text-sm">{o.customer_email || "—"}</TableCell>
            <TableCell className="text-sm">{format(new Date(o.created_at), "d MMM yyyy", { locale: es })}</TableCell>
            <TableCell>
              <Badge variant={statusVariant[o.status] || "secondary"} className="text-[10px]">
                {statusLabels[o.status] || o.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default OrdersList;
