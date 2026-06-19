export interface TreasuryMetrics {
  totalWatches: number
  totalWallets: number
  totalPointsDistributed: number
  totalPointsBurned: number
  totalMeloMinted: string
  claimedPoints: number
  unclaimedPoints: number
  swapCount: number
  funnel: {
    web2Events: number
    pointsIssued: number
    pointsBurned: number
    meloOnChain: string
  }
}

export interface FlowDay {
  date: string
  watches: number
  pointsIssued: number
  swaps: number
  meloMinted: string
}

export interface FlowTimeline {
  timeline: FlowDay[]
  days: number
}

export interface RecentSwap {
  wallet: string
  pointsBurned: number
  meloReceived: string
  txHash: string | null
  createdAt: string
}
