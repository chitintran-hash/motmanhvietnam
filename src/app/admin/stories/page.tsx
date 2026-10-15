import Link from 'next/link';
import { Plus, Heart, ThumbsUp, ThumbsDown, ExternalLink, Sparkles, BookOpen, MessageSquare } from 'lucide-react';
import { getSupabaseServer } from '@/lib/supabase-server';
import Image from 'next/image';
import DeleteStoryButton from './DeleteStoryButton';

export const revalidate = 0;

export default async function StoriesAdminPage() {
  const supabase = getSupabaseServer();
  
  const [storiesRes, commentsRes] = await Promise.all([
    supabase.from('mm_stories').select('*').order('created_at', { ascending: false }),
    supabase.from('mm_story_comments').select('id, story_id, story_slug')
  ]);

  const stories = storiesRes.data || [];
  const allComments = commentsRes.data || [];

  // Tính toán tổng số liệu tương tác
  const totalStories = stories.length;
  const totalHearts = stories.reduce((acc: number, s: any) => acc + (Number(s.hearts_count) || 0), 0);
  const totalLikes = stories.reduce((acc: number, s: any) => acc + (Number(s.likes_count) || 0), 0);
  const totalDislikes = stories.reduce((acc: number, s: any) => acc + (Number(s.dislikes_count) || 0), 0);
  const totalInteractions = totalHearts + totalLikes + totalDislikes;
  const totalComments = allComments.length;

  return (
    <div className="p-6 md:p-8 w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-black text-foreground uppercase tracking-wider mb-2">
            Quản lý Story Hub
          </h1>
          <p className="text-foreground/60 font-medium">
            Theo dõi bài viết, số lượt tương tác (Tim/Like) và bình luận của độc giả
          </p>
        </div>
        <Link 
          href="/admin/stories/new" 
          className="bg-terracotta text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-terracotta-hover transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Bài Viết Mới
        </Link>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {/* Card 1: Tổng bài viết */}
        <div className="bg-white p-5 rounded-2xl border-2 border-foreground/10 shadow-[3px_3px_0px_rgba(42,42,39,0.05)]">
          <div className="flex items-center gap-2 text-foreground/50 text-xs font-bold uppercase tracking-wider mb-2">
            <BookOpen className="w-4 h-4 text-terracotta" />
            <span>Bài viết</span>
          </div>
          <div className="text-2xl lg:text-3xl font-display font-black text-foreground">
            {totalStories}
          </div>
        </div>

        {/* Card 2: Tổng tương tác */}
        <div className="bg-white p-5 rounded-2xl border-2 border-foreground/10 shadow-[3px_3px_0px_rgba(42,42,39,0.05)]">
          <div className="flex items-center gap-2 text-foreground/50 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 text-gold" />
            <span>Tương tác</span>
          </div>
          <div className="text-2xl lg:text-3xl font-display font-black text-terracotta">
            {totalInteractions.toLocaleString('vi-VN')}
          </div>
        </div>

        {/* Card 3: Thả tim */}
        <div className="bg-white p-5 rounded-2xl border-2 border-foreground/10 shadow-[3px_3px_0px_rgba(42,42,39,0.05)]">
          <div className="flex items-center gap-2 text-foreground/50 text-xs font-bold uppercase tracking-wider mb-2">
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>Thả tim</span>
          </div>
          <div className="text-2xl lg:text-3xl font-display font-black text-red-600">
            {totalHearts.toLocaleString('vi-VN')}
          </div>
        </div>

        {/* Card 4: Thích */}
        <div className="bg-white p-5 rounded-2xl border-2 border-foreground/10 shadow-[3px_3px_0px_rgba(42,42,39,0.05)]">
          <div className="flex items-center gap-2 text-foreground/50 text-xs font-bold uppercase tracking-wider mb-2">
            <ThumbsUp className="w-4 h-4 text-primary-green fill-current" />
            <span>Lượt thích</span>
          </div>
          <div className="text-2xl lg:text-3xl font-display font-black text-primary-green">
            {totalLikes.toLocaleString('vi-VN')}
          </div>
        </div>

        {/* Card 5: Bình luận */}
        <div className="bg-white p-5 rounded-2xl border-2 border-foreground/10 shadow-[3px_3px_0px_rgba(42,42,39,0.05)] col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2 text-foreground/50 text-xs font-bold uppercase tracking-wider mb-2">
            <MessageSquare className="w-4 h-4 text-navy" />
            <span>Bình luận</span>
          </div>
          <div className="text-2xl lg:text-3xl font-display font-black text-navy">
            {totalComments.toLocaleString('vi-VN')}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border-2 border-foreground/10 overflow-hidden shadow-[4px_4px_0px_rgba(42,42,39,0.05)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background-alt border-b-2 border-foreground/10 text-foreground/60 text-xs font-bold uppercase tracking-wider">
                <th className="py-4 px-6">Hình ảnh</th>
                <th className="py-4 px-6">Tiêu đề bài viết</th>
                <th className="py-4 px-6">Địa điểm</th>
                <th className="py-4 px-6 text-center">Tương tác</th>
                <th className="py-4 px-6 text-center">Bình luận</th>
                <th className="py-4 px-6">Trạng thái</th>
                <th className="py-4 px-6 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {stories.map((story: any) => {
                const hearts = Number(story.hearts_count) || 0;
                const likes = Number(story.likes_count) || 0;
                const dislikes = Number(story.dislikes_count) || 0;
                const total = hearts + likes + dislikes;

                const storyCommentsCount = allComments.filter(
                  (c: any) => c.story_id === story.id || c.story_slug === story.slug
                ).length;

                return (
                  <tr key={story.id} className="border-b border-foreground/5 hover:bg-background-alt/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="w-16 h-16 relative rounded-xl overflow-hidden bg-foreground/5 border border-foreground/10">
                        {story.image_url ? (
                          <Image src={story.image_url} alt={story.title} fill sizes="64px" className="object-cover" style={{ objectFit: 'cover', objectPosition: 'center' }} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-foreground/40 font-bold">No img</div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 max-w-xs">
                      <div className="font-bold text-foreground line-clamp-2">{story.title}</div>
                      <div className="text-xs text-foreground-muted font-mono mt-1 flex items-center gap-1.5">
                        <span>slug: {story.slug}</span>
                        <Link 
                          href={`/story-hub/${story.slug}`} 
                          target="_blank" 
                          className="text-terracotta hover:underline inline-flex items-center gap-0.5"
                          title="Xem bài viết trên web"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-foreground/70 font-medium">
                      {story.city || '-'}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className="font-display font-black text-sm text-foreground mb-1">
                          {total.toLocaleString('vi-VN')} <span className="text-xs font-normal text-foreground-muted">lượt</span>
                        </span>
                        <div className="flex items-center gap-1.5 text-xs font-bold bg-[#F5F2EB] px-2.5 py-0.5 rounded-full border border-foreground/10">
                          <span className="text-red-500" title="Thả tim">❤️ {hearts}</span>
                          <span className="text-foreground/20">|</span>
                          <span className="text-emerald-600" title="Thích">👍 {likes}</span>
                          {dislikes > 0 && (
                            <>
                              <span className="text-foreground/20">|</span>
                              <span className="text-foreground/60" title="Không thích">👎 {dislikes}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Link
                        href={`/story-hub/${story.slug}#binh-luan`}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy/10 text-navy font-bold text-xs hover:bg-navy/20 transition-colors"
                        title="Xem bình luận bài viết"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{storyCommentsCount}</span>
                      </Link>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        story.status === 'published' 
                          ? 'bg-jade/10 text-jade border border-jade/20' 
                          : 'bg-gold/15 text-gold-dark border border-gold/30'
                      }`}>
                        {story.status === 'published' ? 'Đã đăng' : story.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <DeleteStoryButton id={story.id} />
                      </div>
                    </td>
                  </tr>
                );
              })}
              {stories.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-foreground/50">
                    Chưa có bài viết nào trong Story Hub.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
