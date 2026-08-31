import { useEffect, useState } from 'react'
import { REGIONS, STRINGS, modeLabel, regionLabel, type Lang } from '../i18n/strings'
import { GeoModeGrids } from './GeoModeGrids'
import { FootballModeGrids, isFootballCatalog } from './FootballModeGrids'
import { ChoiceLabel, FitText } from './FitText'
import {
  EASY_FOOTBALL_MIX_MODES,
  EASY_MIX_MODES,
  HARD_FOOTBALL_MIX_MODES,
  HARD_MIX_MODES,
  QUIZ_MODES,
  isFactsToName,
  isRegionSelected,
  orderedModes,
  sameModes,
  toggleRegion,
  type QuizMode,
  type RegionFilter,
} from '../lib/quiz'
import {
  FACTS_SERIES,
  type FactsDuelConfig,
  type FactsEnd,
  type FactsSeries,
} from '../lib/factsRules'
import type { Region } from '../data/countries'

interface DuelCreateModalProps {
  lang: Lang
  initialMode: QuizMode
  region: RegionFilter
  modeCatalog?: readonly QuizMode[]
  showMix?: boolean
  onCancel: () => void
  onConfirm: (modes: QuizMode[], facts?: FactsDuelConfig) => void
}

export function DuelCreateModal({
  lang,
  initialMode,
  region,
  modeCatalog = QUIZ_MODES,
  showMix = true,
  onCancel,
  onConfirm,
}: DuelCreateModalProps) {
  const t = STRINGS[lang]
  const [step, setStep] = useState<'modes' | 'facts'>('modes')
  const [selected, setSelected] = useState<QuizMode[]>(() => orderedModes([initialMode]))
  const [factsRegion, setFactsRegion] = useState<RegionFilter>(region)
  const [factsEnd, setFactsEnd] = useState<FactsEnd>('threeWrong')
  const [factsHardcore, setFactsHardcore] = useState(false)
  const [factsSeries, setFactsSeries] = useState<FactsSeries>(1)
  const regions: Array<Region | 'all'> = ['all', ...REGIONS]

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [onCancel])

  const modes = orderedModes(selected)
  const factsOnly = modes.length === 1 && isFactsToName(modes[0])
  const football = isFootballCatalog(modeCatalog)
  const easyMix = football ? sameModes(modes, EASY_FOOTBALL_MIX_MODES) : sameModes(modes, EASY_MIX_MODES)
  const hardMix = football ? sameModes(modes, HARD_FOOTBALL_MIX_MODES) : sameModes(modes, HARD_MIX_MODES)
  const mixButtons = showMix || football

  function toggleMode(mode: QuizMode) {
    setSelected((prev) => {
      if (isFactsToName(mode)) return prev.includes(mode) && prev.length === 1 ? prev : [mode]
      const withoutFacts = prev.filter((item) => !isFactsToName(item))
      if (withoutFacts.includes(mode)) {
        if (withoutFacts.length === 1) return withoutFacts
        return withoutFacts.filter((item) => item !== mode)
      }
      return [...withoutFacts, mode]
    })
  }

  function confirmModes() {
    if (factsOnly) {
      setStep('facts')
      return
    }
    onConfirm(modes)
  }

  return (
    <div className="passport-overlay" onClick={onCancel} role="presentation">
      <div
        className="passport-sheet duel-setup-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="duel-setup-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="btn-ghost passport-close" onClick={onCancel}>
          {t.close}
        </button>
        {step === 'modes' ? (
          <>
            <h2 id="duel-setup-title" className="passport-title">
              {t.duelPickModes}
            </h2>
            {mixButtons ? (
            <div className="choice-grid">
              <button
                type="button"
                className={`choice has-note is-wide ${easyMix ? 'is-active' : ''}`}
                aria-pressed={easyMix}
                onClick={() => setSelected(football ? [...EASY_FOOTBALL_MIX_MODES] : [...EASY_MIX_MODES])}
              >
                <FitText minPx={9}>{t.easyMix}</FitText>
                <FitText className="choice-note" wrap minPx={7}>
                  {football ? t.footballEasyMixNote : t.easyMixNote}
                </FitText>
              </button>
              <button
                type="button"
                className={`choice has-note is-wide ${hardMix ? 'is-active' : ''}`}
                aria-pressed={hardMix}
                onClick={() => setSelected(football ? [...HARD_FOOTBALL_MIX_MODES] : [...HARD_MIX_MODES])}
              >
                <FitText minPx={9}>{t.hardMix}</FitText>
                <FitText className="choice-note" wrap minPx={7}>
                  {football ? t.footballHardMixNote : t.hardMixNote}
                </FitText>
              </button>
            </div>
            ) : null}
            {showMix ? (
              <GeoModeGrids
                lang={lang}
                activeMode={selected[0] ?? 'flagToName'}
                selectedModes={selected}
                onPick={toggleMode}
              />
            ) : football ? (
              <FootballModeGrids
                lang={lang}
                activeMode={selected[0] ?? 'wcWinners'}
                selectedModes={selected}
                mix={modes.length > 1}
                onPick={toggleMode}
              />
            ) : (
            <div className="choice-grid is-modes">
              {modeCatalog.map((mode) => {
                const active = selected.includes(mode)
                return (
                  <button
                    key={mode}
                    type="button"
                    className={`choice ${active ? 'is-active' : ''}`}
                    aria-pressed={active}
                    onClick={() => toggleMode(mode)}
                  >
                    <ChoiceLabel>{modeLabel(mode, lang)}</ChoiceLabel>
                  </button>
                )
              })}
            </div>
            )}
            <button type="button" className="btn-primary" disabled={modes.length === 0} onClick={confirmModes}>
              {factsOnly ? t.duelFactsRules : t.duelCreate}
            </button>
          </>
        ) : (
          <>
            <h2 id="duel-setup-title" className="passport-title">
              {football ? t.duelFactsRules : t.duelFactsRegion}
            </h2>
            {football ? null : (
            <div className="choice-wrap">
              {regions.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`chip ${isRegionSelected(factsRegion, item) ? 'is-active' : ''}`}
                  aria-pressed={isRegionSelected(factsRegion, item)}
                  onClick={() => setFactsRegion(toggleRegion(factsRegion, item))}
                >
                  {regionLabel(item, lang)}
                </button>
              ))}
            </div>
            )}
            {football ? null : <h2>{t.duelFactsRules}</h2>}
            <div className="choice-grid">
              {(
                [
                  ['correct', t.duelFactsUntilCorrect, t.duelFactsUntilCorrectHint],
                  ['threeWrong', t.duelFactsThreeWrong, ''],
                  ['unlimited', t.duelFactsUnlimited, ''],
                  ['maxFive', t.duelFactsMaxFive, ''],
                ] as const
              ).map(([id, label, hint]) => (
                <button
                  key={id}
                  type="button"
                  className={`choice has-note is-wide ${factsEnd === id && !factsHardcore ? 'is-active' : ''}`}
                  aria-pressed={factsEnd === id && !factsHardcore}
                  onClick={() => {
                    setFactsHardcore(false)
                    setFactsEnd(id)
                  }}
                >
                  {label}
                  {hint ? <span className="choice-note">{hint}</span> : null}
                </button>
              ))}
              <button
                type="button"
                className={`choice has-note is-wide ${factsHardcore ? 'is-active' : ''}`}
                aria-pressed={factsHardcore}
                onClick={() => setFactsHardcore((prev) => !prev)}
              >
                {t.duelFactsHardcore}
                <span className="choice-note">{t.duelFactsHardcoreHint}</span>
              </button>
            </div>
            <h2>{football ? t.duelFactsSeriesPlayers : t.duelFactsSeries}</h2>
            <div className="choice-grid is-3">
              {FACTS_SERIES.map((series) => (
                <button
                  key={series}
                  type="button"
                  className={`choice ${factsSeries === series ? 'is-active' : ''}`}
                  aria-pressed={factsSeries === series}
                  onClick={() => setFactsSeries(series)}
                >
                  {series}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="btn-primary"
              onClick={() =>
                onConfirm([modes[0]], {
                  end: factsEnd,
                  hardcore: factsHardcore,
                  series: factsSeries,
                  region: football ? 'all' : factsRegion,
                })
              }
            >
              {t.duelCreate}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
