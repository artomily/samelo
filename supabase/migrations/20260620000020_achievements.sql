CREATE TABLE achievement_definitions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('watch','quiz','social','stake','swap','general')),
  points_reward INTEGER NOT NULL DEFAULT 0,
  threshold INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet TEXT NOT NULL,
  achievement_id TEXT NOT NULL REFERENCES achievement_definitions(id),
  progress INTEGER NOT NULL DEFAULT 0,
  unlocked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (wallet, achievement_id)
);

CREATE INDEX user_achievements_wallet_idx ON user_achievements (wallet, unlocked_at DESC);
CREATE INDEX user_achievements_unlocked_idx ON user_achievements (achievement_id) WHERE unlocked_at IS NOT NULL;

INSERT INTO achievement_definitions (id, name, description, icon, category, points_reward, threshold) VALUES
  ('first_watch',     'First Watch',       'Watch your first video',               '🎬', 'watch',   50,    1),
  ('watch_10',        'Binge Starter',     'Watch 10 videos',                      '📺', 'watch',   100,   10),
  ('watch_100',       'Content Miner',     'Watch 100 videos',                     '⛏️', 'watch',   500,   100),
  ('first_quiz',      'Quiz Taker',        'Complete your first quiz',             '📝', 'quiz',    50,    1),
  ('quiz_streak_7',   'Quiz Streak',       'Pass 7 quizzes in a row',              '🔥', 'quiz',    200,   7),
  ('first_stake',     'Staker',            'Stake MELO for the first time',        '💎', 'stake',   100,   1),
  ('first_swap',      'Swapper',           'Complete your first token swap',       '🔄', 'swap',    100,   1),
  ('first_referral',  'Connector',         'Refer your first friend',              '🤝', 'social',  150,   1),
  ('follow_10',       'Social Miner',      'Follow 10 other users',                '👥', 'social',  100,   10),
  ('points_1000',     'Point Collector',   'Earn 1,000 points total',              '⭐', 'general', 0,     1000),
  ('points_10000',    'Point Hoarder',     'Earn 10,000 points total',             '🌟', 'general', 0,     10000),
  ('legend_tier',     'Legend',            'Reach Legend reward tier',             '👑', 'general', 1000,  1);
