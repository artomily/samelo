CREATE TABLE live_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  host_wallet TEXT NOT NULL,
  stream_url TEXT,
  thumbnail_url TEXT,
  scheduled_at TIMESTAMPTZ NOT NULL,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'ended', 'cancelled')),
  max_attendees INTEGER,
  points_reward INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE live_event_rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES live_events(id) ON DELETE CASCADE,
  wallet TEXT NOT NULL,
  reminded BOOLEAN NOT NULL DEFAULT FALSE,
  attended BOOLEAN NOT NULL DEFAULT FALSE,
  points_awarded BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (event_id, wallet)
);

CREATE INDEX live_events_status_idx ON live_events (status, scheduled_at ASC);
CREATE INDEX live_event_rsvps_wallet_idx ON live_event_rsvps (wallet, created_at DESC);
