import { RANKING_MODES, rankingCite, type RankingMode } from '../data/rankings'
import { STRINGS, modeLabel, type Lang } from '../i18n/strings'
import { QUIZ_MODES, type QuizMode } from '../lib/quiz'

interface RankingFootnoteProps {
  mode: RankingMode
  lang: Lang
}

export function RankingFootnote({ mode, lang }: RankingFootnoteProps) {
  const t = STRINGS[lang]
  const cite = rankingCite(mode, lang)
  return (
    <p className="ranking-footnote">
      {t.rankingFootnote(cite.asOf, cite.source, cite.count)}
      {cite.note ? ` ${cite.note}` : ''}
    </p>
  )
}

interface GeoModeGridsProps {
  lang: Lang
  activeMode: QuizMode
  mix?: boolean
  onPick: (mode: QuizMode) => void
  selectedModes?: readonly QuizMode[]
}

export function GeoModeGrids({ lang, activeMode, mix = false, onPick, selectedModes }: GeoModeGridsProps) {
  const t = STRINGS[lang]
  const rankingActive = !mix && RANKING_MODES.includes(activeMode as RankingMode)

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
      <div className="ranking-modes">
        <h2>{t.rankings}</h2>
        <ModeButtons
          lang={lang}
          modes={RANKING_MODES}
          activeMode={activeMode}
          mix={mix}
          selectedModes={selectedModes}
          onPick={onPick}
        />
        {rankingActive ? <RankingFootnote mode={activeMode as RankingMode} lang={lang} /> : null}
      </div>
    </>
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
            {modeLabel(mode, lang)}
          </button>
        )
      })}
    </div>
  )
}
