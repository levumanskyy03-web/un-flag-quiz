import { isMixKind, isQuizMode, worldOfMode, type MixKind, type QuizMode, type QuizWorld } from './quiz'
import { siteUrl } from './site'

export type PlayHash = {
  mode: QuizMode
  mix: MixKind | null
  mixModes: QuizMode[]
}

export function playShareUrl(mode: QuizMode, mix: MixKind | null = null, mixModes: readonly QuizMode[] = []): string {
  return `${siteUrl(`/${worldOfMode(mode)}`)}#${encodePlayHash({ mode, mix, mixModes: [...mixModes] })}`
}

export function encodePlayHash(value: PlayHash): string {
  if (value.mix === 'custom' && value.mixModes.length > 0) {
    return `custom=${value.mixModes.filter(isQuizMode).join(',')}`
  }
  if (value.mix === 'easy' || value.mix === 'hard') return `mix=${value.mix}`
  return value.mode
}

export function parsePlayHash(hash: string): PlayHash | null {
  const raw = decodeURIComponent(hash.replace(/^#/, '').trim())
  if (!raw) return null
  if (raw.startsWith('mix=')) {
    const mix = raw.slice(4)
    if (!isMixKind(mix) || mix === 'custom') return null
    return { mode: 'flagToName', mix, mixModes: [] }
  }
  if (raw.startsWith('custom=')) {
    const mixModes = raw
      .slice(7)
      .split(',')
      .map((item) => item.trim())
      .filter(isQuizMode)
    if (mixModes.length === 0) return null
    return { mode: mixModes[0], mix: 'custom', mixModes }
  }
  if (isQuizMode(raw)) return { mode: raw, mix: null, mixModes: [] }
  return null
}

export function playHashFitsWorld(parsed: PlayHash, world: QuizWorld): boolean {
  if (parsed.mix === 'custom') {
    return parsed.mixModes.length > 0 && parsed.mixModes.every((mode) => worldOfMode(mode) === world)
  }
  if (parsed.mix) return true
  return worldOfMode(parsed.mode) === world
}
