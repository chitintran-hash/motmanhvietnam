"use client";

import StoryCard from "@/components/ui/StoryCard";
import Link from 'next/link';
import { useLanguage } from "@/context/LanguageContext";

export default function StoryHubClient({ stories }: { stories: any[] }) {
  const { lang } = useLanguage();

  return (
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
          {lang === 'en'
            ? "An archive preserving heartfelt stories, cultural lore, and personal memories behind each collectible piece. Explore diverse perspectives of Vietnam."
            : "Nơi lưu giữ những câu chuyện, ký ức và thông tin văn hóa đằng sau mỗi mảnh ghép. Khám phá những góc nhìn khác về Việt Nam."}
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
                  city={story.city || (lang === 'en' ? 'Vietnam' : 'Việt Nam')}
                  collectionNumber={story.collection_number || 'STORY'}
                  excerpt={
                    (story.excerpt && story.excerpt.trim()) 
                      ? story.excerpt.trim() 
                      : (story.content ? story.content.replace(/\[anh\d+\]/gi, '').replace(/[#*`_~]/g, '').replace(/\s+/g, ' ').trim().slice(0, 180) + '...' : '')
                  }
                  imageUrl={story.image_url || "https://illustrations.popsy.co/amber/home-office.svg"}
                  heartsCount={Number(story.hearts_count) || 0}
                  likesCount={Number(story.likes_count) || 0}
                  dislikesCount={Number(story.dislikes_count) || 0}
                />
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-foreground/50 text-xl font-medium">
            {lang === 'en' ? "No stories published yet." : "Chưa có bài viết nào."}
          </p>
        </div>
      )}
    </div>
  );
}
