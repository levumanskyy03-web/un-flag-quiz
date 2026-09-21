export const STATE_MINISTRY_MAX = 20
export const STATE_SERVANT_BASE = 5
export const STATE_SERVANT_MAX = STATE_SERVANT_BASE + STATE_MINISTRY_MAX
export const STATE_STAMP_TOKENS = 8
export const STATE_CONVERT_DAY = 4
export const STATE_IDLE_DAY_CAP = 18
export const STATE_SERVANT_RATE = 0.006
export const STATE_ECONOMY_RATE = 0.12
export const STATE_TRADE_TOKENS = 1
export const STATE_ADMIN_IDLE_CAP = 4
export const STATE_ROUND_KNOWLEDGE = 16
export const STATE_EDU_KNOWLEDGE = 8
export const STATE_FOREIGN_TOKENS = 1
export const STATE_INFRA_MS = 1_500
export const STATE_ROUND_SIZE = 8

export type StateMinistry = 'education' | 'infra' | 'foreign' | 'economy' | 'trade' | 'administration'

export function stateMinistryCost(kind: StateMinistry, level: number) {
  const next = Math.max(0, Math.min(STATE_MINISTRY_MAX - 1, level))
  const base = kind === 'education' ? 40 : 12
  const growth = kind === 'education' ? 1.25 : 1.22
  return Math.round(base * growth ** next)
}

export function stateServantCap(administrationLevel: number) {
  return STATE_SERVANT_BASE + Math.max(0, administrationLevel)
}

export function stateConvertCap(administrationLevel: number) {
  return STATE_CONVERT_DAY + Math.floor(Math.max(0, administrationLevel) / 2)
}

export function stateIdleCap(administrationLevel: number) {
  return STATE_IDLE_DAY_CAP + Math.max(0, administrationLevel) * STATE_ADMIN_IDLE_CAP
}

export function stateStampTokens(tradeLevel: number) {
  return STATE_STAMP_TOKENS + Math.max(0, tradeLevel) * STATE_TRADE_TOKENS
}
