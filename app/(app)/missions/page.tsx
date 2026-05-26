'use client'

import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import Link from 'next/link'
import { Skeleton } from '@/app/components/Skeleton'
import { Play, BookOpen, CheckCircle2, Lock, ArrowRight } from 'lucide-react'

interface Mission {
  id: string
  title: string
  thumbnailUrl: string | null
  channelTitle: string
  durationSeconds: number
  rewardPoints: number
  hasQuiz: boolean
  watched: boolean
  quizCompleted: boolean
}

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function MissionsPage() {
  const { address } = useAccount()
  const [missions, setMissions] = useState<Mission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    const url = new URL('/api/missions', window.location.origin)
    if (address) url.searchParams.set('walletAddress', address)

    fetch(url.toString())
      .then((r) => r.json())
      .then((d: { missions?: Mission[] }) => {
        if (cancelled) return
        setMissions(d.missions ?? [])
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [address])

  const quizMissions = missions.filter((m) => m.hasQuiz)
  const watchMissions = missions.filter((m) => !m.hasQuiz)

  return (
    <div className="flex min-h-dvh flex-col bg-[#030303]">
      <header
        className="sticky top-0 left-0 right-0 z-30 flex items-center justify-between border-b border-[rgba(200,241,53,0.10)] px-4 py-3 sm:px-7 sm:py-3.5"
        style={{ background: 'rgba(3,3,3,0.92)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
      >
        <div className="min-w-0 flex-1 mr-3">
          <p
            className="font-display text-[13px] font-black uppercase tracking-[0.15em] text-primary"
            style={{ textShadow: '0 0 10px rgba(200,241,53,0.2)' }}
          >
            Missions
          </p>
          <p className="mt-0.5 text-[11px] text-muted">
            {loading ? 'Loading...' : `${missions.length} missions available`}
          </p>
        </div>
        <Link
          href="/home"
          className="btn-neon inline-flex shrink-0 items-center justify-center px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest"
        >
          Close
        </Link>
      </header>

      <div className="w-full overflow-hidden px-4 py-4 pb-20 sm:px-7 sm:py-5">
        <div className="mx-auto max-w-2xl space-y-6">
          {/* ── Quiz Missions ────────────────────────────────────────── */}
          <section>
            <div className="mb-3 flex items-center gap-2">
              <BookOpen size={14} className="text-accent" />
              <p
                className="font-display text-[12px] font-bold uppercase tracking-[0.12em] text-primary"
                style={{ textShadow: '0 0 8px rgba(200,241,53,0.2)' }}
              >
                Quiz Missions
              </p>
              <span className="rounded-full border border-[rgba(200,241,53,0.2)] bg-[rgba(200,241,53,0.06)] px-2 py-0.5 font-display text-[8px] uppercase tracking-widest text-accent">
                Bonus Pts
              </span>
            </div>

            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 rounded-xl" />
                ))}
              </div>
            ) : quizMissions.length === 0 ? (
              <div className="glass-card p-6 text-center">
                <p className="text-sm text-muted">No quiz missions available yet</p>
                <p className="mt-1 text-xs text-muted/60">
                  Watch a video to unlock its quiz
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {quizMissions.map((m) => (
                  <MissionCard key={m.id} mission={m} />
                ))}
              </div>
            )}
          </section>

          {/* ── Watch Missions ───────────────────────────────────────── */}
          <section>
            <div className="mb-3 flex items-center gap-2">
              <Play size={14} className="text-muted" />
              <p className="font-display text-[12px] font-bold uppercase tracking-[0.12em] text-muted">
                Watch Missions
              </p>
              <span className="rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-2 py-0.5 font-display text-[8px] uppercase tracking-widest text-muted/60">
                Coming Soon
              </span>
            </div>

            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {watchMissions.slice(0, 3).map((m) => (
                  <div
                    key={m.id}
                    className="glass-card flex items-center gap-3 px-4 py-3.5 opacity-50"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[rgba(255,255,255,0.04)]">
                      <Lock size={14} className="text-muted/40" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium text-muted">
                        {m.title}
                      </p>
                      <p className="text-[11px] text-muted/50">
                        {m.channelTitle} · {formatDuration(m.durationSeconds)}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full border border-[rgba(255,255,255,0.06)] px-2 py-1 text-[10px] text-muted/40">
                      Coming Soon
                    </span>
                  </div>
                ))}
                {watchMissions.length === 0 && (
                  <div className="glass-card p-6 text-center">
                    <p className="text-sm text-muted">More missions coming soon</p>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* ── Stats summary ─────────────────────────────────────────── */}
          {!loading && (
            <div className="glass-card p-4">
              <p
                className="mb-3 font-display text-[11px] font-bold uppercase tracking-[0.12em] text-primary"
                style={{ textShadow: '0 0 8px rgba(200,241,53,0.2)' }}
              >
                Your Progress
              </p>
              <div className="grid grid-cols-3 gap-3">
                <StatBox
                  label="Videos Watched"
                  value={missions.filter((m) => m.watched).length}
                  total={missions.length}
                />
                <StatBox
                  label="Quizzes Done"
                  value={missions.filter((m) => m.quizCompleted).length}
                  total={quizMissions.length}
                />
                <StatBox
                  label="Total Points"
                  value={missions.reduce((s, m) => s + (m.watched ? m.rewardPoints : 0), 0)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function MissionCard({ mission }: { mission: Mission }) {
  const step = mission.watched
    ? mission.quizCompleted
      ? 'done'
      : 'quiz'
    : 'watch'

  return (
    <Link
      href={
        step === 'watch'
          ? `/watch`
          : step === 'quiz'
            ? `/quiz/${encodeURIComponent(mission.id)}`
            : `/watch`
      }
      className="glass-card flex items-center gap-3 px-4 py-3.5 transition-all hover:border-[rgba(200,241,53,0.25)]"
    >
      {/* Step indicator */}
      <div
        className={[
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
          step === 'done'
            ? 'bg-[rgba(200,241,53,0.10)]'
            : step === 'quiz'
              ? 'bg-[rgba(200,241,53,0.06)]'
              : 'bg-[rgba(200,241,53,0.03)]',
        ].join(' ')}
      >
        {step === 'done' ? (
          <CheckCircle2 size={16} className="text-accent" />
        ) : step === 'quiz' ? (
          <BookOpen size={15} className="text-accent" />
        ) : (
          <Play size={15} className="text-accent/70" />
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-medium text-primary">
          {mission.title}
        </p>
        <p className="text-[11px] text-muted">
          {mission.channelTitle} · {formatDuration(mission.durationSeconds)}
        </p>
        <div className="mt-1 flex items-center gap-2">
          {step === 'watch' && (
            <span className="text-[10px] text-accent/70">
              Watch to earn {mission.rewardPoints}p
            </span>
          )}
          {step === 'quiz' && (
            <span className="text-[10px] text-accent">
              Take quiz for bonus points
            </span>
          )}
          {step === 'done' && (
            <span className="text-[10px] text-accent/60">
              +{mission.rewardPoints}p earned
            </span>
          )}
        </div>
      </div>

      {/* Action */}
      <ArrowRight
        size={16}
        className={[
          'shrink-0',
          step === 'done' ? 'text-accent/40' : 'text-accent',
        ].join(' ')}
      />
    </Link>
  )
}

function StatBox({
  label,
  value,
  total,
}: {
  label: string
  value: number
  total?: number
}) {
  return (
    <div className="rounded-xl bg-[rgba(255,255,255,0.03)] p-3 text-center">
      <p className="font-display text-lg font-black text-accent"
        style={{ textShadow: '0 0 8px rgba(200,241,53,0.3)' }}>
        {total !== undefined ? `${value}/${total}` : value}
      </p>
      <p className="mt-0.5 text-[10px] text-muted">{label}</p>
    </div>
  )
}
