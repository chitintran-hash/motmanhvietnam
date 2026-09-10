'use server';

import { getSupabaseServer } from '@/lib/supabase-server';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createProductAction(prevState: any, formData: FormData) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== 'admin') {
      return { success: false, message: 'Unauthorized' };
    }

    const supabase = getSupabaseServer();

    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const city = formData.get('city') as string;
    const short_description = formData.get('short_description') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string || '0');
    const stock = parseInt(formData.get('stock') as string || '0');
    const status = formData.get('status') as string;
    const imageFile = formData.get('image') as File;

    if (!name || !slug) {
      return { success: false, message: 'Tên và Slug là bắt buộc.' };
    }

    let image_url = null;

    if (imageFile && imageFile.size > 0) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${slug}-${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product_images')
        .upload(`public/${fileName}`, imageFile);

      if (uploadError) {
        console.error('Upload Error:', uploadError);
        return { success: false, message: 'Lỗi tải ảnh lên: ' + uploadError.message };
      }

      const { data: publicUrlData } = supabase.storage
        .from('product_images')
        .getPublicUrl(`public/${fileName}`);
        
      image_url = publicUrlData.publicUrl;
    }

    const productPayload = {
      name,
      slug,
      city,
      short_description,
      description,
      price,
      stock,
      status,
      image_url
    };

    const { error: insertError } = await supabase.from('mm_products').insert([productPayload]);

    if (insertError) {
      console.error('Insert Error:', insertError);
      return { success: false, message: 'Lỗi lưu sản phẩm: ' + insertError.message };
    }

  } catch (error: any) {
    console.error('Create Product Exception:', error);
    return { success: false, message: 'Lỗi hệ thống: ' + error.message };
  }

  revalidatePath('/admin/products');
  revalidatePath('/collection');
  redirect('/admin/products');
}
