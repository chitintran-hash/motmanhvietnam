import { getSupabaseServer } from '@/lib/supabase-server';
import { Package, Users, ShoppingCart, DollarSign } from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  const supabase = getSupabaseServer();

  // Fetch basic stats
  const [usersCount, productsCount, ordersCount, pendingOrders] = await Promise.all([
    supabase.from('mm_profiles').select('*', { count: 'exact', head: true }),
    supabase.from('mm_products').select('*', { count: 'exact', head: true }),
    supabase.from('mm_orders').select('*', { count: 'exact', head: true }),
    supabase.from('mm_orders').select('*', { count: 'exact', head: true }).eq('status', 'pending')
  ]);

  const stats = [
    { name: 'Tổng Người Dùng', value: usersCount.count || 0, icon: <Users className="w-8 h-8 text-jade" /> },
    { name: 'Tổng Sản Phẩm', value: productsCount.count || 0, icon: <Package className="w-8 h-8 text-gold" /> },
    { name: 'Tổng Đơn Hàng', value: ordersCount.count || 0, icon: <ShoppingCart className="w-8 h-8 text-terracotta" /> },
    { name: 'Đơn Chờ Xử Lý', value: pendingOrders.count || 0, icon: <DollarSign className="w-8 h-8 text-orange-500" /> },
  ];

  return (
    <div>
      <h1 className="text-3xl font-display font-black text-foreground mb-8 uppercase tracking-wider">Tổng Quan Quản Trị</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border-2 border-foreground/10 shadow-[4px_4px_0px_rgba(0,0,0,0.05)] flex items-center justify-between">
            <div>
              <p className="text-foreground-muted text-sm font-bold uppercase tracking-wider mb-1">{stat.name}</p>
              <p className="text-4xl font-display font-black">{stat.value}</p>
            </div>
            <div className="bg-background-alt p-3 rounded-full">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border-2 border-foreground/10 shadow-[4px_4px_0px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-black uppercase tracking-wider">Đơn hàng gần đây</h2>
            <Link href="/admin/orders" className="text-sm font-bold text-terracotta hover:underline">Xem tất cả</Link>
          </div>
          <div className="text-center py-12 text-foreground-muted">
            <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>Chưa có đơn hàng nào.</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border-2 border-foreground/10 shadow-[4px_4px_0px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-black uppercase tracking-wider">Sản phẩm mới</h2>
            <Link href="/admin/products" className="text-sm font-bold text-terracotta hover:underline">Xem tất cả</Link>
          </div>
          <div className="text-center py-12 text-foreground-muted">
            <Package className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>Chưa có sản phẩm nào.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
