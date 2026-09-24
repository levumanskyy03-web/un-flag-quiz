export type SquadPos = 'gk' | 'df' | 'mf' | 'fw'

export interface ClubSquadStint {
  name: string
  wiki?: string
  id?: string
  pos?: SquadPos
  from?: number
  to?: number
}

export interface ClubSquadFile {
  clubId: string
  qid?: string
  stints: ClubSquadStint[]
}

export const GREAT_CLUBS_UNIQUE_PLAYER_COUNT = 25_328

function normalizedPlayerKey(value: string): string {
  return value.normalize('NFKC').toLocaleLowerCase('en').replaceAll('_', ' ').replace(/\s+/g, ' ').trim()
}

export function clubSquadStats(stints: readonly ClubSquadStint[]): {
  uniquePlayers: number
  from: number | null
  to: number | null
} {
  const aliases = new Map<string, string>()
  for (const stint of stints) {
    if (!stint.id) continue
    const canonical = `id:${stint.id}`
    if (stint.wiki) aliases.set(`wiki:${normalizedPlayerKey(stint.wiki)}`, canonical)
    aliases.set(`name:${normalizedPlayerKey(stint.name)}`, canonical)
  }

  const players = new Set<string>()
  const years: number[] = []
  for (const stint of stints) {
    const wikiKey = stint.wiki ? `wiki:${normalizedPlayerKey(stint.wiki)}` : null
    const nameKey = `name:${normalizedPlayerKey(stint.name)}`
    players.add(stint.id ? `id:${stint.id}` : (wikiKey && aliases.get(wikiKey)) ?? aliases.get(nameKey) ?? wikiKey ?? nameKey)
    if (stint.from != null) years.push(stint.from)
    if (stint.to != null) years.push(stint.to)
  }

  return {
    uniquePlayers: players.size,
    from: years.length ? Math.min(...years) : null,
    to: years.length ? Math.max(...years) : null,
  }
}

export function squadForYear(stints: readonly ClubSquadStint[], year: number): ClubSquadStint[] {
  const seen = new Set<string>()
  const rows: ClubSquadStint[] = []
  for (const stint of stints) {
    if (stint.from == null && stint.to == null) continue
    const inRange =
      stint.from != null && stint.to != null
        ? stint.from <= year && year <= stint.to
        : stint.from != null
          ? stint.from <= year
          : stint.to === year
    if (!inRange) continue
    const key = stint.id ?? stint.wiki ?? stint.name
    if (seen.has(key)) continue
    seen.add(key)
    rows.push(stint)
  }
  return rows
}

const POS_ORDER: SquadPos[] = ['gk', 'df', 'mf', 'fw']

export function groupSquad(stints: readonly ClubSquadStint[]): { pos?: SquadPos; rows: ClubSquadStint[] }[] {
  const buckets = new Map<SquadPos | 'other', ClubSquadStint[]>()
  for (const stint of stints) {
    const key = stint.pos ?? 'other'
    const list = buckets.get(key) ?? []
    list.push(stint)
    buckets.set(key, list)
  }
  for (const list of buckets.values()) {
    list.sort((a, b) => a.name.localeCompare(b.name))
  }
  const groups: { pos?: SquadPos; rows: ClubSquadStint[] }[] = []
  for (const pos of POS_ORDER) {
    const rows = buckets.get(pos)
    if (rows?.length) groups.push({ pos, rows })
  }
  const other = buckets.get('other')
  if (other?.length) groups.push({ rows: other })
  return groups
}
