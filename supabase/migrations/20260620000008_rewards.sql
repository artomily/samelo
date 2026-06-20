CREATE TABLE daily_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet TEXT NOT NULL,
  day DATE NOT NULL,
  points_earned INTEGER NOT NULL DEFAULT 0,
  videos_watched INTEGER NOT NULL DEFAULT 0,
  quizzes_passed INTEGER NOT NULL DEFAULT 0,
  bonus_multiplier NUMERIC(4,2) NOT NULL DEFAULT 1.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (wallet, day)
);

CREATE TABLE reward_tiers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  min_daily_points INTEGER NOT NULL,
  bonus_multiplier NUMERIC(4,2) NOT NULL,
  badge_emoji TEXT NOT NULL
);

INSERT INTO reward_tiers (name, min_daily_points, bonus_multiplier, badge_emoji) VALUES
  ('Starter', 0, 1.00, '⭐'),
  ('Active', 100, 1.10, '🔥'),
  ('Super', 300, 1.25, '💎'),
  ('Legend', 600, 1.50, '🌟');

CREATE TABLE weekly_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet TEXT NOT NULL,
  week_start DATE NOT NULL,
  total_points INTEGER NOT NULL DEFAULT 0,
  streak_days INTEGER NOT NULL DEFAULT 0,
  rank INTEGER,
  reward_claimed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (wallet, week_start)
);

CREATE INDEX daily_rewards_wallet_day_idx ON daily_rewards (wallet, day DESC);
CREATE INDEX weekly_rewards_wallet_idx ON weekly_rewards (wallet, week_start DESC);
CREATE INDEX weekly_rewards_rank_idx ON weekly_rewards (week_start, total_points DESC);
