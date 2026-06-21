export interface VideoBookmark {
  id: string
  wallet: string
  video_id: string
  timestamp_ms: number | null
  note: string | null
  is_private: boolean
  created_at: string
}

export function formatBookmarkTime(ms: number | null): string {
  if (ms === null) return 'Start'
  const totalSecs = Math.floor(ms / 1000)
  const h = Math.floor(totalSecs / 3600)
  const m = Math.floor((totalSecs % 3600) / 60)
  const s = totalSecs % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`
}

export function sortByTimestamp(bookmarks: VideoBookmark[]): VideoBookmark[] {
  return [...bookmarks].sort((a, b) => {
    const ta = a.timestamp_ms ?? 0
    const tb = b.timestamp_ms ?? 0
    return ta - tb
  })
}

export function hasNote(bookmark: VideoBookmark): boolean {
  return bookmark.note !== null && bookmark.note.trim().length > 0
}
