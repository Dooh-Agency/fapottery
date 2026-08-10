import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Las tablas se incorporan en la migración de este lote; el tipo se mantiene local
// hasta poder regenerar los tipos desde el proyecto remoto.
const db = supabase as any;
export type PopupField = { id: string; label: string; type: "text" | "tel"; required?: boolean };
export type PopupCampaign = { id: string; is_active: boolean; image_url: string | null; badge: string | null; title: string; body: string | null; cta_label: string; objective: "info" | "lead" | "discount" | "link"; cta_url: string | null; discount_code: string | null; success_title: string; success_body: string | null; show_name: boolean; fields: PopupField[]; interests: string[]; privacy_text: string | null; starts_at: string | null; ends_at: string | null };

export const useHomePopupCampaigns = (publicOnly = false) => useQuery({
  queryKey: ["home_popup_campaigns", publicOnly],
  queryFn: async () => {
    let query = db.from("home_popup_campaigns").select("*").order("created_at", { ascending: false });
    if (publicOnly) query = query.eq("is_active", true);
    const { data, error } = await query;
    if (error) throw error;
    return data as PopupCampaign[];
  },
});
export const useSaveHomePopupCampaign = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: async (campaign: Partial<PopupCampaign> & { title: string }) => {
    const { id, ...data } = campaign;
    const result = id ? await db.from("home_popup_campaigns").update({ ...data, updated_at: new Date().toISOString() }).eq("id", id) : await db.from("home_popup_campaigns").insert(data);
    if (result.error) throw result.error;
  }, onSuccess: () => qc.invalidateQueries({ queryKey: ["home_popup_campaigns"] }) });
};
export const useCreateHomePopupLead = () => useMutation({ mutationFn: async (lead: Record<string, unknown>) => { const { error } = await db.from("home_popup_leads").insert(lead); if (error) throw error; } });
