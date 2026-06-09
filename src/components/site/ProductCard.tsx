import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import type { Product } from "@/lib/products";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        to="/product/$slug"
        params={{ slug: product.slug }}
        className="group block"
      >
        <div className="relative aspect-square overflow-hidden rounded-xl bg-surface">
          <motion.img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
          {product.tag && (
            <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-background/90 backdrop-blur text-[10px] font-bold tracking-widest">
              <span className={product.tag === "Limited" || product.tag === "Drop" ? "text-pulse" : ""}>
                {product.tag.toUpperCase()}
              </span>
            </div>
          )}
          {product.price < product.retail && (
            <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-pulse text-black text-[10px] font-bold tracking-widest">
              SALE
            </div>
          )}
        </div>
        <div className="mt-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">{product.brand}</div>
            <div className="font-display font-medium truncate">{product.name}</div>
            <div className="text-xs text-muted-foreground truncate">{product.colorway}</div>
          </div>
          <div className="text-right shrink-0">
            <div className="font-mono text-sm font-medium">R{product.price.toLocaleString()}</div>
            {product.price < product.retail && (
              <div className="font-mono text-[11px] text-muted-foreground line-through">R{product.retail.toLocaleString()}</div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
