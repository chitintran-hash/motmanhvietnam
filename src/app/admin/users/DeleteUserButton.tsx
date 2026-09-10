'use client';

import { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { deleteUserAction } from './actions';
import { useRouter } from 'next/navigation';

export default function DeleteUserButton({ userId }: { userId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!window.confirm('Bạn có chắc muốn xóa tài khoản này? Hành động này không thể hoàn tác.')) {
      return;
    }

    setIsDeleting(true);
    const result = await deleteUserAction(userId);
    setIsDeleting(false);

    if (result.success) {
      alert('Xóa thành công.');
      router.refresh();
    } else {
      alert(result.message || 'Lỗi khi xóa tài khoản');
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50" 
      title="Xóa tài khoản"
    >
      {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
    </button>
  );
}
