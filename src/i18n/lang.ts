export const LANGS = ['ru', 'en', 'de', 'zh', 'es', 'hi', 'ar', 'bn', 'pt', 'ja', 'he'] as const
export type Lang = (typeof LANGS)[number]

const RTL_LANGS = new Set<Lang>(['ar', 'he'])

export const LANG_NATIVE: Record<Lang, string> = {
  ru: 'Русский',
  en: 'English',
  de: 'Deutsch',
  zh: '中文',
  es: 'Español',
  hi: 'हिन्दी',
  ar: 'العربية',
  bn: 'বাংলা',
  pt: 'Português',
  ja: '日本語',
  he: 'עברית',
}

export const LANG_SHORT: Record<Lang, string> = {
  ru: 'RU',
  en: 'EN',
  de: 'DE',
  zh: '中文',
  es: 'ES',
  hi: 'HI',
  ar: 'عر',
  bn: 'বাং',
  pt: 'PT',
  ja: '日本',
  he: 'עב',
}

const LOCALES: Record<Lang, string> = {
  ru: 'ru-RU',
  en: 'en-GB',
  de: 'de-DE',
  zh: 'zh-CN',
  es: 'es',
  hi: 'hi-IN',
  ar: 'ar',
  bn: 'bn-BD',
  pt: 'pt-BR',
  ja: 'ja-JP',
  he: 'he-IL',
}

export function isLang(value: unknown): value is Lang {
  return typeof value === 'string' && (LANGS as readonly string[]).includes(value)
}

export function isRtl(lang: Lang): boolean {
  return RTL_LANGS.has(lang)
}

export function localeTag(lang: Lang): string {
  return LOCALES[lang]
}

export function langDir(lang: Lang): 'rtl' | 'ltr' {
  return isRtl(lang) ? 'rtl' : 'ltr'
}
