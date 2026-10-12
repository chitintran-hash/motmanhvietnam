"use client";
import { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  mainImage: string;
  additionalImages?: string[];
}

export default function ProductGallery({ mainImage, additionalImages = [] }: ProductGalleryProps) {
  // Build images array. First is always the Blind Box (main image).
  // Following are the pieces inside (from DB).
  const galleryImages = [
    { src: mainImage, label: "HỘP BLIND BOX" },
    ...additionalImages.map((img, idx) => ({
      src: img,
      label: `MẢNH SƯU TẦM ${idx + 1}`
    }))
  ];
  
  const [images] = useState(galleryImages);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Main Image Frame */}
      <div className="relative w-full aspect-square bg-[#FAFAFA] border-2 border-foreground/10 p-8 shadow-xl flex items-center justify-center transition-all duration-300">
        <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E')]"></div>
        <div className="absolute top-4 left-4">
          <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest font-mono">COLL_01</span>
        </div>
        
        {/* Info label for current piece overlay */}
        <div className="absolute bottom-4 left-0 w-full text-center z-10">
          <span className="inline-block bg-background/90 backdrop-blur-sm px-4 py-1.5 border border-foreground/10 shadow-sm text-xs font-bold uppercase tracking-wider text-foreground">
            {images[activeIndex].label}
          </span>
        </div>

        <div className="relative w-[80%] h-[80%]">
          <Image 
            src={images[activeIndex].src}
            alt={images[activeIndex].label}
            fill
            className="object-contain drop-shadow-2xl transition-opacity duration-300"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
      </div>

      {/* Thumbnails Row */}
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
        {images.map((img, idx) => (
          <button 
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`relative aspect-square border-2 transition-all duration-200 overflow-hidden bg-[#FAFAFA] shadow-sm hover:shadow-md ${activeIndex === idx ? 'border-terracotta opacity-100 scale-105' : 'border-foreground/10 opacity-60 hover:opacity-100'}`}
          >
            <Image 
              src={img.src}
              alt={img.label}
              fill
              className="object-cover"
              sizes="100px"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
