import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Terms of Service — Pavement Pulse" }, { name: "description", content: "Pavement Pulse terms of service." }] }),
  component: () => (
    <PageShell eyebrow="Legal" title="Terms of Service" intro="Last updated: January 2026. By using Pavement Pulse you agree to the following terms.">
      <h2>1. Acceptance</h2>
      <p>By accessing pavementpulse.co (the "Site") you agree to be bound by these Terms. If you do not agree, do not use the Site.</p>
      <h2>2. Orders & Pricing</h2>
      <p>All prices are quoted in South African Rand (ZAR) and include VAT where applicable. We reserve the right to cancel or refuse any order at our discretion, including for pricing errors or suspected fraud.</p>
      <h2>3. Authentication</h2>
      <p>Every pair sold through Pavement Pulse is authenticated. If a product is later determined to be inauthentic, we will issue a full refund.</p>
      <h2>4. Intellectual Property</h2>
      <p>All content on the Site — including logos, imagery, editorial and code — is the property of Pavement Pulse or its licensors and may not be reused without written permission.</p>
      <h2>5. Limitation of Liability</h2>
      <p>To the maximum extent permitted by law, Pavement Pulse is not liable for indirect, consequential or incidental damages arising from your use of the Site or products purchased through it.</p>
      <h2>6. Governing Law</h2>
      <p>These Terms are governed by the laws of the Republic of South Africa.</p>
      <h2>7. Contact</h2>
      <p>Questions? Reach us at <a href="mailto:hello@pavementpulse.co" className="text-pulse hover:underline">hello@pavementpulse.co</a>.</p>
    </PageShell>
  ),
});
