export const NAME_CHANGE_MS = 30 * 24 * 60 * 60 * 1000

export function isNameCooldown(nameChangedAt?: number): boolean {
  if (!nameChangedAt) return false
  return Date.now() - nameChangedAt < NAME_CHANGE_MS
}

export function nextNameChangeAt(nameChangedAt?: number): number | null {
  if (!nameChangedAt) return null
  const next = nameChangedAt + NAME_CHANGE_MS
  return next > Date.now() ? next : null
}
