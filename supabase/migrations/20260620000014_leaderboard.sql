CREATE TABLE leaderboard_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet TEXT NOT NULL,
  period TEXT NOT NULL CHECK (period IN ('daily','weekly','alltime')),
  points INTEGER NOT NULL DEFAULT 0,
  rank INTEGER NOT NULL,
  snapshot_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (wallet, period, snapshot_date)
);

CREATE INDEX leaderboard_period_rank_idx ON leaderboard_snapshots (period, rank, snapshot_date DESC);
CREATE INDEX leaderboard_wallet_idx ON leaderboard_snapshots (wallet, period);
