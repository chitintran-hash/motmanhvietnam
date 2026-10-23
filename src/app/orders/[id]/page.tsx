import { getSupabaseServer } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import OrderDetailClient from "./OrderDetailClient";

export const revalidate = 0;

export default async function OrderDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const orderId = params.id;
  const supabase = getSupabaseServer();

  // 1. Lấy thông tin đơn hàng
  const { data: order, error } = await supabase
    .from("mm_orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (error || !order) {
    notFound();
  }

  // 2. Lấy danh sách sản phẩm trong đơn
  const { data: orderItems } = await supabase
    .from("mm_order_items")
    .select("*")
    .eq("order_id", orderId);

  return <OrderDetailClient order={order} orderItems={orderItems || []} />;
}
