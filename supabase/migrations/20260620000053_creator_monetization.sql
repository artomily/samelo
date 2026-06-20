CREATE TABLE creator_revenue_splits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_wallet TEXT NOT NULL,
  video_id TEXT,
  split_type TEXT NOT NULL CHECK (split_type IN ('watch_reward', 'quiz_reward', 'tip', 'subscription_share')),
  platform_fee_pct NUMERIC(5, 2) NOT NULL DEFAULT 20.00,
  creator_share_pct NUMERIC(5, 2) NOT NULL DEFAULT 80.00,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (platform_fee_pct + creator_share_pct = 100)
);

CREATE TABLE creator_earnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_wallet TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('watch_reward', 'quiz_reward', 'tip', 'subscription_share', 'referral')),
  gross_amount_melo NUMERIC(18, 8) NOT NULL,
  platform_fee_melo NUMERIC(18, 8) NOT NULL DEFAULT 0,
  net_amount_melo NUMERIC(18, 8) NOT NULL,
  video_id TEXT,
  reference_id TEXT,
  paid_out BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE creator_payout_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_wallet TEXT NOT NULL,
  amount_melo NUMERIC(18, 8) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed')),
  tx_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX creator_earnings_wallet_idx ON creator_earnings (creator_wallet, created_at DESC);
CREATE INDEX creator_payout_requests_wallet_idx ON creator_payout_requests (creator_wallet, created_at DESC);
