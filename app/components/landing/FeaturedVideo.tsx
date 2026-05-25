'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import type { Video } from '@/lib/mock-videos'

export function FeaturedVideo() {
  const [video, setVideo] = useState<Video | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/videos')
      .then((r) => r.json())
      .then((data: Video[] | { videos?: Video[] }) => {
        const list = Array.isArray(data) ? data : (data.videos ?? [])
        setVideo(list[0] ?? null)
      })
      .catch(() => setVideo(null))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="w-full bg-[#030303] px-4 py-20 sm:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mb-8 text-center"
        >
          <p className="mb-3 font-display text-[11px] font-bold uppercase tracking-[0.2em] text-accent/70">
            Featured
          </p>
          <h2 className="font-display text-3xl font-black uppercase tracking-tight text-primary sm:text-4xl">
            Watch &amp; Earn Now
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted">
            Connect your wallet, watch sponsored content, and earn CELO
            directly to your wallet.
          </p>
        </motion.div>

        {/* Player card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.1 }}
          className="overflow-hidden rounded-2xl border border-[rgba(200,241,53,0.15)] bg-[rgba(255,255,255,0.03)]"
          style={{ boxShadow: '0 0 40px rgba(200,241,53,0.08)' }}
        >
          {loading ? (
            <div className="aspect-video w-full animate-pulse bg-[rgba(255,255,255,0.05)]" />
          ) : video ? (
            <iframe
              src={video.videoUrl}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="aspect-video w-full border-0"
            />
          ) : (
            <div className="flex aspect-video w-full items-center justify-center">
              <p className="text-sm text-muted">No videos available yet</p>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between gap-4 px-5 py-4">
            <div className="min-w-0">
              {loading ? (
                <div className="h-4 w-48 animate-pulse rounded bg-[rgba(255,255,255,0.06)]" />
              ) : (
                <>
                  <p className="truncate text-sm font-medium text-primary">
                    {video?.title ?? 'Loading…'}
                  </p>
                  <p className="text-[11px] text-muted">
                    {video?.sponsor} · +{video?.rewardPoints ?? 0} pts
                  </p>
                </>
              )}
            </div>
            <Link
              href="/home"
              className="shrink-0 rounded-lg bg-accent px-5 py-2.5 font-display text-[11px] font-black uppercase tracking-widest text-bg transition-opacity hover:opacity-90"
            >
              Start Earning →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
