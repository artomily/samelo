CREATE TABLE onchain_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tx_hash TEXT NOT NULL,
  block_number BIGINT NOT NULL,
  chain_id INTEGER NOT NULL,
  contract_address TEXT NOT NULL,
  event_name TEXT NOT NULL,
  wallet TEXT,
  data JSONB NOT NULL DEFAULT '{}',
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tx_hash, event_name)
);

CREATE INDEX onchain_events_wallet_idx ON onchain_events (wallet, event_name);
CREATE INDEX onchain_events_unprocessed_idx ON onchain_events (created_at) WHERE processed_at IS NULL;
CREATE INDEX onchain_events_block_idx ON onchain_events (chain_id, block_number DESC);
