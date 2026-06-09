import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { JOURNAL } from "@/lib/products";
import { motion } from "motion/react";

export const Route = createFileRoute("/journal")({
  head: () => ({ meta: [{ title: "Journal — Pavement Pulse" }, { name: "description", content: "Sneaker culture, weekly. Editorial, interviews, and field guides." }] }),
  component: Journal,
});

function Journal() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="border-b border-border bg-surface">
        <div className="mx-auto max-w-[1400px] px-6 py-20">
          <div className="text-xs font-mono tracking-widest text-pulse mb-3">◆ THE JOURNAL</div>
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight text-balance">Stories from the pavement.</h1>
          <p className="mt-5 max-w-xl text-muted-foreground">Long-form editorial, conversations with the houses, and the field guides that shape the way we wear what we wear.</p>
        </div>
      </div>
      <div className="mx-auto max-w-[1400px] px-6 py-16 grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {[...JOURNAL, ...JOURNAL].map((j, i) => (
          <motion.article
            key={i}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
            className="group cursor-pointer"
          >
            <div className="aspect-[4/5] rounded-xl bg-surface overflow-hidden relative">
              <div className={`absolute inset-0 bg-gradient-to-br ${i % 3 === 0 ? "from-pulse/30 to-foreground/10" : i % 3 === 1 ? "from-foreground/20 to-pulse/10" : "from-pulse/10 to-foreground/20"}`} />
              <div className="absolute inset-0 noise opacity-10" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="text-[10px] font-mono tracking-widest text-pulse">{j.category.toUpperCase()}</div>
              </div>
            </div>
            <h3 className="mt-5 font-display text-2xl font-medium group-hover:text-pulse transition">{j.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{j.excerpt}</p>
            <div className="mt-3 text-[10px] font-mono tracking-widest text-muted-foreground">{j.read.toUpperCase()}</div>
          </motion.article>
        ))}
      </div>
      <Footer />
    </div>
  );
}
