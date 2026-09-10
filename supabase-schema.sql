-- ==============================================================
-- SCHEMA CHO MỘT MẢNH VIỆT NAM (1 MANH VN)
-- Chạy đoạn script này trên Supabase SQL Editor của project MỚI.
-- ==============================================================

-- Bật extension cho UUID (Nếu chưa bật)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. PROFILES & USERS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.mm_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'customer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==========================================
-- 2. COLLECTIONS (Bộ sưu tập sản phẩm)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.mm_collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    cover_image TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'hidden')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==========================================
-- 3. PRODUCTS (Sản phẩm)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.mm_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    city TEXT,
    collection_id UUID REFERENCES public.mm_collections(id) ON DELETE SET NULL,
    short_description TEXT,
    description TEXT,
    story TEXT,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    stock INTEGER NOT NULL DEFAULT 0,
    image_url TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'hidden')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==========================================
-- 4. ORDERS & ORDER ITEMS (Đơn hàng)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.mm_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.mm_profiles(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    phone TEXT,
    address TEXT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'shipping', 'completed', 'cancelled')),
    payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.mm_order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.mm_orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.mm_products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL
);

-- ==========================================
-- 5. STORIES & HERITAGE LOCATIONS (Nội dung)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.mm_stories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    city TEXT,
    excerpt TEXT,
    content TEXT,
    image_url TEXT,
    product_id UUID REFERENCES public.mm_products(id) ON DELETE SET NULL,
    collection_id UUID REFERENCES public.mm_collections(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'hidden')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.mm_heritage_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city TEXT NOT NULL,
    title TEXT NOT NULL,
    latitude DECIMAL(10, 6) NOT NULL,
    longitude DECIMAL(10, 6) NOT NULL,
    story_id UUID REFERENCES public.mm_stories(id) ON DELETE SET NULL,
    product_id UUID REFERENCES public.mm_products(id) ON DELETE SET NULL,
    image_url TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'hidden'))
);

-- ==========================================
-- 6. USER COLLECTIONS (Sưu tập mảnh ghép)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.mm_user_collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.mm_profiles(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.mm_products(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    source TEXT DEFAULT 'qr_scan',
    UNIQUE(user_id, product_id)
);


-- ==========================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Bật RLS
ALTER TABLE public.mm_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mm_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mm_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mm_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mm_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mm_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mm_heritage_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mm_user_collections ENABLE ROW LEVEL SECURITY;

-- Helper function kiểm tra Admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.mm_profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- --- PROFILES ---
-- Public: Anyone can read profiles (or limit if needed, here keeping simple)
CREATE POLICY "Public profiles viewable by everyone" ON public.mm_profiles FOR SELECT USING (true);
-- Users insert their own profile
CREATE POLICY "Users can insert their own profile" ON public.mm_profiles FOR INSERT WITH CHECK (auth.uid() = id);
-- Users update their own profile (cannot change role directly through this policy without backend check, but allowed generally)
CREATE POLICY "Users can update own profile" ON public.mm_profiles FOR UPDATE USING (auth.uid() = id);
-- Admins can update any profile
CREATE POLICY "Admins can update any profile" ON public.mm_profiles FOR UPDATE USING (public.is_admin());
-- Admins can delete any profile
CREATE POLICY "Admins can delete any profile" ON public.mm_profiles FOR DELETE USING (public.is_admin());

-- --- PRODUCTS ---
CREATE POLICY "Anyone can read active products" ON public.mm_products FOR SELECT USING (status = 'active' OR public.is_admin());
CREATE POLICY "Admins manage products" ON public.mm_products FOR ALL USING (public.is_admin());

-- --- COLLECTIONS ---
CREATE POLICY "Anyone can read active collections" ON public.mm_collections FOR SELECT USING (status = 'active' OR public.is_admin());
CREATE POLICY "Admins manage collections" ON public.mm_collections FOR ALL USING (public.is_admin());

-- --- ORDERS ---
CREATE POLICY "Users can read own orders" ON public.mm_orders FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users can insert own orders" ON public.mm_orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins manage orders" ON public.mm_orders FOR ALL USING (public.is_admin());

-- --- ORDER ITEMS ---
CREATE POLICY "Users read own order items" ON public.mm_order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.mm_orders WHERE id = public.mm_order_items.order_id AND user_id = auth.uid()) OR public.is_admin()
);
CREATE POLICY "Users insert own order items" ON public.mm_order_items FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.mm_orders WHERE id = public.mm_order_items.order_id AND user_id = auth.uid())
);
CREATE POLICY "Admins manage order items" ON public.mm_order_items FOR ALL USING (public.is_admin());

-- --- STORIES & MAPS ---
CREATE POLICY "Anyone can read active stories" ON public.mm_stories FOR SELECT USING (status = 'active' OR public.is_admin());
CREATE POLICY "Admins manage stories" ON public.mm_stories FOR ALL USING (public.is_admin());

CREATE POLICY "Anyone can read active locations" ON public.mm_heritage_locations FOR SELECT USING (status = 'active' OR public.is_admin());
CREATE POLICY "Admins manage locations" ON public.mm_heritage_locations FOR ALL USING (public.is_admin());

-- --- USER COLLECTIONS ---
CREATE POLICY "Users read own collection" ON public.mm_user_collections FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users can insert to own collection" ON public.mm_user_collections FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins manage user collections" ON public.mm_user_collections FOR ALL USING (public.is_admin());


-- ==========================================
-- 8. TRIGGERS & AUTOMATION
-- ==========================================

-- Tự động set admin cho tranchitin2006@gmail.com
-- (Nếu user này đã tạo auth trước đó, ta cập nhật role)
UPDATE public.mm_profiles SET role = 'admin' WHERE email = 'tranchitin2006@gmail.com';

-- Tạo Storage Bucket cho product_images
INSERT INTO storage.buckets (id, name, public) VALUES ('product_images', 'product_images', true) ON CONFLICT DO NOTHING;

-- Policy cho Storage (Public đọc, Admin quản lý)
CREATE POLICY "Public read product_images" ON storage.objects FOR SELECT USING (bucket_id = 'product_images');
CREATE POLICY "Admins insert product_images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product_images' AND public.is_admin());
CREATE POLICY "Admins update product_images" ON storage.objects FOR UPDATE USING (bucket_id = 'product_images' AND public.is_admin());
CREATE POLICY "Admins delete product_images" ON storage.objects FOR DELETE USING (bucket_id = 'product_images' AND public.is_admin());
