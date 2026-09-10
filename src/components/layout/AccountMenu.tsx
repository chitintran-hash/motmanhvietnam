'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { User, LogOut, Package, Shield, ChevronDown, Layers } from 'lucide-react';

export default function AccountMenu({ session }: { session: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!session?.user) return null;

  const isAdmin = session.user.role === 'admin';

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm font-bold text-foreground hover:text-terracotta transition-colors uppercase tracking-wider"
      >
        <span className="max-w-[100px] truncate">{session.user.name || session.user.email}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-4 w-56 bg-white border border-foreground/10 shadow-[4px_4px_0px_rgba(0,0,0,0.05)] rounded-xl overflow-hidden flex flex-col py-2 z-50">
          <Link href="/profile" className="flex items-center gap-3 px-4 py-3 hover:bg-background-alt transition-colors text-sm font-bold text-foreground">
            <User className="w-4 h-4" /> Tài khoản của tôi
          </Link>
          <Link href="/profile/orders" className="flex items-center gap-3 px-4 py-3 hover:bg-background-alt transition-colors text-sm font-bold text-foreground">
            <Package className="w-4 h-4" /> Đơn hàng
          </Link>
          <Link href="/profile/collections" className="flex items-center gap-3 px-4 py-3 hover:bg-background-alt transition-colors text-sm font-bold text-foreground">
            <Layers className="w-4 h-4" /> Bộ sưu tập
          </Link>
          
          {isAdmin && (
            <div className="border-t border-foreground/10 my-1"></div>
          )}
          {isAdmin && (
            <Link href="/admin" className="flex items-center gap-3 px-4 py-3 hover:bg-background-alt transition-colors text-sm font-bold text-terracotta">
              <Shield className="w-4 h-4" /> QUẢN TRỊ
            </Link>
          )}
          
          <div className="border-t border-foreground/10 my-1"></div>
          
          <form action="/api/auth/signout" method="POST">
            <button type="submit" className="flex items-center gap-3 px-4 py-3 hover:bg-background-alt transition-colors text-sm font-bold text-red-500 w-full text-left">
              <LogOut className="w-4 h-4" /> Đăng xuất
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
