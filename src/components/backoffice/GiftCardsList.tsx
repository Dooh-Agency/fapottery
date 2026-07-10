import { useGiftCardsAdmin } from "@/hooks/useGiftCards";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const statusLabels: Record<string, string> = { pending: "Pendiente", active: "Activo", redeemed: "Canjeado", cancelled: "Cancelado" };
const statusVariant: Record<string, "default" | "secondary" | "destructive"> = { pending: "secondary", active: "default", redeemed: "secondary", cancelled: "destructive" };

const GiftCardsList = () => {
  const { data: giftCards, isLoading } = useGiftCardsAdmin();

  if (isLoading) return <p className="text-muted-foreground text-sm">Cargando...</p>;
  if (!giftCards?.length) return <p className="text-muted-foreground text-sm">No hay bonos regalo aún.</p>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Código</TableHead>
          <TableHead>Monto</TableHead>
          <TableHead>Saldo</TableHead>
          <TableHead>Comprador</TableHead>
          <TableHead>Destinatario</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Estado</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {giftCards.map((g) => (
          <TableRow key={g.id}>
            <TableCell className="font-mono text-sm">{g.code || "—"}</TableCell>
            <TableCell className="text-sm">€{g.amount}</TableCell>
            <TableCell className="text-sm">€{g.balance}</TableCell>
            <TableCell className="text-sm">
              <p>{g.buyer_name}</p>
              <p className="text-xs text-muted-foreground">{g.buyer_email}</p>
            </TableCell>
            <TableCell className="text-sm">{g.recipient_name || "—"}</TableCell>
            <TableCell className="text-sm">{format(new Date(g.created_at), "d MMM yyyy", { locale: es })}</TableCell>
            <TableCell>
              <Badge variant={statusVariant[g.status] || "secondary"} className="text-[10px]">
                {statusLabels[g.status] || g.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default GiftCardsList;
