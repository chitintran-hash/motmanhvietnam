import { Sparkles, ShoppingBag } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import SortDropdown from "@/components/ui/SortDropdown";
import { getSupabaseServer } from "@/lib/supabase-server";
import Link from "next/link";

export const revalidate = 0;

export default async function CollectionPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  const sort = searchParams?.sort as string | undefined;

  const supabase = getSupabaseServer();
  let query = supabase.from('mm_products').select('*').eq('status', 'active');

  if (sort === 'price_asc') {
    query = query.order('price', { ascending: true });
  } else if (sort === 'price_desc') {
    query = query.order('price', { ascending: false });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  const { data: products } = await query;

  const displayProducts = (products || []).map(p => {
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
    <div className="min-h-screen bg-background pt-32 md:pt-40 pb-32">
      {/* Header */}
      <div className="container mx-auto px-6 max-w-[1400px] mb-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-3 mb-6">
            <Sparkles className="w-5 h-5 text-terracotta" />
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-terracotta">KHÁM PHÁ SẢN PHẨM</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-black text-foreground mb-8 uppercase tracking-tight leading-[1.1]">
            Mỗi Mảnh Ghép <br/>
            <span className="text-terracotta">Một Câu Chuyện</span>
          </h1>

          <p className="text-xl text-foreground-muted font-medium max-w-2xl leading-relaxed">
            Khám phá bộ sưu tập những mảnh ghép mang đậm bản sắc văn hóa Việt. 
            Từ đường phố nhộn nhịp đến phong cảnh hữu tình, tất cả được thu nhỏ 
            trong lòng bàn tay bạn.
          </p>
        </div>
      </div>

      {/* Single Featured Product */}
      <div className="container mx-auto px-6 max-w-[1400px]">
        {displayProducts.length > 0 ? (
          <div className="max-w-2xl mx-auto">
            {displayProducts.slice(0, 1).map((product) => (
              <ProductCard
                key={product.slug}
                slug={product.slug}
                name={product.name}
                city={product.city}
                collectionNumber={product.collectionNumber}
                price={product.price}
                imageUrl={product.imageUrl}
                isNew={product.isNew}
              />
            ))}
            <div className="mt-8 text-center">
              <p className="text-foreground-muted italic">Bấm vào hộp để xem các mảnh ghép bí ẩn bên trong!</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-foreground/5 rounded-2xl border-2 border-foreground/10 border-dashed">
            <ShoppingBag className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">Chưa có sản phẩm</h3>
            <p className="text-foreground-muted">Sản phẩm đang được cập nhật. Vui lòng quay lại sau.</p>
          </div>
        )}
      </div>
    </div>
  );
}
