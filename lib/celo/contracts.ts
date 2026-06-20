export const CONTRACT_ADDRESSES = {
  mainnet: {
    meloToken: process.env.NEXT_PUBLIC_MELO_TOKEN_ADDRESS as `0x${string}`,
    sameloPoints: process.env.NEXT_PUBLIC_SAMELO_POINTS_ADDRESS as `0x${string}`,
    sameloSwap: process.env.NEXT_PUBLIC_SAMELO_SWAP_ADDRESS as `0x${string}`,
    sameloTreasury: process.env.NEXT_PUBLIC_SAMELO_TREASURY_ADDRESS as `0x${string}`,
  },
  testnet: {
    meloToken: process.env.NEXT_PUBLIC_MELO_TOKEN_ADDRESS_TESTNET as `0x${string}`,
    sameloPoints: process.env.NEXT_PUBLIC_SAMELO_POINTS_ADDRESS_TESTNET as `0x${string}`,
    sameloSwap: process.env.NEXT_PUBLIC_SAMELO_SWAP_ADDRESS_TESTNET as `0x${string}`,
    sameloTreasury: process.env.NEXT_PUBLIC_SAMELO_TREASURY_ADDRESS_TESTNET as `0x${string}`,
  },
} as const

export function getContracts(chainId: number) {
  return chainId === 44787 ? CONTRACT_ADDRESSES.testnet : CONTRACT_ADDRESSES.mainnet
}

export const MELO_TOKEN_ABI = [
  { name: 'balanceOf', type: 'function', inputs: [{ name: 'account', type: 'address' }], outputs: [{ type: 'uint256' }], stateMutability: 'view' },
  { name: 'transfer', type: 'function', inputs: [{ name: 'to', type: 'address' }, { name: 'amount', type: 'uint256' }], outputs: [{ type: 'bool' }], stateMutability: 'nonpayable' },
  { name: 'approve', type: 'function', inputs: [{ name: 'spender', type: 'address' }, { name: 'amount', type: 'uint256' }], outputs: [{ type: 'bool' }], stateMutability: 'nonpayable' },
  { name: 'allowance', type: 'function', inputs: [{ name: 'owner', type: 'address' }, { name: 'spender', type: 'address' }], outputs: [{ type: 'uint256' }], stateMutability: 'view' },
  { name: 'totalSupply', type: 'function', inputs: [], outputs: [{ type: 'uint256' }], stateMutability: 'view' },
] as const

export const SAMELO_POINTS_ABI = [
  { name: 'points', type: 'function', inputs: [{ name: 'user', type: 'address' }], outputs: [{ type: 'uint256' }], stateMutability: 'view' },
  { name: 'earn', type: 'function', inputs: [], outputs: [], stateMutability: 'nonpayable' },
  { name: 'redeem', type: 'function', inputs: [{ name: 'pointsAmount', type: 'uint256' }], outputs: [], stateMutability: 'nonpayable' },
  { name: 'totalPointsIssued', type: 'function', inputs: [], outputs: [{ type: 'uint256' }], stateMutability: 'view' },
  { name: 'totalPointsRedeemed', type: 'function', inputs: [], outputs: [{ type: 'uint256' }], stateMutability: 'view' },
] as const
