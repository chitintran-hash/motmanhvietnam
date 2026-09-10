"use client";
import { useActionState } from "react";
import Link from "next/link";
import { register } from "@/app/lib/actions";

export default function RegisterPage() {
  const [errorMessage, formAction, isPending] = useActionState(register, undefined);

  return (
    <div className="min-h-screen pt-40 pb-24 flex items-center justify-center bg-background">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-foreground/5">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-foreground">Đăng Ký</h1>
          <p className="text-foreground/60 mt-2 font-light">Tạo tài khoản Một Mảnh Việt Nam</p>
        </div>

        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1">Họ và tên</label>
            <input 
              type="text" 
              name="name"
              required 
              className="w-full px-4 py-3 rounded-lg border border-foreground/20 focus:outline-none focus:border-terracotta transition-colors"
              placeholder="Nhập họ và tên"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1">Email</label>
            <input 
              type="email" 
              name="email"
              required 
              className="w-full px-4 py-3 rounded-lg border border-foreground/20 focus:outline-none focus:border-terracotta transition-colors"
              placeholder="Nhập email của bạn"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1">Mật khẩu</label>
            <input 
              type="password" 
              name="password"
              required 
              minLength={6}
              className="w-full px-4 py-3 rounded-lg border border-foreground/20 focus:outline-none focus:border-terracotta transition-colors"
              placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
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
            {isPending ? 'Đang xử lý...' : 'Đăng Ký'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-foreground/60">
          Đã có tài khoản? <Link href="/login" className="text-terracotta font-medium hover:underline">Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
}
