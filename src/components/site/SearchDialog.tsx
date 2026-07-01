import { AnimatePresence, motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PRODUCTS } from "@/lib/products";

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, onClose]);

  useEffect(() => { if (!open) setQ(""); }, [open]);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return PRODUCTS.slice(0, 6);
    return PRODUCTS.filter((p) =>
      p.name.toLowerCase().includes(s) ||
      p.brand.toLowerCase().includes(s) ||
      p.colorway.toLowerCase().includes(s) ||
      p.category.toLowerCase().includes(s),
    ).slice(0, 8);
  }, [q]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 top-0 z-[70] flex justify-center px-4 pt-20"
          >
            <div className="w-full max-w-2xl rounded-2xl bg-background border border-border shadow-2xl overflow-hidden">
              <div className="flex items-center gap-3 border-b border-border px-5">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  autoFocus
                  value={q} onChange={(e) => setQ(e.target.value)}
                  placeholder="Search sneakers, brands, colorways…"
                  className="flex-1 bg-transparent py-4 text-sm focus:outline-none placeholder:text-muted-foreground"
                />
                <button onClick={onClose} className="p-2 hover:bg-secondary rounded-md" aria-label="Close search"><X className="h-4 w-4" /></button>
              </div>
              <div className="max-h-[60vh] overflow-y-auto">
                {results.length === 0 ? (
                  <div className="p-10 text-center text-sm text-muted-foreground">No matches for "{q}"</div>
                ) : (
                  <ul className="divide-y divide-border">
                    {results.map((p) => (
                      <li key={p.slug}>
                        <Link
                          to="/product/$slug" params={{ slug: p.slug }}
                          onClick={onClose}
                          className="flex items-center gap-4 p-4 hover:bg-surface transition"
                        >
                          <div className="h-14 w-14 rounded-lg overflow-hidden bg-surface shrink-0">
                            <img src={p.image} alt="" className="h-full w-full object-cover" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase">{p.brand}</div>
                            <div className="font-medium truncate">{p.name}</div>
                            <div className="text-xs text-muted-foreground truncate">{p.colorway}</div>
                          </div>
                          <div className="font-mono text-sm shrink-0">R{p.price.toLocaleString()}</div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="border-t border-border px-5 py-3 flex items-center justify-between text-[10px] font-mono tracking-widest text-muted-foreground">
                <span>{q ? `${results.length} RESULTS` : "SUGGESTIONS"}</span>
                <span>ESC TO CLOSE</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
