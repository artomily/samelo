CREATE TABLE video_chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id TEXT NOT NULL,
  title TEXT NOT NULL,
  start_time_seconds INTEGER NOT NULL CHECK (start_time_seconds >= 0),
  end_time_seconds INTEGER,
  description TEXT,
  thumbnail_url TEXT,
  has_quiz BOOLEAN NOT NULL DEFAULT FALSE,
  points_reward INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT end_after_start CHECK (end_time_seconds IS NULL OR end_time_seconds > start_time_seconds)
);

CREATE TABLE video_chapter_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet TEXT NOT NULL,
  chapter_id UUID NOT NULL REFERENCES video_chapters(id) ON DELETE CASCADE,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  watch_pct INTEGER NOT NULL DEFAULT 0 CHECK (watch_pct BETWEEN 0 AND 100),
  points_awarded BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (wallet, chapter_id)
);

CREATE INDEX video_chapters_video_idx ON video_chapters (video_id, sort_order ASC);
CREATE INDEX chapter_progress_wallet_idx ON video_chapter_progress (wallet, created_at DESC);
