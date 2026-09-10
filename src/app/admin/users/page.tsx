import { getSupabaseServer } from '@/lib/supabase-server';
import { ShieldAlert } from 'lucide-react';
import DeleteUserButton from './DeleteUserButton';

export default async function AdminUsersPage() {
  const supabase = getSupabaseServer();
  const { data: users, error } = await supabase.from('mm_profiles').select('*').order('created_at', { ascending: false });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display font-black text-foreground uppercase tracking-wider">Quản lý người dùng</h1>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6 flex items-center gap-3">
          <ShieldAlert className="w-5 h-5" />
          {error.message}
        </div>
      )}

      <div className="bg-white rounded-2xl border-2 border-foreground/10 shadow-[4px_4px_0px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background-alt border-b-2 border-foreground/10 text-sm font-bold text-foreground/60 uppercase tracking-wider">
                <th className="py-4 px-6">Tên / Email</th>
                <th className="py-4 px-6">Role</th>
                <th className="py-4 px-6">Ngày tham gia</th>
                <th className="py-4 px-6 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user: any) => (
                <tr key={user.id} className="border-b border-foreground/5 hover:bg-background-alt/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-bold text-foreground">{user.full_name || 'Chưa cập nhật'}</div>
                    <div className="text-sm text-foreground-muted">{user.email || 'Không có email'}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${user.role === 'admin' ? 'bg-terracotta/10 text-terracotta' : 'bg-foreground/5 text-foreground/60'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-foreground-muted">
                    {new Date(user.created_at).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="py-4 px-6 text-right">
                    {user.email !== 'tranchitin2006@gmail.com' && user.role !== 'admin' && (
                      <DeleteUserButton userId={user.id} />
                    )}
                  </td>
                </tr>
              ))}
              {(!users || users.length === 0) && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-foreground-muted">
                    Chưa có dữ liệu người dùng.
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
