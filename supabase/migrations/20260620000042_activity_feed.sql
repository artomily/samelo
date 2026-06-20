CREATE TABLE activity_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'watch_complete', 'quiz_pass', 'badge_earned', 'level_up',
    'checkin', 'stake', 'swap', 'follow', 'collection_create',
    'governance_vote', 'achievement_unlock', 'referral_join'
  )),
  payload JSONB NOT NULL DEFAULT '{}',
  points_delta INTEGER NOT NULL DEFAULT 0,
  is_public BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX activity_events_wallet_idx ON activity_events (wallet, created_at DESC);
CREATE INDEX activity_events_type_idx ON activity_events (event_type, created_at DESC);
CREATE INDEX activity_events_public_idx ON activity_events (is_public, created_at DESC) WHERE is_public = TRUE;
