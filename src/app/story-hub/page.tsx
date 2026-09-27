import { getSupabaseServer } from '@/lib/supabase-server';
import { motion } from "framer-motion";
import StoryCard from "@/components/ui/StoryCard";
import Link from 'next/link';

export const revalidate = 60; // revalidate every 60 seconds

export default async function StoryHubPage() {
  const supabase = getSupabaseServer();
  const { data: stories } = await supabase
    .from('mm_stories')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen pt-32 pb-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-cream -z-20"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E')] opacity-[0.03] pointer-events-none -z-10"></div>
      
      <div className="container mx-auto px-6 max-w-[1400px] relative z-10">
        <div className="mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-8 h-1 bg-primary-red"></div>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary-red">
              ARCHIVE
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-black text-primary-red mb-6 uppercase tracking-tighter">
            STORY HUB
          </h1>
          <p className="text-foreground-muted font-medium leading-relaxed text-lg max-w-2xl border-l-2 border-foreground/10 pl-6">
            Nơi lưu giữ những câu chuyện, ký ức và thông tin văn hóa đằng sau mỗi mảnh ghép. Khám phá những góc nhìn khác về Việt Nam.
          </p>
        </div>

        {stories && stories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
            {stories.map((story: any, index: number) => (
              <div
                key={story.id}
                className="animation-delay"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Link href={`/story-hub/${story.slug}`} className="block group">
                  <StoryCard 
                    id={story.slug}
                    name={story.title}
                    city={story.city || 'Việt Nam'}
                    collectionNumber={story.collection_number || 'STORY'}
                    excerpt={story.excerpt || ''}
                    imageUrl={story.image_url || "https://illustrations.popsy.co/amber/home-office.svg"}
                  />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-foreground/50 text-xl font-medium">Chưa có bài viết nào.</p>
          </div>
        )}
      </div>
    </div>
  );
}
