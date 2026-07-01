import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Mail, MapPin, MessageSquare, Phone } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [
    { title: "Contact — Pavement Pulse" },
    { name: "description", content: "Get in touch with Pavement Pulse — support, wholesale, and press." },
    { property: "og:title", content: "Contact — Pavement Pulse" },
    { property: "og:description", content: "Reach the Pavement Pulse team." },
  ] }),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(1, "Name required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  subject: z.string().trim().min(1, "Subject required").max(150),
  message: z.string().trim().min(10, "Please add a little more detail").max(2000),
});

function Contact() {
  const [status, setStatus] = useState<null | "ok" | { field: string; msg: string }[]>(null);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) {
      setStatus(parsed.error.issues.map((i) => ({ field: String(i.path[0]), msg: i.message })));
      return;
    }
    setStatus("ok");
    e.currentTarget.reset();
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="border-b border-border bg-surface">
        <div className="mx-auto max-w-[1400px] px-6 py-20">
          <div className="text-xs font-mono tracking-widest text-pulse mb-3">◆ CONTACT</div>
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight">Get in touch.</h1>
          <p className="mt-4 max-w-xl text-muted-foreground">Support, wholesale, press — pick a channel and we'll be back within one business day.</p>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-6 py-16 grid lg:grid-cols-[1fr_320px] gap-12">
        <form onSubmit={submit} className="space-y-6">
          {status === "ok" && (
            <div className="rounded-lg border border-pulse/40 bg-pulse/10 px-4 py-3 text-sm">
              Thanks — we'll be in touch shortly.
            </div>
          )}
          <div className="grid sm:grid-cols-2 gap-4">
            <Input name="name" label="Name" error={findError(status, "name")} />
            <Input name="email" label="Email" type="email" error={findError(status, "email")} />
          </div>
          <Input name="subject" label="Subject" error={findError(status, "subject")} />
          <label className="block">
            <span className="text-xs text-muted-foreground">Message</span>
            <textarea name="message" rows={6} className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-pulse resize-none" />
            {findError(status, "message") && <div className="text-xs text-destructive mt-1">{findError(status, "message")}</div>}
          </label>
          <button type="submit" className="rounded-full bg-pulse text-black px-7 py-3 text-sm font-bold hover:opacity-90 transition pulse-glow">Send message</button>
        </form>

        <aside className="space-y-6">
          {[
            { icon: Mail, label: "Support", value: "hello@pavementpulse.co" },
            { icon: MessageSquare, label: "Press", value: "press@pavementpulse.co" },
            { icon: Phone, label: "Wholesale", value: "+27 11 000 0000" },
            { icon: MapPin, label: "Studio", value: "44 Rissik St, Braamfontein\nJohannesburg, 2001" },
          ].map((c) => (
            <div key={c.label} className="rounded-2xl border border-border bg-surface p-5">
              <c.icon className="h-5 w-5 text-pulse mb-3" />
              <div className="text-xs font-mono tracking-widest text-muted-foreground">{c.label.toUpperCase()}</div>
              <div className="mt-1 text-sm whitespace-pre-line">{c.value}</div>
            </div>
          ))}
        </aside>
      </div>
      <Footer />
    </div>
  );
}

function Input({ name, label, type = "text", error }: { name: string; label: string; type?: string; error?: string }) {
  return (
    <label className="block">
      <span className="text-xs text-muted-foreground">{label}</span>
      <input name={name} type={type} className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-pulse" />
      {error && <div className="text-xs text-destructive mt-1">{error}</div>}
    </label>
  );
}

function findError(status: null | "ok" | { field: string; msg: string }[], field: string) {
  if (!status || status === "ok") return undefined;
  return status.find((s) => s.field === field)?.msg;
}
