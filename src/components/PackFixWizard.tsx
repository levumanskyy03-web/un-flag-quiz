import { useState } from 'react'
import { STRINGS, type Lang } from '../i18n/strings'
import { PACK_FAMILY_FORMATS, PACK_FAMILIES, type Pack, type PackFamilyId, type PackFormatId, type PackItem } from '../data/pack'
import { applyModelPatch, applyScriptedFix, type FixKind, type ModelItemPatch } from '../lib/packFix'
import type { PackQuestion } from '../lib/quiz/pack'

const KINDS: FixKind[] = [
  'swap',
  'badFact',
  'wording',
  'image',
  'options',
  'notInSource',
  'wrongFormat',
  'duplicate',
  'other',
]

interface PackFixWizardProps {
  lang: Lang
  pack: Pack
  item: PackItem
  question?: PackQuestion
  onClose: () => void
  onPack: (pack: Pack) => void
}

export function PackFixWizard({ lang, pack, item, question, onClose, onPack }: PackFixWizardProps) {
  const t = STRINGS[lang]
  const [kind, setKind] = useState<FixKind | null>(null)
  const [factField, setFactField] = useState<'title' | 'definition' | 'date'>('title')
  const [factValue, setFactValue] = useState(item.title)
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const kindLabel: Record<FixKind, string> = {
    swap: t.fixSwap,
    badFact: t.fixBadFact,
    wording: t.fixWording,
    image: t.fixImage,
    options: t.fixOptions,
    notInSource: t.fixNotInSource,
    wrongFormat: t.fixWrongFormat,
    duplicate: t.fixDuplicate,
    other: t.fixOther,
  }

  function applyAndClose(next: Pack) {
    onPack(next)
    onClose()
  }

  async function runModel() {
    setBusy(true)
    setError(null)
    try {
      const res = await fetch('/api/pack/fix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item,
          excerpt: item.source.excerpt,
          format: question?.format,
          note,
        }),
      })
      const body = (await res.json()) as { patch?: ModelItemPatch; error?: string }
      if (!res.ok || !body.patch) {
        setError(body.error ?? t.fixNeedAi)
        return
      }
      applyAndClose(applyModelPatch(pack, item.id, body.patch))
    } catch {
      setError(t.fixNeedAi)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="pack-fix-overlay" role="dialog" aria-modal="true" aria-labelledby="pack-fix-title">
      <div className="settings-card pack-fix-card">
        <h2 id="pack-fix-title">{t.fixTitle}</h2>
        <p className="subtitle">{item.title}</p>
        <div className="choice-wrap">
          {KINDS.map((id) => (
            <button
              key={id}
              type="button"
              className={`chip ${kind === id ? 'is-active' : ''}`}
              aria-pressed={kind === id}
              onClick={() => setKind(id)}
            >
              {kindLabel[id]}
            </button>
          ))}
        </div>

        {kind === 'swap' ? (
          <button type="button" className="btn-primary" onClick={() => applyAndClose(applyScriptedFix(pack, item.id, { kind: 'swap' }))}>
            {t.fixApply}
          </button>
        ) : null}

        {kind === 'wording' ? (
          <button type="button" className="btn-primary" onClick={() => applyAndClose(applyScriptedFix(pack, item.id, { kind: 'wording' }))}>
            {t.fixApply}
          </button>
        ) : null}

        {kind === 'image' ? (
          <button type="button" className="btn-primary" onClick={() => applyAndClose(applyScriptedFix(pack, item.id, { kind: 'image' }))}>
            {t.fixApply}
          </button>
        ) : null}

        {kind === 'duplicate' ? (
          <button type="button" className="btn-primary" onClick={() => applyAndClose(applyScriptedFix(pack, item.id, { kind: 'duplicate' }))}>
            {t.fixDrop}
          </button>
        ) : null}

        {kind === 'options' ? (
          <div className="choice-grid is-2">
            <button type="button" className="choice" onClick={() => applyAndClose(applyScriptedFix(pack, item.id, { kind: 'options', scope: 'group' }))}>
              {t.fixOptionsGroup}
            </button>
            <button type="button" className="choice" onClick={() => applyAndClose(applyScriptedFix(pack, item.id, { kind: 'options', scope: 'pack' }))}>
              {t.fixOptionsPack}
            </button>
          </div>
        ) : null}

        {kind === 'notInSource' ? (
          <div className="choice-grid is-2">
            <button type="button" className="choice" onClick={() => applyAndClose(applyScriptedFix(pack, item.id, { kind: 'notInSource', action: 'hide' }))}>
              {t.fixHide}
            </button>
            <button type="button" className="choice" onClick={() => applyAndClose(applyScriptedFix(pack, item.id, { kind: 'notInSource', action: 'delete' }))}>
              {t.fixDrop}
            </button>
          </div>
        ) : null}

        {kind === 'wrongFormat' && question ? (
          <button
            type="button"
            className="btn-primary"
            onClick={() => applyAndClose(applyScriptedFix(pack, item.id, { kind: 'wrongFormat', format: question.format }))}
          >
            {t.fixApply}
          </button>
        ) : null}

        {kind === 'wrongFormat' && !question ? (
          <p className="setting-hint">{t.fixNeedAi}</p>
        ) : null}

        {kind === 'badFact' ? (
          <>
            <div className="choice-wrap">
              {(['title', 'definition', 'date'] as const).map((field) => (
                <button
                  key={field}
                  type="button"
                  className={`chip ${factField === field ? 'is-active' : ''}`}
                  onClick={() => {
                    setFactField(field)
                    setFactValue(String(item[field] ?? ''))
                  }}
                >
                  {field}
                </button>
              ))}
            </div>
            <textarea className="pack-textarea" value={factValue} onChange={(event) => setFactValue(event.target.value)} rows={3} />
            <button
              type="button"
              className="btn-primary"
              onClick={() => applyAndClose(applyScriptedFix(pack, item.id, { kind: 'badFact', field: factField, value: factValue }))}
            >
              {t.fixApply}
            </button>
          </>
        ) : null}

        {kind === 'other' || (kind === 'wrongFormat' && !question) ? (
          <>
            <p className="setting-hint">{t.fixAiHint}</p>
            <textarea className="pack-textarea" value={note} onChange={(event) => setNote(event.target.value)} rows={4} placeholder={t.fixNeedAi} />
            {error ? <p className="setting-hint">{error}</p> : null}
            <button type="button" className="btn-primary" disabled={busy || !note.trim()} onClick={() => void runModel()}>
              {t.fixAiGo}
            </button>
          </>
        ) : null}

        <button type="button" className="btn-ghost" onClick={onClose}>
          {t.back}
        </button>
      </div>
    </div>
  )
}

export function packFamilyLabel(family: PackFamilyId, t: (typeof STRINGS)[Lang]): string {
  const map: Record<PackFamilyId, string> = {
    terms: t.packFamilyTerms,
    portraits: t.packFamilyPortraits,
    silhouettes: t.packFamilySilhouettes,
    diagrams: t.packFamilyDiagrams,
    field: t.packFamilyField,
    dates: t.packFamilyDates,
    numbers: t.packFamilyNumbers,
    order: t.packFamilyOrder,
    qty: t.packFamilyQty,
    formula: t.packFamilyFormula,
    kind: t.packFamilyKind,
    links: t.packFamilyLinks,
    pairs: t.packFamilyPairs,
    place: t.packFamilyPlace,
    groups: t.packFamilyGroups,
    clues: t.packFamilyClues,
  }
  return map[family]
}

export function packFormatLabel(format: PackFormatId, t: (typeof STRINGS)[Lang]): string {
  return t[format]
}

export function formatsOfFamily(family: PackFamilyId): PackFormatId[] {
  return PACK_FAMILY_FORMATS[family]
}

export { PACK_FAMILIES }
