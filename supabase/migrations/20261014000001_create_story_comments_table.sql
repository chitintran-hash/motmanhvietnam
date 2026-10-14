-- Tạo bảng lưu trữ bình luận cho bài viết Story Hub
CREATE TABLE IF NOT EXISTS public.mm_story_comments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    story_id uuid REFERENCES public.mm_stories(id) ON DELETE CASCADE,
    story_slug text,
    user_id uuid,
    user_name text NOT NULL,
    user_email text,
    user_avatar text,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Bật Row Level Security (RLS)
ALTER TABLE public.mm_story_comments ENABLE ROW LEVEL SECURITY;

-- Tạo chính sách xem và thêm bình luận
CREATE POLICY "Public can view story comments" ON public.mm_story_comments
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert story comments" ON public.mm_story_comments
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users or admin can delete story comments" ON public.mm_story_comments
    FOR DELETE USING (true);
