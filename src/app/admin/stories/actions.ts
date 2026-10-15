'use server';

import { getSupabaseServer } from '@/lib/supabase-server';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createStoryAction(prevState: any, formData: FormData) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== 'admin') {
      return { success: false, message: 'Unauthorized' };
    }

    const supabase = getSupabaseServer();

    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const excerpt = formData.get('excerpt') as string;
    const content = formData.get('content') as string;
    const city = formData.get('city') as string;
    const collection_number = formData.get('collection_number') as string;
    const status = formData.get('status') as string;

    const coverFile = formData.get('image_url') as File;
    const additionalFiles = formData.getAll('additional_images') as File[];

    if (!title || !slug) {
      return { success: false, message: 'Tiêu đề và Slug là bắt buộc.' };
    }

    const cleanSlug = slug
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9\s_-]/g, "")
      .trim()
      .replace(/[\s_]+/g, "-")
      .replace(/-+/g, "-");

    if (!cleanSlug) {
      return { success: false, message: 'Slug không hợp lệ.' };
    }

    // Kiểm tra slug trùng
    const { data: existingSlug } = await supabase.from('mm_stories').select('id').eq('slug', cleanSlug).maybeSingle();
    if (existingSlug) {
      return { success: false, message: 'Slug này đã tồn tại, vui lòng chọn slug khác.' };
    }

    let image_url = null;
    if (coverFile && coverFile.size > 0) {
      const fileExt = coverFile.name.split('.').pop();
      const fileName = `story-${cleanSlug}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('team_images').upload(`public/${fileName}`, coverFile);
      if (uploadError) return { success: false, message: 'Lỗi tải ảnh bìa: ' + uploadError.message };
      image_url = supabase.storage.from('team_images').getPublicUrl(`public/${fileName}`).data.publicUrl;
    }

    let additional_images: string[] = [];
    for (let i = 0; i < additionalFiles.length; i++) {
      const file = additionalFiles[i];
      if (file && file.size > 0) {
        const fileExt = file.name.split('.').pop();
        const fileName = `story-add-${cleanSlug}-${Date.now()}-${i}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('team_images').upload(`public/${fileName}`, file);
        if (uploadError) {
          return { success: false, message: 'Lỗi tải ảnh phụ: ' + uploadError.message };
        }
        additional_images.push(supabase.storage.from('team_images').getPublicUrl(`public/${fileName}`).data.publicUrl);
      }
    }

    const payload = {
      title, 
      slug: cleanSlug, 
      excerpt, 
      content, 
      city, 
      collection_number, 
      status, 
      image_url, 
      additional_images
    };

    const { error: insertError } = await supabase.from('mm_stories').insert([payload]);
    if (insertError) return { success: false, message: 'Lỗi lưu bài viết: ' + insertError.message };

  } catch (error: any) {
    return { success: false, message: 'Lỗi hệ thống: ' + error.message };
  }

  revalidatePath('/admin/stories', 'layout');
  revalidatePath('/story-hub', 'layout');
  redirect('/admin/stories');
}

export async function deleteStoryAction(id: string) {
  const session = await auth();
  if (!session || (session.user as any)?.role !== 'admin') {
    return { success: false, message: 'Unauthorized' };
  }
  const supabase = getSupabaseServer();
  const { error } = await supabase.from('mm_stories').delete().eq('id', id);
  if (error) return { success: false, message: error.message };
  revalidatePath('/admin/stories', 'layout');
  revalidatePath('/story-hub', 'layout');
  return { success: true };
}
