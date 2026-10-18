'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getStorySignedUploadUrlsAction, updateStoryDirectAction } from '../../actions';
import Link from 'next/link';
import { ArrowLeft, Upload, ExternalLink, X, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function EditStoryForm({ story }: { story: any }) {
  const router = useRouter();

  const [title, setTitle] = useState(story.title || '');
  const [slug, setSlug] = useState(story.slug || '');
  const [excerpt, setExcerpt] = useState(story.excerpt || '');
  const [content, setContent] = useState(story.content || '');
  const [city, setCity] = useState(story.city || '');
  const [status, setStatus] = useState(story.status || 'published');

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(story.image_url || null);
  const [existingAdditional, setExistingAdditional] = useState<string[]>(story.additional_images || []);
  const [newAdditionalFiles, setNewAdditionalFiles] = useState<File[]>([]);
  const [newAdditionalPreviews, setNewAdditionalPreviews] = useState<string[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitProgress, setSubmitProgress] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<{ success: boolean; message: string } | null>(null);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setCoverPreview(event.target?.result as string);
      };
      reader.onerror = () => {
        setCoverPreview(URL.createObjectURL(file));
      };
      reader.readAsDataURL(file);
    } else {
      setCoverFile(null);
      setCoverPreview(story.image_url || null);
    }
  };

  const handleRemoveCover = () => {
    setCoverFile(null);
    setCoverPreview(null);
  };

  const handleRemoveExistingAdditional = (indexToRemove: number) => {
    setExistingAdditional(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleNewAdditionalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileList = Array.from(files);
      setNewAdditionalFiles(prev => [...prev, ...fileList]);

      fileList.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          setNewAdditionalPreviews(prev => [...prev, event.target?.result as string]);
        };
        reader.onerror = () => {
          setNewAdditionalPreviews(prev => [...prev, URL.createObjectURL(file)]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveNewAdditional = (indexToRemove: number) => {
    setNewAdditionalFiles(prev => prev.filter((_, idx) => idx !== indexToRemove));
    setNewAdditionalPreviews(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting || statusMessage?.success) return;

    if (!title.trim()) {
      setStatusMessage({ success: false, message: 'Tiêu đề bài viết là bắt buộc.' });
      return;
    }

    if (!slug.trim()) {
      setStatusMessage({ success: false, message: 'Slug bài viết là bắt buộc.' });
      return;
    }

    if (!content.trim()) {
      setStatusMessage({ success: false, message: 'Nội dung bài viết là bắt buộc.' });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      let uploadedCoverUrl: string | null = null;
      const uploadedNewAdditionalUrls: string[] = [];

      const uploadRequests: Array<{ name: string; type: string; isCover: boolean; index: number }> = [];
      if (coverFile) {
        uploadRequests.push({ name: coverFile.name, type: coverFile.type, isCover: true, index: 0 });
      }
      newAdditionalFiles.forEach((file, idx) => {
        uploadRequests.push({ name: file.name, type: file.type, isCover: false, index: idx });
      });

      if (uploadRequests.length > 0) {
        setSubmitProgress(`Đang chuẩn bị tải lên ${uploadRequests.length} ảnh mới...`);
        const signedRes = await getStorySignedUploadUrlsAction(uploadRequests);

        if (!signedRes.success || !signedRes.urls) {
          throw new Error(signedRes.message || 'Không thể tạo link tải ảnh trực tiếp');
        }

        const total = uploadRequests.length;
        let count = 0;

        for (const item of signedRes.urls) {
          count++;
          setSubmitProgress(`Đang tải ảnh ${count}/${total}...`);

          const targetFile = item.isCover ? coverFile : newAdditionalFiles[item.index];
          if (!targetFile) continue;

          const uploadRes = await fetch(item.signedUrl, {
            method: 'PUT',
            headers: {
              'Content-Type': targetFile.type || 'image/jpeg',
            },
            body: targetFile,
          });

          if (!uploadRes.ok) {
            throw new Error(`Lỗi tải ảnh lên lưu trữ: ${uploadRes.statusText}`);
          }

          if (item.isCover) {
            uploadedCoverUrl = item.publicUrl;
          } else {
            uploadedNewAdditionalUrls[item.index] = item.publicUrl;
          }
        }
      }

      setSubmitProgress('Đang lưu bài viết vào hệ thống...');
      await new Promise(r => setTimeout(r, 60));

      const finalCover = coverFile ? uploadedCoverUrl : coverPreview;
      const finalAdditional = [...existingAdditional, ...uploadedNewAdditionalUrls.filter(Boolean)];

      const updateRes = await updateStoryDirectAction({
        id: story.id,
        title,
        slug,
        excerpt,
        content,
        city,
        collection_number: story.collection_number || 'STORY',
        status,
        image_url: finalCover,
        additional_images: finalAdditional,
      });

      if (!updateRes.success) {
        throw new Error(updateRes.message || 'Lỗi cập nhật bài viết');
      }

      setStatusMessage({ success: true, message: updateRes.message || 'Cập nhật bài viết thành công!' });
      setTimeout(() => {
        window.location.href = '/admin/stories';
      }, 800);
    } catch (err: any) {
      setStatusMessage({ success: false, message: err.message || 'Có lỗi xảy ra khi lưu bài viết' });
      setIsSubmitting(false);
      setSubmitProgress('');
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
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Thông báo trạng thái ở đầu form */}
          {statusMessage?.message && (
            <div className={`p-4 rounded-xl text-sm font-semibold flex items-center gap-2.5 ${statusMessage.success ? 'bg-emerald-50 text-emerald-800 border-2 border-emerald-300' : 'bg-red-50 text-red-600 border border-red-200'}`}>
              {statusMessage.success ? (
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
              )}
              <span>
                {statusMessage.message}
                {statusMessage.success && ' Đang tự động chuyển hướng về danh sách bài viết...'}
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
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="vi-du-duong-dan-bai-viet"
                  className="w-full px-4 py-3 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors font-mono text-sm" 
                />
                <p className="text-xs text-foreground/50 mt-1.5">
                  Đường dẫn hiển thị trên thanh địa chỉ duyệt web (vd: /story-hub/{slug})
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-foreground/80 mb-2 uppercase tracking-wider">
                  Đoạn trích tóm tắt (Excerpt)
                </label>
                <textarea 
                  name="excerpt" 
                  rows={3} 
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
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
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
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
                value={city}
                onChange={(e) => setCity(e.target.value)}
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
                value={status}
                onChange={(e) => setStatus(e.target.value)}
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
                          <div key={i} className="relative aspect-video rounded-lg overflow-hidden border border-foreground/10 bg-black/5 group">
                            <img 
                              src={preview} 
                              alt={`Ảnh mới ${i + 1}`} 
                              className="w-full h-full object-cover" 
                            />
                            <span className="absolute top-1 left-1 bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                              Mới
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveNewAdditional(i);
                              }}
                              className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-80 hover:opacity-100 transition-opacity cursor-pointer z-20"
                              title="Xóa ảnh này"
                            >
                              <X className="w-3 h-3" />
                            </button>
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
                      <span className="text-xs text-foreground/40 mt-1">Giữ phím Shift hoặc Ctrl / Cmd để chọn nhiều ảnh</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Thông báo trạng thái ở cạnh nút Lưu */}
          {statusMessage?.message && (
            <div className={`p-4 rounded-xl text-sm font-semibold flex items-center gap-2.5 ${statusMessage.success ? 'bg-emerald-50 text-emerald-800 border-2 border-emerald-300' : 'bg-red-50 text-red-600 border border-red-200'}`}>
              {statusMessage.success ? (
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
              )}
              <span>
                {statusMessage.message}
                {statusMessage.success && ' Đang tự động chuyển hướng về danh sách bài viết...'}
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
              disabled={isSubmitting || statusMessage?.success} 
              className="bg-primary-red text-white px-8 py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-primary-red/90 transition-colors disabled:opacity-50 text-sm shadow-md flex items-center gap-2 cursor-pointer"
            >
              {statusMessage?.success ? 'Đã lưu thành công!' : isSubmitting ? (submitProgress || 'Đang lưu bài viết...') : 'Lưu bài viết'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
