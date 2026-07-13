import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Lock } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { useCart } from "@/lib/cart";
import { submitOrder } from "@/lib/api/orders.functions";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [
    { title: "Checkout — Pavement Pulse" },
    { name: "description", content: "Complete your Pavement Pulse order." },
    { name: "robots", content: "noindex" },
  ] }),
  component: Checkout,
});

function Checkout() {
  const { items, subtotal, clear } = useCart();
  const [placed, setPlaced] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    email: "", firstName: "", lastName: "", address: "", suburb: "", city: "", postalCode: "", phone: "",
    delivery: "standard",
  });
  const navigate = useNavigate();
  const submit = useServerFn(submitOrder);

  const shippingFor = (mode: string) => mode === "express" ? 280 : mode === "sameday" ? 450 : (subtotal >= 1500 || subtotal === 0 ? 0 : 150);
  const shipping = shippingFor(form.delivery);
  const total = subtotal + shipping;

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await submit({ data: {
        email: form.email,
        fullName: `${form.firstName} ${form.lastName}`.trim(),
        phone: form.phone,
        address: form.address,
        suburb: form.suburb,
        city: form.city,
        postalCode: form.postalCode,
        shipping,
        items: items.map((i) => ({
          slug: i.slug, name: i.name, brand: i.brand, colorway: i.colorway,
          size: i.size, qty: i.qty, price: i.price, image: i.image,
        })),
      } });
      // If Stripe is configured server-side, redirect to hosted Checkout.
      if (res.checkoutUrl) {
        clear();
        window.location.href = res.checkoutUrl;
        return;
      }
      setPlaced(res.orderNumber);
      clear();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Order failed");
    } finally {
      setBusy(false);
    }
  }

  if (placed) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-[720px] px-6 py-24 text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-pulse grid place-items-center mb-6">
            <CheckCircle2 className="h-8 w-8 text-black" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">You're on the pavement.</h1>
          <p className="mt-4 text-muted-foreground">Order <span className="font-mono text-foreground">{placed}</span> confirmed. A receipt is on its way to your inbox.</p>
          <div className="mt-10 flex flex-wrap gap-3 justify-center">
            <Link to="/catalog" search={{ brand: undefined }} className="rounded-full bg-pulse px-6 py-3 text-sm font-bold text-black hover:opacity-90">Keep shopping</Link>
            <button onClick={() => navigate({ to: "/account" })} className="rounded-full border border-border px-6 py-3 text-sm font-medium">View order history</button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-[720px] px-6 py-24 text-center">
          <h1 className="font-display text-4xl font-bold">Nothing to check out.</h1>
          <p className="mt-3 text-muted-foreground">Your bag is empty.</p>
          <Link to="/catalog" search={{ brand: undefined }} className="mt-8 inline-flex rounded-full bg-pulse px-6 py-3 text-sm font-bold text-black">Shop all</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-[1200px] px-6 py-12">
        <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight">Checkout</h1>
        <div className="mt-10 grid lg:grid-cols-[1fr_420px] gap-10">
          <form onSubmit={placeOrder} className="space-y-10">
            <Section title="Contact">
              <Field label="Email" type="email" required placeholder="you@example.com" value={form.email} onChange={set("email")} />
            </Section>

            <Section title="Shipping address">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="First name" required value={form.firstName} onChange={set("firstName")} />
                <Field label="Last name" required value={form.lastName} onChange={set("lastName")} />
                <Field label="Address" required className="sm:col-span-2" value={form.address} onChange={set("address")} />
                <Field label="Suburb" value={form.suburb} onChange={set("suburb")} />
                <Field label="City" required value={form.city} onChange={set("city")} />
                <Field label="Postal code" required value={form.postalCode} onChange={set("postalCode")} />
                <Field label="Phone" type="tel" required value={form.phone} onChange={set("phone")} />
              </div>
            </Section>

            <Section title="Delivery">
              <div className="space-y-2">
                <Radio name="delivery" label="Standard · 3–5 business days" price={shippingFor("standard") === 0 ? "Free" : "R150"} checked={form.delivery === "standard"} onChange={() => setForm({ ...form, delivery: "standard" })} />
                <Radio name="delivery" label="Express · 1–2 business days" price="R280" checked={form.delivery === "express"} onChange={() => setForm({ ...form, delivery: "express" })} />
                <Radio name="delivery" label="Same-day (JHB / CPT metro)" price="R450" checked={form.delivery === "sameday"} onChange={() => setForm({ ...form, delivery: "sameday" })} />
              </div>
            </Section>

            <Section title="Payment">
              <div className="rounded-lg border border-border p-4 bg-surface flex items-center gap-3 text-sm">
                <Lock className="h-4 w-4 text-pulse" />
                <span className="text-muted-foreground">You'll be redirected to our secure Stripe payment page to complete your purchase. Cards, Apple Pay and Google Pay accepted.</span>
              </div>
            </Section>


            <button disabled={busy} type="submit" className="w-full rounded-full bg-pulse text-black py-4 font-bold hover:opacity-90 transition pulse-glow disabled:opacity-50">
              {busy ? "Placing order…" : `Place order · R${total.toLocaleString()}`}
            </button>
          </form>

          <aside className="rounded-2xl border border-border bg-surface p-6 h-fit lg:sticky lg:top-24">
            <div className="font-display font-bold mb-4">Order summary</div>
            <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
              {items.map((it) => (
                <div key={`${it.slug}-${it.size}`} className="flex gap-3">
                  <div className="h-16 w-16 rounded-lg overflow-hidden bg-background shrink-0"><img src={it.image} alt="" className="h-full w-full object-cover" /></div>
                  <div className="flex-1 min-w-0 text-sm">
                    <div className="font-medium truncate">{it.name}</div>
                    <div className="text-xs text-muted-foreground">UK {it.size} · Qty {it.qty}</div>
                  </div>
                  <div className="font-mono text-sm">R{(it.price * it.qty).toLocaleString()}</div>
                </div>
              ))}
            </div>
            <div className="border-t border-border mt-6 pt-4 space-y-2 text-sm">
              <Row label="Subtotal" value={`R${subtotal.toLocaleString()}`} />
              <Row label="Shipping" value={shipping === 0 ? "Free" : `R${shipping}`} />
              <div className="flex justify-between font-bold text-base border-t border-border pt-3"><span>Total</span><span className="font-mono">R{total.toLocaleString()}</span></div>
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="text-xs font-bold tracking-widest text-muted-foreground mb-4">{title.toUpperCase()}</div>
      {children}
    </section>
  );
}
function Field({ label, className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs text-muted-foreground">{label}</span>
      <input {...props} className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-pulse" />
    </label>
  );
}
function Radio({ name, label, price, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { name: string; label: string; price: string }) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-lg border border-border bg-surface px-4 py-3 cursor-pointer hover:border-pulse transition">
      <span className="flex items-center gap-3 text-sm"><input type="radio" name={name} {...props} className="accent-pulse" />{label}</span>
      <span className="font-mono text-sm">{price}</span>
    </label>
  );
}
function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between"><span className="text-muted-foreground">{label}</span><span className="font-mono">{value}</span></div>;
}
