import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowUpRight, Bell } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ProductCard } from "@/components/site/ProductCard";
import { BRANDS, DROPS, JOURNAL } from "@/lib/products";
import { useProducts } from "@/lib/useProducts";
import heroImg from "@/assets/hero-sneaker.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pavement Pulse — Premium Sneaker Destination" },
      { name: "description", content: "Limited drops, curated brands, and the culture of the pavement." },
      { property: "og:title", content: "Pavement Pulse — Premium Sneaker Destination" },
      { property: "og:description", content: "The soul / sole of the city." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Hero />
      <Marquee />
      <Featured />
      <DropsCalendar />
      <BrandsStrip />
      <SneakerOfTheWeek />
      <Journal />
      <NewsletterCTA />
      <Footer />
    </div>
  );
}

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section ref={ref} className="relative h-[92vh] min-h-[640px] overflow-hidden">
      <motion.div style={{ y, opacity }} className="absolute inset-0">
        <img src={heroImg} alt="" className="absolute inset-0 h-full w-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/10 to-background" />
        <div className="absolute inset-0 gradient-radial-pulse opacity-60" />
        <div className="absolute inset-0 noise opacity-[0.05] mix-blend-overlay" />
      </motion.div>

      <div className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col justify-end px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-pulse/40 bg-background/40 backdrop-blur px-3 py-1 text-xs font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-pulse animate-pulse" />
            VOL. 04 — VOLT WAVE DROP — FRI 14 JUN · 09:00
          </div>
          <h1 className="mt-6 font-display text-[clamp(3rem,9vw,9rem)] font-bold leading-[0.9] tracking-tight text-balance">
            The soul<span className="text-pulse">/</span>sole<br />
            of the city.
          </h1>
          <p className="mt-6 max-w-lg text-base md:text-lg text-muted-foreground text-balance">
            A premium destination for sneaker culture. Limited drops, curated brands, and the heritage of the pavement — built into every step.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/catalog" search={{ brand: undefined }} className="group inline-flex items-center gap-2 rounded-full bg-pulse px-7 py-3.5 text-sm font-bold text-black hover:opacity-90 transition pulse-glow">
              Shop the drop
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link to="/drops" className="inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-background/30 backdrop-blur px-7 py-3.5 text-sm font-medium hover:border-foreground/40 transition">
              <Bell className="h-4 w-4" /> Release calendar
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-mono tracking-widest text-muted-foreground">
        ↓ SCROLL
      </div>
    </section>
  );
}

function Marquee() {
  const items = ["NEW DROP FRIDAY", "FREE SHIPPING OVER R1500", "MEMBERS GET EARLY ACCESS", "AUTHENTICATED · GUARANTEED", "BUILT IN JOHANNESBURG"];
  const loop = [...items, ...items, ...items];
  return (
    <section className="border-y border-border bg-background overflow-hidden py-4">
      <div className="flex marquee-track gap-12 whitespace-nowrap font-mono text-xs tracking-widest">
        {loop.map((t, i) => (
          <span key={i} className="flex items-center gap-12 text-muted-foreground">
            {t}
            <span className="h-1 w-1 rounded-full bg-pulse" />
          </span>
        ))}
      </div>
    </section>
  );
}

function Featured() {
  const { products } = useProducts();
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-24">
      <div className="flex items-end justify-between mb-12">
        <div>
          <div className="text-xs font-mono tracking-widest text-pulse mb-3">◆ NEW THIS WEEK</div>
          <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-balance">Featured drops</h2>
        </div>
        <Link to="/catalog" search={{ brand: undefined }} className="hidden sm:inline-flex items-center gap-1 text-sm font-medium hover:text-pulse transition">
          View all <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.slice(0, 4).map((p, i) => <ProductCard key={p.slug} product={p} index={i} />)}
      </div>
    </section>
  );
}

function DropsCalendar() {
  return (
    <section id="culture" className="border-y border-border bg-surface">
      <div className="mx-auto max-w-[1400px] px-6 py-24">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-12">
          <div>
            <div className="text-xs font-mono tracking-widest text-pulse mb-3">◆ RELEASE CALENDAR</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">Upcoming<br />drops.</h2>
            <p className="mt-5 text-muted-foreground max-w-sm">
              Set your reminders. Drops go live at 09:00 SAST. Members unlock early access 24 hours prior.
            </p>
            <button className="mt-8 inline-flex items-center gap-2 rounded-full border border-foreground/20 px-6 py-3 text-sm font-medium hover:border-pulse hover:text-pulse transition">
              <Bell className="h-4 w-4" /> Get drop alerts
            </button>
          </div>
          <div className="divide-y divide-border border-y border-border">
            {DROPS.map((d, i) => (
              <motion.div
                key={d.name}
                initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group grid grid-cols-[auto_1fr_auto] items-center gap-6 py-6 cursor-pointer"
              >
                <div className="font-mono text-xs tracking-widest text-muted-foreground w-24">{d.date}</div>
                <div>
                  <div className="font-display text-xl md:text-2xl font-medium group-hover:text-pulse transition">{d.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">{d.brand} · {d.time}</div>
                </div>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-pulse group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function BrandsStrip() {
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-24">
      <div className="text-xs font-mono tracking-widest text-pulse mb-3">◆ HOUSES</div>
      <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-12">Curated brands.</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-px bg-border border border-border">
        {BRANDS.map((b) => (
          <div key={b} className="bg-background aspect-[3/2] grid place-items-center hover:bg-surface transition cursor-pointer group">
            <span className="font-display text-sm md:text-base font-bold tracking-tight group-hover:text-pulse transition">{b}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function SneakerOfTheWeek() {
  const { products } = useProducts();
  const p = products[0];
  if (!p) return null;
  return (
    <section className="relative overflow-hidden bg-black text-white">
      <div className="absolute inset-0 gradient-radial-pulse opacity-30" />
      <div className="relative mx-auto max-w-[1400px] px-6 py-24 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative aspect-square"
        >
          <img src={p.image} alt={p.name} className="h-full w-full object-cover rounded-2xl" />
        </motion.div>
        <div>
          <div className="text-xs font-mono tracking-widest text-pulse mb-3">◆ SNEAKER OF THE WEEK</div>
          <h2 className="font-display text-5xl md:text-7xl font-bold tracking-tight text-balance">{p.name}</h2>
          <p className="mt-6 text-white/70 max-w-md">{p.description}</p>
          <div className="mt-8 grid grid-cols-3 gap-6 max-w-md">
            <Stat label="DROP" value="14 JUN" />
            <Stat label="RETAIL" value={`R${p.price.toLocaleString()}`} />
            <Stat label="EDITION" value="LIMITED" />
          </div>
          <Link to="/product/$slug" params={{ slug: p.slug }} className="mt-10 inline-flex items-center gap-2 rounded-full bg-pulse px-7 py-3.5 text-sm font-bold text-black hover:opacity-90 transition pulse-glow">
            Reserve a pair <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-mono tracking-widest text-white/40">{label}</div>
      <div className="font-display text-lg font-medium mt-1">{value}</div>
    </div>
  );
}

function Journal() {
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-24">
      <div className="flex items-end justify-between mb-12">
        <div>
          <div className="text-xs font-mono tracking-widest text-pulse mb-3">◆ JOURNAL</div>
          <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight">Sneaker culture, weekly.</h2>
        </div>
        <Link to="/journal" className="hidden sm:inline-flex items-center gap-1 text-sm font-medium hover:text-pulse transition">
          All stories <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {JOURNAL.map((j, i) => (
          <motion.article
            key={j.slug}
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
            className="group cursor-pointer"
          >
            <div className="aspect-[4/5] rounded-xl bg-surface overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-pulse/20 via-transparent to-foreground/10" />
              <div className="absolute inset-0 noise opacity-10" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="text-[10px] font-mono tracking-widest text-pulse">{j.category.toUpperCase()}</div>
              </div>
            </div>
            <div className="mt-5">
              <h3 className="font-display text-2xl font-medium group-hover:text-pulse transition">{j.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{j.excerpt}</p>
              <div className="mt-3 text-[10px] font-mono tracking-widest text-muted-foreground">{j.read.toUpperCase()}</div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function NewsletterCTA() {
  return (
    <section className="mx-auto max-w-[1400px] px-6">
      <div className="relative overflow-hidden rounded-3xl bg-surface border border-border p-10 md:p-20">
        <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-pulse/20 blur-3xl" />
        <div className="relative max-w-2xl">
          <div className="text-xs font-mono tracking-widest text-pulse mb-3">◆ THE LIST</div>
          <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-balance">Drop alerts, early access, and the occasional secret.</h2>
          <form className="mt-10 flex flex-col sm:flex-row gap-3 max-w-lg">
            <input
              placeholder="your@email.com"
              className="flex-1 rounded-full border border-border bg-background px-5 py-3.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-pulse"
            />
            <button className="rounded-full bg-pulse px-7 py-3.5 text-sm font-bold text-black hover:opacity-90 transition">Join the list</button>
          </form>
          <p className="mt-3 text-xs text-muted-foreground">No spam. Unsubscribe anytime. We respect your inbox.</p>
        </div>
      </div>
    </section>
  );
}
