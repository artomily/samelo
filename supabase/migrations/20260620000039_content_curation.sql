CREATE TABLE video_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  curator_wallet TEXT NOT NULL,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_public BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE video_collection_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID NOT NULL REFERENCES video_collections(id) ON DELETE CASCADE,
  video_id TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  added_by TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (collection_id, video_id)
);

CREATE INDEX video_collections_curator_idx ON video_collections (curator_wallet, created_at DESC);
CREATE INDEX video_collections_featured_idx ON video_collections (is_featured) WHERE is_featured = TRUE;
CREATE INDEX video_collection_items_collection_idx ON video_collection_items (collection_id, position);
