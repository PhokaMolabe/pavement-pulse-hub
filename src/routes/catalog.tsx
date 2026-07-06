import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ProductCard } from "@/components/site/ProductCard";
import { BRANDS } from "@/lib/products";
import { useProducts } from "@/lib/useProducts";

type Search = { brand?: string };

export const Route = createFileRoute("/catalog")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    brand: typeof s.brand === "string" ? s.brand : undefined,
  }),
  head: () => ({ meta: [{ title: "Shop — Pavement Pulse" }, { name: "description", content: "All sneakers, every brand, in one curated destination." }] }),
  component: Catalog,
});

function Catalog() {
  const { brand } = Route.useSearch();
  const { products: PRODUCTS } = useProducts();
  const [category, setCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"featured" | "price-low" | "price-high">("featured");
  const [activeBrand, setActiveBrand] = useState<string | undefined>(brand);

  const categories = ["All", "Lifestyle", "Running", "Basketball", "Skate", "Retro"];

  const filtered = useMemo(() => {
    let list = PRODUCTS;
    if (category !== "All") list = list.filter((p) => p.category === category);
    if (activeBrand) list = list.filter((p) => p.brand === activeBrand);
    if (sortBy === "price-low") list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [PRODUCTS, category, activeBrand, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="border-b border-border bg-surface">
        <div className="mx-auto max-w-[1400px] px-6 py-16">
          <div className="text-xs font-mono tracking-widest text-pulse mb-3">◆ SHOP ALL</div>
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight">The Floor.</h1>
          <p className="mt-4 text-muted-foreground max-w-xl">Every silhouette. Every house. Every drop. {PRODUCTS.length} pairs and counting.</p>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 py-12">
        <div className="grid lg:grid-cols-[240px_1fr] gap-12">
          <aside className="space-y-8">
            <div>
              <div className="text-xs font-bold tracking-widest text-muted-foreground mb-4">CATEGORY</div>
              <div className="space-y-1.5">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`block w-full text-left text-sm py-1.5 transition ${category === c ? "text-pulse font-medium" : "text-foreground/70 hover:text-foreground"}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-bold tracking-widest text-muted-foreground mb-4">BRAND</div>
              <div className="space-y-1.5">
                <button
                  onClick={() => setActiveBrand(undefined)}
                  className={`block w-full text-left text-sm py-1.5 transition ${!activeBrand ? "text-pulse font-medium" : "text-foreground/70 hover:text-foreground"}`}
                >All brands</button>
                {BRANDS.map((b) => (
                  <button
                    key={b}
                    onClick={() => setActiveBrand(b)}
                    className={`block w-full text-left text-sm py-1.5 transition ${activeBrand === b ? "text-pulse font-medium" : "text-foreground/70 hover:text-foreground"}`}
                  >{b}</button>
                ))}
              </div>
            </div>
          </aside>

          <div>
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
              <div className="text-sm text-muted-foreground font-mono">{filtered.length} PAIRS</div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="bg-transparent text-sm border border-border rounded-full px-4 py-1.5 focus:outline-none focus:border-pulse"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
              </select>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p, i) => <ProductCard key={p.slug} product={p} index={i} />)}
            </div>
            {filtered.length === 0 && (
              <div className="py-24 text-center text-muted-foreground">No pairs match — adjust your filters.</div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
