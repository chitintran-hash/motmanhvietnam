"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const mockProducts = [
  { id: 1, name: "Mảnh Hà Nội", color: "bg-red-900", desc: "Sáng mùa thu và ly cà phê trứng." },
  { id: 2, name: "Mảnh Hội An", color: "bg-yellow-600", desc: "Đêm rằm ánh đèn lồng trên phố cổ." },
  { id: 3, name: "Mảnh TP.HCM", color: "bg-blue-800", desc: "Cơn mưa bất chợt dưới hiên nhà." },
  { id: 4, name: "Mảnh Miền Tây", color: "bg-green-700", desc: "Tiếng ghe máy xuôi dòng sông nước." },
];

export default function CollectionPreview() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <span className="text-terracotta font-medium tracking-wider text-sm uppercase mb-2 block">Collection 01</span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold">Những Mảnh Đầu Tiên</h2>
          </div>
          <Link href="/collection" className="group flex items-center gap-2 text-foreground/70 hover:text-terracotta transition-colors font-medium">
            Xem toàn bộ 6 mẫu
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="aspect-[4/5] rounded-2xl bg-white shadow-sm overflow-hidden mb-4 relative flex items-center justify-center">
                {/* Placeholder for Box/Pin Image */}
                <div className={`w-32 h-32 rounded-full ${product.color} opacity-20 blur-2xl absolute`}></div>
                <div className="relative z-10 w-24 h-24 rounded-xl border border-foreground/10 bg-background/50 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                  <span className="font-serif font-bold text-foreground/40 text-4xl">?</span>
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <span className="text-white font-medium">Khám phá mảnh ghép</span>
                </div>
              </div>
              <h3 className="font-serif font-bold text-lg mb-1">{product.name}</h3>
              <p className="text-foreground/60 text-sm font-light">{product.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
