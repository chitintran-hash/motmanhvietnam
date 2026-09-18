"use client";

import { ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AddToCartButton({ 
  product, 
  priceFormatted,
  displayPrice
}: { 
  product: any, 
  priceFormatted: string,
  displayPrice: number
}) {
  const router = useRouter();

  const handleAddToCart = () => {
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
        image: product.image_url || "https://illustrations.popsy.co/amber/home-office.svg",
        color: "text-foreground",
        bgColor: "bg-foreground"
      });
    }
    
    localStorage.setItem('mm_cart', JSON.stringify(cart));
    
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
