import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [
    { title: "Sign in — Pavement Pulse" },
    { name: "description", content: "Sign in or create your Pavement Pulse account." },
    { name: "robots", content: "noindex" },
  ] }),
  component: AuthPage,
});

function AuthPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/account" });
  }, [user, loading, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: window.location.origin, data: { full_name: name } },
        });
        if (error) throw error;
        toast.success("Account created. Check your email to verify.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back.");
        navigate({ to: "/account" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) { toast.error(result.error.message); setBusy(false); return; }
    if (result.redirected) return;
    navigate({ to: "/account" });
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-[440px] px-6 py-16">
        <h1 className="font-display text-3xl font-bold tracking-tight text-center">
          {mode === "signin" ? "Sign in" : "Create account"}
        </h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {mode === "signin" ? "Welcome back to Pavement Pulse." : "Join the pavement."}
        </p>

        <button onClick={handleGoogle} disabled={busy}
          className="mt-8 w-full rounded-full border border-border bg-surface py-3 text-sm font-medium hover:border-pulse disabled:opacity-50 flex items-center justify-center gap-2">
          <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="#EA4335" d="M12 5c1.6 0 3 .55 4.1 1.6l3-3C17.2 1.7 14.8.8 12 .8 7.3.8 3.3 3.5 1.4 7.5l3.6 2.8C6 7.3 8.7 5 12 5z"/><path fill="#4285F4" d="M23.5 12.3c0-.9-.1-1.6-.2-2.4H12v4.6h6.5c-.3 1.5-1.2 2.7-2.5 3.6l3.7 2.9c2.2-2.1 3.8-5.1 3.8-8.7z"/><path fill="#FBBC05" d="M5 14.3c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2L1.4 7.5C.5 9 0 10.4 0 12s.5 3 1.4 4.5L5 14.3z"/><path fill="#34A853" d="M12 23.2c3.2 0 6-1 8-2.9l-3.7-2.9c-1 .7-2.4 1.2-4.3 1.2-3.3 0-6-2.3-7-5.3L1.4 16.5C3.3 20.5 7.3 23.2 12 23.2z"/></svg>
          Continue with Google
        </button>

        <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> OR <span className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <Field label="Full name" value={name} onChange={setName} required />
          )}
          <Field label="Email" type="email" value={email} onChange={setEmail} required />
          <Field label="Password" type="password" value={password} onChange={setPassword} required minLength={6} />
          <button disabled={busy} className="w-full rounded-full bg-pulse text-black py-3 font-bold hover:opacity-90 disabled:opacity-50">
            {busy ? "…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          {mode === "signin" ? (
            <>New here? <button onClick={() => setMode("signup")} className="text-pulse hover:underline">Create an account</button></>
          ) : (
            <>Already have an account? <button onClick={() => setMode("signin")} className="text-pulse hover:underline">Sign in</button></>
          )}
        </div>
        <div className="mt-4 text-center">
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">← Back to home</Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function Field({ label, value, onChange, ...props }: { label: string; value: string; onChange: (v: string) => void } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">) {
  return (
    <label className="block">
      <span className="text-xs text-muted-foreground">{label}</span>
      <input {...props} value={value} onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-pulse" />
    </label>
  );
}
