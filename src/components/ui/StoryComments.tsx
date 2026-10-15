'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { MessageSquare, Send, Trash2, Lock, Loader2, Sparkles, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { addStoryCommentAction, deleteStoryCommentAction } from '@/app/story-hub/actions';

interface CommentItem {
  id: string;
  story_id?: string;
  story_slug?: string;
  user_id?: string;
  user_name: string;
  user_email?: string;
  user_avatar?: string;
  content: string;
  created_at: string;
}

interface StoryCommentsProps {
  storyId: string;
  storySlug: string;
  initialComments: CommentItem[];
  currentUser: {
    id?: string;
    name?: string;
    email?: string;
    image?: string;
    role?: string;
  } | null;
}

export default function StoryComments({
  storyId,
  storySlug,
  initialComments = [],
  currentUser
}: StoryCommentsProps) {
  const router = useRouter();
  const [comments, setComments] = useState<CommentItem[]>(initialComments);
  const [content, setContent] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, startSubmitTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Keep comments in sync when initialComments updates from server
  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const trimmed = content.trim();
    if (!trimmed || trimmed.length < 2) {
      setStatusMessage({ type: 'error', text: 'Vui lòng nhập nội dung bình luận (tối thiểu 2 ký tự).' });
      return;
    }

    setStatusMessage(null);

    startSubmitTransition(async () => {
      const result = await addStoryCommentAction({
        storyId,
        storySlug,
        content: trimmed
      });

      if (result.success) {
        setContent('');
        setStatusMessage({ type: 'success', text: result.message || 'Đăng bình luận thành công!' });
        
        // Optimistically add to comments list
        if (result.comment) {
          setComments(prev => [result.comment, ...prev]);
        } else {
          // Fallback optimistic item
          const optimisticComment: CommentItem = {
            id: 'temp-' + Date.now(),
            story_id: storyId,
            story_slug: storySlug,
            user_id: currentUser.id,
            user_name: currentUser.name || 'Thành viên',
            user_email: currentUser.email,
            user_avatar: currentUser.image,
            content: trimmed,
            created_at: new Date().toISOString()
          };
          setComments(prev => [optimisticComment, ...prev]);
        }
        router.refresh();
      } else {
        setStatusMessage({ type: 'error', text: result.message || 'Không thể đăng bình luận. Vui lòng thử lại.' });
      }
    });
  };

  const handleDelete = (commentId: string) => {
    if (!confirm('Bạn có chắc muốn xoá bình luận này không?')) return;

    setDeletingId(commentId);
    startSubmitTransition(async () => {
      const result = await deleteStoryCommentAction(commentId, storySlug);
      setDeletingId(null);
      if (result.success) {
        setComments(prev => prev.filter(c => c.id !== commentId));
        router.refresh();
      } else {
        alert(result.message || 'Lỗi khi xoá bình luận.');
      }
    });
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(date);
    } catch {
      return 'Vừa xong';
    }
  };

  const getUserInitial = (name: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    return parts[parts.length - 1].charAt(0).toUpperCase();
  };

  return (
    <div id="binh-luan" className="w-full mt-16 pt-12 border-t-2 border-foreground/15">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-terracotta/10 flex items-center justify-center text-terracotta">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-2xl font-display font-black text-foreground uppercase tracking-tight">
              Bình luận & Cảm nhận
            </h3>
            <p className="text-xs text-foreground-muted font-medium">
              Không gian thảo luận văn hóa và góc nhìn ký ức
            </p>
          </div>
        </div>

        <span className="px-3.5 py-1.5 rounded-full bg-[#F5F2EB] border border-foreground/10 text-xs font-bold text-foreground">
          {comments.length} bình luận
        </span>
      </div>

      {/* Auth Gate: Login/Register prompt OR Comment Box */}
      {!currentUser ? (
        <div className="bg-[#F5F2EB] border-2 border-dashed border-foreground/20 rounded-2xl p-8 mb-12 text-center relative overflow-hidden">
          <div className="max-w-md mx-auto">
            <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-4 text-gold">
              <Lock className="w-6 h-6 text-foreground/70" />
            </div>
            <h4 className="text-lg font-display font-black text-foreground uppercase tracking-tight mb-2">
              Đăng nhập để tham gia bình luận
            </h4>
            <p className="text-sm text-foreground-muted font-medium leading-relaxed mb-6">
              Bạn cần có tài khoản thành viên Một Mảnh Việt Nam để có thể gửi bình luận và cùng chia sẻ cảm nghĩ về bài viết này.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href={`/login?callbackUrl=/story-hub/${storySlug}`}
                className="w-full sm:w-auto px-6 py-2.5 bg-terracotta text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-terracotta-hover transition-colors shadow-sm"
              >
                Đăng Nhập
              </Link>
              <Link
                href={`/register?callbackUrl=/story-hub/${storySlug}`}
                className="w-full sm:w-auto px-6 py-2.5 bg-white text-foreground border-2 border-foreground/15 rounded-xl font-bold text-xs uppercase tracking-wider hover:border-terracotta hover:text-terracotta transition-colors shadow-sm"
              >
                Đăng Ký Tài Khoản
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border-2 border-foreground/15 rounded-2xl p-6 md:p-8 mb-12 shadow-[4px_4px_0px_rgba(42,42,39,0.06)]">
          {/* User info bar */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-terracotta text-white flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden relative border border-foreground/10">
              {currentUser.image ? (
                <Image src={currentUser.image} alt={currentUser.name || 'User'} fill className="object-cover" />
              ) : (
                getUserInitial(currentUser.name || 'User')
              )}
            </div>
            <div>
              <div className="text-xs text-foreground/50 font-bold uppercase tracking-wider">
                Bình luận với tư cách
              </div>
              <div className="text-sm font-bold text-foreground">
                {currentUser.name || currentUser.email}
                {currentUser.role === 'admin' && (
                  <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-terracotta/10 text-terracotta">
                    Admin
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Textarea */}
          <div className="mb-4">
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Chia sẻ suy nghĩ, kỷ niệm hoặc câu chuyện của bạn về bài viết này..."
              rows={3}
              maxLength={2000}
              disabled={isSubmitting}
              className="w-full px-4 py-3 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors text-sm font-medium resize-y bg-[#FAFAFA]"
            />
            <div className="flex justify-between items-center text-[11px] text-foreground/40 mt-1">
              <span>Tôn trọng văn hóa và chia sẻ lịch sự</span>
              <span>{content.length}/2000</span>
            </div>
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div
              className={`p-3 rounded-xl text-xs font-bold mb-4 flex items-center gap-2 ${
                statusMessage.type === 'success'
                  ? 'bg-jade/10 text-jade border border-jade/20'
                  : 'bg-red-50 text-red-600 border border-red-200'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-terracotta text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-terracotta-hover transition-all shadow-[2px_2px_0px_rgba(42,42,39,1)] active:translate-x-[1px] active:translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Gửi bình luận
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border-2 border-foreground/10 border-dashed p-8">
            <Sparkles className="w-8 h-8 text-gold mx-auto mb-3" />
            <h5 className="font-bold text-foreground text-base mb-1">
              Chưa có bình luận nào
            </h5>
            <p className="text-sm text-foreground-muted">
              Hãy là người đầu tiên chia sẻ cảm nhận và góc nhìn của bạn về bài viết này!
            </p>
          </div>
        ) : (
          comments.map(comment => {
            const isOwner = currentUser?.id && comment.user_id === currentUser.id;
            const isAdmin = currentUser?.role === 'admin';
            const canDelete = isOwner || isAdmin;

            return (
              <div
                key={comment.id}
                className="bg-white rounded-2xl border border-foreground/10 p-5 shadow-sm hover:border-foreground/20 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#EFE8DC] text-foreground font-bold text-sm flex items-center justify-center shrink-0 border border-foreground/10 overflow-hidden relative">
                      {comment.user_avatar ? (
                        <Image src={comment.user_avatar} alt={comment.user_name} fill className="object-cover" />
                      ) : (
                        getUserInitial(comment.user_name)
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-foreground flex items-center gap-2">
                        <span>{comment.user_name}</span>
                        {comment.user_email === 'tranchitin2006@gmail.com' && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-terracotta/10 text-terracotta">
                            Tác giả
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-foreground/40 font-mono">
                        {formatDate(comment.created_at)}
                      </div>
                    </div>
                  </div>

                  {canDelete && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      disabled={deletingId === comment.id}
                      className="p-1.5 text-foreground/40 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                      title="Xoá bình luận"
                    >
                      {deletingId === comment.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>

                <p className="text-sm text-foreground-muted leading-relaxed font-medium whitespace-pre-line pl-12">
                  {comment.content}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
