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
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-3 mb-6"
            >
              <div className="w-8 h-px bg-terracotta"></div>
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-terracotta">
                MỘT MẢNH VIỆT NAM
              </span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-5xl md:text-[4.5rem] lg:text-[5.5rem] font-display font-black text-foreground mb-8 leading-[1.2] md:leading-[1.15] tracking-tighter uppercase"
            >
              Mang một mảnh <br />
              <span className="text-terracotta relative inline-block">
                Việt Nam
                <span className="absolute -bottom-1 left-0 w-full h-1 bg-terracotta/30"></span>
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
              <Link href="/collection" className="group flex items-center justify-center gap-3 px-8 py-4 bg-terracotta text-white font-bold tracking-widest text-sm uppercase border border-terracotta hover:bg-terracotta-hover transition-all shadow-[4px_4px_0px_rgba(42,42,39,1)] hover:shadow-[2px_2px_0px_rgba(42,42,39,1)] hover:translate-x-[2px] hover:translate-y-[2px]">
                KHÁM PHÁ COLLECTION
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/map" className="group flex items-center justify-center gap-3 px-8 py-4 bg-transparent text-foreground font-bold tracking-widest text-sm uppercase border border-foreground hover:bg-foreground/5 transition-all">
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
              <div className="w-48 h-64 bg-[#F5F2EB] border-2 border-[#E3DECE] p-4 shadow-xl -rotate-6 flex flex-col items-center justify-between">
                <div className="w-full flex justify-between">
                  <span className="text-[8px] uppercase tracking-widest text-foreground/40 font-mono">HÀ NỘI</span>
                  <span className="text-[8px] uppercase tracking-widest text-foreground/40 font-mono">STAMP</span>
                </div>
                <div className="w-32 h-32 bg-background-alt/50 rounded-sm flex items-center justify-center">
                  <span className="text-xs font-medium text-foreground/40">Hồ Gươm</span>
                </div>
                <h4 className="font-display font-bold text-sm uppercase">Mảnh Ký Ức</h4>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, type: "spring" }}
              className="absolute z-30 top-[40%] right-[10%] lg:right-[5%]"
            >
              {/* Mock Box */}
              <div className="w-56 h-64 bg-background-alt border border-foreground/10 shadow-2xl rotate-3 flex items-center justify-center">
                 <div className="text-center">
                   <span className="font-display font-black text-4xl text-terracotta/20">BOX</span>
                   <p className="text-[10px] uppercase tracking-widest text-foreground/60 mt-2">Blind Box 01</p>
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
              <div className="w-24 h-24 bg-white rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.15)] flex items-center justify-center border-4 border-gold/30 -rotate-12">
                 <span className="font-display font-bold text-terracotta">PIN</span>
              </div>
            </motion.div>

            {/* Decorative Map Lines */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
              <svg viewBox="0 0 100 100" className="w-full h-full stroke-terracotta" fill="none" strokeWidth="0.2" strokeDasharray="1 2">
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
