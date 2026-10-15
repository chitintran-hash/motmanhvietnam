import { getSupabaseServer } from '@/lib/supabase-server';
import EditStoryForm from './EditStoryForm';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function EditStoryPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = getSupabaseServer();
  const { id } = await params;
  
  const { data: story } = await supabase
    .from('mm_stories')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (!story) {
    notFound();
  }

  return <EditStoryForm story={story} />;
}
