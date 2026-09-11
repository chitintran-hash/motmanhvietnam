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
          <div className={`w-full h-full bg-cream border-4 ${borderColor} p-4 flex flex-col items-center justify-between shadow-xl relative overflow-hidden`}>
            {/* Stamp decoration */}
            <div className={`absolute top-4 right-4 w-12 h-14 border-2 ${borderColor} flex flex-col items-center justify-center bg-beige/30`}>
              <span className={`text-[8px] font-bold uppercase tracking-widest ${textColor} font-mono`}>STAMP</span>
            </div>

            <div className="w-full text-left">
              <span className={`text-[10px] font-bold ${textColor} uppercase tracking-widest font-mono`}>{collectionNumber}</span>
            </div>
            
            <div className="relative w-48 h-48 my-8">
              <Image 
                src={imageUrl} 
                alt={name} 
                fill 
                className="object-contain drop-shadow-xl"
              />
            </div>

            <div className={`w-full text-center pb-4 border-b-2 ${borderColor} mb-2`}>
              <h3 className={`font-display font-black text-2xl ${textColor} uppercase tracking-wider`}>{name}</h3>
            </div>
            <div className="w-full text-center flex justify-between items-center">
              <div className={`px-2 py-1 ${primaryColor} text-cream text-[10px] font-bold uppercase tracking-widest`}>
                 STORY CARD
              </div>
              <span className={`text-sm font-black ${textColor} uppercase tracking-widest`}>{city}</span>
            </div>
          </div>
        </div>

        {/* Back of Card */}
        <div 
          className={`absolute inset-0 backface-hidden bg-beige border-4 ${borderColor} p-6 flex flex-col items-center shadow-xl`}
          style={{ transform: "rotateY(180deg)" }}
        >
          <div className="w-full text-center mb-6">
            <Sparkles className={`w-5 h-5 ${textColor} mx-auto mb-2`} />
            <h4 className={`font-display font-black text-lg ${textColor}`}>CÂU CHUYỆN</h4>
            <div className={`w-8 h-1 ${primaryColor} mx-auto mt-2`}></div>
          </div>

          <p className={`text-sm ${textColor} font-bold text-center leading-relaxed flex-1`}>
            {excerpt}
          </p>

          <div className={`mt-auto w-full flex flex-col items-center pt-6 border-t-2 ${borderColor}`}>
            <Link href={`/story-hub/${id}`} className={`group w-full flex items-center justify-between p-3 ${primaryColor} text-cream transition-colors mb-4`}>
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
