import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

function generateGiftCardCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "FA-";
  for (let i = 0; i < 8; i++) {
    if (i === 4) code += "-";
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

serve(async (req) => {
  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
    apiVersion: "2025-08-27.basil",
  });

  const signature = req.headers.get("stripe-signature");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";
  const body = await req.text();

  let event: Stripe.Event;
  try {
    if (!signature || !webhookSecret) throw new Error("Missing signature or webhook secret");
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
  } catch (err) {
    return new Response(JSON.stringify({ error: `Webhook signature verification failed: ${err.message}` }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const metadata = session.metadata || {};
      const amountPaid = (session.amount_total ?? 0) / 100;

      if (metadata.type === "class_deposit" && metadata.reservation_id) {
        await supabaseAdmin
          .from("class_reservations")
          .update({ payment_status: "confirmed", amount_paid: amountPaid })
          .eq("id", metadata.reservation_id);
      } else if (metadata.type === "piece_order" && metadata.order_id) {
        const { data: order } = await supabaseAdmin
          .from("piece_orders")
          .select("*, pieces(*)")
          .eq("id", metadata.order_id)
          .single();

        if (order && order.status !== "paid") {
          await supabaseAdmin
            .from("piece_orders")
            .update({ status: "paid", customer_email: session.customer_details?.email ?? null })
            .eq("id", metadata.order_id);

          const newStock = Math.max(0, (order.pieces?.stock ?? 0) - order.quantity);
          await supabaseAdmin
            .from("pieces")
            .update({ stock: newStock })
            .eq("id", order.piece_id);
        }
      } else if (metadata.type === "gift_card" && metadata.gift_card_id) {
        const { data: giftCard } = await supabaseAdmin
          .from("gift_cards")
          .select("id, status")
          .eq("id", metadata.gift_card_id)
          .single();

        if (giftCard && giftCard.status === "pending") {
          let code = generateGiftCardCode();
          // extremely unlikely collision, but guard anyway
          for (let attempt = 0; attempt < 5; attempt++) {
            const { data: existing } = await supabaseAdmin
              .from("gift_cards")
              .select("id")
              .eq("code", code)
              .maybeSingle();
            if (!existing) break;
            code = generateGiftCardCode();
          }

          await supabaseAdmin
            .from("gift_cards")
            .update({ status: "active", code })
            .eq("id", metadata.gift_card_id);
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
