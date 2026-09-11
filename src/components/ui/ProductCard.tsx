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
  let primaryColor = "bg-primary-red";
  let secondaryColor = "bg-yellow";
  let textColor = "text-primary-red";
  let borderColor = "border-primary-red";
  let hoverColor = "group-hover:bg-primary-red";
  
  if (city === "Hà Nội") {
    primaryColor = "bg-primary-green";
    secondaryColor = "bg-yellow";
    textColor = "text-primary-green";
    borderColor = "border-primary-green";
    hoverColor = "group-hover:bg-primary-green";
  } else if (city === "Sài Gòn") {
    primaryColor = "bg-primary-red";
    secondaryColor = "bg-teal";
    textColor = "text-primary-red";
    borderColor = "border-primary-red";
    hoverColor = "group-hover:bg-primary-red";
  } else if (city === "Đà Nẵng") {
    primaryColor = "bg-orange";
    secondaryColor = "bg-navy";
    textColor = "text-orange";
    borderColor = "border-orange";
    hoverColor = "group-hover:bg-orange";
  }

  return (
    <Link href={`/collection/${slug}`} className="group block">
      <div className={`bg-cream border-4 ${borderColor} p-4 sm:p-6 shadow-[8px_8px_0px_rgba(42,42,39,1)] hover:shadow-[4px_4px_0px_rgba(42,42,39,1)] transition-all duration-300 relative flex flex-col h-full hover:translate-x-1 hover:translate-y-1`}>
        
        <div className="flex justify-between items-start mb-6">
          <div className="flex flex-col gap-1">
            <div className={`inline-block px-2 py-1 ${primaryColor} text-cream text-[10px] font-bold uppercase tracking-widest self-start mb-2`}>
              BLIND BOX
            </div>
            <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest font-mono">{collectionNumber}</span>
            <span className={`text-xs font-black uppercase tracking-wider ${textColor}`}>{city}</span>
          </div>
          {isNew && <div className={`${secondaryColor} px-2 py-1 text-[10px] font-black uppercase tracking-widest border-2 border-foreground`}>NEW</div>}
        </div>

        {/* Image Area */}
        <div className={`relative w-full aspect-square mb-8 bg-white border-2 border-foreground/10 flex items-center justify-center p-6 relative overflow-hidden`}>
          <div className={`absolute top-0 right-0 w-12 h-12 ${secondaryColor} opacity-20 rounded-bl-full`}></div>
          <div className="relative w-full h-full transform group-hover:scale-110 transition-transform duration-500 ease-out">
            <Image 
              src={imageUrl} 
              alt={name} 
              fill 
              className="object-contain drop-shadow-xl"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </div>

        {/* Details Area */}
        <div className="flex flex-col flex-1">
          <h3 className={`font-display font-black text-2xl mb-2 ${textColor}`}>{name}</h3>
          <div className={`w-12 h-1 ${primaryColor} mb-4 transition-colors`}></div>
          <p className="text-foreground font-bold mb-6 flex-1 text-lg">{price}</p>
          
          <div className={`flex items-center justify-between w-full border-t-2 border-foreground/10 pt-4`}>
            <span className={`text-xs font-bold uppercase tracking-widest ${textColor}`}>
              Khám phá
            </span>
            <div className={`w-8 h-8 rounded-full border-2 ${borderColor} flex items-center justify-center ${hoverColor} group-hover:text-cream transition-colors ${textColor}`}>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
