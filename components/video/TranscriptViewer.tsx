'use client'

import { useState } from 'react'
import { useVideoTranscript } from '@/hooks/useVideoTranscript'
import { formatMs, searchSegments } from '@/lib/types/video-transcripts'

interface Props {
  videoId: string
  lang?: string
  onSeek?: (ms: number) => void
}

export function TranscriptViewer({ videoId, lang = 'en', onSeek }: Props) {
  const { data: transcript, isLoading } = useVideoTranscript(videoId, lang)
  const [query, setQuery] = useState('')

  if (isLoading) {
    return <div className="text-sm text-[#666] animate-pulse">Loading transcript…</div>
  }

  if (!transcript) {
    return <div className="text-sm text-[#666]">No transcript available.</div>
  }

  const segments = query ? searchSegments(transcript.segments, query) : transcript.segments

  return (
    <div className="flex flex-col gap-3">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search transcript…"
        className="w-full bg-[#111] border border-[#333] rounded px-3 py-2 text-sm text-white placeholder-[#555] focus:outline-none focus:border-[#c8f135]"
      />
      <div className="flex flex-col gap-1 max-h-80 overflow-y-auto">
        {segments.map((seg) => (
          <button
            key={seg.id}
            onClick={() => onSeek?.(seg.start_ms)}
            className="flex items-start gap-3 text-left px-2 py-1 rounded hover:bg-[#111] group"
          >
            <span className="text-[#c8f135] text-xs font-mono shrink-0 mt-0.5 group-hover:underline">
              {formatMs(seg.start_ms)}
            </span>
            <span className="text-sm text-[#ccc]">{seg.text}</span>
          </button>
        ))}
        {segments.length === 0 && query && (
          <p className="text-sm text-[#555] px-2">No results for "{query}"</p>
        )}
      </div>
    </div>
  )
}
