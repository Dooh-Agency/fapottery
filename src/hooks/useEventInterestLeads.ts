import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert } from "@/integrations/supabase/types";

export const EVENT_INTEREST_KEY = "breakfast_paint_2026_08_01";

export const useCreateEventInterestLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (lead: TablesInsert<"event_interest_leads">) => {
      const { error } = await supabase.from("event_interest_leads").insert(lead);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["event_interest_leads"] }),
  });
};

export const useEventInterestLeads = () =>
  useQuery({
    queryKey: ["event_interest_leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("event_interest_leads")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

export const useUpdateEventInterestLeadStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("event_interest_leads")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["event_interest_leads"] }),
  });
};
