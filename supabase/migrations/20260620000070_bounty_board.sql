CREATE TABLE bounties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_wallet TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  reward_melo INTEGER NOT NULL,
  category TEXT NOT NULL DEFAULT 'general' CHECK (category IN ('bug', 'feature', 'content', 'translation', 'design', 'general')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_review', 'completed', 'cancelled')),
  deadline DATE,
  winner_wallet TEXT,
  submission_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE bounty_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bounty_id UUID NOT NULL REFERENCES bounties(id),
  submitter_wallet TEXT NOT NULL,
  submission_url TEXT,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  feedback TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (bounty_id, submitter_wallet)
);

CREATE INDEX bounties_status_idx ON bounties (status, created_at DESC);
CREATE INDEX bounty_submissions_bounty_idx ON bounty_submissions (bounty_id, status);
