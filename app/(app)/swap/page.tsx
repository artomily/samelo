"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useAccount, useReadContract, useReadContracts } from "wagmi";
import Link from "next/link";
import { ArrowLeft, ArrowDown, Zap, RefreshCw } from "lucide-react";
import { formatEther, formatUnits } from "viem";
import { MELO_ABI } from "@/lib/melo.abi";
import { POINTS_ABI } from "@/lib/points.abi";
import { SWAP_ABI } from "@/lib/swap.abi";
import { useSwapToMelo } from "@/hooks/useSwapToMelo";
import { useSwapPoints } from "@/hooks/useSwapPoints";
import { toast } from "@/app/components/Toast";
import { ConnectBanner } from "@/app/components/ConnectBanner";
import { Skeleton } from "@/app/components/Skeleton";

const POINTS_ADDRESS = process.env.NEXT_PUBLIC_POINTS_ADDRESS as
  | `0x${string}`
  | undefined;
const MELO_ADDRESS = process.env.NEXT_PUBLIC_MELO_ADDRESS as
  | `0x${string}`
  | undefined;
const SWAP_ADDRESS = process.env.NEXT_PUBLIC_SWAP_ADDRESS as
  | `0x${string}`
  | undefined;

const MELO_DECIMALS = 18;
const CELO_DECIMALS = 18;

const REDEMPTION_OPTIONS = [
  { points: 1000, melo: 1 },
  { points: 2500, melo: 2.5 },
  { points: 5000, melo: 5 },
  { points: 10000, melo: 10 },
  { points: 25000, melo: 25 },
  { points: 50000, melo: 50 },
  { points: 100000, melo: 100 },
  { points: 250000, melo: 250 },
];

type Tab = 'melo' | 'celo'

export default function SwapPage() {
  const { address } = useAccount()
  const [tab, setTab] = useState<Tab>('melo')
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [celoAmount, setCeloAmount] = useState('')
  const [supabasePoints, setSupabasePoints] = useState(0)

  const selected =
    selectedIndex !== null ? REDEMPTION_OPTIONS[selectedIndex] : null;

  // ── On-chain reads ──────────────────────────────────────────────────────────
  const { data: onChainPoints, refetch: refetchPoints } = useReadContract({
    address: POINTS_ADDRESS,
    abi: POINTS_ABI,
    functionName: "getPoints",
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!POINTS_ADDRESS, refetchInterval: 15_000 },
  });

  const { data: contractReads, refetch: refetchContracts } = useReadContracts({
    contracts: [
      {
        address: MELO_ADDRESS,
        abi: MELO_ABI,
        functionName: "balanceOf",
        args: address ? [address] : undefined,
      },
      {
        address: SWAP_ADDRESS,
        abi: SWAP_ABI,
        functionName: "previewSwap",
        args: celoAmount ? [BigInt(Number(celoAmount) || 0)] : undefined,
      },
    ],
    query: { enabled: !!address, refetchInterval: 15_000 },
  });

  const meloRaw = contractReads?.[0].result;
  const celoPreviewRaw = contractReads?.[1].result;

  const meloBalance =
    meloRaw !== undefined
      ? Number(formatUnits(meloRaw as bigint, MELO_DECIMALS)).toFixed(2)
      : "—";

  const onChainPts = onChainPoints ? Number(onChainPoints) : 0;

  const celoPreview = useMemo(() => {
    if (!celoPreviewRaw || !celoAmount || Number(celoAmount) <= 0) return null;
    return Number(formatEther(celoPreviewRaw as bigint)).toFixed(6);
  }, [celoPreviewRaw, celoAmount]);

  // ── Supabase pending points ─────────────────────────────────────────────────
  const fetchSupabasePoints = useCallback(() => {
    if (!address) return;
    fetch(`/api/rewards/pending?walletAddress=${address}`)
      .then((r) => r.json())
      .then((d: { totalCents?: number }) => {
        setSupabasePoints(typeof d.totalCents === "number" ? d.totalCents : 0);
      })
      .catch(() => {});
  }, [address]);

  useEffect(() => {
    fetchSupabasePoints();
  }, [fetchSupabasePoints]);

  // ── $MELO redeem ────────────────────────────────────────────────────────────
  const {
    swap: swapToMelo,
    status: meloStatus,
    reset: resetMelo,
  } = useSwapToMelo();

  useEffect(() => {
    if (meloStatus === "success") {
      toast(
        `Swapped ${selected?.points} pts → ${selected?.melo} $MELO!`,
        "success",
      );
      setSelectedIndex(null);
      void refetchPoints();
      void refetchContracts();
      resetMelo();
    }
    if (meloStatus === "error") {
      toast("Swap failed — try again", "error");
    }
  }, [meloStatus, selected, refetchPoints, refetchContracts, resetMelo]);

  const handleMeloSwap = useCallback(() => {
    if (!selected || selected.points <= 0) return;
    void swapToMelo(selected.points);
  }, [selected, swapToMelo]);

  // ── CELO swap via oracle ────────────────────────────────────────────────────
  const onCeloSwapSuccess = useCallback(() => {
    setCeloAmount('')
    fetchSupabasePoints()
    void refetchContracts()
  }, [fetchSupabasePoints, refetchContracts])

  const {
    swapPoints,
    status: celoSwapStatus,
    celoPreview: celoSwapPreview,
    reset: resetCeloSwap,
  } = useSwapPoints(onCeloSwapSuccess)

  const handleCeloSwap = useCallback(() => {
    const amt = Number(celoAmount);
    if (!amt || amt <= 0) return;
    void swapPoints(amt);
  }, [celoAmount, swapPoints]);

  return (
    <div className="flex min-h-dvh flex-col bg-[#030303]">
      <header
        className="sticky top-0 z-30 flex items-center gap-3 border-b border-[rgba(200,241,53,0.10)] px-4 py-3"
        style={{
          background: "rgba(3,3,3,0.92)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        <Link
          href="/earnings"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[rgba(200,241,53,0.15)] text-muted transition-colors hover:border-[rgba(200,241,53,0.4)] hover:text-accent"
        >
          <ArrowLeft size={15} />
        </Link>
        <h1
          className="font-display text-[13px] font-black uppercase tracking-[0.15em] text-primary"
          style={{ textShadow: "0 0 10px rgba(200,241,53,0.2)" }}
        >
          Swap Points
        </h1>
      </header>

      <div className="w-full px-4 py-4 pb-28 sm:px-7 sm:py-5 space-y-5">
        {!address ? (
          <ConnectBanner />
        ) : (
          <>
            {/* Tabs */}
            <div className="flex rounded-xl border border-[rgba(200,241,53,0.12)] bg-[#0d0d0d] p-1">
              <button
                onClick={() => setTab('melo')}
                className="flex-1 rounded-lg py-2 font-display text-[11px] font-bold uppercase tracking-wider transition-all"
                style={
                  tab === 'melo'
                    ? { background: 'rgba(200,241,53,0.1)', color: '#c8f135', boxShadow: '0 0 8px rgba(200,241,53,0.1)' }
                    : { color: 'rgba(255,255,255,0.35)' }
                }
              >
                Redeem $MELO
              </button>
              <button
                onClick={() => setTab('celo')}
                className="flex-1 rounded-lg py-2 font-display text-[11px] font-bold uppercase tracking-wider transition-all"
                style={
                  tab === 'celo'
                    ? { background: 'rgba(200,241,53,0.1)', color: '#c8f135', boxShadow: '0 0 8px rgba(200,241,53,0.1)' }
                    : { color: 'rgba(255,255,255,0.35)' }
                }
              >
                Swap for CELO
              </button>
            </div>

            {tab === 'melo' ? (
              <MeloTab
                supabasePoints={supabasePoints}
                onChainPoints={onChainPts}
                meloBalance={meloBalance}
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
                meloStatus={meloStatus}
                onSwap={handleMeloSwap}
                onRefetch={() => {
                  fetchSupabasePoints()
                  void refetchPoints()
                  void refetchContracts()
                }}
              />
            ) : (
              <CeloTab
                supabasePoints={supabasePoints}
                celoAmount={celoAmount}
                setCeloAmount={setCeloAmount}
                celoPreview={celoPreview ?? celoSwapPreview}
                swapStatus={celoSwapStatus}
                onSwap={handleCeloSwap}
                onReset={resetCeloSwap}
              />
            )}

            {/* How it works */}
            <div className="space-y-2 rounded-xl border border-[rgba(200,241,53,0.08)] bg-[rgba(200,241,53,0.02)] p-4">
              <p className="font-display text-[10px] uppercase tracking-[0.15em] text-muted">
                How it works
              </p>
              <ul className="space-y-1.5 text-[11px] text-muted/70">
                <li className="flex gap-2">
                  <span className="shrink-0 text-accent">01</span>
                  Watch videos to earn off-chain points (stored in Supabase)
                </li>
                <li className="flex gap-2">
                  <span className="shrink-0 text-accent">02</span>
                  Earn on-chain points via <strong>Earn 10 Points</strong>{" "}
                  button (1h cooldown)
                </li>
                <li className="flex gap-2">
                  <span className="shrink-0 text-accent">03</span>
                  <strong>$MELO</strong>: Redeem on-chain points for $MELO
                  (1,000 pts = 1 $MELO)
                </li>
                <li className="flex gap-2">
                  <span className="shrink-0 text-accent">04</span>
                  <strong>CELO</strong>: Swap off-chain points for CELO via
                  oracle signature
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── $MELO Tab ──────────────────────────────────────────────────────────────────

function MeloTab({
  supabasePoints,
  onChainPoints,
  meloBalance,
  selectedIndex,
  setSelectedIndex,
  meloStatus,
  onSwap,
  onRefetch,
}: {
  supabasePoints: number
  onChainPoints: number
  meloBalance: string
  selectedIndex: number | null
  setSelectedIndex: (i: number | null) => void
  meloStatus: string
  onSwap: () => void
  onRefetch: () => void
}) {
  const selected =
    selectedIndex !== null ? REDEMPTION_OPTIONS[selectedIndex] : null;
  const isPending = meloStatus === "pending" || meloStatus === "confirming";

  // Redeem checks on-chain balance, but we show Supabase balance (same as other pages)
  const effectivePoints = Math.min(supabasePoints, onChainPoints || 0)

  return (
    <>
      <div className="grid grid-cols-1">
        <BalanceCard
          label="Pending Points"
          value={String(supabasePoints)}
          unit="pts"
          accent
        />
      </div>

      <div
        className="rounded-2xl border border-[rgba(200,241,53,0.18)] bg-[#0d0d0d] p-5"
        style={{ boxShadow: "0 0 28px rgba(200,241,53,0.06)" }}
      >
        <div className="mb-3 flex items-center justify-between">
          <span className="font-display text-[9px] uppercase tracking-[0.2em] text-muted">
            Select Redemption Tier
          </span>
          <button
            onClick={onRefetch}
            className="flex items-center gap-1 text-[9px] text-muted/50 hover:text-accent transition-colors"
          >
            <RefreshCw size={10} />
            Refresh
          </button>
        </div>

        {supabasePoints === 0 && (
          <div className="mb-3 rounded-lg border border-[rgba(200,241,53,0.12)] bg-[rgba(200,241,53,0.03)] px-3 py-2 text-center">
            <p className="text-[10px] text-muted/60">
              No points yet. Watch videos or use the{" "}
              <strong className="text-accent/70">Earn 10 Points</strong> button
              on the Earnings page first.
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 mb-4">
          {REDEMPTION_OPTIONS.map((opt, i) => {
            const canAfford = effectivePoints >= opt.points;
            const isSelected = selectedIndex === i;

            return (
              <button
                key={opt.points}
                onClick={() => canAfford && setSelectedIndex(i)}
                disabled={!canAfford}
                className="relative rounded-xl border px-3 py-3 text-left transition-all disabled:cursor-not-allowed"
                style={
                  isSelected
                    ? {
                        borderColor: "rgba(200,241,53,0.5)",
                        background: "rgba(200,241,53,0.1)",
                        boxShadow: "0 0 16px rgba(200,241,53,0.15)",
                      }
                    : canAfford
                      ? {
                          borderColor: "rgba(200,241,53,0.15)",
                          background: "rgba(200,241,53,0.03)",
                        }
                      : {
                          borderColor: "rgba(200,241,53,0.06)",
                          background: "rgba(200,241,53,0.01)",
                        }
                }
              >
                <div
                  className="font-display text-lg font-black tabular-nums"
                  style={
                    canAfford
                      ? {
                          color: "#c8f135",
                          textShadow: "0 0 8px rgba(200,241,53,0.3)",
                        }
                      : { color: "rgba(200,241,53,0.15)" }
                  }
                >
                  {opt.melo % 1 === 0 ? opt.melo : opt.melo.toFixed(1)}
                  <span className="ml-1 font-display text-[9px] font-bold uppercase tracking-wider text-muted/50">
                    MELO
                  </span>
                </div>
                <div className="mt-0.5 font-display text-[10px] uppercase tracking-wider text-muted/50">
                  {opt.points.toLocaleString()} pts
                </div>
                {isSelected && (
                  <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full border border-[rgba(200,241,53,0.4)] bg-[rgba(200,241,53,0.15)]">
                    <div className="h-2 w-2 rounded-full bg-accent" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {selected && (
          <div className="flex justify-center py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(200,241,53,0.2)] bg-[#080808]">
              <ArrowDown size={14} className="text-accent" />
            </div>
          </div>
        )}

        <button
          onClick={onSwap}
          disabled={!selected || isPending || !MELO_ADDRESS}
          className="w-full rounded-xl border border-[rgba(200,241,53,0.35)] bg-[rgba(200,241,53,0.10)] py-3.5 font-display text-[13px] font-bold uppercase tracking-wider text-accent transition-all hover:enabled:border-[rgba(200,241,53,0.6)] hover:enabled:bg-[rgba(200,241,53,0.18)] disabled:cursor-not-allowed disabled:opacity-40 active:scale-[0.98]"
          style={
            selected && !isPending
              ? { boxShadow: "0 0 16px rgba(200,241,53,0.12)" }
              : {}
          }
        >
          {!MELO_ADDRESS
            ? "Contract Not Deployed"
            : meloStatus === "pending"
              ? "Confirm in Wallet…"
              : meloStatus === "confirming"
                ? "Confirming on-chain…"
                : !selected
                  ? "Select a Tier"
                  : `Swap ${selected.points.toLocaleString()} pts → ${selected.melo} $MELO`}
        </button>

        {meloStatus === "error" && (
          <p className="mt-2 text-center text-[11px] text-red-400">
            Swap failed. Make sure you have enough on-chain points.
          </p>
        )}
      </div>
    </>
  );
}

// ── CELO Tab ───────────────────────────────────────────────────────────────────

function CeloTab({
  supabasePoints,
  celoAmount,
  setCeloAmount,
  celoPreview,
  swapStatus,
  onSwap,
  onReset,
}: {
  supabasePoints: number;
  celoAmount: string;
  setCeloAmount: (v: string) => void;
  celoPreview: string | null;
  swapStatus: string;
  onSwap: () => void;
  onReset: () => void;
}) {
  const parsedAmount = Number(celoAmount);
  const isValid = parsedAmount > 0 && parsedAmount <= supabasePoints;
  const isPending =
    swapStatus === "fetching" ||
    swapStatus === "pending" ||
    swapStatus === "confirming";

  const presetAmounts = [500, 1000, 2500, 5000];

  return (
    <>
      <div className="grid grid-cols-1">
        <BalanceCard
          label="Pending Points"
          value={String(supabasePoints)}
          unit="pts"
          accent
        />
      </div>

      <div
        className="rounded-2xl border border-[rgba(200,241,53,0.18)] bg-[#0d0d0d] p-5"
        style={{ boxShadow: "0 0 28px rgba(200,241,53,0.06)" }}
      >
        <div className="mb-3 flex items-center justify-between">
          <span className="font-display text-[9px] uppercase tracking-[0.2em] text-muted">
            Enter Points Amount
          </span>
          <span className="font-display text-[9px] uppercase tracking-widest text-muted/50">
            Balance: {supabasePoints} pts
          </span>
        </div>

        {/* Quick select presets */}
        <div className="mb-3 flex gap-1.5">
          {presetAmounts.map((p) => (
            <button
              key={p}
              onClick={() => setCeloAmount(String(p))}
              disabled={p > supabasePoints}
              className="flex-1 rounded-lg border border-[rgba(200,241,53,0.12)] py-1.5 text-center font-display text-[10px] font-bold text-accent/70 transition-all hover:border-[rgba(200,241,53,0.3)] disabled:opacity-25 disabled:cursor-not-allowed"
            >
              {p.toLocaleString()}
            </button>
          ))}
        </div>

        {/* Custom amount input */}
        <div className="relative mb-4">
          <input
            type="number"
            value={celoAmount}
            onChange={(e) => {
              const v = e.target.value.replace(/[^0-9]/g, "");
              setCeloAmount(v);
            }}
            placeholder="Enter points amount…"
            min={0}
            max={supabasePoints}
            className="w-full rounded-xl border border-[rgba(200,241,53,0.18)] bg-[#080808] px-4 py-3 font-mono text-lg text-primary placeholder:text-muted/30 focus:border-[rgba(200,241,53,0.4)] focus:outline-none"
          />
          <button
            onClick={() => setCeloAmount(String(supabasePoints))}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg border border-[rgba(200,241,53,0.15)] px-2 py-0.5 font-display text-[9px] font-bold uppercase tracking-wider text-accent/60 transition-colors hover:border-[rgba(200,241,53,0.35)] hover:text-accent"
          >
            MAX
          </button>
        </div>

        {/* Preview */}
        {celoAmount && Number(celoAmount) > 0 && (
          <div className="mb-4 flex justify-center">
            <div className="flex items-center gap-2 rounded-xl border border-[rgba(200,241,53,0.12)] bg-[rgba(200,241,53,0.03)] px-4 py-2">
              <Zap size={14} className="text-accent" />
              <span className="font-display text-[11px] text-muted">
                {Number(celoAmount).toLocaleString()} pts
              </span>
              <ArrowDown size={12} className="text-muted/40" />
              <span className="font-display text-[11px] font-bold text-accent">
                {celoPreview ? `${celoPreview} CELO` : "calculating…"}
              </span>
            </div>
          </div>
        )}

        <button
          onClick={onSwap}
          disabled={!isValid || isPending}
          className="w-full rounded-xl border border-[rgba(200,241,53,0.35)] bg-[rgba(200,241,53,0.10)] py-3.5 font-display text-[13px] font-bold uppercase tracking-wider text-accent transition-all hover:enabled:border-[rgba(200,241,53,0.6)] hover:enabled:bg-[rgba(200,241,53,0.18)] disabled:cursor-not-allowed disabled:opacity-40 active:scale-[0.98]"
          style={
            isValid && !isPending
              ? { boxShadow: "0 0 16px rgba(200,241,53,0.12)" }
              : {}
          }
        >
          {!SWAP_ADDRESS
            ? "Swap Contract Not Deployed"
            : swapStatus === "fetching"
              ? "Getting oracle signature…"
              : swapStatus === "pending"
                ? "Confirm in Wallet…"
                : swapStatus === "confirming"
                  ? "Confirming on-chain…"
                  : !isValid
                    ? "Enter Points Amount"
                    : `Swap ${parsedAmount.toLocaleString()} pts → ${celoPreview ?? "…"} CELO`}
        </button>

        {swapStatus === "error" && (
          <p className="mt-2 text-center text-[11px] text-red-400">
            Swap failed.{" "}
            <button onClick={onReset} className="underline">
              Try again
            </button>
          </p>
        )}
      </div>
    </>
  );
}

// ── Shared ─────────────────────────────────────────────────────────────────────

function BalanceCard({
  label,
  value,
  unit,
  accent,
  dim,
  dimNote,
}: {
  label: string;
  value: string | null;
  unit: string;
  accent: boolean;
  dim?: boolean;
  dimNote?: string;
}) {
  return (
    <div
      className="rounded-xl border border-[rgba(200,241,53,0.12)] bg-[#0d0d0d] px-4 py-3"
      style={
        accent
          ? {
              borderColor: "rgba(200,241,53,0.22)",
              boxShadow: "0 0 16px rgba(200,241,53,0.05)",
            }
          : {}
      }
    >
      <p className="font-display text-[9px] uppercase tracking-[0.15em] text-muted">
        {label}
      </p>
      {value === null ? (
        <Skeleton className="mt-1.5 h-6 w-16 rounded" />
      ) : (
        <div className="mt-1 flex items-baseline gap-1.5">
          <span
            className="font-display text-xl font-black tabular-nums"
            style={
              dim
                ? { color: "rgba(200,241,53,0.2)" }
                : accent
                  ? {
                      color: "#c8f135",
                      textShadow: "0 0 10px rgba(200,241,53,0.4)",
                    }
                  : { color: "#f0f0f0" }
            }
          >
            {value}
          </span>
          <span className="font-display text-[9px] uppercase tracking-wider text-muted/60">
            {unit}
          </span>
        </div>
      )}
      {dimNote && <p className="mt-0.5 text-[9px] text-muted/50">{dimNote}</p>}
    </div>
  );
}
