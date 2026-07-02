import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SiteImage {
  id: string;
  section_key: string;
  image_url: string;
  alt_text: string | null;
  subtitle: string | null;
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
    mutationFn: async ({
      sectionKey,
      imageUrl,
      altText,
      subtitle,
    }: {
      sectionKey: string;
      imageUrl?: string;
      altText?: string;
      subtitle?: string;
    }) => {
      const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (imageUrl !== undefined) updates.image_url = imageUrl;
      if (altText !== undefined) updates.alt_text = altText || null;
      if (subtitle !== undefined) updates.subtitle = subtitle || null;

      const { error } = await supabase
        .from("site_images")
        .update(updates as any)
        .eq("section_key", sectionKey);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["site_images"] }),
  });
};
