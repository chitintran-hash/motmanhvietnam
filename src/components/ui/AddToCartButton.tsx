"use client";

import { useState } from "react";
import { ShoppingBag, Zap, Minus, Plus, CheckCircle2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function AddToCartButton({ 
  product, 
  priceFormatted,
  displayPrice,
  variant = "default"
}: { 
  product: any, 
  priceFormatted: string,
  displayPrice: number,
  variant?: "default" | "compact"
}) {
  const router = useRouter();
  const { t } = useLanguage();
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  const isOutOfStock = !product || product.stock <= 0;

  const addToCartInternal = (qty: number) => {
    const saved = localStorage.getItem('mm_cart');
    let cart = [];
    if (saved) {
      try { cart = JSON.parse(saved); } catch (e) {}
    }
    
    const existingIndex = cart.findIndex((item: any) => item.id === product.id);
    if (existingIndex >= 0) {
      cart[existingIndex].quantity += qty;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: displayPrice,
        quantity: qty,
        image: product.image_url || "/images/product-slide-1.jpg",
        color: "text-foreground",
        bgColor: "bg-foreground"
      });
    }
    
    localStorage.setItem('mm_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // 1. Thêm vào giỏ hàng (không chuyển trang ngay, hiển thị thông báo đã thêm)
  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCartInternal(quantity);
    setAddedToast(true);
    setTimeout(() => {
      setAddedToast(false);
    }, 4500);
  };

  // 2. Đặt hàng ngay (Chuyển thẳng tới trang thanh toán COD)
  const handleOrderNow = () => {
    if (isOutOfStock) return;
    addToCartInternal(quantity);
    router.push("/checkout");
  };

  const currentTotal = displayPrice * quantity;
  const currentTotalFormatted = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentTotal);

  if (variant === "compact") {
    return (
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Quantity selector */}
        <div className="flex items-center justify-center border-2 border-foreground/15 rounded-xl bg-white shadow-sm overflow-hidden h-12">
          <button
            type="button"
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            disabled={quantity <= 1 || isOutOfStock}
            className="px-3.5 h-full text-foreground/80 hover:bg-foreground/5 hover:text-foreground font-black text-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            aria-label="Giảm số lượng"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="px-4 font-display font-black text-base min-w-[2.5rem] text-center select-none">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity(q => Math.min(product.stock || 99, q + 1))}
            disabled={quantity >= (product.stock || 99) || isOutOfStock}
            className="px-3.5 h-full text-foreground/80 hover:bg-foreground/5 hover:text-foreground font-black text-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            aria-label="Tăng số lượng"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Nút đặt hàng ngay */}
        <button
          onClick={handleOrderNow}
          disabled={isOutOfStock}
          className="flex-1 bg-terracotta hover:bg-terracotta-hover text-white font-black uppercase tracking-wider h-12 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[3px_3px_0px_rgba(42,42,39,0.2)] hover:translate-y-[1px] hover:translate-x-[1px] disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>{t("product.orderNowShort", "ĐẶT HÀNG NGAY")}</span>
          <span className="opacity-90">({currentTotalFormatted})</span>
        </button>

        {/* Nút thêm vào giỏ */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="border-2 border-foreground/20 hover:border-foreground bg-white text-foreground font-black uppercase tracking-wider h-12 px-4 rounded-xl transition-all flex items-center justify-center gap-2 hover:bg-foreground/5 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
          title={t("product.addToCart", "THÊM VÀO GIỎ")}
        >
          <ShoppingBag className="w-4 h-4" />
          <span className="hidden md:inline">{t("product.addToCart", "THÊM VÀO GIỎ")}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full mb-8">
      {/* Toast thông báo đã thêm vào giỏ */}
      {addedToast && (
        <div className="mb-4 p-3.5 bg-emerald-50 border-2 border-emerald-400 rounded-xl flex items-center justify-between gap-3 text-emerald-900 text-sm font-bold shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{t("product.addedSuccess", "Đã thêm vào giỏ hàng thành công!")} ({quantity} hộp)</span>
          </div>
          <Link 
            href="/cart" 
            className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-black uppercase tracking-wider hover:bg-emerald-700 transition-colors shrink-0"
          >
            {t("product.viewCartLink", "Xem giỏ hàng")}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Bộ chọn số lượng */}
      <div className="flex items-center justify-between mb-4 bg-foreground/5 p-3.5 rounded-xl border border-foreground/10">
        <div className="flex flex-col">
          <span className="text-xs font-black uppercase tracking-wider text-foreground">
            {t("product.quantityLabel", "Số lượng hộp:")}
          </span>
          <span className="text-[11px] text-foreground/60 font-medium">
            Tạm tính: <strong className="text-terracotta">{currentTotalFormatted}</strong>
          </span>
        </div>

        <div className="flex items-center border-2 border-foreground/20 rounded-xl bg-white shadow-sm overflow-hidden h-11">
          <button
            type="button"
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            disabled={quantity <= 1 || isOutOfStock}
            className="px-3.5 h-full text-foreground/80 hover:bg-foreground/5 hover:text-foreground font-black text-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
            aria-label="Giảm số lượng"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="px-4 font-display font-black text-base min-w-[2.75rem] text-center select-none text-foreground">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity(q => Math.min(product.stock || 99, q + 1))}
            disabled={quantity >= (product.stock || 99) || isOutOfStock}
            className="px-3.5 h-full text-foreground/80 hover:bg-foreground/5 hover:text-foreground font-black text-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
            aria-label="Tăng số lượng"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Nút hành động kép: Đặt hàng ngay (COD) & Thêm vào giỏ */}
      <div className="space-y-3">
        {/* 1. NÚT ĐẶT HÀNG NGAY (COD) - Nút chính nổi bật */}
        <button 
          onClick={handleOrderNow}
          disabled={isOutOfStock}
          className="w-full bg-terracotta hover:bg-terracotta-hover text-white font-black uppercase tracking-wider py-4 px-6 rounded-xl transition-all flex flex-col items-center justify-center gap-1 shadow-[4px_4px_0px_rgba(42,42,39,0.3)] hover:shadow-[2px_2px_0px_rgba(42,42,39,0.3)] hover:translate-y-[2px] hover:translate-x-[2px] duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer group"
        >
          <div className="flex items-center justify-center gap-2 text-base md:text-lg">
            <Zap className="w-5 h-5 fill-current animate-pulse text-gold" />
            <span>{isOutOfStock ? t("product.outOfStock", "HẾT HÀNG") : t("product.orderNow", "ĐẶT HÀNG NGAY (COD)")}</span>
            <span className="text-white/90">({currentTotalFormatted})</span>
          </div>
          <span className="text-[11px] font-medium text-white/80 lowercase tracking-normal">
            {t("product.orderCodSubtitle", "thanh toán khi nhận hàng • đồng kiểm trước khi nhận")}
          </span>
        </button>

        {/* 2. NÚT THÊM VÀO GIỎ HÀNG */}
        <button 
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="w-full bg-foreground hover:bg-foreground/90 text-white font-bold uppercase tracking-wider py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2.5 shadow-[3px_3px_0px_rgba(0,0,0,0.1)] hover:translate-y-[1px] hover:translate-x-[1px] duration-150 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{t("product.addToCart", "THÊM VÀO GIỎ HÀNG")}</span>
        </button>
      </div>

      {/* Cam kết mua hàng */}
      <div className="mt-3.5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-foreground/60 font-semibold text-center">
        <span>✓ Thanh toán khi nhận hàng (COD)</span>
        <span>✓ Đồng kiểm hàng trước khi trả tiền</span>
        <span>✓ Đổi trả 1-1 nếu có lỗi</span>
      </div>
    </div>
  );
}
