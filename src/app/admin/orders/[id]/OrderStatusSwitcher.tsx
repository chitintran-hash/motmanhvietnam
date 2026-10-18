'use client';

import { useState } from 'react';
import { updateOrderStatus } from '../actions';
import { Clock, ClipboardCheck, Truck, PackageCheck, AlertTriangle, Check, Loader2 } from 'lucide-react';

interface OrderStatusSwitcherProps {
  orderId: string;
  currentStatus: string;
}

export default function OrderStatusSwitcher({ orderId, currentStatus }: OrderStatusSwitcherProps) {
  const [status, setStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState('');

  const statuses = [
    { key: 'pending', label: '1. Chờ xác nhận', icon: Clock, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { key: 'confirmed', label: '2. Đã xác nhận', icon: ClipboardCheck, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { key: 'shipping', label: '3. Đang giao hàng', icon: Truck, color: 'text-purple-600 bg-purple-50 border-purple-200' },
    { key: 'completed', label: '4. Đã giao hàng', icon: PackageCheck, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { key: 'cancelled', label: 'Đã hủy đơn', icon: AlertTriangle, color: 'text-red-600 bg-red-50 border-red-200' },
  ];

  const handleUpdate = async (newStatus: string) => {
    if (newStatus === status) return;
    setIsUpdating(true);
    setMessage('');

    try {
      const res = await updateOrderStatus(orderId, newStatus);
      if (res.success) {
        setStatus(newStatus);
        setMessage('Cập nhật trạng thái thành công!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(res.message || 'Lỗi cập nhật');
      }
    } catch (err) {
      setMessage('Lỗi kết nối');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-foreground/10 p-6 shadow-[4px_4px_0px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-foreground/10">
        <h2 className="text-sm font-black uppercase tracking-wider text-foreground/70">
          Cập nhật trạng thái đơn hàng
        </h2>
        {isUpdating && (
          <div className="flex items-center gap-1.5 text-xs text-terracotta font-bold">
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Đang lưu...
          </div>
        )}
        {message && (
          <span className="text-xs font-bold text-emerald-600 animate-fadeIn">
            {message}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {statuses.map((st) => {
          const Icon = st.icon;
          const isSelected = status === st.key;

          return (
            <button
              key={st.key}
              type="button"
              disabled={isUpdating}
              onClick={() => handleUpdate(st.key)}
              className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer text-center ${
                isSelected
                  ? `${st.color} border-current ring-2 ring-current/20 font-black shadow-sm scale-102`
                  : 'bg-background-alt/40 border-foreground/10 text-foreground/60 hover:border-foreground/30 hover:text-foreground'
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="text-[11px] uppercase tracking-wider font-bold">
                {st.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
