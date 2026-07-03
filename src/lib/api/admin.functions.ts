import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(ctx: { supabase: any; userId: string }) {
  const { data } = await ctx.supabase.rpc("has_role", { _user_id: ctx.userId, _role: "admin" as const });
  if (!data) throw new Error("Forbidden");
}

const ProductSchema = z.object({
  slug: z.string().min(1).max(120),
  name: z.string().min(1).max(200),
  brand: z.string().min(1).max(120),
  colorway: z.string().min(1).max(200),
  price: z.number().int().min(0),
  retail: z.number().int().min(0),
  image: z.string().max(1024),
  tag: z.string().max(40).nullable().optional(),
  category: z.string().min(1).max(60),
  sizes: z.array(z.number()).max(50),
  stock: z.number().int().min(0),
  description: z.string().max(4000).nullable().optional(),
  active: z.boolean().default(true),
});

export const listProductsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin.from("products").select("*").order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const upsertProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => ProductSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("products").upsert(data, { onConflict: "slug" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("products").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getAdminEmail = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin.from("app_settings").select("value").eq("key", "admin_notification_email").maybeSingle();
    return (data?.value as string) ?? "";
  });

export const setAdminEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ email: z.string().email().max(255) }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("app_settings").upsert({ key: "admin_notification_email", value: data.email });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const grantAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ email: z.string().email() }).parse(d))
  .handler(async ({ data, context }) => {
    // Bootstrap protection: only allow if no admin exists yet, OR caller is already admin
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count } = await supabaseAdmin.from("user_roles").select("*", { count: "exact", head: true }).eq("role", "admin");
    if ((count ?? 0) > 0) {
      const { data: isAdmin } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" as const });
      if (!isAdmin) throw new Error("Forbidden");
    }
    const { data: users } = await supabaseAdmin.auth.admin.listUsers();
    const target = users?.users?.find((u) => u.email?.toLowerCase() === data.email.toLowerCase());
    if (!target) throw new Error("User not found — they must sign up first.");
    const { error } = await supabaseAdmin.from("user_roles").upsert({ user_id: target.id, role: "admin" }, { onConflict: "user_id,role" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
