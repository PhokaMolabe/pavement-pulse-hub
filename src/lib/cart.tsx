import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartItem = {
  slug: string;
  name: string;
  brand: string;
  colorway: string;
  price: number;
  image: string;
  size: number;
  qty: number;
};

type CartCtx = {
  items: CartItem[];
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (item: Omit<CartItem, "qty">) => void;
  remove: (slug: string, size: number) => void;
  updateQty: (slug: string, size: number, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "pp.cart.v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch { /* ignore */ }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const value = useMemo<CartCtx>(() => ({
    items, open, setOpen,
    add: (i) => setItems((prev) => {
      const existing = prev.find((p) => p.slug === i.slug && p.size === i.size);
      if (existing) return prev.map((p) => p === existing ? { ...p, qty: p.qty + 1 } : p);
      return [...prev, { ...i, qty: 1 }];
    }),
    remove: (slug, size) => setItems((prev) => prev.filter((p) => !(p.slug === slug && p.size === size))),
    updateQty: (slug, size, qty) => setItems((prev) => prev
      .map((p) => (p.slug === slug && p.size === size) ? { ...p, qty: Math.max(1, qty) } : p)
      .filter((p) => p.qty > 0)),
    clear: () => setItems([]),
    count: items.reduce((n, i) => n + i.qty, 0),
    subtotal: items.reduce((n, i) => n + i.qty * i.price, 0),
  }), [items, open]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart outside provider");
  return c;
}
