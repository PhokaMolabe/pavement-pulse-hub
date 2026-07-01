import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Package, Heart, MapPin, Bell, LogOut } from "lucide-react";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [
    { title: "Account — Pavement Pulse" },
    { name: "description", content: "Your Pavement Pulse account, orders, and preferences." },
    { name: "robots", content: "noindex" },
  ] }),
  component: Account,
});

function Account() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-[1200px] px-6 py-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="text-xs font-mono tracking-widest text-pulse mb-2">◆ MEMBER SINCE 2026</div>
            <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight">Welcome back.</h1>
            <p className="mt-2 text-muted-foreground">Guest mode · Enable Lovable Cloud to activate real accounts.</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium hover:border-pulse">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>

        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Package, label: "Orders", value: "0 active", to: "/account" },
            { icon: Heart, label: "Wishlist", value: "Saved pairs", to: "/wishlist" as const },
            { icon: MapPin, label: "Addresses", value: "Manage", to: "/account" },
            { icon: Bell, label: "Drop alerts", value: "On", to: "/drops" as const },
          ].map((c) => (
            <Link key={c.label} to={c.to} className="rounded-2xl border border-border bg-surface p-6 hover:border-pulse transition group">
              <c.icon className="h-5 w-5 text-pulse mb-4" />
              <div className="font-display font-bold group-hover:text-pulse">{c.label}</div>
              <div className="text-xs text-muted-foreground mt-1">{c.value}</div>
            </Link>
          ))}
        </div>

        <section className="mt-14">
          <h2 className="font-display text-2xl font-bold mb-6">Recent orders</h2>
          <div className="rounded-2xl border border-border bg-surface p-12 text-center">
            <div className="font-medium">No orders yet.</div>
            <p className="text-sm text-muted-foreground mt-1">When you check out, your orders show up here.</p>
            <Link to="/catalog" search={{ brand: undefined }} className="mt-6 inline-flex rounded-full bg-pulse text-black px-6 py-2.5 text-sm font-bold hover:opacity-90">Start shopping</Link>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
