import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "outline" | "retro";
  className?: string;
}

export default function Badge({ children, variant = "primary", className = "" }: BadgeProps) {
  const baseStyle = "inline-flex items-center justify-center px-3 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-widest rounded-full transition-all";
  
  const variants = {
    primary: "bg-terracotta text-white shadow-sm",
    outline: "bg-transparent border border-foreground/20 text-foreground-muted",
    retro: "bg-[#E3DECE] text-[#4B4942] border border-[#7D796F]/30 shadow-[2px_2px_0px_rgba(75,73,66,0.1)]",
  };

  return (
    <span className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
