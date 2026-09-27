'use client';

import { useActionState, useState } from 'react';
import { createStoryAction } from '../actions';
import Link from 'next/link';
import { ArrowLeft, Image as ImageIcon, Upload } from 'lucide-react';
import Image from 'next/image';

export default function NewStoryPage() {
  const [errorMessage, formAction, isPending] = useActionState(createStoryAction, undefined);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setCoverPreview(URL.createObjectURL(file));
  };

  return (
    <div className="p-6 md:p-8 w-full max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/stories" className="p-2 bg-white rounded-full border border-foreground/10 hover:bg-background-alt transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-display font-black text-foreground uppercase tracking-wider">Thêm Bài Viết Mới</h1>
      </div>

      <div className="bg-white rounded-2xl border-2 border-foreground/10 shadow-[4px_4px_0px_rgba(0,0,0,0.05)] p-6 md:p-8">
        <form action={formAction} className="space-y-8">
          {errorMessage?.message && (
            <div className={`p-4 rounded-lg text-sm font-medium ${errorMessage.success ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
              {errorMessage.message}
            </div>
          )}

          <div>
            <h2 className="text-xl font-bold uppercase tracking-widest mb-4 border-b-2 border-foreground/10 pb-2">Nội dung chính</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-foreground/80 mb-2 uppercase tracking-wider">Tiêu đề *</label>
                <input type="text" name="title" required className="w-full px-4 py-3 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-bold text-foreground/80 mb-2 uppercase tracking-wider">Slug *</label>
                <input type="text" name="slug" required className="w-full px-4 py-3 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-bold text-foreground/80 mb-2 uppercase tracking-wider">Đoạn trích (Excerpt)</label>
                <textarea name="excerpt" rows={3} className="w-full px-4 py-3 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors"></textarea>
              </div>
              <div>
                <label className="block text-sm font-bold text-foreground/80 mb-2 uppercase tracking-wider">Nội dung chi tiết</label>
                <textarea name="content" rows={12} className="w-full px-4 py-3 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors"></textarea>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
                <label className="block text-sm font-bold text-foreground/80 mb-2 uppercase tracking-wider">Địa điểm</label>
                <input type="text" name="city" className="w-full px-4 py-3 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors" placeholder="VD: Hà Nội" />
             </div>
             <div>
                <label className="block text-sm font-bold text-foreground/80 mb-2 uppercase tracking-wider">Trạng thái</label>
                <select name="status" className="w-full px-4 py-3 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors">
                  <option value="published">Xuất bản</option>
                  <option value="draft">Bản nháp</option>
                </select>
             </div>
          </div>

          <div>
             <h2 className="text-xl font-bold uppercase tracking-widest mb-4 border-b-2 border-foreground/10 pb-2">Hình ảnh</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-foreground/80 mb-2 uppercase tracking-wider">Ảnh bìa</label>
                  <div className="border-2 border-dashed border-foreground/20 rounded-xl p-4 text-center relative hover:bg-foreground/5 transition-colors">
                    <input type="file" name="image_url" accept="image/*" onChange={handleCoverChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    {coverPreview ? (
                      <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                        <Image src={coverPreview} alt="Preview" fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="py-8 flex flex-col items-center">
                        <Upload className="w-8 h-8 text-foreground/40 mb-2" />
                        <span className="text-sm font-medium text-foreground/60">Tải ảnh lên</span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground/80 mb-2 uppercase tracking-wider">Ảnh kèm theo bài viết (Nhiều ảnh)</label>
                  <div className="border-2 border-dashed border-foreground/20 rounded-xl p-4 text-center relative hover:bg-foreground/5 transition-colors h-full flex flex-col items-center justify-center min-h-[150px]">
                    <input type="file" name="additional_images" accept="image/*" multiple className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <Upload className="w-8 h-8 text-foreground/40 mb-2" />
                    <span className="text-sm font-medium text-foreground/60">Tải nhiều ảnh lên</span>
                  </div>
                </div>
             </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-foreground/10">
            <button type="submit" disabled={isPending} className="bg-foreground text-white px-8 py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-terracotta transition-colors disabled:opacity-50">
              {isPending ? 'Đang lưu...' : 'Lưu bài viết'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
