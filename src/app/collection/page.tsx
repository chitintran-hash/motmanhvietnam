import { Sparkles, ShoppingBag, Package, Map, FileText, Truck, ShieldCheck, Gift } from "lucide-react";
import { getSupabaseServer } from "@/lib/supabase-server";
import ProductGallery from "@/components/ui/ProductGallery";
import AddToCartButton from "@/components/ui/AddToCartButton";
import Link from "next/link";
import Image from "next/image";

export const revalidate = 0;

export default async function CollectionPage() {
  const supabase = getSupabaseServer();
  const { data: products } = await supabase
    .from('mm_products')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  const product = products?.[0];

  if (!product) {
    return (
      <div className="min-h-screen bg-background pt-40 pb-32">
        <div className="container mx-auto px-6 max-w-[1200px] text-center">
          <div className="py-24 bg-foreground/5 rounded-2xl border-2 border-foreground/10 border-dashed max-w-xl mx-auto">
            <ShoppingBag className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">Chưa có sản phẩm</h3>
            <p className="text-foreground-muted">Sản phẩm đang được cập nhật. Vui lòng quay lại sau.</p>
          </div>
        </div>
      </div>
    );
  }

  const displayPrice = product.price < 10000 ? product.price * 1000 : product.price;
  const priceFormatted = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(displayPrice);
  const imageUrl = product.image_url || "/images/product-slide-1.jpg";

  return (
    <div className="min-h-screen bg-background pt-32 md:pt-40 pb-32">
      {/* Header */}
      <div className="container mx-auto px-6 max-w-[1200px] mb-12">
        <div className="inline-flex items-center gap-3 mb-4">
          <Sparkles className="w-4 h-4 text-terracotta" />
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-terracotta">
            BỘ SƯU TẬP CHÍNH THỨC
          </span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-display font-black text-foreground uppercase tracking-tight leading-[1.1]">
          Mỗi Mảnh Ghép <span className="text-terracotta">Một Câu Chuyện</span>
        </h1>
      </div>

      {/* Main Product 2-Column Showcase */}
      <div className="container mx-auto px-6 max-w-[1200px] mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Product Gallery & Thumbnails */}
          <div className="lg:col-span-6 w-full flex flex-col">
            <ProductGallery 
              mainImage={imageUrl} 
              additionalImages={product.additional_images || []} 
            />
            <p className="text-xs text-foreground/50 text-center mt-3 italic">
              * Bấm các hình nhỏ bên dưới để xem chi tiết từng mảnh ghép bên trong hộp
            </p>
          </div>

          {/* Right Column: Information, Price & Add to Cart */}
          <div className="lg:col-span-6 flex flex-col justify-start">
            {/* City Tag */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-terracotta px-3 py-1 bg-terracotta/10 border border-terracotta/20">
                {product.city || "VIỆT NAM"}
              </span>
            </div>

            {/* Product Title */}
            <h2 className="text-3xl md:text-5xl font-display font-black text-foreground mb-4 uppercase tracking-tighter leading-[1.15]">
              {product.name}
            </h2>

            {/* Short Description */}
            <p className="text-lg text-foreground-muted font-medium mb-6 leading-relaxed">
              {product.short_description || "Hộp mù chứa mảnh ghép ngẫu nhiên cùng thẻ câu chuyện văn hóa độc bản."}
            </p>

            {/* Price Box */}
            <div className="bg-[#F5F2EB] border-2 border-foreground/10 p-6 rounded-xl mb-8 flex items-baseline justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-foreground/50 block mb-1">
                  Giá niêm yết
                </span>
                <span className="text-3xl md:text-4xl font-display font-black text-terracotta">
                  {priceFormatted}
                </span>
              </div>
              <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full ${
                product.stock > 0 
                  ? "bg-jade/10 text-jade border border-jade/20" 
                  : "bg-red-500/10 text-red-500 border border-red-500/20"
              }`}>
                {product.stock > 0 ? `Còn hàng (${product.stock} hộp)` : "Hết hàng"}
              </span>
            </div>

            {/* Add to Cart Button */}
            <AddToCartButton 
              product={product} 
              priceFormatted={priceFormatted} 
              displayPrice={displayPrice} 
            />

            {/* Benefit Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-b border-foreground/10 py-6 text-sm">
              <div className="flex items-center gap-3 text-foreground-muted font-medium">
                <Truck className="w-5 h-5 text-terracotta shrink-0" />
                <span>Giao hàng toàn quốc 2 - 4 ngày</span>
              </div>
              <div className="flex items-center gap-3 text-foreground-muted font-medium">
                <Gift className="w-5 h-5 text-gold shrink-0" />
                <span>Đóng gói hộp quà vintage</span>
              </div>
              <div className="flex items-center gap-3 text-foreground-muted font-medium">
                <ShieldCheck className="w-5 h-5 text-jade shrink-0" />
                <span>Thiết kế tráng men cao cấp</span>
              </div>
              <div className="flex items-center gap-3 text-foreground-muted font-medium">
                <Sparkles className="w-5 h-5 text-terracotta shrink-0" />
                <span>Cơ hội mở ra Secret Piece độc bản</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Detail Description Section (Ngang hàng, trải đều cân đối 2 bên) */}
      <div className="container mx-auto px-6 max-w-[1200px] mb-24">
        <div className="border-t border-foreground/10 pt-12">
          <div className="bg-[#FAF9F5] border-2 border-foreground/10 rounded-2xl p-8 md:p-12 shadow-[4px_4px_0px_rgba(42,42,39,0.06)]">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-2.5 h-2.5 bg-terracotta rounded-full"></span>
              <h3 className="text-xs md:text-sm font-black uppercase tracking-[0.25em] text-foreground">
                MÔ TẢ CHI TIẾT
              </h3>
            </div>
            <div className="text-foreground-muted leading-relaxed font-medium whitespace-pre-line text-base md:text-lg max-w-4xl space-y-4">
              {product.description || "Mỗi mảnh ghép mang trong mình một câu chuyện độc đáo về văn hóa, con người và những kỷ niệm khó quên của Việt Nam. Chiếc pin nhỏ gọn nhưng lưu giữ trọn vẹn hồn cốt của những địa danh thân thương."}
            </div>
          </div>
        </div>
      </div>

      {/* What's in the box Section */}
      <div className="container mx-auto px-6 max-w-[1200px] mb-24">
        <div className="border-t border-foreground/10 pt-16">
          <h2 className="text-2xl md:text-3xl font-display font-black text-foreground mb-12 uppercase tracking-tight text-center">
            TRONG MỖI HỘP BLIND BOX CÓ GÌ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#F5F2EB] border-2 border-foreground/10 p-8 flex flex-col items-center text-center shadow-[4px_4px_0px_rgba(42,42,39,0.06)]">
              <Package className="w-10 h-10 text-terracotta mb-4" />
              <h3 className="font-display font-bold text-lg mb-2 uppercase">01 x Blind Box</h3>
              <p className="text-sm text-foreground-muted font-medium">Hộp kín kraft tái chế bảo mật, nguyên seal tạo cảm giác bất ngờ khi unbox.</p>
            </div>
            <div className="bg-[#F5F2EB] border-2 border-foreground/10 p-8 flex flex-col items-center text-center shadow-[4px_4px_0px_rgba(42,42,39,0.06)]">
              <Sparkles className="w-10 h-10 text-gold mb-4" />
              <h3 className="font-display font-bold text-lg mb-2 uppercase">01 x Pin Kim Loại</h3>
              <p className="text-sm text-foreground-muted font-medium">Pin cài áo tráng men cao cấp, thiết kế cách điệu tinh xảo từng đường nét.</p>
            </div>
            <div className="bg-[#F5F2EB] border-2 border-foreground/10 p-8 flex flex-col items-center text-center shadow-[4px_4px_0px_rgba(42,42,39,0.06)]">
              <FileText className="w-10 h-10 text-jade mb-4" />
              <h3 className="font-display font-bold text-lg mb-2 uppercase">01 x Story Card</h3>
              <p className="text-sm text-foreground-muted font-medium">Thẻ câu chuyện kèm mã QR để mở khóa nội dung di sản và hành trình số hóa.</p>
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
      </div>

      {/* Digital Map Hook */}
      <div className="container mx-auto px-6 max-w-[1200px]">
        <div className="bg-foreground text-background p-10 md:p-14 text-center relative overflow-hidden border-4 border-foreground shadow-[8px_8px_0px_rgba(137,8,8,1)]">
          <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E')] mix-blend-color-burn"></div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <Map className="w-12 h-12 text-gold mx-auto mb-6" />
            <h2 className="text-2xl md:text-4xl font-display font-black mb-4 uppercase tracking-tight text-white">
              MỞ KHÓA TRÊN BẢN ĐỒ DI SẢN
            </h2>
            <p className="text-background/80 font-medium mb-8 leading-relaxed text-sm md:text-base">
              Khi sưu tầm được mảnh ghép, hãy quét mã QR trên Thẻ Câu Chuyện để thắp sáng địa danh trên Bản Đồ Di Sản số hóa của bạn!
            </p>
            <Link 
              href="/map" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-terracotta text-white font-bold tracking-widest text-xs uppercase hover:bg-terracotta-hover transition-all shadow-[4px_4px_0px_rgba(230,195,106,1)] hover:translate-x-[2px] hover:translate-y-[2px]"
            >
              KHÁM PHÁ BẢN ĐỒ DI SẢN
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
