'use server';

import { getSupabaseServer } from '@/lib/supabase-server';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function deleteUserAction(userId: string) {
  try {
    const session = await auth();
    
    // Auth check
    if (!session || (session.user as any)?.role !== 'admin') {
      return { success: false, message: 'Unauthorized' };
    }

    const supabase = getSupabaseServer();
    
    // Self-deletion check
    if ((session.user as any)?.id === userId) {
      return { success: false, message: 'Không thể xóa chính tài khoản của mình.' };
    }

    // Additional protection for primary admin email
    const { data: targetUser } = await supabase.from('mm_profiles').select('email').eq('id', userId).single();
    if (targetUser?.email === 'tranchitin2006@gmail.com') {
      return { success: false, message: 'Không thể xóa tài khoản Admin hệ thống.' };
    }

    // Delete user using admin role (Supabase auth.admin.deleteUser requires service_role key)
    const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(userId);
    
    if (deleteAuthError) {
      console.error('Delete Auth Error:', deleteAuthError);
      return { success: false, message: 'Không thể xóa tài khoản Auth: ' + deleteAuthError.message };
    }

    // mm_profiles is deleted by cascade from auth.users (if set up), but we can also manually delete if not
    await supabase.from('mm_profiles').delete().eq('id', userId);

    revalidatePath('/admin/users');
    return { success: true, message: 'Đã xóa tài khoản thành công.' };
  } catch (error: any) {
    console.error('Delete User Exception:', error);
    return { success: false, message: 'Lỗi hệ thống: ' + error.message };
  }
}
