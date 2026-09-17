import { track } from '@vercel/analytics'

type FunnelEvent = 'register' | 'duel_start' | 'duel_end' | 'today'

export function trackFunnel(name: FunnelEvent, extras?: Record<string, string | number | boolean>) {
  try {
    track(name, extras)
  } catch {
    /* analytics must never break play */
  }
}
