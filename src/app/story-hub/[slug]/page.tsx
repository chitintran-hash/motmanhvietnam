import { getSupabaseServer } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const revalidate = 60;

export default async function StoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  const supabase = getSupabaseServer();
  const { data: story } = await supabase
    .from('mm_stories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!story || story.status !== 'published') {
    notFound();
  }

  return (
    <div className="min-h-screen pt-32 pb-24 bg-cream">
      <div className="container mx-auto px-6 max-w-4xl">
        <Link href="/story-hub" className="inline-flex items-center gap-2 text-foreground/50 hover:text-terracotta mb-8 font-bold text-sm tracking-wider uppercase transition-colors">
          <ArrowLeft className="w-4 h-4" /> Về trang Story Hub
        </Link>
        
        <div className="mb-12">
          {story.city && (
             <div className="inline-block px-4 py-1.5 rounded-full bg-terracotta/10 text-terracotta text-sm font-bold tracking-widest uppercase mb-6">
                {story.city}
             </div>
          )}
          <h1 className="text-4xl md:text-5xl font-display font-black text-foreground mb-6 leading-tight">
            {story.title}
          </h1>
          {story.excerpt && (
            <p className="text-xl text-foreground-muted font-medium leading-relaxed italic border-l-4 border-terracotta pl-6">
              {story.excerpt}
            </p>
          )}
        </div>



        <div className="prose prose-lg prose-stone max-w-none mb-16 whitespace-pre-wrap font-medium text-foreground-muted">
          {(() => {
            const content = story.content || '';
            const images = story.additional_images || [];
            if (images.length === 0) return content;

            const parts = content.split(/\[anh(\d+)\]/i);
            return parts.map((part, idx) => {
              if (idx % 2 !== 0) {
                const imgIndex = parseInt(part, 10) - 1;
                if (images[imgIndex]) {
                  return (
                    <span key={idx} className="block relative w-full aspect-video md:aspect-[16/9] rounded-2xl overflow-hidden shadow-lg border-2 border-foreground/10 my-8">
                      <Image src={images[imgIndex]} alt={`${story.title} ${imgIndex + 1}`} fill className="object-cover" />
                    </span>
                  );
                }
                return `[anh${part}]`;
              }
              return <span key={idx}>{part}</span>;
            });
          })()}
        </div>

        {story.additional_images && story.additional_images.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 pt-12 border-t-2 border-foreground/10">
            {story.additional_images.map((img: string, idx: number) => {
              // Hide images that are already used in the content via [anhX]
              if (story.content?.toLowerCase().includes(`[anh${idx + 1}]`)) return null;
              
              return (
                <div key={idx} className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-md border-2 border-foreground/10">
                  <Image src={img} alt={`${story.title} ${idx + 1}`} fill className="object-cover" />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
