"use client";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowLeft, Package, Map, FileText, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ProductDetail({ params }: { params: { slug: string } }) {
  return (
    <div className="min-h-screen pt-32 pb-24 bg-background">
      <div className="container mx-auto px-6 max-w-[1200px]">
        <Link href="/collection" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground-muted hover:text-terracotta transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" />
          Quay lại Collection
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          {/* Product Image Gallery */}
          <div className="relative w-full aspect-square bg-[#FAFAFA] border-2 border-foreground/10 p-8 shadow-xl flex items-center justify-center">
            <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E')]"></div>
            <div className="absolute top-4 left-4">
              <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest font-mono">COLL_01</span>
            </div>
            <div className="relative w-[80%] h-[80%]">
              <Image 
                src="https://illustrations.popsy.co/amber/home-office.svg"
                alt="Product Image"
                fill
                className="object-contain drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-terracotta">
                HÀ NỘI
              </span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-display font-black text-foreground mb-4 uppercase tracking-tighter">
              MẢNH HÀ NỘI
            </h1>
            <p className="text-xl text-foreground-muted font-medium mb-8">
              Hồ Gươm • Một góc ký ức
            </p>
            
            <div className="text-3xl font-display font-bold text-foreground mb-10">
              129,000 ₫
            </div>
            
            <button onClick={() => alert("Đã thêm vào giỏ hàng!")} className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-terracotta text-white font-bold tracking-widest text-sm uppercase hover:bg-terracotta-hover transition-all shadow-[6px_6px_0px_rgba(42,42,39,1)] hover:shadow-[2px_2px_0px_rgba(42,42,39,1)] hover:translate-x-[4px] hover:translate-y-[4px] w-full sm:w-auto mb-12">
              <ShoppingBag className="w-5 h-5" />
              THÊM VÀO GIỎ HÀNG
            </button>

            <div className="border-t border-foreground/10 pt-8">
              <p className="text-foreground-muted leading-relaxed font-medium">
                Chiếc Pin cài áo này là một lời nhắc nhở về những buổi sáng mùa thu se lạnh ở thủ đô, với ly cà phê trứng nồng nàn và tiếng lá sấu rơi xào xạc.
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
