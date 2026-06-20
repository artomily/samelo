CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event TEXT NOT NULL,
  wallet TEXT,
  session_id TEXT,
  properties JSONB DEFAULT '{}',
  url TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path TEXT NOT NULL,
  wallet TEXT,
  session_id TEXT,
  referrer TEXT,
  duration_ms INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE video_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id TEXT NOT NULL,
  wallet TEXT,
  event TEXT NOT NULL CHECK (event IN ('play','pause','complete','seek','error')),
  position_seconds NUMERIC(8,2),
  duration_seconds NUMERIC(8,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX analytics_events_wallet_idx ON analytics_events (wallet, created_at DESC);
CREATE INDEX analytics_events_event_idx ON analytics_events (event, created_at DESC);
CREATE INDEX page_views_path_idx ON page_views (path, created_at DESC);
CREATE INDEX video_events_video_idx ON video_events (video_id, event, created_at DESC);
