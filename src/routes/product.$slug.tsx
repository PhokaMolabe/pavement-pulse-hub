import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { Heart, Share2, Shield, Truck, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ProductCard } from "@/components/site/ProductCard";
import { getProduct, PRODUCTS } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — Pavement Pulse` },
          { name: "description", content: loaderData.product.description },
          { property: "og:title", content: `${loaderData.product.name} — Pavement Pulse` },
          { property: "og:description", content: loaderData.product.description },
          { property: "og:image", content: loaderData.product.image },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center bg-background">
      <div className="text-center">
        <h1 className="font-display text-4xl font-bold">Pair not found</h1>
        <Link to="/catalog" search={{ brand: undefined }} className="mt-6 inline-block text-pulse hover:underline">Back to shop</Link>
      </div>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const [size, setSize] = useState<number | null>(null);
  const cart = useCart();
  const wish = useWishlist();
  const saved = wish.has(product.slug);
  const related = PRODUCTS.filter((p) => p.slug !== product.slug).slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org", "@type": "Product",
    name: product.name, image: [product.image], description: product.description,
    brand: { "@type": "Brand", name: product.brand },
    offers: { "@type": "Offer", priceCurrency: "ZAR", price: product.price, availability: "https://schema.org/InStock" },
  };

  function addToBag() {
    if (!size) return;
    cart.add({ slug: product.slug, name: product.name, brand: product.brand, colorway: product.colorway, price: product.price, image: product.image, size });
    cart.setOpen(true);
    toast.success(`${product.name} added — UK ${size}`);
  }
  function shareIt() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) navigator.share({ title: product.name, url }).catch(() => {});
    else { navigator.clipboard?.writeText(url); toast.success("Link copied"); }
  }


  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-[1400px] px-6 pt-8 text-xs font-mono text-muted-foreground tracking-widest">
        <Link to="/" className="hover:text-pulse">HOME</Link> / <Link to="/catalog" search={{ brand: undefined }} className="hover:text-pulse">SHOP</Link> / <span className="text-foreground">{product.name.toUpperCase()}</span>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 py-8 grid lg:grid-cols-2 gap-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="lg:sticky lg:top-24 self-start"
        >
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-surface">
            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
            {product.tag && (
              <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-background/90 backdrop-blur text-[10px] font-bold tracking-widest">
                <span className={product.tag === "Limited" || product.tag === "Drop" ? "text-pulse" : ""}>{product.tag.toUpperCase()}</span>
              </div>
            )}
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {[product.image, product.image, product.image, product.image].map((src, i) => (
              <button key={i} className="aspect-square rounded-lg overflow-hidden bg-surface border border-border hover:border-pulse transition">
                <img src={src} alt="" className="h-full w-full object-cover opacity-70 hover:opacity-100 transition" />
              </button>
            ))}
          </div>
        </motion.div>

        <div>
          <div className="text-xs font-mono tracking-widest text-muted-foreground">{product.brand.toUpperCase()}</div>
          <h1 className="mt-2 font-display text-4xl md:text-5xl font-bold tracking-tight text-balance">{product.name}</h1>
          <div className="mt-1 text-muted-foreground">{product.colorway}</div>

          <div className="mt-6 flex items-baseline gap-3">
            <div className="font-display text-3xl font-bold">R{product.price.toLocaleString()}</div>
            {product.price < product.retail && (
              <div className="text-lg text-muted-foreground line-through">R{product.retail.toLocaleString()}</div>
            )}
          </div>

          <div className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-bold tracking-widest">SIZE — UK</div>
              <button className="text-xs text-muted-foreground hover:text-pulse">Size guide</button>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {product.sizes.map((s: number) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`py-3 rounded-lg border text-sm font-medium transition ${size === s ? "border-pulse bg-pulse text-black" : "border-border hover:border-foreground"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              onClick={addToBag}
              disabled={!size}
              className="flex-1 rounded-full bg-pulse text-black py-4 font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition pulse-glow"
            >
              {size ? `Add to bag · R${product.price.toLocaleString()}` : "Select a size"}
            </button>
            <button onClick={() => { wish.toggle(product.slug); toast(saved ? "Removed from wishlist" : "Saved to wishlist"); }} className={`rounded-full border w-14 grid place-items-center transition ${saved ? "border-pulse text-pulse bg-pulse/10" : "border-border hover:border-pulse hover:text-pulse"}`} aria-label="Wishlist">
              <Heart className={`h-5 w-5 ${saved ? "fill-current" : ""}`} />
            </button>
            <button onClick={shareIt} className="rounded-full border border-border w-14 grid place-items-center hover:border-pulse hover:text-pulse transition" aria-label="Share">
              <Share2 className="h-5 w-5" />
            </button>
          </div>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

          <p className="mt-10 text-muted-foreground leading-relaxed">{product.description}</p>

          <div className="mt-10 grid grid-cols-3 gap-4 border-t border-border pt-8">
            {[
              { icon: Truck, label: "Free shipping", sub: "Over R1,500" },
              { icon: RotateCcw, label: "30-day returns", sub: "On unworn pairs" },
              { icon: Shield, label: "Authenticated", sub: "100% guaranteed" },
            ].map((f) => (
              <div key={f.label}>
                <f.icon className="h-5 w-5 text-pulse mb-2" />
                <div className="text-sm font-medium">{f.label}</div>
                <div className="text-xs text-muted-foreground">{f.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-[1400px] px-6 py-24 border-t border-border mt-16">
        <div className="text-xs font-mono tracking-widest text-pulse mb-3">◆ PAIR WELL</div>
        <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight mb-12">You might also walk in.</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {related.map((p, i) => <ProductCard key={p.slug} product={p} index={i} />)}
        </div>
      </section>

      <Footer />
    </div>
  );
}
