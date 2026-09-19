'use client'

import { useMemo, useRef, useState } from 'react'
import { STRINGS, type Lang } from '../i18n/strings'
import {
  PACK_MAX_FILE_BYTES,
  PACK_MAX_FILES,
  PACK_MAX_ITEMS,
  PACK_MAX_PHOTOS,
  PACK_MAX_TEXT_CHARS,
  defaultPackFormats,
  formatTone,
  itemsForFormat,
  PACK_FAMILIES,
  PACK_FAMILY_FORMATS,
  uniqueGroups,
  visibleItems,
  listedUploads,
  removePackItem,
  removePackUpload,
  type CatalogTone,
  type Pack,
  type PackFormatId,
  type PackItem,
} from '../data/pack'
import {
  enrichPackWithModel,
  filesToDraft,
  mergeTextIntoPack,
  packTextLen,
} from '../lib/packExtract'
import { packFamilyLabel, packFormatLabel } from './PackFixWizard'
import { StudioChromeNav } from './WorldsBack'
import { PackFixWizard } from './PackFixWizard'
import { GeoIcon } from './GeoIcon'

const HELP_KEY = 'un-flag-quiz-studio-help'

type EditorStep = 'source' | 'catalog' | 'draft'

interface StudioEditorProps {
  lang: Lang
  pack: Pack
  onPack: (pack: Pack) => void
  onBack: () => void
  onWorlds: () => void
  onAccept: (pack: Pack) => void
  onDelete: () => void
}

export function StudioHelpModal({ lang, onClose }: { lang: Lang; onClose: () => void }) {
  const t = STRINGS[lang]
  return (
    <div className="passport-overlay pack-help-overlay" onClick={onClose} role="presentation">
      <div
        className="passport-sheet pack-help-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="studio-help-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="btn-ghost passport-close" onClick={onClose}>
          {t.close}
        </button>
        <h2 id="studio-help-title" className="passport-title">
          {t.studioGuideTitle}
        </h2>
        <p className="pack-help-lead">{t.studioGuideNeed}</p>
        <p className="setting-hint">{t.studioGuideHow}</p>
        <p className="setting-hint">
          {t.studioGuideLimits(
            PACK_MAX_FILES,
            PACK_MAX_FILE_BYTES / 1024 / 1024,
            PACK_MAX_PHOTOS,
            PACK_MAX_TEXT_CHARS / 1000,
            PACK_MAX_ITEMS,
          )}
        </p>
        <p className="pack-help-photo">
          <GeoIcon name="stamp" size={22} />
          {t.studioAddPhotosHint}
        </p>
        <button type="button" className="btn-primary" onClick={onClose}>
          {t.close}
        </button>
      </div>
    </div>
  )
}

export function StudioHelpButton({ lang, onClick }: { lang: Lang; onClick: () => void }) {
  const t = STRINGS[lang]
  return (
    <button type="button" className="btn-ghost pack-help-btn" onClick={onClick}>
      {t.studioHelp}
    </button>
  )
}

export function markStudioHelpSeen() {
  try {
    localStorage.setItem(HELP_KEY, '1')
  } catch {
    /* ignore */
  }
}

export function studioHelpUnseen(): boolean {
  try {
    return localStorage.getItem(HELP_KEY) !== '1'
  } catch {
    return true
  }
}

export function StudioEditor({ lang, pack, onPack, onBack, onWorlds, onAccept, onDelete }: StudioEditorProps) {
  const t = STRINGS[lang]
  const [step, setStep] = useState<EditorStep>(visibleItems(pack).length ? 'catalog' : 'source')
  const [text, setText] = useState(pack.sourceText ?? '')
  const [sawPdf, setSawPdf] = useState(false)
  const [pdfScan, setPdfScan] = useState<{ taken: number; total: number } | null>(null)
  const [overLimit, setOverLimit] = useState(false)
  const [analyzeErr, setAnalyzeErr] = useState<'fail' | 'key' | null>(null)
  const [busy, setBusy] = useState(false)
  const [drag, setDrag] = useState(false)
  const [help, setHelp] = useState(false)
  const [fixItem, setFixItem] = useState<PackItem | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const photoRef = useRef<HTMLInputElement>(null)

  const summary = useMemo(() => summarize(pack), [pack])
  const photos = pack.items.filter((item) => item.image).length
  const chars = Math.max(packTextLen(pack), text.length)

  function closeHelp() {
    markStudioHelpSeen()
    setHelp(false)
  }

  async function addFiles(list: FileList | File[] | null) {
    if (!list || [...list].length === 0) return
    setBusy(true)
    setSawPdf(false)
    setPdfScan(null)
    setAnalyzeErr(null)
    try {
      const result = await filesToDraft(list, pack)
      setSawPdf(result.pdfSkipped)
      setPdfScan(result.pdfScan ?? null)
      setOverLimit(result.error === 'limit')
      if (fileRef.current) fileRef.current.value = ''
      if (photoRef.current) photoRef.current.value = ''
      if (result.error) return
      let next = {
        ...result.pack,
        title: pack.title || result.pack.title,
      }
      if (result.pdfScan) {
        try {
          next = await enrichPackWithModel(next)
          next = { ...next, formats: next.formats.length > 0 ? next.formats : defaultPackFormats(next) }
        } catch (err) {
          setAnalyzeErr(err instanceof Error && err.message === 'no_key' ? 'key' : 'fail')
        }
      }
      onPack(next)
      if (result.pdfScan && visibleItems(next).length > 0) setStep('catalog')
    } finally {
      setBusy(false)
    }
  }

  function removeUpload(id: string) {
    const next = removePackUpload(pack, id)
    onPack(next)
    setText(next.sourceText ?? '')
  }

  function removeItem(id: string) {
    onPack(removePackItem(pack, id))
  }

  async function analyze() {
    setBusy(true)
    setOverLimit(false)
    setAnalyzeErr(null)
    try {
      let next = pack
      if (text.trim()) {
        const merged = mergeTextIntoPack(next, text)
        if ('error' in merged) {
          setOverLimit(true)
          return
        }
        next = merged
      }
      try {
        next = await enrichPackWithModel(next)
      } catch (err) {
        setAnalyzeErr(err instanceof Error && err.message === 'no_key' ? 'key' : 'fail')
        return
      }
      onPack({ ...next, formats: next.formats.length > 0 ? next.formats : defaultPackFormats(next) })
      setStep('catalog')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="screen home-screen pack-studio">
      <input ref={photoRef} type="file" multiple hidden accept="image/jpeg,image/png,image/webp" onChange={(event) => void addFiles(event.target.files)} />
      <input ref={fileRef} type="file" multiple hidden accept="image/jpeg,image/png,image/webp,.txt,.md,.csv,.tsv,.pdf,application/pdf,text/plain,text/csv" onChange={(event) => void addFiles(event.target.files)} />
      <header className="home-header">
        <StudioChromeNav
          lang={lang}
          onBack={() => {
            if (step === 'draft') setStep('catalog')
            else if (step === 'catalog') setStep('source')
            else onBack()
          }}
          onWorlds={onWorlds}
        />
        <h1>{t.studio}</h1>
        <p className="subtitle">{t.studioSubtitle}</p>
        <StudioHelpButton lang={lang} onClick={() => setHelp(true)} />
      </header>

      {step === 'source' ? (
        <div className="settings-card">
          <input
            className="pack-input"
            value={pack.title}
            onChange={(event) => onPack({ ...pack, title: event.target.value })}
            placeholder={t.studioNew}
          />
          <button type="button" className="btn-primary pack-photo-cta" onClick={() => photoRef.current?.click()}>
            <GeoIcon name="stamp" size={28} />
            <span>
              <strong>{t.studioAddPhotos}</strong>
              <em>{t.studioAddPhotosHint}</em>
            </span>
          </button>
          <button
            type="button"
            className={`pack-drop${drag ? ' is-drag' : ''}`}
            onClick={() => !busy && fileRef.current?.click()}
            onDragOver={(event) => {
              event.preventDefault()
              setDrag(true)
            }}
            onDragLeave={() => setDrag(false)}
            onDrop={(event) => {
              event.preventDefault()
              setDrag(false)
              void addFiles(event.dataTransfer.files)
            }}
          >
            {busy ? t.studioAnalyzing : t.studioDrop}
          </button>
          {sawPdf && !pdfScan ? <p className="setting-hint">{t.studioPdfSkip}</p> : null}
          {pdfScan ? <p className="setting-hint">{t.studioPdfScan(pdfScan.taken, pdfScan.total)}</p> : null}
          {analyzeErr === 'key' ? <p className="setting-hint">{t.studioAnalyzeNoKey}</p> : null}
          {analyzeErr === 'fail' ? <p className="setting-hint">{t.studioAnalyzeFail}</p> : null}
          {overLimit ? <p className="setting-hint">{t.studioOverLimit}</p> : null}
          <p className="setting-hint">
            {t.studioQuota}: {pack.items.length}/{PACK_MAX_ITEMS} · {photos}/{PACK_MAX_PHOTOS} {t.studioPhotos} · {Math.round(chars / 1000)}/{PACK_MAX_TEXT_CHARS / 1000}k
          </p>
          <UploadList lang={lang} pack={pack} onRemove={removeUpload} onRemoveItem={removeItem} />
          <textarea
            className="pack-textarea"
            rows={5}
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder={t.studioPasteHint}
          />
          <button type="button" className="btn-primary" disabled={busy} onClick={() => void analyze()}>
            {busy ? t.studioAnalyzing : t.studioAnalyze}
          </button>
        </div>
      ) : null}

      {step === 'catalog' ? (
        <div className="settings-card">
          <h2>{t.studioSummary}</h2>
          <p>{t.studioNCards(visibleItems(pack).length)}</p>
          <ul className="pack-summary">
            {summary.map((row) => (
              <li key={row.label}>{t.studioFound(row.label, row.n)}</li>
            ))}
          </ul>
          <h2>{t.studioFormats}</h2>
          <p className="setting-hint">{t.studioFormatsHint}</p>
          {PACK_FAMILIES.map((family) => {
            const usable = PACK_FAMILY_FORMATS[family].some((format) => formatTone(pack, format) !== 'gray')
            if (!usable) return null
            return (
              <div key={family} className="pack-family">
                <h3>{packFamilyLabel(family, t)}</h3>
                <div className="choice-wrap">
                  {PACK_FAMILY_FORMATS[family].map((format) => {
                    const tone = formatTone(pack, format)
                    if (tone === 'gray') return null
                    const on = pack.formats.includes(format)
                    return (
                      <button
                        key={format}
                        type="button"
                        className={`chip pack-tone-${tone}${on ? ' is-active' : ''}`}
                        aria-pressed={on}
                        onClick={() => onPack({ ...pack, formats: toggleFormat(pack.formats, format) })}
                      >
                        {packFormatLabel(format, t)}
                        <span className="choice-note">{toneLabel(tone, t)} · {itemsForFormat(pack, format).length}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
          <button type="button" className="btn-primary" onClick={() => setStep('draft')}>
            {t.studioContinue}
          </button>
        </div>
      ) : null}

      {step === 'draft' ? (
        <div className="settings-card">
          <h2>{t.studioDraft}</h2>
          <button type="button" className="btn-primary pack-photo-cta" onClick={() => photoRef.current?.click()}>
            <GeoIcon name="stamp" size={28} />
            <span>
              <strong>{t.studioAddPhotos}</strong>
              <em>{t.studioAddPhotosHint}</em>
            </span>
          </button>
          <UploadList lang={lang} pack={pack} onRemove={removeUpload} onRemoveItem={removeItem} />
          <div className="pack-draft-table">
            {visibleItems(pack).map((item) => (
              <article key={item.id} className="pack-draft-row">
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image.url} alt="" className="pack-draft-thumb" />
                ) : null}
                <div className="pack-draft-fields">
                  <input
                    className="pack-input"
                    value={item.title}
                    onChange={(event) => onPack(updateItem(pack, item.id, { title: event.target.value }))}
                  />
                  <textarea
                    className="pack-textarea"
                    rows={2}
                    value={item.definition ?? ''}
                    onChange={(event) => onPack(updateItem(pack, item.id, { definition: event.target.value }))}
                  />
                  <div className="pack-draft-meta">
                    <input
                      className="pack-input is-tiny"
                      value={item.date ?? ''}
                      placeholder="YYYY"
                      onChange={(event) => onPack(updateItem(pack, item.id, { date: event.target.value || undefined }))}
                    />
                    <input
                      className="pack-input is-tiny"
                      value={item.group ?? ''}
                      placeholder="#"
                      onChange={(event) => onPack(updateItem(pack, item.id, { group: event.target.value || undefined }))}
                    />
                  </div>
                </div>
                <button type="button" className="btn-ghost" onClick={() => setFixItem(item)}>
                  {t.studioFix}
                </button>
              </article>
            ))}
          </div>
          <button type="button" className="btn-primary" onClick={() => onAccept({ ...pack, accepted: true })}>
            {t.studioAccept}
          </button>
        </div>
      ) : null}

      <button type="button" className="btn-ghost pack-delete-quiz" onClick={onDelete}>
        {t.studioDelete}
      </button>

      {help ? <StudioHelpModal lang={lang} onClose={closeHelp} /> : null}
      {fixItem ? (
        <PackFixWizard lang={lang} pack={pack} item={fixItem} onClose={() => setFixItem(null)} onPack={onPack} />
      ) : null}
    </div>
  )
}

function UploadList({
  lang,
  pack,
  onRemove,
  onRemoveItem,
}: {
  lang: Lang
  pack: Pack
  onRemove: (id: string) => void
  onRemoveItem: (id: string) => void
}) {
  const t = STRINGS[lang]
  const uploads = listedUploads(pack)
  const photos = pack.items.filter((item) => item.image && item.image.kind !== 'scan')
  const files = uploads.filter((row) => row.kind === 'file')
  return (
    <section className="pack-uploads">
      <p className="pack-uploads-count">{t.studioLoaded(photos.length, files.length)}</p>
      {photos.length === 0 && files.length === 0 ? <p className="setting-hint">{t.studioLoadedEmpty}</p> : null}
      {photos.length > 0 ? (
        <>
          <h3>{t.studioPhotos}</h3>
          <ul className="pack-upload-photos">
            {photos.map((item) => (
              <li key={item.id} className="pack-upload-photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image!.url} alt="" className="pack-draft-thumb" />
                <span className="pack-upload-name">{item.title}</span>
                <button type="button" className="btn-ghost pack-upload-remove" onClick={() => onRemoveItem(item.id)}>
                  {t.studioRemoveUpload}
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : null}
      {files.length > 0 ? (
        <>
          <h3>{t.studioLoadedFiles}</h3>
          <ul className="pack-upload-files">
            {files.map((row) => {
              const n = row.itemIds.filter((id) => pack.items.some((item) => item.id === id && !item.hidden)).length
              return (
                <li key={row.id} className="pack-upload-file">
                  <span className="pack-upload-name">{row.name}</span>
                  {n > 0 ? <span className="choice-note">{t.studioNCards(n)}</span> : null}
                  <button type="button" className="btn-ghost pack-upload-remove" onClick={() => onRemove(row.id)}>
                    {t.studioRemoveUpload}
                  </button>
                </li>
              )
            })}
          </ul>
        </>
      ) : null}
    </section>
  )
}

function toneLabel(tone: CatalogTone, t: (typeof STRINGS)[Lang]): string {
  if (tone === 'green') return t.studioToneGreen
  if (tone === 'yellow') return t.studioToneYellow
  return t.studioToneGray
}

function toggleFormat(formats: PackFormatId[], format: PackFormatId): PackFormatId[] {
  return formats.includes(format) ? formats.filter((id) => id !== format) : [...formats, format]
}

function updateItem(pack: Pack, id: string, patch: Partial<PackItem>): Pack {
  return {
    ...pack,
    items: pack.items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    updatedAt: Date.now(),
  }
}

function summarize(pack: Pack): Array<{ label: string; n: number }> {
  const items = visibleItems(pack)
  return [
    { label: 'def', n: items.filter((item) => item.definition).length },
    { label: 'img', n: items.filter((item) => item.image).length },
    { label: 'date', n: items.filter((item) => item.date).length },
    { label: 'group', n: uniqueGroups(pack).length },
  ].filter((row) => row.n > 0)
}
