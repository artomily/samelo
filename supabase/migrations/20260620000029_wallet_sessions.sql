CREATE TABLE wallet_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet TEXT NOT NULL,
  session_token TEXT NOT NULL UNIQUE,
  ip_address TEXT,
  user_agent TEXT,
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX wallet_sessions_wallet_idx ON wallet_sessions (wallet, last_seen_at DESC);
CREATE INDEX wallet_sessions_token_idx ON wallet_sessions (session_token);

CREATE TABLE wallet_allowlist (
  wallet TEXT PRIMARY KEY,
  note TEXT,
  added_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
