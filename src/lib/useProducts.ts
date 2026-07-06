import { queryOptions, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PRODUCTS as SEED, type Product } from "@/lib/products";

function rowToProduct(r: any): Product {
  return {
    slug: r.slug,
    name: r.name,
    brand: r.brand,
    colorway: r.colorway,
    price: r.price,
    retail: r.retail,
    image: r.image,
    tag: r.tag ?? undefined,
    category: r.category,
    sizes: Array.isArray(r.sizes) ? r.sizes : [],
    description: r.description ?? "",
  };
}

export const productsQueryOptions = queryOptions({
  queryKey: ["products", "public"],
  queryFn: async (): Promise<Product[]> => {
    const { data, error } = await supabase
      .from("products")
      .select("slug,name,brand,colorway,price,retail,image,tag,category,sizes,description,stock,active")
      .eq("active", true)
      .order("created_at", { ascending: false });
    if (error) throw error;
    const live = (data ?? []).map(rowToProduct);
    return live.length ? live : SEED;
  },
  staleTime: 60_000,
});

export function useProducts() {
  const q = useQuery(productsQueryOptions);
  return { products: q.data ?? SEED, isLoading: q.isLoading };
}

export function useProduct(slug: string) {
  const { products, isLoading } = useProducts();
  return { product: products.find((p) => p.slug === slug), isLoading };
}
