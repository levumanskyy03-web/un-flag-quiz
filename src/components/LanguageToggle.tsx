import type { Lang } from '../i18n/strings'

interface LanguageToggleProps {
  lang: Lang
  onChange: (lang: Lang) => void
}

export function LanguageToggle({ lang, onChange }: LanguageToggleProps) {
  return (
    <div className="lang-toggle" role="group" aria-label="Language">
      <button
        type="button"
        className={lang === 'ru' ? 'is-active' : ''}
        aria-pressed={lang === 'ru'}
        onClick={() => onChange('ru')}
      >
        RU
      </button>
      <button
        type="button"
        className={lang === 'en' ? 'is-active' : ''}
        aria-pressed={lang === 'en'}
        onClick={() => onChange('en')}
      >
        EN
      </button>
    </div>
  )
}
