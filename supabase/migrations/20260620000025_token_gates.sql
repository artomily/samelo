CREATE TABLE token_gates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  token_address TEXT NOT NULL,
  chain_id INTEGER NOT NULL DEFAULT 42220,
  min_balance NUMERIC NOT NULL DEFAULT 1,
  token_type TEXT NOT NULL CHECK (token_type IN ('erc20', 'erc721', 'erc1155')),
  resource_type TEXT NOT NULL CHECK (resource_type IN ('video', 'playlist', 'feature')),
  resource_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE token_gate_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet TEXT NOT NULL,
  gate_id UUID NOT NULL REFERENCES token_gates(id) ON DELETE CASCADE,
  passed BOOLEAN NOT NULL,
  checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX token_gates_resource_idx ON token_gates (resource_type, resource_id);
CREATE INDEX token_gate_checks_wallet_idx ON token_gate_checks (wallet, gate_id);
