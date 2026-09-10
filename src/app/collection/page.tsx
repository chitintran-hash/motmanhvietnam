"use client";
import { motion } from "framer-motion";
import { Sparkles, ShoppingBag } from "lucide-react";

const products = [
  { id: 1, name: "Mảnh Hà Nội", color: "bg-red-900", desc: "Sáng mùa thu và ly cà phê trứng.", isSpecial: false },
  { id: 2, name: "Mảnh Hội An", color: "bg-yellow-600", desc: "Đêm rằm ánh đèn lồng trên phố cổ.", isSpecial: false },
  { id: 3, name: "Mảnh TP.HCM", color: "bg-blue-800", desc: "Cơn mưa bất chợt dưới hiên nhà.", isSpecial: false },
  { id: 4, name: "Mảnh Miền Tây", color: "bg-green-700", desc: "Tiếng ghe máy xuôi dòng sông nước.", isSpecial: false },
  { id: 5, name: "Mảnh Tây Nguyên", color: "bg-orange-800", desc: "Tiếng cồng chiêng bên ánh lửa bập bùng.", isSpecial: false },
  { id: 6, name: "Mảnh Huế", color: "bg-purple-800", desc: "Nét trầm mặc bên dòng Hương Giang.", isSpecial: false },
  { id: 7, name: "Mảnh Bí Ẩn", color: "bg-gradient-to-br from-gold to-terracotta", desc: "Mảnh ghép đặc biệt với tỉ lệ xuất hiện cực thấp.", isSpecial: true },
];

export default function CollectionPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 bg-background">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground/5 text-sm font-medium mb-6 text-foreground/80"
          >
            <Sparkles className="w-4 h-4 text-terracotta" />
            Bản Thử Nghiệm
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-serif font-bold mb-6"
          >
            Collection 01: Những Mảnh Đầu Tiên
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-foreground/70 max-w-2xl mx-auto text-lg font-light leading-relaxed"
          >
            6 mẫu thường và 1 mẫu đặc biệt. Mỗi Blind Box mang đến sự bất ngờ, một câu chuyện chưa được kể và một mảnh ghép chờ bạn khám phá.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`group flex flex-col ${product.isSpecial ? 'xl:col-span-2 sm:col-span-2' : ''}`}
            >
              <div className={`aspect-square md:aspect-[4/5] rounded-3xl ${product.isSpecial ? 'bg-foreground' : 'bg-white'} shadow-sm overflow-hidden mb-6 relative flex items-center justify-center border border-foreground/5`}>
                <div className={`w-40 h-40 rounded-full ${product.color} opacity-20 blur-3xl absolute`}></div>
                
                <div className="relative z-10 w-32 h-32 rounded-2xl border border-white/10 bg-background/20 backdrop-blur-md flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                  <span className={`font-serif font-bold text-6xl ${product.isSpecial ? 'text-gold' : 'text-foreground/30'}`}>?</span>
                </div>
                
                {product.isSpecial && (
                  <div className="absolute top-4 right-4 bg-gold text-background text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                    <Sparkles className="w-3 h-3" /> SECRET
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className={`font-serif font-bold text-xl mb-2 ${product.isSpecial ? 'text-terracotta' : 'text-foreground'}`}>{product.name}</h3>
                  <p className="text-foreground/60 text-sm font-light leading-relaxed">{product.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Purchase CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-24 max-w-4xl mx-auto bg-foreground text-background rounded-3xl p-8 md:p-12 text-center flex flex-col items-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-terracotta/20 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-jade/20 rounded-full blur-[80px]"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Sở hữu Mảnh ghép của bạn</h2>
            <p className="text-background/70 mb-8 max-w-xl mx-auto font-light">
              Mỗi Blind Box có giá 129.000đ. Đặt hàng trước ngay hôm nay để trở thành những người đầu tiên thắp sáng Bản đồ Di sản.
            </p>
            <button onClick={() => alert("Đã thêm Blind Box vào giỏ hàng thành công!")} className="group flex items-center justify-center gap-2 px-8 py-4 bg-terracotta text-white rounded-full font-medium hover:bg-terracotta-hover transition-all w-full md:w-auto mx-auto hover:shadow-lg hover:shadow-terracotta/20">
              <ShoppingBag className="w-5 h-5" />
              Pre-order Blind Box — 129.000đ
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
