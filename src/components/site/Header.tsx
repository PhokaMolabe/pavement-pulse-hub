import { Link } from "@tanstack/react-router";
import { Search, ShoppingBag, Heart, User, Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/logo.asset.json";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { SearchDialog } from "./SearchDialog";

export function Header() {
  const cart = useCart();
  const wish = useWishlist();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
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
            <Link to="/about" className="hover:text-pulse transition-colors">About</Link>
          </nav>

          <div className="ml-auto flex items-center gap-1">
            <button onClick={() => setSearchOpen(true)} className="p-2 hover:bg-secondary rounded-md transition-colors" aria-label="Search"><Search className="h-4 w-4" /></button>
            <Link to="/wishlist" className="p-2 hover:bg-secondary rounded-md transition-colors relative" aria-label="Wishlist">
              <Heart className="h-4 w-4" />
              {wish.slugs.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-foreground text-[10px] font-bold text-background grid place-items-center">{wish.slugs.length}</span>
              )}
            </Link>
            <Link to="/account" className="p-2 hover:bg-secondary rounded-md transition-colors" aria-label="Account"><User className="h-4 w-4" /></Link>
            <button onClick={() => cart.setOpen(true)} className="p-2 hover:bg-secondary rounded-md transition-colors relative" aria-label="Bag">
              <ShoppingBag className="h-4 w-4" />
              {cart.count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-pulse text-[10px] font-bold text-black grid place-items-center">{cart.count}</span>
              )}
            </button>
            <button onClick={() => setMenuOpen((v) => !v)} className="md:hidden p-2 hover:bg-secondary rounded-md" aria-label="Menu">
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav className="md:hidden border-t border-border bg-background px-6 py-4 flex flex-col gap-3 text-sm font-medium">
            <Link to="/catalog" search={{ brand: undefined }} onClick={() => setMenuOpen(false)}>Shop</Link>
            <Link to="/drops" onClick={() => setMenuOpen(false)}>Drops</Link>
            <Link to="/journal" onClick={() => setMenuOpen(false)}>Journal</Link>
            <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
            <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
          </nav>
        )}
      </header>
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
