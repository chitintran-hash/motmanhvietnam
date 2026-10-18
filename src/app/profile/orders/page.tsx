import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase-server";
import Link from "next/link";
import { Package, ArrowRight, Clock, ClipboardCheck, Truck, PackageCheck, AlertTriangle } from "lucide-react";

export const revalidate = 0;

export default async function ProfileOrdersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/profile/orders");
  }

  const supabase = getSupabaseServer();
  const userId = (session.user as any)?.id;
  const userEmail = session.user.email;

  // Lấy đơn hàng theo user_id hoặc email
  let query = supabase.from("mm_orders").select("*").order("created_at", { ascending: false });

  if (userId) {
    query = query.or(`user_id.eq.${userId},customer_email.eq.${userEmail}`);
  } else if (userEmail) {
    query = query.eq("customer_email", userEmail);
  }

  const { data: orders } = await query;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return {
          label: "Chờ xác nhận",
          color: "bg-amber-50 text-amber-700 border-amber-200",
          icon: Clock
        };
      case "confirmed":
      case "preparing":
        return {
          label: "Đã xác nhận",
          color: "bg-blue-50 text-blue-700 border-blue-200",
          icon: ClipboardCheck
        };
      case "shipping":
        return {
          label: "Đang giao",
          color: "bg-purple-50 text-purple-700 border-purple-200",
          icon: Truck
        };
      case "completed":
        return {
          label: "Đã giao",
          color: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: PackageCheck
        };
      case "cancelled":
        return {
          label: "Đã hủy",
          color: "bg-red-50 text-red-700 border-red-200",
          icon: AlertTriangle
        };
      default:
        return {
          label: status,
          color: "bg-gray-50 text-gray-700 border-gray-200",
          icon: Package
        };
    }
  };

  return (
    <div className="min-h-screen pt-36 pb-24 bg-[#FAF9F5]">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/profile"
            className="text-xs font-bold uppercase tracking-widest text-foreground/50 hover:text-terracotta transition-colors mb-2 inline-block"
          >
            ← Tài khoản của tôi
          </Link>
          <h1 className="text-3xl font-display font-black text-foreground uppercase tracking-tight">
            ĐƠN HÀNG CỦA BẠN
          </h1>
          <p className="text-sm text-foreground/60 font-medium mt-1">
            Theo dõi hành trình và trạng thái các đơn hàng đã đặt
          </p>
        </div>

        {/* Orders list */}
        {orders && orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order: any) => {
              const statusInfo = getStatusBadge(order.status);
              const StatusIcon = statusInfo.icon;

              return (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="block bg-white border-2 border-foreground/10 rounded-2xl p-6 shadow-[4px_4px_0px_rgba(42,42,39,0.06)] hover:border-terracotta transition-all group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono font-bold text-sm text-foreground">
                          #{order.id.split("-")[0].toUpperCase()}
                        </span>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${statusInfo.color}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {statusInfo.label}
                        </span>
                      </div>
                      <p className="text-xs text-foreground/50 font-medium">
                        Ngày đặt: {new Date(order.created_at).toLocaleString("vi-VN")}
                      </p>
                      <p className="text-xs text-foreground/70 font-medium mt-1 line-clamp-1">
                        Giao đến: {order.address}
                      </p>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-foreground/5">
                      <span className="text-xs text-foreground/50 font-semibold uppercase tracking-wider">
                        Tổng tiền
                      </span>
                      <span className="text-xl font-display font-black text-terracotta">
                        {Number(order.total_amount).toLocaleString("vi-VN")} ₫
                      </span>
                      <span className="text-xs font-bold text-terracotta group-hover:translate-x-1 transition-transform flex items-center gap-1 mt-1">
                        Xem chi tiết & tiến độ <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border-2 border-foreground/10 rounded-2xl p-12 text-center shadow-[4px_4px_0px_rgba(42,42,39,0.06)]">
            <Package className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
            <h3 className="font-display font-bold text-lg text-foreground uppercase tracking-wider mb-2">
              Chưa có đơn hàng nào
            </h3>
            <p className="text-sm text-foreground/60 font-medium mb-6">
              Bạn chưa thực hiện đơn đặt hàng nào tại Một Mảnh Việt Nam.
            </p>
            <Link
              href="/collection"
              className="inline-flex items-center gap-2 px-6 py-3 bg-terracotta text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-terracotta-hover transition-colors"
            >
              Khám phá bộ sưu tập ngay
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
