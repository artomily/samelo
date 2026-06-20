CREATE TABLE achievement_definitions_v2 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('watch', 'social', 'quiz', 'staking', 'governance', 'streak', 'referral', 'special')),
  rarity TEXT NOT NULL DEFAULT 'common' CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
  icon_url TEXT,
  points_reward INTEGER NOT NULL DEFAULT 0,
  condition_type TEXT NOT NULL,
  condition_threshold INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE achievement_progress_v2 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet TEXT NOT NULL,
  achievement_id UUID NOT NULL REFERENCES achievement_definitions_v2(id),
  current_value INTEGER NOT NULL DEFAULT 0,
  unlocked BOOLEAN NOT NULL DEFAULT FALSE,
  unlocked_at TIMESTAMPTZ,
  points_awarded BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (wallet, achievement_id)
);

INSERT INTO achievement_definitions_v2 (slug, title, description, category, rarity, points_reward, condition_type, condition_threshold, sort_order)
VALUES
  ('first-watch', 'First Watch', 'Complete your first video', 'watch', 'common', 50, 'watch_count', 1, 0),
  ('quiz-master', 'Quiz Master', 'Pass 10 quizzes', 'quiz', 'uncommon', 200, 'quiz_pass_count', 10, 1),
  ('social-butterfly', 'Social Butterfly', 'Follow 5 creators', 'social', 'common', 100, 'follow_count', 5, 2),
  ('whale-staker', 'Whale Staker', 'Stake 1000 MELO', 'staking', 'rare', 500, 'stake_amount', 1000, 3),
  ('governance-voter', 'Governance Voter', 'Cast 3 governance votes', 'governance', 'uncommon', 150, 'vote_count', 3, 4),
  ('week-warrior', 'Week Warrior', 'Maintain a 7-day streak', 'streak', 'rare', 300, 'streak_days', 7, 5);

CREATE INDEX achievement_progress_v2_wallet_idx ON achievement_progress_v2 (wallet, unlocked, updated_at DESC);
