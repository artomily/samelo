export type GiveawayStatus = 'active' | 'ended' | 'drawn' | 'cancelled'

export interface Giveaway {
  id: string
  creator_wallet: string
  title: string
  description: string | null
  prize_melo: number
  prize_description: string | null
  max_entries: number | null
  entry_count: number
  status: GiveawayStatus
  ends_at: string
  winner_wallet: string | null
  drawn_at: string | null
  created_at: string
}

export interface GiveawayEntry {
  id: string
  giveaway_id: string
  wallet: string
  entry_count: number
  entered_at: string
}

export const STATUS_LABELS: Record<GiveawayStatus, string> = {
  active: 'Active',
  ended: 'Ended',
  drawn: 'Winner Drawn',
  cancelled: 'Cancelled',
}

export const STATUS_COLORS: Record<GiveawayStatus, string> = {
  active: '#c8f135',
  ended: '#f1c135',
  drawn: '#60a5fa',
  cancelled: '#f13535',
}

export function isOpen(giveaway: Giveaway): boolean {
  return giveaway.status === 'active' && new Date(giveaway.ends_at) > new Date()
}

export function timeRemaining(giveaway: Giveaway): string {
  const diff = new Date(giveaway.ends_at).getTime() - Date.now()
  if (diff <= 0) return 'Ended'
  const hours = Math.floor(diff / 3_600_000)
  const minutes = Math.floor((diff % 3_600_000) / 60_000)
  if (hours > 24) return `${Math.floor(hours / 24)}d ${hours % 24}h`
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
}

export function winChance(entry: GiveawayEntry, giveaway: Giveaway): number {
  if (giveaway.entry_count === 0) return 0
  return Math.round((entry.entry_count / giveaway.entry_count) * 1000) / 10
}
