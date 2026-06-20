CREATE TABLE watch_parties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_wallet TEXT NOT NULL,
  video_id TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'lobby' CHECK (status IN ('lobby','live','ended')),
  max_participants INTEGER NOT NULL DEFAULT 50,
  playback_position_seconds INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE watch_party_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  party_id UUID NOT NULL REFERENCES watch_parties(id) ON DELETE CASCADE,
  wallet TEXT NOT NULL,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  left_at TIMESTAMPTZ,
  UNIQUE (party_id, wallet)
);

CREATE INDEX watch_parties_status_idx ON watch_parties (status, created_at DESC);
CREATE INDEX watch_party_participants_party_idx ON watch_party_participants (party_id);
