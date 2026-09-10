'use server';

import { getSupabaseServer } from '@/lib/supabase-server';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createTeamMemberAction(prevState: any, formData: FormData) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== 'admin') {
      return { success: false, message: 'Unauthorized' };
    }

    const supabase = getSupabaseServer();

    const full_name = formData.get('full_name') as string;
    const slug = formData.get('slug') as string;
    const email = formData.get('email') as string;
    const student_id = formData.get('student_id') as string;
    const role_title = formData.get('role_title') as string;
    const department = formData.get('department') as string;
    const short_description = formData.get('short_description') as string;
    const bio = formData.get('bio') as string;
    const contribution = formData.get('contribution') as string;
    const achievements = formData.get('achievements') as string; // JSON string
    const skills = formData.get('skills') as string; // JSON string
    const facebook_url = formData.get('facebook_url') as string;
    const instagram_url = formData.get('instagram_url') as string;
    const tiktok_url = formData.get('tiktok_url') as string;
    const portfolio_url = formData.get('portfolio_url') as string;
    const display_order = parseInt(formData.get('display_order') as string || '0');
    const status = formData.get('status') as string;

    const avatarFile = formData.get('avatar_url') as File;
    const coverFile = formData.get('cover_image_url') as File;

    if (!full_name || !slug) {
      return { success: false, message: 'Họ tên và Slug là bắt buộc.' };
    }

    // Kiểm tra slug trùng
    const { data: existingSlug } = await supabase.from('mm_team_members').select('id').eq('slug', slug).single();
    if (existingSlug) {
      return { success: false, message: 'Slug này đã tồn tại, vui lòng chọn slug khác.' };
    }

    let avatar_url = null;
    let cover_image_url = null;

    if (avatarFile && avatarFile.size > 0) {
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `avatar-${slug}-${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('team_images')
        .upload(`public/${fileName}`, avatarFile);

      if (uploadError) {
        return { success: false, message: 'Lỗi tải ảnh đại diện: ' + uploadError.message };
      }
      avatar_url = supabase.storage.from('team_images').getPublicUrl(`public/${fileName}`).data.publicUrl;
    }

    if (coverFile && coverFile.size > 0) {
      const fileExt = coverFile.name.split('.').pop();
      const fileName = `cover-${slug}-${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('team_images')
        .upload(`public/${fileName}`, coverFile);

      if (uploadError) {
        return { success: false, message: 'Lỗi tải ảnh bìa: ' + uploadError.message };
      }
      cover_image_url = supabase.storage.from('team_images').getPublicUrl(`public/${fileName}`).data.publicUrl;
    }

    const payload = {
      full_name,
      slug,
      email,
      student_id,
      role_title,
      department,
      short_description,
      bio,
      contribution,
      achievements: achievements ? achievements.split(',').map(s => s.trim()).filter(s => s) : [],
      skills: skills ? skills.split(',').map(s => s.trim()).filter(s => s) : [],
      facebook_url,
      instagram_url,
      tiktok_url,
      portfolio_url,
      display_order,
      status,
      avatar_url,
      cover_image_url
    };

    const { error: insertError } = await supabase.from('mm_team_members').insert([payload]);

    if (insertError) {
      return { success: false, message: 'Lỗi lưu thành viên: ' + insertError.message };
    }

  } catch (error: any) {
    return { success: false, message: 'Lỗi hệ thống: ' + error.message };
  }

  revalidatePath('/admin/team', 'layout');
  revalidatePath('/team', 'layout');
  redirect('/admin/team');
}

export async function updateTeamMemberAction(prevState: any, formData: FormData) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== 'admin') {
      return { success: false, message: 'Unauthorized' };
    }

    const supabase = getSupabaseServer();
    
    const id = formData.get('id') as string;
    const full_name = formData.get('full_name') as string;
    const slug = formData.get('slug') as string;
    const email = formData.get('email') as string;
    const student_id = formData.get('student_id') as string;
    const role_title = formData.get('role_title') as string;
    const department = formData.get('department') as string;
    const short_description = formData.get('short_description') as string;
    const bio = formData.get('bio') as string;
    const contribution = formData.get('contribution') as string;
    const achievements = formData.get('achievements') as string; 
    const skills = formData.get('skills') as string; 
    const facebook_url = formData.get('facebook_url') as string;
    const instagram_url = formData.get('instagram_url') as string;
    const tiktok_url = formData.get('tiktok_url') as string;
    const portfolio_url = formData.get('portfolio_url') as string;
    const display_order = parseInt(formData.get('display_order') as string || '0');
    const status = formData.get('status') as string;

    const avatarFile = formData.get('avatar_url') as File;
    const coverFile = formData.get('cover_image_url') as File;

    if (!id || !full_name || !slug) {
      return { success: false, message: 'Họ tên và Slug là bắt buộc.' };
    }

    // Kiểm tra slug trùng
    const { data: existingSlug } = await supabase.from('mm_team_members').select('id').eq('slug', slug).neq('id', id).single();
    if (existingSlug) {
      return { success: false, message: 'Slug này đã tồn tại, vui lòng chọn slug khác.' };
    }

    const payload: any = {
      full_name,
      slug,
      email,
      student_id,
      role_title,
      department,
      short_description,
      bio,
      contribution,
      achievements: achievements ? achievements.split(',').map(s => s.trim()).filter(s => s) : [],
      skills: skills ? skills.split(',').map(s => s.trim()).filter(s => s) : [],
      facebook_url,
      instagram_url,
      tiktok_url,
      portfolio_url,
      display_order,
      status,
      updated_at: new Date().toISOString()
    };

    if (avatarFile && avatarFile.size > 0) {
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `avatar-${slug}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('team_images').upload(`public/${fileName}`, avatarFile);
      if (!uploadError) {
        payload.avatar_url = supabase.storage.from('team_images').getPublicUrl(`public/${fileName}`).data.publicUrl;
      }
    }

    if (coverFile && coverFile.size > 0) {
      const fileExt = coverFile.name.split('.').pop();
      const fileName = `cover-${slug}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('team_images').upload(`public/${fileName}`, coverFile);
      if (!uploadError) {
        payload.cover_image_url = supabase.storage.from('team_images').getPublicUrl(`public/${fileName}`).data.publicUrl;
      }
    }

    const { error: updateError } = await supabase.from('mm_team_members').update(payload).eq('id', id);

    if (updateError) {
      return { success: false, message: 'Lỗi cập nhật: ' + updateError.message };
    }

  } catch (error: any) {
    return { success: false, message: 'Lỗi hệ thống: ' + error.message };
  }

  revalidatePath('/admin/team', 'layout');
  revalidatePath('/team', 'layout');
  redirect('/admin/team');
}

export async function deleteTeamMemberAction(id: string) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== 'admin') {
      return { success: false, message: 'Unauthorized' };
    }

    const supabase = getSupabaseServer();
    const { error } = await supabase.from('mm_team_members').delete().eq('id', id);
    
    if (error) {
      return { success: false, message: error.message };
    }
    
    revalidatePath('/admin/team', 'layout');
    revalidatePath('/team', 'layout');
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
