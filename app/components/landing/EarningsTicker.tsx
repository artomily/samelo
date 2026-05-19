'use client'

const EARNINGS = [
  { user: '0x3f…a1', amount: '+$0.14 cUSD', video: 'Celo Explained' },
  { user: '0xa7…2d', amount: '+$0.09 cUSD', video: 'Web3 Basics' },
  { user: '0x11…bc', amount: '+$0.22 cUSD', video: 'DeFi 101' },
  { user: '0x55…7e', amount: '+$0.07 cUSD', video: 'MiniPay Demo' },
  { user: '0x8b…f3', amount: '+$0.18 cUSD', video: 'Blockchain Intro' },
  { user: '0x2c…99', amount: '+$0.11 cUSD', video: 'Crypto Wallets' },
]

function TickerRow({ items, reverse }: { items: typeof EARNINGS; reverse?: boolean }) {
  const doubled = [...items, ...items]
  return (
    <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div
        className="flex shrink-0 gap-3"
        style={{
          animation: `ticker${reverse ? '-reverse' : ''} 28s linear infinite`,
        }}
      >
        {doubled.map((item, i) => (
          <div
            key={i}
            className="flex shrink-0 items-center gap-2.5 rounded-xl border border-border bg-surface px-3.5 py-2"
          >
            <span className="text-xs font-medium text-muted">{item.user}</span>
            <span className="text-xs font-semibold text-accent">{item.amount}</span>
            <span className="text-[10px] text-muted/70">• {item.video}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function EarningsTicker() {
  return (
    <section id="earnings" className="py-16">
      <div className="mx-auto mb-8 max-w-4xl px-5 text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-accent">Live earnings</p>
        <h2 className="mt-2 text-2xl font-bold text-primary sm:text-3xl">
          Real people. Real money.
        </h2>
        <p className="mt-2 text-sm text-muted">Watching right now and getting paid.</p>
      </div>

      <div className="flex flex-col gap-3">
        <TickerRow items={EARNINGS} />
        <TickerRow items={[...EARNINGS].reverse()} reverse />
      </div>
    </section>
  )
}
