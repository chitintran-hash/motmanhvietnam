'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RotateCcw, ArrowLeft } from 'lucide-react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Admin route error:', error);
  }, [error]);

  return (
    <div className="min-h-[500px] flex items-center justify-center p-6">
      <div className="bg-white border-2 border-foreground/10 rounded-2xl p-8 max-w-lg w-full text-center shadow-md">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-display font-black text-foreground uppercase tracking-wider mb-2">
          Đã xảy ra sự cố
        </h2>
        <p className="text-foreground/70 text-sm mb-6 leading-relaxed">
          {error?.message || 'Không thể tải trang này. Dữ liệu của bạn có thể đã được lưu thành công.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-terracotta text-white rounded-xl font-bold uppercase text-xs tracking-wider hover:bg-terracotta-hover transition-colors shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            Thử tải lại
          </button>
          <Link
            href="/admin/stories"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-foreground/20 rounded-xl font-bold uppercase text-xs tracking-wider text-foreground hover:bg-foreground/5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Về danh sách bài viết
          </Link>
        </div>
      </div>
    </div>
  );
}
