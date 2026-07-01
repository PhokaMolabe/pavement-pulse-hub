import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useEffect } from "react";

export function CartDrawer() {
  const { items, open, setOpen, updateQty, remove, subtotal, count } = useCart();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 260 }}
            className="fixed right-0 top-0 z-[70] h-full w-full max-w-md bg-background border-l border-border flex flex-col"
            aria-label="Shopping bag"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                <div className="font-display font-bold tracking-tight">Your bag <span className="text-muted-foreground font-normal">· {count}</span></div>
              </div>
              <button onClick={() => setOpen(false)} className="p-2 hover:bg-secondary rounded-md" aria-label="Close bag">
                <X className="h-4 w-4" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 grid place-items-center px-8 text-center">
                <div>
                  <div className="mx-auto h-16 w-16 rounded-full bg-surface grid place-items-center mb-4">
                    <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="font-display text-xl font-medium">Your bag is empty</div>
                  <p className="mt-2 text-sm text-muted-foreground">Start walking. Add a pair from the floor.</p>
                  <Link
                    to="/catalog" search={{ brand: undefined }}
                    onClick={() => setOpen(false)}
                    className="mt-6 inline-flex rounded-full bg-pulse px-6 py-2.5 text-sm font-bold text-black hover:opacity-90"
                  >Shop all</Link>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto divide-y divide-border">
                  {items.map((it) => (
                    <div key={`${it.slug}-${it.size}`} className="flex gap-4 p-6">
                      <div className="h-24 w-24 rounded-lg overflow-hidden bg-surface shrink-0">
                        <img src={it.image} alt="" className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between gap-2">
                          <div className="min-w-0">
                            <div className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase truncate">{it.brand}</div>
                            <div className="font-medium truncate">{it.name}</div>
                            <div className="text-xs text-muted-foreground">Size UK {it.size} · {it.colorway}</div>
                          </div>
                          <div className="font-mono text-sm shrink-0">R{(it.price * it.qty).toLocaleString()}</div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="inline-flex items-center border border-border rounded-full">
                            <button onClick={() => updateQty(it.slug, it.size, it.qty - 1)} className="p-2 hover:text-pulse" aria-label="Decrease"><Minus className="h-3 w-3" /></button>
                            <span className="w-8 text-center text-sm font-mono">{it.qty}</span>
                            <button onClick={() => updateQty(it.slug, it.size, it.qty + 1)} className="p-2 hover:text-pulse" aria-label="Increase"><Plus className="h-3 w-3" /></button>
                          </div>
                          <button onClick={() => remove(it.slug, it.size)} className="text-xs text-muted-foreground hover:text-destructive">Remove</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border p-6 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-mono font-medium">R{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Shipping</span>
                    <span>{subtotal >= 1500 ? "Free" : "Calculated at checkout"}</span>
                  </div>
                  <Link
                    to="/checkout"
                    onClick={() => setOpen(false)}
                    className="block w-full text-center rounded-full bg-pulse text-black py-3.5 font-bold hover:opacity-90 transition pulse-glow"
                  >Checkout · R{subtotal.toLocaleString()}</Link>
                  <Link
                    to="/cart"
                    onClick={() => setOpen(false)}
                    className="block w-full text-center text-xs font-medium text-muted-foreground hover:text-foreground"
                  >View full cart →</Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
