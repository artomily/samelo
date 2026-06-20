CREATE TABLE proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  proposer_wallet TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','passed','rejected','cancelled')),
  votes_for INTEGER NOT NULL DEFAULT 0,
  votes_against INTEGER NOT NULL DEFAULT 0,
  min_melo_to_vote INTEGER NOT NULL DEFAULT 100,
  starts_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ends_at TIMESTAMPTZ NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE votes (
  proposal_id UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  voter_wallet TEXT NOT NULL,
  vote TEXT NOT NULL CHECK (vote IN ('for','against')),
  melo_weight INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (proposal_id, voter_wallet)
);

CREATE INDEX proposals_status_idx ON proposals (status, ends_at);
CREATE INDEX votes_proposal_idx ON votes (proposal_id);
