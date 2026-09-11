"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ArrowRight, Minus, Plus } from "lucide-react";

export default function CartPage() {
  const [items, setItems] = useState([
    {
      id: "sg-01",
      name: "Blind Box Sài Gòn",
      price: 250000,
      quantity: 1,
      image: "/images/ben-thanh.jpg",
      color: "text-primary-red",
      bgColor: "bg-primary-red"
    },
    {
      id: "hn-01",
      name: "Blind Box Hà Nội",
      price: 250000,
      quantity: 1,
      image: "https://illustrations.popsy.co/amber/home-office.svg",
      color: "text-primary-green",
      bgColor: "bg-primary-green"
    }
  ]);

  const updateQuantity = (id: string, delta: number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = items.length > 0 ? 30000 : 0;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen pt-32 pb-24 bg-cream">
      <div className="container mx-auto px-6 max-w-[1200px]">
        <div className="mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-8 h-1 bg-primary-red"></div>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary-red">
              CHECKOUT
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black text-primary-red uppercase tracking-tighter">
            GIỎ HÀNG CỦA BẠN
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 border-4 border-dashed border-primary-green/20">
            <h2 className="font-display font-black text-2xl text-primary-green mb-4">Giỏ hàng trống</h2>
            <p className="text-foreground/60 font-medium mb-8">Bạn chưa có mảnh ghép nào trong giỏ hàng. Hãy khám phá ngay!</p>
            <Link href="/collection" className="inline-flex items-center gap-2 px-8 py-4 bg-primary-red text-cream font-bold uppercase tracking-widest hover:bg-primary-green transition-colors border-2 border-primary-red hover:border-primary-green shadow-[4px_4px_0px_rgba(137,8,8,1)] hover:shadow-[4px_4px_0px_rgba(46,91,70,1)]">
              Khám phá sản phẩm
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {items.map((item) => (
                <div key={item.id} className="bg-white border-4 border-foreground p-4 flex flex-col sm:flex-row items-center gap-6 shadow-[6px_6px_0px_rgba(42,42,39,1)]">
                  <div className={`w-32 h-32 relative bg-beige flex-shrink-0 border-2 border-foreground flex items-center justify-center p-2`}>
                     <Image src={item.image} alt={item.name} fill className="object-contain" />
                  </div>
                  
                  <div className="flex-1 flex flex-col w-full">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className={`font-display font-black text-2xl uppercase tracking-wider ${item.color}`}>
                        {item.name}
                      </h3>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-foreground/40 hover:text-primary-red transition-colors p-2"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <p className="text-lg font-bold text-foreground mb-6">
                      {item.price.toLocaleString('vi-VN')} ₫
                    </p>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center border-2 border-foreground">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-10 h-10 flex items-center justify-center hover:bg-foreground hover:text-cream transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <div className="w-12 h-10 flex items-center justify-center font-bold text-foreground font-mono border-x-2 border-foreground">
                          {item.quantity}
                        </div>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-10 h-10 flex items-center justify-center hover:bg-foreground hover:text-cream transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="font-bold text-lg text-foreground">
                        {(item.price * item.quantity).toLocaleString('vi-VN')} ₫
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-beige border-4 border-primary-green p-8 sticky top-32 shadow-[8px_8px_0px_rgba(46,91,70,1)]">
                <h3 className="font-display font-black text-2xl text-primary-green uppercase tracking-wider mb-6 pb-4 border-b-2 border-primary-green/20">
                  TỔNG ĐƠN HÀNG
                </h3>
                
                <div className="flex flex-col gap-4 mb-6">
                  <div className="flex justify-between items-center text-foreground font-medium">
                    <span>Tạm tính</span>
                    <span>{subtotal.toLocaleString('vi-VN')} ₫</span>
                  </div>
                  <div className="flex justify-between items-center text-foreground font-medium">
                    <span>Phí vận chuyển</span>
                    <span>{shipping.toLocaleString('vi-VN')} ₫</span>
                  </div>
                </div>
                
                <div className="border-t-2 border-primary-green/20 pt-4 mb-8">
                  <div className="flex justify-between items-end">
                    <span className="font-bold text-primary-green uppercase tracking-widest">TỔNG CỘNG</span>
                    <span className="font-display font-black text-3xl text-primary-red">
                      {total.toLocaleString('vi-VN')} ₫
                    </span>
                  </div>
                </div>
                
                <button className="w-full py-4 bg-primary-green text-cream font-bold uppercase tracking-widest hover:bg-primary-red transition-colors border-2 border-primary-green hover:border-primary-red shadow-[4px_4px_0px_rgba(46,91,70,1)] flex items-center justify-center gap-2">
                  TIẾN HÀNH THANH TOÁN
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
