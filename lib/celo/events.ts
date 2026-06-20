export const SAMELO_POINTS_EVENTS = {
  PointsEarned: 'PointsEarned',
  PointsCredited: 'PointsCredited',
  PointsRedeemed: 'PointsRedeemed',
} as const

export const SAMELO_SWAP_EVENTS = {
  Swapped: 'Swapped',
  OracleUpdated: 'OracleUpdated',
  RateLimitsUpdated: 'RateLimitsUpdated',
} as const

export const SAMELO_TREASURY_EVENTS = {
  Deposited: 'Deposited',
  Distributed: 'Distributed',
  RatioUpdated: 'RatioUpdated',
} as const

export const POINTS_EARNED_ABI_EVENT = {
  name: 'PointsEarned',
  type: 'event',
  inputs: [
    { name: 'user', type: 'address', indexed: true },
    { name: 'amount', type: 'uint256', indexed: false },
    { name: 'total', type: 'uint256', indexed: false },
  ],
} as const

export const POINTS_REDEEMED_ABI_EVENT = {
  name: 'PointsRedeemed',
  type: 'event',
  inputs: [
    { name: 'user', type: 'address', indexed: true },
    { name: 'pointsAmount', type: 'uint256', indexed: false },
    { name: 'meloAmount', type: 'uint256', indexed: false },
  ],
} as const
