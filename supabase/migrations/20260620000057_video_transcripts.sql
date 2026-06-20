CREATE TABLE video_transcripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'en',
  source TEXT NOT NULL DEFAULT 'manual' CHECK (source IN ('manual', 'auto', 'upload')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'ready', 'failed')),
  full_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (video_id, language)
);

CREATE TABLE transcript_segments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transcript_id UUID NOT NULL REFERENCES video_transcripts(id) ON DELETE CASCADE,
  start_ms INTEGER NOT NULL,
  end_ms INTEGER NOT NULL,
  text TEXT NOT NULL,
  confidence NUMERIC(4,3),
  segment_index INTEGER NOT NULL
);

CREATE INDEX transcript_segments_transcript_idx ON transcript_segments (transcript_id, segment_index);
CREATE INDEX video_transcripts_video_idx ON video_transcripts (video_id);
