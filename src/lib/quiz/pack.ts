import {
  clueList,
  fieldLabel,
  itemsForFormat,
  uniqueGroups,
  type Pack,
  type PackFormatId,
  type PackItem,
} from '../../data/pack'

export type PackQuestion = {
  itemId: string
  format: PackFormatId
  prompt: string
  promptImage?: string
  silhouette?: boolean
  clues?: string[]
  answerId: string
  options: Array<{ id: string; label: string; image?: string; silhouette?: boolean }>
}

function shuffle<T>(list: T[]): T[] {
  const next = [...list]
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    const a = next[i]
    const b = next[j]
    if (a === undefined || b === undefined) continue
    next[i] = b
    next[j] = a
  }
  return next
}

function pickN<T>(list: T[], n: number): T[] {
  return shuffle(list).slice(0, n)
}

function itemById(pack: Pack, id: string): PackItem | undefined {
  return pack.items.find((item) => item.id === id)
}

function distractors(pack: Pack, item: PackItem, format: PackFormatId, need: number): PackItem[] {
  const pool = itemsForFormat(pack, format).filter((row) => row.id !== item.id)
  const sameGroup = pool.filter((row) => item.group && row.group === item.group)
  const others = pool.filter((row) => !item.group || row.group !== item.group)
  if (format === 'setMember') return pickN(others.length ? others : pool, need)
  if (pack.distractorScope === 'pack') return pickN(pool, need)
  const first = pickN(sameGroup, Math.max(1, need - 1))
  const rest = pickN(others.filter((row) => !first.includes(row)), need - first.length)
  const mixed = [...first, ...rest]
  if (mixed.length < need) return pickN(pool, need)
  return mixed.slice(0, need)
}

function optionCount(poolSize: number): number {
  if (poolSize <= 1) return 1
  if (poolSize === 2) return 2
  if (poolSize === 3) return 3
  return 4
}

function labelFor(item: PackItem, format: PackFormatId): string {
  switch (format) {
    case 'termToDef':
      return firstLine(item.definition ?? item.title)
    case 'defToTerm':
    case 'photoToName':
    case 'silToName':
    case 'diagramToName':
    case 'dateToName':
    case 'numToName':
    case 'orderToName':
    case 'qtyToName':
    case 'kindToName':
    case 'placeToName':
    case 'fieldToName':
    case 'cluesToName':
    case 'relToName':
    case 'setMember':
    case 'exprToSense':
      return item.title
    case 'nameToPhoto':
    case 'nameToSil':
    case 'nameToDiagram':
      return item.title
    case 'nameToField':
      return fieldLabel(item) ?? item.title
    case 'nameToDate':
      return item.date ?? item.title
    case 'nameToNum':
      return String(item.number ?? item.ordinal ?? '')
    case 'nameToOrder':
      return String(item.order ?? '')
    case 'nameToQty':
      return item.value ?? item.title
    case 'senseToExpr':
      return item.expr ?? item.title
    case 'nameToKind':
      return item.kind ?? item.title
    case 'nameToPlace':
      return item.place ?? item.title
    case 'nameToRel':
      return relatedLabel(item)
    case 'pairFwd':
      return item.pairWith ?? item.title
    case 'pairRev':
      return item.title
  }
}

function firstLine(text: string): string {
  const line = text.split(/[.!?。]/)[0]?.trim() ?? text
  return line.length > 90 ? `${line.slice(0, 87)}…` : line
}

function relatedLabel(item: PackItem): string {
  if (item.pairWith) return item.pairWith
  if (item.related?.length) return item.related.join(', ')
  if (item.parentId) return item.parentId
  return item.title
}

function promptImage(item: PackItem, format: PackFormatId): { url?: string; silhouette?: boolean } {
  if (!item.image) return {}
  if (format === 'photoToName' || format === 'diagramToName') return { url: item.image.url }
  if (format === 'silToName') return { url: item.image.url, silhouette: true }
  return {}
}

function optionImage(item: PackItem, format: PackFormatId): { url?: string; silhouette?: boolean } {
  if (!item.image) return {}
  if (format === 'nameToPhoto' || format === 'nameToDiagram') return { url: item.image.url }
  if (format === 'nameToSil') return { url: item.image.url, silhouette: true }
  return {}
}

function promptText(item: PackItem, format: PackFormatId, pack: Pack): string {
  switch (format) {
    case 'termToDef':
      return item.title
    case 'defToTerm':
      return item.definition ?? item.title
    case 'photoToName':
    case 'silToName':
    case 'diagramToName':
      return ''
    case 'nameToPhoto':
    case 'nameToSil':
    case 'nameToDiagram':
    case 'nameToField':
    case 'nameToDate':
    case 'nameToNum':
    case 'nameToOrder':
    case 'nameToQty':
    case 'nameToKind':
    case 'nameToPlace':
    case 'nameToRel':
      return item.title
    case 'dateToName':
      return item.date ?? ''
    case 'numToName':
      return String(item.number ?? item.ordinal ?? '')
    case 'orderToName':
      return String(item.order ?? '')
    case 'qtyToName':
      return item.value ?? ''
    case 'fieldToName':
      return fieldLabel(item) ?? ''
    case 'kindToName':
      return item.kind ?? ''
    case 'placeToName':
      return item.place ?? ''
    case 'exprToSense':
      return item.expr ?? ''
    case 'senseToExpr':
      return item.value || item.definition || ''
    case 'pairFwd':
      return item.title
    case 'pairRev':
      return item.pairWith ?? ''
    case 'relToName':
      return relatedLabel(item)
    case 'setMember':
      return item.group ?? uniqueGroups(pack)[0] ?? ''
    case 'cluesToName':
      return ''
  }
}

function makeQuestion(pack: Pack, item: PackItem, format: PackFormatId): PackQuestion | null {
  const pool = itemsForFormat(pack, format)
  const n = optionCount(pool.length)
  if (n < 2) return null
  const others = distractors(pack, item, format, n - 1)
  const opts = shuffle([item, ...others]).slice(0, n)
  if (!opts.some((row) => row.id === item.id)) return null
  const img = promptImage(item, format)
  const clues = format === 'cluesToName' ? clueList(item) : undefined
  return {
    itemId: item.id,
    format,
    prompt: promptText(item, format, pack),
    promptImage: img.url,
    silhouette: img.silhouette,
    clues,
    answerId: item.id,
    options: opts.map((row) => {
      const optImg = optionImage(row, format)
      return {
        id: row.id,
        label: labelFor(row, format),
        image: optImg.url,
        silhouette: optImg.silhouette,
      }
    }),
  }
}

export function createPackRound(
  pack: Pack,
  formats: PackFormatId[],
  size: number,
  group?: string,
  onlyIds?: string[],
): PackQuestion[] {
  const liveFormats = formats.filter((format) => itemsForFormat(pack, format).length >= 2)
  if (liveFormats.length === 0) return []
  const used = new Set<string>()
  const questions: PackQuestion[] = []
  let guard = 0
  while (questions.length < size && guard < size * 12) {
    guard += 1
    const format = liveFormats[questions.length % liveFormats.length]
    if (!format) break
    let pool = itemsForFormat(pack, format)
    if (group) pool = pool.filter((item) => item.group === group)
    if (onlyIds) pool = pool.filter((item) => onlyIds.includes(item.id))
    pool = pool.filter((item) => !used.has(`${item.id}:${format}`))
    const item = pickN(pool, 1)[0]
    if (!item) {
      if (pool.length === 0 && questions.length > 0) break
      continue
    }
    const question = makeQuestion(pack, item, format)
    if (!question) continue
    used.add(`${item.id}:${format}`)
    questions.push(question)
  }
  return questions
}

export function isPackCorrect(question: PackQuestion, selectedId: string | null): boolean {
  return selectedId === question.answerId
}

export function packLevelGroups(pack: Pack): Array<{ level: number; group?: string; ids: string[] }> {
  const groups = uniqueGroups(pack)
  const visible = pack.items.filter((item) => !item.hidden)
  if (groups.length >= 2) {
    const levels: Array<{ level: number; group?: string; ids: string[] }> = groups.map((group, index) => ({
      level: index + 1,
      group,
      ids: visible.filter((item) => item.group === group).map((item) => item.id),
    }))
    levels.push({
      level: groups.length + 1,
      ids: visible.map((item) => item.id),
    })
    return levels.filter((row) => row.ids.length >= 2)
  }
  const chunk = Math.max(4, Math.ceil(visible.length / 5))
  const levels: Array<{ level: number; group?: string; ids: string[] }> = []
  for (let i = 0; i < visible.length; i += chunk) {
    const ids = visible.slice(0, i + chunk).map((item) => item.id)
    if (ids.length >= 2) levels.push({ level: levels.length + 1, ids })
  }
  return levels
}

export function itemOf(pack: Pack, id: string): PackItem | undefined {
  return itemById(pack, id)
}
