import type { ContractFunctionParameters } from 'viem'
import { getPublicClient } from './rpc'

export async function multicall<T>(
  calls: ContractFunctionParameters[],
  chainId = 42220
): Promise<T[]> {
  const client = getPublicClient(chainId)
  const results = await client.multicall({ contracts: calls as never[] })
  return results.map(r => (r.status === 'success' ? r.result : null)) as T[]
}

export async function batchReadPoints(
  pointsContract: `0x${string}`,
  wallets: `0x${string}`[],
  chainId = 42220
): Promise<bigint[]> {
  const POINTS_ABI = [
    { name: 'points', type: 'function', inputs: [{ name: 'user', type: 'address' }], outputs: [{ type: 'uint256' }], stateMutability: 'view' },
  ] as const

  const calls = wallets.map(wallet => ({
    address: pointsContract,
    abi: POINTS_ABI,
    functionName: 'points' as const,
    args: [wallet] as [`0x${string}`],
  }))

  return multicall<bigint>(calls, chainId)
}
