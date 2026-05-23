-- ─────────────────────────────────────────────────────────────────────────────
-- profiles: one row per MiniPay wallet address
-- Wallet address IS the identity — no separate auth needed.
-- Auto-created on first watch or first app open.
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists profiles (
  wallet_address   text        primary key,
  display_name     text,
  avatar_url       text,
  -- referral system
  referral_code    text        unique not null
                               default upper(substring(md5(random()::text), 1, 8)),
  referred_by      text        references profiles(wallet_address) on delete set null,
  -- aggregated stats (updated via trigger on watches)
  total_points     int         not null default 0,   -- lifetime points earned
  total_earned_cents int       not null default 0,   -- lifetime cUSD value
  -- streak
  streak_count     int         not null default 0,
  last_watched_at  timestamptz,
  -- timestamps
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists idx_profiles_referral_code on profiles(referral_code);
create index if not exists idx_profiles_referred_by   on profiles(referred_by);

-- ─────────────────────────────────────────────────────────────────────────────
-- claims: records each time a user claims accumulated points as cUSD on-chain
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists claims (
  id               bigserial   primary key,
  wallet_address   text        not null references profiles(wallet_address) on delete cascade,
  total_cents      int         not null,             -- amount claimed in USD cents
  tx_hash          text,                             -- null until broadcast on Celo
  status           text        not null default 'pending'
                               check (status in ('pending', 'confirmed', 'failed')),
  created_at       timestamptz not null default now(),
  confirmed_at     timestamptz
);

create index if not exists idx_claims_wallet on claims(wallet_address);
create index if not exists idx_claims_status on claims(wallet_address, status);

-- ─────────────────────────────────────────────────────────────────────────────
-- Add wallet_address FK on watches → profiles (profile auto-created first)
-- ─────────────────────────────────────────────────────────────────────────────
alter table watches
  add column if not exists points int not null default 10; -- off-chain points per watch

alter table watches
  add constraint fk_watches_profile
  foreign key (wallet_address) references profiles(wallet_address) on delete cascade;

-- ─────────────────────────────────────────────────────────────────────────────
-- Trigger: keep profiles.total_points / total_earned_cents / last_watched_at
--          up to date whenever a watch row is inserted
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function update_profile_on_watch()
returns trigger language plpgsql as $$
begin
  update profiles
  set
    total_points       = total_points + new.points,
    total_earned_cents = total_earned_cents + new.reward_cents,
    last_watched_at    = new.watched_at,
    updated_at         = now()
  where wallet_address = new.wallet_address;
  return new;
end;
$$;

create trigger trg_watches_update_profile
  after insert on watches
  for each row execute function update_profile_on_watch();

-- ─────────────────────────────────────────────────────────────────────────────
-- Trigger: update profiles.updated_at on any profile update
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_updated_at
  before update on profiles
  for each row execute function set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────────
-- Row-level security
-- ─────────────────────────────────────────────────────────────────────────────
alter table profiles enable row level security;
alter table claims   enable row level security;

-- Users can read + update their own profile
create policy "profiles_read_own" on profiles
  for select
  using (
    wallet_address = (current_setting('request.jwt.claims', true)::json ->> 'wallet_address')
  );

create policy "profiles_update_own" on profiles
  for update
  using (
    wallet_address = (current_setting('request.jwt.claims', true)::json ->> 'wallet_address')
  );

-- Users can read their own claims
create policy "claims_read_own" on claims
  for select
  using (
    wallet_address = (current_setting('request.jwt.claims', true)::json ->> 'wallet_address')
  );

-- Service role (edge functions) handles all inserts/updates — bypasses RLS automatically
