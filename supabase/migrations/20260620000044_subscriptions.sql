CREATE TABLE subscription_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  price_melo_monthly NUMERIC(18, 8) NOT NULL DEFAULT 0,
  price_melo_yearly NUMERIC(18, 8) NOT NULL DEFAULT 0,
  features JSONB NOT NULL DEFAULT '[]',
  max_watch_hours_per_day INTEGER,
  bonus_points_pct INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet TEXT NOT NULL,
  tier_id UUID NOT NULL REFERENCES subscription_tiers(id),
  period TEXT NOT NULL CHECK (period IN ('monthly', 'yearly')),
  starts_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ends_at TIMESTAMPTZ NOT NULL,
  tx_hash TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (wallet, tier_id, starts_at)
);

INSERT INTO subscription_tiers (name, display_name, price_melo_monthly, price_melo_yearly, bonus_points_pct, sort_order, features)
VALUES
  ('free', 'Free', 0, 0, 0, 0, '["Basic watch-to-earn","Public leaderboard"]'),
  ('pro', 'Pro', 10, 100, 25, 1, '["2x point multiplier","Early event access","HD streaming"]'),
  ('elite', 'Elite', 25, 250, 50, 2, '["3x point multiplier","Exclusive content","Priority support","Custom badge"]');

CREATE INDEX user_subscriptions_wallet_idx ON user_subscriptions (wallet, ends_at DESC);
