CREATE TABLE points_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet TEXT NOT NULL,
  delta INTEGER NOT NULL,
  source TEXT NOT NULL CHECK (source IN (
    'watch','quiz','checkin','referral','stake','swap','achievement','badge','bonus','admin'
  )),
  description TEXT,
  reference_id TEXT,
  balance_after INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX points_history_wallet_idx ON points_history (wallet, created_at DESC);
CREATE INDEX points_history_source_idx ON points_history (source, created_at DESC);
