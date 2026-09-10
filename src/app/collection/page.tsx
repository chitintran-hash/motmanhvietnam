"use client";
import { motion } from "framer-motion";
import { Sparkles, ShoppingBag } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";

const mockProducts = [
  {
    slug: "manh-ha-noi",
    name: "MẢNH HÀ NỘI",
    city: "Hà Nội",
    collectionNumber: "COLL_01",
    price: "129,000 ₫",
    imageUrl: "https://illustrations.popsy.co/amber/home-office.svg",
  },
  {
    slug: "manh-sai-gon",
    name: "MẢNH SÀI GÒN",
    city: "Sài Gòn",
    collectionNumber: "COLL_01",
    price: "129,000 ₫",
    imageUrl: "https://illustrations.popsy.co/amber/street-food.svg",
  },
  {
    slug: "manh-da-nang",
    name: "MẢNH ĐÀ NẴNG",
    city: "Đà Nẵng",
    collectionNumber: "COLL_01",
    price: "129,000 ₫",
    imageUrl: "https://illustrations.popsy.co/amber/surfer.svg",
  },
  {
    slug: "manh-hoi-an",
    name: "MẢNH HỘI AN",
    city: "Hội An",
    collectionNumber: "COLL_01",
    price: "129,000 ₫",
    imageUrl: "https://illustrations.popsy.co/amber/plant.svg",
  },
  {
    slug: "manh-hue",
    name: "MẢNH HUẾ",
    city: "Huế",
    collectionNumber: "COLL_01",
    price: "129,000 ₫",
    imageUrl: "https://illustrations.popsy.co/amber/painting.svg",
  },
  {
    slug: "manh-tay-nguyen",
    name: "MẢNH TÂY NGUYÊN",
    city: "Tây Nguyên",
    collectionNumber: "COLL_01",
    price: "129,000 ₫",
    imageUrl: "https://illustrations.popsy.co/amber/camping.svg",
  }
];

export default function CollectionPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 relative">
      <div className="container mx-auto px-6 max-w-[1400px]">
        <div className="text-center mb-24 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 mb-6"
          >
            <div className="w-12 h-px bg-terracotta/50"></div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-terracotta">
              MÙA 01
            </span>
            <div className="w-12 h-px bg-terracotta/50"></div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-display font-black text-foreground mb-8 uppercase tracking-tighter"
          >
            NHỮNG MẢNH ĐẦU TIÊN
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-foreground-muted text-lg font-medium leading-relaxed"
          >
            6 mẫu thường và 1 mẫu đặc biệt ẩn giấu. Mỗi Blind Box mang đến sự bất ngờ, một câu chuyện chưa được kể và một mảnh ghép để bắt đầu bộ sưu tập Việt Nam của riêng bạn.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
          {mockProducts.map((product, index) => (
            <motion.div
              key={product.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard {...product} />
            </motion.div>
          ))}

          {/* Secret Piece Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-3 xl:col-span-3 mt-8"
          >
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
          </motion.div>
        </div>

        {/* Purchase CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 max-w-4xl mx-auto bg-[#F5F2EB] border-4 border-foreground p-12 text-center relative"
        >
          <div className="absolute top-2 left-2 w-full h-full border-4 border-terracotta -z-10 pointer-events-none translate-x-2 translate-y-2"></div>
          
          <h2 className="text-3xl md:text-5xl font-display font-black mb-6 uppercase tracking-tight">
            MUA BLIND BOX ONLINE
          </h2>
          <p className="text-foreground-muted mb-10 max-w-xl mx-auto font-medium">
            Giá 129.000đ cho mỗi Blind Box. Mỗi hộp sẽ chứa ngẫu nhiên một Pin và Thẻ Câu Chuyện. Bạn đã sẵn sàng thử vận may?
          </p>
          <button onClick={() => alert("Đã thêm Blind Box vào giỏ hàng thành công!")} className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-terracotta text-white font-bold tracking-widest text-sm uppercase hover:bg-terracotta-hover transition-all shadow-[6px_6px_0px_rgba(42,42,39,1)] hover:shadow-[2px_2px_0px_rgba(42,42,39,1)] hover:translate-x-[4px] hover:translate-y-[4px]">
            <ShoppingBag className="w-5 h-5" />
            ĐẶT MUA NGAY — 129.000₫
          </button>
        </motion.div>
      </div>
    </div>
  );
}
