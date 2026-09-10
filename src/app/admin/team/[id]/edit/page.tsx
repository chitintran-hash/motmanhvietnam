import { getSupabaseServer } from '@/lib/supabase-server';
import EditTeamMemberForm from './EditTeamMemberForm';
import { notFound } from 'next/navigation';

export default async function EditTeamMemberPage({ params }: { params: { id: string } }) {
  const supabase = getSupabaseServer();
  
  const { data: member } = await supabase
    .from('mm_team_members')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!member) {
    notFound();
  }

  return <EditTeamMemberForm member={member} />;
}
