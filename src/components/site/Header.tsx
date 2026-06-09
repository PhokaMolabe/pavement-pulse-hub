import { Link } from "@tanstack/react-router";
import { Search, ShoppingBag, User, Menu } from "lucide-react";
import logo from "@/assets/logo.asset.json";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-8 px-6">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo.url} alt="Pavement Pulse" className="h-9 w-9 rounded-full object-cover" />
          <span className="font-display text-sm font-bold tracking-tight hidden sm:inline">PAVEMENT PULSE</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <Link to="/catalog" className="hover:text-pulse transition-colors" search={{ brand: undefined }}>Shop</Link>
          <Link to="/drops" className="hover:text-pulse transition-colors">Drops</Link>
          <Link to="/journal" className="hover:text-pulse transition-colors">Journal</Link>
          <Link to="/catalog" search={{ brand: undefined }} className="hover:text-pulse transition-colors">Brands</Link>
          <a href="#culture" className="hover:text-pulse transition-colors">Culture</a>
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <button className="p-2 hover:bg-secondary rounded-md transition-colors" aria-label="Search"><Search className="h-4 w-4" /></button>
          <button className="p-2 hover:bg-secondary rounded-md transition-colors" aria-label="Account"><User className="h-4 w-4" /></button>
          <button className="p-2 hover:bg-secondary rounded-md transition-colors relative" aria-label="Bag">
            <ShoppingBag className="h-4 w-4" />
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-pulse text-[10px] font-bold text-black grid place-items-center">2</span>
          </button>
          <button className="md:hidden p-2 hover:bg-secondary rounded-md" aria-label="Menu"><Menu className="h-4 w-4" /></button>
        </div>
      </div>
    </header>
  );
}
