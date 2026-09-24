'use client'

import { useEffect, useState } from 'react'
import { LEVEL_NUMBERS, isFinalLevel } from '../data/levels'
import { STRINGS, modeLabel } from '../i18n/strings'
import type { LevelClear } from '../lib/levelProgress'
import { findLevelClear, isLevelUnlocked } from '../lib/levelProgress'
import { fetchLevelBests, type LevelBest } from '../lib/leaderboard'
import { MAX_LIVES, ASTRO_MODES, LEVEL_MODES, MATH_MODES, THEME_DEFAULT_MODE, astroHasCampaign, formatClock, hasGeoFinale, isLeadersMode, isThemeMode, mathHasCampaign, themeHasCampaign, themeModesOfWorld, themeWorldOf, type QuizMode } from '../lib/quiz'
import type { QuizSettings } from './HomeScreen'
import { HubNav, type HubTab } from './HubNav'
import { FootballSetup, isFootballCatalog } from './FootballModeGrids'
import { MathSetup, isMathCatalog } from './MathModeGrids'
import { AstroSetup, isAstroCatalog } from './AstroModeGrids'
import { ThemeSetup, isThemeCatalog, themeCatalogWorld } from './ThemeModeGrids'
import { modeCampaignPercent } from '../lib/campaignPercent'
import { LeadersSetup } from './LeadersScreen'
import { ModeChoice } from './ModeChoice'
import { HardcoreToggle } from './DifficultyPicker'
import { Lives } from './Lives'
import { WorldsBack } from './WorldsBack'
import { FitGroup } from './FitText'
import { EmpireLock } from './EmpireLock'
import { useEmpire } from '../lib/empireStore'
import { access, type GateFeature } from '../lib/empire/gates'
import { worldOfMode } from '../lib/quiz'

interface LevelsScreenProps {
  settings: QuizSettings
  levelClears: LevelClear[]
  modes?: readonly QuizMode[]
  levels?: readonly number[]
  tabs?: HubTab[]
  onChange: (settings: QuizSettings) => void
  onPlay: (level: number) => void
  onHub: (tab: HubTab) => void
  onWorlds: () => void
}

export function LevelsScreen({
  settings,
  levelClears,
  modes = LEVEL_MODES,
  levels = LEVEL_NUMBERS,
  tabs,
  onChange,
  onPlay,
  onHub,
  onWorlds,
}: LevelsScreenProps) {
  const t = STRINGS[settings.lang]
  const [worldBests, setWorldBests] = useState<Record<number, LevelBest>>({})
  const [levelsOpen, setLevelsOpen] = useState(false)
  const [picked, setPicked] = useState<number | null>(null)

  useEffect(() => {
    setPicked(null)
    let cancelled = false
    void fetchLevelBests(settings.mode, settings.levelHardcore).then((records) => {
      if (!cancelled) setWorldBests(records)
    })
    return () => {
      cancelled = true
    }
  }, [settings.mode, settings.levelHardcore])

  useEffect(() => {
    if (!isFootballCatalog(modes) || settings.mode !== 'playerFactsToName') return
    onChange({ ...settings, path: 'levels', mode: 'playerPhotoToName', mix: null })
  }, [modes, settings.mode])

  useEffect(() => {
    if (!isMathCatalog(modes) || mathHasCampaign(settings.mode)) return
    onChange({ ...settings, path: 'levels', mode: 'exprToValue', mix: null })
  }, [modes, settings.mode])

  useEffect(() => {
    if (!isAstroCatalog(modes) || astroHasCampaign(settings.mode)) return
    onChange({ ...settings, path: 'levels', mode: 'planetToOrder', mix: null })
  }, [modes, settings.mode])

  useEffect(() => {
    if (!isThemeCatalog(modes) || themeHasCampaign(settings.mode)) return
    const world = themeCatalogWorld(modes) ?? (isThemeMode(settings.mode) ? themeWorldOf(settings.mode) : 'biology')
    onChange({ ...settings, path: 'levels', mode: THEME_DEFAULT_MODE[world], mix: null })
  }, [modes, settings.mode])

  useEffect(() => {
    if (!levelsOpen) return
    function onKey(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      if (picked !== null) setPicked(null)
      else setLevelsOpen(false)
    }
    window.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [levelsOpen, picked])

  function openLevels() {
    setPicked(null)
    setLevelsOpen(true)
  }

  function closeLevels() {
    setPicked(null)
    setLevelsOpen(false)
  }

  const pickedBest = picked !== null ? worldBests[picked] : undefined
  const pickedClear = picked !== null ? findLevelClear(levelClears, picked, settings.mode) : undefined
  const pickedUnlocked = picked !== null ? isLevelUnlocked(levelClears, picked, settings.mode) : false
  const empire = useEmpire()
  const levelWorld = worldOfMode(settings.mode)
  const levelGate = (level: number): GateFeature | null => {
    if (settings.levelLearn) return null
    if (settings.levelHardcore && access(empire, { kind: 'levelHardcore' }) === 'locked') return { kind: 'levelHardcore' }
    const feature: GateFeature = { kind: 'levels', world: levelWorld, level }
    return access(empire, feature) === 'locked' ? feature : null
  }
  const pickedGate = picked !== null ? levelGate(picked) : null
  const canStart = picked !== null && (settings.levelLearn || pickedUnlocked) && pickedGate === null

  return (
    <div className="screen levels-screen">
      <WorldsBack lang={settings.lang} onClick={onWorlds} />
      <header className="quiz-header is-hub">
        <HubNav lang={settings.lang} active="levels" tabs={tabs} onSelect={onHub} />
      </header>

      <section className="card settings-card">
        {isLeadersMode(settings.mode) ? (
          <LeadersSetup
            settings={settings}
            onChange={(next) => onChange({ ...next, path: 'levels', mix: null })}
            campaignPercent={(mode) => modeCampaignPercent(levelClears, mode)}
            onPickMode={openLevels}
          />
        ) : isFootballCatalog(modes) ? (
          <FootballSetup
            settings={settings}
            onChange={(next) => onChange({ ...next, path: 'levels', mix: null })}
            hideModes={['playerFactsToName']}
            campaignPercent={(mode) => modeCampaignPercent(levelClears, mode)}
            onPickMode={openLevels}
          />
        ) : isMathCatalog(modes) ? (
          <MathSetup
            settings={settings}
            onChange={(next) => onChange({ ...next, path: 'levels', mix: null })}
            hideModes={MATH_MODES.filter((mode) => !mathHasCampaign(mode))}
            onPickMode={openLevels}
          />
        ) : isAstroCatalog(modes) ? (
          <AstroSetup
            settings={settings}
            onChange={(next) => onChange({ ...next, path: 'levels', mix: null })}
            hideModes={ASTRO_MODES.filter((mode) => !astroHasCampaign(mode))}
            onPickMode={openLevels}
          />
        ) : isThemeCatalog(modes) ? (
          <ThemeSetup
            world={themeCatalogWorld(modes) ?? 'biology'}
            settings={settings}
            onChange={(next) => onChange({ ...next, path: 'levels', mix: null })}
            hideModes={themeModesOfWorld(themeCatalogWorld(modes) ?? 'biology').filter((mode) => !themeHasCampaign(mode))}
            onPickMode={openLevels}
          />
        ) : (
          <div className="choice-grid is-modes">
            {modes.map((mode) => (
              <ModeChoice
                key={mode}
                label={modeLabel(mode, settings.lang)}
                mode={mode}
                active={settings.mode === mode}
                onClick={() => {
                  onChange({ ...settings, path: 'levels', mode })
                  openLevels()
                }}
                percent={modeCampaignPercent(levelClears, mode)}
              />
            ))}
          </div>
        )}

        {settings.levelLearn ? null : (
          <div className="levels-hardcore-row">
            <HardcoreToggle
              lang={settings.lang}
              on={settings.levelHardcore}
              onChange={(on) => onChange({ ...settings, path: 'levels', levelHardcore: on })}
            />
          </div>
        )}

        <div className="levels-extra-row">
          <button
            type="button"
            className={`choice ${settings.levelLearn ? 'is-active' : ''}`}
            aria-pressed={settings.levelLearn}
            onClick={() => onChange({ ...settings, path: 'levels', levelLearn: !settings.levelLearn })}
          >
            {t.learn}
          </button>
        </div>
      </section>

      {levelsOpen ? (
        <div
          className="passport-overlay mode-setup-overlay"
          onClick={closeLevels}
          role="presentation"
        >
          <div
            className="passport-sheet duel-setup-sheet mode-setup-sheet level-pick-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="level-pick-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" className="btn-ghost passport-close" onClick={closeLevels}>
              {t.close}
            </button>
            <h2 id="level-pick-title" className="passport-title">
              {modeLabel(settings.mode, settings.lang)}
            </h2>
            <p className="duel-setup-hint">{t.levels}</p>
            <FitGroup minPx={6} wrap={false}>
              <div className="choice-grid is-levels">
                {levels.map((level) => {
                  const cleared = findLevelClear(levelClears, level, settings.mode)
                  const unlocked = isLevelUnlocked(levelClears, level, settings.mode)
                  const canOpen = (settings.levelLearn || unlocked) && levelGate(level) === null
                  const livesLimit = cleared ? cleared.livesLimit ?? (cleared.hardcore ? 1 : MAX_LIVES) : MAX_LIVES
                  return (
                    <button
                      key={level}
                      type="button"
                      className={`choice level-choice${cleared?.hardcore ? ' is-gold' : cleared ? ' is-cleared' : ''}${
                        canOpen ? '' : ' is-locked'
                      }${picked === level ? ' is-picked' : ''}`}
                      onClick={() => setPicked(level)}
                    >
                      <span className="level-number">{level}</span>
                      {cleared ? (
                        <span className="level-meta">
                          {!cleared.hardcore && livesLimit <= MAX_LIVES && (
                            <Lives
                              filled={cleared.livesLeft}
                              total={livesLimit}
                              gold={cleared.livesLeft === livesLimit}
                              size="sm"
                            />
                          )}
                          {isFinalLevel(level) && livesLimit > MAX_LIVES ? `${cleared.livesLeft}/${livesLimit} · ` : ''}
                          {formatClock(cleared.roundMs)}
                        </span>
                      ) : isFinalLevel(level) && hasGeoFinale(settings.mode) ? (
                        <span className="level-meta">193</span>
                      ) : null}
                    </button>
                  )
                })}
              </div>
            </FitGroup>
          </div>
        </div>
      ) : null}

      {levelsOpen && picked !== null ? (
        <div
          className="passport-overlay mode-setup-overlay level-start-overlay"
          onClick={() => setPicked(null)}
          role="presentation"
        >
          <div
            className="passport-sheet duel-setup-sheet mode-setup-sheet level-start-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="level-start-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" className="btn-ghost passport-close" onClick={() => setPicked(null)}>
              {t.close}
            </button>
            <h2 id="level-start-title" className="passport-title">
              {t.levelLabel(picked)}
            </h2>
            <p className="duel-setup-hint">{modeLabel(settings.mode, settings.lang)}</p>
            {pickedClear ? (
              <p className="levels-world-best">
                {formatClock(pickedClear.roundMs)}
              </p>
            ) : null}
            {pickedBest ? (
              <p className="levels-world-best" aria-live="polite">
                <span className="levels-world-best-label">{t.worldRecord}</span>
                {t.worldRecordLine(pickedBest.name, formatClock(pickedBest.roundMs))}
              </p>
            ) : null}
            {pickedGate ? (
              <EmpireLock
                lang={settings.lang}
                feature={pickedGate}
                title={pickedGate.kind === 'levelHardcore' ? t.gateLevelHardcore : t.gateLevels}
                compact
              />
            ) : null}
            <button
              type="button"
              className="btn-primary"
              disabled={!canStart}
              onClick={() => {
                if (!canStart) return
                onPlay(picked)
              }}
            >
              {t.start}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
