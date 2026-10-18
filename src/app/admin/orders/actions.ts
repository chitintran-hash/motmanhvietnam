'use server';

import { auth } from '@/auth';
import { getSupabaseServer } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';

export async function updateOrderStatus(orderId: string, newStatus: string) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== 'admin') {
      return { success: false, message: 'Bạn không có quyền thực hiện thao tác này.' };
    }

    const supabase = getSupabaseServer();
    const { error } = await supabase
      .from('mm_orders')
      .update({ 
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating order status:', error);
      return { success: false, message: 'Cập nhật trạng thái thất bại.' };
    }

    revalidatePath('/admin/orders');
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath(`/orders/${orderId}`);
    revalidatePath('/profile/orders');

    return { success: true, message: 'Cập nhật trạng thái thành công!' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Lỗi hệ thống.' };
  }
}
