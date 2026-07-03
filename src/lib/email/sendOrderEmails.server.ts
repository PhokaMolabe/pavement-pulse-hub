// Server-only helper: sends order confirmation + admin notification.
// Uses Lovable's transactional email queue if scaffolded (`/lovable/email/transactional/send`).
// If email infrastructure is not yet set up, logs the payload and returns — the order still succeeds.

type OrderItem = { name: string; brand: string; colorway: string; size: number; qty: number; price: number };

export type OrderEmailPayload = {
  orderNumber: string;
  email: string;
  fullName: string;
  address: string;
  suburb?: string;
  city: string;
  postalCode: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
};

export async function sendOrderEmails(payload: OrderEmailPayload) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: setting } = await supabaseAdmin
    .from("app_settings").select("value").eq("key", "admin_notification_email").maybeSingle();
  const adminEmail = (setting?.value as string) ?? "admin@example.com";

  const origin = process.env.SITE_ORIGIN ?? "";
  const sendUrl = `${origin}/lovable/email/transactional/send`;

  const results = await Promise.allSettled([
    postEmail(sendUrl, {
      templateName: "order-confirmation",
      recipientEmail: payload.email,
      idempotencyKey: `order-${payload.orderNumber}-customer`,
      templateData: payload,
    }),
    postEmail(sendUrl, {
      templateName: "admin-order-notification",
      recipientEmail: adminEmail,
      idempotencyKey: `order-${payload.orderNumber}-admin`,
      templateData: payload,
    }),
  ]);

  results.forEach((r, i) => {
    if (r.status === "rejected") {
      console.log(`[email] ${i === 0 ? "customer" : "admin"} not sent for ${payload.orderNumber}:`, r.reason?.message ?? r.reason);
    }
  });
}

async function postEmail(url: string, body: unknown) {
  if (!url.startsWith("http")) throw new Error("email queue not configured");
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`email send failed: ${res.status}`);
}
