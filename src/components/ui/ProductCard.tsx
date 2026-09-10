import React from "react";
import Image from "next/image";
import Link from "next/link";
import Badge from "./Badge";
import { ArrowRight } from "lucide-react";

interface ProductCardProps {
  slug: string;
  name: string;
  city: string;
  collectionNumber: string;
  price: string;
  imageUrl: string;
  isNew?: boolean;
}

export default function ProductCard({ slug, name, city, collectionNumber, price, imageUrl, isNew }: ProductCardProps) {
  return (
    <Link href={`/collection/${slug}`} className="group block">
      <div className="bg-[#FAFAFA] border border-foreground/10 p-4 sm:p-6 rounded-sm shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] transition-all duration-500 relative flex flex-col h-full overflow-hidden group-hover:-translate-y-1">
        {/* Archive Label styling on top left */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-terracotta via-orange to-gold opacity-80"></div>
        
        <div className="flex justify-between items-start mb-6">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest font-mono">{collectionNumber}</span>
            <span className="text-xs font-semibold text-terracotta uppercase tracking-wider">{city}</span>
          </div>
          {isNew && <Badge variant="retro">NEW</Badge>}
        </div>

        {/* Image Area */}
        <div className="relative w-full aspect-square mb-8 bg-background-alt/50 rounded-sm overflow-hidden flex items-center justify-center p-4">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E')]"></div>
          <div className="relative w-full h-full transform group-hover:scale-105 transition-transform duration-700 ease-out">
            <Image 
              src={imageUrl} 
              alt={name} 
              fill 
              className="object-contain drop-shadow-md"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </div>

        {/* Details Area */}
        <div className="flex flex-col flex-1">
          <h3 className="font-display font-bold text-2xl mb-1 text-foreground">{name}</h3>
          <div className="w-8 h-0.5 bg-foreground/20 mb-4 group-hover:bg-terracotta transition-colors"></div>
          <p className="text-foreground-muted font-medium mb-6 flex-1">{price}</p>
          
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground group-hover:text-terracotta transition-colors mt-auto">
            Khám phá
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}
