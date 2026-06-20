import { createPublicClient, http } from 'viem'
import { CELO_MAINNET, CELO_TESTNET } from './chains'

const mainnetClient = createPublicClient({
  chain: CELO_MAINNET as Parameters<typeof createPublicClient>[0]['chain'],
  transport: http('https://forno.celo.org'),
})

const testnetClient = createPublicClient({
  chain: CELO_TESTNET as Parameters<typeof createPublicClient>[0]['chain'],
  transport: http('https://alfajores-forno.celo-testnet.org'),
})

export function getPublicClient(chainId: number) {
  return chainId === CELO_TESTNET.id ? testnetClient : mainnetClient
}

export async function getCurrentBlock(chainId = 42220): Promise<bigint> {
  const client = getPublicClient(chainId)
  return client.getBlockNumber()
}

export async function getGasPrice(chainId = 42220): Promise<bigint> {
  const client = getPublicClient(chainId)
  return client.getGasPrice()
}
