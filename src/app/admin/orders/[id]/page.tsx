import { getSupabaseServer } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, ClipboardCheck, Truck, PackageCheck, AlertTriangle, User, Phone, MapPin, Mail, CreditCard, Package } from 'lucide-react';
import OrderStatusSwitcher from './OrderStatusSwitcher';

export const revalidate = 0;

export default async function AdminOrderDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const orderId = params.id;
  const supabase = getSupabaseServer();

  const { data: order } = await supabase
    .from('mm_orders')
    .select('*')
    .eq('id', orderId)
    .single();

  if (!order) {
    notFound();
  }

  const { data: orderItems } = await supabase
    .from('mm_order_items')
    .select('*')
    .eq('order_id', orderId);

  return (
    <div>
      <div className="mb-8">
        <Link 
          href="/admin/orders" 
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground/50 hover:text-terracotta mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại danh sách đơn hàng
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-black text-foreground uppercase tracking-wider">
              Chi tiết đơn hàng #{order.id.split('-')[0].toUpperCase()}
            </h1>
            <p className="text-sm text-foreground-muted font-medium mt-1">
              Ngày đặt: {new Date(order.created_at).toLocaleString('vi-VN')}
            </p>
          </div>
          <Link
            href={`/orders/${order.id}`}
            target="_blank"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-terracotta hover:underline"
          >
            Xem giao diện khách hàng →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Customer & Items */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Status Switcher Component */}
          <OrderStatusSwitcher orderId={order.id} currentStatus={order.status} />

          {/* Items */}
          <div className="bg-white rounded-2xl border-2 border-foreground/10 p-6 shadow-[4px_4px_0px_rgba(0,0,0,0.05)]">
            <h2 className="text-sm font-black uppercase tracking-wider text-foreground/70 mb-4 pb-2 border-b border-foreground/10 flex items-center gap-2">
              <Package className="w-4 h-4 text-terracotta" />
              Sản phẩm trong đơn ({orderItems?.length || 1})
            </h2>

            <div className="space-y-4">
              {orderItems && orderItems.length > 0 ? (
                orderItems.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center py-2 border-b border-foreground/5 last:border-b-0">
                    <div>
                      <div className="font-bold text-foreground">{item.product_name}</div>
                      <div className="text-xs text-foreground/50">
                        Số lượng: x{item.quantity} • Đơn giá: {Number(item.unit_price).toLocaleString('vi-VN')} đ
                      </div>
                    </div>
                    <span className="font-bold text-terracotta">
                      {Number(item.subtotal).toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-sm text-foreground/70">
                  <div className="font-bold">BLIND BOX - MỘT MẢNH VIỆT NAM</div>
                  <div className="text-xs text-foreground/50">Số lượng: x1</div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t-2 border-foreground/10 flex justify-between items-baseline">
              <span className="font-black uppercase tracking-wider text-sm text-foreground">Tổng đơn hàng</span>
              <span className="font-display font-black text-2xl text-terracotta">
                {Number(order.total_amount).toLocaleString('vi-VN')} đ
              </span>
            </div>
          </div>
        </div>

        {/* Right: Customer info */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white rounded-2xl border-2 border-foreground/10 p-6 shadow-[4px_4px_0px_rgba(0,0,0,0.05)]">
            <h2 className="text-sm font-black uppercase tracking-wider text-foreground/70 mb-4 pb-2 border-b border-foreground/10 flex items-center gap-2">
              <User className="w-4 h-4 text-terracotta" />
              Thông tin người nhận
            </h2>

            <div className="space-y-4 text-sm">
              <div>
                <span className="text-xs text-foreground/50 font-bold block mb-1">Khách hàng</span>
                <span className="font-bold text-foreground text-base block">{order.customer_name}</span>
                <span className="text-xs text-foreground/60">{order.customer_email}</span>
              </div>

              <div>
                <span className="text-xs text-foreground/50 font-bold block mb-1">Số điện thoại</span>
                <span className="font-bold text-foreground flex items-center gap-2">
                  <Phone className="w-4 h-4 text-terracotta" /> {order.phone || 'Chưa có'}
                </span>
              </div>

              <div>
                <span className="text-xs text-foreground/50 font-bold block mb-1">Địa chỉ giao hàng</span>
                <p className="text-foreground/80 font-medium leading-relaxed bg-background-alt/50 p-3 rounded-lg border border-foreground/5">
                  {order.address}
                </p>
              </div>

              <div>
                <span className="text-xs text-foreground/50 font-bold block mb-1">Phương thức thanh toán</span>
                <span className="font-bold text-foreground">Thanh toán khi nhận hàng (COD)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
