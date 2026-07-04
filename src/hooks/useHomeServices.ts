import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface HomeService {
  id: string;
  position: number;
  label: string;
  title: string;
  description: string | null;
  price: string | null;
  cta_label: string;
  cta_link: string;
  image_url: string;
  updated_at: string;
}

export const useHomeServices = () =>
  useQuery({
    queryKey: ["home_services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("home_services")
        .select("*")
        .order("position");
      if (error) throw error;
      return data as HomeService[];
    },
  });

export const useUpdateHomeService = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...rest
    }: Partial<Omit<HomeService, "id" | "updated_at">> & { id: string }) => {
      const { error } = await supabase
        .from("home_services")
        .update({ ...rest, updated_at: new Date().toISOString() } as any)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["home_services"] }),
  });
};
