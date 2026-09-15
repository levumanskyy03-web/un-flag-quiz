import { STRINGS, type Lang } from '../i18n/strings'

interface WorldsBackProps {
  lang: Lang
  onClick: () => void
  label?: string
}

export function WorldsBack({ lang, onClick, label }: WorldsBackProps) {
  return (
    <button type="button" className="btn-ghost worlds-back" onClick={onClick}>
      {label ?? STRINGS[lang].worldsBack}
    </button>
  )
}

export function WorldsBackLink({ lang }: { lang?: Lang }) {
  const t = STRINGS[lang ?? 'ru']
  return (
    <a className="btn-ghost worlds-back" href="/">
      {t.backToMenu}
    </a>
  )
}
