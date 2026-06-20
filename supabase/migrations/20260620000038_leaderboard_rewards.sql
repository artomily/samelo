CREATE TABLE reward_epochs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  epoch_number INTEGER NOT NULL UNIQUE,
  period TEXT NOT NULL CHECK (period IN ('weekly', 'monthly')),
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  total_reward_pool_melo NUMERIC(18, 8) NOT NULL DEFAULT 0,
  distributed BOOLEAN NOT NULL DEFAULT FALSE,
  distributed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE reward_distributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  epoch_id UUID NOT NULL REFERENCES reward_epochs(id),
  wallet TEXT NOT NULL,
  rank INTEGER NOT NULL,
  points_earned INTEGER NOT NULL,
  melo_amount NUMERIC(18, 8) NOT NULL,
  tx_hash TEXT,
  claimed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (epoch_id, wallet)
);

CREATE INDEX reward_distributions_wallet_idx ON reward_distributions (wallet, created_at DESC);
CREATE INDEX reward_epochs_period_idx ON reward_epochs (period, ends_at DESC);
