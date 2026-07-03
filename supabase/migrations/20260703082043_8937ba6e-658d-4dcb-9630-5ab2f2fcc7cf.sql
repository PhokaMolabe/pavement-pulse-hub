
ALTER FUNCTION public.set_updated_at() SET search_path = public;
ALTER FUNCTION public.handle_new_user() SET search_path = public;
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM anon, authenticated, public;

DROP POLICY "orders anyone insert" ON public.orders;
CREATE POLICY "orders insert with data" ON public.orders FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(email) > 3 AND length(email) < 255
    AND length(full_name) > 0
    AND length(address) > 0
    AND total > 0
    AND (user_id IS NULL OR user_id = auth.uid())
  );
