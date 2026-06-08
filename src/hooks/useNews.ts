import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface NewsItem {
  id: string;
  title: string;
  body: string | null;
  image_url: string | null;
  instagram_url: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export const useNews = (publishedOnly = true) =>
  useQuery({
    queryKey: ["news", publishedOnly],
    queryFn: async () => {
      let q = supabase
        .from("news")
        .select("*")
        .order("updated_at", { ascending: false });
      if (publishedOnly) q = q.eq("is_published", true);
      const { data, error } = await q;
      if (error) throw error;
      return data as NewsItem[];
    },
  });

export const useUpsertNews = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: Partial<NewsItem> & { title: string }) => {
      const { id, ...rest } = values;
      if (rest.is_published && !rest.published_at) {
        rest.published_at = new Date().toISOString();
      }
      (rest as any).updated_at = new Date().toISOString();
      if (id) {
        const { error } = await supabase.from("news").update(rest as any).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("news").insert(rest as any);
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["news"] }),
  });
};

export const useDeleteNews = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("news").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["news"] }),
  });
};
