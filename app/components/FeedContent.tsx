"use client";

import { useState, useCallback, useEffect } from "react";
import { useAccount } from "wagmi";
import { useVideos } from "@/hooks/useVideos";
import dynamic from "next/dynamic";
import { Skeleton } from "@/app/components/Skeleton";
import { WalletBadge } from "@/app/components/WalletBadge";
import { ConnectBanner } from "@/app/components/ConnectBanner";
import { toast } from "@/app/components/Toast";
import { Play } from "lucide-react";
import Link from "next/link";

const VideoPlayer = dynamic(
  () =>
    import("@/app/components/VideoPlayer").then((m) => ({
      default: m.VideoPlayer,
    })),
  {
    ssr: false,
    loading: () => <Skeleton className="aspect-video w-full rounded-xl" />,
  },
);

const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function useStreakIdx(watchedToday: boolean) {
  const today = new Date().getDay();
  const todayIdx = today === 0 ? 6 : today - 1;
  return {
    todayIdx,
    streakDays: Math.max(1, todayIdx) + (watchedToday ? 1 : 0),
  };
}

function StreakRow({ watchedToday }: { watchedToday: boolean }) {
  const { todayIdx } = useStreakIdx(watchedToday);
  return (
    <div className="flex gap-1.5">
      {DAYS.map((day, i) => {
        const done = i < todayIdx || (i === todayIdx && watchedToday);
        return (
          <div
            key={day}
            className="flex h-6 flex-1 items-center justify-center rounded-md font-display text-[9px] uppercase tracking-wider transition-all"
            style={
              done
                ? {
                    border: "1px solid rgba(200,241,53,0.3)",
                    background: "rgba(200,241,53,0.08)",
                    color: "#c8f135",
                    boxShadow: "0 0 6px rgba(200,241,53,0.15)",
                  }
                : {
                    border: "1px solid rgba(200,241,53,0.08)",
                    background: "rgba(200,241,53,0.02)",
                    color: "rgba(200,241,53,0.25)",
                  }
            }
          >
            {day}
          </div>
        );
      })}
    </div>
  );
}

function StreakBadge({ watchedToday }: { watchedToday: boolean }) {
  const { streakDays } = useStreakIdx(watchedToday);
  return <span className="text-[11px] text-gold">🔥 {streakDays} days</span>;
}

export default function FeedContent() {
  const { address } = useAccount();
  const { videos } = useVideos();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [pendingPoints, setPendingPoints] = useState(0);
  const [earnedIds, setEarnedIds] = useState<Set<string>>(new Set());
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [lastEarnedPoints, setLastEarnedPoints] = useState(0);
  const [historyLoaded, setHistoryLoaded] = useState(false);

  const activeVideo = activeId
    ? (videos.find((v) => v.id === activeId) ?? null)
    : null;

  useEffect(() => {
    if (!address) return;
    fetch(`/api/rewards/pending?walletAddress=${address}`)
      .then((r) => r.json())
      .then((d: { total?: number }) => {
        if (typeof d.total === "number") setPendingPoints(d.total);
      })
      .catch(() => {});
  }, [address]);

  // Pre-load already-watched video IDs so "Done" shows on page refresh
  useEffect(() => {
    if (!address) {
      setHistoryLoaded(false);
      setEarnedIds(new Set());
      return;
    }
    fetch(`/api/watch/history?walletAddress=${address}`)
      .then((r) => r.json())
      .then((d: { videoIds?: string[] }) => {
        if (d.videoIds && d.videoIds.length > 0) {
          setEarnedIds(new Set(d.videoIds));
        }
      })
      .catch(() => {})
      .finally(() => setHistoryLoaded(true));
  }, [address]);

  const handleSelect = useCallback((id: string) => {
    setActiveId(id);
    setTimeout(() => {
      document
        .getElementById("player-area")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }, []);

  const currentVideoIndex = activeId
    ? videos.findIndex((v) => v.id === activeId)
    : -1;
  const hasNext =
    currentVideoIndex >= 0 && currentVideoIndex < videos.length - 1;
  const hasPrev = currentVideoIndex > 0;

  const goToPrev = useCallback(() => {
    if (hasPrev) handleSelect(videos[currentVideoIndex - 1]!.id);
  }, [hasPrev, currentVideoIndex, videos, handleSelect]);

  const goToNext = useCallback(() => {
    if (hasNext) handleSelect(videos[currentVideoIndex + 1]!.id);
  }, [hasNext, currentVideoIndex, videos, handleSelect]);

  const handleEarned = useCallback(
    async (rewardPoints: number) => {
      if (!activeId || earnedIds.has(activeId)) return;
      setEarnedIds((prev) => new Set(prev).add(activeId));
      setPendingPoints((prev) => prev + rewardPoints);
      setLastEarnedPoints(rewardPoints);
      setShowClaimModal(true);
      if (!address) return;

      try {
        const res = await fetch("/api/watch/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ videoId: activeId, walletAddress: address }),
        });
        if (res.ok) {
          const data = (await res.json()) as {
            alreadyClaimed?: boolean;
            totalPendingCents?: number;
            totalPendingPoints?: number;
          };
          if (data.alreadyClaimed) {
            // Was already claimed — nothing new to add
            return;
          }
          const pts = data.totalPendingPoints ?? data.totalPendingCents ?? 0;
          if (typeof pts === "number") setPendingPoints(pts);
        } else {
          const err = (await res.json().catch(() => ({}))) as { error?: string };
          console.error("[FeedContent] watch/complete failed:", err.error ?? res.status);
        }
      } catch (e) {
        console.error("[FeedContent] watch/complete error:", e);
      }
    },
    [activeId, earnedIds, address],
  );

  const listVideos = videos.filter((v) => v.id !== activeId);

  return (
    <>
      <div className="flex min-h-dvh flex-col bg-[#030303]">
        {/* Header */}
        <header
          className="sticky top-0 left-0 right-0 z-30 flex items-center justify-between border-b border-[rgba(200,241,53,0.10)] px-4 py-3 sm:px-7 sm:py-3.5"
          style={{
            background: "rgba(3,3,3,0.92)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}
        >
          <div>
            <p
              className="font-display text-[13px] font-black uppercase tracking-[0.15em] text-primary sm:text-[14px]"
              style={{ textShadow: "0 0 10px rgba(200,241,53,0.2)" }}
            >
              Home
            </p>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg border border-[rgba(200,241,53,0.15)] bg-[rgba(200,241,53,0.04)] px-2.5 py-1.5 text-xs text-muted sm:gap-2 sm:px-3.5 sm:py-2">
            <span
              className="h-1.5 w-1.5 rounded-full bg-accent"
              style={{ boxShadow: "0 0 6px rgba(200,241,53,0.8)" }}
            />
            <WalletBadge />
          </div>
        </header>

        <div className="w-full overflow-hidden px-4 py-4 pb-20 sm:px-7 sm:py-5">
          <ConnectBanner className="mb-5" />

          {/* 4-col Metrics */}
          <div className="mb-4 grid grid-cols-2 gap-2 sm:mb-5 sm:gap-2.5 sm:grid-cols-4">
            <div
              className="glass-card overflow-hidden p-3 sm:p-4"
              style={{
                borderColor: "rgba(200,241,53,0.25)",
                boxShadow: "0 0 16px rgba(200,241,53,0.06)",
              }}
            >
              <p className="mb-1 truncate font-display text-[8px] uppercase tracking-wider text-muted sm:text-[9px] sm:tracking-widest">
                Total earned
              </p>
              <p
                className="font-display text-base font-black tabular-nums text-accent sm:text-xl"
                style={{ textShadow: "0 0 10px rgba(200,241,53,0.35)" }}
              >
                {pendingPoints}p
              </p>
              <p className="mt-0.5 truncate text-[9px] text-accent/60 sm:text-[10px]">&uarr; today</p>
            </div>
            <div className="glass-card overflow-hidden p-3 sm:p-4">
              <p className="mb-1 truncate font-display text-[8px] uppercase tracking-wider text-muted sm:text-[9px] sm:tracking-widest">
                Pending pts
              </p>
              <p className="font-display text-base font-black tabular-nums text-primary sm:text-xl">
                {pendingPoints}p
              </p>
              <p className="mt-0.5 truncate text-[9px] text-accent/60 sm:text-[10px]">
                &uarr; {earnedIds.size * 10} today
              </p>
            </div>
            <div className="glass-card overflow-hidden p-3 sm:p-4">
              <p className="mb-1 truncate font-display text-[8px] uppercase tracking-wider text-muted sm:text-[9px] sm:tracking-widest">
                On-chain
              </p>
              <p className="font-display text-base font-black tabular-nums text-primary sm:text-xl">
                0
              </p>
              <p className="mt-0.5 truncate text-[9px] text-muted sm:text-[10px]">Deploy ready</p>
            </div>
            <div className="glass-card overflow-hidden p-3 sm:p-4">
              <p className="mb-1 truncate font-display text-[8px] uppercase tracking-wider text-muted sm:text-[9px] sm:tracking-widest">
                Referrals
              </p>
              <p className="font-display text-base font-black tabular-nums text-primary sm:text-xl">
                0
              </p>
              <p className="mt-0.5 truncate text-[9px] text-accent/60 sm:text-[10px]">
                Invite friends
              </p>
            </div>
          </div>

          {/* 2-col main layout */}
          <div className="grid gap-3 md:grid-cols-[1fr_300px] sm:gap-3.5">
            {/* LEFT: video list + streak */}
            <div className="glass-card overflow-hidden p-4 order-2 md:order-1">
              <div className="mb-3.5 flex items-center justify-between">
                <p
                  className="font-display text-[11px] font-bold uppercase tracking-[0.12em] text-primary"
                  style={{ textShadow: "0 0 8px rgba(200,241,53,0.2)" }}
                >
                  Today&apos;s Transmissions
                </p>
                <span className="font-display text-[9px] uppercase tracking-widest text-muted">
                  {videos.length} queued
                </span>
              </div>

              {/* Active player */}
              {activeVideo && (
                <div id="player-area" className="mb-4 scroll-mt-20">
                  {/* Video counter */}
                  <div className="mb-2 flex items-center justify-between text-[10px] text-muted">
                    <span className="font-display font-bold text-accent">
                      Video {currentVideoIndex + 1} of {videos.length}
                    </span>
                    <span className="font-mono text-[9px] opacity-60">
                      ID: {activeId}
                    </span>
                  </div>

                  {/* Player */}
                  <VideoPlayer
                    key={activeId!}
                    video={activeVideo}
                    earned={earnedIds.has(activeId!)}
                    onEarned={handleEarned}
                  />

                  {/* Video info + earned status */}
                  <div className="mt-2 flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12px] font-medium text-primary">
                        {activeVideo.title}
                      </p>
                      <p className="text-[11px] text-muted">
                        {activeVideo.sponsor}
                      </p>
                    </div>
                    {earnedIds.has(activeId!) && (
                      <span className="ml-2 shrink-0 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold text-accent">
                        Earned ✓
                      </span>
                    )}
                  </div>

                  {/* Navigation buttons */}
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={goToPrev}
                      disabled={!hasPrev}
                      className="flex-1 rounded-lg border border-[rgba(200,241,53,0.2)] bg-[rgba(200,241,53,0.06)] px-3 py-2 text-xs font-bold uppercase tracking-wider text-accent transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:border-[rgba(200,241,53,0.4)]"
                    >
                      ← Previous
                    </button>
                    <button
                      onClick={goToNext}
                      disabled={!hasNext}
                      className="flex-1 rounded-lg border border-[rgba(200,241,53,0.2)] bg-[rgba(200,241,53,0.06)] px-3 py-2 text-xs font-bold uppercase tracking-wider text-accent transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:border-[rgba(200,241,53,0.4)]"
                    >
                      Next →
                    </button>
                  </div>

                  <div className="my-3 h-px bg-border" />
                </div>
              )}

              {/* Video rows */}
              <div className="flex flex-col">
                {videos.map((video, i) => (
                  <div
                    key={video.id}
                    className={[
                      "flex items-center gap-2 py-2.5 sm:gap-3",
                      i < videos.length - 1
                        ? "border-b border-[rgba(200,241,53,0.07)]"
                        : "",
                    ].join(" ")}
                  >
                    {/* Thumbnail with play overlay */}
                    <button
                      onClick={() => handleSelect(video.id)}
                      className="relative shrink-0 overflow-hidden rounded"
                      style={{ width: 48, height: 28 }}
                    >
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity hover:bg-black/20">
                        <Play size={10} className="text-accent drop-shadow-lg" />
                      </div>
                    </button>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] font-medium text-primary sm:text-[12px]">
                        {video.title}
                      </p>
                      <p className="truncate text-[10px] text-muted sm:text-[11px]">
                        {video.sponsor} · {video.durationSeconds}s
                      </p>
                    </div>
                    <span
                      className="shrink-0 font-display text-[10px] font-bold text-accent sm:text-[11px]"
                      style={{ textShadow: "0 0 8px rgba(200,241,53,0.4)" }}
                    >
                      +{video.rewardPoints}p
                    </span>
                    {earnedIds.has(video.id) ? (
                      <span className="shrink-0 rounded-md border border-[rgba(200,241,53,0.25)] bg-[rgba(200,241,53,0.08)] px-2 py-1 font-display text-[8px] font-bold uppercase tracking-wider text-accent sm:px-3 sm:text-[9px]">
                        Done
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSelect(video.id)}
                        className="shrink-0 btn-neon px-2 py-1 text-[9px] sm:px-3 sm:text-[10px]"
                      >
                        Watch
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Streak */}
              {/* <div className="mt-4 border-t border-[rgba(200,241,53,0.08)] pt-4">
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-display text-[11px] font-bold uppercase tracking-[0.12em] text-primary">
                    Daily streak
                  </p>
                  <StreakBadge watchedToday={earnedIds.size > 0} />
                </div>
                <StreakRow watchedToday={earnedIds.size > 0} />
              </div> */}
            </div>

            {/* RIGHT: points + activity */}
            <div className="flex flex-col gap-3.5 order-1 md:order-2">
              {/* Points deploy card */}
              <div
                className="glass-card overflow-hidden p-4"
                style={{ borderColor: "rgba(200,241,53,0.2)" }}
              >
                <p
                  className="mb-3.5 font-display text-[11px] font-bold uppercase tracking-[0.12em] text-primary"
                  style={{ textShadow: "0 0 8px rgba(200,241,53,0.2)" }}
                >
                  Points Earned
                </p>
                <div className="mb-3.5 rounded-xl border border-[rgba(200,241,53,0.2)] bg-[rgba(200,241,53,0.04)] p-4 text-center">
                  <p
                    className="font-display text-3xl font-black tabular-nums text-accent"
                    style={{ textShadow: "0 0 16px rgba(200,241,53,0.5)" }}
                  >
                    {pendingPoints}p
                  </p>
                  <p className="mt-0.5 font-display text-[9px] uppercase tracking-widest text-muted">
                    pending off-chain pts
                  </p>
                </div>
                {address ? (
                  <Link
                    href="/swap"
                    className="mt-2 flex w-full items-center justify-center rounded-lg border border-[rgba(200,241,53,0.3)] bg-[rgba(200,241,53,0.08)] py-2.5 text-[13px] font-bold text-accent transition-all hover:border-[rgba(200,241,53,0.5)] hover:bg-[rgba(200,241,53,0.14)]"
                    style={{ letterSpacing: "0.04em" }}
                  >
                    Swap Points → CELO
                  </Link>
                ) : (
                  <Link
                    href="/swap"
                    className="mt-2 flex w-full items-center justify-center rounded-lg border border-[rgba(200,241,53,0.15)] bg-[rgba(200,241,53,0.03)] py-2.5 text-[13px] font-medium text-muted/50 transition-all hover:border-[rgba(200,241,53,0.3)] hover:text-accent"
                    style={{ letterSpacing: "0.04em" }}
                  >
                    Swap Points
                  </Link>
                )}
              </div>

              {/* Mission card */}
              <div className="glass-card animate-running-border overflow-hidden p-4">
                <div className="mb-2 flex items-center gap-2">
                  <p
                    className="font-display text-[11px] font-bold uppercase tracking-[0.12em] text-primary"
                    style={{ textShadow: "0 0 8px rgba(200,241,53,0.2)" }}
                  >
                    Mission
                  </p>
                  <span className="rounded-full border border-[rgba(200,241,53,0.25)] bg-[rgba(200,241,53,0.08)] px-2 py-0.5 font-display text-[8px] uppercase tracking-widest text-accent">
                    Active
                  </span>
                </div>
                <div className="rounded-xl border border-[rgba(200,241,53,0.1)] bg-[rgba(200,241,53,0.02)] p-3">
                  <p className="text-[11px] font-medium text-primary leading-relaxed">
                    Watch videos &amp; take quizzes
                  </p>
                  <p
                    className="mt-1 font-display text-lg font-black text-accent"
                    style={{ textShadow: "0 0 12px rgba(200,241,53,0.3)" }}
                  >
                    Earn Bonus Points
                  </p>
                  <p className="mt-1 text-[10px] text-muted">
                    Complete missions to unlock extra rewards
                  </p>
                </div>
                <Link
                  href="/missions"
                  className="mt-3 flex w-full items-center justify-center rounded-lg border border-[rgba(200,241,53,0.28)] bg-[rgba(200,241,53,0.07)] py-2.5 font-display text-[11px] font-bold uppercase tracking-wider text-accent transition-all hover:border-[rgba(200,241,53,0.45)] hover:bg-[rgba(200,241,53,0.12)]"
                >
                  Explore Missions &rarr;
                </Link>
              </div>

              {/* Recent activity */}
              {/* <div className="glass-card p-4">
                <p
                  className="mb-3.5 font-display text-[11px] font-bold uppercase tracking-[0.12em] text-primary"
                  style={{ textShadow: "0 0 8px rgba(200,241,53,0.2)" }}
                >
                  Recent Activity
                </p>
                <div className="flex flex-col text-[11px]">
                  {earnedIds.size > 0 ? (
                    <>
                      {[...earnedIds].map((id) => {
                        const v = videos.find((x) => x.id === id);
                        return v ? (
                          <div
                            key={id}
                            className="flex justify-between border-b border-[rgba(200,241,53,0.07)] py-1.5 text-muted last:border-0"
                          >
                            <span>Watched video</span>
                            <span className="font-display font-bold text-accent">
                              +10 pts
                            </span>
                          </div>
                        ) : null;
                      })}
                      <div className="flex justify-between border-b border-[rgba(200,241,53,0.07)] py-1.5 text-muted last:border-0">
                        <span>Daily check-in</span>
                        <span className="font-display font-bold text-accent">
                          +5 pts
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between border-b border-[rgba(200,241,53,0.07)] py-1.5 text-muted">
                        <span>Daily check-in</span>
                        <span className="font-display font-bold text-accent">
                          +5 pts
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-[rgba(200,241,53,0.07)] py-1.5 text-muted">
                        <span>Referral confirmed</span>
                        <span className="font-display font-bold text-accent">
                          +50 pts
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-[rgba(200,241,53,0.07)] py-1.5 text-muted">
                        <span>Streak bonus</span>
                        <span className="font-display font-bold text-accent">
                          +25 pts
                        </span>
                      </div>
                      <div className="flex justify-between py-1.5 text-muted">
                        <span>Watch a video</span>
                        <span className="font-display font-bold text-accent">
                          +10 pts
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      {/* ── Completion claim modal ─────────────────────────────────────── */}
      {showClaimModal && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
          style={{
            background: "rgba(3,3,3,0.82)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowClaimModal(false);
          }}
        >
          <div
            className="w-full max-w-sm rounded-t-3xl border border-[rgba(200,241,53,0.25)] px-6 pb-10 pt-6 sm:rounded-2xl sm:pb-6"
            style={{
              background: "#0d0d0d",
              boxShadow:
                "0 0 48px rgba(200,241,53,0.12), 0 -2px 32px rgba(200,241,53,0.06)",
            }}
          >
            {/* Drag handle (mobile) */}
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/15 sm:hidden" />

            {/* Points burst */}
            <div className="mb-6 text-center">
              <div
                className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border-2 border-accent/30 bg-accent/8"
                style={{
                  boxShadow:
                    "0 0 32px rgba(200,241,53,0.25), 0 0 8px rgba(200,241,53,0.15)",
                }}
              >
                <span className="text-4xl">⚡</span>
              </div>
              <p className="font-display text-[10px] uppercase tracking-[0.2em] text-accent/70">
                video completed
              </p>
              <p
                className="mt-1 font-display text-5xl font-black tabular-nums text-accent"
                style={{ textShadow: "0 0 24px rgba(200,241,53,0.6)" }}
              >
                +{lastEarnedPoints}
              </p>
              <p className="font-display text-[10px] uppercase tracking-[0.2em] text-muted">
                points earned
              </p>
              {pendingPoints > lastEarnedPoints && (
                <p className="mt-2 text-[11px] text-muted">
                  Total pending:{" "}
                  <span className="font-bold text-accent">
                    {pendingPoints}p
                  </span>
                </p>
              )}
            </div>

            {/* Actions */}
            {address ? (
              <div className="space-y-2">
                <Link
                  href="/swap"
                  className="flex w-full items-center justify-center rounded-xl border border-[rgba(200,241,53,0.28)] bg-[rgba(200,241,53,0.07)] py-3 font-display text-[12px] font-bold uppercase tracking-wider text-accent transition-all hover:border-[rgba(200,241,53,0.45)] hover:bg-[rgba(200,241,53,0.12)]"
                >
                  Swap {(pendingPoints / 1000).toFixed(1)} CELO
                </Link>
              </div>
            ) : (
              <ConnectBanner />
            )}

            <button
              onClick={() => setShowClaimModal(false)}
              className="mt-3 w-full py-2 text-center font-display text-[10px] uppercase tracking-widest text-muted transition-colors hover:text-primary"
            >
              Continue Watching
            </button>
          </div>
        </div>
      )}
    </>
  );
}
