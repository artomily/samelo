CREATE TABLE watch_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet TEXT NOT NULL UNIQUE,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_watch_date DATE,
  streak_started_at DATE,
  total_watch_days INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE watch_streak_checkpoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet TEXT NOT NULL,
  watch_date DATE NOT NULL,
  minutes_watched INTEGER NOT NULL DEFAULT 0,
  streak_day INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (wallet, watch_date)
);

CREATE INDEX watch_streaks_wallet_idx ON watch_streaks (wallet);
CREATE INDEX streak_checkpoints_wallet_idx ON watch_streak_checkpoints (wallet, watch_date DESC);
