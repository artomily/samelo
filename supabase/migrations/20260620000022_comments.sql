CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet TEXT NOT NULL,
  video_id TEXT NOT NULL,
  parent_id UUID REFERENCES comments(id),
  body TEXT NOT NULL,
  like_count INTEGER NOT NULL DEFAULT 0,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE comment_likes (
  wallet TEXT NOT NULL,
  comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (wallet, comment_id)
);

CREATE INDEX comments_video_idx ON comments (video_id, created_at DESC) WHERE is_deleted = false;
CREATE INDEX comments_parent_idx ON comments (parent_id) WHERE parent_id IS NOT NULL;
CREATE INDEX comment_likes_comment_idx ON comment_likes (comment_id);
