CREATE TABLE treasury_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tx_type TEXT NOT NULL CHECK (tx_type IN ('inflow', 'outflow', 'transfer')),
  category TEXT NOT NULL CHECK (category IN (
    'protocol_fee', 'subscription', 'tip_fee', 'stake_reward', 'grant',
    'marketing', 'development', 'operations', 'reward_payout', 'other'
  )),
  amount_melo NUMERIC(18, 8) NOT NULL CHECK (amount_melo > 0),
  amount_usd NUMERIC(18, 2),
  description TEXT,
  tx_hash TEXT,
  from_address TEXT,
  to_address TEXT,
  block_number BIGINT,
  epoch TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE treasury_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  balance_melo NUMERIC(18, 8) NOT NULL DEFAULT 0,
  balance_cusd NUMERIC(18, 2) NOT NULL DEFAULT 0,
  total_inflow_melo NUMERIC(18, 8) NOT NULL DEFAULT 0,
  total_outflow_melo NUMERIC(18, 8) NOT NULL DEFAULT 0,
  snapshot_date DATE NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX treasury_transactions_type_idx ON treasury_transactions (tx_type, created_at DESC);
CREATE INDEX treasury_transactions_category_idx ON treasury_transactions (category, created_at DESC);
