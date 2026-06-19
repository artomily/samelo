-- Track referred-user bonus separately from referrer bonus
-- referrals.bonus_points: points given to the referred user (default 25)

ALTER TABLE referrals
  ADD COLUMN IF NOT EXISTS bonus_points INTEGER NOT NULL DEFAULT 25;

COMMENT ON COLUMN referrals.bonus_points IS
  'Points awarded to the referred user on first successful referral (welcome bonus)';

-- Index for looking up referrals where referred_wallet has already received a bonus
CREATE INDEX IF NOT EXISTS idx_referrals_referred_wallet
  ON referrals (referred_wallet);
