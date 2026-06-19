-- Record of every points-to-MELO swap for audit and analytics
CREATE TABLE IF NOT EXISTS point_swaps (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL REFERENCES profiles (wallet_address) ON DELETE CASCADE,
  points_burned  INTEGER NOT NULL CHECK (points_burned > 0),
  melo_received  NUMERIC(20, 6) NOT NULL,
  tx_hash        TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_point_swaps_wallet ON point_swaps (wallet_address);
CREATE INDEX IF NOT EXISTS idx_point_swaps_created_at ON point_swaps (created_at DESC);

COMMENT ON TABLE point_swaps IS 'Audit log of every points-to-$MELO swap';
