'use client'

import { useEffect, useState } from 'react'
import { constantFactTexts, factText, pickFactIndex } from '../data/facts'
import type { CountryFact } from '../data/facts/types'
import { STRINGS, type Lang } from '../i18n/strings'

interface PassportRotatingFactProps {
  iso: string
  lang: Lang
  fallback: CountryFact
}

export function PassportRotatingFact({ iso, lang, fallback }: PassportRotatingFactProps) {
  const t = STRINGS[lang]
  const [text, setText] = useState<string | null>(null)
  const [extras, setExtras] = useState<string[]>([])

  useEffect(() => {
    const index = pickFactIndex(iso)
    setText(factText(iso, index, lang, fallback))
    setExtras(constantFactTexts(iso, lang, index, fallback))
  }, [iso, lang, fallback.en, fallback.ru])

  return (
    <>
      <p className="passport-fact">
        <span className="passport-fact-label">{t.fact}</span>
        {text ?? '\u00a0'}
      </p>
      {extras.length > 0 ? (
        <ul className="country-facts">
          {extras.map((fact) => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>
      ) : null}
    </>
  )
}
