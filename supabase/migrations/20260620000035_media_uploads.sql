CREATE TABLE media_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  storage_path TEXT NOT NULL UNIQUE,
  public_url TEXT,
  upload_type TEXT NOT NULL CHECK (upload_type IN ('video','thumbnail','avatar','banner')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','processing','ready','failed')),
  duration_seconds INTEGER,
  width INTEGER,
  height INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ready_at TIMESTAMPTZ
);

CREATE INDEX media_uploads_wallet_idx ON media_uploads (wallet, created_at DESC);
CREATE INDEX media_uploads_status_idx ON media_uploads (status);
