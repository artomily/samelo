CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_wallet TEXT NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('video','comment','profile','playlist')),
  target_id TEXT NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN ('spam','inappropriate','misinformation','copyright','other')),
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','reviewed','actioned','dismissed')),
  reviewed_by TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (reporter_wallet, target_type, target_id)
);

CREATE TABLE banned_wallets (
  wallet TEXT PRIMARY KEY,
  reason TEXT NOT NULL,
  banned_by TEXT NOT NULL,
  banned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

CREATE INDEX reports_status_idx ON reports (status, created_at DESC);
CREATE INDEX reports_target_idx ON reports (target_type, target_id);
