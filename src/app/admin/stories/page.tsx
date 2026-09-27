import Link from 'next/link';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { getSupabaseServer } from '@/lib/supabase-server';
import Image from 'next/image';
import DeleteStoryButton from './DeleteStoryButton';

export default async function StoriesAdminPage() {
  const supabase = getSupabaseServer();
  const { data: stories } = await supabase.from('mm_stories').select('*').order('created_at', { ascending: false });

  return (
    <div className="p-6 md:p-8 w-full max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-black text-foreground uppercase tracking-wider mb-2">Quản lý Story Hub</h1>
          <p className="text-foreground/60 font-medium">Thêm và quản lý bài viết</p>
        </div>
        <Link 
          href="/admin/stories/new" 
          className="bg-terracotta text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-terracotta-hover transition-colors"
        >
          <Plus className="w-5 h-5" />
          Bài Viết Mới
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-foreground/10 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-foreground/5 text-foreground/60 text-sm uppercase tracking-wider">
                <th className="p-4 font-bold">Hình ảnh</th>
                <th className="p-4 font-bold">Tiêu đề</th>
                <th className="p-4 font-bold">Địa điểm</th>
                <th className="p-4 font-bold">Trạng thái</th>
                <th className="p-4 font-bold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {stories?.map((story) => (
                <tr key={story.id} className="border-t border-foreground/5 hover:bg-foreground/[0.02] transition-colors">
                  <td className="p-4">
                    <div className="w-16 h-16 relative rounded overflow-hidden bg-foreground/5">
                      {story.image_url ? (
                        <Image src={story.image_url} alt={story.title} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-foreground/40">No img</div>
                      )}
                    </div>
                  </td>
                  <td className="p-4 font-medium text-foreground">{story.title}</td>
                  <td className="p-4 text-foreground/70">{story.city || '-'}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${story.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {story.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <DeleteStoryButton id={story.id} />
                  </td>
                </tr>
              ))}
              {(!stories || stories.length === 0) && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-foreground/50">Chưa có bài viết nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
