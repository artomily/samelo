import { createPublicClient, http, keccak256, encodePacked, recoverAddress, type Hex } from 'viem'
import { CELO_MAINNET } from './chains'

export interface OracleSignaturePayload {
  user: Hex
  points: bigint
  nonce: bigint
  contractAddress: Hex
  chainId: number
}

export function buildOracleMessage(payload: OracleSignaturePayload): Hex {
  return keccak256(
    encodePacked(
      ['address', 'uint256', 'uint256', 'address', 'uint256'],
      [payload.user, payload.points, payload.nonce, payload.contractAddress, BigInt(payload.chainId)]
    )
  )
}

export async function verifyOracleSignature(
  payload: OracleSignaturePayload,
  signature: Hex,
  expectedSigner: Hex
): Promise<boolean> {
  try {
    const messageHash = buildOracleMessage(payload)
    const recovered = await recoverAddress({ hash: messageHash, signature })
    return recovered.toLowerCase() === expectedSigner.toLowerCase()
  } catch {
    return false
  }
}

export function createCeloClient() {
  return createPublicClient({
    chain: CELO_MAINNET as Parameters<typeof createPublicClient>[0]['chain'],
    transport: http('https://forno.celo.org'),
  })
}
