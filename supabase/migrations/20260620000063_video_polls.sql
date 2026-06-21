CREATE TABLE video_polls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id TEXT NOT NULL,
  creator_wallet TEXT NOT NULL,
  question TEXT NOT NULL,
  is_multiple_choice BOOLEAN NOT NULL DEFAULT FALSE,
  ends_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE poll_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID NOT NULL REFERENCES video_polls(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  option_index INTEGER NOT NULL,
  vote_count INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE poll_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID NOT NULL REFERENCES video_polls(id),
  option_id UUID NOT NULL REFERENCES poll_options(id),
  wallet TEXT NOT NULL,
  voted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (poll_id, wallet, option_id)
);

CREATE INDEX video_polls_video_idx ON video_polls (video_id, is_active);
CREATE INDEX poll_votes_poll_idx ON poll_votes (poll_id, wallet);
