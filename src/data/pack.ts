export const PACK_FORMATS = [
  'termToDef',
  'defToTerm',
  'photoToName',
  'nameToPhoto',
  'silToName',
  'nameToSil',
  'diagramToName',
  'nameToDiagram',
  'nameToField',
  'fieldToName',
  'dateToName',
  'nameToDate',
  'numToName',
  'nameToNum',
  'orderToName',
  'nameToOrder',
  'nameToQty',
  'qtyToName',
  'exprToSense',
  'senseToExpr',
  'nameToKind',
  'kindToName',
  'relToName',
  'nameToRel',
  'pairFwd',
  'pairRev',
  'nameToPlace',
  'placeToName',
  'setMember',
  'cluesToName',
] as const

export type PackFormatId = (typeof PACK_FORMATS)[number]

export const PACK_FAMILIES = [
  'terms',
  'portraits',
  'silhouettes',
  'diagrams',
  'field',
  'dates',
  'numbers',
  'order',
  'qty',
  'formula',
  'kind',
  'links',
  'pairs',
  'place',
  'groups',
  'clues',
] as const

export type PackFamilyId = (typeof PACK_FAMILIES)[number]

export const PACK_FAMILY_FORMATS: Record<PackFamilyId, PackFormatId[]> = {
  terms: ['termToDef', 'defToTerm'],
  portraits: ['photoToName', 'nameToPhoto'],
  silhouettes: ['silToName', 'nameToSil'],
  diagrams: ['diagramToName', 'nameToDiagram'],
  field: ['nameToField', 'fieldToName'],
  dates: ['dateToName', 'nameToDate'],
  numbers: ['numToName', 'nameToNum'],
  order: ['orderToName', 'nameToOrder'],
  qty: ['nameToQty', 'qtyToName'],
  formula: ['exprToSense', 'senseToExpr'],
  kind: ['nameToKind', 'kindToName'],
  links: ['relToName', 'nameToRel'],
  pairs: ['pairFwd', 'pairRev'],
  place: ['nameToPlace', 'placeToName'],
  groups: ['setMember'],
  clues: ['cluesToName'],
}

export const EASY_PACK_FORMATS: PackFormatId[] = [
  'termToDef',
  'photoToName',
  'dateToName',
  'nameToField',
]

export const HARD_PACK_FORMATS: PackFormatId[] = [
  'defToTerm',
  'cluesToName',
  'silToName',
  'relToName',
  'nameToNum',
  'orderToName',
]

// Paid studio (~$7/mo): Gemini 1.5 Flash $0.075/$0.30 per 1M in/out, ~560 tokens/image.
// One 160-page scan ≈ $0.05–0.12. Token budget ≤ $3/mo → ~25 model builds.
export const PACK_MAX_FILES = 20
export const PACK_MAX_FILE_BYTES = 16 * 1024 * 1024
export const PACK_MAX_PHOTOS = 160
export const PACK_MAX_TEXT_CHARS = 300_000
export const PACK_MAX_ITEMS = 500
export const PACK_MAX_PDF_PAGES = 200
export const PACK_MAX_PDF_SCAN_PAGES = 160
export const PACK_MAX_VISION = 160
export const PACK_VISION_BATCH = 8
export const PACK_VISION_CARDS = 50
export const PACK_VISION_IMAGE_DATA_CHARS = 900_000
export const PACK_MODEL_TEXT_CHARS = 24_000
export const PACK_STORE_IMAGE_PX = 1000
export const PACK_VISION_IMAGE_PX = 768

export type PackOrigin = 'upload' | 'web'
export type PackImageKind = 'photo' | 'diagram' | 'scan'
export type CatalogTone = 'green' | 'yellow' | 'gray'

export type PackItem = {
  id: string
  title: string
  definition?: string
  date?: string
  number?: number
  ordinal?: number
  order?: number
  code?: string
  kind?: string
  place?: string
  expr?: string
  value?: string
  pairWith?: string
  parentId?: string
  related?: string[]
  extra?: string[]
  group?: string
  aliases?: string[]
  image?: { url: string; alt?: string; from: PackOrigin; kind?: PackImageKind; analyzed?: boolean }
  source: { origin: PackOrigin; excerpt?: string; page?: number }
  disabledFormats?: PackFormatId[]
  hidden?: boolean
}

export type PackMistake = {
  itemId: string
  format: PackFormatId
  at: number
}

export type PackUploadKind = 'photo' | 'file'

export type PackUpload = {
  id: string
  name: string
  kind: PackUploadKind
  itemIds: string[]
  text?: string
}

export type Pack = {
  id: string
  title: string
  createdAt: number
  updatedAt: number
  accepted: boolean
  includeWeb: boolean
  formats: PackFormatId[]
  items: PackItem[]
  uploads?: PackUpload[]
  sourceText?: string
  distractorScope?: 'group' | 'pack'
  mistakes?: PackMistake[]
  levelClears?: number[]
}

export const PACK_GREEN_MIN = 8
export const PACK_YELLOW_MIN = 3

export function visibleItems(pack: Pack): PackItem[] {
  return pack.items.filter((item) => !item.hidden && (pack.includeWeb || item.source.origin !== 'web'))
}

export function fieldLabel(item: PackItem): string | undefined {
  if (item.code) return item.code
  if (item.kind) return item.kind
  if (item.definition && item.definition.length <= 48) return item.definition
  return undefined
}

export function clueList(item: PackItem): string[] {
  const bits: string[] = []
  for (const extra of item.extra ?? []) {
    if (extra.trim()) bits.push(extra.trim())
  }
  if (item.date) bits.push(item.date)
  if (item.kind) bits.push(item.kind)
  if (item.place) bits.push(item.place)
  if (item.code) bits.push(item.code)
  if (item.definition && bits.length < 2) bits.push(item.definition)
  const seen = new Set<string>()
  const next: string[] = []
  for (const bit of bits) {
    const key = bit.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    next.push(bit)
    if (next.length >= 3) break
  }
  return next
}

export function itemAllowsFormat(item: PackItem, format: PackFormatId): boolean {
  if (item.hidden) return false
  if (item.disabledFormats?.includes(format)) return false
  switch (format) {
    case 'termToDef':
    case 'defToTerm':
      return Boolean(item.definition)
    case 'photoToName':
    case 'nameToPhoto':
      return Boolean(item.image && item.image.kind !== 'diagram' && item.image.kind !== 'scan')
    case 'silToName':
    case 'nameToSil':
      return Boolean(item.image && item.image.kind !== 'scan')
    case 'diagramToName':
    case 'nameToDiagram':
      return item.image?.kind === 'diagram'
    case 'nameToField':
    case 'fieldToName':
      return Boolean(fieldLabel(item))
    case 'dateToName':
    case 'nameToDate':
      return Boolean(item.date)
    case 'numToName':
    case 'nameToNum':
      return item.number != null || item.ordinal != null
    case 'orderToName':
    case 'nameToOrder':
      return item.order != null
    case 'nameToQty':
    case 'qtyToName':
      return Boolean(item.value) && item.number == null
    case 'exprToSense':
    case 'senseToExpr':
      return Boolean(item.expr && (item.value || item.definition))
    case 'nameToKind':
    case 'kindToName':
      return Boolean(item.kind)
    case 'relToName':
    case 'nameToRel':
      return Boolean(item.related?.length || item.parentId)
    case 'pairFwd':
    case 'pairRev':
      return Boolean(item.pairWith)
    case 'nameToPlace':
    case 'placeToName':
      return Boolean(item.place)
    case 'setMember':
      return Boolean(item.group)
    case 'cluesToName':
      return clueList(item).length >= 2
  }
}

export function itemsForFormat(pack: Pack, format: PackFormatId): PackItem[] {
  return visibleItems(pack).filter((item) => itemAllowsFormat(item, format))
}

export function uniqueKinds(pack: Pack): number {
  return new Set(visibleItems(pack).map((item) => item.kind).filter(Boolean)).size
}

export function uniqueGroups(pack: Pack): string[] {
  return [...new Set(visibleItems(pack).map((item) => item.group).filter((group): group is string => Boolean(group)))]
}

export function catalogTone(count: number, extraOk = true): CatalogTone {
  if (!extraOk || count < PACK_YELLOW_MIN) return 'gray'
  if (count < PACK_GREEN_MIN) return 'yellow'
  return 'green'
}

export function formatTone(pack: Pack, format: PackFormatId): CatalogTone {
  const pool = itemsForFormat(pack, format)
  if (format === 'nameToKind' || format === 'kindToName') {
    return catalogTone(pool.length, uniqueKinds(pack) >= 3)
  }
  if (format === 'setMember') {
    return catalogTone(pool.length, uniqueGroups(pack).length >= 2)
  }
  return catalogTone(pool.length)
}

export function familyTone(pack: Pack, family: PackFamilyId): CatalogTone {
  const tones = PACK_FAMILY_FORMATS[family].map((format) => formatTone(pack, format))
  if (tones.includes('green')) return 'green'
  if (tones.includes('yellow')) return 'yellow'
  return 'gray'
}

export function defaultPackFormats(pack: Pack): PackFormatId[] {
  const picked = PACK_FORMATS.filter((format) => formatTone(pack, format) === 'green')
  if (picked.length > 0) return picked
  return PACK_FORMATS.filter((format) => formatTone(pack, format) === 'yellow')
}

export function firstSentence(text: string): string {
  const trimmed = text.trim()
  const match = trimmed.match(/^[^.!?。！？]+[.!?。！？]?/)
  return (match?.[0] ?? trimmed).trim()
}

export function newPackId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return `p_${crypto.randomUUID()}`
  return `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

export function newItemId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return `i_${crypto.randomUUID()}`
  return `i_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

export function newUploadId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return `u_${crypto.randomUUID()}`
  return `u_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

export function emptyPack(title = ''): Pack {
  const now = Date.now()
  return {
    id: newPackId(),
    title,
    createdAt: now,
    updatedAt: now,
    accepted: false,
    includeWeb: false,
    formats: [],
    items: [],
    uploads: [],
    distractorScope: 'group',
    mistakes: [],
    levelClears: [],
  }
}

export function removePackUpload(pack: Pack, uploadId: string): Pack {
  const listed = pack.uploads ?? []
  const orphan = uploadId.startsWith('orphan-')
  const upload = orphan
    ? {
        id: uploadId,
        name: '',
        kind: 'photo' as const,
        itemIds: [uploadId.slice('orphan-'.length)],
      }
    : listed.find((row) => row.id === uploadId)
  if (!upload) return pack
  const drop = new Set(upload.itemIds)
  const items = pack.items.flatMap((item) => {
    if (!drop.has(item.id)) return [item]
    if (upload.kind === 'photo' && (item.definition || item.date || item.number || item.group)) {
      const next = { ...item }
      delete next.image
      return [next]
    }
    return []
  })
  let sourceText = pack.sourceText ?? ''
  if (upload.text) sourceText = sourceText.split(upload.text).join('\n').replace(/\n{3,}/g, '\n\n').trim()
  return {
    ...pack,
    items,
    uploads: listed.filter((row) => row.id !== uploadId),
    sourceText: sourceText || undefined,
    updatedAt: Date.now(),
  }
}

export function removePackItem(pack: Pack, itemId: string): Pack {
  return {
    ...pack,
    items: pack.items.filter((item) => item.id !== itemId),
    uploads: (pack.uploads ?? []).map((row) => ({
      ...row,
      itemIds: row.itemIds.filter((id) => id !== itemId),
    })),
    updatedAt: Date.now(),
  }
}

export function listedUploads(pack: Pack): PackUpload[] {
  const listed = pack.uploads ?? []
  const covered = new Set(listed.flatMap((row) => row.itemIds))
  const extras = pack.items
    .filter((item) => item.image && !covered.has(item.id))
    .map((item) => ({
      id: `orphan-${item.id}`,
      name: item.title,
      kind: 'photo' as const,
      itemIds: [item.id],
    }))
  return [...listed, ...extras]
}
