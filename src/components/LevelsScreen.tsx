'use client'

import { useEffect, useMemo, useState } from 'react'
import { LEVEL_NUMBERS, isFinalLevel } from '../data/levels'
import { STRINGS, modeLabel, type Lang } from '../i18n/strings'
import type { LevelClear } from '../lib/levelProgress'
import { findLevelClear, isLevelUnlocked } from '../lib/levelProgress'
import { fetchLevelBests, type LevelBest } from '../lib/leaderboard'
import { MAX_LIVES, LEVEL_MODES, campaignLevelCount, formatClock, hasGeoFinale, isLeadersMode, type QuizMode } from '../lib/quiz'
import type { QuizSettings } from './HomeScreen'
import { HubNav, type HubTab } from './HubNav'
import { isFootballCatalog } from './FootballModeGrids'
import { isMathCatalog } from './MathModeGrids'
import { isAstroCatalog } from './AstroModeGrids'
import { isThemeCatalog, themeCatalogWorld } from './ThemeModeGrids'
import { Lives } from './Lives'
import { WorldsBack } from './WorldsBack'
import { FitGroup } from './FitText'
import { EmpireLock } from './EmpireLock'
import { ModeArrowSelect } from './ModeArrowSelect'
import { useEmpire } from '../lib/empireStore'
import { access, type GateFeature } from '../lib/empire/gates'
import { worldOfMode } from '../lib/quiz'
import {
  astroModeLinks,
  footballModeLinks,
  geoModeLinks,
  leaderModeLinks,
  mathModeLinks,
  themeModeLinks,
  type ModeLink,
} from '../lib/modePairs'

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
  const links = useMemo(() => levelLinks(modes), [modes])
  const activeLink = links.find((link) => link.mode === settings.mode) ?? links[0]

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
    if (!activeLink || activeLink.mode === settings.mode) return
    onChange({ ...settings, path: 'levels', mode: activeLink.mode, mix: null })
  }, [activeLink, settings.mode])

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
        {activeLink ? (
          <ModeArrowSelect
            links={links}
            mode={activeLink.mode}
            lang={settings.lang}
            level={settings.level}
            hardcore={settings.levelHardcore}
            startLabel={t.levels}
            showHardcore={!settings.levelLearn}
            hardcoreGate={{ kind: 'levelHardcore' }}
            hardcoreTitle={t.gateLevelHardcore}
            formatSide={isLeadersMode(activeLink.mode) ? leaderSideLabel(settings.lang) : undefined}
            onMode={(mode) => onChange({ ...settings, path: 'levels', mix: null, mode })}
            onHardcore={(on) => onChange({ ...settings, path: 'levels', levelHardcore: on })}
            onStart={openLevels}
          />
        ) : null}

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

function levelLinks(modes: readonly QuizMode[]): ModeLink[] {
  const allowed = new Set(modes.filter((mode) => campaignLevelCount(mode) > 0))
  return linkSource(modes).filter((link) => allowed.has(link.mode))
}

function linkSource(modes: readonly QuizMode[]): ModeLink[] {
  if (isFootballCatalog(modes)) return footballModeLinks()
  if (isMathCatalog(modes)) return mathModeLinks()
  if (isAstroCatalog(modes)) return astroModeLinks()
  if (isThemeCatalog(modes)) {
    const world = themeCatalogWorld(modes)
    return world ? themeModeLinks(world) : []
  }
  if (modes.length > 0 && modes.every(isLeadersMode)) return leaderModeLinks()
  return geoModeLinks()
}

function leaderSideLabel(lang: Lang) {
  const t = STRINGS[lang]
  return (side: 'left' | 'right', id: string) => {
    if (side === 'right') {
      return id === 'photo' ? t.leaderAskPhoto : id === 'number' ? t.leaderAskNumber : t.leaderAskYears
    }
    return id === 'pope' ? t.popesLeaders : id === 'rus' ? t.askoldToUnion : id === 'uk' ? t.ukMonarchs : t.usPresidents
  }
}
