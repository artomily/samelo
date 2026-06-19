-- ─────────────────────────────────────────────────────────────────────────────
-- Referral system v2: referred user gets 25 bonus pts on redemption
-- A separate trigger awards the referred user bonus when a referral is created.
-- The existing award_referral_points() trigger only awards the referrer (50 pts).
-- ─────────────────────────────────────────────────────────────────────────────

create or replace function award_referred_bonus_points()
returns trigger language plpgsql as $$
begin
  -- Award 25 bonus points to the referred user
  update profiles
  set
    total_points = total_points + 25,
    updated_at   = now()
  where wallet_address = new.referred_wallet;
  return new;
end;
$$;

create trigger trg_award_referred_bonus_points
  after insert on referrals
  for each row execute function award_referred_bonus_points();