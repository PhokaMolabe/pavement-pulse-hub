import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";

export const Route = createFileRoute("/returns")({
  head: () => ({ meta: [{ title: "Returns — Pavement Pulse" }, { name: "description", content: "30-day returns on unworn pairs." }] }),
  component: () => (
    <PageShell eyebrow="Support" title="Returns & Exchanges" intro="Simple, fair, no drama.">
      <h2>Our promise</h2>
      <p>You have 30 days from delivery to return unworn pairs in original packaging for a full refund or size exchange.</p>
      <h2>How to return</h2>
      <ol>
        <li>Email <a href="mailto:returns@pavementpulse.co" className="text-pulse hover:underline">returns@pavementpulse.co</a> with your order number.</li>
        <li>We'll send a prepaid label within one business day.</li>
        <li>Drop the box with any PUDO / Courier Guy pickup point.</li>
        <li>Refund is processed within 3 business days of receipt.</li>
      </ol>
      <h2>Not eligible</h2>
      <p>Worn pairs, custom orders, and final-sale drops. Original box must be included as packaging — do not tape or write on the shoebox.</p>
    </PageShell>
  ),
});
