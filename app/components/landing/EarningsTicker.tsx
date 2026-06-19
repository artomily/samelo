'use client'

const EARNINGS = [
  { user: '0x3f…a1', amount: '+140 pts', video: 'Celo Explained' },
  { user: '0xa7…2d', amount: '+90 pts', video: 'Web3 Basics' },
  { user: '0x11…bc', amount: '+220 pts', video: 'DeFi 101' },
  { user: '0x55…7e', amount: '+70 pts', video: 'MiniPay Demo' },
  { user: '0x8b…f3', amount: '+180 pts', video: 'Blockchain Intro' },
  { user: '0x2c…99', amount: '+110 pts', video: 'Crypto Wallets' },
  { user: '0xd9…41', amount: '+50 pts', video: 'NFT Crash Course' },
  { user: '0x7e…c2', amount: '+200 pts', video: 'Layer 2 Deep Dive' },
]

function TickerRow({ items, reverse }: { items: typeof EARNINGS; reverse?: boolean }) {
  const doubled = [...items, ...items]
  return (
    <div
      className="flex overflow-hidden"
      style={{
        maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
      }}
    >
      <div
        className="flex shrink-0 gap-3"
        style={{ animation: `ticker${reverse ? '-reverse' : ''} 28s linear infinite` }}
      >
        {doubled.map((item, i) => (
          <div
            key={i}
            className="flex shrink-0 items-center gap-2.5 rounded-xl border border-[rgba(200,241,53,0.15)] bg-[rgba(200,241,53,0.04)] px-4 py-2.5"
            style={{ boxShadow: '0 0 12px rgba(200,241,53,0.04)' }}
          >
            <span className="font-display text-[9px] font-bold uppercase tracking-widest text-muted">{item.user}</span>
            <span
              className="font-display text-[11px] font-black text-accent"
              style={{ textShadow: '0 0 8px rgba(200,241,53,0.6)' }}
            >
              {item.amount}
            </span>
            <span className="text-[10px] text-muted/60">· {item.video}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function EarningsTicker() {
  return (
    <section id="earnings" className="relative py-16 overflow-hidden">
      {/* Subtle glow band */}
      <div
        className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2"
        style={{ background: 'linear-gradient(to right, transparent, rgba(200,241,53,0.15), transparent)' }}
      />

      <div className="mx-auto mb-8 max-w-4xl px-5 text-center">
        <p className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-accent"
          style={{ textShadow: '0 0 12px rgba(200,241,53,0.4)' }}
        >
          Live transmissions
        </p>
        <h2 className="mt-2 font-display text-2xl font-black tracking-tight text-primary sm:text-3xl">
          Real explorers. Real rewards.
        </h2>
        <p className="mt-2 text-sm text-muted">Broadcasting across the network right now.</p>
      </div>

      <div className="flex flex-col gap-3">
        <TickerRow items={EARNINGS} />
        <TickerRow items={[...EARNINGS].reverse()} reverse />
      </div>
    </section>
  )
}
