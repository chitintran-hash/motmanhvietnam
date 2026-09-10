import { createClient } from '@supabase/supabase-js';

export function getSupabaseServer() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        throw new Error("LỖI HỆ THỐNG: Bạn chưa cấu hình biến môi trường trên Vercel (NEXT_PUBLIC_SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY). Vui lòng kiểm tra Settings > Environment Variables.");
    }

    return createClient(url, key, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        }
    });
}
