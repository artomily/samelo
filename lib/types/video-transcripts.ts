export type TranscriptSource = 'manual' | 'auto' | 'upload'
export type TranscriptStatus = 'pending' | 'processing' | 'ready' | 'failed'

export interface VideoTranscript {
  id: string
  video_id: string
  language: string
  source: TranscriptSource
  status: TranscriptStatus
  full_text: string | null
  created_at: string
  updated_at: string
}

export interface TranscriptSegment {
  id: string
  transcript_id: string
  start_ms: number
  end_ms: number
  text: string
  confidence: number | null
  segment_index: number
}

export interface TranscriptWithSegments extends VideoTranscript {
  segments: TranscriptSegment[]
}

export const STATUS_LABELS: Record<TranscriptStatus, string> = {
  pending: 'Pending',
  processing: 'Processing',
  ready: 'Ready',
  failed: 'Failed',
}

export const SOURCE_LABELS: Record<TranscriptSource, string> = {
  manual: 'Manual',
  auto: 'Auto-generated',
  upload: 'Uploaded',
}

export function isReady(transcript: VideoTranscript): boolean {
  return transcript.status === 'ready'
}

export function formatMs(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  if (hours > 0) return `${hours}:${pad(minutes)}:${pad(seconds)}`
  return `${minutes}:${pad(seconds)}`
}

export function searchSegments(segments: TranscriptSegment[], query: string): TranscriptSegment[] {
  const q = query.toLowerCase().trim()
  if (!q) return []
  return segments.filter((s) => s.text.toLowerCase().includes(q))
}
