import { getSupabaseServer } from '@/lib/supabase-server';
import { Plus, Edit2 } from 'lucide-react';
import Link from 'next/link';
import DeleteTeamMemberButton from './DeleteTeamMemberButton';
import Image from 'next/image';

export default async function AdminTeamPage() {
  const supabase = getSupabaseServer();
  const { data: members } = await supabase.from('mm_team_members').select('*').order('display_order', { ascending: true });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-600';
      case 'hidden': return 'bg-orange-100 text-orange-600';
      case 'draft': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Đang hiện';
      case 'hidden': return 'Đang ẩn';
      case 'draft': return 'Bản nháp';
      default: return status;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display font-black text-foreground uppercase tracking-wider">Quản lý Đội ngũ</h1>
        <Link href="/admin/team/new" className="flex items-center gap-2 bg-terracotta text-white px-6 py-3 rounded-full font-bold uppercase tracking-wider hover:bg-terracotta-hover transition-colors">
          <Plus className="w-5 h-5" />
          Thêm thành viên
        </Link>
      </div>

      <div className="bg-white rounded-2xl border-2 border-foreground/10 shadow-[4px_4px_0px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background-alt border-b-2 border-foreground/10 text-sm font-bold text-foreground/60 uppercase tracking-wider">
                <th className="py-4 px-6 w-16">Thứ tự</th>
                <th className="py-4 px-6">Avatar</th>
                <th className="py-4 px-6">Họ tên</th>
                <th className="py-4 px-6">Vai trò</th>
                <th className="py-4 px-6">Ban</th>
                <th className="py-4 px-6">Trạng thái</th>
                <th className="py-4 px-6 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {members?.map((member: any) => (
                <tr key={member.id} className="border-b border-foreground/5 hover:bg-background-alt/50 transition-colors">
                  <td className="py-4 px-6 font-bold text-foreground/50">
                    {member.display_order}
                  </td>
                  <td className="py-4 px-6">
                    <div className="relative w-12 h-12 rounded-full border border-foreground/10 overflow-hidden bg-background-alt">
                      {member.avatar_url ? (
                        <Image src={member.avatar_url} alt={member.full_name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-foreground/40">{member.full_name.charAt(0)}</div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-bold text-foreground">{member.full_name}</div>
                    <div className="text-sm text-foreground-muted">{member.email || member.student_id}</div>
                  </td>
                  <td className="py-4 px-6 text-foreground-muted font-medium">
                    {member.role_title}
                  </td>
                  <td className="py-4 px-6 text-foreground-muted">
                    {member.department}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(member.status)}`}>
                      {getStatusText(member.status)}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/team/${member.id}/edit`} className="inline-block p-2 text-foreground/60 hover:bg-foreground/5 rounded-lg transition-colors" title="Chỉnh sửa">
                        <Edit2 className="w-5 h-5" />
                      </Link>
                      <DeleteTeamMemberButton id={member.id} />
                    </div>
                  </td>
                </tr>
              ))}
              {(!members || members.length === 0) && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-foreground-muted">
                    Chưa có thành viên nào. Hãy thêm thành viên đầu tiên.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
