'use client'

import { useState } from 'react'
import { findCountry } from '../data/extras'
import { getPassport } from '../data/passports'
import { RANKING_MODES, rankingCite, type RankingMode } from '../data/rankings'
import { STRINGS, modeLabel, type Lang } from '../i18n/strings'
import { ChoiceLabel } from './FitText'
import { QUIZ_MODES, type QuizMode } from '../lib/quiz'
import { PassportModal } from './PassportModal'
import { RankingAboutDialog } from './RankingAboutDialog'

interface RankingFootnoteProps {
  mode: RankingMode
  lang: Lang
  onOpen?: () => void
}

export function RankingFootnote({ mode, lang, onOpen }: RankingFootnoteProps) {
  const t = STRINGS[lang]
  const cite = rankingCite(mode, lang)
  const text = `${t.rankingFootnote(cite.asOf, cite.source, cite.count)}${cite.note ? ` ${cite.note}` : ''}`
  if (onOpen) {
    return (
      <button type="button" className="ranking-footnote is-openable" onClick={onOpen}>
        <span className="passport-ranking-help ranking-footnote-help" aria-hidden="true">
          ?
        </span>
        {text}
      </button>
    )
  }
  return <p className="ranking-footnote">{text}</p>
}

interface GeoModeGridsProps {
  lang: Lang
  activeMode: QuizMode
  mix?: boolean
  onPick: (mode: QuizMode) => void
  selectedModes?: readonly QuizMode[]
  showRankings?: boolean
}

export function GeoModeGrids({
  lang,
  activeMode,
  mix = false,
  onPick,
  selectedModes,
  showRankings = true,
}: GeoModeGridsProps) {
  return (
    <>
      <ModeButtons
        lang={lang}
        modes={QUIZ_MODES}
        activeMode={activeMode}
        mix={mix}
        selectedModes={selectedModes}
        onPick={onPick}
      />
      {showRankings ? (
        <RankingModeGrid
          lang={lang}
          activeMode={activeMode}
          mix={mix}
          selectedModes={selectedModes}
          onPick={onPick}
        />
      ) : null}
    </>
  )
}

export function RankingModeGrid({
  lang,
  activeMode,
  mix = false,
  onPick,
  selectedModes,
  standalone = false,
}: GeoModeGridsProps & { standalone?: boolean }) {
  const t = STRINGS[lang]
  const rankingActive = !mix && RANKING_MODES.includes(activeMode as RankingMode)
  const [open, setOpen] = useState<RankingMode | null>(null)
  const [passportIso, setPassportIso] = useState<string | null>(null)
  const passportCountry = passportIso ? findCountry(passportIso) : undefined

  return (
    <div className={`ranking-modes${standalone ? ' is-standalone' : ''}`}>
      <h2>{t.rankings}</h2>
      <div className="choice-grid is-modes">
        {RANKING_MODES.map((mode) => {
          const active = selectedModes ? selectedModes.includes(mode) : !mix && activeMode === mode
          return (
            <div key={mode} className="ranking-choice-wrap">
              <button
                type="button"
                className={`choice ${active ? 'is-active' : ''}`}
                aria-pressed={active}
                onClick={() => {
                  onPick(mode)
                  if (!selectedModes) setOpen(mode)
                }}
              >
                <ChoiceLabel>{modeLabel(mode, lang)}</ChoiceLabel>
              </button>
              <button
                type="button"
                className="passport-ranking-help ranking-mode-help"
                aria-label={t.rankingHelp}
                aria-expanded={open === mode}
                onClick={() => setOpen(mode)}
              >
                ?
              </button>
            </div>
          )
        })}
      </div>
      {rankingActive ? (
        <RankingFootnote mode={activeMode as RankingMode} lang={lang} onOpen={() => setOpen(activeMode as RankingMode)} />
      ) : null}
      {open ? (
        <RankingAboutDialog
          mode={open}
          lang={lang}
          ignoreEscape={Boolean(passportIso)}
          onOpenCountry={setPassportIso}
          onClose={() => setOpen(null)}
        />
      ) : null}
      {passportCountry && getPassport(passportCountry.iso) ? (
        <PassportModal
          country={passportCountry}
          lang={lang}
          stacked
          onClose={() => setPassportIso(null)}
          onOpenCountry={setPassportIso}
        />
      ) : null}
    </div>
  )
}

function ModeButtons({
  lang,
  modes,
  activeMode,
  mix,
  selectedModes,
  onPick,
}: {
  lang: Lang
  modes: readonly QuizMode[]
  activeMode: QuizMode
  mix: boolean
  selectedModes?: readonly QuizMode[]
  onPick: (mode: QuizMode) => void
}) {
  return (
    <div className="choice-grid is-modes">
      {modes.map((mode) => {
        const active = selectedModes ? selectedModes.includes(mode) : !mix && activeMode === mode
        return (
          <button
            key={mode}
            type="button"
            className={`choice ${active ? 'is-active' : ''}`}
            aria-pressed={active}
            onClick={() => onPick(mode)}
          >
            <ChoiceLabel>{modeLabel(mode, lang)}</ChoiceLabel>
          </button>
        )
      })}
    </div>
  )
}
