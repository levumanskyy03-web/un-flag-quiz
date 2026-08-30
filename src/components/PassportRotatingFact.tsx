'use client'

import { useEffect, useState } from 'react'
import { factText, pickFactIndex } from '../data/facts'
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

  useEffect(() => {
    setText(factText(iso, pickFactIndex(iso), lang, fallback))
  }, [iso, lang, fallback.en, fallback.ru])

  return (
    <p className="passport-fact">
      <span className="passport-fact-label">{t.fact}</span>
      {text ?? '\u00a0'}
    </p>
  )
}
