"use client";

import { useState } from "react";
import { Sparkles, ShoppingBag, Package, Map, FileText, Truck, ShieldCheck, Gift, ZoomIn, X, Zap } from "lucide-react";
import ProductGallery from "@/components/ui/ProductGallery";
import AddToCartButton from "@/components/ui/AddToCartButton";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export default function CollectionClient({ product }: { product: any }) {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const [selectedLightboxImage, setSelectedLightboxImage] = useState<{ src: string; title: string } | null>(null);

  if (!product) {
    return (
      <div className="min-h-screen bg-background pt-40 pb-32">
        <div className="container mx-auto px-6 max-w-[1200px] text-center">
          <div className="py-24 bg-foreground/5 rounded-2xl border-2 border-foreground/10 border-dashed max-w-xl mx-auto">
            <ShoppingBag className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">
              {t("product.emptyProduct", "Chưa có sản phẩm")}
            </h3>
            <p className="text-foreground-muted">
              {t("product.emptyProductDesc", "Sản phẩm đang được cập nhật. Vui lòng quay lại sau.")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const displayPrice = product.price < 10000 ? product.price * 1000 : product.price;
  const priceFormatted = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(displayPrice);
  const imageUrl = product.image_url || "/images/product-slide-1.jpg";

  // Parse story JSON for 3 frame images and optional English translations
  let storyData: any = {};
  if (product.story) {
    try {
      const parsed = JSON.parse(product.story);
      if (parsed && typeof parsed === "object") {
        storyData = parsed;
      }
    } catch (e) {
      // not JSON, fallback to defaults
    }
  }

  const boxItems = {
    box_image: storyData.box_image || "/images/product-slide-1.jpg",
    pin_image: storyData.pin_image || "/images/product-slide-2.jpg",
    card_image: storyData.card_image || "/images/product-slide-3.jpg",
  };

  const isEnglish = lang === 'en';

  const displayTitle = isEnglish
    ? (storyData.name_en || (product.name?.toLowerCase().includes("sài gòn") ? "Saigon Piece - Official Blind Box Collection" : product.name))
    : product.name;

  const displayCity = isEnglish
    ? (product.city?.toLowerCase().includes("hồ chí minh") || product.city?.toLowerCase().includes("sài gòn")
        ? "HO CHI MINH CITY"
        : (product.city || "VIETNAM"))
    : (product.city || "TP. HỒ CHÍ MINH");

  const displayShortDesc = isEnglish
    ? (storyData.short_description_en || t("product.defaultShortDesc", "Mystery blind box containing 01 random metal piece depicting iconic landmarks of Ho Chi Minh City such as City Theatre, Ben Thanh Market, Central Post Office... along with 01 exclusive heritage story card."))
    : (product.short_description || t("product.defaultShortDesc", "Hộp mù chứa 1 mảnh kim loại ngẫu nhiên trong số các biểu tượng của TP. Hồ Chí Minh như Nhà hát Thành phố, Chợ Bến Thành, Bưu điện Trung tâm... kèm 01 thẻ bài di sản độc bản."));

  const displayFullDesc = isEnglish
    ? (storyData.description_en || t("product.defaultFullDesc", "Each piece in the collection is an intimate tribute to the history, architectural essence, and cherished memories of Vietnam. Crafted with multi-layered hard enamel and shimmering gold-plated borders, this pocket-sized keepsake preserves the living spirit of beloved landmarks close to your heart.\n\nWhether you are a traveler cherishing past journeys or a heritage enthusiast seeking bespoke souvenirs, unboxing each blind box unveils an authentic narrative waiting to be shared."))
    : (product.description || t("product.defaultFullDesc", "Mỗi mảnh ghép trong bộ sưu tập là một lát cắt văn hóa giàu xúc cảm, được kết tinh từ tình yêu tha thiết với những vùng đất của dải đất hình chữ S. Chiếc huy hiệu pin tráng men nhỏ gọn nhưng chứa đựng trọn vẹn hồn cốt kiến trúc, con người và những kỷ niệm khó quên.\n\nDù bạn là người con xa xứ muốn mang theo một phần quê hương, hay một lữ khách muốn lưu giữ những chặng đường tươi đẹp, mỗi hộp Blind Box mở ra sẽ là một bất ngờ đầy ý nghĩa và niềm tự hào dân tộc."));

  return (
    <div className="min-h-screen bg-background pt-32 md:pt-40 pb-32">
      {/* Header */}
      <div className="container mx-auto px-6 max-w-[1200px] mb-12">
        <div className="inline-flex items-center gap-3 mb-4">
          <Sparkles className="w-4 h-4 text-terracotta" />
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-terracotta">
            {t("product.officialBadge", "BỘ SƯU TẬP CHÍNH THỨC")}
          </span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-display font-black text-foreground uppercase tracking-tight leading-[1.1]">
          {t("product.mainTitle1", "Mỗi Mảnh Ghép")} <span className="text-terracotta">{t("product.mainTitle2", "Một Câu Chuyện")}</span>
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
              {t("product.clickThumbnailsTip", "* Bấm các hình nhỏ bên dưới để xem chi tiết từng mảnh ghép bên trong hộp")}
            </p>
          </div>

          {/* Right Column: Information, Price & Add to Cart */}
          <div className="lg:col-span-6 flex flex-col justify-start">
            {/* City Tag */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-terracotta px-3 py-1 bg-terracotta/10 border border-terracotta/20 rounded-md">
                {displayCity}
              </span>
            </div>

            {/* Product Title */}
            <h2 className="text-3xl md:text-5xl font-display font-black text-foreground mb-4 uppercase tracking-tighter leading-[1.15]">
              {displayTitle}
            </h2>

            {/* Highlighted Short Description Callout */}
            <div className="bg-gradient-to-r from-terracotta/[0.08] via-terracotta/[0.03] to-transparent border-l-4 border-terracotta p-4 rounded-r-2xl mb-6 shadow-sm">
              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-terracotta mb-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t("product.highlightBadge", "ĐẶC ĐIỂM NỔI BẬT")}</span>
              </div>
              <p className="text-base text-foreground font-medium leading-relaxed">
                {displayShortDesc}
              </p>
            </div>

            {/* Price Box */}
            <div className="bg-[#F5F2EB] border-2 border-foreground/10 p-6 rounded-xl mb-8 flex items-baseline justify-between">
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
                <span>{t("product.deliveryFeature", "Giao hàng toàn quốc 2 - 4 ngày")}</span>
              </div>
              <div className="flex items-center gap-3 text-foreground-muted font-medium">
                <Gift className="w-5 h-5 text-gold shrink-0" />
                <span>{t("product.giftFeature", "Đóng gói hộp quà vintage")}</span>
              </div>
              <div className="flex items-center gap-3 text-foreground-muted font-medium">
                <ShieldCheck className="w-5 h-5 text-jade shrink-0" />
                <span>{t("product.enamelFeature", "Thiết kế tráng men cao cấp")}</span>
              </div>
              <div className="flex items-center gap-3 text-foreground-muted font-medium">
                <Sparkles className="w-5 h-5 text-terracotta shrink-0" />
                <span>{t("product.secretFeature", "Cơ hội mở ra Secret Piece độc bản")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Detail Description & Highlights Showcase */}
      <div className="container mx-auto px-6 max-w-[1200px] mb-24">
        <div className="border-t border-foreground/10 pt-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-terracotta/10 border border-terracotta/25 rounded-full text-terracotta text-xs font-black uppercase tracking-widest mb-3 shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t("product.highlightBadge", "ĐẶC ĐIỂM NỔI BẬT")}</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-black text-foreground uppercase tracking-tight">
              {t("product.productStoryTitle", "CÂU CHUYỆN SẢN PHẨM & GIÁ TRỊ DI SẢN")}
            </h2>
          </div>

          {/* 4 Feature Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Card 1 */}
            <div className="bg-[#FAF9F5] border-2 border-foreground/10 p-6 rounded-2xl shadow-[4px_4px_0px_rgba(42,42,39,0.06)] hover:border-terracotta/50 transition-all hover:translate-y-[-2px] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-terracotta/10 text-terracotta flex items-center justify-center font-black text-xl mb-4 border border-terracotta/20 shadow-xs">
                  🏛️
                </div>
                <h3 className="font-display font-black text-lg text-foreground uppercase mb-2">
                  {t("product.highlight1Title", "Di sản văn hóa độc bản")}
                </h3>
                <p className="text-xs text-foreground-muted font-medium leading-relaxed">
                  {t("product.highlight1Desc", "Từng biểu tượng được nghiên cứu và thiết kế độc quyền, tái hiện nét văn hóa và kiến trúc lịch sử đặc trưng.")}
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#FAF9F5] border-2 border-foreground/10 p-6 rounded-2xl shadow-[4px_4px_0px_rgba(42,42,39,0.06)] hover:border-gold/60 transition-all hover:translate-y-[-2px] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-gold/15 text-gold flex items-center justify-center font-black text-xl mb-4 border border-gold/30 shadow-xs">
                  ✨
                </div>
                <h3 className="font-display font-black text-lg text-foreground uppercase mb-2">
                  {t("product.highlight2Title", "Chế tác tráng men cao cấp")}
                </h3>
                <p className="text-xs text-foreground-muted font-medium leading-relaxed">
                  {t("product.highlight2Desc", "Hợp kim kẽm đúc nguyên khối dày dặn, tráng men nhiều lớp bề mặt phẳng bóng bẩy, viền mạ chống trầy và oxi hóa.")}
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-[#FAF9F5] border-2 border-foreground/10 p-6 rounded-2xl shadow-[4px_4px_0px_rgba(42,42,39,0.06)] hover:border-jade/50 transition-all hover:translate-y-[-2px] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-jade/10 text-jade flex items-center justify-center font-black text-xl mb-4 border border-jade/20 shadow-xs">
                  🎴
                </div>
                <h3 className="font-display font-black text-lg text-foreground uppercase mb-2">
                  {t("product.highlight3Title", "Thẻ câu chuyện & Bản đồ số")}
                </h3>
                <p className="text-xs text-foreground-muted font-medium leading-relaxed">
                  {t("product.highlight3Desc", "Mỗi hộp đi kèm 01 Story Card với mã QR để thắp sáng địa danh trên Bản Đồ Di Sản và lưu giữ hành trình số hóa.")}
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-[#FAF9F5] border-2 border-foreground/10 p-6 rounded-2xl shadow-[4px_4px_0px_rgba(42,42,39,0.06)] hover:border-terracotta/50 transition-all hover:translate-y-[-2px] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-terracotta/10 text-terracotta flex items-center justify-center font-black text-xl mb-4 border border-terracotta/20 shadow-xs">
                  🎁
                </div>
                <h3 className="font-display font-black text-lg text-foreground uppercase mb-2">
                  {t("product.highlight4Title", "Hộp mù bất ngờ (Blind Box)")}
                </h3>
                <p className="text-xs text-foreground-muted font-medium leading-relaxed">
                  {t("product.highlight4Desc", "Đóng gói kín nguyên seal trong hộp kraft tái chế, mang đến sự bất ngờ và niềm vui hồi hộp khi khui hộp.")}
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Story Box & Quote */}
          <div className="bg-[#FAF9F5] border-2 border-foreground/10 rounded-3xl p-8 md:p-12 shadow-[6px_6px_0px_rgba(42,42,39,0.06)]">
            {/* Highlighted Quote Callout */}
            <div className="border-l-4 border-terracotta pl-6 py-3 mb-8 bg-terracotta/[0.04] rounded-r-2xl">
              <p className="font-display font-bold text-lg md:text-xl text-foreground italic leading-relaxed">
                {t("product.highlightQuote", "“Không chỉ là một món phụ kiện, Một Mảnh Việt Nam là cách bạn lưu giữ và mang theo một góc ký ức quê hương bên mình trên mọi chặng đường.”")}
              </p>
            </div>

            {/* Story Content with Highlight styling */}
            <div className="text-foreground/80 leading-relaxed font-medium whitespace-pre-line text-base md:text-lg space-y-4 mb-10 max-w-4xl">
              {displayFullDesc}
            </div>

            {/* Specifications Grid */}
            <div className="border-t border-foreground/10 pt-8">
              <h3 className="text-xs md:text-sm font-black uppercase tracking-[0.2em] text-foreground mb-6 flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-terracotta rounded-full"></span>
                {t("product.specsTitle", "QUY CÁCH ĐÓNG GÓI & THÔNG SỐ")}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-foreground/10 shadow-sm">
                  <span className="text-[11px] font-bold uppercase text-foreground/50 block mb-1">
                    {t("product.specMaterialLabel", "Chất liệu")}
                  </span>
                  <span className="text-xs md:text-sm font-bold text-foreground">
                    {t("product.specMaterialValue", "Hợp kim kẽm, tráng men cứng (Hard Enamel)")}
                  </span>
                </div>
                <div className="bg-white p-5 rounded-xl border border-foreground/10 shadow-sm">
                  <span className="text-[11px] font-bold uppercase text-foreground/50 block mb-1">
                    {t("product.specSizeLabel", "Kích thước")}
                  </span>
                  <span className="text-xs md:text-sm font-bold text-foreground">
                    {t("product.specSizeValue", "3.5 cm - 4.5 cm (tiêu chuẩn cài áo / balo)")}
                  </span>
                </div>
                <div className="bg-white p-5 rounded-xl border border-foreground/10 shadow-sm">
                  <span className="text-[11px] font-bold uppercase text-foreground/50 block mb-1">
                    {t("product.specPackageLabel", "Quy cách đóng gói")}
                  </span>
                  <span className="text-xs md:text-sm font-bold text-foreground">
                    {t("product.specPackageValue", "01 Hộp kín + 01 Pin + 01 Thẻ Story Card")}
                  </span>
                </div>
                <div className="bg-white p-5 rounded-xl border border-foreground/10 shadow-sm">
                  <span className="text-[11px] font-bold uppercase text-foreground/50 block mb-1">
                    {t("product.specOriginLabel", "Xuất xứ & Bản quyền")}
                  </span>
                  <span className="text-xs md:text-sm font-bold text-foreground">
                    {t("product.specOriginValue", "Thiết kế độc quyền bởi Một Mảnh Việt Nam")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What's in the box Section */}
      <div className="container mx-auto px-6 max-w-[1200px] mb-24">
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
      <div className="container mx-auto px-6 max-w-[1200px] mb-24">
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
                  <span>{displayCity}</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-display font-black text-foreground uppercase tracking-tight mb-2">
                  {displayTitle}
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
      <div className="container mx-auto px-6 max-w-[1200px]">
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
            <Image src={imageUrl} alt={displayTitle} fill className="object-contain p-1" />
          </div>
          <div className="min-w-0 flex flex-col">
            <span className="text-xs font-bold text-foreground truncate">{displayTitle}</span>
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
