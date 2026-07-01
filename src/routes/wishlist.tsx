import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ProductCard } from "@/components/site/ProductCard";
import { useWishlist } from "@/lib/wishlist";
import { PRODUCTS } from "@/lib/products";

export const Route = createFileRoute("/wishlist")({
  head: () => ({ meta: [
    { title: "Wishlist — Pavement Pulse" },
    { name: "description", content: "Your saved pairs, in one place." },
    { name: "robots", content: "noindex" },
  ] }),
  component: WishlistPage,
});

function WishlistPage() {
  const { slugs, clear } = useWishlist();
  const items = PRODUCTS.filter((p) => slugs.includes(p.slug));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="border-b border-border bg-surface">
        <div className="mx-auto max-w-[1400px] px-6 py-16">
          <div className="text-xs font-mono tracking-widest text-pulse mb-3">◆ WISHLIST</div>
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight">Saved for later.</h1>
          <p className="mt-4 text-muted-foreground">{items.length === 0 ? "Nothing saved yet." : `${items.length} pair${items.length === 1 ? "" : "s"} on hold.`}</p>
        </div>
      </div>
      <div className="mx-auto max-w-[1400px] px-6 py-12">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface p-16 text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-background grid place-items-center mb-4">
              <Heart className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="font-display text-xl font-medium">No saves yet</div>
            <p className="mt-2 text-sm text-muted-foreground">Tap the heart on any pair to save it here.</p>
            <Link to="/catalog" search={{ brand: undefined }} className="mt-6 inline-flex rounded-full bg-pulse px-6 py-2.5 text-sm font-bold text-black hover:opacity-90">Browse the floor</Link>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {items.map((p, i) => <ProductCard key={p.slug} product={p} index={i} />)}
            </div>
            <button onClick={clear} className="mt-10 text-xs text-muted-foreground hover:text-destructive">Clear wishlist</button>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
