// ABI for SameloPoints — deployed at NEXT_PUBLIC_POINTS_ADDRESS
// Contract: samelo-contracts/src/SameloPoints.sol

export const POINTS_ABI = [
  // ── State reads ─────────────────────────────────────────────────────────
  {
    type: 'function',
    name: 'POINTS_PER_EARN',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'earnCooldown',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'points',
    inputs: [{ name: 'user', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'lastEarnedAt',
    inputs: [{ name: 'user', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'totalPointsIssued',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getPoints',
    inputs: [{ name: 'user', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'cooldownRemaining',
    inputs: [{ name: 'user', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  // ── Actions ─────────────────────────────────────────────────────────────
  {
    type: 'function',
    name: 'earn',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'creditPoints',
    inputs: [
      { name: 'user', type: 'address', internalType: 'address' },
      { name: 'amount', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'redeem',
    inputs: [{ name: 'pointsAmount', type: 'uint256', internalType: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  // ── Owner setters ────────────────────────────────────────────────────────
  {
    type: 'function',
    name: 'setMeloToken',
    inputs: [{ name: 'token', type: 'address', internalType: 'address' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setMeloRate',
    inputs: [{ name: 'rate', type: 'uint256', internalType: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  // ── Views (new) ──────────────────────────────────────────────────────────
  {
    type: 'function',
    name: 'meloToken',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'meloRate',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'meloForPoints',
    inputs: [{ name: 'pointsAmount', type: 'uint256', internalType: 'uint256' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'totalPointsRedeemed',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  // ── Events ──────────────────────────────────────────────────────────────
  {
    type: 'event',
    name: 'PointsEarned',
    inputs: [
      { name: 'user',      type: 'address', indexed: true,  internalType: 'address' },
      { name: 'amount',    type: 'uint256', indexed: false, internalType: 'uint256' },
      { name: 'newTotal',  type: 'uint256', indexed: false, internalType: 'uint256' },
      { name: 'timestamp', type: 'uint256', indexed: false, internalType: 'uint256' },
    ],
  },
  {
    type: 'event',
    name: 'PointsRedeemed',
    inputs: [
      { name: 'user',         type: 'address', indexed: true,  internalType: 'address' },
      { name: 'pointsAmount', type: 'uint256', indexed: false, internalType: 'uint256' },
      { name: 'meloAmount',   type: 'uint256', indexed: false, internalType: 'uint256' },
    ],
  },
  // ── Errors ───────────────────────────────────────────────────────────────
  {
    type: 'error',
    name: 'CooldownActive',
    inputs: [{ name: 'availableAt', type: 'uint256', internalType: 'uint256' }],
  },
  {
    type: 'error',
    name: 'InsufficientPoints',
    inputs: [],
  },
  {
    type: 'error',
    name: 'MeloNotConfigured',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InsufficientMeloReserve',
    inputs: [],
  },
] as const
