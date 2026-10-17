'use client';

import { useActionState, useState, useEffect, startTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createStoryAction } from '../actions';
import { optimizeImageFile, optimizeImageFiles } from '@/lib/image-optimizer';
import Link from 'next/link';
import { ArrowLeft, Image as ImageIcon, Upload, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

export default function NewStoryPage() {
  const router = useRouter();
  const [errorMessage, formAction, isPending] = useActionState(createStoryAction, undefined);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugCustomized, setIsSlugCustomized] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [additionalPreviews, setAdditionalPreviews] = useState<string[]>([]);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [additionalFiles, setAdditionalFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (errorMessage?.success) {
      const timer = setTimeout(() => {
        router.push('/admin/stories');
        router.refresh();
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [errorMessage, router]);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!isSlugCustomized) {
      setSlug(generateSlug(val));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value);
    setIsSlugCustomized(true);
  };

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverPreview(URL.createObjectURL(file));
      // Tự động tối ưu ảnh dung lượng lớn ở chế độ nền
      const optimized = await optimizeImageFile(file);
      setCoverFile(optimized);
    } else {
      setCoverFile(null);
      setCoverPreview(null);
    }
  };

  const handleAdditionalChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileList = Array.from(files);
      const urls = fileList.map(f => URL.createObjectURL(f));
      setAdditionalPreviews(urls);
      // Tự động tối ưu các ảnh phụ ở chế độ nền
      const optimizedList = await optimizeImageFiles(fileList);
      setAdditionalFiles(optimizedList);
    } else {
      setAdditionalFiles([]);
      setAdditionalPreviews([]);
    }
  };

  const handleFormSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      // Thay thế ảnh bìa bằng bản đã được tối ưu nếu có
      let finalCover = coverFile;
      const inputCover = formData.get('image_url') as File | null;
      if (!finalCover && inputCover && inputCover.size > 0) {
        finalCover = await optimizeImageFile(inputCover);
      }
      if (finalCover && finalCover.size > 0) {
        formData.set('image_url', finalCover);
      }

      // Thay thế ảnh phụ bằng bản đã được tối ưu nếu có
      let finalAdditional = additionalFiles;
      const inputAdditionals = formData.getAll('additional_images') as File[];
      if (finalAdditional.length === 0 && inputAdditionals.length > 0 && inputAdditionals[0].size > 0) {
        finalAdditional = await optimizeImageFiles(inputAdditionals);
      }
      if (finalAdditional.length > 0) {
        formData.delete('additional_images');
        for (const f of finalAdditional) {
          formData.append('additional_images', f);
        }
      }

      startTransition(() => {
        formAction(formData);
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isBusy = isPending || isSubmitting;

  return (
    <div className="p-6 md:p-8 w-full max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/stories" className="p-2 bg-white rounded-full border border-foreground/10 hover:bg-background-alt transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-display font-black text-foreground uppercase tracking-wider">Thêm Bài Viết Mới</h1>
      </div>

      <div className="bg-white rounded-2xl border-2 border-foreground/10 shadow-[4px_4px_0px_rgba(0,0,0,0.05)] p-6 md:p-8">
        <form action={handleFormSubmit} className="space-y-8">
          {errorMessage?.message && (
            <div className={`p-4 rounded-xl text-sm font-semibold flex items-center gap-2.5 ${errorMessage.success ? 'bg-emerald-50 text-emerald-800 border-2 border-emerald-300' : 'bg-red-50 text-red-600 border border-red-200'}`}>
              {errorMessage.success ? (
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 animate-bounce" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0" />
              )}
              <span>
                {errorMessage.message}
                {errorMessage.success && ' Đang tự động chuyển hướng về danh sách bài viết...'}
              </span>
            </div>
          )}

          <div>
            <h2 className="text-xl font-bold uppercase tracking-widest mb-4 border-b-2 border-foreground/10 pb-2">Nội dung chính</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-foreground/80 mb-2 uppercase tracking-wider">Tiêu đề *</label>
                <input 
                  type="text" 
                  name="title" 
                  required 
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="Nhập tiêu đề bài viết..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors" 
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-bold text-foreground/80 uppercase tracking-wider">Slug (Đường dẫn bài viết)</label>
                  <button 
                    type="button" 
                    onClick={() => { setSlug(generateSlug(title)); setIsSlugCustomized(false); }}
                    className="text-xs text-terracotta font-bold hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" /> Tự động tạo lại từ tiêu đề
                  </button>
                </div>
                <input 
                  type="text" 
                  name="slug" 
                  value={slug}
                  onChange={handleSlugChange}
                  placeholder="vi-du-duong-dan-bai-viet"
                  className="w-full px-4 py-3 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors font-mono text-sm" 
                />
                <p className="text-xs text-foreground/50 mt-1.5">
                  Đường dẫn hiển thị trên trình duyệt (vd: /story-hub/{slug || 'tieu-de-bai-viet'}). Có thể để trống để hệ thống tự tạo.
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-foreground/80 mb-2 uppercase tracking-wider">Đoạn trích (Excerpt)</label>
                <textarea name="excerpt" rows={3} placeholder="Tóm tắt ngắn gọn bài viết..." className="w-full px-4 py-3 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors"></textarea>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-bold text-foreground/80 uppercase tracking-wider">Nội dung chi tiết *</label>
                  <span className="text-xs font-bold text-terracotta bg-terracotta/10 px-2.5 py-1 rounded-full">
                    💡 Mẹo chèn ảnh: Gõ [anh1], [anh2] vào vị trí muốn hiện ảnh
                  </span>
                </div>
                <textarea 
                  name="content" 
                  rows={14} 
                  required
                  placeholder="Nhập nội dung bài viết...&#10;&#10;Đoạn văn mở đầu...&#10;&#10;[anh1]&#10;&#10;Đoạn văn tiếp theo giải thích về bức ảnh...&#10;&#10;[anh2]"
                  className="w-full px-4 py-3 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors font-medium text-sm leading-relaxed"
                ></textarea>
                <p className="text-xs text-foreground/60 mt-2">
                  * <span className="font-bold text-foreground">[anh1]</span> tương ứng với ảnh thứ nhất trong ô "Ảnh kèm theo bài viết", <span className="font-bold text-foreground">[anh2]</span> là ảnh thứ hai,... Ảnh sẽ hiện to giữa bài viết như báo chí.
                </p>
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
                <select name="status" defaultValue="published" className="w-full px-4 py-3 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors">
                  <option value="published">Xuất bản (Hiển thị ngay trên web)</option>
                  <option value="draft">Bản nháp (Chỉ Admin xem trước được)</option>
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
                    <input type="file" name="additional_images" accept="image/*" multiple onChange={handleAdditionalChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    {additionalPreviews.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2 w-full mt-2">
                        {additionalPreviews.map((preview, i) => (
                          <div key={i} className="relative w-full aspect-video rounded-lg overflow-hidden border border-foreground/10">
                            <Image src={preview} alt={`Preview ${i}`} fill className="object-cover" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-foreground/40 mb-2" />
                        <span className="text-sm font-medium text-foreground/60">Tải nhiều ảnh lên</span>
                      </>
                    )}
                  </div>
                </div>
             </div>
          </div>

          {/* Dual error warning above submit button */}
          {errorMessage?.message && (
            <div className={`p-4 rounded-xl text-sm font-semibold flex items-center gap-2.5 ${errorMessage.success ? 'bg-emerald-50 text-emerald-800 border-2 border-emerald-300' : 'bg-red-50 text-red-600 border border-red-200'}`}>
              {errorMessage.success ? (
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 animate-bounce" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0" />
              )}
              <span>
                {errorMessage.message}
                {errorMessage.success && ' Đang tự động chuyển hướng về danh sách bài viết...'}
              </span>
            </div>
          )}

          <div className="flex justify-end pt-6 border-t border-foreground/10">
            <button type="submit" disabled={isBusy || errorMessage?.success} className="bg-foreground text-white px-8 py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-terracotta transition-colors disabled:opacity-50 shadow-md">
              {errorMessage?.success ? 'Đã lưu thành công!' : isBusy ? 'Đang lưu bài viết và tải ảnh...' : 'Lưu bài viết'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
