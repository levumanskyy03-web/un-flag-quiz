'use client'

import { useEffect, useState } from 'react'
import { collectionsOf, collectionPath, type Collection } from '../data/collections'
import { STRINGS, type Lang } from '../i18n/strings'
import { collectionCopyOf } from '../i18n/collectionCopy'
import {
  dailyCollection,
  dailyCollectionOf,
  loadDailyRecord,
  utcDayStamp,
} from '../lib/dailyChallenge'
import type { QuizWorld } from '../lib/quiz'
import { HubNav, type HubTab } from './HubNav'
import { WorldsBack } from './WorldsBack'
import { GeoIcon } from './GeoIcon'
import { FitText } from './FitText'
import type { QuizSettings } from './HomeScreen'
import { EmpireLock } from './EmpireLock'
import { useEmpire } from '../lib/empireStore'
import { access, listGateOf } from '../lib/empire/gates'

interface CollectionsScreenProps {
  world: QuizWorld
  settings: QuizSettings
  tabs?: HubTab[]
  onHub: (tab: HubTab) => void
  onWorlds: () => void
  onPlay: (collection: Collection, path: 'list' | 'daily') => void
}

const WORLD_ICON = {
  geo: 'globe',
  leaders: 'laurel',
  football: 'ball',
  olympics: 'torch',
  biology: 'leaf',
  math: 'sigma',
  astronomy: 'orbit',
  cs: 'code',
  food: 'bowl',
} as const

function worldTitle(world: QuizWorld, t: (typeof STRINGS)[Lang]) {
  if (world === 'geo') return t.geography
  if (world === 'leaders') return t.leaders
  if (world === 'football') return t.football
  if (world === 'olympics') return t.olympics
  if (world === 'biology') return t.biology
  if (world === 'math') return t.math
  if (world === 'astronomy') return t.astronomy
  if (world === 'cs') return t.cs
  return t.food
}

export function CollectionsScreen({
  world,
  settings,
  tabs,
  onHub,
  onWorlds,
  onPlay,
}: CollectionsScreenProps) {
  const t = STRINGS[settings.lang]
  const lists = collectionsOf(world)
  const empire = useEmpire()
  const daily = dailyCollection()
  const themeDaily = dailyCollectionOf(world)
  const dailyCopy = collectionCopyOf(daily.id, settings.lang)
  const themeCopy = themeDaily ? collectionCopyOf(themeDaily.id, settings.lang) : null
  const [record, setRecord] = useState<ReturnType<typeof loadDailyRecord>>(null)

  useEffect(() => {
    setRecord(loadDailyRecord())
  }, [])

  const done = Boolean(
    record && record.day === utcDayStamp() && record.id === daily.id && record.world === daily.world,
  )
  const showTheme =
    themeDaily && !(themeDaily.id === daily.id && themeDaily.world === daily.world)

  return (
    <div className="screen collections-screen">
      <WorldsBack lang={settings.lang} onClick={onWorlds} />
      <header className="quiz-header is-hub">
        <HubNav lang={settings.lang} active="lists" tabs={tabs} onSelect={onHub} />
      </header>
      <p className="setting-hint">{t.collectionsHint}</p>

      <button
        type="button"
        className={`collections-hero is-${daily.world}`}
        onClick={() => onPlay(daily, 'daily')}
      >
        <span className="collections-hero-kicker">
          <GeoIcon name="trophy" size={16} />
          {t.dailyChallenge}
        </span>
        <span className="collections-hero-world">{worldTitle(daily.world, t)}</span>
        <span className="collections-hero-title">
          <FitText>{dailyCopy.title}</FitText>
        </span>
        <span className="collections-hero-meta">
          {done && record ? t.dailyDone(record.correct, record.total) : t.dailyPlay}
          {record && record.streak > 1 && record.day === utcDayStamp()
            ? ` · ${t.dailyStreak(record.streak)}`
            : ''}
        </span>
      </button>

      {showTheme && themeDaily && themeCopy ? (
        <button
          type="button"
          className={`collections-hero is-theme is-${world}`}
          onClick={() => onPlay(themeDaily, 'list')}
        >
          <span className="collections-hero-kicker">
            <GeoIcon name={WORLD_ICON[world]} size={16} />
            {t.themeChallenge}
          </span>
          <span className="collections-hero-title">
            <FitText>{themeCopy.title}</FitText>
          </span>
          <span className="collections-hero-meta">{t.dailyPlay}</span>
        </button>
      ) : null}

      <h2 className="collections-heading">{t.collectionsChallenges}</h2>
      <ul className="collections-grid">
        {lists.map((item) => {
          const copy = collectionCopyOf(item.id, settings.lang)
          const isDaily = item.id === daily.id && item.world === daily.world
          const isTheme = Boolean(showTheme && themeDaily && item.id === themeDaily.id)
          const gate = isDaily ? null : listGateOf(world, item.id)
          const locked = gate !== null && access(empire, gate) === 'locked'
          return (
            <li key={item.id}>
              <button
                type="button"
                className={`collections-card is-${world}${isDaily ? ' is-daily' : ''}${isTheme ? ' is-theme' : ''}${locked ? ' is-locked' : ''}`}
                aria-disabled={locked}
                onClick={() => (locked ? undefined : onPlay(item, isDaily ? 'daily' : 'list'))}
              >
                {locked ? <span className="collections-badge is-lock">{t.gateLocked}</span> : null}
                <span className="collections-card-art" aria-hidden="true">
                  <GeoIcon name={WORLD_ICON[world]} size={22} />
                </span>
                {isDaily ? <span className="collections-badge">{t.dailyChallenge}</span> : null}
                {isTheme && !isDaily ? <span className="collections-badge">{t.themeChallenge}</span> : null}
                <span className="collections-card-title">
                  <FitText>{copy.title}</FitText>
                </span>
                <span className="collections-card-meta">{t.collectionItems(item.ids.length)}</span>
              </button>
              <a className="collections-page" href={collectionPath(world, item.id)}>
                {t.collectionOpen}
              </a>
              {locked && gate ? <EmpireLock lang={settings.lang} feature={gate} title={t.gateList} compact /> : null}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
