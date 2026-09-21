'use client'

import { useState } from 'react'
import { findCountry } from '../data/extras'
import { getPassport } from '../data/passports'
import { RANKING_MODES, rankingCite, rankingUnit, type RankingMode } from '../data/rankings'
import { STRINGS, modeLabel, type Lang } from '../i18n/strings'
import { ChoiceLabel } from './FitText'
import { CODES_MODES, QUIZ_MODES, type QuizMode } from '../lib/quiz'
import { modeCatalogNo } from '../lib/modeCatalog'
import { CatalogNo, ModeChoice } from './ModeChoice'
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
  const text = `${t.rankingFootnote(cite.asOf, cite.source, cite.count)} ${rankingUnit(mode, lang)}${cite.note ? ` ${cite.note}` : ''}`
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
  hideModes?: readonly QuizMode[]
  showRankings?: boolean
  showCodes?: boolean
  hideHeading?: boolean
}

export function GeoModeGrids({
  lang,
  activeMode,
  mix = false,
  onPick,
  selectedModes,
  hideModes,
  showRankings = true,
  showCodes = true,
}: GeoModeGridsProps) {
  return (
    <>
      <ModeButtons
        lang={lang}
        modes={QUIZ_MODES}
        activeMode={activeMode}
        mix={mix}
        selectedModes={selectedModes}
        hideModes={hideModes}
        onPick={onPick}
      />
      {showCodes ? (
        <CodesModeGrid
          lang={lang}
          activeMode={activeMode}
          mix={mix}
          selectedModes={selectedModes}
          hideModes={hideModes}
          onPick={onPick}
        />
      ) : null}
      {showRankings ? (
        <RankingModeGrid
          lang={lang}
          activeMode={activeMode}
          mix={mix}
          selectedModes={selectedModes}
          hideModes={hideModes}
          onPick={onPick}
        />
      ) : null}
    </>
  )
}

export function CodesModeGrid({
  lang,
  activeMode,
  mix = false,
  onPick,
  selectedModes,
  standalone = false,
  hideHeading = false,
}: GeoModeGridsProps & { standalone?: boolean; hideHeading?: boolean }) {
  const t = STRINGS[lang]
  return (
    <div className={`ranking-modes${standalone || hideHeading ? ' is-standalone' : ''}`}>
      {hideHeading ? null : (
        <>
          <h2>{t.codes}</h2>
          <p className="setting-hint">{t.codesSubtitle}</p>
        </>
      )}
      <ModeButtons
        lang={lang}
        modes={CODES_MODES}
        activeMode={activeMode}
        mix={mix}
        selectedModes={selectedModes}
        onPick={onPick}
      />
    </div>
  )
}

export function RankingModeGrid({
  lang,
  activeMode,
  mix = false,
  onPick,
  selectedModes,
  standalone = false,
  hideHeading = false,
}: GeoModeGridsProps & { standalone?: boolean; hideHeading?: boolean }) {
  const t = STRINGS[lang]
  const [picked, setPicked] = useState<RankingMode | null>(() =>
    RANKING_MODES.includes(activeMode as RankingMode) ? (activeMode as RankingMode) : null,
  )
  const rankingActive = picked ?? (!mix && RANKING_MODES.includes(activeMode as RankingMode) ? (activeMode as RankingMode) : null)
  const [open, setOpen] = useState<RankingMode | null>(null)
  const [passportIso, setPassportIso] = useState<string | null>(null)
  const passportCountry = passportIso ? findCountry(passportIso) : undefined

  return (
    <div className={`ranking-modes${standalone || hideHeading ? ' is-standalone' : ''}`}>
      {hideHeading ? null : <h2>{t.rankings}</h2>}
      <div className="choice-grid is-modes">
        {RANKING_MODES.map((mode) => {
          const active = selectedModes
            ? selectedModes.includes(mode)
            : rankingActive === mode
          return (
            <div key={mode} className="ranking-choice-wrap">
              <button
                type="button"
                className={`choice has-mode-no ${active ? 'is-active' : ''}`}
                aria-pressed={active}
                onClick={() => {
                  onPick(mode)
                  if (!selectedModes) {
                    setPicked(mode)
                    setOpen(mode)
                  }
                }}
              >
                <CatalogNo n={modeCatalogNo(mode)} />
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
        <RankingFootnote mode={rankingActive} lang={lang} onOpen={() => setOpen(rankingActive)} />
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
  hideModes,
  onPick,
}: {
  lang: Lang
  modes: readonly QuizMode[]
  activeMode: QuizMode
  mix: boolean
  selectedModes?: readonly QuizMode[]
  hideModes?: readonly QuizMode[]
  onPick: (mode: QuizMode) => void
}) {
  const hidden = new Set(hideModes ?? [])
  return (
    <div className="choice-grid is-modes">
      {modes
        .filter((mode) => !hidden.has(mode))
        .map((mode) => {
        const active = selectedModes ? selectedModes.includes(mode) : !mix && activeMode === mode
        return (
          <ModeChoice
            key={mode}
            label={modeLabel(mode, lang)}
            mode={mode}
            active={active}
            onClick={() => onPick(mode)}
          />
        )
      })}
    </div>
  )
}
