import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase-server";
import { handleSignOut } from "@/app/lib/actions";

export default async function ProfilePage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }

  const supabase = getSupabaseServer();
  const { data: profile } = await supabase
    .from('mm_profiles')
    .select('*')
    .eq('id', (session.user as any).id)
    .single();

  return (
    <div className="min-h-screen pt-40 pb-24 bg-background">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-3xl font-serif font-bold text-foreground mb-8">Tài khoản của tôi</h1>
        
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-foreground/5">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-terracotta text-white flex items-center justify-center text-2xl font-serif font-bold">
              {profile?.full_name?.charAt(0) || 'U'}
            </div>
            <div>
              <h2 className="text-xl font-bold">{profile?.full_name || session.user.email}</h2>
              <p className="text-foreground/60">{session.user.email}</p>
            </div>
          </div>

          <div className="border-t border-foreground/5 pt-6 mt-6">
            <h3 className="font-bold mb-4">Lịch sử sưu tập (Bản Đồ Di Sản)</h3>
            <p className="text-foreground/60 text-sm">Bạn chưa kích hoạt mảnh ghép nào.</p>
          </div>

          <div className="border-t border-foreground/5 pt-6 mt-6">
            <h3 className="font-bold mb-4">Đơn hàng của tôi</h3>
            <p className="text-foreground/60 text-sm">Chưa có đơn hàng nào.</p>
          </div>

          <form action={handleSignOut} className="mt-8">
            <button type="submit" className="text-red-500 font-medium hover:underline text-sm">
              Đăng xuất
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
