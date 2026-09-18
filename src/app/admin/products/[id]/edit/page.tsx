'use client';

import { useActionState } from 'react';
import { editProductAction } from '../../actions';
import Link from 'next/link';
import { ArrowLeft, Upload, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;
  const [errorMessage, formAction, isPending] = useActionState(editProductAction, undefined);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      const { data } = await supabaseClient.from('mm_products').select('*').eq('id', id).single();
      if (data) {
        setProduct(data);
        if (data.image_url) {
          setPreviewImage(data.image_url);
        }
      }
      setLoading(false);
    }
    loadProduct();
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  if (loading) return <div className="p-8 text-center text-foreground/50">Đang tải...</div>;
  if (!product) return <div className="p-8 text-center text-terracotta">Không tìm thấy sản phẩm</div>;

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="p-2 bg-white rounded-full border border-foreground/10 hover:bg-background-alt transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-display font-black text-foreground uppercase tracking-wider">Sửa Sản Phẩm</h1>
      </div>

      <div className="bg-white rounded-2xl border-2 border-foreground/10 shadow-[4px_4px_0px_rgba(0,0,0,0.05)] p-6 md:p-8">
        <form action={formAction} className="space-y-6 max-w-3xl">
          <input type="hidden" name="id" value={id} />
          
          {errorMessage?.message && (
            <div className={`p-4 rounded-lg text-sm font-medium ${errorMessage.success ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
              {errorMessage.message}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-foreground/80 mb-2 uppercase tracking-wider">Tên sản phẩm *</label>
              <input 
                type="text" 
                name="name" 
                defaultValue={product.name}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground/80 mb-2 uppercase tracking-wider">Slug (Đường dẫn) *</label>
              <input 
                type="text" 
                name="slug" 
                defaultValue={product.slug}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-foreground/80 mb-2 uppercase tracking-wider">Thành phố</label>
              <input 
                type="text" 
                name="city" 
                defaultValue={product.city || ''}
                className="w-full px-4 py-3 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground/80 mb-2 uppercase tracking-wider">Trạng thái</label>
              <select 
                name="status"
                defaultValue={product.status}
                className="w-full px-4 py-3 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors appearance-none"
              >
                <option value="draft">Bản nháp (Draft)</option>
                <option value="active">Đang bán (Active)</option>
                <option value="hidden">Ẩn (Hidden)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-foreground/80 mb-2 uppercase tracking-wider">Giá bán (VNĐ) *</label>
              <input 
                type="number" 
                name="price" 
                defaultValue={product.price}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground/80 mb-2 uppercase tracking-wider">Tồn kho</label>
              <input 
                type="number" 
                name="stock" 
                defaultValue={product.stock}
                className="w-full px-4 py-3 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-foreground/80 mb-2 uppercase tracking-wider">Mô tả ngắn</label>
            <input 
              type="text" 
              name="short_description" 
              defaultValue={product.short_description || ''}
              className="w-full px-4 py-3 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-foreground/80 mb-2 uppercase tracking-wider">Mô tả đầy đủ</label>
            <textarea 
              name="description" 
              defaultValue={product.description || ''}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border-2 border-foreground/10 focus:border-terracotta focus:outline-none transition-colors resize-y"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-bold text-foreground/80 mb-2 uppercase tracking-wider">Hình ảnh sản phẩm</label>
            <div className="flex items-start gap-6 mt-2">
              <div className="flex-1">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-foreground/10 border-dashed rounded-xl cursor-pointer hover:bg-background-alt transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-foreground/40" />
                    <p className="mb-2 text-sm text-foreground/60"><span className="font-bold">Nhấn để thay ảnh</span> hoặc kéo thả</p>
                    <p className="text-xs text-foreground/40">PNG, JPG or WEBP (Max 2MB)</p>
                  </div>
                  <input type="file" name="image" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              </div>
              {previewImage && (
                <div className="w-32 h-32 rounded-xl border-2 border-foreground/10 overflow-hidden relative shrink-0">
                  <Image src={previewImage} alt="Preview" fill className="object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-foreground/10 flex justify-end">
            <button 
              type="submit" 
              disabled={isPending}
              className="px-8 py-3 bg-foreground text-white rounded-xl font-bold uppercase tracking-wider hover:bg-terracotta transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isPending && <Loader2 className="w-5 h-5 animate-spin" />}
              {isPending ? 'Đang lưu...' : 'Lưu sản phẩm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
