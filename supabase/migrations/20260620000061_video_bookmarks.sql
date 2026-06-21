CREATE TABLE video_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet TEXT NOT NULL,
  video_id TEXT NOT NULL,
  timestamp_ms INTEGER,
  note TEXT,
  is_private BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (wallet, video_id, COALESCE(timestamp_ms, -1))
);

CREATE INDEX video_bookmarks_wallet_idx ON video_bookmarks (wallet, created_at DESC);
CREATE INDEX video_bookmarks_video_idx ON video_bookmarks (video_id, is_private, created_at DESC);
