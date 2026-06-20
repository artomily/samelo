CREATE TABLE platform_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  updated_by TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO platform_config (key, value, description, is_public) VALUES
  ('points_per_minute_watched', '10', 'Points awarded per minute of video watched', true),
  ('max_daily_watch_points', '500', 'Daily cap on watch-to-earn points', true),
  ('referral_bonus_points', '100', 'Points awarded for a successful referral', true),
  ('quiz_base_points', '50', 'Base points for passing a quiz', true),
  ('checkin_base_points', '25', 'Base points for daily check-in', true),
  ('streak_multiplier_threshold', '7', 'Days required for streak bonus multiplier', true),
  ('platform_fee_pct', '20', 'Platform revenue share percentage', false),
  ('min_payout_melo', '10', 'Minimum MELO amount for creator payout request', false),
  ('maintenance_mode', 'false', 'Disable user-facing features for maintenance', true),
  ('feature_flags', '{"tips":true,"live_events":true,"governance":true,"collections":true}', 'Feature toggles', true);

CREATE INDEX platform_config_public_idx ON platform_config (is_public) WHERE is_public = TRUE;
