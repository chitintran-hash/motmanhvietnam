"use client";
import { useState, useActionState } from "react";
import Link from "next/link";
import { authenticate } from "@/app/lib/actions";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered');

  return (
    <div className="min-h-screen pt-40 pb-24 flex items-center justify-center bg-background">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-foreground/5">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-foreground">Đăng Nhập</h1>
          <p className="text-foreground/60 mt-2 font-light">Chào mừng trở lại với Một Mảnh Việt Nam</p>
        </div>

        {registered && (
          <div className="bg-jade/10 text-jade p-3 rounded-lg mb-6 text-sm text-center">
            Đăng ký thành công! Vui lòng đăng nhập.
          </div>
        )}

        {searchParams.get('verify') === 'true' && (
          <div className="bg-jade/10 text-jade p-4 rounded-lg mb-6 text-sm text-center font-medium">
            Đăng ký thành công! Vui lòng kiểm tra Email của bạn để xác thực tài khoản trước khi đăng nhập.
          </div>
        )}

        <form action={formAction} className="space-y-4">
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
              className="w-full px-4 py-3 rounded-lg border border-foreground/20 focus:outline-none focus:border-terracotta transition-colors"
              placeholder="Nhập mật khẩu"
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
            {isPending ? 'Đang xử lý...' : 'Đăng Nhập'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-foreground/60">
          Chưa có tài khoản? <Link href="/register" className="text-terracotta font-medium hover:underline">Đăng ký ngay</Link>
        </div>
      </div>
    </div>
  );
}
