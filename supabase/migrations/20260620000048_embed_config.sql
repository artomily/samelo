CREATE TABLE embed_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_wallet TEXT NOT NULL,
  video_id TEXT NOT NULL,
  name TEXT NOT NULL,
  theme TEXT NOT NULL DEFAULT 'dark' CHECK (theme IN ('dark', 'light', 'brand')),
  autoplay BOOLEAN NOT NULL DEFAULT FALSE,
  show_quiz BOOLEAN NOT NULL DEFAULT TRUE,
  show_chapters BOOLEAN NOT NULL DEFAULT TRUE,
  show_points BOOLEAN NOT NULL DEFAULT TRUE,
  allow_fullscreen BOOLEAN NOT NULL DEFAULT TRUE,
  embed_domains TEXT[] NOT NULL DEFAULT '{}',
  view_count INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX embed_configs_owner_idx ON embed_configs (owner_wallet, created_at DESC);
CREATE INDEX embed_configs_video_idx ON embed_configs (video_id);
