import Hero from "@/components/sections/Hero";
import AboutTeaser from "@/components/sections/AboutTeaser";
import CollectionPreview from "@/components/sections/CollectionPreview";
import TeamSection from "@/components/sections/TeamSection";
import { getSupabaseServer } from "@/lib/supabase-server";

export const revalidate = 0;

export default async function Home() {
  const supabase = getSupabaseServer();
  const { data: products } = await supabase
    .from('mm_products')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(3);

  const formattedProducts = (products || []).map(p => {
    const displayPrice = p.price < 10000 ? p.price * 1000 : p.price;
    return {
      slug: p.slug,
      name: p.name,
      city: p.city || "Việt Nam",
      collectionNumber: "COLL_01",
      price: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(displayPrice),
      imageUrl: p.image_url || "https://illustrations.popsy.co/amber/home-office.svg",
      isNew: true
    };
  });

  return (
    <>
      <Hero />
      <AboutTeaser />
      <CollectionPreview products={formattedProducts} />
      <TeamSection />
    </>
  );
}
