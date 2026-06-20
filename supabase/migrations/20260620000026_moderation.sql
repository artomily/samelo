CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_wallet TEXT NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('video', 'comment', 'profile', 'playlist')),
  target_id TEXT NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN ('spam', 'harassment', 'hate_speech', 'misinformation', 'nsfw', 'other')),
  details TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'actioned', 'dismissed')),
  reviewed_by TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE moderation_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_wallet TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('warn', 'hide', 'ban', 'restore')),
  note TEXT,
  report_id UUID REFERENCES reports(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX reports_target_idx ON reports (target_type, target_id);
CREATE INDEX reports_status_idx ON reports (status, created_at DESC);
