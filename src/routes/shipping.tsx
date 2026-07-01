import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";

export const Route = createFileRoute("/shipping")({
  head: () => ({ meta: [{ title: "Shipping — Pavement Pulse" }, { name: "description", content: "Delivery options across South Africa and beyond." }] }),
  component: () => (
    <PageShell eyebrow="Support" title="Shipping" intro="Fast, tracked, insured. Free over R1,500.">
      <h2>South Africa</h2>
      <ul>
        <li><strong>Standard</strong> — 3–5 business days. R150 (free over R1,500).</li>
        <li><strong>Express</strong> — 1–2 business days. R280.</li>
        <li><strong>Same-day</strong> — JHB & CPT metros, order before 11:00. R450.</li>
      </ul>
      <h2>International</h2>
      <p>We ship to select markets via DHL Express. Rates and duties are calculated at checkout. Delivery within 4–7 business days.</p>
      <h2>Tracking</h2>
      <p>You'll receive a tracking link the moment your order leaves our warehouse in Johannesburg.</p>
    </PageShell>
  ),
});
