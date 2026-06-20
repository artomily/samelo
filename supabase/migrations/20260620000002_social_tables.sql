-- Follow system and activity feed
CREATE TABLE IF NOT EXISTS follows (
  follower_wallet TEXT NOT NULL,
  following_wallet TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (follower_wallet, following_wallet)
);

CREATE INDEX IF NOT EXISTS idx_follows_following ON follows (following_wallet);
CREATE INDEX IF NOT EXISTS idx_follows_follower ON follows (follower_wallet);

-- Activity feed events
CREATE TABLE IF NOT EXISTS activity_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('watch','quiz','swap','stake','achievement','follow')),
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_events_wallet ON activity_events (wallet, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_events_type ON activity_events (event_type);

-- Reactions on activity events
CREATE TABLE IF NOT EXISTS reactions (
  event_id UUID NOT NULL REFERENCES activity_events (id) ON DELETE CASCADE,
  wallet TEXT NOT NULL,
  emoji TEXT NOT NULL DEFAULT '🔥',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (event_id, wallet)
);

CREATE INDEX IF NOT EXISTS idx_reactions_event ON reactions (event_id);

COMMENT ON TABLE follows IS 'Wallet-to-wallet follow graph for social feed';
COMMENT ON TABLE activity_events IS 'Feed events: watches, quizzes, achievements, etc.';
COMMENT ON TABLE reactions IS 'Emoji reactions on activity events';
