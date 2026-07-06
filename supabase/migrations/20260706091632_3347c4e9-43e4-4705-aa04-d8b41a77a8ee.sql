
CREATE OR REPLACE FUNCTION public.place_order(
  _user_id uuid,
  _order_number text,
  _email text,
  _full_name text,
  _phone text,
  _address text,
  _suburb text,
  _city text,
  _postal_code text,
  _subtotal integer,
  _shipping integer,
  _total integer,
  _items jsonb
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  item jsonb;
  _slug text;
  _qty int;
  _updated int;
  _order_id uuid;
BEGIN
  -- Decrement stock atomically; fail if insufficient
  FOR item IN SELECT * FROM jsonb_array_elements(_items) LOOP
    _slug := item->>'slug';
    _qty := (item->>'qty')::int;
    UPDATE public.products
      SET stock = stock - _qty, updated_at = now()
      WHERE slug = _slug AND stock >= _qty;
    GET DIAGNOSTICS _updated = ROW_COUNT;
    IF _updated = 0 THEN
      RAISE EXCEPTION 'Out of stock: %', _slug USING ERRCODE = 'check_violation';
    END IF;
  END LOOP;

  INSERT INTO public.orders (
    order_number, user_id, email, full_name, phone, address, suburb, city,
    postal_code, subtotal, shipping, total, items
  ) VALUES (
    _order_number, _user_id, _email, _full_name, _phone, _address, _suburb, _city,
    _postal_code, _subtotal, _shipping, _total, _items
  ) RETURNING id INTO _order_id;

  RETURN _order_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.place_order(uuid, text, text, text, text, text, text, text, text, integer, integer, integer, jsonb) TO anon, authenticated, service_role;
