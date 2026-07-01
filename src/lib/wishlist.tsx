import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type WishCtx = {
  slugs: string[];
  has: (slug: string) => boolean;
  toggle: (slug: string) => void;
  remove: (slug: string) => void;
  clear: () => void;
};

const Ctx = createContext<WishCtx | null>(null);
const KEY = "pp.wishlist.v1";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setSlugs(JSON.parse(raw));
    } catch { /* ignore */ }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(KEY, JSON.stringify(slugs));
  }, [slugs, hydrated]);

  const value = useMemo<WishCtx>(() => ({
    slugs,
    has: (s) => slugs.includes(s),
    toggle: (s) => setSlugs((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]),
    remove: (s) => setSlugs((prev) => prev.filter((x) => x !== s)),
    clear: () => setSlugs([]),
  }), [slugs]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWishlist() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useWishlist outside provider");
  return c;
}
