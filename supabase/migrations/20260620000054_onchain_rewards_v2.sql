CREATE TABLE onchain_reward_queues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet TEXT NOT NULL,
  reward_type TEXT NOT NULL CHECK (reward_type IN ('watch_milestone', 'streak_bonus', 'quiz_perfect', 'referral_bonus', 'level_up_bonus')),
  amount_melo NUMERIC(18, 8) NOT NULL CHECK (amount_melo > 0),
  reference_id TEXT,
  oracle_signature TEXT,
  nonce TEXT NOT NULL DEFAULT encode(gen_random_bytes(16), 'hex'),
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'signed', 'submitted', 'confirmed', 'failed')),
  tx_hash TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

CREATE INDEX onchain_reward_queues_wallet_idx ON onchain_reward_queues (wallet, status, created_at DESC);
CREATE INDEX onchain_reward_queues_status_idx ON onchain_reward_queues (status, created_at ASC) WHERE status IN ('queued', 'signed');
