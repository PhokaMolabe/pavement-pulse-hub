import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { LogOut, Package, ShieldCheck } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { useAuth } from "@/lib/auth";
import { listMyOrders } from "@/lib/api/orders.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [
    { title: "Account — Pavement Pulse" },
    { name: "description", content: "Your Pavement Pulse account, orders, and preferences." },
    { name: "robots", content: "noindex" },
  ] }),
  component: Account,
});

function Account() {
  const { user, loading, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const fetchOrders = useServerFn(listMyOrders);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) fetchOrders().then(setOrders).catch(() => {});
  }, [user, fetchOrders]);

  if (loading || !user) {
    return <div className="min-h-screen bg-background"><Header /><div className="mx-auto max-w-[1200px] px-6 py-16 text-muted-foreground">Loading…</div></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-[1200px] px-6 py-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="text-xs font-mono tracking-widest text-pulse mb-2">◆ MEMBER</div>
            <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight">Welcome back.</h1>
            <p className="mt-2 text-muted-foreground">{user.email}</p>
          </div>
          <div className="flex gap-2">
            {isAdmin && (
              <Link to="/admin" className="inline-flex items-center gap-2 rounded-full bg-pulse text-black px-5 py-2.5 text-sm font-bold hover:opacity-90">
                <ShieldCheck className="h-4 w-4" /> Admin
              </Link>
            )}
            <button onClick={async () => { await signOut(); toast.success("Signed out"); navigate({ to: "/" }); }}
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium hover:border-pulse">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>

        <div className="mt-12">
          <div className="flex items-center gap-2 mb-6"><Package className="h-4 w-4 text-pulse" /><h2 className="font-display text-2xl font-bold">Order history</h2></div>
          {orders.length === 0 ? (
            <div className="rounded-2xl border border-border bg-surface p-8 text-center text-muted-foreground">
              No orders yet. <Link to="/catalog" search={{ brand: undefined }} className="text-pulse hover:underline">Start shopping</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((o) => (
                <div key={o.id} className="rounded-xl border border-border bg-surface p-5 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="font-mono text-sm text-pulse">{o.order_number}</div>
                    <div className="text-xs text-muted-foreground mt-1">{new Date(o.created_at).toLocaleDateString()} · {o.items?.length ?? 0} items</div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${o.status === "delivered" ? "bg-pulse/20 text-pulse" : "bg-secondary text-foreground"}`}>{o.status}</span>
                    <div className="font-mono font-bold">R{o.total.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
