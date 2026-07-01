import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy Policy — Pavement Pulse" }, { name: "description", content: "How Pavement Pulse handles your data." }] }),
  component: () => (
    <PageShell eyebrow="Legal" title="Privacy Policy" intro="We collect what we need to fulfil your order and improve the experience — nothing more.">
      <h2>What we collect</h2>
      <p>Account details (name, email, delivery address), order history, and anonymised analytics on how you use the Site.</p>
      <h2>How we use it</h2>
      <p>To process orders, provide support, prevent fraud, personalise recommendations, and — with your consent — send marketing.</p>
      <h2>Sharing</h2>
      <p>We share data only with the processors required to run the business: payment providers, logistics partners, email and analytics platforms. We never sell your data.</p>
      <h2>Your rights</h2>
      <p>Under POPIA and GDPR you may request access, correction, or deletion of your data by emailing <a href="mailto:privacy@pavementpulse.co" className="text-pulse hover:underline">privacy@pavementpulse.co</a>.</p>
      <h2>Cookies</h2>
      <p>We use essential cookies for session management and optional cookies for analytics. You can disable non-essential cookies in your browser.</p>
    </PageShell>
  ),
});
