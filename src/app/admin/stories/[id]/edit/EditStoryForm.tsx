'use client';

import { useActionState, useState, useEffect, startTransition } from 'react';
import { useRouter } from 'next/navigation';
import { updateStoryAction } from '../../actions';
import { optimizeImageFile, optimizeImageFiles } from '@/lib/image-optimizer';
import Link from 'next/link';
import { ArrowLeft, Upload, ExternalLink, X, Image as ImageIcon, AlertCircle, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

export default function EditStoryForm({ story }: { story: any }) {
  const router = useRouter();
  const [errorMessage, formAction, isPending] = useActionState(updateStoryAction, undefined);
  const [coverPreview, setCoverPreview] = useState<string | null>(story.image_url || null);
  const [existingAdditional, setExistingAdditional] = useState<string[]>(story.additional_images || []);
  const [newAdditionalPreviews, setNewAdditionalPreviews] = useState<string[]>([]);
  const [newCoverFile, setNewCoverFile] = useState<File | null>(null);
  const [newAdditionalFiles, setNewAdditionalFiles] = useState<File[]>([]);
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

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverPreview(URL.createObjectURL(file));
      // Tự động tối ưu ảnh dung lượng lớn ở chế độ nền
      const optimized = await optimizeImageFile(file);
      setNewCoverFile(optimized);
    } else {
      setNewCoverFile(null);
    }
  };

  const handleRemoveCover = () => {
    setCoverPreview(null);
    setNewCoverFile(null);
  };

  const handleRemoveExistingAdditional = (indexToRemove: number) => {
    setExistingAdditional(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleNewAdditionalChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileList = Array.from(files);
      const urls = fileList.map(file => URL.createObjectURL(file));
      setNewAdditionalPreviews(urls);
      // Tự động tối ưu các ảnh phụ mới ở chế độ nền
      const optimizedList = await optimizeImageFiles(fileList);
      setNewAdditionalFiles(optimizedList);
    } else {
      setNewAdditionalFiles([]);
      setNewAdditionalPreviews([]);
    }
  };

  const handleFormSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      // Thay thế ảnh bìa bằng bản đã được tối ưu nếu có
      let finalCover = newCoverFile;
      const inputCover = formData.get('image_url') as File | null;
      if (!finalCover && inputCover && inputCover.size > 0) {
        finalCover = await optimizeImageFile(inputCover);
      }
      if (finalCover && finalCover.size > 0) {
        formData.set('image_url', finalCover);
      }

      // Thay thế ảnh phụ bằng bản đã được tối ưu nếu có
      let finalAdditional = newAdditionalFiles;
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
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/stories" 
            className="p-2 bg-white rounded-full border border-foreground/10 hover:bg-background-alt transition-colors"
            title="Quay lại danh sách bài viết"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-display font-black text-foreground uppercase tracking-wider">
              Chỉnh Sửa Bài Viết
            </h1>
            <p className="text-xs text-foreground/60 mt-0.5">
              Cập nhật thông tin và hình ảnh cho bài viết Story Hub
            </p>
          </div>
        </div>

        <Link
          href={`/story-hub/${story.slug}`}
          target="_blank"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-foreground/10 rounded-xl text-xs font-bold text-terracotta hover:bg-terracotta/5 transition-colors"
        >
          <span>Xem bài viết trên web</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="bg-white rounded-2xl border-2 border-foreground/10 shadow-[4px_4px_0px_rgba(0,0,0,0.05)] p-6 md:p-8">
        <form action={handleFormSubmit} className="space-y-8">
          <input type="hidden" name="id" value={story.id} />
          <input type="hidden" name="existing_cover_url" value={coverPreview || ''} />
          <input type="hidden" name="existing_additional_images" value={JSON.stringify(existingAdditional)} />

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
            <h2 className="text-xl font-bold uppercase tracking-widest mb-4 border-b-2 border-foreground/10 pb-2">
              Nội dung chính
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-foreground/80 mb-2 uppercase tracking-wider">
                  Tiêu đề *
                </label>
                <input 
                  type="text" 
                  name="title" 
                  required 
                  defaultValue={story.title}
                  placeholder="Nhập tiêu đề bài viết..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors font-medium text-base" 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-foreground/80 mb-2 uppercase tracking-wider">
                  Slug (Đường dẫn bài viết) *
                </label>
                <input 
                  type="text" 
                  name="slug" 
                  required 
                  defaultValue={story.slug}
                  placeholder="vi-du-duong-dan-bai-viet"
                  className="w-full px-4 py-3 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors font-mono text-sm" 
                />
                <p className="text-xs text-foreground/50 mt-1.5">
                  Đường dẫn hiển thị trên thanh địa chỉ duyệt web (vd: /story-hub/{story.slug})
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-foreground/80 mb-2 uppercase tracking-wider">
                  Đoạn trích tóm tắt (Excerpt)
                </label>
                <textarea 
                  name="excerpt" 
                  rows={3} 
                  defaultValue={story.excerpt || ''}
                  placeholder="Đoạn văn tóm tắt ngắn hiển thị ở mặt sau thẻ bài hoặc đầu bài viết..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors text-sm"
                ></textarea>
              </div>

              <div>
                <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
                  <label className="block text-sm font-bold text-foreground/80 uppercase tracking-wider">
                    Nội dung chi tiết *
                  </label>
                  <span className="text-xs font-bold text-terracotta bg-terracotta/10 px-2.5 py-1 rounded-full">
                    💡 Mẹo chèn ảnh: Gõ [anh1], [anh2] vào vị trí muốn hiện ảnh
                  </span>
                </div>
                <textarea 
                  name="content" 
                  rows={14} 
                  required
                  defaultValue={story.content || ''}
                  placeholder="Nhập nội dung bài viết...&#10;&#10;Đoạn văn mở đầu...&#10;&#10;[anh1]&#10;&#10;Đoạn văn tiếp theo giải thích về bức ảnh...&#10;&#10;[anh2]"
                  className="w-full px-4 py-3 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors font-medium text-sm leading-relaxed"
                ></textarea>
                <p className="text-xs text-foreground/60 mt-2">
                  * <span className="font-bold text-foreground">[anh1]</span> tương ứng với ảnh thứ nhất trong ô "Ảnh kèm theo bài viết", <span className="font-bold text-foreground">[anh2]</span> là ảnh thứ hai,... Ảnh sẽ tự động hiển thị khổ lớn giữa bài viết chuẩn tỉ lệ 16:9.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-foreground/80 mb-2 uppercase tracking-wider">
                Địa điểm
              </label>
              <input 
                type="text" 
                name="city" 
                defaultValue={story.city || ''}
                placeholder="VD: Hà Nội, Sài Gòn, Đà Nẵng, Việt Nam"
                className="w-full px-4 py-3 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground/80 mb-2 uppercase tracking-wider">
                Trạng thái
              </label>
              <select 
                name="status" 
                defaultValue={story.status || 'published'}
                className="w-full px-4 py-3 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors font-medium"
              >
                <option value="published">Xuất bản (Hiển thị trên web)</option>
                <option value="draft">Bản nháp (Ẩn khỏi web)</option>
              </select>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold uppercase tracking-widest mb-4 border-b-2 border-foreground/10 pb-2">
              Hình ảnh
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cover Image */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-bold text-foreground/80 uppercase tracking-wider">
                    Ảnh bìa (Tỷ lệ 16:9)
                  </label>
                  {coverPreview && (
                    <button
                      type="button"
                      onClick={handleRemoveCover}
                      className="text-xs text-red-500 font-bold hover:underline"
                    >
                      Xóa ảnh
                    </button>
                  )}
                </div>
                <div className="border-2 border-dashed border-foreground/20 rounded-xl p-4 text-center relative hover:bg-foreground/5 transition-colors">
                  <input 
                    type="file" 
                    name="image_url" 
                    accept="image/*" 
                    onChange={handleCoverChange} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                  />
                  {coverPreview ? (
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-foreground/10">
                      <Image 
                        src={coverPreview} 
                        alt="Cover Preview" 
                        fill 
                        sizes="(max-width: 768px) 100vw, 400px"
                        className="object-cover" 
                        style={{ objectFit: 'cover', objectPosition: 'center' }}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold uppercase tracking-wider pointer-events-none">
                        Nhấn để đổi ảnh
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 flex flex-col items-center">
                      <Upload className="w-8 h-8 text-foreground/40 mb-2" />
                      <span className="text-sm font-medium text-foreground/60">Tải ảnh bìa mới</span>
                      <span className="text-xs text-foreground/40 mt-1">Định dạng JPG, PNG, WEBP</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Images */}
              <div>
                <label className="block text-sm font-bold text-foreground/80 mb-2 uppercase tracking-wider">
                  Ảnh kèm theo bài viết (Dùng với [anh1], [anh2]...)
                </label>
                
                {/* Existing Additional Images */}
                {existingAdditional.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-bold text-foreground/60 mb-2">
                      Ảnh hiện có ({existingAdditional.length}):
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {existingAdditional.map((img, i) => (
                        <div key={i} className="relative aspect-video rounded-lg overflow-hidden border border-foreground/10 group">
                          <Image 
                            src={img} 
                            alt={`Existing ${i}`} 
                            fill 
                            sizes="120px"
                            className="object-cover" 
                            style={{ objectFit: 'cover', objectPosition: 'center' }}
                          />
                          <span className="absolute top-1 left-1 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                            [anh{i + 1}]
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveExistingAdditional(i)}
                            className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-80 hover:opacity-100 transition-opacity"
                            title="Xóa ảnh này"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload More Additional Images */}
                <div className="border-2 border-dashed border-foreground/20 rounded-xl p-4 text-center relative hover:bg-foreground/5 transition-colors min-h-[140px] flex flex-col items-center justify-center">
                  <input 
                    type="file" 
                    name="additional_images" 
                    accept="image/*" 
                    multiple 
                    onChange={handleNewAdditionalChange} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                  />
                  {newAdditionalPreviews.length > 0 ? (
                    <div className="w-full">
                      <p className="text-xs font-bold text-emerald-600 mb-2">
                        +{newAdditionalPreviews.length} ảnh mới chọn tải thêm:
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {newAdditionalPreviews.map((preview, i) => (
                          <div key={i} className="relative aspect-video rounded-lg overflow-hidden border border-foreground/10">
                            <Image 
                              src={preview} 
                              alt={`New Preview ${i}`} 
                              fill 
                              sizes="120px"
                              className="object-cover" 
                              style={{ objectFit: 'cover', objectPosition: 'center' }}
                            />
                            <span className="absolute top-1 left-1 bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                              Mới
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-foreground/40 mb-2" />
                      <span className="text-sm font-medium text-foreground/60">
                        {existingAdditional.length > 0 ? 'Tải thêm ảnh mới' : 'Tải nhiều ảnh lên'}
                      </span>
                      <span className="text-xs text-foreground/40 mt-1">Giữ phím Ctrl / Cmd để chọn nhiều ảnh</span>
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

          <div className="flex items-center justify-between pt-6 border-t border-foreground/10">
            <Link 
              href="/admin/stories" 
              className="px-6 py-3 rounded-xl border border-foreground/20 text-foreground font-bold hover:bg-background-alt transition-colors text-sm"
            >
              Hủy bỏ
            </Link>
            <button 
              type="submit" 
              disabled={isBusy || errorMessage?.success} 
              className="bg-primary-red text-white px-8 py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-primary-red/90 transition-colors disabled:opacity-50 text-sm shadow-md"
            >
              {errorMessage?.success ? 'Đã lưu thành công!' : isBusy ? 'Đang lưu bài viết và tải ảnh...' : 'Lưu bài viết'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
