"use client";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background with abstract glowing effects */}
      <div className="absolute inset-0 z-0 bg-background">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-terracotta/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-jade/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-foreground/5 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-foreground/5 rounded-full"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground/5 text-sm font-medium mb-8 text-foreground/80"
        >
          <Sparkles className="w-4 h-4 text-terracotta" />
          Collection 01: Những Mảnh Đầu Tiên
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-5xl md:text-7xl font-serif font-bold text-foreground mb-6 leading-tight max-w-4xl"
        >
          Mang một mảnh <span className="text-terracotta relative">
            Việt Nam
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-terracotta/30 rounded-full"></span>
          </span> theo bên mình
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-lg md:text-xl text-foreground/70 max-w-2xl mb-12 font-light leading-relaxed"
        >
          Không chỉ là phụ kiện. Mỗi Blind Box là một câu chuyện, một ký ức về địa danh, văn hóa và con người Việt Nam. Khám phá, sưu tầm và thắp sáng Bản đồ di sản của riêng bạn.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="/collection" className="group flex items-center justify-center gap-2 px-8 py-4 bg-terracotta text-white rounded-full font-medium hover:bg-terracotta-hover transition-all hover:shadow-lg hover:shadow-terracotta/20">
            Khám phá Collection
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/map" className="group flex items-center justify-center gap-2 px-8 py-4 bg-foreground/5 text-foreground rounded-full font-medium hover:bg-foreground/10 transition-all">
            Xem Bản đồ số
          </Link>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-foreground/50"
      >
        <span className="text-xs uppercase tracking-widest font-semibold">Cuộn xuống</span>
        <div className="w-px h-12 bg-gradient-to-b from-foreground/50 to-transparent"></div>
      </motion.div>
    </section>
  );
}
