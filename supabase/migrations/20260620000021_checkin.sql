CREATE TABLE daily_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet TEXT NOT NULL,
  checkin_date DATE NOT NULL DEFAULT CURRENT_DATE,
  streak_day INTEGER NOT NULL DEFAULT 1,
  points_awarded INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (wallet, checkin_date)
);

CREATE INDEX daily_checkins_wallet_idx ON daily_checkins (wallet, checkin_date DESC);
