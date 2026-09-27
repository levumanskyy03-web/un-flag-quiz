import {
  MATH_DIGITS,
  type MathDigit,
  type MathDigitMilestone,
} from '../../data/mathDigits'

export const DIGIT_GROUP = 10
export const DIGITS_PER_ROW = 50

export const MATH_DIGIT_PREFIXES: Record<(typeof MATH_DIGITS)[number]['id'], string> = {
  pi: '1415926535',
  phi: '6180339887',
  e: '7182818284',
  sqrt2: '4142135623',
}

export function mathDigitPrefixesOk(): boolean {
  return MATH_DIGITS.every((item) => {
    const prefix = MATH_DIGIT_PREFIXES[item.id]
    return item.digits.length === 1000 && item.digits.startsWith(prefix) && /^\d+$/.test(item.digits)
  })
}

export function digitTruth(item: MathDigit, milestone: MathDigitMilestone): string {
  return item.digits.slice(0, milestone)
}

/** Leading digits of `typed` that match `truth`. */
export function matchedDigits(typed: string, truth: string): number {
  const n = Math.min(typed.length, truth.length)
  let i = 0
  while (i < n && typed[i] === truth[i]) i += 1
  return i
}

export function digitRunStatus(typed: string, truth: string): 'typing' | 'miss' | 'done' {
  const matched = matchedDigits(typed, truth)
  if (matched < typed.length) return 'miss'
  if (truth.length > 0 && matched >= truth.length) return 'done'
  return 'typing'
}

/** Drop a pasted integer part (`3.` / `3,`) and keep only decimal digits. */
export function normalizeTypedDigits(raw: string, head: string): string {
  const integer = head.endsWith('.') ? head.slice(0, -1) : head
  let text = raw.replace(/\s+/g, '')
  if (integer && (text.startsWith(`${integer}.`) || text.startsWith(`${integer},`))) {
    text = text.slice(integer.length + 1)
  }
  return text.replace(/\D/g, '')
}

export function digitGroupCount(length: number): number {
  if (length <= 0) return 0
  return Math.ceil(length / DIGIT_GROUP)
}

export function digitGroupAt(digits: string, index: number): string {
  return digits.slice(index * DIGIT_GROUP, index * DIGIT_GROUP + DIGIT_GROUP)
}
