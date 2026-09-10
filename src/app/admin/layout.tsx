import Link from 'next/link';
import { Package, Users, ShoppingCart, LayoutDashboard, Map, BookOpen, Layers, UserCircle } from 'lucide-react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  if (!session?.user || (session.user as any).role !== 'admin') {
    redirect('/login');
  }

  const navItems = [
    { name: 'Tổng quan', href: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Sản phẩm', href: '/admin/products', icon: <Package className="w-5 h-5" /> },
    { name: 'Bộ sưu tập', href: '/admin/collections', icon: <Layers className="w-5 h-5" /> },
    { name: 'Đơn hàng', href: '/admin/orders', icon: <ShoppingCart className="w-5 h-5" /> },
    { name: 'Người dùng', href: '/admin/users', icon: <Users className="w-5 h-5" /> },
    { name: 'Story Hub', href: '/admin/stories', icon: <BookOpen className="w-5 h-5" /> },
    { name: 'Digital Map', href: '/admin/map', icon: <Map className="w-5 h-5" /> },
    { name: 'Đội ngũ', href: '/admin/team', icon: <UserCircle className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-background-alt flex flex-col md:flex-row pt-24 md:pt-32">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-foreground/10 shrink-0 hidden md:block">
        <div className="h-full flex flex-col p-4 sticky top-32">
          <h2 className="text-sm font-bold text-foreground/50 uppercase tracking-wider mb-4 px-4">
            Quản trị viên
          </h2>
          <nav className="space-y-1 flex-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground/80 hover:bg-terracotta/10 hover:text-terracotta transition-colors font-medium"
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 lg:p-12 overflow-x-hidden">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
