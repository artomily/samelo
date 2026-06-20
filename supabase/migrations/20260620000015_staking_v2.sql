CREATE TABLE staking_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet TEXT NOT NULL,
  amount_melo NUMERIC(20,8) NOT NULL,
  tier INTEGER NOT NULL CHECK (tier IN (1,2,3,4)),
  duration_days INTEGER NOT NULL CHECK (duration_days IN (7,30,90,180)),
  bonus_multiplier NUMERIC(4,2) NOT NULL,
  staked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  unstake_at TIMESTAMPTZ NOT NULL,
  unstaked_at TIMESTAMPTZ,
  reward_points INTEGER NOT NULL DEFAULT 0,
  tx_hash TEXT
);

CREATE TABLE staking_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  position_id UUID NOT NULL REFERENCES staking_positions(id),
  wallet TEXT NOT NULL,
  points INTEGER NOT NULL,
  epoch_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (position_id, epoch_date)
);

CREATE INDEX staking_positions_wallet_idx ON staking_positions (wallet, staked_at DESC);
CREATE INDEX staking_positions_active_idx ON staking_positions (wallet) WHERE unstaked_at IS NULL;
