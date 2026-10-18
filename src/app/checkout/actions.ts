'use server';

import { auth } from '@/auth';
import { getSupabaseServer } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';

export async function getAuthSession() {
  const session = await auth();
  return session;
}

interface OrderItemInput {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CreateOrderInput {
  customer_name: string;
  customer_email: string;
  phone: string;
  address: string;
  note?: string;
  items: OrderItemInput[];
  total_amount: number;
}

export async function createOrder(input: CreateOrderInput) {
  try {
    const session = await auth();
    const supabase = getSupabaseServer();

    if (!input.customer_name?.trim()) {
      return { success: false, message: 'Vui lòng nhập họ và tên người nhận.' };
    }

    if (!input.phone?.trim()) {
      return { success: false, message: 'Vui lòng nhập số điện thoại nhận hàng.' };
    }

    if (!input.address?.trim()) {
      return { success: false, message: 'Vui lòng nhập địa chỉ nhận hàng chi tiết.' };
    }

    if (!input.items || input.items.length === 0) {
      return { success: false, message: 'Giỏ hàng của bạn đang trống.' };
    }

    const email = input.customer_email?.trim() || session?.user?.email || 'khachhang@motmanhvietnam.store';
    const userId = (session?.user as any)?.id || null;

    // 1. Tạo đơn hàng trong mm_orders
    const fullAddress = input.note?.trim() 
      ? `${input.address.trim()} (Ghi chú: ${input.note.trim()})` 
      : input.address.trim();

    const { data: order, error: orderError } = await supabase
      .from('mm_orders')
      .insert({
        user_id: userId,
        customer_name: input.customer_name.trim(),
        customer_email: email,
        phone: input.phone.trim(),
        address: fullAddress,
        total_amount: input.total_amount,
        status: 'pending', // Chờ xác nhận
        payment_status: 'unpaid' // COD thanh toán khi nhận hàng
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error('Error creating order:', orderError);
      return { success: false, message: 'Không thể tạo đơn hàng. Vui lòng thử lại.' };
    }

    // 2. Thêm từng sản phẩm vào mm_order_items
    const orderItems = input.items.map((item) => {
      // Kiểm tra nếu item.id là uuid hợp lệ thì lưu product_id, nếu không thì null
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(item.id);
      return {
        order_id: order.id,
        product_id: isUUID ? item.id : null,
        product_name: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        subtotal: item.price * item.quantity
      };
    });

    const { error: itemsError } = await supabase
      .from('mm_order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error inserting order items:', itemsError);
      // Đơn hàng chính vẫn được tạo, tiếp tục
    }

    revalidatePath('/admin/orders');
    revalidatePath('/profile/orders');

    return { 
      success: true, 
      orderId: order.id 
    };
  } catch (error: any) {
    console.error('createOrder exception:', error);
    return { success: false, message: error.message || 'Đã có lỗi xảy ra khi tạo đơn hàng.' };
  }
}
