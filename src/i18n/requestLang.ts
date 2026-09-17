import { cookies, headers } from 'next/headers'
import { SITE_LANG_KEY, isLang, type Lang } from './lang'

export async function requestLang(): Promise<Lang> {
  const jar = await cookies()
  const fromCookie = jar.get(SITE_LANG_KEY)?.value
  if (isLang(fromCookie)) return fromCookie
  return langFromAccept((await headers()).get('accept-language') ?? '')
}

function langFromAccept(header: string): Lang {
  const ranked = header
    .split(',')
    .map((part) => {
      const [tagRaw, qRaw] = part.trim().split(';')
      const quality = qRaw?.trim().startsWith('q=') ? Number(qRaw.trim().slice(2)) : 1
      return { tag: (tagRaw ?? '').trim().toLowerCase(), quality: Number.isFinite(quality) ? quality : 0 }
    })
    .filter((item) => item.tag)
    .sort((a, b) => b.quality - a.quality)

  for (const { tag } of ranked) {
    if (isLang(tag)) return tag
    const short = tag.split('-')[0]
    if (isLang(short)) return short
  }
  return 'ru'
}
