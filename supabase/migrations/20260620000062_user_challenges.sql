CREATE TABLE challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  challenge_type TEXT NOT NULL CHECK (challenge_type IN ('daily', 'weekly', 'seasonal', 'special')),
  reward_melo INTEGER NOT NULL DEFAULT 0,
  target_count INTEGER NOT NULL DEFAULT 1,
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE challenge_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet TEXT NOT NULL,
  challenge_id UUID NOT NULL REFERENCES challenges(id),
  current_count INTEGER NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  reward_claimed BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (wallet, challenge_id)
);

INSERT INTO challenges (slug, title, description, challenge_type, reward_melo, target_count, start_date)
VALUES
  ('daily-watcher', 'Daily Watcher', 'Watch 3 videos today', 'daily', 5, 3, CURRENT_DATE),
  ('weekly-explorer', 'Weekly Explorer', 'Watch 5 different categories this week', 'weekly', 25, 5, CURRENT_DATE),
  ('streak-starter', 'Streak Starter', 'Build a 3-day watch streak', 'special', 15, 3, CURRENT_DATE);

CREATE INDEX challenge_progress_wallet_idx ON challenge_progress (wallet, completed, updated_at DESC);
