"use client";
import { useActionState } from "react";
import Link from "next/link";
import { forgotPassword } from "@/app/lib/actions";
import { useSearchParams } from "next/navigation";

export default function ForgotPasswordPage() {
  const [errorMessage, formAction, isPending] = useActionState(forgotPassword, undefined);
  const searchParams = useSearchParams();
  const success = searchParams.get('success');

  return (
    <div className="min-h-screen pt-40 pb-24 flex items-center justify-center bg-background">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-foreground/5">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-foreground">Quên Mật Khẩu</h1>
          <p className="text-foreground/60 mt-2 font-light">Nhập email để nhận link khôi phục</p>
        </div>

        {success === 'true' ? (
            <div className="text-center">
                <div className="bg-jade/10 text-jade p-4 rounded-lg mb-6 text-sm text-center font-medium">
                    Link khôi phục mật khẩu đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư đến (và thư mục rác).
                </div>
                <Link href="/login" className="inline-block px-6 py-3 bg-foreground text-white rounded-full font-medium hover:bg-terracotta transition-colors">
                    Trở về đăng nhập
                </Link>
            </div>
        ) : (
            <form action={formAction} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1">Email của bạn</label>
                <input 
                type="email" 
                name="email"
                required 
                className="w-full px-4 py-3 rounded-lg border border-foreground/20 focus:outline-none focus:border-terracotta transition-colors"
                placeholder="Ví dụ: name@example.com"
                />
            </div>

            {errorMessage && (
                <div className="text-terracotta text-sm text-center bg-terracotta/10 p-2 rounded">
                {errorMessage}
                </div>
            )}

            <button 
                type="submit" 
                disabled={isPending}
                className="w-full py-3 bg-foreground text-white rounded-full font-medium hover:bg-terracotta transition-colors mt-4 disabled:opacity-50"
            >
                {isPending ? 'Đang gửi...' : 'Gửi link khôi phục'}
            </button>
            
            <div className="mt-6 text-center text-sm text-foreground/60">
                Nhớ mật khẩu? <Link href="/login" className="text-terracotta font-medium hover:underline">Đăng nhập</Link>
            </div>
            </form>
        )}
      </div>
    </div>
  );
}
