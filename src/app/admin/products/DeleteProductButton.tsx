'use client';

import { Trash2, Loader2 } from 'lucide-react';
import { useTransition } from 'react';
import { deleteProductAction } from './actions';

export default function DeleteProductButton({ id, name }: { id: string; name?: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    const confirmMessage = name 
      ? `Bạn có chắc chắn muốn xóa sản phẩm "${name}"? Hành động này không thể hoàn tác.`
      : 'Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác.';

    if (confirm(confirmMessage)) {
      startTransition(async () => {
        const result = await deleteProductAction(id);
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
      title="Xóa sản phẩm"
    >
      {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
    </button>
  );
}
