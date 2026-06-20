CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('achievement','reward','social','system','swap','stake')),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX notifications_wallet_idx ON notifications (wallet, created_at DESC);
CREATE INDEX notifications_unread_idx ON notifications (wallet, read_at) WHERE read_at IS NULL;

CREATE TABLE notification_preferences (
  wallet TEXT PRIMARY KEY,
  achievement BOOLEAN NOT NULL DEFAULT true,
  reward BOOLEAN NOT NULL DEFAULT true,
  social BOOLEAN NOT NULL DEFAULT true,
  system BOOLEAN NOT NULL DEFAULT true,
  swap BOOLEAN NOT NULL DEFAULT true,
  stake BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
