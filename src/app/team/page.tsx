import { getSupabaseServer } from '@/lib/supabase-server';
import TeamListClient from './TeamListClient';

export const revalidate = 0;

export default async function TeamHubPage() {
  const supabase = getSupabaseServer();
  const { data: teamMembers } = await supabase
    .from('mm_team_members')
    .select('*')
    .eq('status', 'active')
    .order('display_order', { ascending: true });

  return (
    <div className="min-h-screen pt-32 pb-24 relative overflow-hidden bg-background">
      {/* Decorative texture overlay */}
      <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E')] -z-10"></div>
      
      <div className="container mx-auto px-6 max-w-[1400px] relative z-10">
        <TeamListClient teamMembers={teamMembers || []} />
      </div>
    </div>
  );
}
