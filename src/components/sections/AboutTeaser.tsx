"use client";
import { useState, useEffect } from "react";
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
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((p) => (p + 1) % 3);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 bg-background-alt/30 border-y border-foreground/10 relative overflow-hidden">
      {/* Decorative texture overlay */}
      <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E')]"></div>
      
      <div className="container mx-auto px-6 max-w-[1400px] relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center mb-24 max-w-[1300px] mx-auto">
          <div className="lg:col-span-7 text-left">
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
              className="text-4xl md:text-5xl lg:text-6xl xl:text-[72px] font-display font-black mb-8 uppercase tracking-tighter leading-[1.1] text-foreground"
            >
              <span className="block mb-4 md:mb-6 whitespace-nowrap">MỘT MẢNH NHỎ</span> 
              <span className="text-terracotta block whitespace-nowrap">MỘT CÂU CHUYỆN LỚN</span>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-foreground-muted text-lg md:text-xl font-medium leading-relaxed max-w-2xl"
            >
              Mỗi sản phẩm chỉ là một mảnh nhỏ của Việt Nam. Nhưng khi những mảnh ấy được đặt cạnh nhau, chúng tạo thành một bức tranh rộng hơn về con người, thành phố, ký ức và những trải nghiệm không thể nào quên.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-5 w-full relative rounded-2xl overflow-hidden shadow-2xl border-4 border-foreground/10 aspect-[4/5] bg-beige"
          >
            <div 
              className="flex w-full h-full transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${activeSlide * 100}%)` }}
            >
              {[1, 2, 3].map((num) => (
                <div key={num} className="min-w-full h-full relative flex-shrink-0">
                  <img src={`/images/product-slide-${num}.jpg`} alt={`Sản phẩm ${num}`} className="absolute inset-0 w-full h-full object-cover" />
                </div>
              ))}
            </div>
            
            {/* Dots navigation indicator */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-10">
              {[0, 1, 2].map((idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${activeSlide === idx ? 'bg-terracotta w-8' : 'bg-white/70 hover:bg-white'}`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </motion.div>
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
