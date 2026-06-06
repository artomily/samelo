'use client'

import { useState, useEffect, useRef } from 'react'
import { Sparkles, ChevronDown, ChevronUp, Loader2 } from 'lucide-react'

interface SummaryData {
  videoId: string
  summary: string
  keyPoints: string[]
  generatedAt?: string
  needsGeneration?: boolean
}

export function VideoSummary({ videoId }: { videoId: string | null }) {
  const [summary, setSummary] = useState<SummaryData | null>(null)
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const retryTimerRef = useRef<NodeJS.Timeout | undefined>(undefined)

  useEffect(() => {
    return () => { if (retryTimerRef.current) clearTimeout(retryTimerRef.current) }
  }, [])

  useEffect(() => {
    if (!videoId) return
    setSummary(null)
    setError(null)
    setExpanded(false)
    clearTimeout(retryTimerRef.current)

    fetchSummary(videoId)
  }, [videoId])

  async function fetchSummary(vid: string) {
    setLoading(true)
    try {
      const res = await fetch(`/api/summarize?videoId=${vid}`)
      const data = await res.json().catch(() => ({})) as SummaryData & { error?: string }

      if (res.ok && data.summary) {
        setSummary(data)
        setLoading(false)
        return
      }

      // 404 = no cache, needs generation; 503 = API key missing
      if (res.status === 404 || data.needsGeneration) {
        setLoading(false)
        setError(data.error ?? 'Summary not available')
        return
      }

      throw new Error(data.error ?? `API error ${res.status}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="mt-3 flex items-center gap-2 rounded-xl border border-[rgba(200,241,53,0.1)] bg-[rgba(200,241,53,0.02)] px-3 py-2.5">
        <Loader2 size={14} className="animate-spin text-accent/60" />
        <span className="text-[10px] text-muted">Generating summary...</span>
      </div>
    )
  }

  if (!summary) return null

  return (
    <div className="mt-3 rounded-xl border border-[rgba(200,241,53,0.12)] bg-[rgba(200,241,53,0.02)] overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-3 py-2.5 text-left transition-colors hover:bg-[rgba(200,241,53,0.03)]"
      >
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-accent" />
          <span className="font-display text-[10px] font-bold uppercase tracking-widest text-accent">
            AI Summary
          </span>
        </div>
        {expanded ? (
          <ChevronUp size={14} className="text-muted" />
        ) : (
          <ChevronDown size={14} className="text-muted" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-[rgba(200,241,53,0.08)] px-3 py-3">
          <p className="text-sm leading-relaxed text-primary/80">
            {summary.summary}
          </p>

          {summary.keyPoints && summary.keyPoints.length > 0 && (
            <ul className="mt-2.5 space-y-1">
              {summary.keyPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-muted">
                  <span className="mt-[3px] h-1 w-1 shrink-0 rounded-full bg-accent/60" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          )}

          {summary.generatedAt && (
            <p className="mt-2 text-[10px] text-muted/50">
              Generated {new Date(summary.generatedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
