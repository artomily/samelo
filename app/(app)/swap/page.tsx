"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useAccount, useReadContracts } from "wagmi";
import Link from "next/link";
import { ArrowLeft, ArrowDown, Zap, RefreshCw } from "lucide-react";
import { formatEther } from "viem";
import { SWAP_ABI } from "@/lib/swap.abi";
import { useSwapPoints } from "@/hooks/useSwapPoints";
import { toast } from "@/app/components/Toast";
import { ConnectBanner } from "@/app/components/ConnectBanner";
import { Skeleton } from "@/app/components/Skeleton";

const SWAP_ADDRESS = process.env.NEXT_PUBLIC_SWAP_ADDRESS as
  | `0x${string}`
  | undefined;

export default function SwapPage() {
  const { address } = useAccount()
  const [celoAmount, setCeloAmount] = useState('')
  const [supabasePoints, setSupabasePoints] = useState(0)

  // ── On-chain preview ─────────────────────────────────────────────────────
  const { data: contractReads, refetch: refetchContracts } = useReadContracts({
    contracts: [
      {
        address: SWAP_ADDRESS,
        abi: SWAP_ABI,
        functionName: "previewSwap",
        args: celoAmount ? [BigInt(Number(celoAmount) || 0)] : undefined,
      },
      {
        address: SWAP_ADDRESS,
        abi: SWAP_ABI,
        functionName: "minSwapPoints",
      },
    ],
    query: { enabled: !!address, refetchInterval: 15_000 },
  });

  const celoPreviewRaw = contractReads?.[0].result;
  const minSwapPointsRaw = contractReads?.[1].result;
  const minSwapPoints = minSwapPointsRaw ? Number(minSwapPointsRaw) : 500;

  const celoPreview = useMemo(() => {
    if (!celoPreviewRaw || !celoAmount || Number(celoAmount) <= 0) return null;
    return Number(formatEther(celoPreviewRaw as bigint)).toFixed(6);
  }, [celoPreviewRaw, celoAmount]);

  // ── Supabase pending points ──────────────────────────────────────────────
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

  // ── CELO swap via oracle ─────────────────────────────────────────────────
  const onCeloSwapSuccess = useCallback(() => {
    setCeloAmount('')
    fetchSupabasePoints()
    void refetchContracts()
    setTimeout(() => fetchSupabasePoints(), 1000)
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
        className="sticky top-0 left-0 right-0 z-30 flex items-center gap-3 border-b border-[rgba(200,241,53,0.10)] px-4 py-3 sm:px-7 sm:py-3.5"
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
          Swap Points → CELO
        </h1>
      </header>

      <div className="w-full overflow-hidden px-4 py-4 pb-20 sm:px-7 sm:py-5 space-y-5">
        {!address ? (
          <ConnectBanner />
        ) : (
          <>
            <CeloTab
              supabasePoints={supabasePoints}
              celoAmount={celoAmount}
              setCeloAmount={setCeloAmount}
              celoPreview={celoPreview ?? celoSwapPreview}
              swapStatus={celoSwapStatus}
              minSwapPoints={minSwapPoints}
              onSwap={handleCeloSwap}
              onReset={resetCeloSwap}
              onRefresh={fetchSupabasePoints}
            />

            {/* How it works */}
            <div className="rounded-xl border border-[rgba(200,241,53,0.08)] bg-[rgba(200,241,53,0.02)] p-4 space-y-2">
              <p className="font-display text-[10px] uppercase tracking-[0.15em] text-muted">
                How it works
              </p>
              <ul className="space-y-1.5 text-[11px] text-muted/70">
                <li className="flex gap-2">
                  <span className="shrink-0 text-accent">01</span>
                  Watch videos to earn off-chain points
                </li>
                <li className="flex gap-2">
                  <span className="shrink-0 text-accent">02</span>
                  Earn on-chain points via <strong>Earn 10 Points</strong>{" "}
                  button (1h cooldown)
                </li>
                <li className="flex gap-2">
                  <span className="shrink-0 text-accent">03</span>
                  Swap points for <strong>CELO</strong> via oracle signature
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── CELO Tab ───────────────────────────────────────────────────────────────────

function CeloTab({
  supabasePoints,
  celoAmount,
  setCeloAmount,
  celoPreview,
  swapStatus,
  minSwapPoints,
  onSwap,
  onReset,
  onRefresh,
}: {
  supabasePoints: number;
  celoAmount: string;
  setCeloAmount: (v: string) => void;
  celoPreview: string | null;
  swapStatus: string;
  minSwapPoints: number;
  onSwap: () => void;
  onReset: () => void;
  onRefresh: () => void;
}) {
  const parsedAmount = Number(celoAmount);
  const isBelowMin = parsedAmount > 0 && parsedAmount < minSwapPoints;
  const isAboveBalance = parsedAmount > supabasePoints;
  const isValid = parsedAmount >= minSwapPoints && parsedAmount <= supabasePoints;
  const isPending =
    swapStatus === "fetching" ||
    swapStatus === "pending" ||
    swapStatus === "confirming";

  const presetAmounts = [500, 1000, 2500, 5000];

  return (
    <>
      <BalanceCard
        label="Pending Points"
        value={String(supabasePoints)}
        unit="pts"
        accent
        onRefresh={onRefresh}
      />

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
                  : !parsedAmount
                    ? "Enter Points Amount"
                    : isBelowMin
                      ? `Minimum ${minSwapPoints.toLocaleString()} pts`
                      : isAboveBalance
                        ? "Insufficient Points"
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
  onRefresh,
}: {
  label: string;
  value: string | null;
  unit: string;
  accent: boolean;
  dim?: boolean;
  dimNote?: string;
  onRefresh?: () => void;
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
      <div className="flex items-center justify-between">
        <p className="font-display text-[9px] uppercase tracking-[0.15em] text-muted">
          {label}
        </p>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="flex items-center gap-1 text-[9px] text-muted/50 hover:text-accent transition-colors"
          >
            <RefreshCw size={10} />
            Refresh
          </button>
        )}
      </div>
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
