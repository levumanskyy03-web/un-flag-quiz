import { isLang, type Lang } from './lang'

export type Text11 = Record<Lang, string>
export type TextExtra = Omit<Text11, 'en' | 'ru'>

export function pickText(
  lang: Lang,
  ru: string,
  en: string,
  extra?: Partial<TextExtra> | null,
): string {
  if (lang === 'ru') return ru
  if (lang === 'en') return en
  const value = extra?.[lang]
  return value?.trim() ? value : en
}

export function pickRow(row: Partial<Text11> | undefined, lang: Lang, fallback = ''): string {
  if (!row) return fallback
  const key = isLang(lang) ? lang : 'en'
  return row[key]?.trim() || row.en?.trim() || fallback
}
