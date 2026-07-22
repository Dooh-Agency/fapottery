import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type TranslatableTable = "class_types" | "news";

export const useTranslateContent = (table: TranslatableTable) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase.functions.invoke("translate-content", {
        body: { table, id },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [table] });
      toast.success("Traducción al inglés generada");
    },
    onError: () => {
      toast.error("No se pudo traducir automáticamente. Puedes intentarlo de nuevo guardando otra vez.");
    },
  });
};
