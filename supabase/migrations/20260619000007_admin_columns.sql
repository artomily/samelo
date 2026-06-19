-- Add admin-managed columns to profiles and videos
-- is_banned: prevent banned wallets from earning rewards
-- is_active on videos: admin can soft-delete videos without losing watch history

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS is_banned BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS total_points INTEGER NOT NULL DEFAULT 0;

-- Index for admin user search queries
CREATE INDEX IF NOT EXISTS idx_profiles_total_points ON profiles (total_points DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_is_banned ON profiles (is_banned) WHERE is_banned = true;

COMMENT ON COLUMN profiles.is_banned IS 'Admin-set flag to block reward earning without deleting the account';
COMMENT ON COLUMN profiles.total_points IS 'Cached sum of all earned points — updated by trigger or admin adjustment';
