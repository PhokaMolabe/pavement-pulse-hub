import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const OrderItemSchema = z.object({
  slug: z.string(),
  name: z.string(),
  brand: z.string(),
  colorway: z.string(),
  size: z.number(),
  qty: z.number().int().positive().max(20),
  price: z.number().int().positive(),
  image: z.string().optional(),
});

const SubmitSchema = z.object({
  email: z.string().email().max(255),
  fullName: z.string().min(1).max(120),
  phone: z.string().max(40).optional(),
  address: z.string().min(3).max(240),
  suburb: z.string().max(120).optional(),
  city: z.string().min(1).max(120),
  postalCode: z.string().min(1).max(20),
  items: z.array(OrderItemSchema).min(1).max(50),
  shipping: z.number().int().min(0).max(2000),
});

export const submitOrder = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => SubmitSchema.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Best-effort: attach user_id when caller is signed in.
    let userId: string | null = null;
    try {
      const { getRequest } = await import("@tanstack/react-start/server");
      const req = getRequest();
      const auth = req?.headers.get("authorization");
      if (auth?.startsWith("Bearer ")) {
        const token = auth.slice(7);
        const { data: claims } = await supabaseAdmin.auth.getUser(token);
        userId = claims.user?.id ?? null;
      }
    } catch { /* anonymous */ }

    const subtotal = data.items.reduce((n, i) => n + i.price * i.qty, 0);
    const total = subtotal + data.shipping;
    const orderNumber = "PP-" + Math.random().toString(36).slice(2, 8).toUpperCase();

    const { data: orderId, error } = await supabaseAdmin.rpc("place_order", {
      _user_id: (userId ?? null) as any,
      _order_number: orderNumber,
      _email: data.email,
      _full_name: data.fullName,
      _phone: data.phone ?? "",
      _address: data.address,
      _suburb: data.suburb ?? "",
      _city: data.city,
      _postal_code: data.postalCode,
      _subtotal: subtotal,
      _shipping: data.shipping,
      _total: total,
      _items: data.items as any,
    } as any);
    if (error) {
      if (error.message?.startsWith("Out of stock")) {
        throw new Error("Sorry — one of your items just sold out. Please refresh and try again.");
      }
      throw new Error(error.message);
    }

    // If Stripe is configured, create a Checkout Session. Order stays `pending`
    // until the Stripe webhook flips it to `paid` and triggers confirmation emails.
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (stripeKey) {
      const { getRequest } = await import("@tanstack/react-start/server");
      const origin = process.env.SITE_ORIGIN
        ?? getRequest()?.headers.get("origin")
        ?? "";
      const body = new URLSearchParams();
      body.set("mode", "payment");
      body.set("customer_email", data.email);
      body.set("success_url", `${origin}/checkout/success?order=${orderNumber}`);
      body.set("cancel_url", `${origin}/checkout?cancelled=1`);
      body.set("metadata[order_number]", orderNumber);
      body.set("metadata[order_id]", String(orderId));
      const lines = data.items.map((i) => ({
        currency: "zar", unit_amount: i.price * 100,
        name: `${i.brand} ${i.name} — UK ${i.size}`, quantity: i.qty,
      }));
      if (data.shipping > 0) {
        lines.push({ currency: "zar", unit_amount: data.shipping * 100, name: "Shipping", quantity: 1 });
      }
      lines.forEach((li, idx) => {
        body.set(`line_items[${idx}][price_data][currency]`, li.currency);
        body.set(`line_items[${idx}][price_data][unit_amount]`, String(li.unit_amount));
        body.set(`line_items[${idx}][price_data][product_data][name]`, li.name);
        body.set(`line_items[${idx}][quantity]`, String(li.quantity));
      });
      const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
        method: "POST",
        headers: { Authorization: `Bearer ${stripeKey}`, "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });
      const session = await res.json();
      if (!res.ok) {
        console.error("[stripe] checkout error", session);
        throw new Error(session?.error?.message ?? "Payment gateway error");
      }
      return { orderNumber, total, checkoutUrl: session.url as string };
    }

    // No Stripe configured — send order emails immediately (test / dev mode).
    const { sendOrderEmails } = await import("@/lib/email/sendOrderEmails.server");
    await sendOrderEmails({
      orderNumber, email: data.email, fullName: data.fullName,
      address: data.address, suburb: data.suburb, city: data.city, postalCode: data.postalCode,
      items: data.items, subtotal, shipping: data.shipping, total,
    }).catch((e) => console.log("[email] send failed", e));

    return { orderNumber, total, checkoutUrl: null as string | null };
  });

export const listMyOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("orders").select("*").eq("user_id", context.userId).order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const listAllOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" as const });
    if (!isAdmin) throw new Error("Forbidden");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin.from("orders").select("*").order("created_at", { ascending: false }).limit(200);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const updateOrderStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid(), status: z.enum(["pending","paid","shipped","delivered","cancelled"]) }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" as const });
    if (!isAdmin) throw new Error("Forbidden");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("orders").update({ status: data.status }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
