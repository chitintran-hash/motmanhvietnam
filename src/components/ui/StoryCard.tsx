import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { QrCode, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

interface StoryCardProps {
  id?: string;
  city: string;
  name: string;
  collectionNumber: string;
  imageUrl: string;
  excerpt: string;
}

export default function StoryCard({ id = "hanoi-01", city, name, collectionNumber, imageUrl, excerpt }: StoryCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="relative w-full max-w-[320px] aspect-[3/4] mx-auto perspective-1000 cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="w-full h-full relative preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* Front of Card */}
        <div className="absolute inset-0 backface-hidden">
          <div className="w-full h-full bg-[#FAFAFA] border-2 border-[#E3DECE] p-4 flex flex-col items-center justify-between shadow-md relative overflow-hidden">
            {/* Stamp decoration */}
            <div className="absolute top-4 right-4 w-12 h-14 border border-foreground/20 flex flex-col items-center justify-center">
              <span className="text-[8px] uppercase tracking-widest text-foreground/40 font-mono">STAMP</span>
            </div>

            <div className="w-full text-left">
              <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-widest font-mono">{collectionNumber}</span>
            </div>
            
            <div className="relative w-48 h-48 my-8">
              <Image 
                src={imageUrl} 
                alt={name} 
                fill 
                className="object-contain drop-shadow-lg"
              />
            </div>

            <div className="w-full text-center pb-4 border-b border-foreground/10 mb-2">
              <h3 className="font-display font-black text-2xl text-foreground uppercase tracking-wider">{name}</h3>
            </div>
            <div className="w-full text-center">
              <span className="text-sm font-bold text-terracotta uppercase tracking-widest">{city}</span>
            </div>
          </div>
        </div>

        {/* Back of Card */}
        <div 
          className="absolute inset-0 backface-hidden bg-[#F5F2EB] border-2 border-terracotta/20 p-6 flex flex-col items-center shadow-lg"
          style={{ transform: "rotateY(180deg)" }}
        >
          <div className="w-full text-center mb-6">
            <Sparkles className="w-5 h-5 text-gold mx-auto mb-2" />
            <h4 className="font-display font-bold text-lg text-foreground">CÂU CHUYỆN</h4>
            <div className="w-8 h-px bg-terracotta mx-auto mt-2"></div>
          </div>

          <p className="text-sm text-foreground-muted font-medium text-center leading-relaxed flex-1">
            {excerpt}
          </p>

          <div className="mt-auto w-full flex flex-col items-center pt-6 border-t border-foreground/10">
            <Link href={`/story-hub/${id}`} className="group w-full flex items-center justify-between p-3 bg-foreground text-white hover:bg-terracotta transition-colors mb-4">
              <span className="text-xs font-bold uppercase tracking-widest">
                ĐỌC CHI TIẾT
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/60">
              Hoặc quét để mở khóa
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
