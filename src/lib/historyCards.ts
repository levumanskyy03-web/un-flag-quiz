import { useEffect, useState } from 'react'
import type { Lang } from '../i18n/lang'

/** Language-neutral card fields from Wikidata (see scripts/history-cards.cjs). */
export interface HistoryCardMeta {
  /** 's' state, 'x' people / no state. */
  k?: 's' | 'x'
  q?: string
  /** Commons flag file. */
  f?: string
  /** Commons coat-of-arms file. */
  e?: string
  /** Inception / dissolution years. */
  i?: number
  d?: number
  p?: number
  py?: number
  /** Area from Wikidata, km². */
  a?: number
  pre?: string[]
  suc?: string[]
  /** First and last snapshot where the map shows it. */
  y?: [number, number]
}

/** Per-language labels. */
export interface HistoryCardText {
  n?: string
  s?: string
  c?: string
  l?: string
  m?: string
  g?: string
  r?: string
  w?: string
}

export interface HistoryCards {
  meta: Record<string, HistoryCardMeta>
  text: Record<string, HistoryCardText>
}

let metaPromise: Promise<Record<string, HistoryCardMeta>> | null = null
const textPromises = new Map<Lang, Promise<Record<string, HistoryCardText>>>()
const loaded = new Map<Lang, HistoryCards>()

function getJson<T>(url: string): Promise<T> {
  return fetch(url).then((response) => {
    if (!response.ok) throw new Error(url)
    return response.json() as Promise<T>
  })
}

export function loadHistoryCards(lang: Lang): Promise<HistoryCards> {
  const hit = loaded.get(lang)
  if (hit) return Promise.resolve(hit)
  metaPromise ??= getJson<Record<string, HistoryCardMeta>>('/maps/history/cards/index.json').catch(() => ({}))
  let text = textPromises.get(lang)
  if (!text) {
    text = getJson<Record<string, HistoryCardText>>(`/maps/history/cards/${lang}.json`).catch(() => ({}))
    textPromises.set(lang, text)
  }
  return Promise.all([metaPromise, text]).then(([meta, labels]) => {
    const cards = { meta, text: labels }
    loaded.set(lang, cards)
    return cards
  })
}

export function useHistoryCards(lang: Lang, enabled = true): HistoryCards | null {
  const [cards, setCards] = useState<HistoryCards | null>(() => loaded.get(lang) ?? null)
  useEffect(() => {
    if (!enabled) return
    let live = true
    loadHistoryCards(lang).then((next) => {
      if (live) setCards(next)
    })
    return () => {
      live = false
    }
  }, [lang, enabled])
  return cards && cards === loaded.get(lang) ? cards : null
}

export function commonsThumb(file: string, width = 320) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`
}

export function wikipediaUrl(lang: Lang, title: string) {
  return `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`
}
