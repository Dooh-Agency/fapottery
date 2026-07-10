import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import type { Piece } from "@/hooks/usePieces";

export type PieceOrder = Tables<"piece_orders"> & { pieces?: Piece };

export function usePieceOrdersAdmin() {
  return useQuery({
    queryKey: ["piece_orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("piece_orders")
        .select("*, pieces(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as PieceOrder[];
    },
  });
}
