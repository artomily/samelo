-- Samelo Supabase schema
-- Run this in the Supabase SQL editor (or via supabase db push)

-- ── watches ────────────────────────────────────────────────────────────────
-- Stores each completed watch event and its reward state.

CREATE TABLE IF NOT EXISTS watches (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT        NOT NULL,
  video_id       TEXT        NOT NULL,
  reward_cents   INTEGER     NOT NULL DEFAULT 5,
  watched_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  claimed        BOOLEAN     NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS watches_wallet_idx
  ON watches (wallet_address);

CREATE INDEX IF NOT EXISTS watches_wallet_unclaimed_idx
  ON watches (wallet_address, claimed)
  WHERE claimed = FALSE;

-- Prevent duplicate reward for the same wallet+video within the same second
CREATE UNIQUE INDEX IF NOT EXISTS watches_dedup_idx
  ON watches (wallet_address, video_id, watched_at);

-- ── videos ─────────────────────────────────────────────────────────────────
-- Videos fetched from YouTube by the edge function.

CREATE TABLE IF NOT EXISTS videos (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  youtube_id       TEXT        NOT NULL UNIQUE,
  title            TEXT        NOT NULL,
  description      TEXT,
  thumbnail_url    TEXT,
  duration_seconds INTEGER,
  channel_name     TEXT,
  view_count       BIGINT      DEFAULT 0,
  reward_cents     INTEGER     NOT NULL DEFAULT 5,
  active           BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS videos_active_idx
  ON videos (active)
  WHERE active = TRUE;

-- ── RLS ────────────────────────────────────────────────────────────────────

ALTER TABLE watches ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos  ENABLE ROW LEVEL SECURITY;

-- Only the service role (Next.js backend) can read/write watches
CREATE POLICY "Service manages watches"
  ON watches FOR ALL
  USING  (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Videos are publicly readable; only service role can write
CREATE POLICY "Videos publicly readable"
  ON videos FOR SELECT
  USING (TRUE);

CREATE POLICY "Service manages videos"
  ON videos FOR ALL
  USING  (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
