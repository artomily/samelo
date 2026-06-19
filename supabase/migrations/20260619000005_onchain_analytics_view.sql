-- Materialized view for on-chain dashboard analytics
-- Aggregates protocol-wide metrics for fast reads without full table scans

CREATE OR REPLACE VIEW onchain_summary AS
SELECT
  (SELECT COUNT(*)       FROM watches)                   AS total_watches,
  (SELECT COUNT(DISTINCT wallet_address) FROM watches)   AS unique_watchers,
  (SELECT COALESCE(SUM(reward_cents), 0) FROM watches)  AS total_points_issued,
  (SELECT COUNT(*)       FROM point_swaps)               AS total_swaps,
  (SELECT COALESCE(SUM(points_burned), 0) FROM point_swaps) AS total_points_burned,
  (SELECT COALESCE(SUM(melo_received::NUMERIC), 0) FROM point_swaps) AS total_melo_minted,
  (SELECT COUNT(DISTINCT wallet_address) FROM profiles)  AS total_wallets,
  (SELECT COUNT(*)       FROM referrals)                 AS total_referrals;

COMMENT ON VIEW onchain_summary IS
  'Protocol-wide aggregate metrics for the on-chain dashboard. Read-only.';
