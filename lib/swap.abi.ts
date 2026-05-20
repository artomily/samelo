// ABI for SameloSwap — deployed at NEXT_PUBLIC_SWAP_ADDRESS
// Contract: samelo-contracts/src/SameloSwap.sol

export const SWAP_ABI = [
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
    name: 'treasury',
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
    name: 'pointsToCELORate',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'minSwapPoints',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'maxSwapPoints',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'swapCooldown',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'lastSwapTime',
    inputs: [{ name: '', type: 'address', internalType: 'address' }],
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
    name: 'previewSwap',
    inputs: [{ name: 'pointAmount', type: 'uint256', internalType: 'uint256' }],
    outputs: [{ name: 'celoAmount', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  // ── Core swap — user calls this ────────────────────────────────────────────
  {
    type: 'function',
    name: 'swapPoints',
    inputs: [
      { name: 'pointAmount', type: 'uint256', internalType: 'uint256' },
      { name: 'nonce', type: 'bytes32', internalType: 'bytes32' },
      { name: 'signature', type: 'bytes', internalType: 'bytes' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  // ── Admin controls ─────────────────────────────────────────────────────────
  {
    type: 'function',
    name: 'setPointsToCELORate',
    inputs: [{ name: 'newRate', type: 'uint256', internalType: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setSwapLimits',
    inputs: [
      { name: '_min', type: 'uint256', internalType: 'uint256' },
      { name: '_max', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setSwapCooldown',
    inputs: [{ name: 'seconds_', type: 'uint256', internalType: 'uint256' }],
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
    name: 'setTreasury',
    inputs: [{ name: 'newTreasury', type: 'address', internalType: 'address' }],
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
  // ── Events ─────────────────────────────────────────────────────────────────
  {
    type: 'event',
    name: 'PointsSwapped',
    inputs: [
      { name: 'user', type: 'address', indexed: true },
      { name: 'pointsConsumed', type: 'uint256', indexed: false },
      { name: 'celoReceived', type: 'uint256', indexed: false },
      { name: 'nonce', type: 'bytes32', indexed: false },
      { name: 'timestamp', type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'RateUpdated',
    inputs: [
      { name: 'oldRate', type: 'uint256', indexed: false },
      { name: 'newRate', type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'SwapLimitsUpdated',
    inputs: [
      { name: 'min', type: 'uint256', indexed: false },
      { name: 'max', type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'CooldownUpdated',
    inputs: [{ name: 'newCooldown', type: 'uint256', indexed: false }],
  },
  {
    type: 'event',
    name: 'OracleUpdated',
    inputs: [{ name: 'newOracle', type: 'address', indexed: false }],
  },
  {
    type: 'event',
    name: 'TreasuryUpdated',
    inputs: [{ name: 'newTreasury', type: 'address', indexed: false }],
  },
] as const
