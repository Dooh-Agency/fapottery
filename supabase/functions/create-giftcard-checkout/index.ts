import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const MIN_AMOUNT = 20;
const MAX_AMOUNT = 500;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amount, buyer_name, buyer_email, recipient_name, recipient_email, message } = await req.json();

    if (!buyer_name || !buyer_email) {
      return new Response(JSON.stringify({ error: "buyer_name and buyer_email are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount < MIN_AMOUNT || numericAmount > MAX_AMOUNT) {
      return new Response(JSON.stringify({ error: `amount must be between €${MIN_AMOUNT} and €${MAX_AMOUNT}` }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: giftCard, error: giftCardErr } = await supabaseAdmin
      .from("gift_cards")
      .insert({
        amount: numericAmount,
        balance: numericAmount,
        buyer_name,
        buyer_email,
        recipient_name: recipient_name || null,
        recipient_email: recipient_email || null,
        message: message || null,
      })
      .select()
      .single();

    if (giftCardErr || !giftCard) {
      return new Response(JSON.stringify({ error: "Could not create gift card" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const origin = req.headers.get("origin") || "https://fapottery.com";

    const session = await stripe.checkout.sessions.create({
      customer_email: buyer_email,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Bono regalo — FA Pottery Studio",
              description: recipient_name ? `Para: ${recipient_name}` : undefined,
            },
            unit_amount: Math.round(numericAmount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/bono-regalo?success=true`,
      cancel_url: `${origin}/bono-regalo?cancelled=true`,
      metadata: {
        type: "gift_card",
        gift_card_id: giftCard.id,
      },
    });

    await supabaseAdmin
      .from("gift_cards")
      .update({ stripe_session_id: session.id })
      .eq("id", giftCard.id);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
