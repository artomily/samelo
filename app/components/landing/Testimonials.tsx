const TESTIMONIALS = [
  {
    initials: 'AK',
    name: 'Amara K.',
    location: 'Lagos, Nigeria',
    quote:
      'I earn cUSD every morning before work. It takes five minutes and the money lands in MiniPay the same day. This is the first Web3 app that actually pays.',
  },
  {
    initials: 'RD',
    name: 'Rizal D.',
    location: 'Jakarta, Indonesia',
    quote:
      'The points system keeps me coming back. I watch, I collect, I deploy — it feels like a game but the rewards are real stablecoins.',
  },
  {
    initials: 'FM',
    name: 'Fatima M.',
    location: 'Nairobi, Kenya',
    quote:
      'Finally a Web3 app that doesn\'t need me to understand crypto. I just open MiniPay, tap watch, and see my balance go up.',
  },
]

export function Testimonials() {
  return (
    <section className="border-b border-border px-7 py-13">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-accent">Testimonials</p>
          <h2 className="mt-2 text-2xl font-bold text-primary sm:text-3xl">
            Real people, real earnings
          </h2>
        </div>

        {/* 3-col grid */}
        <div className="grid gap-4 sm:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5"
            >
              <p className="flex-1 text-sm italic leading-relaxed text-muted">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/12 text-[11px] font-bold text-accent">
                  {t.initials}
                </div>
                <div>
                  <p className="text-xs font-semibold text-primary">{t.name}</p>
                  <p className="text-[11px] text-muted">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
