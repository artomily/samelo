CREATE TABLE tips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_wallet TEXT NOT NULL,
  recipient_wallet TEXT NOT NULL,
  amount_melo NUMERIC(18, 8) NOT NULL CHECK (amount_melo > 0),
  message TEXT,
  video_id TEXT,
  tx_hash TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  CHECK (sender_wallet <> recipient_wallet)
);

CREATE INDEX tips_sender_idx ON tips (sender_wallet, created_at DESC);
CREATE INDEX tips_recipient_idx ON tips (recipient_wallet, created_at DESC);
CREATE INDEX tips_video_idx ON tips (video_id, created_at DESC) WHERE video_id IS NOT NULL;
