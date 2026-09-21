import { STRINGS, type Lang } from '../i18n/strings'
import { FitText } from './FitText'

export function IntellectRankPlaque({
  level,
  lang,
  className,
}: {
  level: number
  lang: Lang
  className?: string
}) {
  const label = STRINGS[lang].intellectRank(level)
  return (
    <span className={['intellect-rank', className].filter(Boolean).join(' ')}>
      <FitText minPx={6}>{label}</FitText>
    </span>
  )
}
