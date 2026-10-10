import { useEffect, useRef, useState } from 'react'
import { STRINGS, type Lang } from '../i18n/strings'
import { worldCatalogNo } from '../lib/modeCatalog'
import { QUIZ_WORLDS, type QuizWorld } from '../lib/quiz'
import { useEmpire } from '../lib/empireStore'
import { eraTitle } from './EmpireScreen'
import type { QuizSettings } from './HomeScreen'
import { FitGroup, FitText } from './FitText'
import { SiteTour } from './SiteTour'
import { useSiteTourOpen } from '../lib/siteTour'
import { dailyCollection, loadDailyRecord, utcDayStamp } from '../lib/dailyChallenge'
import { collectionCopyOf } from '../i18n/collectionCopy'
import { tap } from '../lib/nativeFeel'
import { AUTH_EVENT, fetchAccount } from '../lib/account'
import { canPlayEtest } from '../lib/etestAccess'
import { isTrainingHidden, subscribeTrainingHidden } from '../lib/trainingTheme'

export type World = QuizWorld

interface WorldPickScreenProps {
  settings: QuizSettings
  onPick: (world: World) => void
  onMine: () => void
  onEtest: () => void
  onDaily: () => void
  onMultiplayer: () => void
  onFriend: () => void
  onProfile: () => void
  onStudio: () => void
  onEmpire: () => void
}

function worldTitle(world: QuizWorld, t: (typeof STRINGS)[Lang]) {
  if (world === 'geo') return t.geography
  if (world === 'leaders') return t.leaders
  if (world === 'football') return t.football
  if (world === 'olympics') return t.olympics
  if (world === 'biology') return t.biology
  if (world === 'math') return t.math
  if (world === 'astronomy') return t.astronomy
  if (world === 'cs') return t.cs
  if (world === 'physics') return t.physics
  return t.food
}

export function WorldPickScreen({
  settings,
  onPick,
  onMine,
  onEtest,
  onDaily,
  onMultiplayer,
  onFriend,
  onProfile,
}: WorldPickScreenProps) {
  const t = STRINGS[settings.lang]
  const [closedNote, setClosedNote] = useState(false)
  const [empireNote, setEmpireNote] = useState(false)
  const [etestOk, setEtestOk] = useState(false)
  const [hideTraining, setHideTraining] = useState(false)
  const noteTimer = useRef<number | null>(null)
  const empireTimer = useRef<number | null>(null)
  const empire = useEmpire()
  const empireLabel = empire.name || t.empire
  const showTour = useSiteTourOpen()
  const daily = dailyCollection()
  const dailyCopy = collectionCopyOf(daily.id, settings.lang)
  const [record, setRecord] = useState<ReturnType<typeof loadDailyRecord>>(null)
  useEffect(() => {
    setRecord(loadDailyRecord())
  }, [])
  useEffect(() => {
    const sync = () => {
      setHideTraining(isTrainingHidden())
      void fetchAccount().then((user) => setEtestOk(canPlayEtest(user?.name)))
    }
    sync()
    window.addEventListener(AUTH_EVENT, sync)
    const stopTraining = subscribeTrainingHidden(sync)
    return () => {
      window.removeEventListener(AUTH_EVENT, sync)
      stopTraining()
      if (noteTimer.current !== null) window.clearTimeout(noteTimer.current)
      if (empireTimer.current !== null) window.clearTimeout(empireTimer.current)
    }
  }, [])

  function showStudioClosed() {
    tap()
    setClosedNote(true)
    if (noteTimer.current !== null) window.clearTimeout(noteTimer.current)
    noteTimer.current = window.setTimeout(() => setClosedNote(false), 2200)
  }

  function showEmpireClosed() {
    tap()
    setEmpireNote(true)
    if (empireTimer.current !== null) window.clearTimeout(empireTimer.current)
    empireTimer.current = window.setTimeout(() => setEmpireNote(false), 2200)
  }

  function pick(fn: () => void) {
    tap()
    fn()
  }
  const done = Boolean(record && record.day === utcDayStamp() && record.id === daily.id && record.world === daily.world)

  return (
    <div className="screen world-pick-screen">
      <button type="button" className="world-pick is-daily" onClick={() => pick(onDaily)}>
        <span className="daily-kicker">{t.dailyChallenge}</span>
        <span className="daily-world">{worldTitle(daily.world, t)}</span>
        <span className="daily-title">{dailyCopy.title}</span>
        <span className="daily-meta">
          <span className="daily-play">
            {done && record ? t.dailyDone(record.correct, record.total) : t.dailyPlay}
          </span>
          {record && record.streak > 1 && record.day === utcDayStamp() ? (
            <span className="daily-streak">{t.dailyStreak(record.streak)}</span>
          ) : null}
        </span>
      </button>
      {hideTraining ? null : (
        <button type="button" className="world-pick is-mine" onClick={() => pick(onMine)}>
          <span className="world-pick-art" aria-hidden="true">
            <span className="world-mark" />
          </span>
          <span className="world-pick-copy">
            <FitText>{t.mine}</FitText>
          </span>
        </button>
      )}
      {etestOk ? (
        <button type="button" className="world-pick is-etest" onClick={() => pick(onEtest)}>
          <span className="world-pick-art" aria-hidden="true">
            <span className="world-mark" />
          </span>
          <span className="world-pick-copy">
            <FitText>{t.etest}</FitText>
          </span>
        </button>
      ) : null}
      <FitGroup wrap minPx={8}>
        <div className="world-pick-grid" data-tour="worlds">
          {QUIZ_WORLDS.map((world) => (
            <button
              key={world}
              type="button"
              className={`world-pick is-${world}`}
              data-tour={world === 'geo' ? 'geo' : undefined}
              onClick={() => pick(() => onPick(world))}
            >
              <span className="world-pick-no" aria-hidden="true">
                {worldCatalogNo(world)}
              </span>
              <span className="world-pick-art" aria-hidden="true">
                <span className="world-mark" />
              </span>
              <span className="world-pick-copy">
                <FitText>{worldTitle(world, t)}</FitText>
              </span>
            </button>
          ))}
        </div>
      </FitGroup>

      <button type="button" className="world-pick is-state is-empire is-closed" onClick={showEmpireClosed} data-tour="empire">
        <span className="world-pick-art" aria-hidden="true">
          <span className="world-mark" />
        </span>
        <span className="world-pick-copy">
          <FitText>{empireLabel}</FitText>
          <small className="world-pick-sub">
            {t.empireEraOf(empire.era)} · {eraTitle(empire.era, t)}
          </small>
        </span>
      </button>
      {empireNote ? (
        <p className="world-pick-note" role="status">
          {t.studioUnavailable}
        </p>
      ) : null}

      <nav className="world-pick-dock" aria-label={t.explore} data-tour="dock">
        <FitGroup wrap={false} minPx={7}>
          <button type="button" className="world-dock-tab is-closed" onClick={showStudioClosed}>
            <FitText>{t.studio}</FitText>
          </button>
          {closedNote ? (
            <p className="dock-unavailable" role="status">
              {t.studioUnavailable}
            </p>
          ) : null}
          <button type="button" className="world-dock-tab" onClick={() => pick(onMultiplayer)}>
            <FitText>{t.multiplayer}</FitText>
          </button>
          <button type="button" className="world-dock-tab" onClick={() => pick(onFriend)}>
            <FitText>{t.playWithFriend}</FitText>
          </button>
          <button type="button" className="world-dock-tab" onClick={() => pick(onProfile)}>
            <FitText>{t.profile}</FitText>
          </button>
        </FitGroup>
      </nav>
      {showTour ? <SiteTour lang={settings.lang} /> : null}
    </div>
  )
}
