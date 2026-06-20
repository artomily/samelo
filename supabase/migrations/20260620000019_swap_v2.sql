CREATE TABLE swap_quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet TEXT NOT NULL,
  token_in TEXT NOT NULL,
  token_out TEXT NOT NULL,
  amount_in NUMERIC(30,8) NOT NULL,
  amount_out NUMERIC(30,8) NOT NULL,
  price_impact NUMERIC(6,4) NOT NULL DEFAULT 0,
  slippage_bps INTEGER NOT NULL DEFAULT 50,
  route JSONB NOT NULL DEFAULT '[]',
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE swap_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet TEXT NOT NULL,
  quote_id UUID REFERENCES swap_quotes(id),
  token_in TEXT NOT NULL,
  token_out TEXT NOT NULL,
  amount_in NUMERIC(30,8) NOT NULL,
  amount_out NUMERIC(30,8) NOT NULL,
  tx_hash TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX swap_quotes_wallet_idx ON swap_quotes (wallet, expires_at DESC);
CREATE INDEX swap_history_wallet_idx ON swap_history (wallet, created_at DESC);
