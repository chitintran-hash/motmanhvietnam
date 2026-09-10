"use client";

import TeamMemberCard from "@/components/ui/TeamMemberCard";

export default function TeamListClient({ teamMembers }: { teamMembers: any[] }) {
  if (!teamMembers || teamMembers.length === 0) {
    return (
      <div className="py-32 text-center border-2 border-dashed border-foreground/20 rounded-2xl bg-white shadow-[8px_8px_0px_rgba(42,42,39,0.1)]">
        <p className="text-xl md:text-2xl font-bold text-foreground/50 uppercase tracking-widest font-display">
          Đội ngũ đang được cập nhật.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
      {teamMembers.map((member, index) => (
        <TeamMemberCard key={member.id} member={member} index={index} />
      ))}
    </div>
  );
}
