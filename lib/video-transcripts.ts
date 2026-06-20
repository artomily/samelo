import { createClient } from '@supabase/supabase-js'
import type { VideoTranscript, TranscriptSegment, TranscriptWithSegments } from './types/video-transcripts'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function getTranscript(videoId: string, language = 'en'): Promise<TranscriptWithSegments | null> {
  const supabase = getSupabase()
  const { data: transcript } = await supabase
    .from('video_transcripts')
    .select('*')
    .eq('video_id', videoId)
    .eq('language', language)
    .single()

  if (!transcript) return null

  const { data: segments } = await supabase
    .from('transcript_segments')
    .select('*')
    .eq('transcript_id', transcript.id)
    .order('segment_index')

  return { ...transcript, segments: segments ?? [] }
}

export async function upsertTranscript(
  videoId: string,
  language: string,
  data: {
    source: VideoTranscript['source']
    status: VideoTranscript['status']
    fullText?: string
  }
): Promise<VideoTranscript> {
  const supabase = getSupabase()
  const { data: transcript, error } = await supabase
    .from('video_transcripts')
    .upsert(
      {
        video_id: videoId,
        language,
        source: data.source,
        status: data.status,
        full_text: data.fullText ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'video_id,language' }
    )
    .select()
    .single()
  if (error) throw new Error(error.message)
  return transcript
}

export async function upsertSegments(
  transcriptId: string,
  segments: Pick<TranscriptSegment, 'start_ms' | 'end_ms' | 'text' | 'confidence' | 'segment_index'>[]
): Promise<void> {
  const supabase = getSupabase()
  await supabase.from('transcript_segments').delete().eq('transcript_id', transcriptId)
  if (segments.length === 0) return
  const rows = segments.map((s) => ({ ...s, transcript_id: transcriptId }))
  const { error } = await supabase.from('transcript_segments').insert(rows)
  if (error) throw new Error(error.message)
}

export async function getVideoTranscripts(videoId: string): Promise<VideoTranscript[]> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('video_transcripts')
    .select('*')
    .eq('video_id', videoId)
    .order('language')
  return data ?? []
}
