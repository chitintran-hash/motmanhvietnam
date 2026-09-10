import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase-server";

export default async function AdminDashboard() {
  const session = await auth();
  
  if (!session || (session.user as any)?.role !== 'admin') {
    redirect("/");
  }

  const supabase = getSupabaseServer();
  // Lấy danh sách user từ bảng mm_profiles
  const { data: users } = await supabase.from('mm_profiles').select('*').limit(50);
  
  return (
    <div className="min-h-screen pt-40 pb-24 bg-background">
      <div className="container mx-auto px-6 max-w-7xl">
        <h1 className="text-3xl font-serif font-bold text-foreground mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Quản lý User */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-foreground/5">
            <h2 className="text-xl font-bold mb-4 flex items-center justify-between">
              Khách hàng đăng ký
              <span className="text-sm bg-terracotta text-white px-2 py-1 rounded-full">{users?.length || 0}</span>
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-foreground/10 text-sm text-foreground/60">
                    <th className="py-3 px-4">Tên</th>
                    <th className="py-3 px-4">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map((user: any) => (
                    <tr key={user.id} className="border-b border-foreground/5 last:border-0">
                      <td className="py-3 px-4 font-medium">{user.full_name || 'Khách hàng'}</td>
                      <td className="py-3 px-4 text-sm">
                        <span className={`px-2 py-1 rounded-full ${user.role === 'admin' ? 'bg-jade/10 text-jade' : 'bg-foreground/5 text-foreground/60'}`}>
                          {user.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {(!users || users.length === 0) && (
                    <tr>
                      <td colSpan={2} className="py-4 text-center text-foreground/50 text-sm">
                        Chưa có khách hàng nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quản lý Sản phẩm */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-foreground/5">
            <h2 className="text-xl font-bold mb-4">Đăng sản phẩm mới (Blind Box)</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tên sản phẩm</label>
                <input type="text" className="w-full px-3 py-2 rounded border border-foreground/20" placeholder="VD: Mảnh Sài Gòn" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Giá (VNĐ)</label>
                <input type="number" className="w-full px-3 py-2 rounded border border-foreground/20" placeholder="129000" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Loại</label>
                <select className="w-full px-3 py-2 rounded border border-foreground/20">
                  <option value="normal">Bản Thường</option>
                  <option value="secret">Bản Đặc Biệt (Secret)</option>
                </select>
              </div>
              <button type="button" className="bg-foreground text-white px-4 py-2 rounded-lg font-medium hover:bg-terracotta transition-colors">
                Thêm sản phẩm
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
