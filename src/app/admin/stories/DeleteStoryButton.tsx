'use client';
import { Trash2 } from 'lucide-react';
import { deleteStoryAction } from './actions';
import { useRouter } from 'next/navigation';

export default function DeleteStoryButton({ id }: { id: string }) {
  const router = useRouter();
  
  const handleDelete = async () => {
    if (confirm('Bạn có chắc muốn xoá bài viết này?')) {
      await deleteStoryAction(id);
      router.refresh();
    }
  };

  return (
    <button onClick={handleDelete} className="p-2 text-foreground/40 hover:text-red-500 bg-white rounded-lg border border-foreground/10 hover:border-red-200 transition-colors">
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
