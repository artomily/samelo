export const CELO_MAINNET = {
  id: 42220,
  name: 'Celo',
  network: 'celo',
  nativeCurrency: { name: 'CELO', symbol: 'CELO', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://forno.celo.org'] },
    public: { http: ['https://forno.celo.org'] },
  },
  blockExplorers: {
    default: { name: 'Celoscan', url: 'https://celoscan.io' },
  },
  contracts: {
    multicall3: { address: '0xcA11bde05977b3631167028862bE2a173976CA11' as const },
  },
} as const

export const CELO_TESTNET = {
  id: 44787,
  name: 'Celo Alfajores',
  network: 'celo-alfajores',
  nativeCurrency: { name: 'CELO', symbol: 'CELO', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://alfajores-forno.celo-testnet.org'] },
    public: { http: ['https://alfajores-forno.celo-testnet.org'] },
  },
  blockExplorers: {
    default: { name: 'Celoscan Alfajores', url: 'https://alfajores.celoscan.io' },
  },
} as const

export const CELO_TOKEN_ADDRESS = '0x471EcE3750Da237f93B8E339c536989b8978a438' as const
export const cUSD_ADDRESS = '0x765DE816845861e75A25fCA122bb6898B8B1282a' as const
export const cEUR_ADDRESS = '0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73' as const

export function isCeloNetwork(chainId: number): boolean {
  return chainId === CELO_MAINNET.id || chainId === CELO_TESTNET.id
}

export function getCeloScanUrl(txHash: string, chainId = 42220): string {
  const base = chainId === 44787 ? 'https://alfajores.celoscan.io' : 'https://celoscan.io'
  return `${base}/tx/${txHash}`
}
