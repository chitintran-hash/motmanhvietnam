ALTER TABLE mm_products ADD COLUMN IF NOT EXISTS additional_images text[] DEFAULT '{}'::text[];
