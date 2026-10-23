import { getSupabaseServer } from '@/lib/supabase-server';
import StoryHubClient from './StoryHubClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
      
      <StoryHubClient stories={stories || []} />
    </div>
  );
}
