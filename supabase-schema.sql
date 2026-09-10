-- ==============================================================
-- SCHEMA CHO MỘT MẢNH VIỆT NAM (1 MANH VN)
-- Chạy đoạn script này trên Supabase SQL Editor của project MỚI.
-- ==============================================================

-- 1. Create mm_profiles table
CREATE TABLE IF NOT EXISTS public.mm_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'customer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.mm_profiles ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies for mm_profiles
-- Allow public read access to mm_profiles
CREATE POLICY "Public mm_profiles are viewable by everyone."
ON public.mm_profiles FOR SELECT
USING (true);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert their own profile."
ON public.mm_profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile."
ON public.mm_profiles FOR UPDATE
USING (auth.uid() = id);

-- 4. Set up Realtime
-- This is necessary to listen for changes to the mm_profiles table
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime;
COMMIT;
ALTER PUBLICATION supabase_realtime ADD TABLE public.mm_profiles;
