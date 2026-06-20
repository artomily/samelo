interface TrackEventOptions {
  wallet?: string
  sessionId?: string
  properties?: Record<string, unknown>
}

export async function trackEvent(
  event: string,
  options: TrackEventOptions = {}
): Promise<void> {
  try {
    await fetch('/api/analytics/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event,
        wallet: options.wallet,
        sessionId: options.sessionId,
        properties: options.properties ?? {},
        url: typeof window !== 'undefined' ? window.location.href : undefined,
      }),
    })
  } catch {
    // Analytics should never break the app
  }
}

export async function trackPageView(
  path: string,
  options: { wallet?: string; sessionId?: string; referrer?: string } = {}
): Promise<void> {
  return trackEvent('page_view', {
    ...options,
    properties: { path, referrer: options.referrer },
  })
}

export async function trackVideoPlay(
  videoId: string,
  wallet?: string
): Promise<void> {
  return trackEvent('video_play', { wallet, properties: { videoId } })
}

export async function trackVideoComplete(
  videoId: string,
  wallet?: string,
  durationSeconds?: number
): Promise<void> {
  return trackEvent('video_complete', { wallet, properties: { videoId, durationSeconds } })
}

export async function trackSwap(
  wallet: string,
  pointsAmount: number,
  meloAmount: string
): Promise<void> {
  return trackEvent('swap', { wallet, properties: { pointsAmount, meloAmount } })
}
