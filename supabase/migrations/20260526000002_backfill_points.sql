-- Backfill: set watches.points = watches.reward_cents where points is still the default 10
update watches
set points = reward_cents
where points = 10 and reward_cents != 10;

-- Also update any rows where points is 0/null but reward_cents has a value
update watches
set points = reward_cents
where (points = 0 or points is null) and reward_cents > 0;

-- Update profiles.total_points to match actual sum of watches.points + quiz points
update profiles p
set total_points = (
  select coalesce(sum(w.points), 0) from watches w where w.wallet_address = p.wallet_address
) + (
  select coalesce(sum(q.points_earned), 0) from user_quiz_attempts q where q.wallet_address = p.wallet_address
);
