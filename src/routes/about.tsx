import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { motion } from "motion/react";
import hero from "@/assets/hero-sneaker.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [
    { title: "About — Pavement Pulse" },
    { name: "description", content: "Built in Johannesburg. Pavement Pulse is a premium destination for sneaker culture — curated brands, limited drops, and heritage design." },
    { property: "og:title", content: "About — Pavement Pulse" },
    { property: "og:description", content: "Built in Johannesburg. A premium destination for sneaker culture." },
  ] }),
  component: About,
});

function About() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <img src={hero} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background" />
        <div className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col justify-end px-6 pb-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="text-xs font-mono tracking-widest text-pulse mb-3">◆ ABOUT</div>
            <h1 className="font-display text-5xl md:text-8xl font-bold tracking-tight text-balance max-w-4xl">
              We build for the walk.
            </h1>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-[900px] px-6 py-24">
        <p className="font-display text-2xl md:text-3xl leading-snug text-balance">
          Pavement Pulse started as a group text between three friends who loved sneakers more than sneakers loved us back. We wanted a place that took the culture as seriously as the product — one that treated a well-worn pair as an artifact, not a commodity.
        </p>
        <p className="mt-8 text-muted-foreground leading-relaxed">
          Today we're a premium sneaker destination based in Johannesburg, working with a curated roster of houses across performance, lifestyle, and skate. Every pair we stock is authenticated. Every drop we run is designed to be worn — not resold. We ship across South Africa and to select international markets.
        </p>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-[1400px] px-6 py-24 grid md:grid-cols-3 gap-12">
          {[
            { n: "01", t: "Curation over volume", d: "We stock what we'd wear. If a silhouette doesn't earn its place, it doesn't make the floor." },
            { n: "02", t: "Authenticity, always", d: "Every pair passes through our authentication process before it ships. If it's not real, it's not for sale." },
            { n: "03", t: "Culture first", d: "The journal, the drops, the design language — all in service of the community that made sneakers what they are." },
          ].map((v) => (
            <div key={v.n}>
              <div className="font-mono text-xs tracking-widest text-pulse mb-3">◆ {v.n}</div>
              <div className="font-display text-2xl font-bold mb-3">{v.t}</div>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 py-24 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { v: "12", l: "Curated houses" },
          { v: "180+", l: "Silhouettes on the floor" },
          { v: "48hr", l: "Authentication guarantee" },
          { v: "JHB", l: "Made in the city" },
        ].map((s) => (
          <div key={s.l}>
            <div className="font-display text-5xl md:text-6xl font-bold tracking-tight text-pulse">{s.v}</div>
            <div className="mt-2 text-xs font-mono tracking-widest text-muted-foreground">{s.l.toUpperCase()}</div>
          </div>
        ))}
      </section>
      <Footer />
    </div>
  );
}
