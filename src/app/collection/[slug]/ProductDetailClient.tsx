"use client";

import { useState } from "react";
import { Sparkles, ArrowLeft, Package, Map, FileText, ZoomIn, X, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AddToCartButton from "@/components/ui/AddToCartButton";
import ProductGallery from "@/components/ui/ProductGallery";
import { useLanguage } from "@/context/LanguageContext";

export default function ProductDetailClient({ product }: { product: any }) {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const [selectedLightboxImage, setSelectedLightboxImage] = useState<{ src: string; title: string } | null>(null);

  const displayPrice = product.price < 10000 ? product.price * 1000 : product.price;
  const priceFormatted = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(displayPrice);
  const imageUrl = product.image_url || "/images/product-slide-1.jpg";

  // Parse 3 box item images from product.story JSON
  let boxItems = {
    box_image: "/images/product-slide-1.jpg",
    pin_image: "/images/product-slide-2.jpg",
    card_image: "/images/product-slide-3.jpg",
  };
  if (product.story) {
    try {
      const parsed = JSON.parse(product.story);
      if (parsed && typeof parsed === "object") {
        if (parsed.box_image) boxItems.box_image = parsed.box_image;
        if (parsed.pin_image) boxItems.pin_image = parsed.pin_image;
        if (parsed.card_image) boxItems.card_image = parsed.card_image;
      }
    } catch (e) {
      // not JSON, fallback to defaults
    }
  }

  return (
    <div className="min-h-screen pt-32 pb-24 bg-background">
      <div className="container mx-auto px-6 max-w-[1200px]">
        <Link href="/collection" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground-muted hover:text-terracotta transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" />
          {t("product.backToCollection", "Quay lại Collection")}
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
                {product.city || (lang === 'en' ? "Vietnam" : "Việt Nam")}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-foreground mb-4 uppercase tracking-tighter leading-[1.15]">
              {product.name}
            </h1>
            <p className="text-lg md:text-xl text-foreground-muted font-medium mb-6">
              {product.short_description || t("product.defaultDesc", "Mảnh ghép độc quyền")}
            </p>
            
            <div className="bg-[#F5F2EB] border-2 border-foreground/10 p-5 rounded-xl mb-6 flex items-baseline justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-foreground/50 block mb-1">
                  {t("product.listedPrice", "Giá niêm yết")}
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
                {product.stock > 0 
                  ? t("product.inStockCount", `Còn hàng (${product.stock} hộp)`).replace('{count}', String(product.stock)) 
                  : t("product.outOfStock", "Hết hàng")}
              </span>
            </div>
            
            <AddToCartButton product={product} priceFormatted={priceFormatted} displayPrice={displayPrice} />

            <div className="grid grid-cols-2 gap-4 border-t border-b border-foreground/10 py-6 mb-8">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold uppercase tracking-wider text-foreground-muted flex items-center gap-2">
                  <Package className="w-4 h-4" /> {t("product.statusLabel", "Trạng thái")}
                </span>
                <span className="font-bold text-foreground">
                  {product.stock > 0 ? t("product.inStock", "Còn hàng") : t("product.outOfStock", "Hết hàng")}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold uppercase tracking-wider text-foreground-muted flex items-center gap-2">
                  <Map className="w-4 h-4" /> {t("product.cityLabel", "Thành phố")}
                </span>
                <span className="font-bold text-foreground">{product.city || (lang === 'en' ? "Vietnam" : "Việt Nam")}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Product Detail Description Section */}
        <div className="mb-24">
          <div className="border-t border-foreground/10 pt-12">
            <div className="bg-[#FAF9F5] border-2 border-foreground/10 rounded-2xl p-8 md:p-12 shadow-[4px_4px_0px_rgba(42,42,39,0.06)]">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-2.5 h-2.5 bg-terracotta rounded-full"></span>
                <h3 className="text-xs md:text-sm font-black uppercase tracking-[0.25em] text-foreground">
                  {t("product.detailDescTitle", "MÔ TẢ CHI TIẾT")}
                </h3>
              </div>
              <div className="text-foreground-muted leading-relaxed font-medium whitespace-pre-line text-base md:text-lg max-w-4xl space-y-4">
                {product.description || t("product.defaultFullDesc", "Mỗi mảnh ghép mang trong mình một câu chuyện độc đáo về văn hóa, con người và những kỷ niệm khó quên. Hãy cùng khám phá vẻ đẹp của Việt Nam qua lăng kính sáng tạo.")}
              </div>
            </div>
          </div>
        </div>

        {/* What's in the box */}
        <div className="mb-24">
          <div className="border-t border-foreground/10 pt-16">
            <h2 className="text-2xl md:text-3xl font-display font-black text-foreground mb-12 uppercase tracking-tight text-center">
              {t("product.whatsInBoxTitle", "TRONG MỖI HỘP BLIND BOX CÓ GÌ?")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Khung 1: 01 x Blind Box */}
              <div className="bg-[#F5F2EB] border-2 border-foreground/10 rounded-2xl p-6 flex flex-col items-center text-center shadow-[4px_4px_0px_rgba(42,42,39,0.06)] group hover:border-terracotta/40 transition-colors">
                <div 
                  onClick={() => setSelectedLightboxImage({ src: boxItems.box_image, title: t("product.item1Title", "01 x Blind Box") })}
                  className="relative w-full aspect-square rounded-xl overflow-hidden bg-white border border-foreground/10 mb-5 shadow-inner cursor-zoom-in group/img"
                >
                  <Image 
                    src={boxItems.box_image} 
                    alt="01 x Blind Box" 
                    fill 
                    className="object-contain p-3 group-hover/img:scale-105 transition-transform duration-300" 
                  />
                  <span className="absolute top-2.5 left-2.5 bg-foreground/80 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
                    01 x BLIND BOX
                  </span>
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5 pointer-events-none">
                    <ZoomIn className="w-4 h-4" />
                    <span>{t("product.viewDetails", "Xem chi tiết ảnh")}</span>
                  </div>
                </div>
                <h3 className="font-display font-black text-xl mb-2 uppercase text-foreground">{t("product.item1Title", "01 x Blind Box")}</h3>
                <p className="text-sm text-foreground-muted font-medium leading-relaxed">{t("product.item1Desc", "Hộp kín kraft tái chế bảo mật, nguyên seal tạo cảm giác bất ngờ khi unbox.")}</p>
              </div>

              {/* Khung 2: 01 x Pin Kim Loại */}
              <div className="bg-[#F5F2EB] border-2 border-foreground/10 rounded-2xl p-6 flex flex-col items-center text-center shadow-[4px_4px_0px_rgba(42,42,39,0.06)] group hover:border-gold/60 transition-colors">
                <div 
                  onClick={() => setSelectedLightboxImage({ src: boxItems.pin_image, title: t("product.item2Title", "01 x Pin Kim Loại") })}
                  className="relative w-full aspect-square rounded-xl overflow-hidden bg-white border border-foreground/10 mb-5 shadow-inner cursor-zoom-in group/img"
                >
                  <Image 
                    src={boxItems.pin_image} 
                    alt="01 x Pin Kim Loại" 
                    fill 
                    className="object-contain p-3 group-hover/img:scale-105 transition-transform duration-300" 
                  />
                  <span className="absolute top-2.5 left-2.5 bg-gold/90 text-foreground font-black text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
                    01 x PIN KIM LOẠI
                  </span>
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5 pointer-events-none">
                    <ZoomIn className="w-4 h-4" />
                    <span>{t("product.viewDetails", "Xem chi tiết ảnh")}</span>
                  </div>
                </div>
                <h3 className="font-display font-black text-xl mb-2 uppercase text-foreground">{t("product.item2Title", "01 x Pin Kim Loại")}</h3>
                <p className="text-sm text-foreground-muted font-medium leading-relaxed">{t("product.item2Desc", "Pin cài áo tráng men cao cấp, thiết kế cách điệu tinh xảo từng đường nét.")}</p>
              </div>

              {/* Khung 3: 01 x Story Card */}
              <div className="bg-[#F5F2EB] border-2 border-foreground/10 rounded-2xl p-6 flex flex-col items-center text-center shadow-[4px_4px_0px_rgba(42,42,39,0.06)] group hover:border-jade/50 transition-colors">
                <div 
                  onClick={() => setSelectedLightboxImage({ src: boxItems.card_image, title: t("product.item3Title", "01 x Story Card") })}
                  className="relative w-full aspect-square rounded-xl overflow-hidden bg-white border border-foreground/10 mb-5 shadow-inner cursor-zoom-in group/img"
                >
                  <Image 
                    src={boxItems.card_image} 
                    alt="01 x Story Card" 
                    fill 
                    className="object-contain p-3 group-hover/img:scale-105 transition-transform duration-300" 
                  />
                  <span className="absolute top-2.5 left-2.5 bg-jade/90 text-white font-black text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
                    01 x STORY CARD
                  </span>
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5 pointer-events-none">
                    <ZoomIn className="w-4 h-4" />
                    <span>{t("product.viewDetails", "Xem chi tiết ảnh")}</span>
                  </div>
                </div>
                <h3 className="font-display font-black text-xl mb-2 uppercase text-foreground">{t("product.item3Title", "01 x Story Card")}</h3>
                <p className="text-sm text-foreground-muted font-medium leading-relaxed">{t("product.item3Desc", "Thẻ câu chuyện kèm mã QR để mở khóa nội dung di sản và hành trình số hóa.")}</p>
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
                      {t("product.secretTag", "Cơ Hội Mở Ra Phiên Bản Giới Hạn")}
                    </div>
                    <h3 className="text-2xl md:text-3xl font-display font-black text-white tracking-tight uppercase">
                      {t("product.secretHeading", "1 Mảnh SECRET Duy Nhất")}
                    </h3>
                    <p className="text-sm text-white/80 font-medium max-w-xl mt-1 leading-relaxed">
                      {t("product.secretDescription", "Mỗi hộp Blind Box đều ẩn chứa cơ hội mở ra Mảnh Ghép SECRET cực hiếm mang tính biểu tượng đặc biệt, tráng men dạ quang phát sáng và mạ viền vàng độc bản.")}
                    </p>
                  </div>
                </div>
                <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-center gap-2 border-t sm:border-t-0 sm:border-l border-white/10 pt-4 sm:pt-0 sm:pl-8">
                  <span className="text-[11px] font-bold text-white/50 uppercase tracking-widest">
                    {t("product.secretChanceLabel", "Tỷ lệ may mắn")}
                  </span>
                  <span className="text-2xl md:text-3xl font-display font-black text-gold">
                    {t("product.secretChanceValue", "1 : 72")}
                  </span>
                  <span className="text-[10px] font-semibold text-white/60 bg-white/10 px-2.5 py-1 rounded-full">
                    {t("product.secretLimitLabel", "Siêu Giới Hạn")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Order Section: "ở cuối lúc xuống dưới cũng nên có nút đặt hàng" */}
        <div className="mb-24">
          <div className="bg-gradient-to-br from-[#FAF9F5] to-[#F5F2EB] border-3 border-foreground/15 rounded-3xl p-8 md:p-12 shadow-[6px_6px_0px_rgba(42,42,39,0.08)]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                <div className="relative w-28 h-28 md:w-36 md:h-36 shrink-0 rounded-2xl overflow-hidden border-2 border-foreground/10 bg-white shadow-md p-2">
                  <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-terracotta/10 border border-terracotta/20 rounded-full text-terracotta text-xs font-black uppercase tracking-widest mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{product.city || (lang === 'en' ? "VIETNAM" : "VIỆT NAM")}</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-display font-black text-foreground uppercase tracking-tight mb-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-foreground-muted font-medium mb-3 max-w-md">
                    {t("product.bottomOrderSubtitle", "Số lượng có hạn. Đặt hàng ngay để không bỏ lỡ mảnh ghép di sản độc bản!")}
                  </p>
                  <div className="flex items-center justify-center sm:justify-start gap-3">
                    <span className="text-2xl md:text-3xl font-display font-black text-terracotta">
                      {priceFormatted}
                    </span>
                    <span className="text-xs font-bold text-jade bg-jade/10 border border-jade/20 px-2.5 py-1 rounded-full uppercase">
                      {product.stock > 0 ? t("product.inStock", "Còn hàng") : t("product.outOfStock", "Hết hàng")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 w-full">
                <AddToCartButton 
                  product={product} 
                  priceFormatted={priceFormatted} 
                  displayPrice={displayPrice}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Digital Map Hook */}
        <div className="bg-foreground text-background p-10 md:p-14 text-center relative overflow-hidden border-4 border-foreground shadow-[8px_8px_0px_rgba(137,8,8,1)]">
          <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E')] mix-blend-color-burn"></div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <Map className="w-12 h-12 text-gold mx-auto mb-6" />
            <h2 className="text-2xl md:text-4xl font-display font-black mb-4 uppercase tracking-tight text-white">
              {t("product.digitalMapTitle", "MỞ KHÓA TRÊN BẢN ĐỒ DI SẢN")}
            </h2>
            <p className="text-background/80 font-medium mb-8 leading-relaxed text-sm md:text-base">
              {t("product.digitalMapDesc", "Khi sưu tầm được mảnh ghép, hãy quét mã QR trên Thẻ Câu Chuyện để thắp sáng địa danh trên Bản Đồ Di Sản số hóa của bạn!")}
            </p>
            <Link 
              href="/map" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-terracotta text-white font-bold tracking-widest text-xs uppercase hover:bg-terracotta-hover transition-all shadow-[4px_4px_0px_rgba(230,195,106,1)] hover:translate-x-[2px] hover:translate-y-[2px]"
            >
              {t("product.digitalMapBtn", "KHÁM PHÁ BẢN ĐỒ DI SẢN")}
            </Link>
          </div>
        </div>
      </div>

      {/* Lightbox Modal for 3 Frame Images */}
      {selectedLightboxImage && (
        <div 
          onClick={() => setSelectedLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="relative bg-white rounded-2xl max-w-2xl w-full p-6 border-2 border-foreground/20 shadow-2xl flex flex-col items-center"
          >
            <div className="flex items-center justify-between w-full mb-4 pb-2 border-b border-foreground/10">
              <h4 className="text-lg font-display font-black text-foreground uppercase tracking-wider">
                {selectedLightboxImage.title}
              </h4>
              <button
                type="button"
                onClick={() => setSelectedLightboxImage(null)}
                className="p-1.5 rounded-full hover:bg-foreground/10 text-foreground transition-colors cursor-pointer"
                aria-label="Đóng"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="relative w-full aspect-square max-h-[70vh] rounded-xl overflow-hidden bg-[#FAF9F5] border border-foreground/10 flex items-center justify-center p-4">
              <Image 
                src={selectedLightboxImage.src} 
                alt={selectedLightboxImage.title} 
                fill 
                className="object-contain p-2"
                sizes="(max-width: 768px) 90vw, 600px"
              />
            </div>
          </div>
        </div>
      )}

      {/* Sticky Mobile Order Bar when scrolled */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-foreground/10 px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] md:hidden flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative w-11 h-11 shrink-0 rounded-lg overflow-hidden border border-foreground/10 bg-white">
            <Image src={imageUrl} alt={product.name} fill className="object-contain p-1" />
          </div>
          <div className="min-w-0 flex flex-col">
            <span className="text-xs font-bold text-foreground truncate">{product.name}</span>
            <span className="text-sm font-black text-terracotta">{priceFormatted}</span>
          </div>
        </div>
        <button
          onClick={() => {
            const saved = localStorage.getItem('mm_cart');
            let cart = [];
            if (saved) {
              try { cart = JSON.parse(saved); } catch (e) {}
            }
            const existingIndex = cart.findIndex((item: any) => item.id === product.id);
            if (existingIndex >= 0) {
              cart[existingIndex].quantity += 1;
            } else {
              cart.push({
                id: product.id,
                name: product.name,
                price: displayPrice,
                quantity: 1,
                image: imageUrl,
                color: "text-foreground",
                bgColor: "bg-foreground"
              });
            }
            localStorage.setItem('mm_cart', JSON.stringify(cart));
            window.dispatchEvent(new Event("cartUpdated"));
            router.push('/checkout');
          }}
          className="shrink-0 bg-terracotta hover:bg-terracotta-hover text-white text-xs font-black uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-[2px_2px_0px_rgba(42,42,39,0.3)] flex items-center gap-1.5 cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>{t("product.orderNowShort", "ĐẶT HÀNG NGAY")}</span>
        </button>
      </div>
    </div>
  );
}
