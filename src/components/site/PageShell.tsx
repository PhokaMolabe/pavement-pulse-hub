import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import type { ReactNode } from "react";

export function PageShell({ eyebrow, title, intro, children }: {
  eyebrow: string; title: string; intro?: string; children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="border-b border-border bg-surface">
        <div className="mx-auto max-w-[1400px] px-6 py-20">
          <div className="text-xs font-mono tracking-widest text-pulse mb-3">◆ {eyebrow.toUpperCase()}</div>
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight text-balance">{title}</h1>
          {intro && <p className="mt-5 max-w-2xl text-muted-foreground">{intro}</p>}
        </div>
      </div>
      <main className="mx-auto max-w-[900px] px-6 py-16 prose-lovable">
        {children}
      </main>
      <Footer />
    </div>
  );
}
