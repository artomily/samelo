CREATE TABLE price_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet TEXT NOT NULL,
  token_symbol TEXT NOT NULL DEFAULT 'MELO',
  condition TEXT NOT NULL CHECK (condition IN ('above', 'below')),
  target_price NUMERIC(18,6) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  triggered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE price_alert_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id UUID NOT NULL REFERENCES price_alerts(id) ON DELETE CASCADE,
  triggered_price NUMERIC(18,6) NOT NULL,
  triggered_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX price_alerts_wallet_idx ON price_alerts (wallet, is_active, created_at DESC);
CREATE INDEX price_alerts_active_idx ON price_alerts (token_symbol, is_active, condition, target_price);
