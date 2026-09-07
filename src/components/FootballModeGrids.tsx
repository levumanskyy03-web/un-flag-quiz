import { STRINGS, modeLabel, type Lang } from '../i18n/strings'
import { ModeChoice } from './ModeChoice'
import type { QuizSettings } from './HomeScreen'
import {
  CLUB_FOOTBALL_MODES,
  EURO_FOOTBALL_MODES,
  FOOTBALL_TOPICS,
  MANAGER_FOOTBALL_MODES,
  OTHER_FOOTBALL_MODES,
  PLAYER_FOOTBALL_MODES,
  WC_FOOTBALL_MODES,
  defaultFootballModeOf,
  footballModesOf,
  footballTopicOf,
  isFootballMode,
  type FootballTopic,
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

function topicLabel(topic: FootballTopic, lang: Lang) {
  const t = STRINGS[lang]
  if (topic === 'players') return t.footballGroupPlayers
  if (topic === 'managers') return t.footballGroupManagers
  if (topic === 'clubs') return t.footballGroupClubs
  return t.footballTopicCups
}

export function FootballSetup({
  settings,
  onChange,
  hideModes,
  campaignPercent,
}: {
  settings: QuizSettings
  onChange: (settings: QuizSettings) => void
  hideModes?: readonly QuizMode[]
  campaignPercent?: (mode: QuizMode) => number | null
}) {
  const t = STRINGS[settings.lang]
  const hidden = new Set(hideModes ?? [])
  const topic = footballTopicOf(settings.mode)
  const topicModes = footballModesOf(topic).filter((mode) => !hidden.has(mode))

  function pickTopic(next: FootballTopic) {
    const modes = footballModesOf(next).filter((mode) => !hidden.has(mode))
    const mode = (modes as readonly string[]).includes(settings.mode)
      ? settings.mode
      : (modes[0] ?? defaultFootballModeOf(next))
    onChange({ ...settings, mix: null, mode })
  }

  return (
    <>
      <h2>{t.leaderTopic}</h2>
      <div className="choice-grid is-4">
        {FOOTBALL_TOPICS.map((item) => (
          <ModeChoice
            key={item}
            label={topicLabel(item, settings.lang)}
            active={!settings.mix && topic === item}
            onClick={() => pickTopic(item)}
            percent={campaignPercent?.(defaultFootballModeOf(item))}
          />
        ))}
      </div>
      {topic === 'cups' ? (
        <FootballModeGrids
          lang={settings.lang}
          activeMode={settings.mode}
          onPick={(mode) => onChange({ ...settings, mix: null, mode })}
          hideModes={[...PLAYER_FOOTBALL_MODES, ...CLUB_FOOTBALL_MODES, ...MANAGER_FOOTBALL_MODES, ...(hideModes ?? [])]}
          campaignPercent={campaignPercent}
        />
      ) : (
        <>
          <h2>{t.mode}</h2>
          <div className="choice-grid is-modes">
            {topicModes.map((mode) => (
              <ModeChoice
                key={mode}
                label={modeLabel(mode, settings.lang)}
                active={settings.mode === mode}
                onClick={() => onChange({ ...settings, mix: null, mode })}
                percent={campaignPercent?.(mode)}
              />
            ))}
          </div>
        </>
      )}
    </>
  )
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
      <ModeGroup
        title={t.footballGroupClubs}
        modes={CLUB_FOOTBALL_MODES.filter((mode) => !hidden.has(mode))}
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
      <ModeGroup
        title={t.footballGroupManagers}
        modes={MANAGER_FOOTBALL_MODES.filter((mode) => !hidden.has(mode))}
        lang={lang}
        activeMode={activeMode}
        selectedModes={selectedModes}
        mix={mix}
        onPick={onPick}
        campaignPercent={campaignPercent}
      />
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
  if (modes.length === 0) return null
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
