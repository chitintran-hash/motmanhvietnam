"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, User } from "lucide-react";

export default function TeamMemberCard({ member, index }: { member: any, index: number }) {
  const colors = ["bg-primary-red", "bg-primary-green", "bg-orange", "bg-teal"];
  const textColors = ["text-primary-red", "text-primary-green", "text-orange", "text-teal"];
  const colorIndex = index % colors.length;
  const bgColor = colors[colorIndex];
  const textColor = textColors[colorIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="bg-cream border-4 border-foreground p-6 shadow-[8px_8px_0px_rgba(42,42,39,1)] hover:shadow-[4px_4px_0px_rgba(42,42,39,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all flex flex-col group relative"
    >
      <div className="absolute top-4 right-4 w-10 h-10 border border-foreground/20 rounded-full flex items-center justify-center font-serif italic text-foreground/40 text-sm">
        0{index + 1}
      </div>
      
      <div className={`relative w-full aspect-square mb-6 ${bgColor} border-2 border-foreground flex items-center justify-center overflow-hidden shadow-inner`}>
        {member.avatar_url ? (
          <Image src={member.avatar_url} alt={member.full_name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-cream group-hover:scale-110 transition-transform duration-500">
            <span className="font-display font-black text-8xl opacity-80">{member.full_name.charAt(0)}</span>
          </div>
        )}
      </div>
      
      <div className="flex-1 flex flex-col">
        <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest font-mono mb-2">
          ARCHIVE_NO_0{index + 1}
        </span>
        <h3 className="font-display font-black text-3xl text-foreground uppercase tracking-wider mb-2">
          {member.full_name}
        </h3>
        <p className={`text-sm font-bold uppercase tracking-widest mb-4 ${textColor}`}>
          {member.role_title}
        </p>
        <div className="w-12 h-px bg-foreground/20 mb-4"></div>
        <p className="text-foreground-muted font-medium mb-8 flex-1 leading-relaxed">
          {member.short_description || member.department}
        </p>
        
        <Link href={`/team/${member.slug}`} className={`group/link flex items-center justify-between w-full p-4 border-2 border-foreground bg-white hover:${bgColor} transition-colors mt-auto`}>
          <span className="text-xs font-bold uppercase tracking-widest text-foreground group-hover/link:text-cream transition-colors">
            HỒ SƠ CHI TIẾT
          </span>
          <ArrowRight className="w-5 h-5 text-foreground group-hover/link:text-cream transform group-hover/link:translate-x-1 transition-all" />
        </Link>
      </div>
    </motion.div>
  );
}
