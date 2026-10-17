'use server';

import { getSupabaseServer } from '@/lib/supabase-server';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function getStorySignedUploadUrlsAction(requests: Array<{ name: string; type: string; isCover?: boolean; index?: number }>) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== 'admin') {
      return { success: false, message: 'Unauthorized' };
    }

    const supabase = getSupabaseServer();
    const urls: Array<{ signedUrl: string; publicUrl: string; isCover: boolean; index: number; fileName: string }> = [];

    for (const req of requests) {
      const rawExt = req.name.split('.').pop() || 'jpg';
      const fileExt = rawExt.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
      const timestamp = Date.now();
      const rand = Math.random().toString(36).substring(2, 7);
      const fileName = req.isCover
        ? `story-cover-${timestamp}-${rand}.${fileExt}`
        : `story-add-${timestamp}-${rand}-${req.index ?? 0}.${fileExt}`;
      const filePath = `public/${fileName}`;

      const { data, error } = await supabase.storage.from('team_images').createSignedUploadUrl(filePath);
      if (error || !data?.signedUrl) {
        return { success: false, message: `Lỗi chuẩn bị upload ảnh: ${error?.message || 'Không thể tạo link tải ảnh'}` };
      }

      const publicUrl = supabase.storage.from('team_images').getPublicUrl(filePath).data.publicUrl;

      urls.push({
        signedUrl: data.signedUrl,
        publicUrl,
        isCover: !!req.isCover,
        index: req.index ?? 0,
        fileName
      });
    }

    return { success: true, urls };
  } catch (error: any) {
    return { success: false, message: 'Lỗi máy chủ: ' + error.message };
  }
}

export async function createStoryDirectAction(data: {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  city?: string;
  collection_number?: string;
  status?: string;
  image_url?: string | null;
  additional_images?: string[];
}) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== 'admin') {
      return { success: false, message: 'Unauthorized' };
    }

    const supabase = getSupabaseServer();

    if (!data.title || !data.title.trim()) {
      return { success: false, message: 'Tiêu đề bài viết là bắt buộc.' };
    }

    const rawSlug = (data.slug && data.slug.trim()) ? data.slug.trim() : data.title.trim();

    const cleanSlug = rawSlug
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9\s_-]/g, "")
      .trim()
      .replace(/[\s_]+/g, "-")
      .replace(/-+/g, "-");

    if (!cleanSlug) {
      return { success: false, message: 'Slug không hợp lệ. Vui lòng nhập tiêu đề hoặc slug có chữ/số.' };
    }

    let finalSlug = cleanSlug;
    const { data: existingSlug } = await supabase.from('mm_stories').select('id').eq('slug', cleanSlug).maybeSingle();
    if (existingSlug) {
      finalSlug = `${cleanSlug}-${Date.now().toString().slice(-4)}`;
    }

    const payload = {
      title: data.title.trim(),
      slug: finalSlug,
      excerpt: data.excerpt ? data.excerpt.trim() : '',
      content: data.content ? data.content.trim() : '',
      city: data.city ? data.city.trim() : 'Việt Nam',
      collection_number: data.collection_number ? data.collection_number.trim() : 'STORY',
      status: data.status || 'published',
      image_url: data.image_url || null,
      additional_images: Array.isArray(data.additional_images) ? data.additional_images : [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { error: insertError } = await supabase.from('mm_stories').insert([payload]);
    if (insertError) return { success: false, message: 'Lỗi lưu bài viết: ' + insertError.message };

    revalidatePath('/admin/stories');
    revalidatePath('/story-hub');
    revalidatePath(`/story-hub/${finalSlug}`);

    return { 
      success: true, 
      message: 'Đăng bài viết thành công!',
      slug: finalSlug
    };
  } catch (error: any) {
    return { success: false, message: 'Lỗi hệ thống: ' + error.message };
  }
}

export async function updateStoryDirectAction(data: {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  city?: string;
  collection_number?: string;
  status?: string;
  image_url?: string | null;
  additional_images?: string[];
}) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== 'admin') {
      return { success: false, message: 'Unauthorized' };
    }

    const supabase = getSupabaseServer();

    if (!data.id || !data.title || !data.slug) {
      return { success: false, message: 'ID, Tiêu đề và Slug là bắt buộc.' };
    }

    const cleanSlug = data.slug
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

    const { data: existingSlug } = await supabase
      .from('mm_stories')
      .select('id')
      .eq('slug', cleanSlug)
      .neq('id', data.id)
      .maybeSingle();

    if (existingSlug) {
      return { success: false, message: 'Slug này đã được sử dụng bởi bài viết khác, vui lòng chọn slug khác.' };
    }

    const { data: currentStory } = await supabase
      .from('mm_stories')
      .select('*')
      .eq('id', data.id)
      .maybeSingle();

    const payload: any = {
      title: data.title.trim(),
      slug: cleanSlug,
      excerpt: data.excerpt ? data.excerpt.trim() : '',
      content: data.content ? data.content.trim() : '',
      city: data.city ? data.city.trim() : '',
      collection_number: data.collection_number ? data.collection_number.trim() : 'STORY',
      status: data.status || 'published',
      image_url: data.image_url ?? currentStory?.image_url ?? null,
      additional_images: Array.isArray(data.additional_images) ? data.additional_images : [],
      updated_at: new Date().toISOString()
    };

    const { error: updateError } = await supabase.from('mm_stories').update(payload).eq('id', data.id);
    if (updateError) return { success: false, message: 'Lỗi cập nhật bài viết: ' + updateError.message };

    if (currentStory && currentStory.slug !== cleanSlug) {
      await supabase
        .from('mm_story_comments')
        .update({ story_slug: cleanSlug })
        .eq('story_id', data.id);
      revalidatePath(`/story-hub/${currentStory.slug}`);
    }

    revalidatePath('/admin/stories');
    revalidatePath('/story-hub');
    revalidatePath(`/story-hub/${cleanSlug}`);

    return { 
      success: true, 
      message: 'Cập nhật bài viết thành công!',
      slug: cleanSlug
    };
  } catch (error: any) {
    return { success: false, message: 'Lỗi hệ thống: ' + error.message };
  }
}

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

    if (!title || !title.trim()) {
      return { success: false, message: 'Tiêu đề bài viết là bắt buộc.' };
    }

    const rawSlug = (slug && slug.trim()) ? slug.trim() : title.trim();

    const cleanSlug = rawSlug
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9\s_-]/g, "")
      .trim()
      .replace(/[\s_]+/g, "-")
      .replace(/-+/g, "-");

    if (!cleanSlug) {
      return { success: false, message: 'Slug không hợp lệ. Vui lòng nhập tiêu đề hoặc slug có chữ/số.' };
    }

    let finalSlug = cleanSlug;
    // Kiểm tra slug trùng - nếu trùng tự thêm hậu tố để tránh báo lỗi làm gián đoạn người dùng
    const { data: existingSlug } = await supabase.from('mm_stories').select('id').eq('slug', cleanSlug).maybeSingle();
    if (existingSlug) {
      finalSlug = `${cleanSlug}-${Date.now().toString().slice(-4)}`;
    }

    let image_url = null;
    if (coverFile && coverFile.size > 0) {
      const rawExt = coverFile.name.split('.').pop() || 'jpg';
      const fileExt = rawExt.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
      const fileName = `story-${finalSlug}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('team_images').upload(`public/${fileName}`, coverFile, {
        contentType: coverFile.type || 'image/jpeg',
        upsert: true
      });
      if (uploadError) return { success: false, message: 'Lỗi tải ảnh bìa: ' + uploadError.message };
      image_url = supabase.storage.from('team_images').getPublicUrl(`public/${fileName}`).data.publicUrl;
    }

    let additional_images: string[] = [];
    for (let i = 0; i < additionalFiles.length; i++) {
      const file = additionalFiles[i];
      if (file && file.size > 0) {
        const rawExt = file.name.split('.').pop() || 'jpg';
        const fileExt = rawExt.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
        const fileName = `story-add-${finalSlug}-${Date.now()}-${i}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('team_images').upload(`public/${fileName}`, file, {
          contentType: file.type || 'image/jpeg',
          upsert: true
        });
        if (uploadError) {
          return { success: false, message: 'Lỗi tải ảnh phụ: ' + uploadError.message };
        }
        additional_images.push(supabase.storage.from('team_images').getPublicUrl(`public/${fileName}`).data.publicUrl);
      }
    }

    const payload = {
      title: title.trim(), 
      slug: finalSlug, 
      excerpt: excerpt ? excerpt.trim() : '', 
      content: content ? content.trim() : '', 
      city: city ? city.trim() : 'Việt Nam', 
      collection_number: collection_number ? collection_number.trim() : 'STORY', 
      status: status || 'published', 
      image_url, 
      additional_images,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { error: insertError } = await supabase.from('mm_stories').insert([payload]);
    if (insertError) return { success: false, message: 'Lỗi lưu bài viết: ' + insertError.message };

    revalidatePath('/admin/stories');
    revalidatePath('/story-hub');
    revalidatePath(`/story-hub/${finalSlug}`);

    return { 
      success: true, 
      message: 'Đăng bài viết thành công!',
      slug: finalSlug
    };
  } catch (error: any) {
    return { success: false, message: 'Lỗi hệ thống: ' + error.message };
  }
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

export async function updateStoryAction(prevState: any, formData: FormData) {
  let cleanSlug = '';
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== 'admin') {
      return { success: false, message: 'Unauthorized' };
    }

    const supabase = getSupabaseServer();

    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const excerpt = formData.get('excerpt') as string;
    const content = formData.get('content') as string;
    const city = formData.get('city') as string;
    const collection_number = formData.get('collection_number') as string;
    const status = formData.get('status') as string;

    const coverFile = formData.get('image_url') as File;
    const additionalFiles = formData.getAll('additional_images') as File[];
    const existingCoverUrl = formData.get('existing_cover_url') as string;
    const existingAdditionalRaw = formData.get('existing_additional_images') as string;

    if (!id || !title || !slug) {
      return { success: false, message: 'ID, Tiêu đề và Slug là bắt buộc.' };
    }

    cleanSlug = slug
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

    // Kiểm tra slug trùng với bài khác
    const { data: existingSlug } = await supabase
      .from('mm_stories')
      .select('id')
      .eq('slug', cleanSlug)
      .neq('id', id)
      .maybeSingle();

    if (existingSlug) {
      return { success: false, message: 'Slug này đã được sử dụng bởi bài viết khác, vui lòng chọn slug khác.' };
    }

    const { data: currentStory } = await supabase
      .from('mm_stories')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    let image_url = existingCoverUrl || currentStory?.image_url || null;
    if (coverFile && coverFile.size > 0) {
      const rawExt = coverFile.name.split('.').pop() || 'jpg';
      const fileExt = rawExt.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
      const fileName = `story-${cleanSlug}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('team_images').upload(`public/${fileName}`, coverFile, {
        contentType: coverFile.type || 'image/jpeg',
        upsert: true
      });
      if (uploadError) return { success: false, message: 'Lỗi tải ảnh bìa: ' + uploadError.message };
      image_url = supabase.storage.from('team_images').getPublicUrl(`public/${fileName}`).data.publicUrl;
    }

    let additional_images: string[] = [];
    if (existingAdditionalRaw) {
      try {
        const parsed = JSON.parse(existingAdditionalRaw);
        if (Array.isArray(parsed)) additional_images = parsed;
      } catch (e) {
        // ignore
      }
    }

    for (let i = 0; i < additionalFiles.length; i++) {
      const file = additionalFiles[i];
      if (file && file.size > 0) {
        const rawExt = file.name.split('.').pop() || 'jpg';
        const fileExt = rawExt.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
        const fileName = `story-add-${cleanSlug}-${Date.now()}-${i}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('team_images').upload(`public/${fileName}`, file, {
          contentType: file.type || 'image/jpeg',
          upsert: true
        });
        if (uploadError) {
          return { success: false, message: 'Lỗi tải ảnh phụ: ' + uploadError.message };
        }
        additional_images.push(supabase.storage.from('team_images').getPublicUrl(`public/${fileName}`).data.publicUrl);
      }
    }

    const payload: any = {
      title,
      slug: cleanSlug,
      excerpt: excerpt || '',
      content: content || '',
      city: city || '',
      collection_number: collection_number || 'STORY',
      status: status || 'published',
      image_url,
      additional_images,
      updated_at: new Date().toISOString()
    };

    const { error: updateError } = await supabase.from('mm_stories').update(payload).eq('id', id);
    if (updateError) return { success: false, message: 'Lỗi cập nhật bài viết: ' + updateError.message };

    // Cập nhật slug trong bình luận nếu slug đổi
    if (currentStory && currentStory.slug !== cleanSlug) {
      await supabase
        .from('mm_story_comments')
        .update({ story_slug: cleanSlug })
        .eq('story_id', id);
      revalidatePath(`/story-hub/${currentStory.slug}`);
    }

    revalidatePath('/admin/stories');
    revalidatePath('/story-hub');
    if (cleanSlug) {
      revalidatePath(`/story-hub/${cleanSlug}`);
    }

    return { 
      success: true, 
      message: 'Cập nhật bài viết thành công!',
      slug: cleanSlug
    };
  } catch (error: any) {
    return { success: false, message: 'Lỗi hệ thống: ' + error.message };
  }
}
