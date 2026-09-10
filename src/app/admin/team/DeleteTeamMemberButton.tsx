'use client';

import { Trash2, Loader2 } from 'lucide-react';
import { useTransition } from 'react';
import { deleteTeamMemberAction } from './actions';

export default function DeleteTeamMemberButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm('Bạn có chắc chắn muốn xóa thành viên này? Hành động này không thể hoàn tác.')) {
      startTransition(async () => {
        const result = await deleteTeamMemberAction(id);
        if (!result.success) {
          alert(result.message);
        }
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="inline-block p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
      title="Xóa thành viên"
    >
      {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
    </button>
  );
}
