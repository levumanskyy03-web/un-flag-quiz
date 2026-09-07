import { footballPlayerWikis } from '../data/footballPlayers'
import { ALL_LEADER_TERMS } from '../data/leaders'
import { WIKI_PORTRAIT_FILES, isAllowedPortraitFile } from '../data/leaderPortraitFiles'

export const WIKI_UA =
  'PassportCountry/1.0 (https://un-flag-quiz.vercel.app; levumanskyy03@gmail.com)'

export type FreeLicenseKind = 'pd' | 'cc-by' | 'cc-by-sa'

export interface WikiPortrait {
  url: string
  credit: string
  compactCredit: string
  filePage: string
  license: string
}

const TITLE_MAX = 180
const THUMB_WIDTH = 480
const ALLOWED_TITLES = new Set(
  [
    ...ALL_LEADER_TERMS.map((term) => term.wiki),
    ...footballPlayerWikis(),
  ]
    .map((title) => normalizeWikiTitle(title))
    .filter((title): title is string => Boolean(title)),
)

export function normalizeWikiTitle(value: string): string | null {
  const title = value.trim().replace(/_/g, ' ').replace(/\s+/g, ' ')
  if (!title || title.length > TITLE_MAX) return null
  if (/^[./\\]/.test(title) || title.includes('://')) return null
  return title
}

export function isAllowedLeaderWiki(title: string): boolean {
  const normalized = normalizeWikiTitle(title)
  return Boolean(normalized && ALLOWED_TITLES.has(normalized))
}

export function classifyLicense(
  shortName: string,
  licenseUrl: string,
  copyrighted: string,
): FreeLicenseKind | null {
  const url = licenseUrl.trim().toLowerCase()
  if (
    url.includes('/licenses/by-nc') ||
    url.includes('/licenses/by-nd') ||
    url.includes('/licenses/nc') ||
    url.includes('/licenses/nd')
  ) {
    return null
  }
  if (url.includes('publicdomain/zero') || url.includes('publicdomain/mark')) return 'pd'
  if (url.includes('/licenses/by-sa')) return 'cc-by-sa'
  if (url.includes('/licenses/by/')) return 'cc-by'

  const name = shortName.trim().toLowerCase().replace(/[_-]+/g, ' ')
  const blob = `${name} ${url}`
  if (!name && copyrighted.trim().toLowerCase() !== 'false') return null
  if (/(fair\s*use|non\s*free|all rights reserved)/.test(blob)) return null
  if (/\bnc\b|non\s*commercial/.test(blob)) return null
  if (/\bnd\b|no\s*deriv/.test(blob)) return null
  if (
    copyrighted.trim().toLowerCase() === 'false' ||
    name === 'public domain' ||
    name === 'pd' ||
    name.startsWith('pd ') ||
    name.includes('cc0') ||
    name.includes('cc 0')
  ) {
    return 'pd'
  }
  if (name.startsWith('cc by sa') || name.includes('attribution share alike')) return 'cc-by-sa'
  if (name.startsWith('cc by') && !name.includes(' sa') && !name.includes('nc') && !name.includes('nd')) {
    return 'cc-by'
  }
  // Support GFDL and other free licenses commonly used for leader portraits
  if (
    name.includes('gfdl') ||
    name.includes('gnu free documentation') ||
    name.includes('free art license') ||
    name.includes('fal') ||
    url.includes('copyleft/fdl') ||
    url.includes('free-art-license')
  ) {
    return 'cc-by-sa'
  }
  return null
}

const COMMONS_HOSTS = new Set(['upload.wikimedia.org', 'thumb.wikimedia.org'])

export function isCommonsUploadUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return COMMONS_HOSTS.has(parsed.hostname) && parsed.pathname.includes('/wikipedia/commons/')
  } catch {
    return false
  }
}

export function stripMarkup(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim()
}

function metaValue(meta: Record<string, unknown> | undefined, key: string): string {
  const field = meta?.[key]
  if (!field || typeof field !== 'object') return ''
  const value = (field as { value?: unknown }).value
  return typeof value === 'string' ? value : ''
}

function cleanThumbUrl(url: string): string {
  try {
    const parsed = new URL(url)
    parsed.search = ''
    return parsed.toString()
  } catch {
    return url
  }
}

function licenseLabel(kind: FreeLicenseKind, shortName: string): string {
  const short = shortName.trim()
  if (kind === 'pd') return short || 'Public domain'
  return short || (kind === 'cc-by-sa' ? 'CC BY-SA' : 'CC BY')
}

function commonsFilePage(fileName: string): string {
  return `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(fileName.replace(/ /g, '_'))}`
}

function cleanAuthor(author: string): string {
  const cleaned = author
    .replace(/^[^\s]+\.(?:png|jpe?g|gif|webp|svg|tiff?)\s*:?\s*/i, '')
    .replace(/\bauthor\s+unknown(\s+author)?\b/gi, 'Unknown author')
    .replace(/\b(unknown author)+\b/gi, 'Unknown author')
    .replace(/^unknown,?\s*/i, '')
    .trim()
  return /^unknown author$/i.test(cleaned) ? '' : cleaned
}

function looksLikeLicenseEssay(text: string): boolean {
  return /this file is licensed|you are free:|creativecommons\.org|permission is granted|could you be kind|vous [eê]tes libre|cette photo a [eé]t[eé] prise/i.test(
    text,
  )
}

function shortAuthor(author: string): string {
  const who = cleanAuthor(author)
  if (!who || looksLikeLicenseEssay(who) || who.length > 42) return ''
  return who
}

function buildCredits(author: string, license: string, attribution = ''): { credit: string; compactCredit: string } {
  const who = shortAuthor(attribution) || shortAuthor(author)
  const compactCredit = `${license} · Wikimedia Commons`
  const credit = who ? `${who} · ${compactCredit}` : compactCredit
  return { credit, compactCredit }
}

interface MediaWikiPage {
  missing?: boolean
  pageimage?: string
  pageprops?: { wikibase_item?: string }
  thumbnail?: { source?: string }
  imageinfo?: Array<{
    thumburl?: string
    url?: string
    mediatype?: string
    extmetadata?: Record<string, unknown>
  }>
}

function commonsUrlScore(url: string): number {
  if (!isCommonsUploadUrl(url)) return -1
  try {
    const parsed = new URL(url)
    const thumb = parsed.pathname.includes('/thumb/') ? 2 : 0
    const upload = parsed.hostname === 'upload.wikimedia.org' ? 1 : 0
    return thumb + upload
  } catch {
    return -1
  }
}

function pickCommonsUrl(urls: Array<string | undefined>): string | null {
  let best: string | null = null
  let bestScore = -1
  for (const raw of urls) {
    if (!raw) continue
    const url = cleanThumbUrl(raw)
    const score = commonsUrlScore(url)
    if (score > bestScore) {
      best = url
      bestScore = score
    }
  }
  return best
}

const WIKI_WORKERS = 4
let wikiActive = 0
const wikiWaiters: Array<() => void> = []

async function acquireWikiSlot() {
  if (wikiActive >= WIKI_WORKERS) {
    await new Promise<void>((resolve) => {
      wikiWaiters.push(resolve)
    })
  }
  wikiActive += 1
}

function releaseWikiSlot() {
  wikiActive = Math.max(0, wikiActive - 1)
  wikiWaiters.shift()?.()
}

async function wikiJson(url: string): Promise<unknown> {
  let lastError: Error | null = null
  for (let attempt = 0; attempt < 3; attempt += 1) {
    await acquireWikiSlot()
    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': WIKI_UA, Accept: 'application/json' },
        cache: 'no-store',
        signal: AbortSignal.timeout(12_000),
      })
      if (response.status === 429 || response.status === 503) {
        lastError = new Error('wiki')
      } else {
        if (!response.ok) throw new Error('wiki')
        const data: unknown = await response.json()
        if (data && typeof data === 'object' && 'error' in data) throw new Error('wiki')
        return data
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('wiki')
    } finally {
      await new Promise((resolve) => {
        setTimeout(resolve, 80)
      })
      releaseWikiSlot()
    }
    await new Promise((resolve) => {
      setTimeout(resolve, 400 * (attempt + 1))
    })
  }
  throw lastError ?? new Error('wiki')
}

function firstPage(data: unknown): MediaWikiPage | null {
  if (!data || typeof data !== 'object') return null
  const query = (data as { query?: { pages?: unknown } }).query
  const pages = query?.pages
  if (!Array.isArray(pages) || pages.length === 0) return null
  const page = pages[0]
  return page && typeof page === 'object' ? (page as MediaWikiPage) : null
}

function hasLicenseMeta(info: NonNullable<MediaWikiPage['imageinfo']>[number]): boolean {
  const meta = info.extmetadata
  return Boolean(
    metaValue(meta, 'LicenseShortName') || metaValue(meta, 'LicenseUrl') || metaValue(meta, 'Copyrighted'),
  )
}

async function readFileInfos(fileName: string): Promise<NonNullable<MediaWikiPage['imageinfo']>> {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    formatversion: '2',
    redirects: '1',
    titles: `File:${fileName}`,
    prop: 'imageinfo',
    iiprop: 'url|extmetadata|mediatype',
    iiurlwidth: String(THUMB_WIDTH),
  })
  const origins = ['https://commons.wikimedia.org/w/api.php', 'https://en.wikipedia.org/w/api.php']
  const infos: NonNullable<MediaWikiPage['imageinfo']> = []
  for (const origin of origins) {
    try {
      const page = firstPage(await wikiJson(`${origin}?${params}`))
      const info = page?.imageinfo?.[0]
      if (!info) continue
      infos.push(info)
      if (pickCommonsUrl([info.thumburl, info.url]) && hasLicenseMeta(info)) return infos
    } catch {
      /* try the other origin */
    }
  }
  return infos
}

interface WikidataEntities {
  entities?: Record<
    string,
    {
      claims?: Record<
        string,
        Array<{
          mainsnak?: {
            datavalue?: {
              value?: unknown
            }
          }
        }>
      >
    }
  >
}

async function wikidataImage(qid: string): Promise<string | null> {
  if (!/^Q\d+$/.test(qid)) return null
  const params = new URLSearchParams({
    action: 'wbgetentities',
    ids: qid,
    props: 'claims',
    format: 'json',
  })
  try {
    const data = (await wikiJson(`https://www.wikidata.org/w/api.php?${params}`)) as WikidataEntities
    const value = data.entities?.[qid]?.claims?.P18?.[0]?.mainsnak?.datavalue?.value
    return typeof value === 'string' && value.trim() ? value.trim().replace(/ /g, '_') : null
  } catch {
    return null
  }
}

async function portraitFromFile(fileName: string, fallbackUrl?: string): Promise<WikiPortrait | null> {
  const infos = await readFileInfos(fileName)
  const info = infos.find((item) => item.extmetadata) ?? infos[0]
  if (!info) return null
  const media = (info.mediatype ?? '').toUpperCase()
  if (media && media !== 'BITMAP' && media !== 'DRAWING') return null

  const url = pickCommonsUrl([...infos.map((item) => item.thumburl), ...infos.map((item) => item.url), fallbackUrl])
  if (!url) return null

  const meta = info.extmetadata
  const shortName = metaValue(meta, 'LicenseShortName')
  const licenseUrl = metaValue(meta, 'LicenseUrl')
  const copyrighted = metaValue(meta, 'Copyrighted')
  const kind = classifyLicense(shortName, licenseUrl, copyrighted)
  if (!kind) return null

  const license = licenseLabel(kind, shortName)
  const artist = stripMarkup(metaValue(meta, 'Artist'))
  const attribution = stripMarkup(metaValue(meta, 'Attribution'))
  const { credit, compactCredit } = buildCredits(artist, license, attribution)
  return {
    url,
    credit,
    compactCredit,
    filePage: commonsFilePage(fileName.replace(/_/g, ' ')),
    license,
  }
}

function uniqueFiles(names: Array<string | null | undefined>): string[] {
  const seen = new Set<string>()
  const files: string[] = []
  for (const name of names) {
    const file = name?.trim().replace(/ /g, '_')
    if (!file || seen.has(file)) continue
    seen.add(file)
    files.push(file)
  }
  return files
}

export async function lookupWikiPortrait(title: string, preferredFile?: string | null): Promise<WikiPortrait | null> {
  const normalized = normalizeWikiTitle(title)
  if (!normalized || !ALLOWED_TITLES.has(normalized)) return null
  const hinted = preferredFile?.trim().replace(/_/g, ' ')
  const preferred = hinted && isAllowedPortraitFile(hinted) ? hinted : WIKI_PORTRAIT_FILES[normalized]

  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    formatversion: '2',
    redirects: '1',
    titles: normalized,
    prop: 'pageimages|pageprops',
    piprop: 'name|thumbnail',
    pithumbsize: String(THUMB_WIDTH),
    ppprop: 'wikibase_item',
  })
  const article = firstPage(await wikiJson(`https://en.wikipedia.org/w/api.php?${params}`))
  const pageFile = article?.pageimage?.replace(/ /g, '_')
  const files = uniqueFiles([preferred, article?.pageimage])
  for (const fileName of files) {
    const fallback = fileName === pageFile ? article?.thumbnail?.source : undefined
    const portrait = await portraitFromFile(fileName, fallback)
    if (portrait) return portrait
  }
  const qid = article?.pageprops?.wikibase_item
  const extra = qid ? await wikidataImage(qid) : null
  for (const fileName of uniqueFiles([extra])) {
    if (files.includes(fileName)) continue
    const portrait = await portraitFromFile(fileName)
    if (portrait) return portrait
  }
  return null
}
