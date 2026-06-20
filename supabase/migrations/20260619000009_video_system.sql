-- Video system enhancements: categories, tags, difficulty, featured
ALTER TABLE videos
  ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'general',
  ADD COLUMN IF NOT EXISTS difficulty TEXT NOT NULL DEFAULT 'beginner'
    CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS tags TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS duration_seconds INTEGER,
  ADD COLUMN IF NOT EXISTS thumbnail_url TEXT,
  ADD COLUMN IF NOT EXISTS watch_count INTEGER NOT NULL DEFAULT 0;

-- Index for category + featured browsing
CREATE INDEX IF NOT EXISTS idx_videos_category ON videos (category);
CREATE INDEX IF NOT EXISTS idx_videos_featured ON videos (is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_videos_difficulty ON videos (difficulty);

-- Watch count cache updated by trigger
CREATE OR REPLACE FUNCTION increment_video_watch_count()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  UPDATE videos SET watch_count = watch_count + 1 WHERE id = NEW.video_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_increment_watch_count
AFTER INSERT ON watches
FOR EACH ROW EXECUTE FUNCTION increment_video_watch_count();
