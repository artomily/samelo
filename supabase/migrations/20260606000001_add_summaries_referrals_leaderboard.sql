-- ─────────────────────────────────────────────────────────────────────────────
-- video_summaries: AI-generated comprehensive summaries for videos
-- Separate from video_quizzes so summaries can be fetched independently
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists video_summaries (
  id           bigserial   primary key,
  video_id     text        not null unique references videos(id) on delete cascade,
  summary      text        not null,
  key_points   jsonb,       -- ["point 1", "point 2", ...]
  generated_at timestamptz not null default now()
);

create index if not exists idx_video_summaries_video on video_summaries(video_id);

alter table video_summaries enable row level security;

create policy "video_summaries_read" on video_summaries
  for select using (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- referrals: tracks who referred whom and the reward given
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists referrals (
  id               bigserial   primary key,
  referrer_wallet  text        not null references profiles(wallet_address) on delete cascade,
  referred_wallet  text        not null unique references profiles(wallet_address) on delete cascade,
  code_used        text        not null,
  reward_points    int         not null default 50,
  created_at       timestamptz not null default now()
);

create index if not exists idx_referrals_referrer  on referrals(referrer_wallet);
create index if not exists idx_referrals_referred  on referrals(referred_wallet);
create index if not exists idx_referrals_code_used on referrals(code_used);

-- Trigger: award referral reward points to referrer's profile
create or replace function award_referral_points()
returns trigger language plpgsql as $$
begin
  update profiles
  set
    total_points = total_points + new.reward_points,
    updated_at   = now()
  where wallet_address = new.referrer_wallet;
  return new;
end;
$$;

create trigger trg_award_referral_points
  after insert on referrals
  for each row execute function award_referral_points();

alter table referrals enable row level security;

create policy "referrals_read_own_referrer" on referrals
  for select
  using (
    referrer_wallet = (current_setting('request.jwt.claims', true)::json ->> 'wallet_address')
  );

create policy "referrals_read_own_referred" on referrals
  for select
  using (
    referred_wallet = (current_setting('request.jwt.claims', true)::json ->> 'wallet_address')
  );
