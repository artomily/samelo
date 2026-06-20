CREATE TABLE video_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet TEXT NOT NULL,
  video_id TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review TEXT,
  watch_pct_at_rating INTEGER CHECK (watch_pct_at_rating BETWEEN 0 AND 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (wallet, video_id)
);

CREATE TABLE video_rating_stats (
  video_id TEXT PRIMARY KEY,
  rating_count INTEGER NOT NULL DEFAULT 0,
  rating_sum INTEGER NOT NULL DEFAULT 0,
  avg_rating NUMERIC(3, 2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX video_ratings_video_idx ON video_ratings (video_id, created_at DESC);
CREATE INDEX video_ratings_wallet_idx ON video_ratings (wallet, created_at DESC);
