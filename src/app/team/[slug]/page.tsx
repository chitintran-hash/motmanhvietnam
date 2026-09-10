import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight, Link2, Mail } from "lucide-react";
import { teamMembers } from "../page";

export default async function TeamMemberPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Find member or use placeholder
  const member = teamMembers.find(m => m.id === slug) || teamMembers[0];
  
  // Dummy data for skills and projects
  const skills = ["Visual Design", "Brand Identity", "Illustration", "UI/UX", "Art Direction"];
  const projects = [
    { name: "Concept Art Mảnh Sài Gòn", year: "2027" },
    { name: "Bao bì Blind Box Mùa 1", year: "2026" },
    { name: "Digital Map UI Redesign", year: "2026" }
  ];

  return (
    <div className="min-h-screen pt-32 pb-24 relative bg-background">
      {/* Decorative texture overlay */}
      <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml,%3Csvg viewBox=\\'0 0 200 200\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cfilter id=\\'noiseFilter\\'%3E%3CfeTurbulence type=\\'fractalNoise\\' baseFrequency=\\'0.85\\' numOctaves=\\'3\\' stitchTiles=\\'stitch\\'/%3E%3C/filter%3E%3Crect width=\\'100%25\\' height=\\'100%25\\' filter=\\'url(%23noiseFilter)\\'/%3E%3C/svg%3E')] pointer-events-none"></div>

      <div className="container mx-auto px-6 max-w-[1200px] relative z-10">
        <Link href="/team" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground-muted hover:text-terracotta transition-colors mb-12 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Quay lại Đội Ngũ
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Visual */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-32">
              <div className="w-full aspect-[4/5] bg-[#F5F2EB] border-2 border-foreground p-8 shadow-[12px_12px_0px_rgba(42,42,39,1)] relative flex items-center justify-center">
                {/* Stamp */}
                <div className="absolute top-4 right-4 w-12 h-12 border border-terracotta/30 flex items-center justify-center rotate-12">
                  <span className="text-[8px] uppercase tracking-widest text-terracotta font-mono">CONFIDENTIAL</span>
                </div>
                
                <Image 
                  src={member.image} 
                  alt={member.name} 
                  fill 
                  className="object-contain p-8 drop-shadow-xl"
                />
              </div>

              <div className="mt-8 flex justify-center gap-6">
                <a href="#" className="p-3 border border-foreground/10 hover:border-terracotta text-foreground/40 hover:text-terracotta transition-colors bg-[#FAFAFA]">
                  <Link2 className="w-5 h-5" />
                </a>
                <a href="#" className="p-3 border border-foreground/10 hover:border-terracotta text-foreground/40 hover:text-terracotta transition-colors bg-[#FAFAFA]">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Info */}
          <div className="lg:col-span-7 flex flex-col pt-4">
            <div className="mb-12">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-6 h-px bg-terracotta"></div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-terracotta">HỒ SƠ CÁ NHÂN</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-black text-foreground uppercase tracking-tighter mb-4 leading-none">
                {member.name}
              </h1>
              <p className="text-xl md:text-2xl font-serif text-foreground-muted italic">
                {member.role}
              </p>
            </div>

            <div className="space-y-12">
              {/* Giới thiệu */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/40 mb-6 font-mono border-b border-foreground/10 pb-2">
                  Giới thiệu
                </h3>
                <p className="text-lg leading-relaxed text-foreground font-medium">
                  {member.shortDesc} Đây là phần nội dung giới thiệu chi tiết về thành viên. Họ là ai, họ làm gì và nguồn cảm hứng của họ từ đâu. Mỗi một góc nhìn của {member.name} đều đóng góp vào sự hoàn thiện của bức tranh Một Mảnh Việt Nam.
                </p>
              </div>

              {/* Kỹ năng */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/40 mb-6 font-mono border-b border-foreground/10 pb-2">
                  Chuyên môn
                </h3>
                <div className="flex flex-wrap gap-3">
                  {skills.map(skill => (
                    <span key={skill} className="px-4 py-2 bg-[#FAFAFA] border border-foreground/10 text-sm font-bold text-foreground">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Dự án / Đóng góp */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/40 mb-6 font-mono border-b border-foreground/10 pb-2">
                  Đóng góp dự án
                </h3>
                <ul className="space-y-4">
                  {projects.map((proj, idx) => (
                    <li key={idx} className="flex justify-between items-center group cursor-pointer p-4 bg-[#FAFAFA] border border-transparent hover:border-foreground/10 transition-colors">
                      <span className="font-bold text-foreground group-hover:text-terracotta transition-colors">{proj.name}</span>
                      <div className="flex items-center gap-4 text-sm text-foreground-muted">
                        <span className="font-mono">{proj.year}</span>
                        <ArrowUpRight className="w-4 h-4 text-foreground/20 group-hover:text-terracotta transition-colors" />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
