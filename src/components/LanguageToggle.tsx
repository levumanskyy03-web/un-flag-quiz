import { LANGS, LANG_NATIVE, type Lang } from '../i18n/lang'
import { STRINGS } from '../i18n/strings'

interface LanguageToggleProps {
  lang: Lang
  onChange: (lang: Lang) => void
}

export function LanguageToggle({ lang, onChange }: LanguageToggleProps) {
  const t = STRINGS[lang]
  return (
    <label className="lang-toggle lang-select-wrap">
      <span className="visually-hidden">{t.profileLanguage}</span>
      <select
        className="lang-select"
        value={lang}
        aria-label={t.profileLanguage}
        onChange={(event) => onChange(event.target.value as Lang)}
      >
        {LANGS.map((code) => (
          <option key={code} value={code}>
            {LANG_NATIVE[code]}
          </option>
        ))}
      </select>
      <span className="lang-select-mark" aria-hidden="true">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M2.5 4.25 6 7.75l3.5-3.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </label>
  )
}
