import { STRINGS, modeLabel, type Lang } from '../i18n/strings'
import { ModeChoice } from './ModeChoice'
import {
  EURO_FOOTBALL_MODES,
  OTHER_FOOTBALL_MODES,
  PLAYER_FOOTBALL_MODES,
  WC_FOOTBALL_MODES,
  isFootballMode,
  type QuizMode,
} from '../lib/quiz'

interface FootballModeGridsProps {
  lang: Lang
  activeMode: QuizMode
  onPick: (mode: QuizMode) => void
  selectedModes?: readonly QuizMode[]
  mix?: boolean
  hideModes?: readonly QuizMode[]
  campaignPercent?: (mode: QuizMode) => number | null
}

export function isFootballCatalog(modes: readonly QuizMode[]): boolean {
  return modes.length > 0 && modes.every(isFootballMode)
}

export function FootballModeGrids({
  lang,
  activeMode,
  onPick,
  selectedModes,
  mix = false,
  hideModes,
  campaignPercent,
}: FootballModeGridsProps) {
  const t = STRINGS[lang]
  const hidden = new Set(hideModes ?? [])
  const players = PLAYER_FOOTBALL_MODES.filter((mode) => !hidden.has(mode))
  return (
    <div className="football-mode-groups">
      <ModeGroup
        title={t.footballGroupWc}
        modes={WC_FOOTBALL_MODES.filter((mode) => !hidden.has(mode))}
        lang={lang}
        activeMode={activeMode}
        selectedModes={selectedModes}
        mix={mix}
        onPick={onPick}
        campaignPercent={campaignPercent}
      />
      <ModeGroup
        title={t.footballGroupEuro}
        modes={EURO_FOOTBALL_MODES.filter((mode) => !hidden.has(mode))}
        lang={lang}
        activeMode={activeMode}
        selectedModes={selectedModes}
        mix={mix}
        onPick={onPick}
        campaignPercent={campaignPercent}
      />
      <ModeGroup
        title={t.footballGroupOther}
        modes={OTHER_FOOTBALL_MODES.filter((mode) => !hidden.has(mode))}
        lang={lang}
        activeMode={activeMode}
        selectedModes={selectedModes}
        mix={mix}
        onPick={onPick}
        campaignPercent={campaignPercent}
      />
      {players.length > 0 ? (
        <ModeGroup
          title={t.footballGroupPlayers}
          modes={players}
          lang={lang}
          activeMode={activeMode}
          selectedModes={selectedModes}
          mix={mix}
          onPick={onPick}
          campaignPercent={campaignPercent}
        />
      ) : null}
    </div>
  )
}

function ModeGroup({
  title,
  modes,
  lang,
  activeMode,
  selectedModes,
  mix,
  onPick,
  campaignPercent,
}: {
  title: string
  modes: readonly QuizMode[]
  lang: Lang
  activeMode: QuizMode
  selectedModes?: readonly QuizMode[]
  mix: boolean
  onPick: (mode: QuizMode) => void
  campaignPercent?: (mode: QuizMode) => number | null
}) {
  return (
    <div className="football-mode-group">
      <h2>{title}</h2>
      <div className="choice-grid is-modes">
        {modes.map((mode) => {
          const active = selectedModes ? selectedModes.includes(mode) : !mix && activeMode === mode
          return (
            <ModeChoice
              key={mode}
              label={modeLabel(mode, lang)}
              active={active}
              onClick={() => onPick(mode)}
              percent={campaignPercent?.(mode)}
            />
          )
        })}
      </div>
    </div>
  )
}
