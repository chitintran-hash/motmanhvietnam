import { getSupabaseServer } from "@/lib/supabase-server";
import TeamMemberCard from "@/components/ui/TeamMemberCard";

export default async function TeamSection() {
  const supabase = getSupabaseServer();
  const { data: teamMembers } = await supabase
    .from("mm_team_members")
    .select("*")
    .eq("status", "active")
    .order("display_order", { ascending: true })
    .limit(9); // Limit to 9 members on the homepage

  if (!teamMembers || teamMembers.length === 0) {
    return null; // Don't show team section on homepage if there are no members
  }

  return (
    <section className="py-32 bg-background relative overflow-hidden">
      {/* Decorative texture overlay */}
      <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml,%3Csvg viewBox=\\'0 0 200 200\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cfilter id=\\'noiseFilter\\'%3E%3CfeTurbulence type=\\'fractalNoise\\' baseFrequency=\\'0.85\\' numOctaves=\\'3\\' stitchTiles=\\'stitch\\'/%3E%3C/filter%3E%3Crect width=\\'100%25\\' height=\\'100%25\\' filter=\\'url(%23noiseFilter)\\'/%3E%3C/svg%3E')]"></div>
      
      <div className="container mx-auto px-6 max-w-[1400px] relative z-10">
        <div className="text-center mb-20 max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-px bg-terracotta"></div>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-terracotta">
              ĐỘI NGŨ
            </span>
            <div className="w-8 h-px bg-terracotta"></div>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-display font-black mb-8 uppercase tracking-tighter text-foreground leading-[1.15]">
            NHỮNG NGƯỜI<br/> 
            GHÉP NÊN <span className="text-terracotta">MỘT MẢNH</span>
          </h2>
          
          <p className="text-foreground-muted text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
            Mỗi thành viên mang đến một góc nhìn, kỹ năng và câu chuyện khác nhau để cùng tạo nên MỘT MẢNH VIỆT NAM.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <TeamMemberCard key={member.id} member={member} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
