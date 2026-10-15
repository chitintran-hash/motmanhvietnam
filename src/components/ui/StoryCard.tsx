"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { QrCode, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

interface StoryCardProps {
  id?: string;
  city: string;
  name: string;
  collectionNumber: string;
  imageUrl: string;
  excerpt: string;
  heartsCount?: number;
  likesCount?: number;
  dislikesCount?: number;
}

export default function StoryCard({ 
  id = "hanoi-01", 
  city, 
  name, 
  collectionNumber, 
  imageUrl, 
  excerpt,
  heartsCount = 0,
  likesCount = 0,
  dislikesCount = 0
}: StoryCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const totalReactions = (heartsCount || 0) + (likesCount || 0) + (dislikesCount || 0);

  let primaryColor = "bg-primary-red";
  let textColor = "text-primary-red";
  let borderColor = "border-primary-red";
  
  if (city === "Hà Nội") {
    primaryColor = "bg-primary-green";
    textColor = "text-primary-green";
    borderColor = "border-primary-green";
  } else if (city === "Sài Gòn") {
    primaryColor = "bg-primary-red";
    textColor = "text-primary-red";
    borderColor = "border-primary-red";
  } else if (city === "Đà Nẵng" || city === "Hội An") {
    primaryColor = "bg-orange";
    textColor = "text-orange";
    borderColor = "border-orange";
  }

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
          <div className={`w-full h-full bg-cream border-4 ${borderColor} p-3 flex flex-col justify-between shadow-xl relative overflow-hidden`}>
            
            {/* Top: 16:9 Artwork frame */}
            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-foreground/5 border border-foreground/10 shrink-0">
              <Image 
                src={imageUrl} 
                alt={name} 
                fill 
                sizes="(max-width: 768px) 100vw, 320px"
                className="object-cover"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
                priority
              />
            </div>

            {/* Middle: Full Title wrapping down naturally without ellipsis */}
            <div className="flex-1 flex flex-col justify-center items-center py-2 px-1 text-center">
              <h3 className={`font-display font-black text-base md:text-lg leading-snug ${textColor} uppercase tracking-wider text-balance`}>
                {name}
              </h3>
            </div>

            {/* Bottom: Divider line, Author/ID & City, Reactions */}
            <div className="w-full shrink-0">
              <div className={`w-full border-t-2 ${borderColor} pt-2 mb-1.5 flex justify-between items-center`}>
                <span className={`text-xs font-bold ${textColor} uppercase tracking-widest truncate max-w-[130px]`}>
                  {id.replace(/[-_]/g, ' ')}
                </span>
                <span className={`text-sm font-black ${textColor} uppercase tracking-widest`}>
                  {city}
                </span>
              </div>

              {/* Reactions row */}
              <div className="w-full flex items-center justify-between pt-1.5 border-t border-foreground/10 text-[11px] font-bold">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-red-500">
                    ❤️ {heartsCount.toLocaleString('vi-VN')}
                  </span>
                  <span className="flex items-center gap-1 text-emerald-600">
                    👍 {likesCount.toLocaleString('vi-VN')}
                  </span>
                  {dislikesCount > 0 && (
                    <span className="flex items-center gap-1 text-foreground/50">
                      👎 {dislikesCount.toLocaleString('vi-VN')}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-foreground/50 font-medium">
                  {totalReactions.toLocaleString('vi-VN')} tương tác
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Back of Card */}
        <div 
          className={`absolute inset-0 backface-hidden bg-beige border-4 ${borderColor} p-6 flex flex-col items-center justify-between shadow-xl`}
          style={{ transform: "rotateY(180deg)" }}
        >
          <div className="w-full text-center mb-2 shrink-0">
            <Sparkles className={`w-5 h-5 ${textColor} mx-auto mb-2`} />
            <h4 className={`font-display font-black text-lg ${textColor}`}>CÂU CHUYỆN</h4>
            <div className={`w-8 h-1 ${primaryColor} mx-auto mt-2`}></div>
          </div>

          <p className={`text-sm ${textColor} font-bold text-center leading-relaxed flex-1 overflow-y-auto my-3 pr-1`}>
            {excerpt || "Bấm đọc chi tiết để khám phá câu chuyện đầy đủ..."}
          </p>

          <div className="w-full flex items-center justify-center gap-3 py-2 my-2 bg-foreground/5 rounded-lg text-xs font-bold shrink-0">
            <span className="text-red-500">❤️ {heartsCount}</span>
            <span className="text-emerald-600">👍 {likesCount}</span>
            <span className="text-foreground/50">👎 {dislikesCount}</span>
          </div>

          <div className={`w-full flex flex-col items-center pt-4 border-t-2 ${borderColor} shrink-0`}>
            <Link 
              href={`/story-hub/${id}`} 
              className={`group w-full flex items-center justify-between p-3 ${primaryColor} text-cream transition-colors mb-3 rounded-sm`}
              onClick={() => trackEvent('click_story_card', { story_id: id })}
            >
              <span className="text-xs font-bold uppercase tracking-widest">
                ĐỌC CHI TIẾT
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <span className={`text-[10px] font-bold uppercase tracking-widest ${textColor}`}>
              Hoặc quét để mở khóa
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
