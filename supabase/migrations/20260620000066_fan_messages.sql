CREATE TABLE fan_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_wallet TEXT NOT NULL,
  to_wallet TEXT NOT NULL,
  subject TEXT,
  body TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  tip_melo INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE message_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES fan_messages(id) ON DELETE CASCADE,
  from_wallet TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX fan_messages_to_idx ON fan_messages (to_wallet, is_read, is_archived, created_at DESC);
CREATE INDEX fan_messages_from_idx ON fan_messages (from_wallet, created_at DESC);
CREATE INDEX message_replies_msg_idx ON message_replies (message_id, created_at ASC);
