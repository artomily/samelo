'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import { useAccount } from 'wagmi'
import { toast } from '@/app/components/Toast'
import { Skeleton } from '@/app/components/Skeleton'
import { isAddress } from 'viem'

interface SafeQuestion {
  q: string
  options: string[]
}

interface QuizData {
  videoId: string
  summary: string
  questions: SafeQuestion[]
}

interface SubmitResult {
  score: number
  total: number
  pointsEarned: number
}

export default function QuizPage() {
  const params = useParams()
  const videoId = (params?.videoId as string) ?? ''
  const { address } = useAccount()

  const [quiz, setQuiz] = useState<QuizData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [currentQ, setCurrentQ] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<SubmitResult | null>(null)

  useEffect(() => {
    if (!videoId) return

    let cancelled = false
    setLoading(true)
    setError(null)

    fetch(`/api/quiz?videoId=${encodeURIComponent(videoId)}`)
      .then((r) => r.json())
      .then((d: QuizData & { error?: string }) => {
        if (cancelled) return
        if (d.error) {
          setError(d.error)
          return
        }
        setQuiz(d)
        setAnswers(new Array(d.questions.length).fill(null))
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load quiz')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [videoId])

  const selectAnswer = useCallback((qIndex: number, optionIndex: number) => {
    setAnswers((prev) => {
      const next = [...prev]
      next[qIndex] = optionIndex
      return next
    })
  }, [])

  const handleSubmit = useCallback(async () => {
    if (!address || !isAddress(address) || !quiz) return

    if (answers.some((a) => a === null)) {
      toast('Answer all questions first', 'error')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: address,
          videoId,
          answers,
        }),
      })
      const d = (await res.json()) as SubmitResult & { error?: string }
      if (!res.ok) throw new Error(d.error ?? 'Submit failed')
      setResult(d)
      toast(`+${d.pointsEarned} quiz bonus points!`, 'success')
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Submit failed', 'error')
    } finally {
      setSubmitting(false)
    }
  }, [address, quiz, videoId, answers])

  const answersComplete = answers.every((a) => a !== null)
  const headerLeft = (
    <Link
      href={videoId ? `/watch?video=${encodeURIComponent(videoId)}` : '/watch'}
      className="font-display text-[13px] font-black uppercase tracking-[0.15em] text-primary"
      style={{ textShadow: '0 0 10px rgba(200,241,53,0.2)' }}
    >
      &larr; Quiz
    </Link>
  )

  return (
    <div className="flex min-h-dvh flex-col bg-[#030303]">
      <header
        className="sticky top-0 left-0 right-0 z-30 flex items-center justify-between border-b border-[rgba(200,241,53,0.10)] px-4 py-3 sm:px-7 sm:py-3.5"
        style={{ background: 'rgba(3,3,3,0.92)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
      >
        <div className="min-w-0 flex-1 mr-3">{headerLeft}</div>
        <Link
          href="/home"
          className="btn-neon inline-flex shrink-0 items-center justify-center px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest"
        >
          Close
        </Link>
      </header>

      <div className="w-full overflow-hidden px-4 py-4 pb-20 sm:px-7 sm:py-5">
        <div className="mx-auto max-w-lg">
          {loading && (
            <div className="glass-card p-6 space-y-4">
              <Skeleton className="h-4 w-3/4 rounded" />
              <Skeleton className="h-10 w-full rounded" />
              <Skeleton className="h-10 w-full rounded" />
            </div>
          )}

          {error && !loading && (
            <div className="glass-card p-6 text-center space-y-4">
              <p className="text-muted text-sm">{error}</p>
              <Link
                href="/watch"
                className="btn-neon inline-flex items-center justify-center px-4 py-2 text-xs font-bold uppercase tracking-widest"
              >
                Browse Videos
              </Link>
            </div>
          )}

          {quiz && !result && (
            <div className="space-y-5">
              {/* Summary */}
              <div className="glass-card p-4 sm:p-5">
                <p className="font-display text-[11px] font-bold uppercase tracking-[0.12em] text-accent mb-2"
                  style={{ textShadow: '0 0 8px rgba(200,241,53,0.2)' }}>
                  Video Summary
                </p>
                <p className="text-[13px] text-muted leading-relaxed">{quiz.summary}</p>
              </div>

              {/* Questions */}
              <div className="glass-card p-4 sm:p-5 space-y-5">
                <div className="flex items-center justify-between">
                  <p className="font-display text-[11px] font-bold uppercase tracking-[0.12em] text-primary"
                    style={{ textShadow: '0 0 8px rgba(200,241,53,0.2)' }}>
                    Question {currentQ + 1} of {quiz.questions.length}
                  </p>
                  <div className="flex gap-1">
                    {quiz.questions.map((_, i) => (
                      <div
                        key={i}
                        className={[
                          'h-1.5 w-6 rounded-full transition-colors',
                          i <= currentQ
                            ? 'bg-accent shadow-[0_0_6px_rgba(200,241,53,0.5)]'
                            : 'bg-[rgba(200,241,53,0.15)]',
                          answers[i] !== null ? 'bg-accent' : '',
                        ].join(' ')}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-primary">{quiz.questions[currentQ]!.q}</p>
                  <div className="space-y-2">
                    {quiz.questions[currentQ]!.options.map((opt, oi) => {
                      const isSelected = answers[currentQ] === oi
                      return (
                        <button
                          key={oi}
                          onClick={() => selectAnswer(currentQ, oi)}
                          className={[
                            'w-full rounded-xl border px-4 py-3 text-left text-[13px] transition-all',
                            isSelected
                              ? 'border-accent bg-[rgba(200,241,53,0.10)] text-accent shadow-[0_0_10px_rgba(200,241,53,0.15)]'
                              : 'border-[rgba(255,255,255,0.08)] bg-[#0d0d0d] text-muted hover:border-[rgba(200,241,53,0.2)]',
                          ].join(' ')}
                        >
                          <span className="font-display font-bold text-accent mr-2">{String.fromCharCode(65 + oi)}</span>
                          {opt}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setCurrentQ((p) => Math.max(0, p - 1))}
                    disabled={currentQ === 0}
                    className="flex-1 rounded-lg border border-[rgba(200,241,53,0.2)] bg-[rgba(200,241,53,0.06)] px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-accent disabled:opacity-40"
                  >
                    &larr; Back
                  </button>
                  {currentQ < quiz.questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentQ((p) => p + 1)}
                      className="flex-1 rounded-lg border border-[rgba(200,241,53,0.2)] bg-[rgba(200,241,53,0.06)] px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-accent"
                    >
                      Next &rarr;
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={!answersComplete || submitting}
                      className="flex-1 rounded-lg border border-accent bg-accent px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#030303] disabled:opacity-50"
                    >
                      {submitting ? 'Submitting...' : 'Submit'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {result && (
            <div className="glass-card p-6 sm:p-8 text-center space-y-4">
              <div
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-accent bg-[rgba(200,241,53,0.10)]"
                style={{ boxShadow: '0 0 20px rgba(200,241,53,0.3)' }}
              >
                <svg viewBox="0 0 24 24" className="h-8 w-8 text-accent">
                  <path
                    d="M20 6L9 17l-5-5"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </div>
              <div>
                <p className="font-display text-xl font-black text-accent"
                  style={{ textShadow: '0 0 12px rgba(200,241,53,0.5)' }}>
                  +{result.pointsEarned} pts
                </p>
                <p className="text-sm text-muted mt-1">
                  {result.score}/{result.total} correct
                </p>
              </div>
              <p className="text-xs text-muted">Bonus quiz points added to your balance</p>
              <div className="flex gap-2 pt-2">
                <Link
                  href="/watch"
                  className="flex-1 rounded-lg border border-[rgba(200,241,53,0.2)] bg-[rgba(200,241,53,0.06)] px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider text-accent"
                >
                  Watch More
                </Link>
                <Link
                  href="/swap"
                  className="flex-1 rounded-lg border border-accent bg-accent px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#030303]"
                >
                  Swap to CELO
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
