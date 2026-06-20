CREATE TABLE reward_claim_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('leaderboard', 'referral', 'staking', 'mission', 'bonus')),
  amount_melo NUMERIC(18, 8) NOT NULL CHECK (amount_melo > 0),
  reference_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'paid', 'failed', 'rejected')),
  tx_hash TEXT,
  admin_note TEXT,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

CREATE INDEX reward_claims_wallet_idx ON reward_claim_requests (wallet, requested_at DESC);
CREATE INDEX reward_claims_status_idx ON reward_claim_requests (status, requested_at ASC) WHERE status IN ('pending', 'processing');
