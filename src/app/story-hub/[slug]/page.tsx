import { getSupabaseServer } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import StoryReactions from '@/components/ui/StoryReactions';
import StoryComments from '@/components/ui/StoryComments';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function StoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const rawSlug = resolvedParams.slug || '';
  const decodedSlug = decodeURIComponent(rawSlug).trim();
  
  const [supabase, session] = await Promise.all([
    getSupabaseServer(),
    auth()
  ]);

  // Robust multi-fallback story lookup
  let story: any = null;

  // 1. Try exact match with decodedSlug
  if (decodedSlug) {
    const { data } = await supabase.from('mm_stories').select('*').eq('slug', decodedSlug).maybeSingle();
    story = data;
  }

  // 2. Try exact match with rawSlug if different
  if (!story && rawSlug && rawSlug !== decodedSlug) {
    const { data } = await supabase.from('mm_stories').select('*').eq('slug', rawSlug).maybeSingle();
    story = data;
  }

  // 3. Try case-insensitive ilike with decodedSlug
  if (!story && decodedSlug) {
    const { data } = await supabase.from('mm_stories').select('*').ilike('slug', decodedSlug).maybeSingle();
    story = data;
  }

  // 4. Try replacing hyphens with spaces (e.g. "trung-kien" -> "Trung Kien")
  if (!story && decodedSlug.includes('-')) {
    const spaceSlug = decodedSlug.replace(/[-_]+/g, ' ');
    const { data } = await supabase.from('mm_stories').select('*').ilike('slug', spaceSlug).maybeSingle();
    story = data;
  }

  // 5. Try replacing spaces with hyphens (e.g. "Trung Kien" -> "trung-kien")
  if (!story && decodedSlug.includes(' ')) {
    const dashSlug = decodedSlug.replace(/\s+/g, '-');
    const { data } = await supabase.from('mm_stories').select('*').ilike('slug', dashSlug).maybeSingle();
    story = data;
  }

  // 6. UUID match if slug looks like uuid
  if (!story && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(decodedSlug)) {
    const { data } = await supabase.from('mm_stories').select('*').eq('id', decodedSlug).maybeSingle();
    story = data;
  }

  if (!story || story.status !== 'published') {
    notFound();
  }

  // Fetch comments safely by story ID and matching slug variants
  let comments: any[] = [];
  try {
    const filterConditions = [
      `story_id.eq.${story.id}`,
      `story_slug.eq.${story.slug}`
    ];
    if (decodedSlug && decodedSlug !== story.slug) {
      filterConditions.push(`story_slug.eq.${decodedSlug}`);
    }

    const { data: commentsData } = await supabase
      .from('mm_story_comments')
      .select('*')
      .or(filterConditions.join(','))
      .order('created_at', { ascending: false });
      
    if (commentsData) comments = commentsData;
  } catch (e) {
    console.error('Fetch comments error:', e);
  }

  const hearts = Number(story.hearts_count) || 0;
  const likes = Number(story.likes_count) || 0;
  const dislikes = Number(story.dislikes_count) || 0;

  return (
    <div className="min-h-screen pt-32 pb-24 bg-cream">
      <div className="container mx-auto px-6 max-w-4xl">
        <Link href="/story-hub" className="inline-flex items-center gap-2 text-foreground/50 hover:text-terracotta mb-8 font-bold text-sm tracking-wider uppercase transition-colors">
          <ArrowLeft className="w-4 h-4" /> Về trang Story Hub
        </Link>
        
        <div className="mb-12">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {story.city && (
               <div className="inline-block px-4 py-1.5 rounded-full bg-terracotta/10 text-terracotta text-sm font-bold tracking-widest uppercase">
                  {story.city}
               </div>
            )}
            <div className="flex items-center gap-3 bg-foreground/5 px-3.5 py-1.5 rounded-full text-xs font-bold text-foreground/70 border border-foreground/10">
              <span className="flex items-center gap-1 text-red-500 font-bold">
                ❤️ {hearts.toLocaleString('vi-VN')}
              </span>
              <span className="text-foreground/20">•</span>
              <span className="flex items-center gap-1 text-emerald-600 font-bold">
                👍 {likes.toLocaleString('vi-VN')}
              </span>
              {dislikes > 0 && (
                <>
                  <span className="text-foreground/20">•</span>
                  <span className="flex items-center gap-1 text-foreground/60">
                    👎 {dislikes.toLocaleString('vi-VN')}
                  </span>
                </>
              )}
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-display font-black text-foreground mb-6 leading-tight">
            {story.title}
          </h1>
          {story.excerpt && (
            <p className="text-xl text-foreground-muted font-medium leading-relaxed italic border-l-4 border-terracotta pl-6">
              {story.excerpt}
            </p>
          )}
        </div>

        {story.image_url && (
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg border-2 border-foreground/10 mb-12">
            <Image 
              src={story.image_url} 
              alt={story.title} 
              fill 
              sizes="(max-width: 1200px) 100vw, 896px"
              className="object-cover" 
              style={{ objectFit: 'cover', objectPosition: 'center' }}
              priority 
            />
          </div>
        )}

        <div className="prose prose-lg prose-stone max-w-none mb-16 whitespace-pre-wrap font-medium text-foreground-muted">
          {(() => {
            const content = story.content || '';
            const images = story.additional_images || [];
            if (images.length === 0) return content;

            const parts = content.split(/\[anh(\d+)\]/i);
            return parts.map((part: string, idx: number) => {
              if (idx % 2 !== 0) {
                const imgIndex = parseInt(part, 10) - 1;
                if (images[imgIndex]) {
                  return (
                    <span key={idx} className="block relative w-full aspect-video md:aspect-[16/9] rounded-2xl overflow-hidden shadow-lg border-2 border-foreground/10 my-8">
                      <Image 
                        src={images[imgIndex]} 
                        alt={`${story.title} ${imgIndex + 1}`} 
                        fill 
                        sizes="(max-width: 1200px) 100vw, 896px"
                        className="object-cover" 
                        style={{ objectFit: 'cover', objectPosition: 'center' }}
                      />
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
                  <Image 
                    src={img} 
                    alt={`${story.title} ${idx + 1}`} 
                    fill 
                    sizes="(max-width: 768px) 100vw, 440px"
                    className="object-cover" 
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Interactive Reaction Box */}
        <StoryReactions
          storyId={story.id}
          storySlug={story.slug}
          initialHearts={hearts}
          initialLikes={likes}
          initialDislikes={dislikes}
        />

        {/* Comments Section */}
        <StoryComments
          storyId={story.id}
          storySlug={story.slug}
          initialComments={comments}
          currentUser={session?.user ? {
            id: (session.user as any).id,
            name: session.user.name || undefined,
            email: session.user.email || undefined,
            image: session.user.image || undefined,
            role: (session.user as any).role || undefined
          } : null}
        />
      </div>
    </div>
  );
}
