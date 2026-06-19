-- Profile enhancement columns for avatar, bio, streaks, and XP
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS twitter_handle TEXT,
  ADD COLUMN IF NOT EXISTS current_streak INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS longest_streak INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_watch_date DATE,
  ADD COLUMN IF NOT EXISTS xp INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS level INTEGER NOT NULL DEFAULT 1;

-- Index for XP-based leaderboard
CREATE INDEX IF NOT EXISTS idx_profiles_xp ON profiles (xp DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_level ON profiles (level DESC);

COMMENT ON COLUMN profiles.current_streak IS 'Consecutive days with at least one watch';
COMMENT ON COLUMN profiles.xp IS 'Total experience points (watches × 1 + quizzes × 3 + referrals × 10)';
COMMENT ON COLUMN profiles.level IS 'Derived from XP thresholds: 1=Observer,2=Watcher,3=Miner,4=Pioneer,5=Legend';
