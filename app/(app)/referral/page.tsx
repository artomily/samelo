'use client'

import { useAccount } from 'wagmi'
import { ReferralCodeCard } from '@/components/referral/ReferralCodeCard'
import { ApplyReferralForm } from '@/components/referral/ApplyReferralForm'
import { ReferralStats } from '@/components/referral/ReferralStats'

export default function ReferralPage() {
  const { address } = useAccount()

  return (
    <main className="max-w-xl mx-auto px-4 py-8 space-y-6">
      <h1
        className="text-2xl font-bold tracking-wider uppercase"
        style={{ fontFamily: 'Orbitron, sans-serif', color: '#c8f135' }}
      >
        Refer &amp; Earn
      </h1>

      {!address ? (
        <p className="text-white/50">Connect your wallet to access your referral code.</p>
      ) : (
        <>
          <ReferralCodeCard wallet={address} />
          <ReferralStats wallet={address} />
          <ApplyReferralForm wallet={address} />
        </>
      )}
    </main>
  )
}
