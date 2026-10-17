'use client';

import { useActionState, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { updateStoryAction } from '../../actions';
import Link from 'next/link';
import { ArrowLeft, Upload, ExternalLink, X, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function EditStoryForm({ story }: { story: any }) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(updateStoryAction, undefined);
  const [coverPreview, setCoverPreview] = useState<string | null>(story.image_url || null);
  const [existingAdditional, setExistingAdditional] = useState<string[]>(story.additional_images || []);
  const [newAdditionalPreviews, setNewAdditionalPreviews] = useState<string[]>([]);

  useEffect(() => {
    if (state?.success) {
      const timer = setTimeout(() => {
        router.push('/admin/stories');
        router.refresh();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [state, router]);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCoverPreview(event.target?.result as string);
      };
      reader.onerror = () => {
        setCoverPreview(URL.createObjectURL(file));
      };
      reader.readAsDataURL(file);
    } else {
      setCoverPreview(null);
    }
  };

  const handleRemoveCover = () => {
    setCoverPreview(null);
  };

  const handleRemoveExistingAdditional = (indexToRemove: number) => {
    setExistingAdditional(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleNewAdditionalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileList = Array.from(files);
      const newUrls: string[] = [];
      let loaded = 0;
      fileList.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          newUrls[index] = event.target?.result as string;
          loaded++;
          if (loaded === fileList.length) {
            setNewAdditionalPreviews([...newUrls]);
          }
        };
        reader.onerror = () => {
          newUrls[index] = URL.createObjectURL(file);
          loaded++;
          if (loaded === fileList.length) {
            setNewAdditionalPreviews([...newUrls]);
          }
        };
        reader.readAsDataURL(file);
      });
    } else {
      setNewAdditionalPreviews([]);
    }
  };

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
        <form action={formAction} className="space-y-8">
          <input type="hidden" name="id" value={story.id} />
          <input type="hidden" name="existing_cover_url" value={coverPreview || ''} />
          <input type="hidden" name="existing_additional_images" value={JSON.stringify(existingAdditional)} />

          {/* Thông báo trạng thái ở đầu form */}
          {state?.message && (
            <div className={`p-4 rounded-xl text-sm font-semibold flex items-center gap-2.5 ${state.success ? 'bg-emerald-50 text-emerald-800 border-2 border-emerald-300' : 'bg-red-50 text-red-600 border border-red-200'}`}>
              {state.success ? (
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
              )}
              <span>
                {state.message}
                {state.success && ' Đang tự động chuyển hướng về danh sách bài viết...'}
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
                  Tiêu đề bài viết *
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
                  * <span className="font-bold text-foreground">[anh1]</span> tương ứng với ảnh thứ nhất, <span className="font-bold text-foreground">[anh2]</span> là ảnh thứ hai,... Ảnh sẽ hiện to giữa bài viết theo đúng vị trí bạn đặt.
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
                placeholder="VD: Hà Nội, Sài Gòn..."
                className="w-full px-4 py-3 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors" 
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground/80 mb-2 uppercase tracking-wider">
                Trạng thái hiển thị
              </label>
              <select 
                name="status" 
                defaultValue={story.status || 'published'} 
                className="w-full px-4 py-3 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors"
              >
                <option value="published">Xuất bản (Hiển thị công khai)</option>
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
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-foreground/10 bg-black/5">
                      <img 
                        src={coverPreview} 
                        alt="Ảnh bìa bài viết" 
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold uppercase tracking-wider pointer-events-none">
                        Nhấn để đổi ảnh khác
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
                        <div key={i} className="relative aspect-video rounded-lg overflow-hidden border border-foreground/10 group bg-black/5">
                          <img 
                            src={img} 
                            alt={`Ảnh hiện có ${i + 1}`} 
                            className="w-full h-full object-cover" 
                          />
                          <span className="absolute top-1 left-1 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                            [anh{i + 1}]
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveExistingAdditional(i)}
                            className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
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
                          <div key={i} className="relative aspect-video rounded-lg overflow-hidden border border-foreground/10 bg-black/5">
                            <img 
                              src={preview} 
                              alt={`Ảnh mới ${i + 1}`} 
                              className="w-full h-full object-cover" 
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

          {/* Dual status warning above submit button */}
          {state?.message && (
            <div className={`p-4 rounded-xl text-sm font-semibold flex items-center gap-2.5 ${state.success ? 'bg-emerald-50 text-emerald-800 border-2 border-emerald-300' : 'bg-red-50 text-red-600 border border-red-200'}`}>
              {state.success ? (
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
              )}
              <span>
                {state.message}
                {state.success && ' Đang tự động chuyển hướng về danh sách bài viết...'}
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
              disabled={isPending || state?.success} 
              className="bg-primary-red text-white px-8 py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-primary-red/90 transition-colors disabled:opacity-50 text-sm shadow-md flex items-center gap-2 cursor-pointer"
            >
              {state?.success ? 'Đã lưu thành công!' : isPending ? 'Đang lưu bài viết và tải ảnh...' : 'Lưu bài viết'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
