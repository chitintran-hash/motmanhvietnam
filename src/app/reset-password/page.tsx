"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabase-client";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Supabase JS will automatically parse the #access_token from the URL
    // and establish a session in the browser. We can verify if we have a session.
    const checkSession = async () => {
      const { data: { session } } = await supabaseClient.auth.getSession();
      if (!session) {
        // If there's no session, it means the link might be invalid or expired.
        // Wait a small bit because sometimes the token is parsed slightly after mount.
        setTimeout(async () => {
          const { data: { session: delayedSession } } = await supabaseClient.auth.getSession();
          if (!delayedSession) {
             setError("Link khôi phục không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu lại.");
          }
        }, 1000);
      }
    };
    checkSession();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Mật khẩu mới cần có ít nhất 6 ký tự.");
      return;
    }

    setLoading(true);
    setError("");

    const { error } = await supabaseClient.auth.updateUser({
      password: password
    });

    if (error) {
      console.error("Reset Password Error:", error);
      setError("Đã có lỗi xảy ra khi cập nhật mật khẩu. Link khôi phục có thể đã hết hạn.");
      setLoading(false);
    } else {
      // Sign out so they can log in via NextAuth with the new password
      await supabaseClient.auth.signOut();
      router.push('/login?reset=true');
    }
  };

  return (
    <div className="min-h-screen pt-40 pb-24 flex items-center justify-center bg-background">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-foreground/5">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-foreground">Đặt Mật Khẩu Mới</h1>
          <p className="text-foreground/60 mt-2 font-light">Vui lòng nhập mật khẩu mới cho tài khoản của bạn</p>
        </div>

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1">Mật khẩu mới</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              minLength={6}
              className="w-full px-4 py-3 rounded-lg border border-foreground/20 focus:outline-none focus:border-terracotta transition-colors"
              placeholder="Ít nhất 6 ký tự"
            />
          </div>

          {error && (
            <div className="text-terracotta text-sm text-center bg-terracotta/10 p-2 rounded">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 bg-foreground text-white rounded-full font-medium hover:bg-terracotta transition-colors mt-4 disabled:opacity-50"
          >
            {loading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
          </button>
        </form>
      </div>
    </div>
  );
}
