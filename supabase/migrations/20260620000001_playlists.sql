-- Curated video playlists (editor picks, learning paths)
CREATE TABLE IF NOT EXISTS playlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS playlist_videos (
  playlist_id UUID NOT NULL REFERENCES playlists (id) ON DELETE CASCADE,
  video_id TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (playlist_id, video_id)
);

CREATE INDEX IF NOT EXISTS idx_playlist_videos_order ON playlist_videos (playlist_id, position);
CREATE INDEX IF NOT EXISTS idx_playlists_featured ON playlists (is_featured) WHERE is_featured = true;

COMMENT ON TABLE playlists IS 'Curated video collections — learning paths and editor picks';
