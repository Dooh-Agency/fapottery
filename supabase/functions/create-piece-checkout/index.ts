import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pieceId, quantity = 1 } = await req.json();
    if (!pieceId) {
      return new Response(JSON.stringify({ error: "pieceId is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Fetch piece details
    const { data: piece, error: pieceErr } = await supabaseClient
      .from("pieces")
      .select("*")
      .eq("id", pieceId)
      .eq("status", "published")
      .single();

    if (pieceErr || !piece) {
      return new Response(JSON.stringify({ error: "Piece not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (piece.stock < quantity) {
      return new Response(JSON.stringify({ error: "Not enough stock" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const origin = req.headers.get("origin") || "https://fapottery.com";

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: piece.title,
              description: piece.description || undefined,
              images: piece.images?.length ? [piece.images[0]] : undefined,
            },
            unit_amount: Math.round(piece.price * 100),
          },
          quantity,
        },
      ],
      mode: "payment",
      success_url: `${origin}/tienda?payment=success`,
      cancel_url: `${origin}/tienda?payment=cancelled`,
      metadata: {
        piece_id: pieceId,
        quantity: String(quantity),
      },
    });

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
