export interface SharePayload {
  title: string
  text: string
  url: string
}

/** Use Web Share API if available, fallback to clipboard */
export async function shareOrCopy(payload: SharePayload): Promise<'shared' | 'copied' | 'failed'> {
  if (navigator.share) {
    try {
      await navigator.share(payload)
      return 'shared'
    } catch {
      // User cancelled or share failed
    }
  }

  try {
    await navigator.clipboard.writeText(payload.url)
    return 'copied'
  } catch {
    return 'failed'
  }
}

/** Check if native share is available */
export function canNativeShare(): boolean {
  return typeof navigator !== 'undefined' && 'share' in navigator
}
