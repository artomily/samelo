-- videos: stores fetched YouTube video metadata
create table if not exists videos (
  id               text        primary key,
  title            text        not null,
  description      text,
  thumbnail_url    text,
  channel_title    text,
  duration_seconds int         not null default 0,
  reward_cents     int         not null default 1,
  playlist_id      text,
  active           boolean     not null default true,
  fetched_at       timestamptz not null default now()
);

-- watches: records each completed watch event
create table if not exists watches (
  id              bigserial   primary key,
  wallet_address  text        not null,
  video_id        text        not null references videos(id) on delete cascade,
  reward_cents    int         not null,
  watched_at      timestamptz not null default now(),
  claimed         boolean     not null default false
);

create index if not exists idx_watches_wallet       on watches(wallet_address);
create index if not exists idx_watches_wallet_video on watches(wallet_address, video_id);
create index if not exists idx_watches_unclaimed    on watches(wallet_address) where claimed = false;

-- Row-level security
alter table videos  enable row level security;
alter table watches enable row level security;

-- Anyone can read active videos
create policy "videos_read_active" on videos
  for select using (active = true);

-- Users can only read their own watch records
create policy "watches_read_own" on watches
  for select
  using (
    wallet_address = (current_setting('request.jwt.claims', true)::json ->> 'wallet_address')
  );

-- Service role inserts via edge function (bypasses RLS)
