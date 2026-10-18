import { Sparkles, ShoppingBag, ArrowLeft, Package, Map, FileText } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import { getSupabaseServer } from "@/lib/supabase-server";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/ui/AddToCartButton";
import ProductGallery from "@/components/ui/ProductGallery";

export const revalidate = 0;

export default async function ProductDetail(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const slug = params.slug;
  const supabase = getSupabaseServer();
  const { data: product } = await supabase
    .from('mm_products')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!product) {
    notFound();
  }

  // Fix price format if admin typed '139' instead of '139000'
  const displayPrice = product.price < 10000 ? product.price * 1000 : product.price;
  const priceFormatted = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(displayPrice);
  const imageUrl = product.image_url || "https://illustrations.popsy.co/amber/home-office.svg";

  return (
    <div className="min-h-screen pt-32 pb-24 bg-background">
      <div className="container mx-auto px-6 max-w-[1200px]">
        <Link href="/collection" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground-muted hover:text-terracotta transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" />
          Quay lại Collection
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24 items-start">
          {/* Product Image Gallery */}
          <div className="w-full">
            <ProductGallery mainImage={imageUrl} additionalImages={product.additional_images || []} />
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-start">
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-terracotta">
                {product.city || "Việt Nam"}
              </span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-display font-black text-foreground mb-4 uppercase tracking-tighter">
              {product.name}
            </h1>
            <p className="text-xl text-foreground-muted font-medium mb-8">
              {product.short_description || "Mảnh ghép độc quyền"}
            </p>
            
            <div className="text-3xl font-display font-bold text-foreground mb-10">
              {priceFormatted}
            </div>
            
            <AddToCartButton product={product} priceFormatted={priceFormatted} displayPrice={displayPrice} />

            <div className="grid grid-cols-2 gap-4 border-t border-b border-foreground/10 py-8 mb-8">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-foreground-muted flex items-center gap-2">
                  <Package className="w-4 h-4" /> Trạng thái
                </span>
                <span className="font-medium text-foreground">{product.stock > 0 ? "Còn hàng" : "Hết hàng"}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-foreground-muted flex items-center gap-2">
                  <Map className="w-4 h-4" /> Thành phố
                </span>
                <span className="font-medium text-foreground">{product.city || "Việt Nam"}</span>
              </div>
            </div>

            <div className="border-t border-foreground/10 pt-8">
              <p className="text-foreground-muted leading-relaxed font-medium">
                {product.description || "Mỗi mảnh ghép mang trong mình một câu chuyện độc đáo về văn hóa, con người và những kỷ niệm khó quên. Hãy cùng khám phá vẻ đẹp của Việt Nam qua lăng kính sáng tạo."}
              </p>
            </div>
          </div>
        </div>

        {/* What's in the box */}
        <div className="mb-24">
          <h2 className="text-2xl font-display font-black text-foreground mb-12 uppercase tracking-tight text-center">
            TRONG MỖI HỘP CÓ GÌ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background-alt/50 border border-foreground/10 p-8 flex flex-col items-center text-center">
              <Package className="w-10 h-10 text-terracotta mb-4" />
              <h3 className="font-display font-bold mb-2 uppercase">01 x Blind Box</h3>
              <p className="text-sm text-foreground-muted font-medium">Hộp giấy kraft tái chế với thiết kế tem thư cổ điển.</p>
            </div>
            <div className="bg-background-alt/50 border border-foreground/10 p-8 flex flex-col items-center text-center">
              <Sparkles className="w-10 h-10 text-gold mb-4" />
              <h3 className="font-display font-bold mb-2 uppercase">01 x Pin Kim Loại</h3>
              <p className="text-sm text-foreground-muted font-medium">Pin cài áo tráng men cao cấp, thiết kế cách điệu.</p>
            </div>
            <div className="bg-background-alt/50 border border-foreground/10 p-8 flex flex-col items-center text-center">
              <FileText className="w-10 h-10 text-jade mb-4" />
              <h3 className="font-display font-bold mb-2 uppercase">01 x Story Card</h3>
              <p className="text-sm text-foreground-muted font-medium">Thẻ câu chuyện kèm mã QR để mở khóa nội dung số.</p>
            </div>
          </div>

          {/* 1 Mảnh SECRET Duy Nhất Row */}
          <div className="mt-8 relative overflow-hidden bg-gradient-to-r from-[#2A2A27] via-[#383833] to-[#2A2A27] text-white border-2 border-gold/40 p-6 md:p-8 rounded-2xl shadow-[6px_6px_0px_rgba(230,195,106,0.25)]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                <div className="relative w-24 h-24 shrink-0 bg-black/40 border-2 border-gold/50 rounded-xl p-3 flex items-center justify-center shadow-inner group">
                  <Image 
                    src="/images/secret-chest-clean.png" 
                    alt="1 Mảnh SECRET Duy Nhất" 
                    width={80} 
                    height={80} 
                    className="object-contain filter drop-shadow-[0_0_12px_rgba(230,195,106,0.5)] transform hover:scale-110 transition-transform duration-300"
                  />
                  <span className="absolute -top-2.5 -right-2.5 bg-terracotta text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-white/20 shadow">
                    SECRET
                  </span>
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/20 border border-gold/30 rounded-full text-gold text-xs font-black uppercase tracking-widest mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    Cơ Hội Mở Ra Phiên Bản Giới Hạn
                  </div>
                  <h3 className="text-2xl md:text-3xl font-display font-black text-white tracking-tight uppercase">
                    1 Mảnh SECRET Duy Nhất
                  </h3>
                  <p className="text-sm text-white/80 font-medium max-w-xl mt-1 leading-relaxed">
                    Mỗi hộp Blind Box đều ẩn chứa cơ hội mở ra Mảnh Ghép SECRET cực hiếm mang tính biểu tượng đặc biệt, tráng men dạ quang phát sáng và mạ viền vàng độc bản.
                  </p>
                </div>
              </div>
              <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-center gap-2 border-t sm:border-t-0 sm:border-l border-white/10 pt-4 sm:pt-0 sm:pl-8">
                <span className="text-[11px] font-bold text-white/50 uppercase tracking-widest">
                  Tỷ lệ may mắn
                </span>
                <span className="text-2xl md:text-3xl font-display font-black text-gold">
                  1 : 72
                </span>
                <span className="text-[10px] font-semibold text-white/60 bg-white/10 px-2.5 py-1 rounded-full">
                  Siêu Giới Hạn
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Digital Map Hook */}
        <div className="bg-foreground text-background p-12 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E')] mix-blend-color-burn"></div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <Map className="w-12 h-12 text-terracotta mx-auto mb-6" />
            <h2 className="text-3xl font-display font-black mb-6 uppercase tracking-tight">
              MỞ KHÓA TRÊN BẢN ĐỒ DI SẢN
            </h2>
            <p className="text-background/70 font-medium mb-10 leading-relaxed">
              Mỗi Story Card đều mang một mã số bí mật. Sử dụng mã số này để "thắp sáng" thành phố tương ứng trên Bản Đồ Di Sản số hóa của riêng bạn và theo dõi hành trình sưu tầm.
            </p>
            <Link href="/map" className="inline-flex items-center gap-3 px-8 py-4 border-2 border-[#F5F2EB] text-[#F5F2EB] font-bold tracking-widest text-xs uppercase hover:bg-[#F5F2EB] hover:text-foreground transition-colors">
              XEM BẢN ĐỒ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
