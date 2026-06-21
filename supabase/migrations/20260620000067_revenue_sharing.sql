CREATE TABLE revenue_splits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id TEXT NOT NULL UNIQUE,
  creator_wallet TEXT NOT NULL,
  creator_pct INTEGER NOT NULL DEFAULT 80 CHECK (creator_pct BETWEEN 0 AND 100),
  platform_pct INTEGER NOT NULL DEFAULT 20 CHECK (platform_pct BETWEEN 0 AND 100),
  collab_wallet TEXT,
  collab_pct INTEGER NOT NULL DEFAULT 0 CHECK (collab_pct BETWEEN 0 AND 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (creator_pct + platform_pct + collab_pct = 100)
);

CREATE TABLE revenue_distributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id TEXT NOT NULL,
  gross_melo INTEGER NOT NULL,
  creator_melo INTEGER NOT NULL,
  platform_melo INTEGER NOT NULL,
  collab_melo INTEGER NOT NULL DEFAULT 0,
  source TEXT NOT NULL CHECK (source IN ('ad', 'tip', 'subscription', 'course', 'nft')),
  distributed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX revenue_distributions_video_idx ON revenue_distributions (video_id, distributed_at DESC);
CREATE INDEX revenue_distributions_creator_idx ON revenue_distributions (video_id, source);
