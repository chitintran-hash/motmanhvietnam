'use client';

import { useActionState } from 'react';
import { updateTeamMemberAction } from '../../actions';
import Link from 'next/link';
import { ArrowLeft, Upload, Loader2, Info } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

export default function EditTeamMemberForm({ member }: { member: any }) {
  const [errorMessage, formAction, isPending] = useActionState(updateTeamMemberAction, undefined);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(member.avatar_url);
  const [coverPreview, setCoverPreview] = useState<string | null>(member.cover_image_url);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAvatarPreview(URL.createObjectURL(file));
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setCoverPreview(URL.createObjectURL(file));
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/team" className="p-2 bg-white rounded-full border border-foreground/10 hover:bg-background-alt transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-display font-black text-foreground uppercase tracking-wider">Chỉnh Sửa Thành Viên</h1>
      </div>

      <div className="bg-white rounded-2xl border-2 border-foreground/10 shadow-[4px_4px_0px_rgba(0,0,0,0.05)] p-6 md:p-8">
        <form action={formAction} className="space-y-8 max-w-4xl">
          <input type="hidden" name="id" value={member.id} />
          
          {errorMessage?.message && (
            <div className={`p-4 rounded-lg text-sm font-medium ${errorMessage.success ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
              {errorMessage.message}
            </div>
          )}

          {/* Section: Basic Info */}
          <div>
            <h2 className="text-xl font-bold uppercase tracking-widest mb-4 border-b-2 border-foreground/10 pb-2">Thông tin cơ bản</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-foreground/80 mb-2 uppercase tracking-wider">Họ và tên *</label>
                <input 
                  type="text" 
                  name="full_name" 
                  required
                  defaultValue={member.full_name}
                  className="w-full px-4 py-3 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-foreground/80 mb-2 uppercase tracking-wider">Slug (Đường dẫn) *</label>
                <input 
                  type="text" 
                  name="slug" 
                  required
                  defaultValue={member.slug}
                  className="w-full px-4 py-3 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-foreground/80 mb-2 uppercase tracking-wider">Email</label>
                <input 
                  type="email" 
                  name="email" 
                  defaultValue={member.email || ''}
                  className="w-full px-4 py-3 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-foreground/80 mb-2 uppercase tracking-wider">Mã số SV</label>
                <input 
                  type="text" 
                  name="student_id" 
                  defaultValue={member.student_id || ''}
                  className="w-full px-4 py-3 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Section: Role & Department */}
          <div>
            <h2 className="text-xl font-bold uppercase tracking-widest mb-4 border-b-2 border-foreground/10 pb-2">Vai trò & Công việc</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-bold text-foreground/80 mb-2 uppercase tracking-wider">Vai trò trong dự án</label>
                <input 
                  type="text" 
                  name="role_title" 
                  defaultValue={member.role_title || ''}
                  className="w-full px-4 py-3 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-foreground/80 mb-2 uppercase tracking-wider">Ban phụ trách</label>
                <input 
                  type="text" 
                  name="department" 
                  defaultValue={member.department || ''}
                  className="w-full px-4 py-3 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors"
                />
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-foreground/80 mb-2 uppercase tracking-wider">Mô tả ngắn</label>
                <input 
                  type="text" 
                  name="short_description" 
                  defaultValue={member.short_description || ''}
                  className="w-full px-4 py-3 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-foreground/80 mb-2 uppercase tracking-wider">Giới thiệu chi tiết (Bio)</label>
                <textarea 
                  name="bio" 
                  rows={4}
                  defaultValue={member.bio || ''}
                  className="w-full px-4 py-3 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors resize-y"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-bold text-foreground/80 mb-2 uppercase tracking-wider">Đóng góp cụ thể</label>
                <textarea 
                  name="contribution" 
                  rows={4}
                  defaultValue={member.contribution || ''}
                  className="w-full px-4 py-3 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors resize-y"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Section: Achievements & Skills */}
          <div>
            <h2 className="text-xl font-bold uppercase tracking-widest mb-4 border-b-2 border-foreground/10 pb-2">Kỹ năng & Thành tựu</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-foreground/80 mb-2 uppercase tracking-wider">Kỹ năng</label>
                <div className="text-xs text-foreground/50 mb-2 flex items-start gap-1">
                  <Info className="w-4 h-4 shrink-0" /> Nhập dưới dạng mảng JSON
                </div>
                <textarea 
                  name="skills" 
                  rows={3}
                  defaultValue={(member.skills || []).join(', ')}
                  className="w-full px-4 py-3 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors font-mono text-sm"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-bold text-foreground/80 mb-2 uppercase tracking-wider">Thành tựu</label>
                <div className="text-xs text-foreground/50 mb-2 flex items-start gap-1">
                  <Info className="w-4 h-4 shrink-0" /> Nhập dưới dạng mảng JSON
                </div>
                <textarea 
                  name="achievements" 
                  rows={3}
                  defaultValue={(member.achievements || []).join(', ')}
                  className="w-full px-4 py-3 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors font-mono text-sm"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Section: Social Links */}
          <div>
            <h2 className="text-xl font-bold uppercase tracking-widest mb-4 border-b-2 border-foreground/10 pb-2">Liên kết mạng xã hội</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-foreground/80 mb-2 uppercase tracking-wider">Facebook URL</label>
                <input type="url" name="facebook_url" defaultValue={member.facebook_url || ''} className="w-full px-4 py-3 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-bold text-foreground/80 mb-2 uppercase tracking-wider">Instagram URL</label>
                <input type="url" name="instagram_url" defaultValue={member.instagram_url || ''} className="w-full px-4 py-3 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-bold text-foreground/80 mb-2 uppercase tracking-wider">TikTok URL</label>
                <input type="url" name="tiktok_url" defaultValue={member.tiktok_url || ''} className="w-full px-4 py-3 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-bold text-foreground/80 mb-2 uppercase tracking-wider">Portfolio URL</label>
                <input type="url" name="portfolio_url" defaultValue={member.portfolio_url || ''} className="w-full px-4 py-3 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors" />
              </div>
            </div>
          </div>

          {/* Section: Images */}
          <div>
            <h2 className="text-xl font-bold uppercase tracking-widest mb-4 border-b-2 border-foreground/10 pb-2">Hình ảnh</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Avatar */}
              <div>
                <label className="block text-sm font-bold text-foreground/80 mb-2 uppercase tracking-wider">Ảnh đại diện (Avatar) <span className="text-terracotta normal-case font-normal">(Nên dưới 1MB)</span></label>
                <div className="flex flex-col gap-4">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-foreground/10 border-dashed rounded-xl cursor-pointer hover:bg-background-alt transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-3 text-foreground/40" />
                      <p className="text-sm text-foreground/60"><span className="font-bold">Nhấn tải lên thay thế</span></p>
                    </div>
                    <input type="file" name="avatar_url" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                  </label>
                  {avatarPreview && (
                    <div className="w-32 h-32 rounded-xl border-2 border-foreground/10 overflow-hidden relative">
                      <Image src={avatarPreview} alt="Avatar Preview" fill className="object-cover" />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Cover Image */}
              <div>
                <label className="block text-sm font-bold text-foreground/80 mb-2 uppercase tracking-wider">Ảnh bìa (Cover) <span className="text-terracotta normal-case font-normal">(Nên dưới 1MB)</span></label>
                <div className="flex flex-col gap-4">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-foreground/10 border-dashed rounded-xl cursor-pointer hover:bg-background-alt transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-3 text-foreground/40" />
                      <p className="text-sm text-foreground/60"><span className="font-bold">Nhấn tải lên thay thế</span></p>
                    </div>
                    <input type="file" name="cover_image_url" className="hidden" accept="image/*" onChange={handleCoverChange} />
                  </label>
                  {coverPreview && (
                    <div className="w-full h-32 rounded-xl border-2 border-foreground/10 overflow-hidden relative">
                      <Image src={coverPreview} alt="Cover Preview" fill className="object-cover" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section: Display settings */}
          <div>
            <h2 className="text-xl font-bold uppercase tracking-widest mb-4 border-b-2 border-foreground/10 pb-2">Hiển thị</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-foreground/80 mb-2 uppercase tracking-wider">Thứ tự hiển thị (1, 2, 3...)</label>
                <input 
                  type="number" 
                  name="display_order" 
                  defaultValue={member.display_order}
                  className="w-full px-4 py-3 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-foreground/80 mb-2 uppercase tracking-wider">Trạng thái</label>
                <select 
                  name="status"
                  defaultValue={member.status}
                  className="w-full px-4 py-3 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors appearance-none"
                >
                  <option value="active">Đang hiện (Active)</option>
                  <option value="draft">Bản nháp (Draft)</option>

                  <option value="hidden">Đang ẩn (Hidden)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-foreground/10 flex justify-end">
            <button 
              type="submit" 
              disabled={isPending}
              className="px-8 py-4 bg-foreground text-white rounded-xl font-bold uppercase tracking-wider hover:bg-terracotta transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isPending && <Loader2 className="w-5 h-5 animate-spin" />}
              {isPending ? 'Đang lưu...' : 'Lưu cập nhật'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
