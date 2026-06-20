CREATE TABLE badge_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('platform', 'creator', 'community', 'special', 'seasonal')),
  rarity TEXT NOT NULL DEFAULT 'common' CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
  image_url TEXT,
  animated_url TEXT,
  background_color TEXT NOT NULL DEFAULT '#1a1a1a',
  is_transferable BOOLEAN NOT NULL DEFAULT FALSE,
  max_supply INTEGER,
  total_issued INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE user_badge_awards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet TEXT NOT NULL,
  badge_type_id UUID NOT NULL REFERENCES badge_types(id),
  awarded_by TEXT,
  award_reason TEXT,
  token_id TEXT,
  displayed BOOLEAN NOT NULL DEFAULT FALSE,
  awarded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (wallet, badge_type_id)
);

INSERT INTO badge_types (slug, name, description, category, rarity, background_color)
VALUES
  ('early-adopter', 'Early Adopter', 'Joined Samelo in the first 1000 users', 'platform', 'epic', '#0d1a0d'),
  ('celo-native', 'Celo Native', 'First transaction was on Celo mainnet', 'platform', 'rare', '#0d0d1a'),
  ('top-voter', 'Top Voter', 'Voted in 5+ governance proposals', 'community', 'uncommon', '#1a0d0d'),
  ('content-creator', 'Content Creator', 'Uploaded 3+ videos to the platform', 'creator', 'rare', '#1a1a0d'),
  ('social-star', 'Social Star', 'Gained 50+ followers', 'community', 'uncommon', '#0d1a1a');

CREATE INDEX user_badge_awards_wallet_idx ON user_badge_awards (wallet, awarded_at DESC);
