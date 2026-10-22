"use client"

import { STRINGS, type Lang } from '../i18n/strings'
import { shareResultFile } from '../lib/shareCard'
import { useEmpire } from '../lib/empireStore'
import { EMPIRE_VISIBLE } from '../lib/empire/visible'
import { ShareButton } from './ShareButton'

interface ResultsShareShotProps {
  lang: Lang
  url: string
  theme: string
  score: string
  percent?: string
  time?: string
  headline: string
  success: boolean
}

export function ResultsShareShot({
  lang,
  url,
  theme,
  score,
  percent,
  time,
  headline,
  success,
}: ResultsShareShotProps) {
  const t = STRINGS[lang]
  const empire = useEmpire()
  const share = EMPIRE_VISIBLE ? empire.cosmetics.share : null
  const empireTitle = EMPIRE_VISIBLE ? empire.title : null
  const message = `${t.shareBetter}\n${url}`
  return (
    <ShareButton
      lang={lang}
      className={`results-shot ${success ? 'is-success' : 'is-fail'}${share ? ` share-theme-${share}` : ''}`}
      text={message}
      url={url}
      file={() =>
        shareResultFile({
          score,
          percent,
          theme,
          challenge: t.shareBetter,
          url,
          success,
        })
      }
    >
      {(copied: boolean) => (
        <>
          <span className="results-shot-polaroid" aria-hidden="true">
            <span className="results-shot-copy">
              <span className="score-kicker">{theme}</span>
              <span className="score-value">{score}</span>
              {percent ? <span className="score-percent">{percent}</span> : null}
              {time ? <span className="score-time">{time}</span> : null}
              <span className="score-headline">{headline}</span>
              {empireTitle ? <span className="results-shot-title">{t[`empireTitle_${empireTitle}`]}</span> : null}
            </span>
            <span className="results-shot-prompt">{copied ? t.shareCopied : t.shareTap}</span>
          </span>
        </>
      )}
    </ShareButton>
  )
}
