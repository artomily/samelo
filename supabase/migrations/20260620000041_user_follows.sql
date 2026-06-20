CREATE TABLE user_follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_wallet TEXT NOT NULL,
  following_wallet TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (follower_wallet, following_wallet),
  CHECK (follower_wallet <> following_wallet)
);

CREATE TABLE user_profiles (
  wallet TEXT PRIMARY KEY,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  twitter_handle TEXT,
  is_creator BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX user_follows_follower_idx ON user_follows (follower_wallet, created_at DESC);
CREATE INDEX user_follows_following_idx ON user_follows (following_wallet, created_at DESC);
