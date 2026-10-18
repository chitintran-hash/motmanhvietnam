'use server';

import { getSupabaseServer } from '@/lib/supabase-server';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

const DEFAULT_MAP_CONFIG = {
  cities: {
    'Hà Nội': {
      id: 'hanoi',
      title: 'Hà Nội',
      subtitle: 'Một mảnh miền Bắc',
      description: 'Hà Nội lưu giữ những lớp ký ức nằm giữa phố cũ, hàng quán, tiếng rao và những biểu tượng đã trở thành một phần đời sống người Việt.',
      exploreText: 'KHÁM PHÁ HÀ NỘI',
      totalStories: 12,
      coords: { top: '17%', left: '42.5%' },
      unlockCodes: ['HANOI', 'HN', 'HOGUOM', 'PHOCO'],
      stories: [
        {
          id: 'hn-1',
          title: 'Hồ Gươm',
          desc: 'Một biểu tượng nằm giữa nhịp sống của Hà Nội.',
          img: 'https://rcecvmzweeoavlbwnjxn.supabase.co/storage/v1/object/public/team_images/public/map-ho-guom.jpg',
          code: 'HOGUOM',
          isFeatured: true
        },
        {
          id: 'hn-2',
          title: 'Phố cổ Hà Nội',
          desc: 'Những con phố nhỏ lưu giữ ký ức đô thị qua nhiều thế hệ.',
          img: 'https://rcecvmzweeoavlbwnjxn.supabase.co/storage/v1/object/public/team_images/public/map-pho-co.jpg',
          code: 'PHOCO',
          isFeatured: false
        },
        {
          id: 'hn-3',
          title: 'Cà phê vỉa hè',
          desc: 'Một thói quen đời thường nhưng rất Hà Nội.',
          img: 'https://rcecvmzweeoavlbwnjxn.supabase.co/storage/v1/object/public/team_images/public/map-ca-phe-via-he.jpg',
          code: 'CAPHEVIAHE',
          isFeatured: false
        }
      ]
    },
    'Đà Nẵng': {
      id: 'danang',
      title: 'Đà Nẵng',
      subtitle: 'Một mảnh miền Trung',
      description: 'Thành phố nơi nhịp sống hiện đại gặp biển, núi và những ký ức miền Trung.',
      exploreText: 'KHÁM PHÁ ĐÀ NẴNG',
      totalStories: 8,
      coords: { top: '57%', left: '70%' },
      unlockCodes: ['DANANG', 'DN', 'CAURONG', 'MYKHE'],
      stories: [
        {
          id: 'dn-1',
          title: 'Cầu Rồng',
          desc: 'Biểu tượng mới của thành phố biển.',
          img: 'https://rcecvmzweeoavlbwnjxn.supabase.co/storage/v1/object/public/team_images/public/map-cau-rong.jpg',
          code: 'CAURONG',
          isFeatured: true
        },
        {
          id: 'dn-2',
          title: 'Biển Mỹ Khê',
          desc: 'Nơi đón những tia nắng sớm miền Trung.',
          img: 'https://rcecvmzweeoavlbwnjxn.supabase.co/storage/v1/object/public/team_images/public/map-bien-my-khe.jpg',
          code: 'MYKHE',
          isFeatured: false
        },
        {
          id: 'dn-3',
          title: 'Mì Quảng',
          desc: 'Hương vị đậm đà không thể trộn lẫn.',
          img: 'https://rcecvmzweeoavlbwnjxn.supabase.co/storage/v1/object/public/team_images/public/map-mi-quang.jpg',
          code: 'MIQUANG',
          isFeatured: false
        }
      ]
    },
    'Thành phố Hồ Chí Minh': {
      id: 'hcm',
      title: 'Thành phố Hồ Chí Minh',
      subtitle: 'Một mảnh miền Nam',
      description: 'Những mảnh ký ức của một thành phố luôn chuyển động, nơi cũ và mới tồn tại cạnh nhau.',
      exploreText: 'KHÁM PHÁ SÀI GÒN',
      totalStories: 15,
      coords: { top: '78.5%', left: '50.5%' },
      unlockCodes: ['HCM', 'SAIGON', 'BENTHANH', 'CAPHESUADA', 'BANHMI'],
      stories: [
        {
          id: 'sg-1',
          title: 'Chợ Bến Thành',
          desc: 'Nhịp đập giao thương không ngủ.',
          img: 'https://rcecvmzweeoavlbwnjxn.supabase.co/storage/v1/object/public/team_images/public/map-ben-thanh.jpg',
          code: 'BENTHANH',
          isFeatured: true
        },
        {
          id: 'sg-2',
          title: 'Cà phê sữa đá',
          desc: 'Vị ngọt đắng quen thuộc mỗi sáng.',
          img: 'https://rcecvmzweeoavlbwnjxn.supabase.co/storage/v1/object/public/team_images/public/map-ca-phe-sua-da.jpg',
          code: 'CAPHESUADA',
          isFeatured: false
        },
        {
          id: 'sg-3',
          title: 'Xe bánh mì',
          desc: 'Bữa ăn nhanh của nhịp sống hiện đại.',
          img: 'https://rcecvmzweeoavlbwnjxn.supabase.co/storage/v1/object/public/team_images/public/map-xe-banh-mi.jpg',
          code: 'BANHMI',
          isFeatured: false
        }
      ]
    }
  }
};

export async function getMapConfigAction() {
  try {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase.storage
      .from('team_images')
      .download('public/digital-map-config.json');

    if (error || !data) {
      return { success: true, config: DEFAULT_MAP_CONFIG };
    }

    const text = await data.text();
    const parsed = JSON.parse(text);
    return { success: true, config: parsed || DEFAULT_MAP_CONFIG };
  } catch (error: any) {
    return { success: true, config: DEFAULT_MAP_CONFIG };
  }
}

export async function saveMapConfigAction(config: any) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== 'admin') {
      return { success: false, message: 'Unauthorized' };
    }

    const supabase = getSupabaseServer();
    const jsonStr = JSON.stringify(config, null, 2);

    const { error } = await supabase.storage
      .from('team_images')
      .upload('public/digital-map-config.json', jsonStr, {
        contentType: 'application/json',
        upsert: true
      });

    if (error) {
      return { success: false, message: 'Lỗi lưu cấu hình bản đồ: ' + error.message };
    }

    revalidatePath('/map');
    revalidatePath('/admin/map');

    return { success: true, message: 'Cập nhật Bản Đồ Di Sản thành công!' };
  } catch (error: any) {
    return { success: false, message: 'Lỗi hệ thống: ' + error.message };
  }
}

export async function getMapImageSignedUploadUrlAction(fileName: string, fileType: string) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== 'admin') {
      return { success: false, message: 'Unauthorized' };
    }

    const supabase = getSupabaseServer();
    const rawExt = fileName.split('.').pop() || 'jpg';
    const fileExt = rawExt.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
    const timestamp = Date.now();
    const rand = Math.random().toString(36).substring(2, 7);
    const targetName = `map-item-${timestamp}-${rand}.${fileExt}`;
    const filePath = `public/${targetName}`;

    const { data, error } = await supabase.storage.from('team_images').createSignedUploadUrl(filePath);
    if (error || !data?.signedUrl) {
      return { success: false, message: `Lỗi tạo link upload: ${error?.message || 'Không thể tạo link'}` };
    }

    const publicUrl = supabase.storage.from('team_images').getPublicUrl(filePath).data.publicUrl;

    return {
      success: true,
      signedUrl: data.signedUrl,
      publicUrl,
      filePath
    };
  } catch (error: any) {
    return { success: false, message: 'Lỗi hệ thống: ' + error.message };
  }
}
