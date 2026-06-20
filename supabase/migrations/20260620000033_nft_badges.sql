CREATE TABLE nft_badge_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  rarity TEXT NOT NULL CHECK (rarity IN ('common','uncommon','rare','epic','legendary')),
  criteria_type TEXT NOT NULL CHECK (criteria_type IN ('points','streak','referrals','videos_watched','achievements')),
  criteria_value INTEGER NOT NULL,
  supply_limit INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE nft_badge_mints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  badge_id UUID NOT NULL REFERENCES nft_badge_definitions(id),
  wallet TEXT NOT NULL,
  token_id TEXT,
  tx_hash TEXT,
  minted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (badge_id, wallet)
);

CREATE INDEX nft_badge_mints_wallet_idx ON nft_badge_mints (wallet, minted_at DESC);

INSERT INTO nft_badge_definitions (slug, name, description, image_url, rarity, criteria_type, criteria_value)
VALUES
  ('first-watch', 'First Watch', 'Watched your first video', '/badges/first-watch.png', 'common', 'videos_watched', 1),
  ('streak-7', '7-Day Streak', 'Checked in 7 days in a row', '/badges/streak-7.png', 'uncommon', 'streak', 7),
  ('streak-30', '30-Day Streak', 'Checked in 30 days in a row', '/badges/streak-30.png', 'rare', 'streak', 30),
  ('1k-points', 'Point Collector', 'Earned 1,000 points', '/badges/1k-points.png', 'common', 'points', 1000),
  ('pioneer', 'Pioneer', 'Earned 10,000 points', '/badges/pioneer.png', 'epic', 'points', 10000),
  ('legend', 'Legend', 'Earned 50,000 points', '/badges/legend.png', 'legendary', 'points', 50000);
