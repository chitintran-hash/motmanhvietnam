"use client";

import { ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AddToCartButton({ priceFormatted }: { priceFormatted: string }) {
  const router = useRouter();

  const handleAddToCart = () => {
    alert("Đã thêm vào giỏ hàng thành công!");
    router.push("/cart");
  };

  return (
    <button 
      onClick={handleAddToCart}
      className="w-full bg-foreground text-white font-bold uppercase tracking-wider py-5 rounded-xl hover:bg-terracotta transition-colors flex items-center justify-center gap-3 shadow-[4px_4px_0px_rgba(0,0,0,0.1)] hover:shadow-[2px_2px_0px_rgba(0,0,0,0.1)] hover:translate-y-[2px] hover:translate-x-[2px] duration-200 mb-8"
    >
      <ShoppingBag className="w-5 h-5" />
      THÊM VÀO GIỎ ({priceFormatted})
    </button>
  );
}
