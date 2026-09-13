"use client";
import { useActionState } from "react";
import { resetPassword } from "@/app/lib/actions";

export default function ResetPasswordPage() {
  const [errorMessage, formAction, isPending] = useActionState(resetPassword, undefined);

  return (
    <div className="min-h-screen pt-40 pb-24 flex items-center justify-center bg-background">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-foreground/5">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-foreground">Đặt Mật Khẩu Mới</h1>
          <p className="text-foreground/60 mt-2 font-light">Vui lòng nhập mật khẩu mới cho tài khoản của bạn</p>
        </div>

        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1">Mật khẩu mới</label>
            <input 
              type="password" 
              name="password"
              required 
              minLength={6}
              className="w-full px-4 py-3 rounded-lg border border-foreground/20 focus:outline-none focus:border-terracotta transition-colors"
              placeholder="Ít nhất 6 ký tự"
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
            {isPending ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
          </button>
        </form>
      </div>
    </div>
  );
}
