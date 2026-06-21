CREATE TABLE content_series (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_wallet TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  is_public BOOLEAN NOT NULL DEFAULT TRUE,
  is_complete BOOLEAN NOT NULL DEFAULT FALSE,
  episode_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE series_episodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  series_id UUID NOT NULL REFERENCES content_series(id) ON DELETE CASCADE,
  video_id TEXT NOT NULL,
  episode_number INTEGER NOT NULL,
  title_override TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (series_id, episode_number),
  UNIQUE (series_id, video_id)
);

CREATE INDEX content_series_creator_idx ON content_series (creator_wallet, created_at DESC);
CREATE INDEX series_episodes_series_idx ON series_episodes (series_id, episode_number);
