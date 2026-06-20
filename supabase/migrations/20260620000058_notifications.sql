CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN (
    'reward_earned', 'badge_awarded', 'follow', 'tip_received',
    'governance_vote', 'event_starting', 'achievement_unlocked', 'system'
  )),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  action_url TEXT,
  image_url TEXT,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX notifications_wallet_idx ON notifications (wallet, is_read, created_at DESC);
