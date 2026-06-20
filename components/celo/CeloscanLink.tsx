'use client'
import { useChainId } from 'wagmi'
import { getCeloScanUrl } from '@/lib/celo/chains'
import { getExplorerLink } from '@/lib/celo/wallet'

interface CeloscanTxLinkProps {
  hash: string
  children?: React.ReactNode
  className?: string
}

export function CeloscanTxLink({ hash, children, className = '' }: CeloscanTxLinkProps) {
  const chainId = useChainId()
  const url = getCeloScanUrl(hash, chainId)

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`text-[#c8f135] underline hover:opacity-80 transition-opacity ${className}`}
    >
      {children ?? `${hash.slice(0, 10)}…`}
    </a>
  )
}

interface CeloscanAddressLinkProps {
  address: string
  children?: React.ReactNode
  className?: string
}

export function CeloscanAddressLink({ address, children, className = '' }: CeloscanAddressLinkProps) {
  const chainId = useChainId()
  const url = getExplorerLink(address, chainId)

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`text-[#c8f135] underline hover:opacity-80 transition-opacity ${className}`}
    >
      {children ?? `${address.slice(0, 6)}…${address.slice(-4)}`}
    </a>
  )
}
