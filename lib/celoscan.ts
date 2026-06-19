const CELOSCAN_BASE = 'https://celoscan.io'

/** Build a Celoscan transaction link */
export function celoscanTx(txHash: string): string {
  return `${CELOSCAN_BASE}/tx/${txHash}`
}

/** Build a Celoscan address link */
export function celoscanAddress(address: string): string {
  return `${CELOSCAN_BASE}/address/${address}`
}

/** Build a Celoscan token link for an ERC-20 contract */
export function celoscanToken(contractAddress: string): string {
  return `${CELOSCAN_BASE}/token/${contractAddress}`
}

/** Build Celoscan link to a specific token holder */
export function celoscanTokenHolder(contractAddress: string, holderAddress: string): string {
  return `${CELOSCAN_BASE}/token/${contractAddress}?a=${holderAddress}`
}
