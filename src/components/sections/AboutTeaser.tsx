"use client";
import { motion } from "framer-motion";
import { PackageOpen, QrCode, Map as MapIcon, Compass } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    icon: <PackageOpen className="w-10 h-10 text-terracotta" strokeWidth={1.5} />,
    title: "BẤT NGỜ TRONG HỘP",
    description: "Mỗi chiếc Blind Box là một ẩn số. Bạn có thể nhận được một góc phố cổ, một ly cà phê vỉa hè hay một bãi biển đầy nắng.",
    href: "/collection"
  },
  {
    icon: <QrCode className="w-10 h-10 text-jade" strokeWidth={1.5} />,
    title: "MỞ KHÓA CÂU CHUYỆN",
    description: "Quét mã QR trên Thẻ Câu Chuyện đi kèm để lắng nghe những ký ức và thông tin văn hóa đằng sau mỗi thiết kế.",
    href: "/story-hub"
  },
  {
    icon: <Compass className="w-10 h-10 text-gold" strokeWidth={1.5} />,
    title: "THẮP SÁNG BẢN ĐỒ",
    description: "Lưu trữ những mảnh bạn đã sưu tầm vào Bản Đồ Di Sản số hóa. Xây dựng bộ sưu tập ký ức Việt Nam của riêng bạn.",
    href: "/map"
  }
];

export default function AboutTeaser() {
  return (
    <section className="py-24 bg-background-alt/30 border-y border-foreground/10 relative overflow-hidden">
      {/* Decorative texture overlay */}
      <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E')]"></div>
      
      <div className="container mx-auto px-6 max-w-[1400px] relative z-10">
        <div className="text-center mb-20 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-terracotta border border-terracotta px-4 py-2 inline-block shadow-[2px_2px_0px_rgba(140,46,36,1)] bg-[#F5F2EB]">
              TRẢI NGHIỆM SƯU TẦM
            </span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-black mb-8 uppercase tracking-tighter leading-[1.3] md:leading-[1.4] text-foreground"
          >
            <span className="block mb-4 md:mb-6">MỘT MẢNH NHỎ.</span> 
            <span className="text-terracotta block">MỘT CÂU CHUYỆN LỚN.</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-foreground-muted text-lg md:text-xl font-medium leading-relaxed"
          >
            Mỗi sản phẩm chỉ là một mảnh nhỏ của Việt Nam. Nhưng khi những mảnh ấy được đặt cạnh nhau, chúng tạo thành một bức tranh rộng hơn về con người, thành phố, ký ức và những trải nghiệm không thể nào quên.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <Link href={step.href} className="flex flex-col items-center text-center group block cursor-pointer">
                <div className="w-24 h-24 rounded-full bg-[#F5F2EB] border-2 border-foreground/10 flex items-center justify-center mb-8 shadow-[4px_4px_0px_rgba(0,0,0,0.05)] group-hover:-translate-y-2 transition-transform duration-300 group-hover:border-terracotta group-hover:shadow-[6px_6px_0px_rgba(0,0,0,0.1)]">
                  {step.icon}
                </div>
                <h3 className="text-xl font-display font-black mb-4 uppercase tracking-wider group-hover:text-terracotta transition-colors">{step.title}</h3>
                <p className="text-foreground-muted font-medium leading-relaxed">
                  {step.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
