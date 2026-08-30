import { ALL_LEADER_TERMS } from '../data/leaders'

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
  ALL_LEADER_TERMS.map((term) => normalizeWikiTitle(term.wiki)).filter((title): title is string => Boolean(title)),
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
  return null
}

export function isCommonsUploadUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.hostname === 'upload.wikimedia.org' && parsed.pathname.includes('/wikipedia/commons/')
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

function buildCredits(author: string, license: string): { credit: string; compactCredit: string } {
  const who = author.replace(/\b(unknown author)+\b/gi, 'Unknown author').trim()
  const compactCredit = `${license} · Wikimedia Commons`
  const credit = who && !/^unknown author$/i.test(who) ? `${who} · ${compactCredit}` : compactCredit
  return { credit, compactCredit }
}

interface MediaWikiPage {
  missing?: boolean
  pageimage?: string
  thumbnail?: { source?: string }
  imageinfo?: Array<{
    thumburl?: string
    url?: string
    mediatype?: string
    extmetadata?: Record<string, unknown>
  }>
}

async function wikiJson(url: string): Promise<unknown> {
  const response = await fetch(url, {
    headers: { 'User-Agent': WIKI_UA, Accept: 'application/json' },
    next: { revalidate: 86_400 },
  })
  if (!response.ok) throw new Error('wiki')
  return response.json()
}

function firstPage(data: unknown): MediaWikiPage | null {
  if (!data || typeof data !== 'object') return null
  const query = (data as { query?: { pages?: unknown } }).query
  const pages = query?.pages
  if (!Array.isArray(pages) || pages.length === 0) return null
  const page = pages[0]
  return page && typeof page === 'object' ? (page as MediaWikiPage) : null
}

async function readFileInfo(fileName: string): Promise<MediaWikiPage['imageinfo']> {
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
  for (const origin of ['https://commons.wikimedia.org/w/api.php', 'https://en.wikipedia.org/w/api.php']) {
    const page = firstPage(await wikiJson(`${origin}?${params}`))
    if (page?.imageinfo?.[0]) return page.imageinfo
  }
  return undefined
}

export async function lookupWikiPortrait(title: string): Promise<WikiPortrait | null> {
  const normalized = normalizeWikiTitle(title)
  if (!normalized || !ALLOWED_TITLES.has(normalized)) return null

  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    formatversion: '2',
    redirects: '1',
    titles: normalized,
    prop: 'pageimages',
    piprop: 'name|thumbnail',
    pithumbsize: String(THUMB_WIDTH),
  })
  const article = firstPage(await wikiJson(`https://en.wikipedia.org/w/api.php?${params}`))
  const fileName = article?.pageimage?.replace(/ /g, '_')
  if (!fileName) return null

  const info = (await readFileInfo(fileName))?.[0]
  if (!info) return null
  const media = (info.mediatype ?? '').toUpperCase()
  if (media && media !== 'BITMAP' && media !== 'DRAWING') return null

  const url = info.thumburl || info.url || article?.thumbnail?.source
  if (!url || !isCommonsUploadUrl(url)) return null

  const meta = info.extmetadata
  const shortName = metaValue(meta, 'LicenseShortName')
  const licenseUrl = metaValue(meta, 'LicenseUrl')
  const copyrighted = metaValue(meta, 'Copyrighted')
  const kind = classifyLicense(shortName, licenseUrl, copyrighted)
  if (!kind) return null

  const license = licenseLabel(kind, shortName)
  const author = stripMarkup(metaValue(meta, 'Artist'))
  const { credit, compactCredit } = buildCredits(author, license)
  return {
    url: cleanThumbUrl(url),
    credit,
    compactCredit,
    filePage: commonsFilePage(fileName.replace(/_/g, ' ')),
    license,
  }
}
