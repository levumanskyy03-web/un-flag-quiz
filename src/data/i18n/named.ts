import type { Lang } from '../../i18n/lang'
import { pickText, type TextExtra } from '../../i18n/text11'

export function named(
  table: Record<string, Partial<TextExtra> | undefined>,
  id: string,
  lang: Lang,
  ru: string,
  en: string,
): string {
  return pickText(lang, ru, en, table[id])
}
