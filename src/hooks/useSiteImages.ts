import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SiteImage {
  id: string;
  section_key: string;
  image_url: string;
  alt_text: string | null;
  updated_at: string;
  updated_by: string | null;
}

export const useSiteImages = () =>
  useQuery({
    queryKey: ["site_images"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_images").select("*").order("section_key");
      if (error) throw error;
      return data as SiteImage[];
    },
  });

export const useSiteImage = (sectionKey: string) =>
  useQuery({
    queryKey: ["site_images", sectionKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_images")
        .select("*")
        .eq("section_key", sectionKey)
        .maybeSingle();
      if (error) throw error;
      return data as SiteImage | null;
    },
  });

export const useUpdateSiteImage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ sectionKey, imageUrl, altText }: { sectionKey: string; imageUrl: string; altText?: string }) => {
      const { error } = await supabase
        .from("site_images")
        .update({
          image_url: imageUrl,
          alt_text: altText || null,
          updated_at: new Date().toISOString(),
        } as any)
        .eq("section_key", sectionKey);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["site_images"] }),
  });
};
