import { firstSentence, type Pack, type PackFormatId, type PackItem } from '../data/pack'

export const FIX_KINDS = [
  'swap',
  'badFact',
  'wording',
  'image',
  'options',
  'notInSource',
  'wrongFormat',
  'duplicate',
  'other',
] as const

export type FixKind = (typeof FIX_KINDS)[number]

export type ScriptedFix =
  | { kind: 'swap' }
  | { kind: 'wording' }
  | { kind: 'image' }
  | { kind: 'options'; scope: 'group' | 'pack' }
  | { kind: 'notInSource'; action: 'hide' | 'delete' }
  | { kind: 'wrongFormat'; format: PackFormatId }
  | { kind: 'duplicate' }
  | { kind: 'badFact'; field: 'title' | 'definition' | 'date' | 'number'; value: string }

export function applyScriptedFix(pack: Pack, itemId: string, fix: ScriptedFix): Pack {
  const items = pack.items.map((item) => (item.id === itemId ? patchItem(item, fix) : item)).filter((item): item is PackItem => item != null)
  const next: Pack = { ...pack, items, updatedAt: Date.now() }
  if (fix.kind === 'options') next.distractorScope = fix.scope
  return next
}

function patchItem(item: PackItem, fix: ScriptedFix): PackItem | null {
  if (fix.kind === 'duplicate' || (fix.kind === 'notInSource' && fix.action === 'delete')) return null
  if (fix.kind === 'swap') {
    if (item.definition) {
      return { ...item, title: item.definition, definition: item.title }
    }
    return item
  }
  if (fix.kind === 'wording' && item.definition) {
    return { ...item, definition: firstSentence(item.definition) }
  }
  if (fix.kind === 'image') {
    return { ...item, image: undefined }
  }
  if (fix.kind === 'notInSource' && fix.action === 'hide') {
    return { ...item, hidden: true }
  }
  if (fix.kind === 'wrongFormat') {
    const disabled = [...new Set([...(item.disabledFormats ?? []), fix.format])]
    return { ...item, disabledFormats: disabled }
  }
  if (fix.kind === 'badFact') {
    if (fix.field === 'number') {
      const n = Number(fix.value.replace(',', '.'))
      return { ...item, number: Number.isFinite(n) ? n : item.number }
    }
    return { ...item, [fix.field]: fix.value }
  }
  return item
}

export type ModelItemPatch = Partial<
  Pick<
    PackItem,
    | 'title'
    | 'definition'
    | 'date'
    | 'number'
    | 'ordinal'
    | 'order'
    | 'code'
    | 'kind'
    | 'place'
    | 'expr'
    | 'value'
    | 'pairWith'
    | 'extra'
    | 'group'
    | 'hidden'
  >
> & { note?: string }

export function applyModelPatch(pack: Pack, itemId: string, patch: ModelItemPatch): Pack {
  return {
    ...pack,
    updatedAt: Date.now(),
    items: pack.items.map((item) => {
      if (item.id !== itemId) return item
      const next = { ...item }
      for (const key of Object.keys(patch) as Array<keyof ModelItemPatch>) {
        if (key === 'note') continue
        const value = patch[key]
        if (value !== undefined) (next as Record<string, unknown>)[key] = value
      }
      return next
    }),
  }
}
