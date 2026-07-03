import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Plus, Trash2, Package, Settings, ShoppingBag, X } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { useAuth } from "@/lib/auth";
import {
  listProductsAdmin, upsertProduct, deleteProduct,
  getAdminEmail, setAdminEmail, grantAdmin,
} from "@/lib/api/admin.functions";
import { listAllOrders, updateOrderStatus } from "@/lib/api/orders.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [
    { title: "Admin — Pavement Pulse" },
    { name: "robots", content: "noindex" },
  ] }),
  component: Admin,
});

type Tab = "products" | "orders" | "settings";

function Admin() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("products");
  const [bootstrapping, setBootstrapping] = useState(false);
  const grant = useServerFn(grantAdmin);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [user, loading, navigate]);

  if (loading || !user) return <Shell><div className="text-muted-foreground">Loading…</div></Shell>;

  if (!isAdmin) {
    return (
      <Shell>
        <div className="max-w-md">
          <h1 className="font-display text-3xl font-bold">Admin access required</h1>
          <p className="mt-2 text-muted-foreground text-sm">
            If you're the site owner, claim the first admin role for <span className="text-foreground">{user.email}</span>.
            This works only if no admin exists yet.
          </p>
          <button
            disabled={bootstrapping}
            onClick={async () => {
              setBootstrapping(true);
              try {
                await grant({ data: { email: user.email! } });
                toast.success("Admin role granted. Reloading…");
                window.location.reload();
              } catch (e: any) { toast.error(e.message ?? "Failed"); }
              finally { setBootstrapping(false); }
            }}
            className="mt-6 rounded-full bg-pulse text-black px-6 py-3 text-sm font-bold hover:opacity-90 disabled:opacity-50">
            {bootstrapping ? "…" : "Claim admin role"}
          </button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="flex flex-wrap items-end justify-between gap-6 mb-8">
        <div>
          <div className="text-xs font-mono tracking-widest text-pulse mb-2">◆ ADMIN PORTAL</div>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">Control room</h1>
        </div>
      </div>

      <div className="flex gap-1 mb-8 border-b border-border">
        <TabBtn active={tab === "products"} onClick={() => setTab("products")} icon={<Package className="h-4 w-4" />}>Inventory</TabBtn>
        <TabBtn active={tab === "orders"} onClick={() => setTab("orders")} icon={<ShoppingBag className="h-4 w-4" />}>Orders</TabBtn>
        <TabBtn active={tab === "settings"} onClick={() => setTab("settings")} icon={<Settings className="h-4 w-4" />}>Settings</TabBtn>
      </div>

      {tab === "products" && <ProductsTab />}
      {tab === "orders" && <OrdersTab />}
      {tab === "settings" && <SettingsTab />}
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-[1400px] px-6 py-12">{children}</div>
      <Footer />
    </div>
  );
}

function TabBtn({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition ${active ? "border-pulse text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
      {icon}{children}
    </button>
  );
}

function ProductsTab() {
  const list = useServerFn(listProductsAdmin);
  const upsert = useServerFn(upsertProduct);
  const del = useServerFn(deleteProduct);
  const [items, setItems] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  async function reload() { setLoading(true); try { setItems(await list()); } finally { setLoading(false); } }
  useEffect(() => { reload(); }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-muted-foreground">{items.length} products</div>
        <button onClick={() => setEditing({ slug: "", name: "", brand: "", colorway: "", price: 0, retail: 0, image: "", tag: "", category: "Lifestyle", sizes: [8,9,10,11], stock: 0, description: "", active: true })}
          className="inline-flex items-center gap-2 rounded-full bg-pulse text-black px-5 py-2.5 text-sm font-bold hover:opacity-90">
          <Plus className="h-4 w-4" /> New product
        </button>
      </div>

      {loading ? <div className="text-muted-foreground">Loading…</div> : (
        <div className="overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-muted-foreground border-b border-border">
              <tr><th className="text-left p-4">Product</th><th className="text-left p-4">Brand</th><th className="text-left p-4">Category</th><th className="text-right p-4">Price</th><th className="text-right p-4">Stock</th><th className="text-center p-4">Status</th><th className="p-4"></th></tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="border-b border-border/50 hover:bg-background/50">
                  <td className="p-4 font-medium">{p.name}<div className="text-xs text-muted-foreground font-mono">{p.slug}</div></td>
                  <td className="p-4 text-muted-foreground">{p.brand}</td>
                  <td className="p-4"><span className="text-xs rounded-full bg-background px-2 py-1 border border-border">{p.category}</span></td>
                  <td className="p-4 text-right font-mono">R{p.price.toLocaleString()}</td>
                  <td className="p-4 text-right font-mono">{p.stock}</td>
                  <td className="p-4 text-center">{p.active ? <span className="text-xs text-pulse">● Live</span> : <span className="text-xs text-muted-foreground">○ Hidden</span>}</td>
                  <td className="p-4 text-right whitespace-nowrap">
                    <button onClick={() => setEditing(p)} className="text-xs text-pulse hover:underline mr-3">Edit</button>
                    <button onClick={async () => { if (confirm("Delete?")) { await del({ data: { id: p.id } }); toast.success("Deleted"); reload(); } }} className="text-xs text-destructive hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <ProductModal
          product={editing}
          onClose={() => setEditing(null)}
          onSave={async (p) => { await upsert({ data: p }); toast.success("Saved"); setEditing(null); reload(); }}
        />
      )}
    </div>
  );
}

function ProductModal({ product, onClose, onSave }: { product: any; onClose: () => void; onSave: (p: any) => Promise<void> }) {
  const [p, setP] = useState(product);
  const [busy, setBusy] = useState(false);
  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur grid place-items-center p-4 overflow-y-auto">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-2xl p-6 my-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-display text-xl font-bold">{product.id ? "Edit product" : "New product"}</h3>
          <button onClick={onClose}><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={async (e) => { e.preventDefault(); setBusy(true); try {
            await onSave({ ...p, sizes: typeof p.sizes === "string" ? p.sizes.split(",").map((s: string) => Number(s.trim())).filter(Boolean) : p.sizes });
          } catch (err: any) { toast.error(err.message); } finally { setBusy(false); } }}
          className="grid sm:grid-cols-2 gap-4">
          <F label="Slug" value={p.slug} onChange={(v) => setP({ ...p, slug: v })} required />
          <F label="Name" value={p.name} onChange={(v) => setP({ ...p, name: v })} required />
          <F label="Brand" value={p.brand} onChange={(v) => setP({ ...p, brand: v })} required />
          <F label="Colorway" value={p.colorway} onChange={(v) => setP({ ...p, colorway: v })} required />
          <F label="Category" value={p.category} onChange={(v) => setP({ ...p, category: v })} required />
          <F label="Tag (Drop / New / Limited)" value={p.tag ?? ""} onChange={(v) => setP({ ...p, tag: v || null })} />
          <F label="Price (ZAR)" type="number" value={String(p.price)} onChange={(v) => setP({ ...p, price: Number(v) })} required />
          <F label="Retail (ZAR)" type="number" value={String(p.retail)} onChange={(v) => setP({ ...p, retail: Number(v) })} required />
          <F label="Stock" type="number" value={String(p.stock)} onChange={(v) => setP({ ...p, stock: Number(v) })} required />
          <F label="Sizes (comma separated)" value={Array.isArray(p.sizes) ? p.sizes.join(", ") : p.sizes} onChange={(v) => setP({ ...p, sizes: v })} />
          <div className="sm:col-span-2"><F label="Image URL" value={p.image} onChange={(v) => setP({ ...p, image: v })} required /></div>
          <div className="sm:col-span-2">
            <label className="block"><span className="text-xs text-muted-foreground">Description</span>
              <textarea value={p.description ?? ""} onChange={(e) => setP({ ...p, description: e.target.value })} rows={3}
                className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-pulse" />
            </label>
          </div>
          <label className="sm:col-span-2 flex items-center gap-2 text-sm">
            <input type="checkbox" checked={p.active} onChange={(e) => setP({ ...p, active: e.target.checked })} className="accent-pulse" />
            Active (visible on storefront)
          </label>
          <div className="sm:col-span-2 flex gap-3 mt-4">
            <button type="button" onClick={onClose} className="flex-1 rounded-full border border-border py-3 text-sm font-medium">Cancel</button>
            <button disabled={busy} type="submit" className="flex-1 rounded-full bg-pulse text-black py-3 text-sm font-bold disabled:opacity-50">{busy ? "…" : "Save"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function F({ label, value, onChange, ...props }: { label: string; value: string; onChange: (v: string) => void } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">) {
  return (
    <label className="block">
      <span className="text-xs text-muted-foreground">{label}</span>
      <input {...props} value={value} onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-pulse" />
    </label>
  );
}

function OrdersTab() {
  const list = useServerFn(listAllOrders);
  const upd = useServerFn(updateOrderStatus);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function reload() { setLoading(true); try { setOrders(await list()); } finally { setLoading(false); } }
  useEffect(() => { reload(); }, []);

  const revenue = orders.filter((o) => o.status !== "cancelled").reduce((n, o) => n + o.total, 0);

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Stat label="Orders" value={orders.length.toString()} />
        <Stat label="Revenue" value={`R${revenue.toLocaleString()}`} />
        <Stat label="Pending" value={orders.filter((o) => o.status === "pending").length.toString()} />
      </div>
      {loading ? <div className="text-muted-foreground">Loading…</div> : orders.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface p-12 text-center text-muted-foreground">No orders yet.</div>
      ) : (
        <div className="rounded-xl border border-border bg-surface divide-y divide-border">
          {orders.map((o) => (
            <div key={o.id} className="p-5 flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[240px]">
                <div className="font-mono text-sm text-pulse">{o.order_number}</div>
                <div className="text-xs text-muted-foreground mt-1">{o.full_name} · {o.email}</div>
                <div className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString()} · {o.items?.length ?? 0} items</div>
              </div>
              <div className="font-mono font-bold">R{o.total.toLocaleString()}</div>
              <select value={o.status} onChange={async (e) => { await upd({ data: { id: o.id, status: e.target.value as any } }); toast.success("Updated"); reload(); }}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm">
                <option value="pending">pending</option>
                <option value="paid">paid</option>
                <option value="shipped">shipped</option>
                <option value="delivered">delivered</option>
                <option value="cancelled">cancelled</option>
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-border bg-surface p-5"><div className="text-xs text-muted-foreground">{label}</div><div className="font-display text-2xl font-bold mt-1">{value}</div></div>;
}

function SettingsTab() {
  const get = useServerFn(getAdminEmail);
  const set = useServerFn(setAdminEmail);
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => { get().then(setEmail); }, []);
  return (
    <div className="max-w-lg">
      <h3 className="font-display text-xl font-bold mb-2">Notifications</h3>
      <p className="text-sm text-muted-foreground mb-6">This email receives a copy of every new order placed on the storefront.</p>
      <form onSubmit={async (e) => { e.preventDefault(); setSaving(true); try { await set({ data: { email } }); toast.success("Saved"); } catch (err: any) { toast.error(err.message); } finally { setSaving(false); } }} className="space-y-4">
        <label className="block"><span className="text-xs text-muted-foreground">Admin notification email</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
            className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-pulse" />
        </label>
        <button disabled={saving} className="rounded-full bg-pulse text-black px-6 py-3 text-sm font-bold disabled:opacity-50">{saving ? "…" : "Save"}</button>
      </form>
    </div>
  );
}
