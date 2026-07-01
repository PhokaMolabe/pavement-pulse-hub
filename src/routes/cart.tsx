import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [
    { title: "Your Bag — Pavement Pulse" },
    { name: "description", content: "Review your selected pairs before checkout." },
    { name: "robots", content: "noindex" },
  ] }),
  component: CartPage,
});

function CartPage() {
  const { items, updateQty, remove, subtotal, clear } = useCart();
  const shipping = subtotal >= 1500 || subtotal === 0 ? 0 : 150;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-[1400px] px-6 py-12">
        <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight">Your bag</h1>
        <p className="mt-2 text-muted-foreground">{items.length === 0 ? "Nothing yet." : `${items.length} style${items.length === 1 ? "" : "s"} · ready when you are.`}</p>

        {items.length === 0 ? (
          <div className="mt-16 rounded-2xl border border-border bg-surface p-16 text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-background grid place-items-center mb-4">
              <ShoppingBag className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="font-display text-xl font-medium">The pavement is calling.</div>
            <p className="mt-2 text-sm text-muted-foreground">Discover this season's silhouettes.</p>
            <Link to="/catalog" search={{ brand: undefined }} className="mt-6 inline-flex rounded-full bg-pulse px-6 py-2.5 text-sm font-bold text-black hover:opacity-90">Shop all</Link>
          </div>
        ) : (
          <div className="mt-10 grid lg:grid-cols-[1fr_400px] gap-10">
            <div className="border-t border-border">
              {items.map((it) => (
                <div key={`${it.slug}-${it.size}`} className="grid grid-cols-[100px_1fr_auto] gap-5 py-6 border-b border-border">
                  <Link to="/product/$slug" params={{ slug: it.slug }} className="h-24 w-24 rounded-lg overflow-hidden bg-surface">
                    <img src={it.image} alt="" className="h-full w-full object-cover" />
                  </Link>
                  <div>
                    <div className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase">{it.brand}</div>
                    <Link to="/product/$slug" params={{ slug: it.slug }} className="font-medium hover:text-pulse">{it.name}</Link>
                    <div className="text-xs text-muted-foreground">Size UK {it.size} · {it.colorway}</div>
                    <div className="mt-3 inline-flex items-center border border-border rounded-full">
                      <button onClick={() => updateQty(it.slug, it.size, it.qty - 1)} className="p-2 hover:text-pulse" aria-label="Decrease"><Minus className="h-3 w-3" /></button>
                      <span className="w-8 text-center text-sm font-mono">{it.qty}</span>
                      <button onClick={() => updateQty(it.slug, it.size, it.qty + 1)} className="p-2 hover:text-pulse" aria-label="Increase"><Plus className="h-3 w-3" /></button>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end justify-between">
                    <div className="font-mono font-medium">R{(it.price * it.qty).toLocaleString()}</div>
                    <button onClick={() => remove(it.slug, it.size)} className="text-muted-foreground hover:text-destructive" aria-label="Remove"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              ))}
              <button onClick={clear} className="mt-6 text-xs text-muted-foreground hover:text-destructive">Clear bag</button>
            </div>

            <aside className="rounded-2xl border border-border bg-surface p-6 h-fit lg:sticky lg:top-24">
              <div className="font-display text-lg font-bold mb-4">Summary</div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-mono">R{subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="font-mono">{shipping === 0 ? "Free" : `R${shipping}`}</span></div>
                <div className="flex justify-between text-xs text-muted-foreground"><span>VAT (included)</span><span className="font-mono">R{Math.round(subtotal * 0.15 / 1.15).toLocaleString()}</span></div>
                <div className="border-t border-border pt-3 flex justify-between text-base font-bold"><span>Total</span><span className="font-mono">R{total.toLocaleString()}</span></div>
              </div>
              <Link to="/checkout" className="mt-6 block text-center rounded-full bg-pulse text-black py-3.5 font-bold hover:opacity-90 transition pulse-glow">Checkout</Link>
              <div className="mt-4 text-[11px] text-muted-foreground text-center">Secure checkout · Authenticated pairs · 30-day returns</div>
            </aside>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
