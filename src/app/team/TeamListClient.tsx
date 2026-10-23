"use client";

import TeamMemberCard from "@/components/ui/TeamMemberCard";
import { useLanguage } from "@/context/LanguageContext";

export default function TeamListClient({ teamMembers }: { teamMembers: any[] }) {
  const { t } = useLanguage();

  return (
    <>
      <div className="mb-16">
        <div className="inline-flex items-center gap-3 mb-6">
          <div className="w-8 h-px bg-terracotta"></div>
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-terracotta">
            {t("team.badge", "THE ARCHITECTS")}
          </span>
        </div>
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-black text-foreground mb-6 uppercase tracking-tighter leading-[1.3]">
          {t("team.title", "ĐỘI NGŨ MỘT MẢNH VIỆT NAM")}
        </h1>
        <p className="text-foreground-muted font-medium leading-relaxed text-lg max-w-2xl border-l-2 border-foreground/10 pl-6">
          {t("team.subtitle", "Mỗi thành viên mang đến một góc nhìn, kỹ năng và câu chuyện khác nhau để cùng tạo nên MỘT MẢNH VIỆT NAM. Khám phá những người đứng sau dự án.")}
        </p>
      </div>

      {(!teamMembers || teamMembers.length === 0) ? (
        <div className="py-32 text-center border-2 border-dashed border-foreground/20 rounded-2xl bg-white shadow-[8px_8px_0px_rgba(42,42,39,0.1)]">
          <p className="text-xl md:text-2xl font-bold text-foreground/50 uppercase tracking-widest font-display">
            {t("team.updating", "Đội ngũ đang được cập nhật.")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
          {teamMembers.map((member, index) => (
            <TeamMemberCard key={member.id} member={member} index={index} />
          ))}
        </div>
      )}
    </>
  );
}
