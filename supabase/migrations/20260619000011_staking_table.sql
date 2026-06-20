-- MELO staking positions — locked MELO earns bonus watch points
CREATE TABLE IF NOT EXISTS stake_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL REFERENCES profiles (wallet_address) ON DELETE CASCADE,
  amount_melo NUMERIC(28, 18) NOT NULL CHECK (amount_melo > 0),
  lock_days INTEGER NOT NULL CHECK (lock_days IN (7, 30, 90, 180)),
  bonus_multiplier NUMERIC(4, 2) NOT NULL,
  staked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  unlock_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  claimed_at TIMESTAMPTZ,
  tx_hash TEXT
);

CREATE INDEX IF NOT EXISTS idx_stake_wallet ON stake_positions (wallet_address, is_active);
CREATE INDEX IF NOT EXISTS idx_stake_unlock ON stake_positions (unlock_at) WHERE is_active = true;

COMMENT ON TABLE stake_positions IS
  'MELO staking positions. bonus_multiplier applied to watch point rewards while staked.';
