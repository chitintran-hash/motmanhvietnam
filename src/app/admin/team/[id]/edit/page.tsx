import { getSupabaseServer } from '@/lib/supabase-server';
import EditTeamMemberForm from './EditTeamMemberForm';
import { notFound } from 'next/navigation';

export default async function EditTeamMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = getSupabaseServer();
  const { id } = await params;
  
  const { data: member } = await supabase
    .from('mm_team_members')
    .select('*')
    .eq('id', id)
    .single();

  if (!member) {
    notFound();
  }

  return <EditTeamMemberForm member={member} />;
}
