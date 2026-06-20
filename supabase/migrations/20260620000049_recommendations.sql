CREATE TABLE recommendation_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet TEXT NOT NULL,
  video_id TEXT NOT NULL,
  signal_type TEXT NOT NULL CHECK (signal_type IN ('watch', 'complete', 'like', 'share', 'quiz_pass', 'replay')),
  signal_weight NUMERIC(4, 2) NOT NULL DEFAULT 1.0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE video_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id TEXT NOT NULL,
  tag TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (video_id, tag)
);

CREATE TABLE recommendation_cache (
  wallet TEXT NOT NULL,
  video_ids TEXT[] NOT NULL DEFAULT '{}',
  reason TEXT,
  computed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (wallet)
);

CREATE INDEX recommendation_signals_wallet_idx ON recommendation_signals (wallet, created_at DESC);
CREATE INDEX recommendation_signals_video_idx ON recommendation_signals (video_id, signal_type);
CREATE INDEX video_tags_tag_idx ON video_tags (tag);
CREATE INDEX video_tags_video_idx ON video_tags (video_id);
