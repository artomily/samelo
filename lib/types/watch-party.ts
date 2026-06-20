export type WatchPartyStatus = 'lobby' | 'live' | 'ended'

export interface WatchParty {
  id: string
  host_wallet: string
  video_id: string
  title: string
  status: WatchPartyStatus
  max_participants: number
  playback_position_seconds: number
  started_at: string | null
  ended_at: string | null
  created_at: string
}

export interface WatchPartyParticipant {
  id: string
  party_id: string
  wallet: string
  joined_at: string
  left_at: string | null
}

export const STATUS_LABELS: Record<WatchPartyStatus, string> = {
  lobby: 'In Lobby',
  live: 'Live',
  ended: 'Ended',
}

export const STATUS_COLORS: Record<WatchPartyStatus, string> = {
  lobby: '#fbcc5c',
  live: '#c8f135',
  ended: '#6b7280',
}

export function isHost(party: WatchParty, wallet: string): boolean {
  return party.host_wallet.toLowerCase() === wallet.toLowerCase()
}

export function isAtCapacity(party: WatchParty, participantCount: number): boolean {
  return participantCount >= party.max_participants
}
