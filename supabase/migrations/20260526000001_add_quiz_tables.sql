-- video_quizzes: AI-generated quiz + summary for each video
create table if not exists video_quizzes (
  id          bigserial   primary key,
  video_id    text        not null unique references videos(id) on delete cascade,
  summary     text        not null,
  questions   jsonb       not null,  -- [{q, options: [A,B,C,D], correct: 0-3}]
  generated_at timestamptz not null default now()
);

create index if not exists idx_video_quizzes_video on video_quizzes(video_id);

-- user_quiz_attempts: records each quiz attempt by a user
create table if not exists user_quiz_attempts (
  id             bigserial   primary key,
  wallet_address text        not null references profiles(wallet_address) on delete cascade,
  video_id       text        not null references videos(id) on delete cascade,
  score          int         not null default 0,
  points_earned  int         not null default 0,
  answered_at    timestamptz not null default now(),
  unique(wallet_address, video_id)  -- one attempt per user per video
);

create index if not exists idx_quiz_attempts_wallet       on user_quiz_attempts(wallet_address);
create index if not exists idx_quiz_attempts_wallet_video on user_quiz_attempts(wallet_address, video_id);

-- Trigger: add quiz points to profiles.total_points
create or replace function update_profile_on_quiz()
returns trigger language plpgsql as $$
begin
  update profiles
  set
    total_points = total_points + new.points_earned,
    updated_at   = now()
  where wallet_address = new.wallet_address;
  return new;
end;
$$;

create trigger trg_quiz_update_profile
  after insert on user_quiz_attempts
  for each row execute function update_profile_on_quiz();

-- RLS
alter table video_quizzes      enable row level security;
alter table user_quiz_attempts enable row level security;

-- Anyone can read quizzes
create policy "video_quizzes_read" on video_quizzes
  for select using (true);

-- Users can read their own quiz attempts
create policy "quiz_attempts_read_own" on user_quiz_attempts
  for select
  using (
    wallet_address = (current_setting('request.jwt.claims', true)::json ->> 'wallet_address')
  );
