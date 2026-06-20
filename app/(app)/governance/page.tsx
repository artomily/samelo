import { ProposalList } from '@/components/governance/ProposalList'

export default function GovernancePage() {
  return (
    <main className="min-h-screen bg-[#030303] text-white px-4 py-8 max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="font-display text-2xl text-[#c8f135]">Governance</h1>
        <p className="text-sm text-white/40 mt-1">
          Vote on proposals that shape the Samelo protocol
        </p>
      </div>
      <ProposalList />
    </main>
  )
}
