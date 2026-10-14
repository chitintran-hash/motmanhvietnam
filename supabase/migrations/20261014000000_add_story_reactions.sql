-- Thêm các cột lưu trữ tương tác bài viết (Thả tim, Like, Dislike)
ALTER TABLE mm_stories ADD COLUMN IF NOT EXISTS hearts_count integer DEFAULT 0;
ALTER TABLE mm_stories ADD COLUMN IF NOT EXISTS likes_count integer DEFAULT 0;
ALTER TABLE mm_stories ADD COLUMN IF NOT EXISTS dislikes_count integer DEFAULT 0;

-- Cập nhật dữ liệu mặc định cho các bài viết đã có
UPDATE mm_stories SET hearts_count = 0 WHERE hearts_count IS NULL;
UPDATE mm_stories SET likes_count = 0 WHERE likes_count IS NULL;
UPDATE mm_stories SET dislikes_count = 0 WHERE dislikes_count IS NULL;
