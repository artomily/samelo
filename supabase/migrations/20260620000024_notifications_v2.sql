CREATE TABLE notifications_v2 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN (
    'points_earned','achievement_unlocked','level_up','referral_joined',
    'checkin_streak','staking_reward','swap_complete','comment_reply','follow'
  )),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  action_url TEXT,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX notifications_v2_wallet_idx ON notifications_v2 (wallet, created_at DESC);
CREATE INDEX notifications_v2_unread_idx ON notifications_v2 (wallet, read_at) WHERE read_at IS NULL;
