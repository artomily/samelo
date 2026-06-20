CREATE TABLE xp_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet TEXT NOT NULL,
  amount INTEGER NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('watch','quiz','checkin','referral','stake','achievement','bonus')),
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS xp INTEGER NOT NULL DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS level INTEGER NOT NULL DEFAULT 1;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS level_updated_at TIMESTAMPTZ;

CREATE INDEX xp_events_wallet_idx ON xp_events (wallet, created_at DESC);
