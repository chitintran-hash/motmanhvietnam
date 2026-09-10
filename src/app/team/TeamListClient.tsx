"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, User } from "lucide-react";

export default function TeamListClient({ teamMembers }: { teamMembers: any[] }) {
  if (!teamMembers || teamMembers.length === 0) {
    return (
      <div className="py-20 text-center border-2 border-dashed border-foreground/20 rounded-2xl">
        <p className="text-xl font-bold text-foreground/50 uppercase tracking-widest">Đang cập nhật hồ sơ...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
      {teamMembers.map((member, index) => (
        <motion.div
          key={member.id}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          className="bg-[#FAFAFA] border-2 border-foreground p-6 shadow-[8px_8px_0px_rgba(42,42,39,1)] hover:shadow-[4px_4px_0px_rgba(42,42,39,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all flex flex-col group relative"
        >
          <div className="absolute top-4 right-4 w-10 h-10 border border-foreground/20 rounded-full flex items-center justify-center font-serif italic text-foreground/40 text-sm">
            0{index + 1}
          </div>
          
          <div className="relative w-full aspect-square mb-6 bg-[#F5F2EB] border border-foreground/10 flex items-center justify-center overflow-hidden">
            {member.avatar_url ? (
              <Image src={member.avatar_url} alt={member.full_name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-foreground/20 group-hover:scale-105 transition-transform duration-500">
                <User className="w-24 h-24 mb-4" />
                <span className="font-serif italic">{member.full_name.charAt(0)}</span>
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
            <p className="text-sm font-bold text-terracotta uppercase tracking-widest mb-4">
              {member.role_title}
            </p>
            <div className="w-12 h-px bg-foreground/20 mb-4"></div>
            <p className="text-foreground-muted font-medium mb-8 flex-1 leading-relaxed">
              {member.short_description || member.department}
            </p>
            
            <Link href={`/team/${member.slug}`} className="group/link flex items-center justify-between w-full p-4 border border-foreground/10 hover:border-terracotta bg-white transition-colors mt-auto">
              <span className="text-xs font-bold uppercase tracking-widest text-foreground group-hover/link:text-terracotta transition-colors">
                HỒ SƠ CHI TIẾT
              </span>
              <ArrowRight className="w-5 h-5 text-foreground/40 group-hover/link:text-terracotta transform group-hover/link:translate-x-1 transition-all" />
            </Link>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
