'use server'

import { signIn, signOut } from '@/auth'
import { AuthError } from 'next-auth'
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getSupabaseServer } from '@/lib/supabase-server';

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        return `LỖI HỆ THỐNG: Chưa cấu hình biến môi trường Supabase.`;
    }

    try {
        await signIn('credentials', {
            ...Object.fromEntries(formData),
            redirectTo: '/',
        });
    } catch (error: any) {
        if (error instanceof AuthError) {
            if (error.cause?.err?.message?.includes("Email chưa được xác thực")) {
                return error.cause.err.message;
            }
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Email hoặc mật khẩu không đúng.'
                default:
                    return 'Đã có lỗi xảy ra.'
            }
        }
        throw error;
    }
}

export async function handleSignOut() {
    await signOut({ redirectTo: '/' })
}

export async function register(prevState: string | undefined, formData: FormData) {
    try {
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        
        if (!email || !password || !name) {
            return 'Vui lòng điền đầy đủ thông tin.';
        }

        if (password.length < 6) {
            return 'Mật khẩu cần có ít nhất 6 ký tự.';
        }

        const supabaseAdmin = getSupabaseServer();
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

        const { data: authData, error: authError } = await supabaseAdmin.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name,
                    role: email.toLowerCase() === 'tranchitin2006@gmail.com' ? 'admin' : 'customer'
                },
                emailRedirectTo: `${siteUrl}/login?verify=true`
            }
        });

        if (authError) {
            if (authError.message.includes('already registered') || authError.message.includes('User already registered') || authError.message.includes('already been registered')) {
                return 'Email này đã tồn tại. Vui lòng đăng nhập.';
            }
            throw authError;
        }

        if (authData.user && authData.user.identities && authData.user.identities.length === 0) {
            return 'Email này đã tồn tại. Vui lòng đăng nhập.';
        }

        if (authData.user) {
            // Tự động cấp quyền admin cho tranchitin2006@gmail.com
            const userRole = email.toLowerCase() === 'tranchitin2006@gmail.com' ? 'admin' : 'customer';

            const profilePayload: any = {
                id: authData.user.id,
                email: email,
                full_name: name,
                role: userRole,
            };
            
            const { error: profileError } = await supabaseAdmin
                .from('mm_profiles')
                .upsert([profilePayload]);

            if (profileError) {
                console.error("Profile Error", profileError)
            }
        }

    } catch (error: any) {
        console.error("Registration Exception:", error);
        
        const errMessage = error.message?.toLowerCase() || '';
        if (errMessage.includes('fetch failed') || errMessage.includes('failed to fetch') || errMessage.includes('econnrefused')) {
            return 'Không thể kết nối đến hệ thống. Vui lòng thử lại sau.';
        }

        return error.message || 'Đăng ký thất bại. Vui lòng thử lại.';
    }
    
    redirect('/login?verify=true');
}
