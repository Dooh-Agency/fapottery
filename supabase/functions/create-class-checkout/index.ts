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
    const { reservation_id, schedule_id } = await req.json();
    if (!reservation_id || !schedule_id) {
      return new Response(JSON.stringify({ error: "Missing reservation_id or schedule_id" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get reservation + schedule + class type info
    const { data: reservation, error: rErr } = await supabaseAdmin
      .from("class_reservations")
      .select("*, class_schedules(*, class_types(*))")
      .eq("id", reservation_id)
      .single();

    if (rErr || !reservation) {
      return new Response(JSON.stringify({ error: "Reservation not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const classType = reservation.class_schedules?.class_types;
    const price = classType?.price || 0;
    const title = classType?.title || "Clase de cerámica";
    const deposit = Math.round(price * 0.5 * 100) / 100;

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const session = await stripe.checkout.sessions.create({
      customer_email: reservation.email,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Seña (50%): ${title}`,
              description: `Reserva de clase. Saldo restante de €${(price - deposit).toFixed(2)} a abonar en el estudio.`,
            },
            unit_amount: Math.round(deposit * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/clases?success=true`,
      cancel_url: `${req.headers.get("origin")}/clases?cancelled=true`,
      metadata: { reservation_id, type: "class_deposit" },
    });

    // Save stripe session id on reservation
    await supabaseAdmin
      .from("class_reservations")
      .update({ stripe_session_id: session.id })
      .eq("id", reservation_id);

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
