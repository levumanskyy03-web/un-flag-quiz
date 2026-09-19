import {
  PACK_MAX_FILE_BYTES,
  PACK_MAX_FILES,
  PACK_MAX_ITEMS,
  PACK_MAX_PDF_PAGES,
  PACK_MAX_PDF_SCAN_PAGES,
  PACK_MAX_PHOTOS,
  PACK_MAX_TEXT_CHARS,
  PACK_MAX_VISION,
  PACK_MODEL_TEXT_CHARS,
  PACK_STORE_IMAGE_PX,
  PACK_VISION_BATCH,
  PACK_VISION_IMAGE_PX,
  emptyPack,
  newItemId,
  newUploadId,
  type Pack,
  type PackItem,
  type PackOrigin,
  type PackUpload,
} from '../data/pack'

const PAIR = /^(.{2,80}?)\s*(?:—+|–+|-+|:|·|\t)\s+(.{2,})$/
const YEAR = /\b((?:1[0-9]{3}|20[0-9]{2}))\b/
const ORDER = /(?:^|\s)#(\d{1,3})(?:\s|$)|(?:^|\s)(?:№|n°|no\.?)\s*(\d{1,3})\b/i

export type IngestError = 'limit' | null

export type IngestResult = {
  pack: Pack
  pdfSkipped: boolean
  pdfScan?: { taken: number; total: number }
  error: IngestError
}

function splitLines(text: string): string[] {
  return text.replace(/\r/g, '').split('\n')
}

function parseCsvLine(line: string): string[] {
  const out: string[] = []
  let cur = ''
  let quoted = false
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i]
    if (quoted) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"'
        i += 1
      } else if (ch === '"') {
        quoted = false
      } else {
        cur += ch
      }
    } else if (ch === '"') {
      quoted = true
    } else if (ch === ',' || ch === ';') {
      out.push(cur.trim())
      cur = ''
    } else {
      cur += ch
    }
  }
  out.push(cur.trim())
  return out
}

function looksCsv(lines: string[]): boolean {
  const sample = lines.filter((line) => line.trim()).slice(0, 6)
  if (sample.length < 2) return false
  return sample.every((line) => parseCsvLine(line).length >= 2)
}

function itemFromPair(title: string, rest: string, group: string | undefined, excerpt: string): PackItem {
  const year = rest.match(YEAR)?.[1] ?? title.match(YEAR)?.[1]
  const orderMatch = `${title} ${rest}`.match(ORDER)
  const orderRaw = orderMatch?.[1] ?? orderMatch?.[2]
  const numberMatch = rest.match(/(?:^|[^\d])(\d+(?:[.,]\d+)?)(?:\s*$)/)
  const item: PackItem = {
    id: newItemId(),
    title: title.replace(YEAR, '').replace(ORDER, '').trim() || title.trim(),
    definition: rest.trim(),
    group,
    source: { origin: 'upload', excerpt },
  }
  if (year) item.date = year
  if (orderRaw) item.order = Number(orderRaw)
  if (numberMatch && !year) {
    const n = Number(numberMatch[1].replace(',', '.'))
    if (Number.isFinite(n)) item.number = n
  }
  return item
}

export function extractFromText(text: string, origin: PackOrigin = 'upload'): PackItem[] {
  const lines = splitLines(text)
  const items: PackItem[] = []
  let group: string | undefined
  const nonEmpty = lines.map((line) => line.trim()).filter(Boolean)
  if (looksCsv(nonEmpty)) {
    const rows = nonEmpty.map(parseCsvLine)
    const header = rows[0].map((cell) => cell.toLowerCase())
    const titleIdx = Math.max(0, header.findIndex((cell) => /title|term|name|термин|название/.test(cell)))
    const defIdx = header.findIndex((cell) => /def|опред|meaning|sense/.test(cell))
    const start = /title|term|name|термин/.test(header[0] ?? '') ? 1 : 0
    for (const row of rows.slice(start)) {
      const title = row[titleIdx] || row[0]
      const definition = (defIdx >= 0 ? row[defIdx] : row[1]) || ''
      if (!title) continue
      items.push(itemFromPair(title, definition, group, `${title} — ${definition}`))
    }
    return dedupe(items)
  }

  for (const raw of lines) {
    const line = raw.trim()
    if (!line) continue
    const heading = line.match(/^#{1,3}\s+(.+)$/) || line.match(/^(.+):$/)
    if (heading && !PAIR.test(line) && heading[1].length <= 80) {
      group = heading[1].trim()
      continue
    }
    const pair = line.match(PAIR)
    if (pair) {
      items.push(itemFromPair(pair[1], pair[2], group, line))
      continue
    }
    if (line.length >= 4 && line.length <= 80) {
      items.push({
        id: newItemId(),
        title: line,
        group,
        source: { origin, excerpt: line },
      })
    }
  }
  return dedupe(items)
}

function dedupe(items: PackItem[]): PackItem[] {
  const seen = new Set<string>()
  const next: PackItem[] = []
  for (const item of items) {
    const key = item.title.trim().toLowerCase()
    if (!key || seen.has(key)) continue
    seen.add(key)
    next.push(item)
  }
  return next
}

function normTitle(value: string): string {
  return value.toLowerCase().replace(/[_\-.]+/g, ' ').replace(/[^\p{L}\p{N}\s]/gu, '').replace(/\s+/g, ' ').trim()
}

function photoCount(items: PackItem[]): number {
  return items.filter((item) => item.image).length
}

export function packTextLen(pack: Pack): number {
  return (pack.sourceText ?? '').length
}

export function compressImage(file: Blob, maxPx: number, quality = 0.72): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(reader.error)
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const scale = Math.min(1, maxPx / Math.max(img.width, img.height))
        const width = Math.max(1, Math.round(img.width * scale))
        const height = Math.max(1, Math.round(img.height * scale))
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          resolve(String(reader.result))
          return
        }
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.onerror = () => resolve(String(reader.result))
      img.src = String(reader.result)
    }
    reader.readAsDataURL(file)
  })
}

function dataUrlParts(url: string): { mime: string; data: string } | null {
  const match = url.match(/^data:([^;]+);base64,(.+)$/)
  if (!match) return null
  return { mime: match[1], data: match[2] }
}

type MapInsertProto = {
  getOrInsert?: (key: unknown, value: unknown) => unknown
  getOrInsertComputed?: (key: unknown, callback: (key: unknown) => unknown) => unknown
}

function polyfillMapGetOrInsert() {
  if (typeof Map === 'undefined') return
  const proto = Map.prototype as MapInsertProto
  if (typeof proto.getOrInsert !== 'function') {
    proto.getOrInsert = function getOrInsert(this: Map<unknown, unknown>, key: unknown, value: unknown) {
      if (this.has(key)) return this.get(key)
      this.set(key, value)
      return value
    }
  }
  if (typeof proto.getOrInsertComputed !== 'function') {
    proto.getOrInsertComputed = function getOrInsertComputed(
      this: Map<unknown, unknown>,
      key: unknown,
      callback: (key: unknown) => unknown,
    ) {
      if (this.has(key)) return this.get(key)
      const value = callback(key)
      this.set(key, value)
      return value
    }
  }
}

async function pdfjsLib() {
  polyfillMapGetOrInsert()
  const pdfjs = await import('pdfjs-dist')
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  pdfjs.GlobalWorkerOptions.workerSrc = `${origin}/pdf.worker.boot.mjs`
  return pdfjs
}

function pdfAssetUrl(dir: string): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  return `${origin}${dir}`
}

function pdfPageText(items: Array<{ str?: string; hasEOL?: boolean; transform?: number[] }>): string {
  const lines: string[] = []
  let row = ''
  let lastY: number | null = null
  for (const item of items) {
    const str = item.str ?? ''
    if (!str && !item.hasEOL) continue
    const y = item.transform ? Math.round(item.transform[5] ?? 0) : 0
    if (lastY !== null && Math.abs(y - lastY) > 4 && row.trim()) {
      lines.push(row.trim())
      row = ''
    }
    row += str
    if (item.hasEOL) {
      lines.push(row.trim())
      row = ''
      lastY = null
    } else {
      lastY = y
    }
  }
  if (row.trim()) lines.push(row.trim())
  return lines.filter(Boolean).join('\n')
}

type PdfJsLib = Awaited<ReturnType<typeof pdfjsLib>>
type PdfPage = {
  getViewport: (opts: { scale: number }) => { width: number; height: number }
  render: (opts: object) => { promise: Promise<unknown> }
  getOperatorList: () => Promise<{ fnArray: number[]; argsArray: unknown[][] }>
  objs: { get: (id: string, callback: (value: unknown) => void) => void }
}

function jpegFromBitmap(bitmap: ImageBitmap): string {
  const scale = Math.min(1, PACK_STORE_IMAGE_PX / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(bitmap.width * scale))
  canvas.height = Math.max(1, Math.round(bitmap.height * scale))
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL('image/jpeg', 0.72)
}

function pageObj(page: PdfPage, id: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    page.objs.get(id, resolve)
    window.setTimeout(() => reject(new Error('pdf obj')), 20_000)
  })
}

async function bitmapsFromArgs(page: PdfPage, node: unknown, out: ImageBitmap[]): Promise<void> {
  if (!node) return
  if (typeof ImageBitmap !== 'undefined' && node instanceof ImageBitmap) {
    out.push(node)
    return
  }
  if (typeof node !== 'object') return
  const rec = node as { bitmap?: unknown; data?: unknown }
  if (typeof ImageBitmap !== 'undefined' && rec.bitmap instanceof ImageBitmap) {
    out.push(rec.bitmap)
    return
  }
  if (typeof rec.data === 'string') {
    try {
      await bitmapsFromArgs(page, await pageObj(page, rec.data), out)
    } catch {
      // missing obj
    }
    return
  }
  if (Array.isArray(node)) {
    for (const item of node) await bitmapsFromArgs(page, item, out)
  }
}

async function renderPdfPage(page: PdfPage, pdfjs: PdfJsLib): Promise<string> {
  const ops = await page.getOperatorList()
  const pdfOps = pdfjs.OPS as Record<string, number>
  const paint = new Set(
    [
      pdfOps.paintImageMaskXObject,
      pdfOps.paintImageMaskXObjectGroup,
      pdfOps.paintImageMaskXObjectRepeat,
      pdfOps.paintImageXObject,
      pdfOps.paintImageXObjectRepeat,
      pdfOps.paintInlineImageXObject,
      pdfOps.paintJpegXObject,
    ].filter((n): n is number => typeof n === 'number'),
  )
  const bitmaps: ImageBitmap[] = []
  for (let i = 0; i < ops.fnArray.length; i += 1) {
    if (!paint.has(ops.fnArray[i])) continue
    await bitmapsFromArgs(page, ops.argsArray[i], bitmaps)
  }
  const bitmap = bitmaps.sort((a, b) => b.width * b.height - a.width * a.height)[0]
  if (bitmap) return jpegFromBitmap(bitmap)

  const base = page.getViewport({ scale: 1 })
  const scale = Math.min(1.15, PACK_STORE_IMAGE_PX / Math.max(base.width, base.height))
  const viewport = page.getViewport({ scale })
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(viewport.width))
  canvas.height = Math.max(1, Math.round(viewport.height))
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''
  await page.render({ canvasContext: ctx, viewport, canvas }).promise
  return canvas.toDataURL('image/jpeg', 0.72)
}

async function extractPdf(
  file: File,
  photoSlots: number,
): Promise<{ text: string; images: Array<{ url: string; title: string; page: number }>; pages: number }> {
  const pdfjs = await pdfjsLib()
  const data = new Uint8Array(await file.arrayBuffer())
  const wasmUrl = pdfAssetUrl('/pdfjs-wasm/')
  const doc = await pdfjs.getDocument({
    data,
    wasmUrl,
    useWasm: true,
    useWorkerFetch: true,
    isImageDecoderSupported: false,
    disableRange: true,
    disableStream: true,
  }).promise
  try {
    const pageCount = Math.min(doc.numPages, PACK_MAX_PDF_PAGES)
    const stem = file.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim()
    const chunks: string[] = []
    const images: Array<{ url: string; title: string; page: number }> = []
    const scanCap = Math.min(photoSlots, PACK_MAX_PDF_SCAN_PAGES)
    for (let n = 1; n <= pageCount; n += 1) {
      const page = await doc.getPage(n)
      const content = await page.getTextContent()
      const text = pdfPageText(content.items as Array<{ str?: string; hasEOL?: boolean; transform?: number[] }>)
      if (text) chunks.push(text)
      if (text.length < 40 && images.length < scanCap) {
        try {
          const url = await renderPdfPage(page as PdfPage, pdfjs)
          if (url) images.push({ url, title: `${stem} ${n}`, page: n })
        } catch {
          // JPEG2000 / empty page — keep going
        }
      } else if (chunks.length === 0 && images.length >= scanCap) {
        break
      }
    }
    return { text: chunks.join('\n\n'), images, pages: doc.numPages }
  } finally {
    try {
      const destroy = (doc as { destroy?: () => unknown }).destroy
      if (destroy) await Promise.resolve(destroy.call(doc))
    } catch {
      // worker already torn down
    }
  }
}

function attachImage(
  pack: Pack,
  url: string,
  title: string,
  excerpt: string,
  page?: number,
  mode: 'photo' | 'scan' = 'photo',
): string {
  if (mode !== 'scan') {
    const hit = pack.items.find((item) => !item.image && normTitle(item.title) === normTitle(title))
    if (hit) {
      hit.image = { url, alt: title, from: 'upload', kind: 'photo', analyzed: Boolean(hit.definition) }
      return hit.id
    }
  }
  const id = newItemId()
  pack.items.push({
    id,
    title: title || excerpt,
    hidden: mode === 'scan',
    image: { url, alt: title, from: 'upload', kind: mode, analyzed: false },
    source: { origin: 'upload', excerpt, page },
  })
  return id
}

export function visionPayload(url: string): { mime: string; data: string } | null {
  return dataUrlParts(url)
}

export async function filesToDraft(files: FileList | File[], base?: Pack): Promise<IngestResult> {
  const pack = base
    ? {
        ...base,
        items: base.items.map((item) => ({ ...item, image: item.image ? { ...item.image } : undefined })),
        uploads: [...(base.uploads ?? [])],
      }
    : emptyPack()
  const texts: string[] = pack.sourceText ? [pack.sourceText] : []
  const list = [...files]
  let pdfSkipped = false
  let pdfScan: { taken: number; total: number } | undefined
  if (list.length > PACK_MAX_FILES) return { pack, pdfSkipped, pdfScan, error: 'limit' }

  for (const file of list) {
    if (file.size > PACK_MAX_FILE_BYTES) return { pack, pdfSkipped, pdfScan, error: 'limit' }
    const before = new Set(pack.items.map((item) => item.id))
    const itemIds: string[] = []
    let chunk = ''
    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      try {
        const extracted = await extractPdf(file, PACK_MAX_PHOTOS - photoCount(pack.items))
        if (!extracted.text && extracted.images.length === 0) {
          pdfSkipped = true
          continue
        }
        if (extracted.text) {
          if (texts.join('\n').length + extracted.text.length > PACK_MAX_TEXT_CHARS) return { pack, pdfSkipped, pdfScan, error: 'limit' }
          chunk = extracted.text
          texts.push(extracted.text)
          pack.items.push(...extractFromText(extracted.text))
        }
        for (const image of extracted.images) {
          if (photoCount(pack.items) >= PACK_MAX_PHOTOS) break
          itemIds.push(attachImage(pack, image.url, image.title, file.name, image.page, extracted.text ? 'photo' : 'scan'))
        }
        if (!extracted.text && extracted.images.length > 0) {
          pdfScan = { taken: extracted.images.length, total: extracted.pages }
        }
      } catch (err) {
        console.error('[pack pdf]', err)
        pdfSkipped = true
        continue
      }
      for (const item of pack.items) {
        if (!before.has(item.id)) itemIds.push(item.id)
      }
      const upload: PackUpload = { id: newUploadId(), name: file.name, kind: 'file', itemIds: [...new Set(itemIds)] }
      if (chunk) upload.text = chunk
      pack.uploads = [...(pack.uploads ?? []), upload]
      continue
    }
    if (file.type.startsWith('image/')) {
      if (photoCount(pack.items) >= PACK_MAX_PHOTOS) return { pack, pdfSkipped, error: 'limit' }
      const url = await compressImage(file, PACK_STORE_IMAGE_PX)
      const title = file.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim()
      itemIds.push(attachImage(pack, url, title, file.name))
      pack.uploads = [
        ...(pack.uploads ?? []),
        { id: newUploadId(), name: file.name, kind: 'photo', itemIds: [...new Set(itemIds)] },
      ]
      continue
    }
    const text = await file.text()
    if (texts.join('\n').length + text.length > PACK_MAX_TEXT_CHARS) return { pack, pdfSkipped, error: 'limit' }
    chunk = text
    texts.push(text)
    pack.items.push(...extractFromText(text))
    for (const item of pack.items) {
      if (!before.has(item.id)) itemIds.push(item.id)
    }
    pack.uploads = [
      ...(pack.uploads ?? []),
      { id: newUploadId(), name: file.name, kind: 'file', itemIds: [...new Set(itemIds)], text: chunk },
    ]
  }
  pack.sourceText = texts.join('\n\n').slice(0, PACK_MAX_TEXT_CHARS)
  pack.items = dedupe(pack.items).slice(0, PACK_MAX_ITEMS)
  const surviving = new Set(pack.items.map((item) => item.id))
  pack.uploads = (pack.uploads ?? []).map((row) => ({
    ...row,
    itemIds: row.itemIds.filter((id) => surviving.has(id)),
  }))
  if (!pack.title) pack.title = list[0]?.name.replace(/\.[^.]+$/, '') || pack.title
  pack.updatedAt = Date.now()
  return { pack, pdfSkipped, pdfScan, error: null }
}

export function mergeTextIntoPack(pack: Pack, text: string): Pack | { error: 'limit' } {
  const nextText = [pack.sourceText, text].filter(Boolean).join('\n\n')
  if (nextText.length > PACK_MAX_TEXT_CHARS) return { error: 'limit' }
  const extracted = extractFromText(text)
  const seen = new Set(pack.items.map((item) => item.title.trim().toLowerCase()))
  const items = [...pack.items]
  for (const item of extracted) {
    const key = item.title.trim().toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    items.push(item)
  }
  if (items.length > PACK_MAX_ITEMS) return { error: 'limit' }
  return {
    ...pack,
    items,
    sourceText: nextText,
    updatedAt: Date.now(),
  }
}

export function leftoverProse(pack: Pack): string {
  const raw = pack.sourceText ?? ''
  if (!raw.trim()) return ''
  const covered = new Set(pack.items.flatMap((item) => [item.title, item.definition].filter(Boolean).map((value) => value!.toLowerCase())))
  const lines = raw.split('\n').filter((line) => {
    const t = line.trim()
    if (!t || t.startsWith('#')) return false
    if (PAIR.test(t)) return false
    const low = t.toLowerCase()
    for (const bit of covered) {
      if (bit.length > 3 && low.includes(bit)) return false
    }
    return t.length > 40
  })
  return lines.join('\n')
}

export function photosNeedingVision(pack: Pack): PackItem[] {
  return pack.items.filter((item) => {
    if (!item.image || item.image.analyzed) return false
    if (item.image.kind === 'scan') return true
    return !item.definition
  })
}

export type AnalyzeCard = {
  id?: string
  title?: string
  definition?: string
  date?: string
  group?: string
  expr?: string
  value?: string
  kind?: 'photo' | 'diagram'
}

export async function downscaleDataUrl(url: string, maxPx: number): Promise<string> {
  const blob = await (await fetch(url)).blob()
  return compressImage(blob, maxPx, 0.65)
}

export function applyAnalyzeCards(pack: Pack, cards: AnalyzeCard[], photoIds: string[] = []): Pack {
  let items = pack.items.map((item) => {
    if (!photoIds.includes(item.id) || !item.image) return item
    return { ...item, image: { ...item.image, analyzed: true } }
  })
  for (const card of cards) {
    const target = card.id ? items.find((item) => item.id === card.id) : undefined
    const scanSource = Boolean(target?.hidden || target?.image?.kind === 'scan')
    if (card.id && target && !scanSource) {
      items = items.map((item) => {
        if (item.id !== card.id) return item
        return {
          ...item,
          title: card.title?.trim() || item.title,
          definition: card.definition?.trim() || item.definition,
          date: card.date || item.date,
          group: card.group || item.group,
          expr: card.expr?.trim() || item.expr,
          value: card.value?.trim() || item.value,
          image: item.image
            ? { ...item.image, analyzed: true, kind: card.kind === 'diagram' ? 'diagram' : item.image.kind }
            : item.image,
        }
      })
      continue
    }
    const title = (card.title || card.expr || '').trim()
    if (!title) continue
    items.push({
      id: newItemId(),
      title,
      definition: card.definition?.trim(),
      date: card.date,
      group: card.group,
      expr: card.expr?.trim(),
      value: card.value?.trim(),
      source: { origin: 'upload', excerpt: card.definition || card.expr },
    })
  }
  return { ...pack, items: dedupe(items).slice(0, PACK_MAX_ITEMS), updatedAt: Date.now() }
}

export async function enrichPackWithModel(pack: Pack): Promise<Pack> {
  const photos = photosNeedingVision(pack).slice(0, PACK_MAX_VISION)
  const prose = leftoverProse(pack).slice(0, PACK_MODEL_TEXT_CHARS)
  if (photos.length === 0 && prose.length < 80) return pack
  const probe = await fetch('/api/pack/analyze')
  if (probe.status === 503) throw new Error('no_key')
  let next = pack
  const rounds = photos.length === 0 ? 1 : Math.ceil(photos.length / PACK_VISION_BATCH)
  for (let i = 0; i < rounds; i += 1) {
    const batch = photos.slice(i * PACK_VISION_BATCH, (i + 1) * PACK_VISION_BATCH)
    const payloadPhotos: Array<{ id: string; mime: string; data: string }> = []
    const scan = batch.some((item) => item.image?.kind === 'scan' || item.hidden)
    for (const item of batch) {
      if (!item.image) continue
      const small = await downscaleDataUrl(item.image.url, PACK_VISION_IMAGE_PX)
      const parts = visionPayload(small)
      if (!parts) continue
      payloadPhotos.push({ id: item.id, mime: parts.mime, data: parts.data })
    }
    const res = await fetch('/api/pack/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: i === 0 ? prose : undefined, photos: payloadPhotos, scan }),
    })
    if (res.status === 503) throw new Error('no_key')
    if (!res.ok) break
    const body = (await res.json()) as { cards?: AnalyzeCard[] }
    next = applyAnalyzeCards(next, body.cards ?? [], payloadPhotos.map((photo) => photo.id))
  }
  return next
}
