import { getSupabaseServer } from '@/lib/supabase-server';
import { Eye } from 'lucide-react';
import Link from 'next/link';

export default async function AdminOrdersPage() {
  const supabase = getSupabaseServer();
  const { data: orders } = await supabase.from('mm_orders').select('*').order('created_at', { ascending: false });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-orange-100 text-orange-600';
      case 'confirmed': return 'bg-blue-100 text-blue-600';
      case 'preparing': return 'bg-purple-100 text-purple-600';
      case 'shipping': return 'bg-yellow-100 text-yellow-600';
      case 'completed': return 'bg-green-100 text-green-600';
      case 'cancelled': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ xử lý';
      case 'confirmed': return 'Đã xác nhận';
      case 'preparing': return 'Đang chuẩn bị';
      case 'shipping': return 'Đang giao';
      case 'completed': return 'Hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display font-black text-foreground uppercase tracking-wider">Quản lý đơn hàng</h1>
      </div>

      <div className="bg-white rounded-2xl border-2 border-foreground/10 shadow-[4px_4px_0px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background-alt border-b-2 border-foreground/10 text-sm font-bold text-foreground/60 uppercase tracking-wider">
                <th className="py-4 px-6">Mã đơn</th>
                <th className="py-4 px-6">Khách hàng</th>
                <th className="py-4 px-6">Ngày đặt</th>
                <th className="py-4 px-6">Tổng tiền</th>
                <th className="py-4 px-6">Trạng thái</th>
                <th className="py-4 px-6 text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {orders?.map((order: any) => (
                <tr key={order.id} className="border-b border-foreground/5 hover:bg-background-alt/50 transition-colors">
                  <td className="py-4 px-6 font-mono text-sm font-bold text-foreground/80">
                    #{order.id.split('-')[0]}
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-bold text-foreground">{order.customer_name}</div>
                    <div className="text-sm text-foreground-muted">{order.phone}</div>
                  </td>
                  <td className="py-4 px-6 text-sm text-foreground-muted">
                    {new Date(order.created_at).toLocaleString('vi-VN')}
                  </td>
                  <td className="py-4 px-6 font-bold text-terracotta">
                    {order.total_amount.toLocaleString('vi-VN')} đ
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Link href={`/admin/orders/${order.id}`} className="inline-block p-2 text-foreground/60 hover:bg-foreground/5 rounded-lg transition-colors">
                      <Eye className="w-5 h-5" />
                    </Link>
                  </td>
                </tr>
              ))}
              {(!orders || orders.length === 0) && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-foreground-muted">
                    Chưa có đơn hàng nào.
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
