-- Seed initial missions for launch
INSERT INTO missions (slug, title, description, mission_type, target_value, reward_points, sort_order)
VALUES
  ('first_watch',     'First Watch',        'Watch your first video on Samelo',              'watch_count',       1,   50,  10),
  ('watch_5',         'Getting Warmed Up',  'Watch 5 videos',                                'watch_count',       5,   100, 20),
  ('watch_25',        'Dedicated Viewer',   'Watch 25 videos',                               'watch_count',      25,   300, 30),
  ('watch_100',       'Century Club',       'Watch 100 videos',                              'watch_count',     100,  1000, 40),
  ('first_quiz',      'Quiz Starter',       'Complete your first quiz',                      'quiz_count',        1,   75,  50),
  ('quiz_10',         'Quiz Champion',      'Complete 10 quizzes',                           'quiz_count',       10,   200, 60),
  ('first_referral',  'Spread the Word',    'Refer your first friend',                       'referral_count',    1,   150, 70),
  ('refer_5',         'Community Builder',  'Refer 5 friends who join Samelo',               'referral_count',    5,   500, 80),
  ('points_500',      'Point Collector',    'Earn 500 total points',                         'points_threshold', 500,  100, 90),
  ('points_5000',     'Point Hoarder',      'Earn 5000 total points',                        'points_threshold',5000,  750, 100)
ON CONFLICT (slug) DO NOTHING;
