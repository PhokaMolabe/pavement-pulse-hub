import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Lock } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { useCart } from "@/lib/cart";

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
  const navigate = useNavigate();
  const shipping = subtotal >= 1500 || subtotal === 0 ? 0 : 150;
  const total = subtotal + shipping;

  function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    const id = "PP-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    setPlaced(id);
    clear();
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-[1200px] px-6 py-12">
        <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight">Checkout</h1>
        <div className="mt-10 grid lg:grid-cols-[1fr_420px] gap-10">
          <form onSubmit={placeOrder} className="space-y-10">
            <Section title="Contact">
              <Field label="Email" type="email" required placeholder="you@example.com" />
            </Section>

            <Section title="Shipping address">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="First name" required />
                <Field label="Last name" required />
                <Field label="Address" required className="sm:col-span-2" />
                <Field label="Suburb" required />
                <Field label="City" required />
                <Field label="Postal code" required />
                <Field label="Phone" type="tel" required />
              </div>
            </Section>

            <Section title="Delivery">
              <div className="space-y-2">
                <Radio name="delivery" label="Standard · 3–5 business days" price={shipping === 0 ? "Free" : "R150"} defaultChecked />
                <Radio name="delivery" label="Express · 1–2 business days" price="R280" />
                <Radio name="delivery" label="Same-day (JHB / CPT metro)" price="R450" />
              </div>
            </Section>

            <Section title="Payment">
              <div className="rounded-lg border border-border p-4 bg-surface flex items-center gap-3 text-sm">
                <Lock className="h-4 w-4 text-pulse" />
                <span className="text-muted-foreground">Payments are simulated in this demo. Connect Shopify or Stripe to accept live payments.</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <Field label="Card number" placeholder="4242 4242 4242 4242" className="sm:col-span-2" />
                <Field label="Expiry" placeholder="MM / YY" />
                <Field label="CVC" placeholder="123" />
                <Field label="Name on card" className="sm:col-span-2" />
              </div>
            </Section>

            <button type="submit" className="w-full rounded-full bg-pulse text-black py-4 font-bold hover:opacity-90 transition pulse-glow">
              Place order · R{total.toLocaleString()}
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
