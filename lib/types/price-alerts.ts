export type AlertCondition = 'above' | 'below'

export interface PriceAlert {
  id: string
  wallet: string
  token_symbol: string
  condition: AlertCondition
  target_price: number
  is_active: boolean
  triggered_at: string | null
  created_at: string
}

export interface PriceAlertHistory {
  id: string
  alert_id: string
  triggered_price: number
  triggered_at: string
}

export const CONDITION_LABELS: Record<AlertCondition, string> = {
  above: 'Price goes above',
  below: 'Price goes below',
}

export function alertDescription(alert: PriceAlert): string {
  return `${CONDITION_LABELS[alert.condition]} $${alert.target_price.toFixed(4)} ${alert.token_symbol}`
}

export function isTriggered(alert: PriceAlert): boolean {
  return alert.triggered_at !== null
}

export function shouldTrigger(alert: PriceAlert, currentPrice: number): boolean {
  if (!alert.is_active || isTriggered(alert)) return false
  return alert.condition === 'above'
    ? currentPrice >= alert.target_price
    : currentPrice <= alert.target_price
}
