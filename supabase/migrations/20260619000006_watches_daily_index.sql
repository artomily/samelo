-- Index to speed up daily grouping queries used by /api/onchain/flow
-- The watched_at column is queried with date truncation and range filters

CREATE INDEX IF NOT EXISTS idx_watches_watched_at_date
  ON watches (watched_at DESC);

CREATE INDEX IF NOT EXISTS idx_point_swaps_created_at_wallet
  ON point_swaps (created_at DESC, wallet_address);

COMMENT ON INDEX idx_watches_watched_at_date IS
  'Supports daily flow timeline queries on the on-chain dashboard';

COMMENT ON INDEX idx_point_swaps_created_at_wallet IS
  'Supports swap history and per-wallet flow queries';
