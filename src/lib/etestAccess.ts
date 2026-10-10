const ETEST_NAMES = new Set(['levum', 'levumm', 'root'])

export function canPlayEtest(name: string | null | undefined) {
  if (!name) return false
  return ETEST_NAMES.has(name.trim().toLocaleLowerCase())
}
