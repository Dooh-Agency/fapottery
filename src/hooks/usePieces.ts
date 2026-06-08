import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type Piece = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  category: "tazas" | "platos" | "bowls" | "jarrones" | "decoracion" | "otro";
  status: "draft" | "published";
  stock: number;
  images: string[];
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type PieceInsert = Omit<Piece, "id" | "created_at" | "updated_at">;

const BUCKET = "piece-images";

export function usePublishedPieces() {
  return useQuery({
    queryKey: ["pieces", "published"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pieces")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Piece[];
    },
  });
}

export function useAllPieces() {
  return useQuery({
    queryKey: ["pieces", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pieces")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Piece[];
    },
  });
}

export function useUpsertPiece() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (piece: Partial<Piece> & { title: string; price: number; category: Piece["category"] }) => {
      const { data, error } = await supabase
        .from("pieces")
        .upsert(piece as any)
        .select()
        .single();
      if (error) throw error;
      return data as Piece;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pieces"] });
      toast({ title: "Pieza guardada" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });
}

export function useDeletePiece() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("pieces").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pieces"] });
      toast({ title: "Pieza eliminada" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });
}

export async function uploadPieceImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop();
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function deletePieceImage(url: string) {
  const path = url.split(`${BUCKET}/`).pop();
  if (path) {
    await supabase.storage.from(BUCKET).remove([path]);
  }
}
