-- Missions system: structured tasks users complete to earn bonus points
-- Each mission has a type, target value, and reward

CREATE TABLE IF NOT EXISTS missions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT NOT NULL UNIQUE,
  title         TEXT NOT NULL,
  description   TEXT NOT NULL,
  mission_type  TEXT NOT NULL CHECK (mission_type IN ('watch_count', 'quiz_count', 'referral_count', 'points_threshold')),
  target_value  INTEGER NOT NULL CHECK (target_value > 0),
  reward_points INTEGER NOT NULL CHECK (reward_points > 0),
  is_active     BOOLEAN NOT NULL DEFAULT true,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_missions_active_sort ON missions (is_active, sort_order);

-- Per-user mission progress tracking
CREATE TABLE IF NOT EXISTS user_missions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL REFERENCES profiles (wallet_address) ON DELETE CASCADE,
  mission_id    UUID NOT NULL REFERENCES missions (id) ON DELETE CASCADE,
  progress      INTEGER NOT NULL DEFAULT 0,
  completed_at  TIMESTAMPTZ,
  claimed_at    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (wallet_address, mission_id)
);

CREATE INDEX IF NOT EXISTS idx_user_missions_wallet ON user_missions (wallet_address);
CREATE INDEX IF NOT EXISTS idx_user_missions_mission ON user_missions (mission_id);

COMMENT ON TABLE missions IS 'Global mission definitions — watch N videos, complete M quizzes, etc.';
COMMENT ON TABLE user_missions IS 'Per-user progress toward each mission';
