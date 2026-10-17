'use server';

import { getSupabaseServer } from '@/lib/supabase-server';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function getProductSignedUploadUrlsAction(requests: Array<{ name: string; type: string; isMain?: boolean; index?: number }>) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== 'admin') {
      return { success: false, message: 'Unauthorized' };
    }

    const supabase = getSupabaseServer();
    const urls: Array<{ signedUrl: string; publicUrl: string; isMain: boolean; index: number; fileName: string }> = [];

    for (const req of requests) {
      const rawExt = req.name.split('.').pop() || 'jpg';
      const fileExt = rawExt.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
      const timestamp = Date.now();
      const rand = Math.random().toString(36).substring(2, 7);
      const prefix = req.isMain ? 'box' : 'piece';
      const fileName = `product-${prefix}-${timestamp}-${rand}-${req.index ?? 0}.${fileExt}`;
      const filePath = `public/${fileName}`;

      const { data, error } = await supabase.storage.from('product_images').createSignedUploadUrl(filePath);
      if (error || !data?.signedUrl) {
        return { success: false, message: `Lỗi chuẩn bị upload ảnh: ${error?.message || 'Không thể tạo link tải ảnh'}` };
      }

      const publicUrl = supabase.storage.from('product_images').getPublicUrl(filePath).data.publicUrl;

      urls.push({
        signedUrl: data.signedUrl,
        publicUrl,
        isMain: !!req.isMain,
        index: req.index ?? 0,
        fileName
      });
    }

    return { success: true, urls };
  } catch (error: any) {
    return { success: false, message: 'Lỗi máy chủ: ' + error.message };
  }
}

export async function createProductDirectAction(data: {
  name: string;
  slug: string;
  city?: string;
  short_description?: string;
  description?: string;
  price: number;
  stock: number;
  status: string;
  image_url?: string | null;
  additional_images?: string[];
}) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== 'admin') {
      return { success: false, message: 'Unauthorized' };
    }

    const supabase = getSupabaseServer();

    if (!data.name || !data.name.trim()) {
      return { success: false, message: 'Tên sản phẩm là bắt buộc.' };
    }

    const rawSlug = (data.slug && data.slug.trim()) ? data.slug.trim() : data.name.trim();
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
      return { success: false, message: 'Slug không hợp lệ. Vui lòng nhập tên hoặc slug có chữ/số.' };
    }

    let finalSlug = cleanSlug;
    const { data: existingSlug } = await supabase.from('mm_products').select('id').eq('slug', cleanSlug).maybeSingle();
    if (existingSlug) {
      finalSlug = `${cleanSlug}-${Date.now().toString().slice(-4)}`;
    }

    const payload = {
      name: data.name.trim(),
      slug: finalSlug,
      city: data.city ? data.city.trim() : 'Việt Nam',
      short_description: data.short_description ? data.short_description.trim() : '',
      description: data.description ? data.description.trim() : '',
      price: Number(data.price) || 0,
      stock: Number(data.stock) || 0,
      status: data.status || 'draft',
      image_url: data.image_url || null,
      additional_images: Array.isArray(data.additional_images) ? data.additional_images : []
    };

    const { error: insertError } = await supabase.from('mm_products').insert([payload]);
    if (insertError) {
      return { success: false, message: 'Lỗi lưu sản phẩm: ' + insertError.message };
    }

    revalidatePath('/admin/products');
    revalidatePath('/collection');
    revalidatePath(`/collection/${finalSlug}`);
    revalidatePath('/');

    return {
      success: true,
      message: 'Thêm sản phẩm Blind Box thành công!',
      slug: finalSlug
    };
  } catch (error: any) {
    return { success: false, message: 'Lỗi hệ thống: ' + error.message };
  }
}

export async function updateProductDirectAction(data: {
  id: string;
  name: string;
  slug: string;
  city?: string;
  short_description?: string;
  description?: string;
  price: number;
  stock: number;
  status: string;
  image_url?: string | null;
  additional_images?: string[];
}) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== 'admin') {
      return { success: false, message: 'Unauthorized' };
    }

    const supabase = getSupabaseServer();

    if (!data.id || !data.name || !data.slug) {
      return { success: false, message: 'ID, Tên và Slug là bắt buộc.' };
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
      .from('mm_products')
      .select('id')
      .eq('slug', cleanSlug)
      .neq('id', data.id)
      .maybeSingle();

    if (existingSlug) {
      return { success: false, message: 'Slug này đã được sử dụng bởi sản phẩm khác.' };
    }

    const payload = {
      name: data.name.trim(),
      slug: cleanSlug,
      city: data.city ? data.city.trim() : 'Việt Nam',
      short_description: data.short_description ? data.short_description.trim() : '',
      description: data.description ? data.description.trim() : '',
      price: Number(data.price) || 0,
      stock: Number(data.stock) || 0,
      status: data.status || 'draft',
      image_url: data.image_url ?? null,
      additional_images: Array.isArray(data.additional_images) ? data.additional_images : []
    };

    const { error: updateError } = await supabase.from('mm_products').update(payload).eq('id', data.id);
    if (updateError) {
      return { success: false, message: 'Lỗi cập nhật sản phẩm: ' + updateError.message };
    }

    revalidatePath('/admin/products');
    revalidatePath('/collection');
    revalidatePath(`/collection/${cleanSlug}`);
    revalidatePath('/');

    return {
      success: true,
      message: 'Cập nhật sản phẩm thành công!',
      slug: cleanSlug
    };
  } catch (error: any) {
    return { success: false, message: 'Lỗi hệ thống: ' + error.message };
  }
}

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
    const additionalImagesFiles = formData.getAll('additional_images') as File[];

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

    let additional_images: string[] = [];
    if (additionalImagesFiles && additionalImagesFiles.length > 0) {
      for (let i = 0; i < additionalImagesFiles.length; i++) {
        const file = additionalImagesFiles[i];
        if (file.size > 0) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${slug}-additional-${Date.now()}-${i}.${fileExt}`;
          const { error: uploadError } = await supabase.storage
            .from('product_images')
            .upload(`public/${fileName}`, file);
          if (!uploadError) {
            const { data: publicUrlData } = supabase.storage
              .from('product_images')
              .getPublicUrl(`public/${fileName}`);
            additional_images.push(publicUrlData.publicUrl);
          }
        }
      }
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
      image_url,
      additional_images
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
export async function editProductAction(prevState: any, formData: FormData) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== 'admin') {
      return { success: false, message: 'Unauthorized' };
    }

    const supabase = getSupabaseServer();

    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const city = formData.get('city') as string;
    const short_description = formData.get('short_description') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string || '0');
    const stock = parseInt(formData.get('stock') as string || '0');
    const status = formData.get('status') as string;
    const imageFile = formData.get('image') as File;
    const additionalImagesFiles = formData.getAll('additional_images') as File[];

    if (!id || !name || !slug) {
      return { success: false, message: 'ID, Tên và Slug là bắt buộc.' };
    }

    const productPayload: any = {
      name,
      slug,
      city,
      short_description,
      description,
      price,
      stock,
      status,
    };

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
        
      productPayload.image_url = publicUrlData.publicUrl;
    }

    let additional_images: string[] = [];
    if (additionalImagesFiles && additionalImagesFiles.length > 0) {
      for (let i = 0; i < additionalImagesFiles.length; i++) {
        const file = additionalImagesFiles[i];
        if (file.size > 0) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${slug}-additional-${Date.now()}-${i}.${fileExt}`;
          const { error: uploadError } = await supabase.storage
            .from('product_images')
            .upload(`public/${fileName}`, file);
          if (!uploadError) {
            const { data: publicUrlData } = supabase.storage
              .from('product_images')
              .getPublicUrl(`public/${fileName}`);
            additional_images.push(publicUrlData.publicUrl);
          }
        }
      }
    }

    if (additional_images.length > 0) {
      productPayload.additional_images = additional_images;
    }

    const { error: updateError } = await supabase.from('mm_products').update(productPayload).eq('id', id);

    if (updateError) {
      console.error('Update Error:', updateError);
      return { success: false, message: 'Lỗi cập nhật sản phẩm: ' + updateError.message };
    }

  } catch (error: any) {
    console.error('Edit Product Exception:', error);
    return { success: false, message: 'Lỗi hệ thống: ' + error.message };
  }

  revalidatePath('/admin/products');
  revalidatePath('/collection');
  revalidatePath('/');
  redirect('/admin/products');
}

export async function deleteProductAction(id: string) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== 'admin') {
      return { success: false, message: 'Unauthorized' };
    }

    const supabase = getSupabaseServer();
    const { error } = await supabase.from('mm_products').delete().eq('id', id);
    
    if (error) {
      return { success: false, message: error.message };
    }
    
    revalidatePath('/admin/products', 'layout');
    revalidatePath('/collection', 'layout');
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
