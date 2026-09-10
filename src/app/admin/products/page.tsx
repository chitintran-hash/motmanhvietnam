import { getSupabaseServer } from '@/lib/supabase-server';
import { Plus, Edit, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default async function AdminProductsPage() {
  const supabase = getSupabaseServer();
  const { data: products } = await supabase.from('mm_products').select('*').order('created_at', { ascending: false });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display font-black text-foreground uppercase tracking-wider">Quản lý sản phẩm</h1>
        <Link 
          href="/admin/products/new" 
          className="flex items-center gap-2 bg-foreground text-white px-4 py-2 rounded-lg font-bold hover:bg-terracotta transition-colors"
        >
          <Plus className="w-5 h-5" />
          Thêm Sản Phẩm
        </Link>
      </div>

      <div className="bg-white rounded-2xl border-2 border-foreground/10 shadow-[4px_4px_0px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background-alt border-b-2 border-foreground/10 text-sm font-bold text-foreground/60 uppercase tracking-wider">
                <th className="py-4 px-6">Sản phẩm</th>
                <th className="py-4 px-6">Giá</th>
                <th className="py-4 px-6">Tồn kho</th>
                <th className="py-4 px-6">Trạng thái</th>
                <th className="py-4 px-6 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {products?.map((product: any) => (
                <tr key={product.id} className="border-b border-foreground/5 hover:bg-background-alt/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      {product.image_url ? (
                        <div className="w-12 h-12 bg-background-alt rounded overflow-hidden relative border border-foreground/10">
                          <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-background-alt rounded border border-foreground/10 flex items-center justify-center text-xs text-foreground/30">No Img</div>
                      )}
                      <div>
                        <div className="font-bold text-foreground">{product.name}</div>
                        <div className="text-xs text-foreground-muted">{product.city || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-medium">
                    {product.price.toLocaleString('vi-VN')} đ
                  </td>
                  <td className="py-4 px-6">
                    <span className={product.stock > 0 ? 'text-foreground' : 'text-red-500 font-bold'}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      product.status === 'active' ? 'bg-jade/10 text-jade' : 
                      product.status === 'hidden' ? 'bg-foreground/10 text-foreground/60' : 
                      'bg-gold/10 text-gold-dark'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/products/${product.id}/edit`} className="p-2 text-foreground/60 hover:bg-foreground/5 rounded-lg transition-colors">
                        <Edit className="w-5 h-5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {(!products || products.length === 0) && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-foreground-muted">
                    Chưa có sản phẩm nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
