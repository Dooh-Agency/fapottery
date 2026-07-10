import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type GiftCard = Tables<"gift_cards">;

export type CreateGiftCardInput = {
  amount: number;
  buyer_name: string;
  buyer_email: string;
  recipient_name?: string;
  recipient_email?: string;
  message?: string;
};

export function useCreateGiftCardCheckout() {
  return useMutation({
    mutationFn: async (input: CreateGiftCardInput) => {
      const { data, error } = await supabase.functions.invoke("create-giftcard-checkout", {
        body: input,
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data as { url: string };
    },
  });
}

export function useGiftCardsAdmin() {
  return useQuery({
    queryKey: ["gift_cards"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gift_cards")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as GiftCard[];
    },
  });
}
