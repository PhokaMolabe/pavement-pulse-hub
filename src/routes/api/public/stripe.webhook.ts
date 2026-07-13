import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";

// Stripe webhook: flips order to `paid` and sends confirmation emails once
// Stripe confirms the checkout session was paid.
export const Route = createFileRoute("/api/public/stripe/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.STRIPE_WEBHOOK_SECRET;
        const body = await request.text();

        if (secret) {
          const sig = request.headers.get("stripe-signature") ?? "";
          if (!verifyStripeSignature(sig, body, secret)) {
            return new Response("Invalid signature", { status: 401 });
          }
        }

        const event = JSON.parse(body);
        if (event.type !== "checkout.session.completed") {
          return new Response("ignored", { status: 200 });
        }
        const session = event.data?.object ?? {};
        const orderId = session.metadata?.order_id;
        const orderNumber = session.metadata?.order_number;
        if (!orderId) return new Response("no order", { status: 200 });

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: order, error: fetchErr } = await supabaseAdmin
          .from("orders").select("*").eq("id", orderId).maybeSingle();
        if (fetchErr || !order) {
          console.error("[stripe:webhook] order not found", orderId, fetchErr);
          return new Response("order missing", { status: 200 });
        }
        if (order.status === "paid") return new Response("ok", { status: 200 });

        await supabaseAdmin.from("orders").update({ status: "paid" }).eq("id", orderId);

        try {
          const { sendOrderEmails } = await import("@/lib/email/sendOrderEmails.server");
          await sendOrderEmails({
            orderNumber: order.order_number ?? orderNumber ?? "",
            email: order.email,
            fullName: order.full_name,
            address: order.address,
            suburb: order.suburb ?? undefined,
            city: order.city,
            postalCode: order.postal_code,
            items: (order.items as any) ?? [],
            subtotal: order.subtotal,
            shipping: order.shipping,
            total: order.total,
          });
        } catch (e) {
          console.log("[stripe:webhook] email failed", e);
        }

        return new Response("ok", { status: 200 });
      },
    },
  },
});

function verifyStripeSignature(header: string, payload: string, secret: string): boolean {
  try {
    const parts = Object.fromEntries(header.split(",").map((kv) => kv.split("=") as [string, string]));
    const timestamp = parts.t;
    const signature = parts.v1;
    if (!timestamp || !signature) return false;
    const signed = `${timestamp}.${payload}`;
    const expected = createHmac("sha256", secret).update(signed).digest("hex");
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
