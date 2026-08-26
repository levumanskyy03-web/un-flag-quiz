import { useEffect, useState } from 'react'
import { REGIONS, STRINGS, modeLabel, regionLabel, type Lang } from '../i18n/strings'
import {
  EASY_MIX_MODES,
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
  onCancel: () => void
  onConfirm: (modes: QuizMode[], facts?: FactsDuelConfig) => void
}

export function DuelCreateModal({ lang, initialMode, region, onCancel, onConfirm }: DuelCreateModalProps) {
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
  const easyMix = sameModes(modes, EASY_MIX_MODES)
  const hardMix = sameModes(modes, HARD_MIX_MODES)

  function toggleMode(mode: QuizMode) {
    setSelected((prev) => {
      if (isFactsToName(mode)) return prev.includes(mode) && prev.length === 1 ? prev : ['factsToName']
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
            <p className="duel-setup-hint">{t.duelPickModesHint}</p>
            <div className="choice-grid">
              <button
                type="button"
                className={`choice has-note is-wide ${easyMix ? 'is-active' : ''}`}
                aria-pressed={easyMix}
                onClick={() => setSelected([...EASY_MIX_MODES])}
              >
                {t.easyMix}
                <span className="choice-note">{t.easyMixNote}</span>
              </button>
              <button
                type="button"
                className={`choice has-note is-wide ${hardMix ? 'is-active' : ''}`}
                aria-pressed={hardMix}
                onClick={() => setSelected([...HARD_MIX_MODES])}
              >
                {t.hardMix}
                <span className="choice-note">{t.hardMixNote}</span>
              </button>
            </div>
            <div className="choice-grid is-modes">
              {QUIZ_MODES.map((mode) => {
                const active = selected.includes(mode)
                return (
                  <button
                    key={mode}
                    type="button"
                    className={`choice ${active ? 'is-active' : ''}`}
                    aria-pressed={active}
                    onClick={() => toggleMode(mode)}
                  >
                    {modeLabel(mode, lang)}
                  </button>
                )
              })}
            </div>
            <button type="button" className="btn-primary" disabled={modes.length === 0} onClick={confirmModes}>
              {factsOnly ? t.duelFactsRegion : t.duelCreate}
            </button>
          </>
        ) : (
          <>
            <h2 id="duel-setup-title" className="passport-title">
              {t.duelFactsRegion}
            </h2>
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
            <h2>{t.duelFactsRules}</h2>
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
            <h2>{t.duelFactsSeries}</h2>
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
                onConfirm(['factsToName'], {
                  end: factsEnd,
                  hardcore: factsHardcore,
                  series: factsSeries,
                  region: factsRegion,
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
