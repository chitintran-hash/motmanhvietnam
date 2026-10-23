import { getSupabaseServer } from "@/lib/supabase-server";
import CollectionClient from "./CollectionClient";

export const revalidate = 0;

export default async function CollectionPage() {
  const supabase = getSupabaseServer();
  const { data: products } = await supabase
    .from('mm_products')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  const product = products?.[0];

  return <CollectionClient product={product} />;
}
