CREATE TABLE price_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol TEXT NOT NULL,
  price_usd NUMERIC(18, 8) NOT NULL,
  price_celo NUMERIC(18, 8),
  market_cap_usd NUMERIC(24, 2),
  volume_24h_usd NUMERIC(24, 2),
  change_24h_pct NUMERIC(8, 4),
  source TEXT NOT NULL DEFAULT 'coingecko',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX price_snapshots_symbol_idx ON price_snapshots (symbol, created_at DESC);

CREATE TABLE price_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet TEXT NOT NULL,
  symbol TEXT NOT NULL,
  target_price_usd NUMERIC(18, 8) NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('above', 'below')),
  triggered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX price_alerts_wallet_idx ON price_alerts (wallet);
