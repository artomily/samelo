CREATE TABLE vesting_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet TEXT NOT NULL,
  total_melo NUMERIC(20,8) NOT NULL,
  vested_melo NUMERIC(20,8) NOT NULL DEFAULT 0,
  cliff_at TIMESTAMPTZ NOT NULL,
  vest_start TIMESTAMPTZ NOT NULL,
  vest_end TIMESTAMPTZ NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('team','advisor','community','investor','grants')),
  claimed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE vesting_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID NOT NULL REFERENCES vesting_schedules(id),
  wallet TEXT NOT NULL,
  amount NUMERIC(20,8) NOT NULL,
  tx_hash TEXT,
  claimed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX vesting_schedules_wallet_idx ON vesting_schedules (wallet);
CREATE INDEX vesting_claims_schedule_idx ON vesting_claims (schedule_id);
