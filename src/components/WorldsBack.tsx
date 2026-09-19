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

export function StudioChromeNav({
  lang,
  onBack,
  onWorlds,
}: {
  lang: Lang
  onBack: () => void
  onWorlds: () => void
}) {
  const t = STRINGS[lang]
  return (
    <div className="pack-chrome-nav">
      <WorldsBack lang={lang} label={t.back} onClick={onBack} />
      <button type="button" className="btn-ghost pack-worlds-link" onClick={onWorlds}>
        {t.worldsBack}
      </button>
    </div>
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
