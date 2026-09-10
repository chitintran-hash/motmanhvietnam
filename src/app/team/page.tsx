import { getSupabaseServer } from '@/lib/supabase-server';
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import TeamListClient from './TeamListClient';

export const revalidate = 0;

export default async function TeamHubPage() {
  const supabase = getSupabaseServer();
  const { data: teamMembers } = await supabase
    .from('mm_team_members')
    .select('*')
    .eq('status', 'active')
    .order('display_order', { ascending: true });

  return (
    <div className="min-h-screen pt-32 pb-24 relative overflow-hidden bg-background">
      {/* Decorative texture overlay */}
      <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml,%3Csvg viewBox=\\'0 0 200 200\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cfilter id=\\'noiseFilter\\'%3E%3CfeTurbulence type=\\'fractalNoise\\' baseFrequency=\\'0.85\\' numOctaves=\\'3\\' stitchTiles=\\'stitch\\'/%3E%3C/filter%3E%3Crect width=\\'100%25\\' height=\\'100%25\\' filter=\\'url(%23noiseFilter)\\'/%3E%3C/svg%3E')] -z-10"></div>
      
      <div className="container mx-auto px-6 max-w-[1400px] relative z-10">
        <div className="mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-terracotta"></div>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-terracotta">
              THE ARCHITECTS
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-black text-foreground mb-6 uppercase tracking-tighter leading-[1.3]">
            ĐỘI NGŨ<br/>MỘT MẢNH VIỆT NAM
          </h1>
          <p className="text-foreground-muted font-medium leading-relaxed text-lg max-w-2xl border-l-2 border-foreground/10 pl-6">
            Mỗi thành viên mang đến một góc nhìn, kỹ năng và câu chuyện khác nhau để cùng tạo nên MỘT MẢNH VIỆT NAM. Khám phá những người đứng sau dự án.
          </p>
        </div>

        <TeamListClient teamMembers={teamMembers || []} />
      </div>
    </div>
  );
}
