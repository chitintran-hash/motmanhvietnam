import { getSupabaseServer } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, User, Briefcase, Award, Zap, Link as LinkIcon, Globe } from 'lucide-react';

export default async function TeamMemberDetailPage({ params }: { params: { slug: string } }) {
  const supabase = getSupabaseServer();
  
  const { data: member } = await supabase
    .from('mm_team_members')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (!member || member.status !== 'active') {
    notFound();
  }

  const skills = member.skills || [];
  const achievements = member.achievements || [];

  return (
    <div className="min-h-screen pt-32 pb-24 relative bg-[#F5F2EB]">
      {/* Decorative texture overlay */}
      <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml,%3Csvg viewBox=\\'0 0 200 200\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cfilter id=\\'noiseFilter\\'%3E%3CfeTurbulence type=\\'fractalNoise\\' baseFrequency=\\'0.85\\' numOctaves=\\'3\\' stitchTiles=\\'stitch\\'/%3E%3C/filter%3E%3Crect width=\\'100%25\\' height=\\'100%25\\' filter=\\'url(%23noiseFilter)\\'/%3E%3C/svg%3E')] mix-blend-overlay pointer-events-none"></div>
      
      <div className="container mx-auto px-6 max-w-[1200px] relative z-10">
        
        {/* Navigation */}
        <div className="mb-12 flex justify-between items-center">
          <Link href="/team" className="inline-flex items-center gap-3 p-3 bg-white border border-foreground/10 rounded-full hover:bg-terracotta hover:text-white hover:border-terracotta transition-colors group shadow-sm">
            <ArrowLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold uppercase tracking-wider text-sm pr-2">Quay lại Đội ngũ</span>
          </Link>
          <div className="text-xs font-mono font-bold text-foreground/40 uppercase tracking-widest bg-white px-4 py-2 border border-foreground/10">
            RECORD_NO_0{member.display_order}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Column: Avatar & Quick Info */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white border-2 border-foreground shadow-[8px_8px_0px_rgba(42,42,39,1)] p-4 relative">
              <div className="absolute top-0 right-0 w-8 h-8 border-l-2 border-b-2 border-foreground/10 bg-[#F5F2EB]"></div>
              
              <div className="relative w-full aspect-[3/4] bg-[#F5F2EB] border border-foreground/10 overflow-hidden mb-6 flex items-center justify-center">
                {member.avatar_url ? (
                  <Image src={member.avatar_url} alt={member.full_name} fill className="object-cover" />
                ) : (
                  <User className="w-32 h-32 text-foreground/20" />
                )}
              </div>

              <div className="text-center space-y-2">
                <h1 className="text-3xl md:text-4xl font-display font-black text-foreground uppercase tracking-wider">{member.full_name}</h1>
                <p className="text-lg font-bold text-terracotta uppercase tracking-widest">{member.role_title}</p>
                {member.department && (
                  <div className="inline-block mt-4 px-4 py-2 bg-foreground text-white text-xs font-bold uppercase tracking-widest">
                    Ban: {member.department}
                  </div>
                )}
              </div>
            </div>

            {/* Social Links & Contact */}
            <div className="bg-white border-2 border-foreground/10 p-6 flex flex-col gap-4">
              <h3 className="font-bold uppercase tracking-widest text-foreground/60 text-sm mb-2 border-b border-foreground/10 pb-2">Liên Hệ & Mạng Xã Hội</h3>
              
              {member.email && (
                <div className="flex items-center gap-3 text-foreground-muted text-sm font-medium">
                  <div className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center text-foreground/50">@</div>
                  {member.email}
                </div>
              )}
              
              {member.student_id && (
                <div className="flex items-center gap-3 text-foreground-muted text-sm font-medium">
                  <div className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center text-foreground/50">ID</div>
                  {member.student_id}
                </div>
              )}

              <div className="flex items-center gap-3 mt-2">
                {member.facebook_url && (
                  <a href={member.facebook_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-foreground/10 flex items-center justify-center hover:bg-terracotta hover:text-white hover:border-terracotta transition-colors" title="Facebook">
                    <Globe className="w-5 h-5" />
                  </a>
                )}
                {member.instagram_url && (
                  <a href={member.instagram_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-foreground/10 flex items-center justify-center hover:bg-terracotta hover:text-white hover:border-terracotta transition-colors" title="Instagram">
                    <LinkIcon className="w-5 h-5" />
                  </a>
                )}
                {member.portfolio_url && (
                  <a href={member.portfolio_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-foreground/10 flex items-center justify-center hover:bg-terracotta hover:text-white hover:border-terracotta transition-colors flex-1 gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Xem Portfolio</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Cover Image */}
            {member.cover_image_url && (
              <div className="relative w-full h-48 md:h-64 border-2 border-foreground shadow-[8px_8px_0px_rgba(42,42,39,1)] overflow-hidden bg-white">
                <Image src={member.cover_image_url} alt={`${member.full_name} cover`} fill className="object-cover" />
              </div>
            )}

            {/* Bio Section */}
            {member.bio && (
              <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:font-black prose-headings:uppercase prose-p:text-foreground-muted prose-p:leading-relaxed">
                <h2 className="text-2xl border-l-4 border-terracotta pl-4 flex items-center gap-3">
                  <User className="w-6 h-6 text-terracotta" />
                  Hồ Sơ Cá Nhân
                </h2>
                <div className="bg-white p-8 border border-foreground/10 relative">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-foreground/20"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-foreground/20"></div>
                  <p className="whitespace-pre-wrap m-0 font-medium">{member.bio}</p>
                </div>
              </div>
            )}

            {/* Contribution Section */}
            {member.contribution && (
              <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:font-black prose-headings:uppercase prose-p:text-foreground-muted prose-p:leading-relaxed">
                <h2 className="text-2xl border-l-4 border-[#C1531A] pl-4 flex items-center gap-3">
                  <Briefcase className="w-6 h-6 text-[#C1531A]" />
                  Đóng Góp Trong Dự Án
                </h2>
                <div className="bg-white p-8 border border-foreground/10 relative">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-foreground/20"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-foreground/20"></div>
                  <p className="whitespace-pre-wrap m-0 font-medium">{member.contribution}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Achievements */}
              {achievements.length > 0 && (
                <div>
                  <h2 className="text-xl font-display font-black uppercase tracking-wider mb-6 flex items-center gap-3 text-foreground border-b border-foreground/10 pb-4">
                    <Award className="w-6 h-6 text-[#8C2E24]" />
                    Thành Tựu & Sản Phẩm
                  </h2>
                  <ul className="space-y-4">
                    {achievements.map((item: string, index: number) => (
                      <li key={index} className="flex items-start gap-4 p-4 bg-white border border-foreground/10 shadow-sm">
                        <span className="font-mono text-xs font-bold text-foreground/40 mt-1">0{index+1}</span>
                        <span className="font-medium text-foreground-muted leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Skills */}
              {skills.length > 0 && (
                <div>
                  <h2 className="text-xl font-display font-black uppercase tracking-wider mb-6 flex items-center gap-3 text-foreground border-b border-foreground/10 pb-4">
                    <Zap className="w-6 h-6 text-[#5E322F]" />
                    Kỹ Năng & Chuyên Môn
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {skills.map((skill: string, index: number) => (
                      <div key={index} className="px-4 py-3 bg-white border border-foreground/20 text-sm font-bold uppercase tracking-widest text-foreground hover:bg-foreground hover:text-white transition-colors cursor-default shadow-sm">
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
