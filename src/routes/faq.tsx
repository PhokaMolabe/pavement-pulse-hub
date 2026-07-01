import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";

const faqs = [
  { q: "Are all pairs authentic?", a: "Yes. Every pair passes through our in-house authentication process before it ships." },
  { q: "Do you restock sold-out sizes?", a: "Sometimes. Sign in and tap the bell on a product to be notified if a restock lands." },
  { q: "Can I cancel or edit an order?", a: "Reach us within 60 minutes of placing your order and we'll do our best. Once dispatched, treat it as a return." },
  { q: "Do you offer gift wrapping?", a: "Yes — select 'gift' at checkout for a signature Pavement Pulse box and handwritten note (free on orders over R2,500)." },
  { q: "How do drops work?", a: "Featured drops release at their scheduled time. Sign up for drop alerts to get a 5-minute early access notification." },
  { q: "Do you ship internationally?", a: "Yes, to select markets. See our Shipping page for the full list and rates." },
];

export const Route = createFileRoute("/faq")({
  head: () => ({ meta: [{ title: "FAQ — Pavement Pulse" }, { name: "description", content: "Answers to common questions about ordering, drops, and returns." }] }),
  component: () => (
    <PageShell eyebrow="Support" title="Frequently asked" intro="Can't find what you're looking for? Contact us.">
      <div className="space-y-4 not-prose">
        {faqs.map((f) => (
          <details key={f.q} className="group rounded-2xl border border-border bg-surface p-6 open:border-pulse/50 transition">
            <summary className="cursor-pointer font-display font-bold text-lg flex justify-between items-center list-none">
              {f.q}
              <span className="text-pulse text-xl group-open:rotate-45 transition">+</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>
    </PageShell>
  ),
});
