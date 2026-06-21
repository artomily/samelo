CREATE TABLE giveaways (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_wallet TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  prize_melo INTEGER NOT NULL DEFAULT 0,
  prize_description TEXT,
  max_entries INTEGER,
  entry_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'ended', 'drawn', 'cancelled')),
  ends_at TIMESTAMPTZ NOT NULL,
  winner_wallet TEXT,
  drawn_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE giveaway_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  giveaway_id UUID NOT NULL REFERENCES giveaways(id),
  wallet TEXT NOT NULL,
  entry_count INTEGER NOT NULL DEFAULT 1,
  entered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (giveaway_id, wallet)
);

CREATE INDEX giveaways_status_idx ON giveaways (status, ends_at DESC);
CREATE INDEX giveaway_entries_giveaway_idx ON giveaway_entries (giveaway_id, entered_at DESC);
