-- In-app notification center table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL REFERENCES profiles (wallet_address) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_wallet ON notifications (wallet_address, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications (wallet_address, read) WHERE read = false;

COMMENT ON TABLE notifications IS 'In-app notification log per wallet. Cleared after 30 days.';
