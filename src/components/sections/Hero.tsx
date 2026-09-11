"use client";
import { motion } from "framer-motion";
import { ArrowRight, Map } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-12">
      <div className="container mx-auto px-6 max-w-[1400px] relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[calc(100vh-8rem)]">
          {/* Left Column: Typography */}
          <div className="flex flex-col justify-center order-2 lg:order-1">


            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-5xl md:text-[4.5rem] lg:text-[5.5rem] font-display font-black text-foreground mb-8 leading-[1.2] md:leading-[1.15] tracking-tighter uppercase"
            >
              Mang một mảnh <br />
              <span className="text-terracotta relative inline-block">
                Việt Nam
              </span> <br />
              theo bên mình
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-lg md:text-xl text-foreground-muted max-w-lg mb-12 font-medium leading-relaxed border-l-2 border-foreground/10 pl-6"
            >
              Những chiếc pin nhỏ lưu giữ câu chuyện về những thành phố, ký ức và khoảnh khắc rất Việt Nam.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6"
            >
              <Link href="/collection" className="group flex items-center justify-center gap-3 px-8 py-4 bg-primary-red text-cream font-bold tracking-widest text-sm uppercase border border-primary-red hover:bg-[#A30D0D] transition-all shadow-[4px_4px_0px_rgba(42,42,39,1)] hover:shadow-[2px_2px_0px_rgba(42,42,39,1)] hover:translate-x-[2px] hover:translate-y-[2px]">
                KHÁM PHÁ COLLECTION
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/map" className="group flex items-center justify-center gap-3 px-8 py-4 bg-transparent text-primary-green font-bold tracking-widest text-sm uppercase border border-primary-green hover:bg-primary-green hover:text-cream transition-all">
                <Map className="w-4 h-4" />
                MỞ BẢN ĐỒ DI SẢN
              </Link>
            </motion.div>
          </div>

          {/* Right Column: Collector Desk Visuals */}
          <div className="relative h-[600px] lg:h-full w-full order-1 lg:order-2 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.2, type: "spring" }}
              className="absolute z-20 top-[10%] left-[10%] lg:left-[5%]"
            >
              {/* Mock Postcard / Story Card */}
              <div className="w-48 h-64 bg-cream border-2 border-primary-green p-4 shadow-xl -rotate-6 flex flex-col items-center justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-8 h-8 bg-primary-green flex items-center justify-center">
                   <span className="text-cream font-bold text-[10px]">01</span>
                </div>
                <div className="w-full flex justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary-green font-mono">HÀ NỘI</span>
                </div>
                <div className="w-32 h-32 bg-beige/30 rounded-sm flex items-center justify-center border border-primary-green/20">
                  <span className="text-xs font-bold text-primary-green/60 uppercase tracking-widest">STORY CARD</span>
                </div>
                <h4 className="font-display font-bold text-sm uppercase text-primary-green">Mảnh Ký Ức</h4>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, type: "spring" }}
              className="absolute z-30 top-[40%] right-[10%] lg:right-[5%]"
            >
              {/* Mock Box */}
              <div className="w-56 h-64 bg-beige border-4 border-primary-red shadow-2xl rotate-3 flex flex-col items-center justify-center relative">
                 <div className="absolute top-4 left-4 bg-yellow px-2 py-1">
                    <span className="text-[8px] font-bold text-navy uppercase tracking-widest">SÀI GÒN</span>
                 </div>
                 <div className="text-center">
                   <span className="font-display font-black text-5xl text-primary-red">BOX</span>
                   <p className="text-[12px] font-bold uppercase tracking-widest text-primary-red mt-2">BLIND BOX 01</p>
                 </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.8, type: "spring", bounce: 0.5 }}
              className="absolute z-40 top-[50%] left-[30%] lg:left-[25%]"
            >
              {/* Mock Pin */}
              <div className="w-24 h-24 bg-cream rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.15)] flex items-center justify-center border-4 border-yellow -rotate-12">
                 <span className="font-display font-black text-xl text-primary-red">PIN</span>
              </div>
            </motion.div>

            {/* Decorative Map Lines */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
              <svg viewBox="0 0 100 100" className="w-full h-full stroke-primary-red" fill="none" strokeWidth="0.3" strokeDasharray="1 3">
                <path d="M20,80 Q40,50 80,20" />
                <path d="M10,40 Q50,90 90,60" />
                <circle cx="80" cy="20" r="2" fill="currentColor" />
                <circle cx="20" cy="80" r="2" fill="currentColor" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
