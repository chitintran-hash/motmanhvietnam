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

      {/* Grid */}
      <div className="container mx-auto px-6 max-w-[1400px]">
        {/* Filters and sorting could go here */}
        <div className="flex justify-between items-center mb-12 py-4 border-y border-foreground/10">
          <div className="text-foreground-muted font-medium">
            Hiển thị <span className="text-foreground font-bold">{displayProducts.length}</span> sản phẩm
          </div>
          <div className="flex gap-4">
            <SortDropdown />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {displayProducts.map((product, index) => (
            <div key={product.slug}>
              <ProductCard {...product} isNew={index < 3} />
            </div>
          ))}

          {/* Secret Piece Card */}
          <div className="lg:col-span-3 xl:col-span-3 mt-8">
            <div className="bg-foreground border border-foreground/10 p-8 sm:p-12 shadow-2xl relative flex flex-col md:flex-row items-center justify-between overflow-hidden gap-8">
              {/* Subtle gold noise overlay */}
              <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E')] mix-blend-color-burn"></div>
              
              <div className="relative z-10 flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/20 text-gold text-[10px] font-bold uppercase tracking-widest mb-6">
                  <Sparkles className="w-3 h-3" />
                  MẢNH BÍ ẨN
                </div>
                <h3 className="font-display font-black text-4xl text-[#F5F2EB] mb-4 uppercase tracking-wider">
                  SECRET PIECE
                </h3>
                <p className="text-[#F5F2EB]/60 font-medium max-w-md leading-relaxed">
                  Mảnh ghép đặc biệt với tỉ lệ xuất hiện cực thấp. Mang một ý nghĩa lịch sử sâu sắc và thiết kế hoàn toàn khác biệt.
                </p>
              </div>

              <div className="relative z-10 w-48 h-48 md:w-64 md:h-64 rounded-sm border-2 border-gold/30 bg-gold/5 flex items-center justify-center backdrop-blur-sm shadow-[0_0_50px_rgba(204,165,44,0.1)]">
                <span className="font-display font-black text-8xl text-gold/20">?</span>
              </div>
            </div>
          </div>
        </div>

        {/* Purchase CTA */}
        <div className="mt-32 max-w-4xl mx-auto bg-[#F5F2EB] border-4 border-foreground p-12 text-center relative">
          <div className="absolute top-2 left-2 w-full h-full border-4 border-terracotta -z-10 pointer-events-none translate-x-2 translate-y-2"></div>
          
          <h2 className="text-3xl md:text-5xl font-display font-black mb-6 uppercase tracking-tight">
            MUA BLIND BOX ONLINE
          </h2>
          <p className="text-foreground-muted mb-10 max-w-xl mx-auto font-medium">
            Giá 129.000đ cho mỗi Blind Box. Mỗi hộp sẽ chứa ngẫu nhiên một Pin và Thẻ Câu Chuyện. Bạn đã sẵn sàng thử vận may?
          </p>
          <Link href="/cart" className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-terracotta text-white font-bold tracking-widest text-sm uppercase hover:bg-terracotta-hover transition-all shadow-[6px_6px_0px_rgba(42,42,39,1)] hover:shadow-[2px_2px_0px_rgba(42,42,39,1)] hover:translate-x-[4px] hover:translate-y-[4px]">
            <ShoppingBag className="w-5 h-5" />
            ĐẶT MUA NGAY — 129.000₫
          </Link>
        </div>
      </div>
    </div>
  );
}
