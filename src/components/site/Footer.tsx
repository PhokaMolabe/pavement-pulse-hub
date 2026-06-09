import logo from "@/assets/logo.asset.json";
import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="mt-32 border-t border-border bg-background">
      <div className="mx-auto max-w-[1400px] px-6 py-20">
        <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <img src={logo.url} alt="" className="h-10 w-10 rounded-full" />
              <span className="font-display font-bold tracking-tight">PAVEMENT PULSE</span>
            </div>
            <p className="mt-5 font-display text-2xl tracking-tight text-balance max-w-sm">
              The soul <span className="text-muted-foreground">/</span> sole of the city.
            </p>
            <form className="mt-8 flex max-w-sm gap-0 border-b border-foreground/40 pb-2">
              <input
                placeholder="your@email.com"
                className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
              />
              <button className="text-xs font-bold tracking-widest text-pulse hover:underline">JOIN →</button>
            </form>
          </div>
          {[
            { title: "Shop", links: ["New Arrivals", "Drops", "Sale", "Gift Cards"] },
            { title: "Help", links: ["Contact", "Shipping", "Returns", "FAQ"] },
            { title: "Company", links: ["About", "Journal", "Stores", "Careers"] },
            { title: "Legal", links: ["Terms", "Privacy", "POPIA", "Accessibility"] },
          ].map((col) => (
            <div key={col.title}>
              <div className="text-xs font-bold tracking-widest text-muted-foreground mb-4">{col.title.toUpperCase()}</div>
              <ul className="space-y-3 text-sm">
                {col.links.map((l) => (
                  <li key={l}><Link to="/" className="hover:text-pulse transition-colors">{l}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between border-t border-border pt-8 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} Pavement Pulse Co. All rights reserved.</div>
          <div className="font-mono">JHB · CPT · DBN</div>
        </div>
      </div>
    </footer>
  );
}
