// ABI for SameloTreasury (full) — deployed at NEXT_PUBLIC_TREASURY_ADDRESS
// Contract: samelo-contracts/src/SameloTreasury.sol

export const TREASURY_ABI = [
  // ── State reads ────────────────────────────────────────────────────────────
  {
    type: 'function',
    name: 'celoToken',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'oracle',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'rewardDistributor',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'swapContract',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'rewardPoolBalance',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'reserveBalance',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'totalDeposited',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'totalPaidOut',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'reserveRatio',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'usedNonces',
    inputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'paused',
    inputs: [],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getRewardPoolBalance',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getReserveBalance',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getTotalStats',
    inputs: [],
    outputs: [
      { name: 'deposited', type: 'uint256', internalType: 'uint256' },
      { name: 'paidOut', type: 'uint256', internalType: 'uint256' },
      { name: 'reserve', type: 'uint256', internalType: 'uint256' },
      { name: 'pool', type: 'uint256', internalType: 'uint256' },
    ],
    stateMutability: 'view',
  },
  // ── Public entry point: user calls with oracle sig ─────────────────────────
  {
    type: 'function',
    name: 'executeRewardAction',
    inputs: [
      { name: 'user', type: 'address', internalType: 'address' },
      { name: 'amount', type: 'uint256', internalType: 'uint256' },
      { name: 'actionType', type: 'uint8', internalType: 'uint8' },
      { name: 'nonce', type: 'bytes32', internalType: 'bytes32' },
      { name: 'signature', type: 'bytes', internalType: 'bytes' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  // ── Role-gated writes ──────────────────────────────────────────────────────
  {
    type: 'function',
    name: 'depositRevenue',
    inputs: [{ name: 'amount', type: 'uint256', internalType: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'releaseReward',
    inputs: [
      { name: 'user', type: 'address', internalType: 'address' },
      { name: 'amount', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'releaseForSwap',
    inputs: [
      { name: 'recipient', type: 'address', internalType: 'address' },
      { name: 'amount', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  // ── Admin controls ─────────────────────────────────────────────────────────
  {
    type: 'function',
    name: 'setReserveRatio',
    inputs: [{ name: 'bps', type: 'uint256', internalType: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setOracle',
    inputs: [{ name: 'newOracle', type: 'address', internalType: 'address' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setRewardDistributor',
    inputs: [{ name: 'dist', type: 'address', internalType: 'address' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setSwapContract',
    inputs: [{ name: 'swap', type: 'address', internalType: 'address' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'withdrawReserve',
    inputs: [
      { name: 'to', type: 'address', internalType: 'address' },
      { name: 'amount', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'pause',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'unpause',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  // ── Role constants ─────────────────────────────────────────────────────────
  {
    type: 'function',
    name: 'ORACLE_ROLE',
    inputs: [],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'DISTRIBUTOR_ROLE',
    inputs: [],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'SWAP_ROLE',
    inputs: [],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'view',
  },
  // ── Events ─────────────────────────────────────────────────────────────────
  {
    type: 'event',
    name: 'RevenueDeposited',
    inputs: [
      { name: 'depositor', type: 'address', indexed: true },
      { name: 'totalAmount', type: 'uint256', indexed: false },
      { name: 'toPool', type: 'uint256', indexed: false },
      { name: 'toReserve', type: 'uint256', indexed: false },
      { name: 'timestamp', type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'RewardActionExecuted',
    inputs: [
      { name: 'user', type: 'address', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false },
      { name: 'actionType', type: 'uint8', indexed: false },
      { name: 'nonce', type: 'bytes32', indexed: false },
      { name: 'timestamp', type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'RewardReleased',
    inputs: [
      { name: 'user', type: 'address', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'SwapFundsReleased',
    inputs: [
      { name: 'recipient', type: 'address', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'ReserveWithdrawn',
    inputs: [
      { name: 'to', type: 'address', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'ReserveRatioUpdated',
    inputs: [
      { name: 'oldRatio', type: 'uint256', indexed: false },
      { name: 'newRatio', type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'OracleUpdated',
    inputs: [{ name: 'newOracle', type: 'address', indexed: false }],
  },
  {
    type: 'event',
    name: 'RewardDistributorUpdated',
    inputs: [{ name: 'newDistributor', type: 'address', indexed: false }],
  },
  {
    type: 'event',
    name: 'SwapContractUpdated',
    inputs: [{ name: 'newSwap', type: 'address', indexed: false }],
  },
] as const
