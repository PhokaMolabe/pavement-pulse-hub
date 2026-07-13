import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { z } from "zod";

export const Route = createFileRoute("/checkout/success")({
  validateSearch: z.object({ order: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Order confirmed — Pavement Pulse" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Success,
});

function Success() {
  const { order } = Route.useSearch();
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-[720px] px-6 py-24 text-center">
        <div className="mx-auto h-16 w-16 rounded-full bg-pulse grid place-items-center mb-6">
          <CheckCircle2 className="h-8 w-8 text-black" />
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
          You're on the pavement.
        </h1>
        <p className="mt-4 text-muted-foreground">
          {order ? (
            <>Order <span className="font-mono text-foreground">{order}</span> is confirmed. A receipt is on its way to your inbox.</>
          ) : (
            <>Your order is confirmed. A receipt is on its way to your inbox.</>
          )}
        </p>
        <div className="mt-10 flex flex-wrap gap-3 justify-center">
          <Link to="/catalog" search={{ brand: undefined }} className="rounded-full bg-pulse px-6 py-3 text-sm font-bold text-black hover:opacity-90">Keep shopping</Link>
          <Link to="/account" className="rounded-full border border-border px-6 py-3 text-sm font-medium">Order history</Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
