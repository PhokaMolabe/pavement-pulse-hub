import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Bell, ArrowUpRight } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { DROPS } from "@/lib/products";

export const Route = createFileRoute("/drops")({
  head: () => ({ meta: [{ title: "Release Calendar — Pavement Pulse" }, { name: "description", content: "Every upcoming sneaker drop. Set reminders, get early access." }] }),
  component: Drops,
});

function Drops() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="border-b border-border bg-surface">
        <div className="mx-auto max-w-[1400px] px-6 py-20">
          <div className="text-xs font-mono tracking-widest text-pulse mb-3">◆ RELEASE CALENDAR</div>
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight">Drops, scheduled.</h1>
          <p className="mt-5 max-w-xl text-muted-foreground">All drops go live 09:00 SAST. Members unlock early access 24 hours before public release.</p>
          <button className="mt-8 inline-flex items-center gap-2 rounded-full bg-pulse px-6 py-3 text-sm font-bold text-black hover:opacity-90 transition pulse-glow">
            <Bell className="h-4 w-4" /> Subscribe to alerts
          </button>
        </div>
      </div>
      <div className="mx-auto max-w-[1400px] px-6 py-16">
        <div className="divide-y divide-border border-y border-border">
          {[...DROPS, ...DROPS].map((d, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (i % 4) * 0.05 }}
              className="group grid grid-cols-[auto_1fr_auto] items-center gap-6 py-8 cursor-pointer"
            >
              <div className="font-mono text-xs tracking-widest text-muted-foreground w-28">{d.date}</div>
              <div>
                <div className="font-display text-2xl md:text-3xl font-medium group-hover:text-pulse transition">{d.name}</div>
                <div className="text-sm text-muted-foreground mt-1">{d.brand} · {d.time}</div>
              </div>
              <ArrowUpRight className="h-6 w-6 text-muted-foreground group-hover:text-pulse transition" />
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
