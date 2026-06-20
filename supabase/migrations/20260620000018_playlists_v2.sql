ALTER TABLE playlists ADD COLUMN IF NOT EXISTS cover_url TEXT;
ALTER TABLE playlists ADD COLUMN IF NOT EXISTS tags TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE playlists ADD COLUMN IF NOT EXISTS published BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE playlists ADD COLUMN IF NOT EXISTS view_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE playlists ADD COLUMN IF NOT EXISTS featured BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS playlist_likes (
  wallet TEXT NOT NULL,
  playlist_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (wallet, playlist_id)
);

CREATE INDEX IF NOT EXISTS playlist_likes_playlist_idx ON playlist_likes (playlist_id);
CREATE INDEX IF NOT EXISTS playlists_tags_idx ON playlists USING gin(tags);
CREATE INDEX IF NOT EXISTS playlists_featured_idx ON playlists (featured, view_count DESC) WHERE published = true;
